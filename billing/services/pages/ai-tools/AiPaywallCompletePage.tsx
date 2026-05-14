// (c) Copyright Ascensio System SIA 2009-2026
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

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

type Status = "processing" | "success" | "error";

const BILLING_REDIRECT_URL = "/portal-settings/payments/services/ai-services";

const AiPaywallCompletePage = () => {
  const t = useCommonTranslation();
  const { paymentApi, rawApiClient } = useApi();

  const [status, setStatus] = React.useState<Status>("processing");
  const [stepIndex, setStepIndex] = React.useState(0);
  const ranRef = React.useRef(false);

  const { currency, amount } = React.useMemo(() => {
    if (typeof window === "undefined") {
      return {
        currency: "USD",
        amount: AI_PAYWALL_START_AMOUNT,
      };
    }
    const urlParams = new URLSearchParams(window.location.search);
    const parsedAmount = Number(urlParams.get("amount"));
    return {
      currency: urlParams.get("currency") || "USD",
      amount: parsedAmount > 0 ? parsedAmount : AI_PAYWALL_START_AMOUNT,
    };
  }, []);

  const language = typeof navigator !== "undefined" ? navigator.language : "en";

  const formattedAmount = formatCurrencyValue(language, amount, currency, 2);

  React.useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;

    const run = async () => {
      try {
        setStepIndex(1);

        await paymentApi.topUpDeposit({
          topUpDepositRequestDto: { amount, currency },
        });

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

        await new Promise((resolve) => setTimeout(resolve, 700));

        setStatus("success");
      } catch (e) {
        console.error("[ai-paywall callback] top-up failed", e);
        setStatus("error");
      }
    };

    run();
  }, [paymentApi, rawApiClient]);

  const onGoToBillingClick = () => {
    window.location.href = BILLING_REDIRECT_URL;
  };

  const steps = [
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
                {t("AIPaywallCallbackProcessing")}
              </Text>
              <Text fontSize="13px" lineHeight="18px" className={styles.hint}>
                {t("AIPaywallCallbackProcessingHint")}
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
                {t("AIPaywallCallbackSuccessHint", {
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
              {t("AIPaywallCallbackErrorHint")}
            </Text>

            <div className={styles.actions}>
              <Button
                size={ButtonSize.normal}
                primary
                scale
                label={t("AIPaywallCallbackGoToBilling")}
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

