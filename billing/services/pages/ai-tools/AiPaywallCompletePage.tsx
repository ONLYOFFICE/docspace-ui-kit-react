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
import { useApi } from "../../../../providers";

import CheckIcon from "../../../../assets/check.react.svg";
import DangerIcon from "../../../../assets/danger.toast.react.svg";
import InfoIcon from "../../../../assets/info.outline.react.svg";

import { AI_PAYWALL_START_AMOUNT } from "../../../constants";
import { formatCurrencyValue } from "../../../utils/common";

import styles from "./AiPaywallCompletePage.module.scss";
import { toastr } from "../../../../components/toast";

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
  const [stepIndex, setStepIndex] = React.useState(0);

  const { currency, amount, type } = React.useMemo(() => {
    if (typeof window === "undefined") {
      return {
        currency: "USD",
        amount: AI_PAYWALL_START_AMOUNT,
        type: "",
      };
    }
    const urlParams = new URLSearchParams(window.location.search);
    const parsedAmount = Number(urlParams.get("amount"));
    return {
      currency: urlParams.get("currency") || "USD",
      amount: parsedAmount > 0 ? parsedAmount : AI_PAYWALL_START_AMOUNT,
      type: urlParams.get("type") || "",
    };
  }, []);

  const isWalletOnly = type === "wallet";

  const language = typeof navigator !== "undefined" ? navigator.language : "en";

  const formattedAmount = formatCurrencyValue(language, amount, currency, 2);

  React.useEffect(() => {
    const run = async () => {
      try {
        setStepIndex(1);

        await withRetry(
          () =>
            paymentApi.topUpDeposit({
              topUpDepositRequestDto: { amount, currency },
            }),
          TOPUP_RETRY_ATTEMPTS,
          TOPUP_RETRY_DELAY_MS,
        );


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
        console.error("[ai-paywall callback] top-up failed", e);
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
    ? [t("AIPaywallCallbackStepLinkCard"), t("WalletTopUpStep")]
    : [
        t("AIPaywallCallbackStepLinkCard"),
        t("AIPaywallCallbackStepTopUp"),
        t("AIPaywallCallbackStepActivate"),
      ];

  return (
    <div className={styles.page}>
      <div className={styles.bgCover} aria-hidden="true" />

      <div className={styles.card}>
        {status === "processing" ? (
          <>
            <div className={styles.heroText}>
              <Text fontSize="20px" fontWeight={700} className={styles.title}>
                {isWalletOnly
                  ? t("WalletTopUpProcessing")
                  : t("AIPaywallCallbackProcessing")}
              </Text>
              <Text fontSize="13px" lineHeight="18px" className={styles.hint}>
                {isWalletOnly
                  ? t("WalletTopUpProcessingHint")
                  : t("AIPaywallCallbackProcessingHint")}
              </Text>
            </div>

            <div className={styles.keepOpenCallout} role="status">
              <InfoIcon
                className={styles.keepOpenCalloutIcon}
                aria-hidden="true"
              />
              <span>{t("AIPaywallCallbackKeepOpen")}</span>
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
                    >
                      {state === "done" ? <CheckIcon /> : null}
                    </Text>
                    <Text className={styles.timelineLabel} as="span">
                      {label}
                    </Text>
                  </li>
                );
              })}
            </ol>

            <Text fontSize="12px" className={styles.footerNote}>
              {t("AIPaywallCallbackProcessingFooter")}
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

            <div className={styles.successHero}>
              <Text fontSize="20px" fontWeight={700} className={styles.title}>
                {t("AIPaywallCallbackSuccess")}
              </Text>
              <Text as="span" className={styles.successAmount}>
                +{formattedAmount}
              </Text>
              <Text fontSize="13px" lineHeight="18px" className={styles.hint}>
                {isWalletOnly
                  ? t("WalletTopUpSuccessHint", { price: formattedAmount })
                  : t("AIPaywallCallbackSuccessHint", {
                      price: formattedAmount,
                    })}
              </Text>
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
              <DangerIcon />
            </div>

            <Text fontSize="20px" fontWeight={700} className={styles.title}>
              {t("AIPaywallCallbackError")}
            </Text>

            <Text fontSize="13px" lineHeight="18px" className={styles.hint}>
              {isWalletOnly
                ? t("WalletTopUpErrorHint")
                : t("AIPaywallCallbackErrorHint")}
            </Text>

            <div className={styles.actions}>
              <Button
                size={ButtonSize.normal}
                primary
                scale
                label={
                  isWalletOnly
                    ? t("WalletTopUpGoToWallet")
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

