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

import React, { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react";

import { ModalDialog, ModalDialogType } from "../../../components/modal-dialog";
import { Button, ButtonSize } from "../../../components/button";
import { Text } from "../../../components/text";
import { toastr } from "../../../components/toast";

import { useCommonTranslation } from "../../../utils/i18n";
import { toAbsoluteUrl } from "../../utils/url";
import { AnalyticsEvents } from "../../../enums";

import Amount from "./sub-components/Amount";
import { AmountProvider, useAmountValue } from "../../wallet/context";

import type PaymentStore from "../../store/PaymentStore";
import type { PaymentApi } from "@onlyoffice/docspace-api-sdk";

import styles from "./styles/SimpleTopUpDialog.module.scss";

export type TSimpleTopUpDeps = {
  paymentApi: PaymentApi;
  formatWalletCurrency: PaymentStore["formatWalletCurrency"];
  walletCodeCurrency: string;
  fetchBalance: (isRefresh?: boolean) => Promise<number>;
  fetchTransactionHistory?: PaymentStore["fetchTransactionHistory"];
  walletCustomerStatusNotActive: boolean;
  language: string;
  fetchCardLinked: (
    backUrl?: string,
    successUrl?: string,
  ) => Promise<string | null | undefined>;
  walletBalance: number;
  fetchCustomerInfo: (refresh?: boolean) => Promise<string | null | undefined>;
};

const MIN_AMOUNT = "10";
const PAYMENT_CALLBACK_PATH = "/billing/payment-complete";
const POLL_INITIAL_INTERVAL_MS = 3000;
const POLL_MAX_INTERVAL_MS = 30000;
const POLL_TIMEOUT_MS = 5 * 60 * 1000;

const sleep = (ms: number, signal: AbortSignal) =>
  new Promise<void>((resolve) => {
    if (signal.aborted) {
      resolve();
      return;
    }
    const timer = setTimeout(resolve, ms);
    signal.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        resolve();
      },
      { once: true },
    );
  });

const pollUntil = async (
  check: () => Promise<boolean>,
  signal: AbortSignal,
) => {
  const startedAt = Date.now();
  let interval = POLL_INITIAL_INTERVAL_MS;
  while (!signal.aborted) {
    if (await check()) return;
    if (signal.aborted) return;
    if (Date.now() - startedAt > POLL_TIMEOUT_MS) {
      throw new Error("Polling timeout");
    }
    await sleep(interval, signal);
    interval = Math.min(interval * 2, POLL_MAX_INTERVAL_MS);
  }
};

type TStripeCheckoutProps = Pick<
  TSimpleTopUpDeps,
  "walletCodeCurrency" | "language" | "fetchCardLinked"
>;

const openStripeCheckout = async (
  { walletCodeCurrency, language, fetchCardLinked }: TStripeCheckoutProps,
  amount: string,
  service?: string,
) => {
  const currency = walletCodeCurrency || "USD";
  const lang = language || "en";
  const backUrl = `${window.location.origin}${window.location.pathname}`;

  const serviceParam = service ? `&service=${service}` : "";
  const successUrl = `${window.location.origin}${PAYMENT_CALLBACK_PATH}?currency=${currency}&amount=${amount}&type=wallet&language=${lang}${serviceParam}`;

  const linkUrl = await fetchCardLinked(backUrl, successUrl);

  if (!linkUrl) throw new Error("Missing Stripe checkout URL");

  window.open(toAbsoluteUrl(linkUrl), "_blank");
};

type TTopUpCompletionProps = Pick<
  TSimpleTopUpDeps,
  "walletBalance" | "fetchCustomerInfo" | "fetchBalance"
>;

const waitForTopUpCompletion = async (
  {
    walletBalance: initialBalance,
    fetchCustomerInfo,
    fetchBalance,
  }: TTopUpCompletionProps,
  signal: AbortSignal,
) => {
  await pollUntil(async () => {
    const email = await fetchCustomerInfo(true);
    return !!email;
  }, signal);

  await pollUntil(async () => {
    const newBalance = await fetchBalance(true);
    return newBalance > initialBalance;
  }, signal);
};

type SimpleTopUpDialogBaseProps = {
  visible: boolean;
  onClose: () => void;
  onConfirm?: () => Promise<void> | void;
  isFirstTopUp?: boolean;
  recommendedAmount?: string;
  /** optional service to activate after the top-up (passed to the callback URL) */
  service?: string;
};

export type SimpleTopUpDialogProps = SimpleTopUpDialogBaseProps &
  TSimpleTopUpDeps;

const SimpleTopUpDialogContent = observer(
  ({
    visible,
    onClose,
    onConfirm,
    isFirstTopUp = true,
    paymentApi,
    formatWalletCurrency,
    walletCodeCurrency,
    fetchBalance,
    fetchTransactionHistory,
    walletCustomerStatusNotActive,
    language,
    fetchCardLinked,
    walletBalance,
    fetchCustomerInfo,
    service,
  }: SimpleTopUpDialogProps) => {
    const t = useCommonTranslation();

    const { amount, hasError } = useAmountValue();

    const [isLoading, setIsLoading] = useState(false);

    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
      return () => {
        abortControllerRef.current?.abort();
      };
    }, []);

    const isDisabled = isLoading || !amount || hasError;

    const onStripeContinue = async () => {
      const controller = new AbortController();
      abortControllerRef.current = controller;
      const { signal } = controller;

      setIsLoading(true);

      try {
        await openStripeCheckout(
          { walletCodeCurrency, language, fetchCardLinked },
          amount,
          service,
        );

        await waitForTopUpCompletion(
          { walletBalance, fetchCustomerInfo, fetchBalance },
          signal,
        );

        if (signal.aborted) return;

        await onConfirm?.();

        if (signal.aborted) return;

        onClose();
      } catch (error) {
        console.error("[first-topup] flow failed", error);
        if (!signal.aborted) toastr.error(t("UnexpectedError"));
      } finally {
        if (!signal.aborted) setIsLoading(false);
      }
    };

    const onInstantTopUp = async () => {
      setIsLoading(true);

      try {
        const res = await paymentApi.topUpDeposit({
          topUpDepositRequestDto: {
            amount: +amount,
            currency: walletCodeCurrency,
          },
        });

        if (!res?.data?.response) throw new Error(t("UnexpectedError"));

        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: AnalyticsEvents.WalletTopUp });

        const requests: Promise<unknown>[] = [fetchBalance(true)];
        if (fetchTransactionHistory) requests.push(fetchTransactionHistory());
        await Promise.allSettled(requests);

        toastr.success(t("WalletToppedUp"));

        await onConfirm?.();

        onClose();
      } catch (error) {
        toastr.error(error as Error);
      } finally {
        setIsLoading(false);
      }
    };

    const onContinue = async () => {
      if (isDisabled) return;

      if (isFirstTopUp) await onStripeContinue();
      else await onInstantTopUp();
    };

    return (
      <ModalDialog
        visible={visible}
        onClose={onClose}
        displayType={ModalDialogType.modal}
        autoMaxHeight
        withBodyScroll
      >
        <ModalDialog.Header>{t("TopUpCredits")}</ModalDialog.Header>

        <ModalDialog.Body>
          <div className={styles.body}>
            <Text className={styles.description}>
              {isFirstTopUp
                ? t("TopUpCreditsDescription")
                : t("TopUpCreditsAmountDescription")}
            </Text>

            <Amount
              formatWalletCurrency={formatWalletCurrency}
              isDisabled={isLoading}
              walletCustomerStatusNotActive={walletCustomerStatusNotActive}
              minValue={MIN_AMOUNT}
              withoutCustomerCheck
            />

            {isFirstTopUp ? (
              <Text fontSize="12px" className={styles.helperText}>
                {t("TopUpCreditsChargeHint")}
              </Text>
            ) : (
              <Text fontSize="12px" className={styles.helperText}>
                {t("TopUpTakeSomeTimeToComplete")}
              </Text>
            )}
          </div>
        </ModalDialog.Body>

        <ModalDialog.Footer>
          <div className={styles.footerButtons}>
            <Button
              key="ContinueToStripeButton"
              label={isFirstTopUp ? t("ContinueToStripe") : t("TopUp")}
              size={ButtonSize.normal}
              primary
              scale
              onClick={onContinue}
              isLoading={isLoading}
              isDisabled={isDisabled}
              testId="first_topup_continue_to_stripe"
            />
            <Button
              key="CancelButton"
              label={t("CancelButton")}
              size={ButtonSize.normal}
              scale
              onClick={onClose}
              isDisabled={isLoading}
              testId="first_topup_cancel"
            />
          </div>
        </ModalDialog.Footer>
      </ModalDialog>
    );
  },
);

const SimpleTopUpDialog: React.FC<SimpleTopUpDialogProps> = (props) => (
  <AmountProvider initialAmount={props.recommendedAmount}>
    <SimpleTopUpDialogContent {...props} />
  </AmountProvider>
);

export default SimpleTopUpDialog;

