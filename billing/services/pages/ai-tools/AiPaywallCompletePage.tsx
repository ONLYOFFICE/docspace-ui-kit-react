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

import { TenantWalletService } from "@onlyoffice/docspace-api-sdk";

import { useCommonTranslation } from "../../../../utils/i18n";
import { Text } from "../../../../components/text";
import { Button, ButtonSize } from "../../../../components/button";
import { Loader, LoaderTypes } from "../../../../components/loader";
import { useApi } from "../../../../providers";

import CheckIcon from "../../../../assets/check.edit.react.svg";
import InfoIcon from "../../../../assets/info.outline.react.svg";
import XIcon from "../../../../assets/x.alert.react.svg";

import BalanceAmount from "../../../shared/balance-amount";

import { AI_PAYWALL_START_AMOUNT } from "../../../constants";
import { formatCurrencyValue } from "../../../utils/common";

import styles from "./AiPaywallCompletePage.module.scss";
import { toastr } from "../../../../components/toast";
import { AnalyticsEvents } from "../../../../enums";

type Status = "processing" | "success" | "error";

const BILLING_REDIRECT_URL = "/portal-settings/payments/services/ai-services";
const WALLET_REDIRECT_URL = "/portal-settings/payments/wallet";

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

const AiPaywallCompletePage = () => {
  const t = useCommonTranslation();
  const { paymentApi, rawApiClient } = useApi();

  const [status, setStatus] = React.useState<Status>("processing");
  const [stepIndex, setStepIndex] = React.useState(1);

  const { currency, amount, type, language } = React.useMemo(() => {
    if (typeof window === "undefined") {
      return {
        currency: "USD",
        amount: AI_PAYWALL_START_AMOUNT,
        type: "",
        language: "en",
      };
    }
    const urlParams = new URLSearchParams(window.location.search);
    const parsedAmount = Number(urlParams.get("amount"));
    return {
      currency: urlParams.get("currency") || "USD",
      amount: parsedAmount > 0 ? parsedAmount : AI_PAYWALL_START_AMOUNT,
      type: urlParams.get("type") || "",
      language: urlParams.get("language") || "en",
    };
  }, []);

  const isWalletOnly = type === "wallet";

  const formattedAmount = formatCurrencyValue(language, amount, currency, 2);

  React.useEffect(() => {
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

        if (!isWalletOnly) {
          await rawApiClient.instance.post(
            "api/2.0/portal/payment/creditaibalance",
            { amount },
          );

          setStepIndex(2);

          await paymentApi.changeTenantWalletServiceState({
            changeWalletServiceStateRequestDto: {
              service: TenantWalletService.AITools,
              enabled: true,
            },
          });

          setStepIndex(3);
        } else {
          setStepIndex(2);
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

  const onGoToBillingClick = () => {
    window.location.href = isWalletOnly
      ? WALLET_REDIRECT_URL
      : BILLING_REDIRECT_URL;
  };

  const steps = isWalletOnly
    ? [
        t("WalletTopUpStepCardSaved"),
        t("WalletTopUpCallbackStep", { price: formattedAmount }),
      ]
    : [
        t("AIPaywallCallbackStepLinkCard"),
        t("AIPaywallCallbackStepTopUp"),
        t("AIPaywallCallbackStepActivate"),
      ];

  return (
    <div className={styles.page}>
      <div className={styles.bgCover} aria-hidden="true" />

      <div className={styles.card} data-status={status}>
        {status === "processing" ? (
          <>
            <div className={styles.heroText}>
              <Text fontSize="16px" fontWeight={600} className={styles.title}>
                {isWalletOnly
                  ? t("WalletTopUpCallbackProcessingTitle")
                  : t("AIPaywallCallbackProcessing")}
              </Text>
              <Text lineHeight="20px">
                {isWalletOnly
                  ? t("WalletTopUpCallbackProcessingHint")
                  : t("AIPaywallCallbackProcessingHint")}
              </Text>
            </div>

            <div className={styles.keepOpenCallout} role="status">
              <InfoIcon
                className={styles.keepOpenCalloutIcon}
                aria-hidden="true"
              />
              <Text fontSize="12px" fontWeight={600} lineHeight="16px">
                {isWalletOnly
                  ? t("WalletTopUpKeepOpen")
                  : t("AIPaywallCallbackKeepOpen")}
              </Text>
            </div>

            <ol className={styles.timeline}>
              {steps.map((label, index) => {
                const state =
                  index < stepIndex
                    ? "done"
                    : index === stepIndex
                      ? "active"
                      : "pending";
                const isLast = index === steps.length - 1;

                return (
                  <li
                    key={label}
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
                      {label}
                    </Text>
                  </li>
                );
              })}
            </ol>

            <Text className={styles.footerNote}>
              {isWalletOnly
                ? t("WalletTopUpSecuredByStripe")
                : t("AIPaywallCallbackProcessingFooter")}
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
                {isWalletOnly
                  ? t("WalletTopUpSuccessTitle")
                  : t("AIPaywallCallbackSuccess")}
              </Text>
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
                {isWalletOnly
                  ? t("WalletTopUpCallbackSuccessHint")
                  : t("AIPaywallCallbackSuccessHint", {
                      price: formattedAmount,
                    })}
              </Text>
            </div>

            {isWalletOnly ? (
              <div className={styles.actions}>
                <Button
                  size={ButtonSize.medium}
                  primary
                  scale
                  label={t("WalletTopUpGoToWallet")}
                  onClick={onGoToBillingClick}
                  testId="ai_paywall_go_to_wallet_button"
                />
              </div>
            ) : null}
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
                {isWalletOnly
                  ? t("WalletTopUpErrorTitle")
                  : t("AIPaywallCallbackError")}
              </Text>

              <Text fontSize="13px" lineHeight="18px">
                {isWalletOnly
                  ? t("WalletTopUpCallbackErrorHint")
                  : t("AIPaywallCallbackErrorHint")}
              </Text>
            </div>

            <div className={styles.actions}>
              <Button
                size={ButtonSize.medium}
                primary
                scale
                label={
                  isWalletOnly
                    ? t("WalletTopUpErrorRetry")
                    : t("AIPaywallCallbackGoToBilling")
                }
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

