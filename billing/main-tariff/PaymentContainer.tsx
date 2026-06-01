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

import HelpReactSvg from "../../assets/help.react.svg";
import React from "react";
import { CommonTrans } from "../../utils/i18n/CommonTrans";
import { observer } from "mobx-react";

import { Text } from "../../components/text";

import { HelpButton } from "../../components/help-button";

import type { TTranslation } from "../../utils/common";

import { usePaymentStore } from "../store/PaymentStoreProvider";

import CurrentTariffContainer from "./CurrentTariffContainer";
import PriceCalculation from "./PriceCalculation";
import BenefitsContainer from "./BenefitsContainer";
import ContactContainer from "./ContactContainer";
import styles from "./MainTariff.module.scss";
import { getBrandName } from "../../constants/brands";

const PaymentContainer = observer(({ t }: { t: TTranslation }) => {
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
        iconNode={<HelpReactSvg />}
        tooltipContent={
          <>
            <Text isBold>{t("ManagerTypesDescription")}</Text>
            <br />
            <Text isBold>
              {t("PortalAdmin", {
                productName: getBrandName("ProductName"),
              })}
            </Text>
            <Text>
              {t("AdministratorDescription", {
                productName: getBrandName("ProductName"),
              })}
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

    if (isNotPaidPeriod) {
      return (
        <Text fontSize="16px" isBold className={styles.paymentInfoSuggestion}>
          <CommonTrans
            i18nKey="RenewSubscriptionPlanName"
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
          <CommonTrans
            i18nKey="DelayedPayment"
            values={{ date: paymentDate, planName: currentTariffPlanTitle }}
          />
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
            i18nKey="GracePeriodActivatedInfo"
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
              productName: getBrandName("ProductName"),
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
          <CommonTrans
            i18nKey="BusinessFinalDateInfo"
            values={{ finalDate: paymentDate }}
          />
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

      <div className={styles.paymentInfo}>
        {!isNonProfit ? <PriceCalculation t={t} /> : null}

        <BenefitsContainer t={t} />
      </div>
      <ContactContainer t={t} />
    </div>
  );
});

export default PaymentContainer;

