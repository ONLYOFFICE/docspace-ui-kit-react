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
import {
  ADMIN,
  AI_SEARCH_ENUM,
  AI_TOOLS,
  BACKUP_SERVICE,
  MANAGER,
} from "../../constants";

import { isDocsConnectServiceName } from "../../utils/docs-connect";
import { getServiceUsageSubLabel } from "../../utils/serviceUsage";
import { getUsageRange } from "../utils";
import BreakdownRow from "./BreakdownRow";
import styles from "../styles/Usage.module.scss";

type BreakdownView = "services" | "month";

type SpendingBreakdownProps = {
  period: TUsagePeriodKey;
  isLoading: boolean;
  onTariffPlanClick?: () => void;
  onDiskStorageClick?: () => void;
  onBackupClick?: () => void;
  onAIServicesClick?: () => void;
  onAISearchClick?: () => void;
  onDocsConnectClick?: () => void;
  onDownloadReport?: (
    serviceName?: string,
    range?: { from: DateTime; to: DateTime },
  ) => void;
  /** A report is already being generated, so no other one may be started. */
  isDownloadBlocked?: boolean;
  /** Notifies the parent when the services/month view changes. */
  onViewChange?: (view: BreakdownView) => void;
};

const SpendingBreakdown = ({
  period,
  isLoading,
  onTariffPlanClick,
  onDiskStorageClick,
  onBackupClick,
  onAIServicesClick,
  onAISearchClick,
  onDocsConnectClick,
  onDownloadReport,
  isDownloadBlocked,
  onViewChange,
}: SpendingBreakdownProps) => {
  const t = useCommonTranslation();
  const { isBase } = useTheme();
  const { language } = usePaymentStore();
  const { serviceUsage, serviceUsageMonthly } = useServicesStore();

  const [view, setView] = useState<BreakdownView>("services");
  const [downloadingServices, setDownloadingServices] = useState<Set<string>>(
    new Set(),
  );
  const [downloadingMonths, setDownloadingMonths] = useState<Set<string>>(
    new Set(),
  );

  const handleDownload = async (serviceName: string) => {
    if (isDownloadBlocked || !onDownloadReport) return;
    if (downloadingServices.has(serviceName)) return;

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
    if (isDownloadBlocked || !onDownloadReport) return;
    if (downloadingMonths.has(key)) return;

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
    getServiceUsageSubLabel(t, item, language);

  const getServiceHandler = (service: string) => {
    const key = normalizeService(service);
    if (service === ADMIN) return onTariffPlanClick;
    if (key.includes("storage")) return onDiskStorageClick;
    if (service === BACKUP_SERVICE) return onBackupClick;
    if (service === AI_TOOLS) return onAIServicesClick;
    if (key === AI_SEARCH_ENUM) return onAISearchClick;
    if (isDocsConnectServiceName(service)) return onDocsConnectClick;
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
          amount={item.totalAmount}
          amountTooltipId={`usage-service-amount-${item.service}`}
          percent={totalSpend > 0 ? (item.totalAmount / totalSpend) * 100 : 0}
          onExpand={getServiceHandler(item.service)}
          onDownload={
            onDownloadReport ? () => handleDownload(item.service) : undefined
          }
          isDownloading={downloadingServices.has(item.service)}
          isDownloadDisabled={isDownloadBlocked}
        />
      ))}
    </div>
  );

  const getMonthLabel = (year: number, month: number) =>
    DateTime.fromObject({ year, month })
      .setLocale(language || "en")
      .toFormat("LLLL yyyy");

  // Never show months past the current one; the newest month comes first.
  const currentMonth = DateTime.now()
    .setZone(getAppTimezone())
    .startOf("month");
  const periodMonths: { year: number; month: number }[] = [];
  let monthCursor = from.startOf("month");
  const lastMonth = DateTime.min(to.startOf("month"), currentMonth);

  while (monthCursor <= lastMonth) {
    periodMonths.push({ year: monthCursor.year, month: monthCursor.month });
    monthCursor = monthCursor.plus({ months: 1 });
  }

  periodMonths.reverse();

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
            amount={item.totalAmount}
            currency={item.currency}
            amountTooltipId={`usage-month-amount-${key}`}
            onDownload={
              item.hasData && onDownloadReport
                ? () => handleMonthDownload(item.year, item.month)
                : undefined
            }
            isDownloading={downloadingMonths.has(key)}
            isDownloadDisabled={isDownloadBlocked}
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
          onSelect={(item) => {
            const nextView = item.id as BreakdownView;
            setView(nextView);
            onViewChange?.(nextView);
          }}
          withoutStickyIntend
          scaled
        />
      </div>

      {view === "services" ? servicesContent : monthContent}
    </div>
  );
};

export default observer(SpendingBreakdown);

