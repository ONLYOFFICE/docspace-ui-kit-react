import React, { useState, useEffect } from "react";
import { useCommonTranslation } from "../../../../utils/i18n";
import { CommonTrans } from "../../../../utils/i18n/CommonTrans";
import { observer } from "mobx-react";

import { Text } from "../../../../components/text";
import { Link, LinkTarget } from "../../../../components/link";
import { RectangleSkeleton } from "../../../../components/rectangle";

import { TenantWalletService } from "@onlyoffice/docspace-api-sdk";
import { AI_ENUM, AI_TOOLS } from "../../../constants";
import { formatCompactNumber } from "../../../utils/common";

import TransactionHistory from "../../../shared/transaction-history";

import ServiceToggleSection from "../../sub-components/ServiceToggleSection";
import ConfirmationDialog from "../../sub-components/ConfirmationDialog";

import AiPageLoader from "./AiPageLoader";

import SpendAmount from "../../../shared/spend-amount";
import styles from "./AiPage.module.scss";
import {
  now,
  formatWithTimezone,
  getAppTimezone,
} from "../../../../utils/date";
import { useApi } from "../../../../providers/api";
import { toastr } from "../../../../components";
import SimpleTopUpDialog from "../../../shared/top-up-balance/SimpleTopUpDialogWrapper";
import WalletInfo from "../../../shared/top-up-balance/sub-components/WalletInfo";
import UnlinkedCardBanner from "../../../shared/unlinked-card-banner";

import { usePaymentStore } from "../../../store/PaymentStoreProvider";
import { useServicesStore } from "../../../store/ServicesStoreProvider";

type AiPageProps = {
  currentDeviceType?: string;
  getAIConfig?: () => Promise<void>;
  integrationUrl?: string;
  withoutWallet?: boolean;
  simpleTopUp?: boolean;
  withBottomMargin?: boolean;
  onViewMore?: () => void;
  onOpenSupportedModels?: () => void;
};

const AiPage = (props: AiPageProps) => {
  const {
    getAIConfig,
    integrationUrl,
    withoutWallet,
    withBottomMargin,
    onViewMore,
    onOpenSupportedModels,
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
    showUnlinkedCardBanner,
  } = paymentStore;

  const { logoText, language } = paymentStore;

  const { isInitServicesData, initServiceData, aiUsage, isServiceDataPending } =
    servicesStore;

  const t = useCommonTranslation();

  const isUsageLoading = isServiceDataPending(AI_TOOLS);

  const [isTopUpVisible, setIsTopUpVisible] = useState(false);
  const [isTopUpConfirmVisible, setIsTopUpConfirmVisible] = useState(false);

  const isDisabled = isServiceActionDisabled!;

  useEffect(() => {
    initServiceData(t, AI_TOOLS, AI_ENUM, integrationUrl);
  }, []);

  useEffect(() => {
    if (!isInitServicesData) return;

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
  }, [isInitServicesData]);

  const onToggleChange = () => {
    onConfirm();
  };

  const onConfirm = async () => {
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
      {isTopUpVisible ? (
        <SimpleTopUpDialog
          visible={isTopUpVisible}
          onClose={onCloseTopUp}
          serviceName={AI_TOOLS}
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
        <>
          <WalletInfo
            withoutBackground
            balance={balance}
            onTopUp={onOpenTopUp}
          />
          {showUnlinkedCardBanner ? (
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
              dataTestId="ai_view_more_link"
            >
              {t("ViewMore")}
            </Link>
          ) : null}
        </div>

        <div className={styles.cardsGrid}>
          <div className={styles.card}>
            <Text className={styles.cardLabel}>{t("MonthSpend")}</Text>
            {isUsageLoading ? (
              <RectangleSkeleton
                width="80px"
                height="24px"
                borderRadius="3px"
              />
            ) : (
              <SpendAmount
                amount={monthSpend}
                className={styles.cardValue}
                fontSize="18px"
                fontWeight={700}
                tooltipId="ai-tools-month-spend"
              />
            )}
            <Text className={styles.cardCaption}>
              {t("ForPeriod", { period: monthLabel })}
            </Text>
          </div>

          <div className={styles.card}>
            <Text className={styles.cardLabel}>{t("MonthUsage")}</Text>
            {isUsageLoading ? (
              <RectangleSkeleton
                width="80px"
                height="24px"
                borderRadius="3px"
              />
            ) : (
              <Text className={styles.cardValue}>{monthTokensText}</Text>
            )}
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
                target={LinkTarget.blank}
              />
            ),
            2: (
              <Link
                fontSize="13px"
                fontWeight={600}
                color="accent"
                textDecoration="underline dotted"
                onClick={onOpenSupportedModels}
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

