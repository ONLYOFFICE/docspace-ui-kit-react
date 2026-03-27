// (c) Copyright Ascensio System SIA 2009-2026
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

import HelpReactSvgUrl from "../../assets/icons/payments/help.react.svg?url";
import React from "react";
import { Trans } from "react-i18next";
import { observer } from "mobx-react";

import { Text } from "../../components/text";

import { HelpButton } from "../../components/help-button";

import { usePaymentStore } from "../store/PaymentStoreProvider";

import CurrentTariffContainer from "./CurrentTariffContainer";
import PriceCalculation from "./PriceCalculation";
import BenefitsContainer from "./BenefitsContainer";
import ContactContainer from "./ContactContainer";
import styles from "./MainTariff.module.scss";

const PaymentContainer = observer((props: any) => {
  const { t } = props;

  const store = usePaymentStore();
  const { formatPaymentCurrency } = store;

  const { isFreeTariff, isNonProfit, currentTariffPlanTitle, isYearTariff } =
    store.quotas;
  const {
    isPaidPeriod,
    isPaymentDateValid,
    isGracePeriod,
    isNotPaidPeriod,
    gracePeriodEndDate,
    delayDaysCount,
    paymentDate,
  } = store.tariff;
  const { tariffPlanTitle, planCost } = store.paymentQuotas;

  const startValue = planCost.value;

  const renderTooltip = () => {
    return (
      <HelpButton
        className="payment-tooltip"
        offsetRight={0}
        iconName={HelpReactSvgUrl}
        tooltipContent={
          <>
            <Text isBold>{t("ManagerTypesDescription")}</Text>
            <br />
            <Text isBold>
              {t("Common:PortalAdmin", {
                productName: t("Common:ProductName"),
              })}
            </Text>
            <Text>
              {t("AdministratorDescription", {
                productName: t("Common:ProductName"),
              })}
            </Text>
            <br />
            <Text isBold>{t("Common:RoomAdmin")}</Text>
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
          <Trans t={t} i18nKey="StartupTitle" ns="Payments">
            {{ planName: currentTariffPlanTitle }}
          </Trans>
        </Text>
      );
    }

    console.log("isPaidPeriod", isPaidPeriod, "isFreeTariff", isFreeTariff);
    if (isPaidPeriod || isGracePeriod) {
      return (
        <Text fontSize="16px" isBold>
          <Trans t={t} i18nKey="BusinessTitle" ns="Payments">
            {{ planName: currentTariffPlanTitle }}
          </Trans>
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
        <Trans t={t} i18nKey="BusinessExpired" ns="Payments">
          {{ date: gracePeriodEndDate }} {{ planName: tariffPlanTitle }}
        </Trans>
      </Text>
    );
  };

  const planSuggestion = () => {
    if (isFreeTariff && !isNonProfit) {
      return (
        <Text fontSize="16px" isBold className={styles.paymentInfoSuggestion}>
          <Trans t={t} i18nKey="StartupSuggestion" ns="Payments">
            {{ planName: tariffPlanTitle }}
          </Trans>
        </Text>
      );
    }

    if (isPaidPeriod && !isNonProfit) {
      return (
        <Text fontSize="16px" isBold className={styles.paymentInfoSuggestion}>
          <Trans t={t} i18nKey="BusinessSuggestion" ns="Payments">
            {{ planName: tariffPlanTitle }}
          </Trans>
        </Text>
      );
    }

    if (isNotPaidPeriod) {
      return (
        <Text fontSize="16px" isBold className={styles.paymentInfoSuggestion}>
          <Trans t={t} i18nKey="RenewSubscription" ns="Payments">
            {{ planName: tariffPlanTitle }}
          </Trans>
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
          <Trans t={t} i18nKey="DelayedPayment" ns="Payments">
            {{ date: paymentDate }} {{ planName: currentTariffPlanTitle }}
          </Trans>
        </Text>
      );
    }
  };

  const planDescription = () => {
    if (isFreeTariff) return;

    if (isGracePeriod)
      return (
        <Text fontSize="14px" lineHeight="16px">
          <Trans
            i18nKey="GracePeriodActivatedInfo"
            ns="Payments"
            t={t}
            values={{
              fromDate: paymentDate,
              byDate: gracePeriodEndDate,
              delayDaysCount,
            }}
            components={{
              1: <Text as="span" />,
            }}
          />

          <Text as="span" fontSize="14px" lineHeight="16px">
            {t("GracePeriodActivatedDescription", {
              productName: t("Common:ProductName"),
            })}
          </Text>
        </Text>
      );

    if (isPaidPeriod && isPaymentDateValid && !isNonProfit)
      return (
        <Text
          fontSize="14px"
          lineHeight="16px"
          className={styles.paymentInfoManagersPrice}
        >
          <Trans t={t} i18nKey="BusinessFinalDateInfo" ns="Payments">
            {{ finalDate: paymentDate }}
          </Trans>
        </Text>
      );
  };

  return (
    <div className={styles.paymentBody}>
      {isNotPaidPeriod ? expiredTitleSubscriptionWarning() : currentPlanTitle()}

      <CurrentTariffContainer />

      {planSuggestion()}
      {planDescription()}

      {!isNonProfit && !isGracePeriod && !isNotPaidPeriod ? (
        <div className={styles.paymentInfoWrapper}>
          <Text
            fontWeight={600}
            fontSize="14px"
            className={styles.paymentInfoManagersPrice}
          >
            {isYearTariff ? (
              <Trans
                t={t}
                i18nKey="PerUserYear"
                ns="Common"
                values={{ price: formatPaymentCurrency(startValue) }}
                components={{ 1: <span key="price-span" /> }}
              />
            ) : (
              <Trans
                t={t}
                i18nKey="PerUserMonth"
                ns="Common"
                values={{ price: formatPaymentCurrency(startValue) }}
                components={{ 1: <span key="price-span" /> }}
              />
            )}
          </Text>

          {renderTooltip()}
        </div>
      ) : null}

      <div className={styles.paymentInfo}>
        {!isNonProfit ? <PriceCalculation t={t} /> : null}

        <BenefitsContainer t={t} />
      </div>
      <ContactContainer t={t} />
    </div>
  );
});

export default PaymentContainer;

