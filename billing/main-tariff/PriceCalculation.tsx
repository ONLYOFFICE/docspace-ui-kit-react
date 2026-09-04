import React, { useEffect, useRef } from "react";
import classNames from "classnames";
import { Text } from "../../components/text";
import { observer } from "mobx-react";
import { CommonTrans } from "../../utils/i18n/CommonTrans";
import SelectUsersCountContainer from "./sub-components/SelectUsersCountContainer";
import TotalTariffContainer from "./sub-components/TotalTariffContainer";
import ButtonContainer from "./sub-components/ButtonContainer";
import CurrentUsersCountContainer from "./sub-components/CurrentUsersCount";

import type { TTranslation } from "../../utils/common";

import { usePaymentStore } from "../store/PaymentStoreProvider";
import styles from "./MainTariff.module.scss";

let timeout: ReturnType<typeof setTimeout> | null = null;
let controller: AbortController | undefined;

const PriceCalculation = observer(({ t }: { t: TTranslation }) => {
  const store = usePaymentStore();

  const {
    setIsLoading,
    maxAvailableManagersCount,
    canUpdateTariff,
    managersCount,
    isAlreadyPaid,
    getPaymentLink,
    formatPaymentCurrency,
    resetTariffContainerToBasic,
  } = store;

  const {
    isGracePeriod,
    isNotPaidPeriod,
    walletCustomerStatusNotActive,
    hasScheduledTariffAdminsChange,
  } = store.tariff;
  const { isYearTariff } = store.quotas;
  const { planCost, addedManagersCountTitle } = store.paymentQuotas;

  const priceManagerPerMonth = planCost.value;

  const didMountRef = useRef(false);

  const setShoppingLink = () => {
    if (managersCount > maxAvailableManagersCount) {
      timeout && clearTimeout(timeout);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);

    timeout && clearTimeout(timeout);
    timeout = setTimeout(() => {
      if (controller) controller.abort();

      controller = new AbortController();

      getPaymentLink(controller.signal).finally(() => {
        setIsLoading(false);
      });
    }, 1000);
  };

  useEffect(() => {
    didMountRef.current && !isAlreadyPaid && setShoppingLink();
  }, [managersCount]);

  useEffect(() => {
    didMountRef.current = true;
    return () => {
      timeout && clearTimeout(timeout);
      timeout = null;
    };
  }, []);

  useEffect(() => {
    if (hasScheduledTariffAdminsChange) resetTariffContainerToBasic();
  }, [hasScheduledTariffAdminsChange]);

  const isDisabled = !canUpdateTariff || hasScheduledTariffAdminsChange;

  const priceInfoPerManager = (
    <div className={styles.paymentPriceUser}>
      <Text
        className={classNames(styles.priceUserText, {
          [styles.isDisabled]: isDisabled,
        })}
      >
        {isYearTariff ? (
          <CommonTrans
            i18nKey="PerUserYear"
            values={{ price: formatPaymentCurrency(priceManagerPerMonth) }}
            components={{
              1: <strong key="price-year" style={{ fontSize: "16px" }} />,
            }}
          />
        ) : (
          <CommonTrans
            i18nKey="PerUserMonth"
            values={{ price: formatPaymentCurrency(priceManagerPerMonth) }}
            components={{
              1: <strong key="price-month" style={{ fontSize: "16px" }} />,
            }}
          />
        )}
      </Text>
    </div>
  );

  const isNeedPlusSign = managersCount > maxAvailableManagersCount;

  return (
    <div className={styles.priceCalculationContainer}>
      <Text
        fontSize="16px"
        fontWeight={600}
        className={classNames(styles.paymentMainTitle, {
          [styles.isDisabled]: isDisabled,
        })}
      >
        {isGracePeriod || isNotPaidPeriod
          ? t("YourPrice")
          : t("PriceCalculation")}
      </Text>
      {isGracePeriod || isNotPaidPeriod ? (
        <CurrentUsersCountContainer
          isNeedPlusSign={isNeedPlusSign}
          isDisabled={isDisabled}
          addedManagersCountTitle={addedManagersCountTitle}
        />
      ) : (
        <SelectUsersCountContainer
          isNeedPlusSign={isNeedPlusSign}
          isDisabled={isDisabled}
        />
      )}

      <div className={styles.priceBottomSection}>
        {priceInfoPerManager}

        <TotalTariffContainer t={t} isDisabled={isDisabled} />

        <ButtonContainer
          isDisabled={
            (!isNotPaidPeriod && walletCustomerStatusNotActive) || isDisabled
          }
          t={t}
        />
      </div>
    </div>
  );
});

export default PriceCalculation;

