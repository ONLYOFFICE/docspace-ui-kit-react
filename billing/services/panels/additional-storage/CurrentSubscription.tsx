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

import React from "react";
import { observer } from "mobx-react";
import { useCommonTranslation } from "../../../../utils/i18n";

import { Text } from "../../../../components/text";
import DiskStorageIcon from "../../../../assets/icons/16/catalog-settings-storage-management.svg";

import styles from "../../styles/CurrentSubscription.module.scss";

import { usePaymentStore } from "../../../store/PaymentStoreProvider";

const CurrentSubscription: React.FC = () => {
  const paymentStore = usePaymentStore();
  const { formatWalletCurrency, storagePriceIncrement } = paymentStore;
  const { currentStoragePlanSize, storageExpiryDate } = paymentStore.tariff;

  const t = useCommonTranslation();

  const totalPrice =
    (currentStoragePlanSize || 0) * (storagePriceIncrement || 0);

  return (
    <div className={styles.currentSubscriptionWrapper}>
      <Text fontWeight="700" fontSize="16px">
        {t("CurrentSubscription")}
      </Text>
      <div className={styles.subscriptionCard}>
        <div className={styles.subscriptionContent}>
          <div className={styles.storageInfo}>
            <div className={styles.storageIcon}>
              <DiskStorageIcon />
            </div>
            <div className={styles.storageDetails}>
              <Text
                fontWeight="600"
                fontSize="14px"
                className={styles.storageName}
              >
                {currentStoragePlanSize} {t("Gigabyte")}
              </Text>
            </div>
          </div>
          <div className={styles.priceInfo}>
            <Text fontWeight="600" fontSize="14px">
              {t("CurrencyPerMonth", {
                currency: formatWalletCurrency(totalPrice, 2),
              })}
            </Text>
          </div>
        </div>
        <Text fontSize="12px" className={styles.renewalInfo}>
          {t("SubscriptionAutoRenewedOn", { finalDate: storageExpiryDate })}
        </Text>
      </div>
    </div>
  );
};

export default observer(CurrentSubscription);
