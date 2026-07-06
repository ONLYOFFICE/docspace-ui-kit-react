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

import { useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react";

import { Text } from "../../components/text";
import { Heading } from "../../components/heading";
import { Button, ButtonSize } from "../../components/button";
import { Link } from "../../components/link";
import { toastr } from "../../components/toast";
import { useCommonTranslation } from "../../utils/i18n";
import { finishRefreshingWithMinCycle } from "../utils/refreshing";

import { usePaymentStore } from "../store/PaymentStoreProvider";
import { useServicesStore } from "../store/ServicesStoreProvider";

import BalanceAmount from "../shared/balance-amount";
import { getConvertedSize, formatCompactNumber } from "../utils/common";
import { MANAGER, ROOM, TOTAL_SIZE } from "../constants";
import type { TServiceFeatureWithPrice } from "../types";
import { CardInformation } from "../shared/card-information";
import AutoPaymentInfo from "../wallet/sub-components/AutoPaymentInfo";
import SimpleTopUpDialog from "../shared/top-up-balance/SimpleTopUpDialogWrapper";
import WalletRefilledModal from "../wallet/WalletRefilledModal";

import styles from "./Overview.module.scss";

type BillingOverviewProps = {
  isMobile?: boolean;
  /** Navigate to the tariff-plan section. */
  onEditPlan?: () => void;
  /** Navigate to the usage section. */
  onViewUsage?: () => void;
  /** Navigate to the add-ons section. */
  onManageAddons?: () => void;
  /** Navigate to the payment-method section. */
  onManagePaymentMethod?: () => void;
  /** Navigate to the wallet section (upcoming payments live there). */
  onUpcomingDetails?: () => void;
};

const BillingOverview = ({
  isMobile,
  onEditPlan,
  onViewUsage,
  onManageAddons,
  onManagePaymentMethod,
  onUpcomingDetails,
}: BillingOverviewProps) => {
  const t = useCommonTranslation();
  const store = usePaymentStore();
  const { walletMonthToDateSpend, serviceUsage } = useServicesStore();

  const {
    walletBalance,
    walletCodeCurrency,
    isCardLinkedToPortal,
    canUpdateTariff,
    recommendedAmount,
    fetchBalance,
    walletInit,
    formatWalletCurrency,
    isAutoPaymentExist,
    autoPayments,
    wasFirstTopUp,
    upcomingPayments,
    language,
    servicesQuotasFeatures,
  } = store;

  const { isNotPaidPeriod, walletCustomerEmail } = store.tariff;

  const {
    currentTariffPlanTitle,
    currentPlanCost,
    isFreeTariff,
    quotaCharacteristics,
  } = store.quotas;

  const [isTopUpDialogVisible, setIsTopUpDialogVisible] = useState(false);
  const [isWalletRefilledOpen, setIsWalletRefilledOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    walletInit?.(t).catch((e: unknown) => console.error(e));
  }, []);

  const isAutoPaymentSetup = Boolean(
    isAutoPaymentExist &&
    language &&
    walletCodeCurrency &&
    autoPayments?.minBalance &&
    autoPayments?.upToBalance,
  );

  const monthLabel = useMemo(
    () =>
      new Intl.DateTimeFormat(language || "en", {
        month: "long",
        year: "numeric",
      }).format(new Date()),
    [language],
  );

  const onRefreshBalance = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    const startTime = Date.now();

    try {
      await fetchBalance?.(true);
    } catch (e) {
      toastr.error(e as Error);
    } finally {
      finishRefreshingWithMinCycle({
        startTime,
        setRefreshing: setIsRefreshing,
      });
    }
  };

  const planPrice = `${currentPlanCost?.currencySymbol ?? ""}${currentPlanCost?.value ?? 0}`;

  const limitValue = (id: string) =>
    quotaCharacteristics.find((f) => f.id === id)?.value ?? 0;

  const upcomingTotal = upcomingPayments.reduce(
    (sum, item) => sum + item.amount,
    0,
  );
  const upcomingSummary = upcomingPayments.map((item) => item.title).join(", ");

  const enabledAddons = (
    Array.from(servicesQuotasFeatures?.values() ?? []) as TServiceFeatureWithPrice[]
  ).filter((f) => f.value && f.title && f.image);

  const usageForService = (serviceName?: string) =>
    serviceUsage.find(
      (u) =>
        u.service === serviceName ||
        (!!serviceName &&
          !!u.service &&
          (serviceName.includes(u.service) || u.service.includes(serviceName))),
    );

  return (
    <div className={styles.overviewRoot}>
      <div className={styles.header}>
        <Heading type="content">{t("Billing")}</Heading>
        <Text className={styles.headerDescription}>
          {t("BillingOverviewDescription")}
        </Text>
      </div>

      {/* Available credits */}
      <div className={`${styles.card} ${styles.creditsCard}`}>
        <div className={styles.creditsTop}>
          <BalanceAmount
            title={t("AvailableCredits")}
            titleFontSize="14px"
            mainFontSize="28px"
            fractionFontSize="18px"
            showRefresh={!isNotPaidPeriod && isCardLinkedToPortal}
            isRefreshing={isRefreshing}
            onRefresh={onRefreshBalance}
            amount={walletBalance}
            currency={walletCodeCurrency}
            language={language}
            withoutMargin
          />
          <div className={styles.cardButtons}>
            <Button
              size={isMobile ? ButtonSize.normal : ButtonSize.small}
              primary
              label={t("TopUp")}
              onClick={() => setIsTopUpDialogVisible(true)}
              isDisabled={!canUpdateTariff || isNotPaidPeriod}
              className={styles.cardButton}
              testId="overview_top_up_button"
            />
            {wasFirstTopUp ? (
              <Button
                size={isMobile ? ButtonSize.normal : ButtonSize.small}
                label={t("AutoTopUp")}
                onClick={() => setIsWalletRefilledOpen(true)}
                isDisabled={!canUpdateTariff || isNotPaidPeriod}
                className={styles.cardButton}
                testId="overview_auto_top_up_button"
              />
            ) : null}
          </div>
        </div>
        {isAutoPaymentSetup ? (
          <div className={styles.autoPaymentWrap}>
            <AutoPaymentInfo />
          </div>
        ) : null}
      </div>

      {/* Plan / spend / upcoming */}
      <div className={styles.grid3}>
        <div className={styles.card}>
          <Text fontSize="12px" fontWeight={600} className={styles.mutedTitle}>
            {t("CurrentPlan")}
          </Text>
          <Text fontSize="18px" fontWeight={700}>
            {currentTariffPlanTitle}
          </Text>
          <Text fontSize="13px">
            {isFreeTariff
              ? t("PlanLimits", {
                  admins: limitValue(MANAGER),
                  rooms: limitValue(ROOM),
                  storage: getConvertedSize(t, limitValue(TOTAL_SIZE)),
                })
              : t("MigratePerMonth", { price: planPrice })}
          </Text>
          {onEditPlan ? (
            <Link
              onClick={onEditPlan}
              textDecoration="underline"
              color="accent"
              fontWeight={600}
              className={styles.cardLink}
              dataTestId="overview_edit_plan_link"
            >
              {isFreeTariff ? t("UpgradePlan") : t("EditPlan")}
            </Link>
          ) : null}
        </div>

        <div className={styles.card}>
          <Text fontSize="12px" fontWeight={600} className={styles.mutedTitle}>
            {t("CurrentMonthToDateSpend")}
          </Text>
          <BalanceAmount
            showRefresh={false}
            amount={walletMonthToDateSpend}
            currency={walletCodeCurrency}
            language={language}
            mainFontSize="18px"
            fractionFontSize="12px"
            withoutMargin
          />
          <Text fontSize="12px">{t("ForPeriod", { period: monthLabel })}</Text>
          {onViewUsage ? (
            <Link
              onClick={onViewUsage}
              textDecoration="underline"
              color="accent"
              fontWeight={600}
              className={styles.cardLink}
              dataTestId="overview_view_usage_link"
            >
              {t("ViewUsage")}
            </Link>
          ) : null}
        </div>

        <div className={styles.card}>
          <Text fontSize="12px" fontWeight={600} className={styles.mutedTitle}>
            {t("UpcomingPayments")}
          </Text>
          <Text fontSize="18px" fontWeight={700}>
            {formatWalletCurrency(upcomingTotal, 2, walletCodeCurrency)}
          </Text>
          {upcomingPayments.length === 0 ? (
            <Text fontSize="12px">{t("NoUpcomingPayments")}</Text>
          ) : upcomingSummary ? (
            <Text fontSize="12px" truncate>
              {upcomingSummary}
            </Text>
          ) : null}
          {onUpcomingDetails ? (
            <Link
              onClick={onUpcomingDetails}
              textDecoration="underline"
              color="accent"
              fontWeight={600}
              className={styles.cardLink}
              dataTestId="overview_upcoming_details_link"
            >
              {t("Details")}
            </Link>
          ) : null}
        </div>
      </div>

      {/* Add-ons / payment method */}
      <div className={styles.grid2}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <Text fontSize="16px" fontWeight={600}>
              {t("ActiveAddons")}
            </Text>
            {onManageAddons ? (
              <Link
                onClick={onManageAddons}
                textDecoration="underline"
                color="accent"
                fontWeight={600}
                dataTestId="overview_manage_addons_link"
              >
                {t("Manage")}
              </Link>
            ) : null}
          </div>
          {enabledAddons.length === 0 ? (
            <div className={styles.emptyState}>
              <Text fontSize="12px" className={styles.mutedTitle}>
                {t("NoActiveAddons")}
              </Text>
            </div>
          ) : (
            <div className={styles.rows}>
              {enabledAddons.map((feature) => {
                const usage = usageForService(feature.serviceName);
                return (
                  <div className={styles.row} key={feature.id}>
                    <div className={styles.addonLeft}>
                      <div
                        className={styles.addonIcon}
                        // biome-ignore lint/security/noDangerouslySetInnerHtml: service icon markup comes from the payment API
                        dangerouslySetInnerHTML={{ __html: feature.image ?? "" }}
                      />
                      <div className={styles.rowInfo}>
                        <Text fontSize="14px" fontWeight={600} truncate>
                          {feature.title}
                        </Text>
                        {usage ? (
                          <Text
                            fontSize="12px"
                            truncate
                            className={styles.mutedTitle}
                          >
                            {formatCompactNumber(usage.totalQuantity)}{" "}
                            {usage.serviceUnit}
                          </Text>
                        ) : null}
                      </div>
                    </div>
                    {usage ? (
                      <Text fontSize="14px" fontWeight={700}>
                        {formatWalletCurrency(
                          usage.totalAmount,
                          2,
                          usage.currency,
                        )}
                      </Text>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <Text fontSize="16px" fontWeight={600}>
              {t("PaymentMethod")}
            </Text>
            {onManagePaymentMethod ? (
              <Link
                onClick={onManagePaymentMethod}
                textDecoration="underline"
                color="accent"
                fontWeight={600}
                dataTestId="overview_manage_payment_method_link"
              >
                {t("Manage")}
              </Link>
            ) : null}
          </div>
          {isCardLinkedToPortal ? (
            <>
              <div className={styles.paymentLinkedCard}>
                <CardInformation scale withoutMargin />
              </div>
              <Text fontSize="12px" className={styles.mutedTitle}>
                {t("PaymentMethodOverviewHint")}
              </Text>
            </>
          ) : (
            <div className={styles.emptyState}>
              <Text fontSize="12px" className={styles.mutedTitle}>
                {t("NoPaymentMethod")}
              </Text>
            </div>
          )}
        </div>
      </div>

      {isTopUpDialogVisible ? (
        <SimpleTopUpDialog
          visible={isTopUpDialogVisible}
          onClose={() => setIsTopUpDialogVisible(false)}
          isFirstTopUp={!walletCustomerEmail}
          recommendedAmount={recommendedAmount}
        />
      ) : null}

      {isWalletRefilledOpen ? (
        <WalletRefilledModal
          visible={isWalletRefilledOpen}
          onClose={() => setIsWalletRefilledOpen(false)}
        />
      ) : null}
    </div>
  );
};

export default observer(BillingOverview);

