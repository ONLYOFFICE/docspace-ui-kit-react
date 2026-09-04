import { observer } from "mobx-react";
import { ProductQuantityType } from "@onlyoffice/docspace-api-sdk";

import { Text } from "../../../components/text";
import { Button, ButtonSize } from "../../../components/button";
import { useCommonTranslation } from "../../../utils/i18n";

import { usePaymentStore } from "../../store/PaymentStoreProvider";
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
  const { isGracePeriod, gracePeriodEndDate } = store.tariff;

  const limitValue = (id: string) =>
    quotaCharacteristics.find((f) => f.id === id)?.value ?? 0;

  const overduePlanCost = currentPlanCost?.value ?? 0;
  const planPrice = formatPaymentCurrency(overduePlanCost, 2);

  const isBalanceInsufficient =
    isGracePeriod && walletBalance < overduePlanCost;

  const onRenewPlan = () => {
    setBasicTariffContainer();
    executeWalletUpdate(maxCountManagersByQuota, ProductQuantityType.Add, t);
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
          label={
            isGracePeriod
              ? isBalanceInsufficient
                ? t("TopUpAndRenew")
                : t("PayNow")
              : t("UpgradePlan")
          }
          onClick={isGracePeriod ? onRenewPlan : onEditPlan}
          isDisabled={isGracePeriod && isCardMissingOrInactive}
          isLoading={isLoading}
          className={styles.planButton}
          testId="overview_edit_plan_button"
        />
      ) : null}
    </div>
  );
};

export default observer(CurrentPlan);
