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

import { ProductQuantityType } from "@onlyoffice/docspace-api-sdk";

import { useCommonTranslation } from "../../../../utils/i18n";
import { Text } from "../../../../components/text";
import { Button, ButtonSize } from "../../../../components/button";
import { Link, LinkType, LinkTarget } from "../../../../components/link";
import { Loader, LoaderTypes } from "../../../../components/loader";
import { useApi } from "../../../../providers";

import CheckIcon from "../../../../assets/check.edit.react.svg";
import InfoIcon from "../../../../assets/info.outline.react.svg";
import XIcon from "../../../../assets/x.alert.react.svg";

import BalanceAmount from "../../../shared/balance-amount";

import {
  AI_PAYWALL_START_AMOUNT,
  DOCS_CONNECT_PRODUCT,
  DOCS_CONNECT_DEVPACK_PRODUCT,
} from "../../../constants";
import { formatCurrencyValue } from "../../../utils/common";

import styles from "./AiPaywallCompletePage.module.scss";
import { toastr } from "../../../../components/toast";
import { AnalyticsEvents } from "../../../../enums";
import {
  getFlavorContent,
  PaymentFlavor,
  resolveDocsConnectParams,
  resolveFlavor,
  resolveWalletService,
  WALLET_REDIRECT_URL,
} from "./AiPaywallCompletePage.utils";

type Status = "processing" | "success" | "error";

const TOPUP_RETRY_ATTEMPTS = 10;
const TOPUP_RETRY_DELAY_MS = 3000;

const sleep = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

const withRetry = async <T,>(
  task: () => Promise<T>,
  attempts: number,
  delayMs: number,
): Promise<T> => {
  let lastError: unknown;
  for (let i = 0; i < attempts; i += 1) {
    try {
      return await task();
    } catch (error) {
      lastError = error;
      if (i < attempts - 1) await sleep(delayMs);
    }
  }
  throw lastError;
};

type AiPaywallCompletePageProps = {
  docsConnectUrl?: string;
};

const AiPaywallCompletePage = ({
  docsConnectUrl,
}: AiPaywallCompletePageProps) => {
  const t = useCommonTranslation();
  const { paymentApi } = useApi();

  const [status, setStatus] = React.useState<Status>("processing");
  const [stepIndex, setStepIndex] = React.useState(1);

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
    };
  }, []);

  const { isDocsConnect, docsConnectUsers, docsConnectAddUsers, withDevPack } =
    resolveDocsConnectParams({ service, users, add, devpack });

  const flavor = resolveFlavor(service, admins);
  const pageContent = getFlavorContent(t, flavor, { plan, service, storage });

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
      try {
        window.dataLayer = window.dataLayer || [];

        window.dataLayer.push({
          event: AnalyticsEvents.AddPaymentMethod,
        });

        await withRetry(
          () =>
            paymentApi.topUpDeposit({
              topUpDepositRequestDto: { amount, currency },
            }),
          TOPUP_RETRY_ATTEMPTS,
          TOPUP_RETRY_DELAY_MS,
        );

        window.dataLayer.push({
          event: AnalyticsEvents.WalletTopUp,
        });

        setStepIndex(2);

        const walletServiceToActivate = resolveWalletService(service);

        if (walletServiceToActivate !== null) {
          await paymentApi.changeTenantWalletServiceState({
            changeWalletServiceStateRequestDto: {
              service: walletServiceToActivate,
              enabled: true,
            },
          });

          setStepIndex(3);
        }

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

        await new Promise((resolve) => setTimeout(resolve, 700));

        setStatus("success");
      } catch (e) {
        console.error("[paywall callback] top-up failed", e);
        toastr.error(e as Error);
        setStatus("error");
      }
    };

    run();
  }, []);

  React.useEffect(() => {
    if (status !== "processing" || !hasPaymentParams) return undefined;

    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [status, hasPaymentParams]);

  const onGoToBillingClick = () => {
    window.location.href = pageContent.redirectUrl;
  };

  const tariffStep =
    admins && storage ? (
      <span className={styles.tariffActivation}>
        <Text as="span" fontSize="14px" fontWeight={700}>
          {t("ActivatingPlan", { planName: plan })}
        </Text>
        <Text
          as="span"
          fontSize="12px"
          fontWeight={400}
          className={styles.tariffActivationDetails}
        >
          {t("TariffActivationDetails", { admins, storage })}
        </Text>
      </span>
    ) : null;

  const steps: { key: string; label: React.ReactNode }[] = [
    { key: "card", label: t("WalletTopUpStepCardSaved") },
    {
      key: "topup",
      label: t("WalletTopUpCallbackStep", { price: formattedAmount }),
    },
    ...(tariffStep
      ? [{ key: "tariff", label: tariffStep }]
      : service
        ? [{ key: "service", label: pageContent.activateStepLabel }]
        : []),
  ];

  if (!hasPaymentParams) {
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
        {status === "processing" ? (
          <>
            <div className={styles.heroText}>
              <Text fontSize="16px" fontWeight={600} className={styles.title}>
                {pageContent.processingTitle}
              </Text>
              <Text lineHeight="20px">{pageContent.processingHint}</Text>
            </div>

            <div className={styles.keepOpenCallout} role="status">
              <InfoIcon
                className={styles.keepOpenCalloutIcon}
                aria-hidden="true"
              />
              <Text fontSize="12px" fontWeight={600} lineHeight="16px">
                {t("WalletTopUpKeepOpen")}
              </Text>
            </div>

            <ol className={styles.timeline}>
              {steps.map((step, index) => {
                const state =
                  index < stepIndex
                    ? "done"
                    : index === stepIndex
                      ? "active"
                      : "pending";
                const isLast = index === steps.length - 1;

                return (
                  <li
                    key={step.key}
                    className={styles.timelineItem}
                    data-state={state}
                  >
                    {!isLast ? (
                      <Text
                        className={styles.timelineConnector}
                        aria-hidden="true"
                        as="span"
                      />
                    ) : null}
                    <Text
                      className={styles.timelineDot}
                      aria-hidden="true"
                      as="span"
                      data-state={state}
                    >
                      {state === "done" ? <CheckIcon /> : null}
                      {state === "active" ? (
                        <Loader type={LoaderTypes.track} size="20px" />
                      ) : null}
                    </Text>
                    <Text
                      className={styles.timelineLabel}
                      as="span"
                      fontSize="14px"
                      fontWeight={700}
                    >
                      {step.label}
                    </Text>
                  </li>
                );
              })}
            </ol>

            <Text className={styles.footerNote}>
              {t("WalletTopUpSecuredByStripe")}
            </Text>
          </>
        ) : null}

        {status === "success" ? (
          <>
            <div
              className={styles.heroBadge}
              data-status="success"
              aria-hidden="true"
            >
              <CheckIcon />
            </div>

            <div className={styles.cardBody}>
              <Text fontSize="16px" fontWeight={600} className={styles.title}>
                {pageContent.successTitle}
              </Text>
              {flavor === PaymentFlavor.Tariff ? (
                <>
                  <Text as="span" className={styles.adminsAmount}>
                    {t("AdminsAddedAmount", { admins })}
                  </Text>
                  <Text
                    fontSize="14px"
                    className={styles.tariffActivationDetails}
                  >
                    {t("TariffSuccessDetails", { storage, price })}
                  </Text>
                </>
              ) : flavor === PaymentFlavor.DocsConnect ? (
                <>
                  <Text as="span" className={styles.adminsAmount}>
                    {t("DocsConnectUsersAmount", {
                      count: docsConnectUsers,
                    })}
                  </Text>
                  <Text
                    fontSize="14px"
                    className={styles.tariffActivationDetails}
                  >
                    {t("DocsConnectPricePerMonth", {
                      price: formattedMonthlyPrice,
                    })}
                  </Text>
                </>
              ) : flavor === PaymentFlavor.DiskStorage && storage ? (
                <>
                  <Text as="span" className={styles.adminsAmount}>
                    +{storage}
                  </Text>
                  <Text
                    fontSize="14px"
                    className={styles.tariffActivationDetails}
                  >
                    {t("StoragePaywallCallbackPricePerMonth", {
                      price: formattedMonthlyPrice,
                    })}
                  </Text>
                </>
              ) : (
                <>
                  <div className={styles.successAmount}>
                    <Text as="span" fontSize="28px" fontWeight={700}>
                      +
                    </Text>
                    <BalanceAmount
                      amount={amount}
                      currency={currency}
                      language={language}
                      maximumFractionDigits={2}
                      mainFontSize="28px"
                      fractionFontSize="20px"
                      withoutMargin
                      showRefresh={false}
                    />
                  </div>
                  <Text fontSize="13px" lineHeight="18px">
                    {pageContent.successHint}
                  </Text>
                </>
              )}
            </div>

            <div className={styles.actions}>
              <Button
                size={ButtonSize.medium}
                primary
                scale
                label={pageContent.successButtonLabel}
                onClick={onGoToBillingClick}
                testId="ai_paywall_go_to_wallet_button"
              />
              {isDocsConnect && docsConnectUrl ? (
                <Link
                  className={styles.docsLink}
                  type={LinkType.page}
                  href={docsConnectUrl}
                  target={LinkTarget.blank}
                  color="accent"
                  fontSize="13px"
                  fontWeight={600}
                  dataTestId="docs_connect_read_api_docs_link"
                >
                  {t("ReadApiDocumentation")}
                </Link>
              ) : null}
            </div>
          </>
        ) : null}

        {status === "error" ? (
          <>
            <div
              className={styles.heroBadge}
              data-status="error"
              aria-hidden="true"
            >
              <XIcon />
            </div>

            <div className={styles.cardBody}>
              <Text fontSize="16px" fontWeight={600} className={styles.title}>
                {pageContent.errorTitle}
              </Text>

              <Text fontSize="13px" lineHeight="18px">
                {pageContent.errorHint}
              </Text>
            </div>

            <div className={styles.actions}>
              <Button
                size={ButtonSize.medium}
                primary
                scale
                label={pageContent.errorButtonLabel}
                onClick={onGoToBillingClick}
                testId="ai_paywall_go_to_billing_button"
              />
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default AiPaywallCompletePage;

