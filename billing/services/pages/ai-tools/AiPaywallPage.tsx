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

import { useCommonTranslation } from "../../../../utils/i18n";
import { Button, ButtonSize } from "../../../../components/button";
import { Text } from "../../../../components/text";
import { Link } from "../../../../components/link";
import { toastr } from "../../../../components/toast";
import { useApi } from "../../../../providers";

import BalanceAmount from "../../../shared/balance-amount";
import PricingBillingBody from "../../panels/ai-service/PricingBillingBody";

import { usePaymentStore } from "../../../store/PaymentStoreProvider";
import { useServicesStore } from "../../../store/ServicesStoreProvider";
import { toAbsoluteUrl } from "../../../utils/url";
import { formatCurrencyValue } from "../../../utils/common";
import { AI_PAYWALL_START_AMOUNT, AI_TOOLS, AI_ENUM } from "../../../constants";

import AiPageLoader from "./AiPageLoader";
import styles from "./AiPaywallPage.module.scss";

type AiPaywallPageProps = {
  integrationUrl?: string;
  onCompleted?: () => void;
};

type WaitingPhase = "idle" | "payment" | "topup" | "completed";

const START_AMOUNT = AI_PAYWALL_START_AMOUNT;
const PRESET_AMOUNTS = [AI_PAYWALL_START_AMOUNT, 50, 100];
const POLL_INTERVAL_MS = 3000;
const POLL_TIMEOUT_MS = 5 * 60 * 1000;
const ANIMATION_STEP_MS = 80;
const ANIMATION_TARGET_TICKS = 25;
const POST_ANIMATION_HOLD_MS = 500;
const COMPLETED_READ_DELAY_MS = 1500;

const sleep = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

const AiPaywallPage = ({ integrationUrl, onCompleted }: AiPaywallPageProps) => {
  const t = useCommonTranslation();
  const { rawApiClient } = useApi();

  const paymentStore = usePaymentStore();
  const servicesStore = useServicesStore();

  const { aiServiceBalance, isAiPaywallInit, aiPaywallInit } = servicesStore;

  const currency = paymentStore.walletCodeCurrency || "USD";
  const language = paymentStore.language || "en";

  const [isPricingBillingVisible, setIsPricingBillingVisible] = useState(false);
  const [waitingPhase, setWaitingPhase] = useState<WaitingPhase>("idle");
  const [animatedBalance, setAnimatedBalance] = useState<number | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<number>(START_AMOUNT);

  const isWaiting = waitingPhase !== "idle";
  const isMountedRef = useRef(true);

  const bootstrap = async () => {
    await aiPaywallInit(t);

    if (!isMountedRef.current) return;

    if (!servicesStore.wasFirstAiServiceTopUp) return;

    setWaitingPhase("completed");

    try {
      await sleep(COMPLETED_READ_DELAY_MS);

      await servicesStore.initServiceData(
        t,
        AI_TOOLS,
        AI_ENUM,
        integrationUrl,
      );

      onCompleted?.();
    } catch (e) {
      console.error("[ai-paywall] initServiceData failed", e);
    }
  };

  useEffect(() => {
    isMountedRef.current = true;

    bootstrap();

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const buildBackUrl = (amount: number) => {
    if (!integrationUrl) return undefined;
    const sep = integrationUrl.includes("?") ? "&" : "?";
    const currency = paymentStore.walletCodeCurrency || "USD";
    return `${integrationUrl}${sep}currency=${currency}&amount=${amount}`;
  };

  const onOpenPricingBilling = () => setIsPricingBillingVisible(true);
  const onClosePricingBilling = () => setIsPricingBillingVisible(false);

  const fetchAiBalanceRaw = async (): Promise<number> => {
    try {
      const { data } = await rawApiClient.instance.get(
        "api/2.0/portal/payment/customer/aibalance",
      );
      const balance = data?.response as
        | { subAccounts?: { amount?: number }[] }
        | number
        | undefined;
      if (!balance || typeof balance === "number") return 0;
      return balance.subAccounts?.[0]?.amount ?? 0;
    } catch {
      return 0;
    }
  };

  const pollUntil = async (check: () => Promise<boolean>) => {
    const startedAt = Date.now();
    while (isMountedRef.current) {
      if (await check()) return;
      if (Date.now() - startedAt > POLL_TIMEOUT_MS) {
        throw new Error("Polling timeout");
      }
      await sleep(POLL_INTERVAL_MS);
    }
  };

  const animateBalanceTo = async (target: number) => {
    const intTarget = Math.floor(target);
    const step = Math.max(1, Math.ceil(intTarget / ANIMATION_TARGET_TICKS));

    setAnimatedBalance(0);

    let current = 0;
    while (current < intTarget) {
      if (!isMountedRef.current) return;
      current = Math.min(current + step, intTarget);
      setAnimatedBalance(current);
      await sleep(ANIMATION_STEP_MS);
    }

    if (isMountedRef.current) setAnimatedBalance(target);
  };

  const onEnableAI = async () => {
    if (isWaiting) return;

    setWaitingPhase("payment");

    try {
      const backUrl = buildBackUrl(selectedAmount);
      await paymentStore.fetchCardLinked(backUrl);

      const linkUrl = paymentStore.cardLinked;
      if (!linkUrl) {
        throw new Error("Missing Stripe checkout URL");
      }

      window.open(toAbsoluteUrl(linkUrl), "_blank");

      await pollUntil(async () => {
        await paymentStore.tariff.fetchCustomerInfo(true);
        return !!paymentStore.tariff.walletCustomerEmail;
      });

      if (!isMountedRef.current) return;

      setWaitingPhase("topup");

      let balanceValue = 0;
      await pollUntil(async () => {
        balanceValue = await fetchAiBalanceRaw();
        return balanceValue > 0;
      });

      if (!isMountedRef.current) return;

      await animateBalanceTo(balanceValue);

      await sleep(POST_ANIMATION_HOLD_MS);

      setWaitingPhase("completed");

      await sleep(COMPLETED_READ_DELAY_MS);

      if (!isMountedRef.current) return;

      await servicesStore.initServiceData(t, AI_TOOLS, AI_ENUM, integrationUrl);

      if (!isMountedRef.current) return;

      onCompleted?.();
    } catch (e) {
      console.error("[ai-paywall] onEnableAI flow failed", e);
      if (isMountedRef.current) {
        toastr.error(t("UnexpectedError"));
        setWaitingPhase("idle");
      }
    }
  };

  if (!isAiPaywallInit) return <AiPageLoader />;

  const balanceToShow =
    animatedBalance !== null ? animatedBalance : (aiServiceBalance ?? 0);

  return (
    <div className={styles.container}>
      <PricingBillingBody
        visible={isPricingBillingVisible}
        onClose={onClosePricingBilling}
        isBackButton={false}
        withoutFooter
      />

      <div className={styles.heroSection}>
        <Text
          fontSize="18px"
          fontWeight={700}
          lineHeight="24px"
          className={styles.heroTitle}
        >
          {waitingPhase === "completed"
            ? t("AIPaywallHeroTitleCompleted")
            : t("AIPaywallHeroTitle", { price: START_AMOUNT })}
        </Text>
      </div>

      <div className={styles.balanceSection}>
        <div className={styles.balanceCard}>
          {waitingPhase === "completed" ? null : (
            <BalanceAmount
              amount={balanceToShow}
              currency={currency}
              maximumFractionDigits={2}
              withoutMargin
              showRefresh={false}
            />
          )}

          {waitingPhase === "completed" ? (
            <div className={styles.completedBlock} role="status">
              <div className={styles.completedBadge} aria-hidden="true" />
              <Text fontSize="14px" fontWeight={600}>
                {t("AIPaywallCompletedTitle")}
              </Text>
              <Text fontSize="12px" className={styles.completedHint}>
                {t("AIPaywallCompletedHint")}
              </Text>
            </div>
          ) : (
            <>
              <div className={styles.amountChips} role="radiogroup">
                {PRESET_AMOUNTS.map((amount) => {
                  const isSelected = amount === selectedAmount;
                  return (
                    <button
                      key={amount}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      className={`${styles.amountChip} ${
                        isSelected ? styles.amountChipSelected : ""
                      }`}
                      disabled={isWaiting}
                      onClick={() => setSelectedAmount(amount)}
                    >
                      {formatCurrencyValue(language, amount, currency, 0)}
                    </button>
                  );
                })}
              </div>

              <Button
                size={ButtonSize.small}
                primary
                label={
                  waitingPhase === "payment"
                    ? t("AIPaywallWaitingPayment")
                    : waitingPhase === "topup"
                      ? t("AIPaywallWaitingTopUp")
                      : t("AIPaywallEnableButton", { price: selectedAmount })
                }
                onClick={onEnableAI}
                scale
                isDisabled={isWaiting}
                testId="enable_ai_button"
              />

              <Text fontSize="12px" className={styles.secureNote}>
                {t("AIPaywallSecureNote")}
              </Text>
            </>
          )}
        </div>
      </div>

      <div className={styles.featuresBlock}>
        <Text fontSize="12px" className={styles.featuresLine}>
          {t("AIPaywallIncludedFeaturesLine1")}
        </Text>
        <Text fontSize="12px" className={styles.featuresLine}>
          {t("AIPaywallIncludedFeaturesLine2")}
        </Text>
      </div>

      <div className={styles.pricingRow}>
        <Link
          className={styles.pricingLink}
          onClick={onOpenPricingBilling}
          textDecoration="underline dotted"
          color="accent"
        >
          <Text fontSize="13px" fontWeight={600}>
            {t("AIPaywallSeePricing")}
          </Text>
        </Link>
      </div>
    </div>
  );
};

export default observer(AiPaywallPage);

