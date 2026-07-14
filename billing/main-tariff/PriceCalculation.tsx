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

