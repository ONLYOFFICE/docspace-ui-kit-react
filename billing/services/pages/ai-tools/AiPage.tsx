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
import { Link } from "../../../../components/link";

import { TenantWalletService } from "@onlyoffice/docspace-api-sdk";
import { AI_ENUM, AI_TOOLS } from "../../../constants";
import { formatCompactNumber } from "../../../utils/common";

import TransactionHistory from "../../../shared/transaction-history";

import ServiceToggleSection from "../../sub-components/ServiceToggleSection";
import ConfirmationDialog from "../../sub-components/ConfirmationDialog";
import PricingBillingBody from "../../panels/ai-service/PricingBillingBody";

import AiPageLoader from "./AiPageLoader";

import styles from "./AiPage.module.scss";
import {
  now,
  formatWithTimezone,
  getAppTimezone,
} from "../../../../utils/date";
import { useApi } from "../../../../providers";
import { toastr } from "../../../../components";
import SimpleTopUpDialog from "../../../shared/top-up-balance/SimpleTopUpDialog";
import WalletInfo from "../../../shared/top-up-balance/sub-components/WalletInfo";

import { usePaymentStore } from "../../../store/PaymentStoreProvider";
import { useServicesStore } from "../../../store/ServicesStoreProvider";
import { getBrandName } from "../../../../constants/brands";

type AiPageProps = {
  currentDeviceType?: string;
  getAIConfig?: () => Promise<void>;
  integrationUrl?: string;
  withoutWallet?: boolean;
  simpleTopUp?: boolean;
  withBottomMargin?: boolean;
  onViewMore?: () => void;
};

const AiPage = (props: AiPageProps) => {
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
    isAiToolsServiceOn,
    isServiceActionDisabled,
    formatWalletCurrency,
    isLowWalletBalance,
  } = paymentStore;

  const { logoText, language } = paymentStore;

  const {
    aiServiceCodeCurrency,
    aiServiceBalance,
    formatAiServiceCurrency,
    isInitServicesData,
    initServiceData,
    aiUsage,
  } = servicesStore;

  const t = useCommonTranslation();

  const [isPricingBillingVisible, setIsPricingBillingVisible] = useState(false);
  const [isTopUpVisible, setIsTopUpVisible] = useState(false);
  const [isConfirmDialogVisible, setIsConfirmDialogVisible] = useState(false);
  const [isTopUpConfirmVisible, setIsTopUpConfirmVisible] = useState(false);

  const isDisabled = isServiceActionDisabled!;

  useEffect(() => {
    if (!isInitServicesData) {
      initServiceData(t, AI_TOOLS, AI_ENUM, integrationUrl);
    }

    const params = new URLSearchParams(window.location.search);
    if (params.get("activate") !== AI_TOOLS) return;

    if (
      !paymentStore.isAiToolsServiceOn &&
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
  }, []);

  const onToggleChange = () => {
    onConfirm();
  };

  const onCloseConfirmDialog = () => {
    setIsConfirmDialogVisible(false);
  };

  const onConfirm = async () => {
    setIsConfirmDialogVisible(false);

    const raw = {
      service: TenantWalletService.AITools,
      enabled: !isAiToolsServiceOn,
    };

    changeServiceState(AI_ENUM);

    try {
      const result = await paymentApi.changeTenantWalletServiceState({
        changeWalletServiceStateRequestDto: raw,
      });

      if (!result) {
        toastr.error(t("UnexpectedError"));
        changeServiceState(AI_ENUM);
        return;
      }

      if (!isAiToolsServiceOn) toastr.success(t("AIToolsEnabled"));

      await getAIConfig?.();
    } catch (error) {
      console.error(error);
      toastr.error(t("UnexpectedError"));
      changeServiceState(AI_ENUM);
    }
  };

  const confirmationDialogContent = isAiToolsServiceOn
    ? {
        title: t("Confirmation"),
        body: [
          t("DisableAIToolsConfirm", {
            organizationName: logoText,
          }),
          <CommonTrans
            key="DisableAIToolsConfirmBalance"
            i18nKey="DisableAIToolsConfirmBalance"
            values={{
              balance: formatAiServiceCurrency(
                aiServiceBalance ?? 0,
                3,
                aiServiceCodeCurrency,
              ),
            }}
            components={{
              1: <span style={{ fontWeight: 600 }} />,
            }}
          />,
          t("DisableAIToolsConfirmReEnable"),
        ],
      }
    : {
        title: t("Confirmation"),
        body: [
          t("AIToolsDescription", {
            productName: getBrandName("ProductName"),
            organizationName: logoText,
          }),
          t("WantToContinue"),
        ],
      };

  const onOpenPricingBilling = () => {
    setIsPricingBillingVisible(true);
  };

  const onClosePricingBilling = () => {
    setIsPricingBillingVisible(false);
  };

  const onOpenTopUp = () => {
    // if (!isAiToolsServiceOn && !simpleTopUp) {
    //   setIsTopUpConfirmVisible(true);
    //   return;
    // }

    setIsTopUpVisible(true);
  };

  const onCloseTopUpConfirm = () => {
    setIsTopUpConfirmVisible(false);
  };

  const onConfirmTopUp = () => {
    setIsTopUpConfirmVisible(false);
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
      <PricingBillingBody
        visible={isPricingBillingVisible}
        onClose={onClosePricingBilling}
        isBackButton={false}
        withoutFooter
      />

      {isTopUpVisible ? (
        <SimpleTopUpDialog
          visible={isTopUpVisible}
          onClose={onCloseTopUp}
          isFirstTopUp={!paymentStore.tariff.walletCustomerEmail}
        />
      ) : null}

      <ServiceToggleSection
        isEnabled={isAiToolsServiceOn}
        onToggle={onToggleChange}
        title={t("EnableAIFeatures")}
        description={t("EnableAIFeaturesDescription")}
        testId="service-ai-toggle-button"
        isDisabled={isDisabled}
        withBottomMargin={withBottomMargin}
      />

      {isAiToolsServiceOn && isLowWalletBalance ? (
        <Text fontSize="15px" fontWeight={600} className={styles.lowBalance}>
          {t("LowCreditsBalance")}
        </Text>
      ) : null}

      {withoutWallet ? null : (
        <WalletInfo withoutBackground balance={balance} onTopUp={onOpenTopUp} />
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
              dataTestId="ai_view_more_link"
            >
              {t("ViewMore")}
            </Link>
          ) : null}
        </div>

        <div className={styles.cardsGrid}>
          <div className={styles.card}>
            <Text className={styles.cardLabel}>{t("MonthSpend")}</Text>
            <Text className={styles.cardValue}>
              {formatWalletCurrency(monthSpend, 2)}
            </Text>
            <Text className={styles.cardCaption}>
              {t("ChargedFromCredits")}
            </Text>
          </div>

          <div className={styles.card}>
            <Text className={styles.cardLabel}>{t("MonthUsage")}</Text>
            <Text className={styles.cardValue}>{monthTokensText}</Text>
            <Text className={styles.cardCaption}>
              {t("TokensProcessedInMonth", { month: monthLabel })}
            </Text>
          </div>
        </div>
      </div>

      <Text as="span" fontSize="13px" className={styles.pricingRow}>
        <CommonTrans
          i18nKey="AIUsagePricingNote"
          components={{
            1: (
              <Link
                fontSize="13px"
                fontWeight={600}
                color="accent"
                textDecoration="underline dotted"
                href="https://openrouter.ai/models"
                dataTestId="ai_openrouter_pricing_link"
              />
            ),
            2: (
              <Link
                fontSize="13px"
                fontWeight={600}
                color="accent"
                textDecoration="underline dotted"
                onClick={onOpenPricingBilling}
                dataTestId="ai_supported_models_link"
              />
            ),
          }}
        />
      </Text>

      <div>
        <TransactionHistory
          serviceName={AI_TOOLS}
          withoutRoleFilter
          hideTypeFilter
        />
      </div>

      {isConfirmDialogVisible ? (
        <ConfirmationDialog
          visible={isConfirmDialogVisible}
          onClose={onCloseConfirmDialog}
          onConfirm={onConfirm}
          title={confirmationDialogContent.title}
          bodyText={confirmationDialogContent.body}
        />
      ) : null}

      {isTopUpConfirmVisible ? (
        <ConfirmationDialog
          visible={isTopUpConfirmVisible}
          onClose={onCloseTopUpConfirm}
          onConfirm={onConfirmTopUp}
          title={t("ServiceIsDisabled")}
          bodyText={t("AddCreditsToEnableAI", { organizationName: logoText })}
        />
      ) : null}
    </div>
  );
};

export default observer(AiPage);

