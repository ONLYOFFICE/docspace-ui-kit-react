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

import React, { useEffect } from "react";
import { useCommonTranslation } from "../../utils/i18n";
import { observer } from "mobx-react";

import { Text } from "../../components/text";
import { Button, ButtonSize } from "../../components/button";
import { toastr } from "../../components/toast";
import { HelpButton } from "../../components";

import HelpReactSvgUrl from "../../assets/help.react.svg?url";

import { usePaymentStore } from "../store/PaymentStoreProvider";
import { toAbsoluteUrl } from "../utils/url";

import styles from "./PaymentMethod.module.scss";
import PaymentMethodLoader from "./PaymentMethodLoader";
import PayerInformation from "../shared/payer-information";
import { CardInformation } from "../shared/card-information";
import StorageTariffDeactivated from "../dialogs/StorageTariffDeactivated";

interface PaymentMethodProps {
  showPortalSettingsLoader?: boolean;
}

const PaymentMethod: React.FC<PaymentMethodProps> = ({
  showPortalSettingsLoader,
}) => {
  const t = useCommonTranslation();
  const paymentStore = usePaymentStore();

  const { paymentMethodInit } = paymentStore;

  useEffect(() => {
    paymentMethodInit(t);
  }, []);

  const {
    accountLink,
    isAlreadyPaid,
    isStripePortalAvailable,
    cardLinked,
    isPaymentMethodInit,
    isShowStorageTariffDeactivatedModal,
  } = paymentStore;

  const { walletCustomerStatusNotActive, walletCustomerEmail } =
    paymentStore.tariff;

  if (!isPaymentMethodInit || showPortalSettingsLoader)
    return <PaymentMethodLoader />;

  const goToStripePortal = () => {
    accountLink
      ? window.open(toAbsoluteUrl(accountLink), "_blank")
      : toastr.error(t("UnexpectedError"));
  };

  const goLinkCard = () => {
    cardLinked
      ? window.open(toAbsoluteUrl(cardLinked), "_self")
      : toastr.error(t("UnexpectedError"));
  };

  const renderTooltip = (
    <HelpButton
      className="payer-tooltip"
      iconName={HelpReactSvgUrl}
      style={{ height: "15px", margin: "0" }}
      tooltipContent={
        <>
          <Text isBold>{t("Payer")}</Text>
          <Text>
            {t("PayerDescription", { productName: t("ProductName") })}
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
      </div>

      <Text className={styles.description} lineHeight="20px">
        {t("PaymentMethodDescription", {
          productName: t("ProductName"),
        })}
      </Text>

      <CardInformation />

      {walletCustomerStatusNotActive ? (
        <Text className={styles.linkNewCardDescription} lineHeight="20px">
          {t("LinkNewCardDescription")}
        </Text>
      ) : null}

      {isAlreadyPaid && isStripePortalAvailable ? (
        <div className={styles.buttonWrapper}>
          <Button
            label={
              walletCustomerStatusNotActive
                ? t("AddPaymentMethod")
                : t("GoToStripe")
            }
            size={ButtonSize.small}
            primary
            onClick={
              walletCustomerStatusNotActive ? goLinkCard : goToStripePortal
            }
            testId="go_to_stripe_button"
          />
        </div>
      ) : walletCustomerStatusNotActive ? (
        <Text className={styles.reachOutPayer}>{t("ReachOutPayer")}</Text>
      ) : null}
    </>
  );

  const noPaymnetMethod = (
    <div>
      <Text fontSize="16px" fontWeight={700}>
        {t("NoPaymentMethod")}
      </Text>
      <Text className={styles.noPaymentDescription}>
        {t("NoPaymentMethodDescription")}
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

