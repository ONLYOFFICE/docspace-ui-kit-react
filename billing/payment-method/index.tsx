import React, { useEffect, useState } from "react";
import { useCommonTranslation } from "../../utils/i18n";
import { observer } from "mobx-react";

import { Text } from "../../components/text";
import { Button, ButtonSize } from "../../components/button";
import { toastr } from "../../components/toast";
import { HelpButton } from "../../components";

import HelpReactSvg from "../../assets/help.react.svg";

import { usePaymentStore } from "../store/PaymentStoreProvider";
import { toAbsoluteUrl } from "../utils/url";
import { finishRefreshingWithMinCycle } from "../utils/refreshing";

import styles from "./PaymentMethod.module.scss";
import PaymentMethodLoader from "./PaymentMethodLoader";
import PayerInformation from "../shared/payer-information";
import { CardInformation } from "../shared/card-information";
import RefreshIconButton from "../shared/refresh-icon-button";
import StorageTariffDeactivated from "../dialogs/StorageTariffDeactivated";

interface PaymentMethodProps {
  showPortalSettingsLoader?: boolean;
  integrationUrl?: string;
}

const PaymentMethod: React.FC<PaymentMethodProps> = ({
  showPortalSettingsLoader,
  integrationUrl,
}) => {
  const t = useCommonTranslation();
  const paymentStore = usePaymentStore();

  const { paymentMethodInit } = paymentStore;

  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    paymentMethodInit(t, integrationUrl);
  }, []);

  const {
    accountLink,
    isAlreadyPaid,
    isPayer,
    isStripePortalAvailable,
    cardLinked,
    isPaymentMethodInit,
    isShowStorageTariffDeactivatedModal,
  } = paymentStore;

  const { fetchCardLinked } = paymentStore;

  const {
    walletCustomerStatusNotActive,
    walletCustomerEmail,
    fetchCustomerInfo,
    isNotPaidPeriod,
  } = paymentStore.tariff;

  if (!isPaymentMethodInit || showPortalSettingsLoader)
    return <PaymentMethodLoader />;

  const goToStripePortal = () => {
    accountLink
      ? window.open(toAbsoluteUrl(accountLink), "_blank")
      : toastr.error(t("UnexpectedError"));
  };

  const goLinkCard = () => {
    cardLinked
      ? window.open(toAbsoluteUrl(cardLinked), "_top")
      : toastr.error(t("UnexpectedError"));
  };

  const onRefreshPaymentMethod = async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);

    const startTime = Date.now();

    try {
      await fetchCustomerInfo(true);

      if (paymentStore.tariff.walletCustomerStatusNotActive) {
        await fetchCardLinked(integrationUrl);
      }
    } catch (e) {
      toastr.error(e as Error);
    } finally {
      finishRefreshingWithMinCycle({
        startTime,
        setRefreshing: setIsRefreshing,
      });
    }
  };

  const renderTooltip = (
    <HelpButton
      className="payer-tooltip"
      iconNode={<HelpReactSvg />}
      style={{ height: "15px", margin: "0" }}
      tooltipContent={
        <>
          <Text isBold>{t("Payer")}</Text>
          <Text>
            {t("PayerDescription")}
          </Text>
        </>
      }
      dataTestId="payer_info_help_button"
    />
  );

  const paymentMethod = (
    <>
      <div className={styles.payerInfoHeader}>
        <Text fontSize="16px" fontWeight={700} lineHeight="22px">
          {t("Payer")}
        </Text>
        {renderTooltip}
      </div>
      <Text className={styles.description} lineHeight="20px">
        {t("PayerResponsibleForBilling")}
      </Text>

      <PayerInformation />

      <div className={styles.header}>
        <Text fontSize="16px" fontWeight={700} lineHeight="22px">
          {t("PaymentMethod")}
        </Text>
        <RefreshIconButton
          onRefresh={onRefreshPaymentMethod}
          isRefreshing={isRefreshing}
        />
      </div>

      <Text className={styles.description} lineHeight="20px">
        {t("PaymentMethodDesc")}
      </Text>

      <CardInformation />

      {!isNotPaidPeriod && walletCustomerStatusNotActive && isPayer ? (
        <Text className={styles.linkNewCardDescription} lineHeight="20px">
          {t("LinkNewCardDesc")}
        </Text>
      ) : null}

      {isAlreadyPaid && isStripePortalAvailable ? (
        <div className={styles.buttonWrapper}>
          <Button
            label={
              walletCustomerStatusNotActive && isPayer
                ? t("AddPaymentMethod")
                : t("GoToStripe")
            }
            size={ButtonSize.small}
            primary
            onClick={
              walletCustomerStatusNotActive && isPayer
                ? goLinkCard
                : goToStripePortal
            }
            testId="go_to_stripe_button"
          />
        </div>
      ) : walletCustomerStatusNotActive ? (
        <Text className={styles.reachOutPayer}>
          {t("ReachedOutPayerForPayment")}
        </Text>
      ) : null}
    </>
  );

  const noPaymnetMethod = (
    <div>
      <Text fontSize="16px" fontWeight={700}>
        {t("NoPaymentMethod")}
      </Text>
      <Text className={styles.noPaymentDescription}>
        {t("NoPaymentMethodDesc")}
      </Text>
      <div className={styles.buttonWrapper}>
        <Button
          label={t("AddPaymentMethod")}
          size={ButtonSize.small}
          primary
          onClick={goLinkCard}
          testId="go_to_stripe_button"
        />
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      {walletCustomerEmail ? paymentMethod : noPaymnetMethod}
      {isShowStorageTariffDeactivatedModal ? (
        <StorageTariffDeactivated
          visible={isShowStorageTariffDeactivatedModal}
        />
      ) : null}
    </div>
  );
};

export default observer(PaymentMethod);

