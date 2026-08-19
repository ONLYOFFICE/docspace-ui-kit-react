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

import React, { useState, useEffect } from "react";
import { useCommonTranslation } from "../../../../utils/i18n";
import { CommonTrans } from "../../../../utils/i18n/CommonTrans";
import { observer } from "mobx-react";

import { Text } from "../../../../components/text";
import { Link, LinkTarget } from "../../../../components/link";

import { TenantWalletService } from "@onlyoffice/docspace-api-sdk";
import { AI_ENUM, AI_SEARCH, AI_SEARCH_ENUM } from "../../../constants";
import { formatCompactNumber } from "../../../utils/common";

import TransactionHistory from "../../../shared/transaction-history";

import ServiceToggleSection from "../../sub-components/ServiceToggleSection";
import ConfirmationDialog from "../../sub-components/ConfirmationDialog";

import AiPageLoader from "../ai-tools/AiPageLoader";

import SpendAmount from "../../../shared/spend-amount";
import styles from "../ai-tools/AiPage.module.scss";
import {
  now,
  formatWithTimezone,
  getAppTimezone,
} from "../../../../utils/date";
import { useApi } from "../../../../providers";
import { toastr } from "../../../../components";
import SimpleTopUpDialog from "../../../shared/top-up-balance/SimpleTopUpDialogWrapper";
import WalletInfo from "../../../shared/top-up-balance/sub-components/WalletInfo";
import UnlinkedCardBanner from "../../../shared/unlinked-card-banner";

import { usePaymentStore } from "../../../store/PaymentStoreProvider";
import { useServicesStore } from "../../../store/ServicesStoreProvider";

// AI search isn't part of the SDK's TenantWalletService enum yet; the backend
// identifies it by -18.
const AI_SEARCH_WALLET_SERVICE = -18 as TenantWalletService;

type AiSearchPageProps = {
  currentDeviceType?: string;
  getAIConfig?: () => Promise<void>;
  integrationUrl?: string;
  withoutWallet?: boolean;
  simpleTopUp?: boolean;
  withBottomMargin?: boolean;
  onViewMore?: () => void;
};

const AiSearchPage = (props: AiSearchPageProps) => {
  const {
    getAIConfig,
    integrationUrl,
    withoutWallet,
    withBottomMargin,
    onViewMore,
  } = props;

  const { paymentApi } = useApi();
  const paymentStore = usePaymentStore();
  const servicesStore = useServicesStore();

  const {
    changeServiceState,
    isAiSearchServiceOn,
    isAiToolsServiceOn,
    isServiceActionDisabled,
    formatWalletCurrency,
  } = paymentStore;

  const { language } = paymentStore;

  const { isInitServicesData, initServiceData, aiUsage } = servicesStore;

  const t = useCommonTranslation();

  const [isTopUpVisible, setIsTopUpVisible] = useState(false);
  const [isEnableAIToolsDialogVisible, setIsEnableAIToolsDialogVisible] =
    useState(false);

  const isDisabled = isServiceActionDisabled!;

  useEffect(() => {
    initServiceData(t, AI_SEARCH, AI_SEARCH_ENUM, integrationUrl);
  }, []);

  useEffect(() => {
    if (!isInitServicesData) return;

    const params = new URLSearchParams(window.location.search);

    if (params.get("activate") !== AI_SEARCH) return;

    if (
      !paymentStore.isAiSearchServiceOn &&
      paymentStore.isCardLinkedToPortal &&
      !paymentStore.isServiceActionDisabled
    ) {
      onConfirm();
    }

    params.delete("activate");
    const query = params.toString();
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}${query ? `?${query}` : ""}`,
    );
  }, [isInitServicesData]);

  const applyServiceStateChange = async (
    enumId: string,
    walletService: TenantWalletService,
    enabled: boolean,
  ) => {
    changeServiceState(enumId);

    try {
      const result = await paymentApi.changeTenantWalletServiceState({
        changeWalletServiceStateRequestDto: { service: walletService, enabled },
      });

      if (!result) {
        toastr.error(t("UnexpectedError"));
        changeServiceState(enumId);
        return false;
      }

      if (enabled && enumId === AI_SEARCH_ENUM)
        toastr.success(t("AISearchEnabled"));

      await getAIConfig?.();
      return true;
    } catch (error) {
      console.error(error);
      toastr.error(t("UnexpectedError"));
      changeServiceState(enumId);
      return false;
    }
  };

  const onConfirm = () =>
    applyServiceStateChange(
      AI_SEARCH_ENUM,
      AI_SEARCH_WALLET_SERVICE,
      !isAiSearchServiceOn,
    );

  const onToggleChange = () => {
    // Enabling AI search requires AI tools; ask to enable them first.
    if (!isAiSearchServiceOn && !isAiToolsServiceOn) {
      setIsEnableAIToolsDialogVisible(true);
      return;
    }

    onConfirm();
  };

  const onConfirmEnableAITools = async () => {
    setIsEnableAIToolsDialogVisible(false);

    const aiToolsEnabled = await applyServiceStateChange(
      AI_ENUM,
      TenantWalletService.AITools,
      true,
    );
    if (!aiToolsEnabled) return;

    await applyServiceStateChange(
      AI_SEARCH_ENUM,
      AI_SEARCH_WALLET_SERVICE,
      true,
    );
  };

  const onOpenTopUp = () => {
    setIsTopUpVisible(true);
  };

  const onCloseTopUp = () => {
    setIsTopUpVisible(false);
  };

  if (!isInitServicesData) return <AiPageLoader />;

  const balance = formatWalletCurrency();

  const monthSpend = aiUsage?.totalAmount ?? 0;
  const monthTokens = aiUsage?.totalQuantity ?? 0;
  const monthTokensText = formatCompactNumber(monthTokens, language);
  const monthLabel = formatWithTimezone(now(), "LLLL yyyy", {
    locale: language,
    timezone: getAppTimezone(),
  });

  return (
    <div className={styles.container}>
      {isTopUpVisible ? (
        <SimpleTopUpDialog
          visible={isTopUpVisible}
          onClose={onCloseTopUp}
          serviceName={AI_SEARCH}
          service={AI_SEARCH}
        />
      ) : null}

      <ServiceToggleSection
        isEnabled={isAiSearchServiceOn}
        onToggle={onToggleChange}
        title={t("AISearch")}
        description={t("EnableAISearchDescription")}
        testId="service-ai-search-toggle-button"
        isDisabled={isDisabled}
        withBottomMargin={withBottomMargin}
      />

      {withoutWallet ? null : (
        <>
          <WalletInfo
            withoutBackground
            balance={balance}
            onTopUp={onOpenTopUp}
          />
          {!paymentStore.tariff.isNotPaidPeriod &&
          paymentStore.tariff.walletCustomerStatusNotActive ? (
            <div className={styles.unlinkedBanner}>
              <UnlinkedCardBanner />
            </div>
          ) : null}
        </>
      )}

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <Text fontWeight="700" fontSize="14px">
            {t("Usage")}
          </Text>
          {onViewMore ? (
            <Link
              className={styles.viewMoreLink}
              fontSize="13px"
              fontWeight="600"
              color="accent"
              textDecoration="underline"
              onClick={onViewMore}
              dataTestId="ai_search_view_more_link"
            >
              {t("ViewMore")}
            </Link>
          ) : null}
        </div>

        <div className={styles.cardsGrid}>
          <div className={styles.card}>
            <Text className={styles.cardLabel}>{t("MonthSpend")}</Text>
            <SpendAmount
              amount={monthSpend}
              className={styles.cardValue}
              fontSize="18px"
              fontWeight={700}
              tooltipId="ai-search-month-spend"
            />
            <Text className={styles.cardCaption}>
              {t("AISearchSpendMonth", { month: monthLabel })}
            </Text>
          </div>

          <div className={styles.card}>
            <Text className={styles.cardLabel}>{t("MonthUsage")}</Text>
            <Text className={styles.cardValue}>{monthTokensText}</Text>
            <Text className={styles.cardCaption}>
              {monthTokens > 0
                ? t("BilledAISearch", { count: monthTokens })
                : t("AISearchUsedInMonth", { month: monthLabel })}
            </Text>
          </div>
        </div>
      </div>

      <Text as="span" fontSize="13px" className={styles.pricingRow}>
        <CommonTrans
          i18nKey="AIExaPricingNote"
          components={{
            1: (
              <Link
                fontSize="13px"
                fontWeight={600}
                color="accent"
                textDecoration="underline dotted"
                href="https://exa.ai/pricing"
                dataTestId="ai_search_exa_pricing_link"
                target={LinkTarget.blank}
              />
            ),
          }}
        />
      </Text>

      <div>
        <TransactionHistory
          serviceName={AI_SEARCH}
          withoutRoleFilter
          hideTypeFilter
          emptyTitle={t("NoAISearchTransactions")}
          emptyDescription={t("NoAISearchTransactionsDescription")}
        />
      </div>

      {isEnableAIToolsDialogVisible ? (
        <ConfirmationDialog
          visible={isEnableAIToolsDialogVisible}
          onClose={() => setIsEnableAIToolsDialogVisible(false)}
          onConfirm={onConfirmEnableAITools}
          title={t("ActivateAIFeatures")}
          bodyText={[
            t("AISearchRequiresAIFeatures"),
            t("EnableAISearchDescription"),
          ]}
          acceptLabel={t("Activate")}
        />
      ) : null}
    </div>
  );
};

export default observer(AiSearchPage);

