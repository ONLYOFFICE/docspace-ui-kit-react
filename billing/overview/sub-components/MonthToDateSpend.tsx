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

import { Fragment, useMemo } from "react";
import { observer } from "mobx-react";

import { Text } from "../../../components/text";
import { Link } from "../../../components/link";
import { useCommonTranslation } from "../../../utils/i18n";

import { usePaymentStore } from "../../store/PaymentStoreProvider";
import { useServicesStore } from "../../store/ServicesStoreProvider";
import {
  getServiceUnitRate,
  getServiceUsageSubLabel,
} from "../../utils/serviceUsage";
import type { TServiceUsage } from "../../types";

import styles from "../Overview.module.scss";

type MonthToDateSpendProps = {
  onViewUsage?: () => void;
};

const sumAmount = (items: TServiceUsage[]) =>
  items.reduce((sum, item) => sum + item.totalAmount, 0);

const MonthToDateSpend = ({ onViewUsage }: MonthToDateSpendProps) => {
  const t = useCommonTranslation();
  const { walletCodeCurrency, formatWalletCurrency, language } =
    usePaymentStore();
  const { serviceUsage, walletMonthToDateSpend } = useServicesStore();

  const monthLabel = useMemo(
    () =>
      new Intl.DateTimeFormat(language || "en", { month: "long" }).format(
        new Date(),
      ),
    [language],
  );

  const subscriptions = serviceUsage.filter((item) => item.subscription);
  const payAsYouGo = serviceUsage.filter((item) => !item.subscription);

  const subscriptionsTotal = sumAmount(subscriptions);
  const payAsYouGoTotal = sumAmount(payAsYouGo);
  const total = walletMonthToDateSpend;

  const subscriptionsPct = total > 0 ? (subscriptionsTotal / total) * 100 : 0;
  const payAsYouGoPct = total > 0 ? (payAsYouGoTotal / total) * 100 : 0;

  const renderRows = (items: TServiceUsage[]) =>
    items.map((item, index) => {
      let subLabel = getServiceUsageSubLabel(t, item, language);

      if (item.subscription) {
        const unitPrice = formatWalletCurrency(
          item.price,
          2,
          item.currency || walletCodeCurrency,
        );
        const rate = getServiceUnitRate(t, item.service, unitPrice);
        if (rate) subLabel = `${subLabel} | ${rate}`;
      }

      return (
        <Fragment key={item.service}>
          {index > 0 ? <div className={styles.spendDivider} /> : null}
          <div className={styles.spendRow}>
            <div className={styles.spendRowInfo}>
              <Text fontSize="14px" fontWeight={600} truncate>
                {item.title}
              </Text>
              <Text fontSize="12px" className={styles.mutedTitle} truncate>
                {subLabel}
              </Text>
            </div>
            <Text
              fontSize="13px"
              fontWeight={600}
              className={styles.spendAmount}
            >
              {formatWalletCurrency(
                item.totalAmount,
                2,
                item.currency || walletCodeCurrency,
              )}
            </Text>
          </div>
        </Fragment>
      );
    });

  const renderSection = (
    items: TServiceUsage[],
    label: string,
    sectionTotal: number,
    dotClass: string,
  ) =>
    items.length > 0 ? (
      <>
        <div className={styles.spendSectionHeader}>
          <span className={`${styles.spendDot} ${dotClass}`} />
          <Text
            fontSize="14px"
            fontWeight={600}
            className={styles.spendSectionLabel}
          >
            {label}
          </Text>
          <Text
            fontSize="12px"
            fontWeight={600}
            className={styles.spendSectionTotal}
          >
            {formatWalletCurrency(sectionTotal, 2, walletCodeCurrency)}
          </Text>
        </div>
        {renderRows(items)}
      </>
    ) : null;

  return (
    <div className={styles.card}>
      <div className={styles.spendRoot}>
        <div className={styles.spendTop}>
          <div className={styles.cardHeader}>
            <Text fontSize="14px" fontWeight={700}>
              {t("SpendingInMonth", { month: monthLabel })}
            </Text>
            {onViewUsage ? (
              <Link
                onClick={onViewUsage}
                textDecoration="underline"
                color="accent"
                fontWeight={600}
                dataTestId="overview_view_usage_link"
              >
                {t("ViewUsage")}
              </Link>
            ) : null}
          </div>
          <Text fontSize="18px" fontWeight={700}>
            {formatWalletCurrency(total, 2, walletCodeCurrency)}
          </Text>
        </div>

        <div className={styles.spendBar}>
          {subscriptionsPct > 0 ? (
            <div
              className={styles.spendBarSubs}
              style={{ width: `${subscriptionsPct}%` }}
            />
          ) : null}
          {payAsYouGoPct > 0 ? (
            <div
              className={styles.spendBarPayg}
              style={{ width: `${payAsYouGoPct}%` }}
            />
          ) : null}
        </div>

        <div className={styles.spendList}>
          {renderSection(
            subscriptions,
            t("Subscriptions"),
            subscriptionsTotal,
            styles.spendDotSubs,
          )}
          {renderSection(
            payAsYouGo,
            t("PayAsYouGo"),
            payAsYouGoTotal,
            styles.spendDotPayg,
          )}
        </div>
      </div>
    </div>
  );
};

export default observer(MonthToDateSpend);

