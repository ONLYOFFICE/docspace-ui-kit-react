/*
 * Copyright (C) Ascensio System SIA, 2009-2026
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation, together with the
 * additional terms provided in the LICENSE file.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For
 * details, see the GNU AGPL at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA by email at info@onlyoffice.com
 * or by postal mail at 20A-6 Ernesta Birznieka-Upisha Street, Riga,
 * LV-1050, Latvia, European Union.
 *
 * The interactive user interfaces in modified versions of the Program
 * are required to display Appropriate Legal Notices in accordance with
 * Section 5 of the GNU AGPL version 3.
 *
 * No trademark rights are granted under this License.
 *
 * All non-code elements of the Product, including illustrations,
 * icon sets, and technical writing content, are licensed under the
 * Creative Commons Attribution-ShareAlike 4.0 International License:
 * https://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 * This license applies only to such non-code elements and does not
 * modify or replace the licensing terms applicable to the Program's
 * source code, which remains licensed under the GNU Affero General
 * Public License v3.
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from "react";

import {
  PaymentMethodStatus,
  ProductQuantityType,
  type PaymentApi,
} from "@onlyoffice/docspace-api-sdk";

import { useCommonTranslation } from "../../utils/i18n";
import { Text } from "../../components/text";
import { Loader, LoaderTypes } from "../../components/loader";
import { useApi } from "../../providers";

import {
  AI_PAYWALL_START_AMOUNT,
  DOCS_CONNECT_PRODUCT,
  DOCS_CONNECT_DEVPACK_PRODUCT,
} from "../constants";
import { formatCurrencyValue } from "../utils/common";
import type { TCustomerInfo } from "../types";

import styles from "./PaymentCompletePage.module.scss";
import { toastr } from "../../components/toast";
import { AnalyticsEvents } from "../../enums";
import {
  getDelayedContent,
  getFlavorContent,
  resolveDocsConnectParams,
  resolveFlavor,
  resolveWalletServicesToActivate,
  WALLET_REDIRECT_URL,
} from "./PaymentCompletePage.utils";
import ProcessingCard from "./sub-components/ProcessingCard";
import DelayedCard from "./sub-components/DelayedCard";
import SuccessCard from "./sub-components/SuccessCard";
import ErrorCard from "./sub-components/ErrorCard";

type Status = "loading" | "processing" | "delayed" | "success" | "error";

const CUSTOMER_INFO_RETRY_ATTEMPTS = 10;
const CUSTOMER_INFO_RETRY_DELAY_MS = 3000;

const sleep = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

const waitForCustomerPaymentMethod = async (
  paymentApi: PaymentApi,
): Promise<TCustomerInfo | undefined> => {
  for (let i = 0; i < CUSTOMER_INFO_RETRY_ATTEMPTS; i += 1) {
    try {
      const res = await paymentApi.getCustomerInfo({ refresh: true });
      const info = res?.data?.response as unknown as TCustomerInfo | undefined;

      if (info?.paymentMethodStatus === PaymentMethodStatus.Set) return info;
    } catch (error) {
      console.error("[paywall callback] customer info fetch failed", error);
    }

    if (i < CUSTOMER_INFO_RETRY_ATTEMPTS - 1)
      await sleep(CUSTOMER_INFO_RETRY_DELAY_MS);
  }

  return undefined;
};

type PaymentCompletePageProps = {
  docsConnectUrl?: string;
};

const PaymentCompletePage = ({ docsConnectUrl }: PaymentCompletePageProps) => {
  const t = useCommonTranslation();
  const { paymentApi } = useApi();

  const [status, setStatus] = React.useState<Status>("loading");
  const [stepIndex, setStepIndex] = React.useState(1);
  const [isActivationError, setIsActivationError] = React.useState(false);
  const [isDelayed, setIsDelayed] = React.useState(false);

  const {
    hasPaymentParams,
    currency,
    amount,
    language,
    service,
    admins,
    storage,
    plan,
    price,
    users,
    add,
    devpack,
    skipAiSearch,
  } = React.useMemo(() => {
    if (typeof window === "undefined") {
      return {
        hasPaymentParams: false,
        currency: "USD",
        amount: AI_PAYWALL_START_AMOUNT,
        type: "",
        language: "en",
        service: "",
        admins: "",
        storage: "",
        plan: "",
        price: "",
        users: "",
        add: "",
        devpack: "",
        skipAiSearch: "",
      };
    }

    const urlParams = new URLSearchParams(window.location.search);
    const parsedAmount = Number(urlParams.get("amount"));

    return {
      hasPaymentParams:
        urlParams.has("amount") &&
        (urlParams.has("type") || urlParams.has("service")),
      currency: urlParams.get("currency") || "USD",
      amount: parsedAmount > 0 ? parsedAmount : AI_PAYWALL_START_AMOUNT,
      type: urlParams.get("type") || "",
      language: urlParams.get("language") || "en",
      service: urlParams.get("service") || "",
      admins: urlParams.get("admins") || "",
      storage: urlParams.get("storage") || "",
      plan: urlParams.get("plan") || "",
      price: urlParams.get("price") || "",
      users: urlParams.get("users") || "",
      add: urlParams.get("add") || "",
      devpack: urlParams.get("devpack") || "",
      skipAiSearch: urlParams.get("skipAiSearch") || "",
    };
  }, []);

  const { isDocsConnect, docsConnectUsers, docsConnectAddUsers, withDevPack } =
    resolveDocsConnectParams({ service, users, add, devpack });

  const flavor = resolveFlavor(service, admins);
  const pageContent = getFlavorContent(t, flavor, { plan, service, storage });
  const delayedContent = getDelayedContent(t);

  const formattedAmount = formatCurrencyValue(language, amount, currency, 2);
  const formattedMonthlyPrice = formatCurrencyValue(
    language,
    Number(price) || 0,
    currency,
    2,
  );

  const hasStartedRef = React.useRef(false);

  React.useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    if (!hasPaymentParams) {
      window.location.replace(WALLET_REDIRECT_URL);
      return;
    }

    window.history.replaceState(
      window.history.state,
      "",
      window.location.pathname,
    );

    const run = async () => {
      window.dataLayer = window.dataLayer || [];

      window.dataLayer.push({
        event: AnalyticsEvents.AddPaymentMethod,
      });

      let isDelayedPaymentMethod = false;

      try {
        const customerInfo = await waitForCustomerPaymentMethod(paymentApi);

        isDelayedPaymentMethod = customerInfo?.isDelayedPaymentMethod === true;
        setIsDelayed(isDelayedPaymentMethod);
        setStatus("processing");

        await paymentApi.topUpDeposit({
          topUpDepositRequestDto: { amount, currency },
        });
      } catch (e) {
        console.error("[paywall callback] top-up failed", e);
        toastr.error(e as Error);
        setStatus("error");
        return;
      }

      window.dataLayer.push({
        event: AnalyticsEvents.WalletTopUp,
      });

      if (isDelayedPaymentMethod) {
        setStatus("delayed");
        return;
      }

      setStepIndex(2);

      try {
        const walletServicesToActivate = resolveWalletServicesToActivate(
          service,
          skipAiSearch === "1" || skipAiSearch === "true",
        );

        for (const walletService of walletServicesToActivate) {
          await paymentApi.changeTenantWalletServiceState({
            changeWalletServiceStateRequestDto: {
              service: walletService,
              enabled: true,
            },
          });
        }

        if (walletServicesToActivate.length > 0) setStepIndex(3);

        if (admins) {
          await paymentApi.updateWalletPayment({
            walletQuantityRequestDto: {
              quantity: { adminwallet: Number(admins) },
              productQuantityType: ProductQuantityType.Add,
            },
          });

          setStepIndex(3);
        }

        if (isDocsConnect && docsConnectAddUsers > 0) {
          await paymentApi.updateWalletPayment({
            walletQuantityRequestDto: {
              quantity: {
                [withDevPack
                  ? DOCS_CONNECT_DEVPACK_PRODUCT
                  : DOCS_CONNECT_PRODUCT]: docsConnectAddUsers,
              },
              productQuantityType: ProductQuantityType.Add,
            },
          });

          setStepIndex(3);
        }
      } catch (e) {
        console.error("[paywall callback] activation failed", e);
        toastr.error(e as Error);
        setIsActivationError(true);
        setStatus("error");
        return;
      }

      await sleep(700);

      setStatus("success");
    };

    run();
  }, []);

  const isBusy = status === "loading" || status === "processing";

  React.useEffect(() => {
    if (!isBusy || !hasPaymentParams) return undefined;

    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [isBusy, hasPaymentParams]);

  const onGoToBillingClick = () => {
    window.location.href = pageContent.redirectUrl;
  };

  const onBackToBillingClick = () => {
    window.location.href = delayedContent.redirectUrl;
  };

  if (!hasPaymentParams || status === "loading") {
    return (
      <div className={styles.page}>
        <div className={styles.bgCover} aria-hidden="true" />
        <Loader type={LoaderTypes.track} size="40px" />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.bgCover} aria-hidden="true" />

      <div className={styles.card} data-status={status}>
        {status === "processing" && !isDelayed ? (
          <ProcessingCard
            title={pageContent.processingTitle}
            hint={pageContent.processingHint}
            stepIndex={stepIndex}
            topUpPrice={formattedAmount}
            activateStepLabel={pageContent.activateStepLabel}
            tariffActivation={
              admins && storage ? { plan, admins, storage } : undefined
            }
          />
        ) : null}

        {(status === "processing" && isDelayed) || status === "delayed" ? (
          <DelayedCard
            content={delayedContent}
            isProcessing={status === "processing"}
            onGoToBillingClick={onBackToBillingClick}
          />
        ) : null}

        {status === "success" ? (
          <SuccessCard
            flavor={flavor}
            title={pageContent.successTitle}
            hint={pageContent.successHint}
            buttonLabel={pageContent.successButtonLabel}
            onGoToServiceClick={onGoToBillingClick}
            amount={amount}
            currency={currency}
            language={language}
            admins={admins}
            storage={storage}
            price={price}
            docsConnectUsers={docsConnectUsers}
            formattedMonthlyPrice={formattedMonthlyPrice}
            docsConnectUrl={docsConnectUrl}
          />
        ) : null}

        {status === "error" ? (
          isActivationError ? (
            <ErrorCard
              title={t("AddonActivationFailed")}
              hint={t("AddonActivationFailedHint")}
              buttonLabel={t("TryAgainInAddon")}
              onGoToServiceClick={onGoToBillingClick}
            />
          ) : (
            <ErrorCard
              title={pageContent.errorTitle ?? t("WalletTopUpErrorTitle")}
              hint={pageContent.errorHint ?? t("WalletTopUpCallbackErrorHint")}
              buttonLabel={
                pageContent.errorButtonLabel ?? t("WalletTopUpErrorRetry")
              }
              onGoToServiceClick={onGoToBillingClick}
            />
          )
        ) : null}
      </div>
    </div>
  );
};

export default PaymentCompletePage;

