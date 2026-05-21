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

import { useEffect, useState } from "react";
import { useCommonTranslation } from "../../../../utils/i18n";

import { toAbsoluteUrl } from "../../../utils/url";
import classNames from "classnames";
import { observer } from "mobx-react";

import { Link } from "../../../../components/link";
import { Text } from "../../../../components/text";
import { toastr } from "../../../../components/toast";

import { AddButton } from "../../../../components/add-button";

import styles from "../styles/PaymentMethod.module.scss";
import { CardInformation } from "../../card-information";
import { usePaymentStore } from "../../../store/PaymentStoreProvider";
import { useServicesStore } from "../../../store/ServicesStoreProvider";

type PaymentMethodProps = {
  walletCustomerEmail: string;
  cardLinked: string;
  accountLink: string;
  isDisabled: boolean;
  walletCustomerStatusNotActive: boolean;
  reccomendedAmount?: string;
  amount?: string;
};

const PaymentMethod = (props: PaymentMethodProps) => {
  const {
    walletCustomerEmail,
    cardLinked,
    accountLink,
    isDisabled,
    walletCustomerStatusNotActive,
    reccomendedAmount,
    amount,
  } = props;

  const paymentStore = usePaymentStore();
  const servicesStore = useServicesStore();

  const { fetchCardLinked } = paymentStore;
  const { confirmActionType } = servicesStore;

  const t = useCommonTranslation();

  const [isLoading, setIsLoading] = useState(!walletCustomerEmail);

  const updateCardLink = async () => {
    if (walletCustomerEmail) return;

    const basicUrl = `${window.location.href}?complete=true&actionType=${confirmActionType ?? ""}`;
    let url = basicUrl;

    if (reccomendedAmount && amount) {
      url = `${basicUrl}&amount=${amount}&recommendedAmount=${reccomendedAmount}`;
    }

    try {
      await fetchCardLinked!(url);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    updateCardLink();
  }, []);

  const goLinkCard = () => {
    cardLinked
      ? window.open(toAbsoluteUrl(cardLinked), "_self")
      : toastr.error(t("UnexpectedError"));
  };

  const goStripeAccount = () => {
    accountLink
      ? window.open(toAbsoluteUrl(accountLink), "_blank")
      : toastr.error(t("UnexpectedError"));
  };

  return (
    <div className={styles.addPaymentMethod}>
      <div className={styles.paymentMethodDescription}>
        <div className={styles.paymentMethodTitle}>
          <Text isBold fontSize="16px">
            {t("PaymentMethod")}
          </Text>
          {walletCustomerEmail ? (
            <Link
              fontWeight={600}
              onClick={
                isDisabled || isLoading
                  ? undefined
                  : walletCustomerStatusNotActive
                    ? goLinkCard
                    : goStripeAccount
              }
              textDecoration="underline"
              dataTestId="payment_method_link"
              className={classNames({
                [styles.disabledLink]: isDisabled || isLoading,
              })}
            >
              {walletCustomerStatusNotActive
                ? t("AddPaymentMethod")
                : t("GoToStripe")}
            </Link>
          ) : null}
        </div>

        {!walletCustomerEmail ? (
          <Text fontSize="12px" className={styles.noPayment}>
            {t("YouHaveNotAddedAnyPayment")}
          </Text>
        ) : null}
      </div>
      {walletCustomerEmail ? (
        <CardInformation scale withoutMargin />
      ) : (
        <div className={styles.addPaymentMethodContainer}>
          <AddButton
            testId="payment_method_add_button"
            isLoading={isLoading}
            isDisabled={isLoading}
            label={t("AddPaymentMethod")}
            onClick={goLinkCard}
          />
        </div>
      )}
    </div>
  );
};

export default observer(PaymentMethod);

