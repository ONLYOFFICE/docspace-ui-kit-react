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
  } = store;

  const { isGracePeriod, isNotPaidPeriod } = store.tariff;
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

  const isDisabled = !canUpdateTariff;

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
            namespaces={["Common"]}
            values={{ price: formatPaymentCurrency(priceManagerPerMonth) }}
            components={{
              1: <strong key="price-year" style={{ fontSize: "16px" }} />,
            }}
          />
        ) : (
          <CommonTrans
            i18nKey="PerUserMonth"
            namespaces={["Common"]}
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

      {priceInfoPerManager}

      <TotalTariffContainer t={t} isDisabled={isDisabled} />
      <ButtonContainer isDisabled={isDisabled} t={t} />
    </div>
  );
});

export default PriceCalculation;
