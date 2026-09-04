import { useState } from "react";
import { observer } from "mobx-react";
import { DateTime } from "luxon";

import { Button, ButtonSize } from "../../../components/button";
import { Text } from "../../../components/text";
import { toastr } from "../../../components/toast";
import { useCommonTranslation } from "../../../utils/i18n";
import { CommonTrans } from "../../../utils/i18n/CommonTrans";
import { getAppTimezone } from "../../../utils/date";

import { usePaymentStore } from "../../store/PaymentStoreProvider";
import { finishRefreshingWithMinCycle } from "../../utils/refreshing";
import BalanceAmount from "../../shared/balance-amount";
import UnlinkedCardBanner from "../../shared/unlinked-card-banner";
import AutoPaymentInfo from "../../wallet/sub-components/AutoPaymentInfo";
import SimpleTopUpDialog from "../../shared/top-up-balance/SimpleTopUpDialogWrapper";
import WalletRefilledModal from "../../wallet/WalletRefilledModal";

import WarningIcon from "../../../assets/danger.toast.react.svg";

import styles from "../Overview.module.scss";

type AvailableCreditsProps = {
  isMobile?: boolean;
};

const AvailableCredits = ({ isMobile }: AvailableCreditsProps) => {
  const t = useCommonTranslation();
  const store = usePaymentStore();

  const {
    formatPaymentCurrency,
    walletBalance,
    walletCodeCurrency,
    isCardLinkedToPortal,
    isPayer,
    recommendedAmount,
    fetchBalance,
    isAutoPaymentExist,
    autoPayments,
    wasFirstTopUp,
    language,
    formatWalletCurrency,
    upcomingPayments,
    showUnlinkedCardBanner,
    isLoading,
  } = store;

  const { isNotPaidPeriod, isGracePeriod, gracePeriodEndDate } = store.tariff;
  const overduePlanCost = store.quotas.currentPlanCost?.value ?? 0;
  const graceShortfall = overduePlanCost - walletBalance;

  const toDueDay = (dueDate: string) =>
    DateTime.fromISO(dueDate).setZone(getAppTimezone()).toISODate();

  const nextPayment = upcomingPayments[0];
  const nextDueDay = nextPayment && toDueDay(nextPayment.dueDate);
  const nextPaymentsTotal = upcomingPayments
    .filter((item) => toDueDay(item.dueDate) === nextDueDay)
    .reduce((sum, item) => sum + item.amount, 0);
  const topUpShortfall = nextPayment ? nextPaymentsTotal - walletBalance : 0;

  const isNextPayment = nextPayment && topUpShortfall > 0;

  const [isTopUpDialogVisible, setIsTopUpDialogVisible] = useState(false);
  const [isWalletRefilledOpen, setIsWalletRefilledOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const isAutoPaymentSetup = Boolean(
    isAutoPaymentExist &&
    language &&
    walletCodeCurrency &&
    autoPayments?.minBalance &&
    autoPayments?.upToBalance,
  );

  const onRefreshBalance = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    const startTime = Date.now();

    try {
      await Promise.all([
        fetchBalance?.(true),
        store.tariff.fetchCustomerInfo(true),
      ]);
    } catch (e) {
      toastr.error(e as Error);
    } finally {
      finishRefreshingWithMinCycle({
        startTime,
        setRefreshing: setIsRefreshing,
      });
    }
  };

  const renderStatusBanner = () => {
    if (showUnlinkedCardBanner)
      return (
        <div className={styles.unlinkedBannerWrap}>
          <UnlinkedCardBanner />
        </div>
      );

    if (isGracePeriod && graceShortfall > 0 && !isLoading)
      return (
        <div className={styles.topUpWarning}>
          <WarningIcon className={styles.topUpWarningIcon} />
          <Text
            as="span"
            fontSize="12px"
            fontWeight={600}
            lineHeight="16px"
            className={styles.topUpWarningText}
          >
            {t("InsufficientCreditsTopUpToday", {
              amount: formatPaymentCurrency(graceShortfall, 2),
              date: gracePeriodEndDate,
            })}
          </Text>
        </div>
      );

    if (isNextPayment && !isLoading)
      return (
        <div className={styles.topUpWarning}>
          <WarningIcon className={styles.topUpWarningIcon} />
          <Text
            as="span"
            fontSize="12px"
            fontWeight={600}
            lineHeight="16px"
            className={styles.topUpWarningText}
          >
            {t("TopUpBeforeNextPayment", {
              amount: formatWalletCurrency(
                Math.ceil(topUpShortfall),
                0,
                walletCodeCurrency,
              ),
              date: nextPayment.renewalDateShort,
            })}
          </Text>
        </div>
      );

    if (isAutoPaymentSetup)
      return (
        <div className={styles.autoPaymentWrap}>
          <AutoPaymentInfo />
        </div>
      );

    return null;
  };

  return (
    <div className={`${styles.card} ${styles.creditsCard}`}>
      <div className={styles.creditsTop}>
        <BalanceAmount
          className={styles.creditsBalance}
          title={t("AvailableCredits")}
          titleFontSize="14px"
          mainFontSize="28px"
          fractionFontSize="20px"
          showRefresh={!isNotPaidPeriod && isCardLinkedToPortal}
          isRefreshing={isRefreshing}
          onRefresh={onRefreshBalance}
          amount={walletBalance}
          currency={walletCodeCurrency}
          language={language}
          withoutMargin
        />
        {isPayer ? (
          <div className={styles.cardButtons}>
            <Button
              size={isMobile ? ButtonSize.normal : ButtonSize.small}
              primary
              label={t("TopUp")}
              onClick={() => setIsTopUpDialogVisible(true)}
              isDisabled={isNotPaidPeriod}
              className={styles.cardButton}
              testId="overview_top_up_button"
            />
            {wasFirstTopUp && !isGracePeriod ? (
              <Button
                size={isMobile ? ButtonSize.normal : ButtonSize.small}
                label={t("AutoTopUp")}
                onClick={() => setIsWalletRefilledOpen(true)}
                isDisabled={isNotPaidPeriod}
                className={styles.cardButton}
                testId="overview_auto_top_up_button"
              />
            ) : null}
          </div>
        ) : null}
      </div>

      {renderStatusBanner()}

      {isTopUpDialogVisible ? (
        <SimpleTopUpDialog
          visible={isTopUpDialogVisible}
          onClose={() => setIsTopUpDialogVisible(false)}
          recommendedAmount={recommendedAmount}
          minValue={isGracePeriod ? String(overduePlanCost) : undefined}
          descriptionText={
            isGracePeriod ? t("TopUpCoverOverdueDescription") : undefined
          }
          helperText={
            isGracePeriod ? (
              <CommonTrans
                i18nKey="TopUpCoverOverdueHint"
                values={{ price: formatPaymentCurrency(overduePlanCost, 2) }}
                components={{ 1: <Text as="span" fontWeight={600} /> }}
              />
            ) : undefined
          }
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

export default observer(AvailableCredits);

