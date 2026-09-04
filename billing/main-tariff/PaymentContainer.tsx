import HelpReactSvg from "../../assets/help.react.svg";
import React, { useState } from "react";
import { CommonTrans } from "../../utils/i18n/CommonTrans";
import { observer } from "mobx-react";

import { Text } from "../../components/text";

import { HelpButton } from "../../components/help-button";

import type { TTranslation } from "../../utils/common";

import { usePaymentStore } from "../store/PaymentStoreProvider";
import { useApi } from "../../providers/api";
import { toastr } from "../../components/toast";
import { ProductQuantityType } from "@onlyoffice/docspace-api-sdk";

import CurrentTariffContainer from "./CurrentTariffContainer";
import PriceCalculation from "./PriceCalculation";
import BenefitsContainer from "./BenefitsContainer";
import ContactContainer from "./ContactContainer";
import WalletInfo from "../shared/top-up-balance/sub-components/WalletInfo";
import SimpleTopUpDialog from "../shared/top-up-balance/SimpleTopUpDialogWrapper";
import StorageWarning from "../services/panels/additional-storage/StorageWarning";
import UnlinkedCardBanner from "../shared/unlinked-card-banner";
import styles from "./MainTariff.module.scss";
import { getBrandName } from "../../constants/brands";

const PaymentContainer = observer(({ t }: { t: TTranslation }) => {
  const { paymentApi } = useApi();
  const store = usePaymentStore();
  const {
    formatPaymentCurrency,
    formatFuturePaymentCurrency,
    getTotalCostByFormula,
    isAlreadyPaid,
    cardLinkedOnFreeTariff,
    formatWalletCurrency,
  } = store;

  const [isTopUpVisible, setIsTopUpVisible] = useState(false);
  const [isCancelDowngradeLoading, setIsCancelDowngradeLoading] =
    useState(false);

  const onTopUp = () => setIsTopUpVisible(true);
  const onCloseTopUp = () => setIsTopUpVisible(false);

  const {
    isFreeTariff,
    isNonProfit,
    currentTariffPlanTitle,
    isYearTariff,
    maxCountManagersByQuota,
    fetchPortalQuota,
  } = store.quotas;
  const {
    isPaidPeriod,
    isPaymentDateValid,
    isGracePeriod,
    isNotPaidPeriod,
    gracePeriodEndDate,
    delayDaysCount,
    paymentDate,
    hasScheduledTariffAdminsChange,
    currentTariffAdminsCount,
    nextTariffAdminsCount,
    fetchPortalTariff,
  } = store.tariff;
  const { fetchBalance, showUnlinkedCardBanner } = store;
  const { tariffPlanTitle, planCost } = store.paymentQuotas;

  const startValue = planCost.value;

  const handleCancelTariffDowngrade = async () => {
    setIsCancelDowngradeLoading(true);

    try {
      const res = await paymentApi.updateWalletPayment({
        walletQuantityRequestDto: {
          quantity: { adminwallet: null },
          productQuantityType: ProductQuantityType.Set,
        },
      });
      if (res?.data?.response === false) {
        toastr.error(t("ErrorNotification"));
        return;
      }
      await Promise.all([
        fetchPortalTariff(true),
        fetchBalance(true),
        fetchPortalQuota(true),
      ]);
      toastr.success(
        t("BusinessUpdated", { planName: currentTariffPlanTitle }),
      );
    } catch (e) {
      console.error(e);
      toastr.error(t("ErrorNotification"));
    } finally {
      setIsCancelDowngradeLoading(false);
    }
  };

  const renderTooltip = () => {
    return (
      <HelpButton
        className="payment-tooltip"
        offsetRight={0}
        iconNode={<HelpReactSvg />}
        tooltipContent={
          <>
            <Text isBold>{t("ManagerTypesDescription")}</Text>
            <br />
            <Text isBold>
              {t("PortalAdmin")}
            </Text>
            <Text>
              {t("AdministratorDescription")}
            </Text>
            <br />
            <Text isBold>{t("RoomAdmin")}</Text>
            <Text>{t("RoomManagerDescription")}</Text>
          </>
        }
        dataTestId="admin_accounts_help_button"
      />
    );
  };

  const currentPlanTitle = () => {
    if (isFreeTariff) {
      return (
        <Text fontSize="16px" isBold>
          <CommonTrans
            i18nKey="StartupTitle"
            values={{ planName: currentTariffPlanTitle }}
          />
        </Text>
      );
    }

    if (isPaidPeriod || isGracePeriod) {
      return (
        <Text fontSize="16px" isBold>
          <CommonTrans
            i18nKey="BusinessTitle"
            values={{ planName: currentTariffPlanTitle }}
          />
        </Text>
      );
    }
  };

  const expiredTitleSubscriptionWarning = () => {
    return (
      <Text
        fontSize="16px"
        isBold
        color="var(--settings-payment-warning-color)"
        dataTestId="expired_subscription_text"
      >
        <CommonTrans
          i18nKey="BusinessExpired"
          values={{ date: gracePeriodEndDate, planName: tariffPlanTitle }}
        />
      </Text>
    );
  };

  const planSuggestion = () => {
    if (isFreeTariff && !isNonProfit) {
      return (
        <Text fontSize="16px" isBold className={styles.paymentInfoSuggestion}>
          <CommonTrans
            i18nKey="StartupSuggestion"
            values={{ planName: tariffPlanTitle }}
          />
        </Text>
      );
    }

    if (isPaidPeriod && !isNonProfit) {
      return (
        <Text fontSize="16px" isBold className={styles.paymentInfoSuggestion}>
          <CommonTrans
            i18nKey="BusinessSuggestion"
            values={{ planName: tariffPlanTitle }}
          />
        </Text>
      );
    }

    if (isGracePeriod) {
      return (
        <Text
          fontSize="16px"
          isBold
          className={styles.paymentInfoGracePeriod}
          color="var(--settings-payment-warning-color)"
        >
          {t("PaymentDelayActive")}
        </Text>
      );
    }
  };

  const planDescription = () => {
    if (isFreeTariff) return;

    if (isGracePeriod)
      return (
        <Text fontSize="14px" lineHeight="16px">
          <CommonTrans
            i18nKey="GracePeriodActivatedNotice"
            values={{
              fromDate: paymentDate,
              byDate: gracePeriodEndDate,
              delayDaysCount,
              productName: getBrandName("ProductName"),
            }}
            components={{
              1: <Text as="span" fontWeight={600} />,
            }}
          />
        </Text>
      );

    if (isPaidPeriod && isPaymentDateValid && !isNonProfit)
      return (
        <Text
          fontSize="14px"
          lineHeight="16px"
          className={styles.paymentInfoManagersPrice}
        >
          {hasScheduledTariffAdminsChange && nextTariffAdminsCount? (
            <CommonTrans
              i18nKey="BusinessRenewalPricingInfo"
              values={{
                finalDate: paymentDate,
                price: formatFuturePaymentCurrency(
                  getTotalCostByFormula(nextTariffAdminsCount),
                ),
                adminsCount: nextTariffAdminsCount,
                perAdminPrice: formatPaymentCurrency(startValue),
              }}
              components={{ 1: <Text fontWeight={600} as="span" /> }}
            />
          ) : (
            <CommonTrans
              i18nKey="BusinessRenewalNotice"
              values={{ finalDate: paymentDate }}
            />
          )}
          &nbsp;
          <HelpButton
            className="payment-tooltip"
            offsetRight={0}
            iconNode={<HelpReactSvg />}
            style={{ display: "inline-block", verticalAlign: "middle" }}
            tooltipContent={<Text>{t("RenewalChargeOrderTooltip")}</Text>}
            dataTestId="renewal_charge_order_help_button"
          />
        </Text>
      );
  };

  return (
    <div className={styles.paymentBody}>
      {isNotPaidPeriod ? expiredTitleSubscriptionWarning() : currentPlanTitle()}

      {isNotPaidPeriod ? null : <CurrentTariffContainer />}

      {planSuggestion()}

      {!isNonProfit && hasScheduledTariffAdminsChange ? (
        <div style={{ marginTop: 16, marginBottom: 12 }}>
          <StorageWarning
            title={t("TariffAdminAdjustmentScheduled", {
              fromCount: currentTariffAdminsCount,
              toCount: nextTariffAdminsCount ?? 0,
            })}
            body={t("TariffAdminAdjustmentWarning", {
              admins: maxCountManagersByQuota,
            })}
            onCancelChange={handleCancelTariffDowngrade}
            isCancelLoading={isCancelDowngradeLoading}
          />
        </div>
      ) : null}

      {planDescription()}

      {!isNonProfit &&
      !isGracePeriod &&
      !isNotPaidPeriod &&
      !hasScheduledTariffAdminsChange ? (
        <div className={styles.paymentInfoWrapper}>
          <Text
            fontWeight={600}
            fontSize="14px"
            className={styles.paymentInfoManagersPrice}
          >
            {isYearTariff ? (
              <CommonTrans
                i18nKey="PerUserYear"
                values={{ price: formatPaymentCurrency(startValue) }}
                components={{ 1: <span key="price-span" /> }}
              />
            ) : (
              <CommonTrans
                i18nKey="PerUserMonth"
                values={{ price: formatPaymentCurrency(startValue) }}
                components={{ 1: <span key="price-span" /> }}
              />
            )}
          </Text>

          {renderTooltip()}
        </div>
      ) : null}

      {!isNonProfit && (isAlreadyPaid || cardLinkedOnFreeTariff) ? (
        <div className={styles.walletInfoWrapper}>
          <WalletInfo
            balance={formatWalletCurrency()}
            onTopUp={onTopUp}
            withoutBackground
          />
        </div>
      ) : null}

      {!isNonProfit && showUnlinkedCardBanner ? (
        <div className={styles.unlinkedBanner}>
          <UnlinkedCardBanner />
        </div>
      ) : null}

      <div className={styles.paymentInfo}>
        {!isNonProfit ? <PriceCalculation t={t} /> : null}

        <BenefitsContainer t={t} />
      </div>
      <ContactContainer t={t} />

      {isTopUpVisible ? (
        <SimpleTopUpDialog
          visible={isTopUpVisible}
          onClose={onCloseTopUp}
          onConfirm={onCloseTopUp}
        />
      ) : null}
    </div>
  );
});

export default PaymentContainer;

