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
import NoSpendingDarkIcon from "../../../assets/no.transactions.dark.theme.react.svg";

import { usePaymentStore } from "../../store/PaymentStoreProvider";
import { useServicesStore } from "../../store/ServicesStoreProvider";
import type { TUsagePeriodKey } from "../../types";
import { AI_TOOLS, BACKUP_SERVICE, DISK_STORAGE } from "../../constants";

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
};

const SpendingBreakdown = ({
  period,
  isLoading,
  onDiskStorageClick,
  onBackupClick,
  onAIServicesClick,
}: SpendingBreakdownProps) => {
  const t = useCommonTranslation();
  const { isBase } = useTheme();
  const { formatWalletCurrency, language } = usePaymentStore();
  const { serviceUsage, serviceUsageMonthly } = useServicesStore();

  const [view, setView] = useState<BreakdownView>("services");

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

  const getServiceTitle = (service: string) => {
    switch (service) {
      case DISK_STORAGE:
        return t("AdditionalDiskStorage");
      case BACKUP_SERVICE:
        return t("Backups");
      case AI_TOOLS:
        return t("AIFeatures");
      default:
        return service;
    }
  };

  const getSubLabel = (item: (typeof serviceUsage)[number]) =>
    item.service === BACKUP_SERVICE
      ? t("BilledBackups", { count: item.totalQuantity })
      : getServiceQuantity(t, item.totalQuantity, item.serviceUnit);

  const serviceHandlers: Record<string, (() => void) | undefined> = {
    [DISK_STORAGE]: onDiskStorageClick,
    [BACKUP_SERVICE]: onBackupClick,
    [AI_TOOLS]: onAIServicesClick,
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
        <RectangleSkeleton
          key={`usage-skeleton-${index}`}
          width="100%"
          height="48px"
          borderRadius="3px"
        />
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
          title={getServiceTitle(item.service)}
          subLabel={getSubLabel(item)}
          amount={formatWalletCurrency(item.totalAmount, 2)}
          percent={totalSpend > 0 ? (item.totalAmount / totalSpend) * 100 : 0}
          onExpand={serviceHandlers[item.service]}
          // TODO: wire per-service report download once available.
          onDownload={undefined}
        />
      ))}
    </div>
  );

  const monthRows = [...serviceUsageMonthly].sort(
    (a, b) => a.year - b.year || a.month - b.month,
  );

  const getMonthLabel = (year: number, month: number) =>
    DateTime.fromObject({ year, month })
      .setLocale(language || "en")
      .toFormat("LLLL yyyy");

  const monthContent = isLoading ? (
    skeleton
  ) : monthRows.length === 0 ? (
    emptyView
  ) : (
    <div className={styles.list}>
      {monthRows.map((item) => (
        <BreakdownRow
          key={`${item.year}-${item.month}`}
          title={getMonthLabel(item.year, item.month)}
          amount={formatWalletCurrency(item.totalAmount, 2)}
        />
      ))}
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

