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

import React from "react";
import classNames from "classnames";
import { Trans } from "react-i18next";
import { Text } from "../../../components/text";
import { observer } from "mobx-react";
import type { TTranslation } from "../../../utils/common";
import { usePaymentStore } from "../../store/PaymentStoreProvider";
import styles from "./SubComponents.module.scss";

const TotalTariffContainer = observer(({
  t,
  isDisabled,
}: {
  t: TTranslation;
  isDisabled: boolean;
}) => {
  const store = usePaymentStore();
  const {
    totalPrice,
    isNeedRequest,
    maxAvailableManagersCount,
    formatPaymentCurrency,
  } = store;
  const { isYearTariff } = store.quotas;

  return (
    <div className={styles.totalTariffContainer}>
      <div
        className={classNames(styles.paymentPriceTotalPrice, {
          [styles.isDisabled]: isDisabled,
        })}
      >
        {isNeedRequest ? (
          <Text
            fontSize="14"
            textAlign="center"
            fontWeight={600}
            className={styles.totalTariffDescription}
          >
            <Trans i18nKey="BusinessRequestDescription" ns="Payments">
              {{ peopleNumber: maxAvailableManagersCount }}
            </Trans>
          </Text>
        ) : (
          <Text fontWeight={600} fontSize="16px">
            {isYearTariff ? (
              <Trans
                i18nKey="TotalPricePerYear"
                ns="Payments"
                values={{ price: formatPaymentCurrency(totalPrice) }}
                components={{
                  2: <span key="large-font-year" className={styles.largerFontSize} />,
                  3: <Text fontWeight={600} as="span" key="bold-text-year" />,
                }}
              />
            ) : (
              <Trans
                i18nKey="TotalPricePerMonth"
                ns="Payments"
                values={{ price: formatPaymentCurrency(totalPrice) }}
                components={{
                  2: <span key="large-font-month" className={styles.largerFontSize} />,
                  3: <Text fontWeight={600} as="span" key="bold-text-month" />,
                }}
              />
            )}
          </Text>
        )}
      </div>
    </div>
  );
});

export default TotalTariffContainer;
