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

import { observer } from "mobx-react";

import { Text } from "../../../components/text";
import { Link } from "../../../components/link";
import { useCommonTranslation } from "../../../utils/i18n";

import { usePaymentStore } from "../../store/PaymentStoreProvider";

import styles from "../Overview.module.scss";

type UpcomingPaymentsProps = {
  onUpcomingDetails?: () => void;
};

const UpcomingPayments = ({ onUpcomingDetails }: UpcomingPaymentsProps) => {
  const t = useCommonTranslation();
  const {
    upcomingPaymentsCurrentMonth: upcomingPayments,
    walletCodeCurrency,
    formatWalletCurrency,
  } = usePaymentStore();

  const upcomingTotal = upcomingPayments.reduce(
    (sum, item) => sum + item.amount,
    0,
  );

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <Text fontSize="14px" fontWeight={700}>
          {t("UpcomingPayments")}
        </Text>
        {onUpcomingDetails ? (
          <Link
            onClick={onUpcomingDetails}
            textDecoration="underline"
            color="accent"
            fontWeight={600}
            dataTestId="overview_upcoming_details_link"
          >
            {t("Details")}
          </Link>
        ) : null}
      </div>
      <Text fontSize="18px" fontWeight={700} className={styles.cardValue}>
        {formatWalletCurrency(upcomingTotal, 2, walletCodeCurrency)}
      </Text>
      {upcomingPayments.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyContent}>
            <Text fontSize="12px" fontWeight={600} className={styles.mutedTitle}>
              {t("NoUpcomingPayments")}
            </Text>
            <Text fontSize="12px" className={styles.mutedTitle}>
              {t("NoUpcomingPaymentsDesc")}
            </Text>
          </div>
        </div>
      ) : (
        <div className={styles.upcomingList}>
          {upcomingPayments.map((item) => (
            <div className={styles.upcomingRow} key={item.id}>
              <Text
                fontSize="14px"
                fontWeight={600}
                className={styles.mutedTitle}
                truncate
                noSelect
              >
                {item.renewalDateShort}
              </Text>
              <Text fontSize="14px" fontWeight={600} truncate>
                {item.title}
              </Text>
              <Text
                fontSize="13px"
                fontWeight={600}
                className={styles.upcomingAmount}
              >
                {formatWalletCurrency(item.amount, 2, walletCodeCurrency)}
              </Text>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default observer(UpcomingPayments);

