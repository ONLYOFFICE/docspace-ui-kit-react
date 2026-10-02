import { useState } from "react";
import { observer } from "mobx-react";
import { ProductQuantityType } from "@onlyoffice/docspace-api-sdk";

import { Text } from "../../../components/text";
import { Button, ButtonSize } from "../../../components/button";
import { useCommonTranslation } from "../../../utils/i18n";

import { usePaymentStore } from "../../store/PaymentStoreProvider";
import SimpleTopUpDialog from "../../shared/top-up-balance/SimpleTopUpDialogWrapper";
import { getConvertedSize } from "../../utils/common";
import { MANAGER, ROOM, TOTAL_SIZE } from "../../constants";

import styles from "../Overview.module.scss";

type CurrentPlanProps = {
  onEditPlan?: () => void;
  isMobile?: boolean;
};

const CurrentPlan = ({ onEditPlan, isMobile }: CurrentPlanProps) => {
  const t = useCommonTranslation();
  const store = usePaymentStore();

  const {
    formatPaymentCurrency,
    isCardMissingOrInactive,
    walletBalance,
    isLoading,
    setBasicTariffContainer,
    executeWalletUpdate,
  } = store;
  const {
    currentTariffPlanTitle,
    currentPlanCost,
    isFreeTariff,
    quotaCharacteristics,
    maxCountManagersByQuota,
  } = store.quotas;
  const { isGracePeriod, gracePeriodEndDate, isDelayedPaymentMethod } =
    store.tariff;
  const [isTopUpDialogVisible, setIsTopUpDialogVisible] = useState(false);
  const openTopUpDialog = () => setIsTopUpDialogVisible(true);
  const closeTopUpDialog = () => setIsTopUpDialogVisible(false);

  const limitValue = (id: string) =>
    quotaCharacteristics.find((f) => f.id === id)?.value ?? 0;

  const overduePlanCost = currentPlanCost?.value ?? 0;
  const planPrice = formatPaymentCurrency(overduePlanCost, 2);

  const isBalanceInsufficient =
    isGracePeriod && walletBalance < overduePlanCost;
  const isDelayedPaymentTopUp = isBalanceInsufficient && isDelayedPaymentMethod;
  const topUpShortfall = Math.max(
    0,
    Math.ceil(overduePlanCost - walletBalance),
  );

  const onRenewPlan = () => {
    setBasicTariffContainer();
    executeWalletUpdate(maxCountManagersByQuota, ProductQuantityType.Add, t);
  };

  const getPlanButtonLabel = () => {
    if (!isGracePeriod) return t("UpgradePlan");
    if (isDelayedPaymentTopUp) return t("TopUpWallet");
    if (isBalanceInsufficient) return t("TopUpAndRenew");
    return t("PayNow");
  };

  const getPlanButtonAction = () => {
    if (isDelayedPaymentTopUp) return openTopUpDialog;
    if (isGracePeriod) return onRenewPlan;
    return onEditPlan;
  };

  const planDetails = isFreeTariff
    ? t("PlanLimits", {
        admins: limitValue(MANAGER),
        rooms: limitValue(ROOM),
        storage: getConvertedSize(t, limitValue(TOTAL_SIZE)),
      })
    : isGracePeriod
      ? t("OverduePaymentBlockedAfter", {
          price: planPrice,
          date: gracePeriodEndDate,
        })
      : t("PlanCost", { admins: limitValue(MANAGER), price: planPrice });

  return (
    <div className={`${styles.card} ${styles.planCard}`}>
      <div className={styles.planInfo}>
        <Text fontSize="14px" fontWeight={700}>
          {t("CurrentPlan")}
        </Text>
        <Text fontSize="18px" fontWeight={700}>
          {currentTariffPlanTitle}
        </Text>
        <Text fontSize="12px">{planDetails}</Text>
      </div>
      {onEditPlan ? (
        <Button
          size={isMobile ? ButtonSize.normal : ButtonSize.small}
          label={getPlanButtonLabel()}
          onClick={getPlanButtonAction()}
          isDisabled={isGracePeriod && isCardMissingOrInactive}
          isLoading={isLoading}
          className={styles.planButton}
          testId="overview_edit_plan_button"
        />
      ) : null}

      {isTopUpDialogVisible ? (
        <SimpleTopUpDialog
          visible={isTopUpDialogVisible}
          onClose={closeTopUpDialog}
          minValue={topUpShortfall > 0 ? `${topUpShortfall}` : undefined}
        />
      ) : null}
    </div>
  );
};

export default observer(CurrentPlan);
