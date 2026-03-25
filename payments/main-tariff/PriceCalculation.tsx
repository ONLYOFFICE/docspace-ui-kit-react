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
import styled, { css, useTheme } from "styled-components";
import { Text } from "../../components/text";
import { observer } from "mobx-react";
import { Trans } from "react-i18next";
import SelectUsersCountContainer from "./sub-components/SelectUsersCountContainer";
import TotalTariffContainer from "./sub-components/TotalTariffContainer";
import ButtonContainer from "./sub-components/ButtonContainer";
import CurrentUsersCountContainer from "./sub-components/CurrentUsersCount";

import { usePaymentStore } from "../store/PaymentStoreProvider";

const StyledBody = styled.div`
  border-radius: 12px;
  border: ${(props) =>
    props.theme.client.settings.payment.priceContainer.border};
  background: ${(props) =>
    props.theme.client.settings.payment.priceContainer.background};
  max-width: 320px;

  padding: 23px;
  box-sizing: border-box;

  .payment_main-title {
    margin-bottom: 24px;
    ${(props: any) =>
      props.isDisabled &&
      css`
        color: ${
          props.theme.client.settings.payment.priceContainer.disableColor
        };
      `}
  }
  .payment_price_user {
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${(props) =>
      props.theme.client.settings.payment.priceContainer.backgroundText};
    margin-top: 24px;
    min-height: 38px;
    border-radius: 6px;

    p {
      margin-bottom: 5px;
      margin-top: 5px;
      padding-inline: 16px;
    }
  }
`;

let timeout: any = null;
let controller: AbortController | undefined;

const PriceCalculation = observer(({ t }: any) => {
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

  const theme = useTheme() as any;
  const { isGracePeriod, isNotPaidPeriod } = store.tariff;
  const { isYearTariff } = store.quotas;
  const { planCost } = store.paymentQuotas;

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
    <div className="payment_price_user">
      <Text
        color={
          isDisabled
            ? theme.client.settings.payment.priceContainer.disablePriceColor
            : theme.client.settings.payment.priceColor
        }
      >
        {isYearTariff ? (
          <Trans
            t={t}
            i18nKey="PerUserYear"
            ns="Common"
            values={{ price: formatPaymentCurrency(priceManagerPerMonth) }}
            components={{
              1: <strong key="price-year" style={{ fontSize: "16px" }} />,
            }}
          />
        ) : (
          <Trans
            t={t}
            i18nKey="PerUserMonth"
            ns="Common"
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
    <StyledBody className="price-calculation-container" isDisabled={isDisabled}>
      <Text fontSize="16px" fontWeight={600} className="payment_main-title">
        {isGracePeriod || isNotPaidPeriod
          ? t("YourPrice")
          : t("PriceCalculation")}
      </Text>
      {isGracePeriod || isNotPaidPeriod ? (
        <CurrentUsersCountContainer
          isNeedPlusSign={isNeedPlusSign}
          t={t}
          isDisabled={isDisabled}
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
    </StyledBody>
  );
});

export default PriceCalculation;
