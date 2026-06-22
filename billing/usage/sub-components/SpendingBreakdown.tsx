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

import { useState } from "react";
import { observer } from "mobx-react";
import { DateTime } from "luxon";

import { Text } from "../../../components/text";
import { EmptyView } from "../../../components/empty-view";
import { RectangleSkeleton } from "../../../components/rectangle";
import { Tabs, TabsTypes, type TTabItem } from "../../../components/tabs";
import { useCommonTranslation } from "../../../utils/i18n";
import { useTheme } from "../../../context/ThemeContext";
import { formatDateLocalized, getAppTimezone } from "../../../utils/date";

import NoSpendingIcon from "../../../assets/no.transactions.react.svg";
import NoSpendingDarkIcon from "../../../assets/no.transactions.filter.dark.theme.react.svg";

import { usePaymentStore } from "../../store/PaymentStoreProvider";
import { useServicesStore } from "../../store/ServicesStoreProvider";
import type { TUsagePeriodKey } from "../../types";
// import { AI_TOOLS, BACKUP_SERVICE, DISK_STORAGE } from "../../constants";

import { getServiceQuantity } from "../../wallet/utils";
import { getUsageRange } from "../utils";
import BreakdownRow from "./BreakdownRow";
import styles from "../styles/Usage.module.scss";

type BreakdownView = "services" | "month";

type SpendingBreakdownProps = {
  period: TUsagePeriodKey;
  isLoading: boolean;
  onDiskStorageClick?: () => void;
  onBackupClick?: () => void;
  onAIServicesClick?: () => void;
  onDownloadReport?: (
    serviceName?: string,
    range?: { from: DateTime; to: DateTime },
  ) => void;
};

const SpendingBreakdown = ({
  period,
  isLoading,
  onDiskStorageClick,
  onBackupClick,
  onAIServicesClick,
  onDownloadReport,
}: SpendingBreakdownProps) => {
  const t = useCommonTranslation();
  const { isBase } = useTheme();
  const { formatWalletCurrency, language } = usePaymentStore();
  const { serviceUsage, serviceUsageMonthly } = useServicesStore();

  const [view, setView] = useState<BreakdownView>("services");
  const [downloadingServices, setDownloadingServices] = useState<Set<string>>(
    new Set(),
  );
  const [downloadingMonths, setDownloadingMonths] = useState<Set<string>>(
    new Set(),
  );

  const handleDownload = async (serviceName: string) => {
    if (downloadingServices.has(serviceName) || !onDownloadReport) return;

    setDownloadingServices((prev) => new Set(prev).add(serviceName));
    try {
      await onDownloadReport(serviceName);
    } finally {
      setDownloadingServices((prev) => {
        const next = new Set(prev);
        next.delete(serviceName);
        return next;
      });
    }
  };

  const handleMonthDownload = async (year: number, month: number) => {
    const key = `${year}-${month}`;
    if (downloadingMonths.has(key) || !onDownloadReport) return;

    setDownloadingMonths((prev) => new Set(prev).add(key));
    try {
      const monthFrom = DateTime.fromObject({ year, month }).startOf("month");
      await onDownloadReport(undefined, {
        from: monthFrom,
        to: monthFrom.endOf("month"),
      });
    } finally {
      setDownloadingMonths((prev) => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    }
  };

  const totalSpend = serviceUsage.reduce(
    (sum, item) => sum + item.totalAmount,
    0,
  );

  const { from, to } = getUsageRange(period);
  const dateRangeText = `${formatDateLocalized(from, "DATE_MED", {
    locale: language,
    timezone: getAppTimezone(),
  })} — ${formatDateLocalized(to, "DATE_MED", {
    locale: language,
    timezone: getAppTimezone(),
  })}`;

  // const getServiceTitle = (service: string) => {
  //   switch (service) {
  //     case DISK_STORAGE:
  //       return t("AdditionalStorageInfo");
  //     case BACKUP_SERVICE:
  //       return t("Backups");
  //     case AI_TOOLS:
  //       return t("AIFeatures");
  //     default:
  //       return service;
  //   }
  // };

  const normalizeService = (service: string) =>
    (service || "").toLowerCase().replace(/[^a-z]/g, "");

  const getSubLabel = (item: (typeof serviceUsage)[number]) =>
    normalizeService(item.service).includes("backup")
      ? t("BilledBackups", { count: item.totalQuantity })
      : getServiceQuantity(t, item.totalQuantity, item.serviceUnit);

  const getServiceHandler = (service: string) => {
    const key = normalizeService(service);
    if (key.includes("storage")) return onDiskStorageClick;
    if (key.includes("backup")) return onBackupClick;
    if (key.includes("ai")) return onAIServicesClick;
    return undefined;
  };

  const emptyView = (
    <EmptyView
      icon={isBase ? <NoSpendingIcon /> : <NoSpendingDarkIcon />}
      title={t("NoSpendingActivity")}
      description={t("NoSpendingActivityDescription")}
      options={null}
    />
  );

  const skeleton = (
    <div className={styles.list}>
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={`usage-skeleton-${index}`} className={styles.skeletonRow}>
          <div className={styles.skeletonServiceInfo}>
            <RectangleSkeleton width="129px" height="16px" borderRadius="3px" />
            <RectangleSkeleton width="78px" height="16px" borderRadius="3px" />
          </div>
          <div className={styles.skeletonProgress}>
            <RectangleSkeleton width="100%" height="8px" borderRadius="3px" />
          </div>
          <div className={styles.skeletonAmount}>
            <RectangleSkeleton width="91px" height="16px" borderRadius="3px" />
          </div>
        </div>
      ))}
    </div>
  );

  const servicesContent = isLoading ? (
    skeleton
  ) : serviceUsage.length === 0 ? (
    emptyView
  ) : (
    <div className={styles.list}>
      {serviceUsage.map((item) => (
        <BreakdownRow
          key={item.service}
          title={item.title}
          subLabel={getSubLabel(item)}
          amount={formatWalletCurrency(item.totalAmount, 2)}
          percent={totalSpend > 0 ? (item.totalAmount / totalSpend) * 100 : 0}
          onExpand={getServiceHandler(item.service)}
          onDownload={
            onDownloadReport ? () => handleDownload(item.service) : undefined
          }
          isDownloading={downloadingServices.has(item.service)}
        />
      ))}
    </div>
  );

  const getMonthLabel = (year: number, month: number) =>
    DateTime.fromObject({ year, month })
      .setLocale(language || "en")
      .toFormat("LLLL yyyy");

  const periodMonths: { year: number; month: number }[] = [];
  let monthCursor = from.startOf("month");
  const lastMonth = to.startOf("month");

  while (monthCursor <= lastMonth) {
    periodMonths.push({ year: monthCursor.year, month: monthCursor.month });
    monthCursor = monthCursor.plus({ months: 1 });
  }

  const monthlyMap = new Map(
    serviceUsageMonthly.map((item) => [`${item.year}-${item.month}`, item]),
  );

  const fallbackCurrency = serviceUsageMonthly[0]?.currency;

  const monthRows = periodMonths.map(({ year, month }) => {
    const data = monthlyMap.get(`${year}-${month}`);
    return {
      year,
      month,
      totalAmount: data?.totalAmount ?? 0,
      currency: data?.currency ?? fallbackCurrency,
      hasData: Boolean(data),
    };
  });

  const monthContent = isLoading ? (
    skeleton
  ) : serviceUsageMonthly.length === 0 ? (
    emptyView
  ) : (
    <div className={styles.list}>
      {monthRows.map((item) => {
        const key = `${item.year}-${item.month}`;

        return (
          <BreakdownRow
            key={key}
            title={getMonthLabel(item.year, item.month)}
            amount={formatWalletCurrency(item.totalAmount, 2, item.currency)}
            onDownload={
              item.hasData && onDownloadReport
                ? () => handleMonthDownload(item.year, item.month)
                : undefined
            }
            isDownloading={downloadingMonths.has(key)}
          />
        );
      })}
    </div>
  );

  const items: TTabItem[] = [
    { id: "services", name: t("ByServices"), content: null },
    { id: "month", name: t("ByMonth"), content: null },
  ];

  return (
    <div className={styles.breakdown}>
      <div className={styles.breakdownHeader}>
        <div className={styles.breakdownTitle}>
          <Text fontSize="16px" fontWeight={700}>
            {t("SpendingBreakdown")}
          </Text>
          <Text fontSize="13px">{dateRangeText}</Text>
        </div>

        <Tabs
          className={styles.breakdownTabs}
          type={TabsTypes.Secondary}
          items={items}
          selectedItemId={view}
          onSelect={(item) => setView(item.id as BreakdownView)}
          withoutStickyIntend
          scaled
        />
      </div>

      {view === "services" ? servicesContent : monthContent}
    </div>
  );
};

export default observer(SpendingBreakdown);

