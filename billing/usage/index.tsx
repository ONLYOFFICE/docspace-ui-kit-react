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

import { type ReactNode, useEffect, useState } from "react";
import { observer } from "mobx-react";

import { Text } from "../../components/text";
import { Link } from "../../components/link";
import { RectangleSkeleton } from "../../components/rectangle";
import { useCommonTranslation } from "../../utils/i18n";
import { CommonTrans } from "../../utils/i18n/CommonTrans";
import { formatDateLocalized, getAppTimezone } from "../../utils/date";

import { useApi } from "../../providers";
import { usePaymentStore } from "../store/PaymentStoreProvider";
import { useServicesStore } from "../store/ServicesStoreProvider";
import type { TUsagePeriodKey } from "../types";

import PeriodSelect from "./sub-components/PeriodSelect";
import SpendingBreakdown from "./sub-components/SpendingBreakdown";
import { getUsageRange } from "./utils";
import styles from "./styles/Usage.module.scss";

type UsageProps = {
  /** Open the corresponding service detail page from its breakdown row. */
  onDiskStorageClick?: () => void;
  onBackupClick?: () => void;
  onAIServicesClick?: () => void;
};

const Usage = ({
  onDiskStorageClick,
  onBackupClick,
  onAIServicesClick,
}: UsageProps) => {
  const t = useCommonTranslation();
  const { paymentApi } = useApi();
  const { formatWalletCurrency, language, formatDate, openOnNewPage } =
    usePaymentStore();
  const { serviceUsage, initUsageData } = useServicesStore();

  const [period, setPeriod] = useState<TUsagePeriodKey>("thisMonth");
  const [isLoading, setIsLoading] = useState(true);

  const loadUsage = async (nextPeriod: TUsagePeriodKey) => {
    setIsLoading(true);

    try {
      await initUsageData(nextPeriod);
    } finally {
      setIsLoading(false);
    }
  };

  const onSelectPeriod = (nextPeriod: TUsagePeriodKey) => {
    setPeriod(nextPeriod);
    loadUsage(nextPeriod);
  };

  useEffect(() => {
    loadUsage(period);
  }, []);

  const totalSpend = serviceUsage.reduce(
    (sum, item) => sum + item.totalAmount,
    0,
  );

  const { from, to } = getUsageRange(period);

  const monthText = from.setLocale(language || "en").toFormat("LLLL yyyy");
  const startDate = formatDateLocalized(from, "DATE_MED", {
    locale: language,
    timezone: getAppTimezone(),
  });
  const endDate = formatDateLocalized(to, "DATE_MED", {
    locale: language,
    timezone: getAppTimezone(),
  });

  const dateRangeSpan = <Text as="span" className={styles.totalRange} />;

  const periodCaption: Record<TUsagePeriodKey, ReactNode> = {
    thisMonth: t("ForPeriod", { period: monthText }),
    lastMonth: t("ForPeriod", { period: monthText }),
    last3Months: (
      <CommonTrans
        i18nKey="ForLast3Months"
        values={{ startDate, endDate }}
        components={{ 1: dateRangeSpan }}
      />
    ),
    last6Months: (
      <CommonTrans
        i18nKey="ForLast6Months"
        values={{ startDate, endDate }}
        components={{ 1: dateRangeSpan }}
      />
    ),
    last12Months: (
      <CommonTrans
        i18nKey="ForLast12Months"
        values={{ startDate, endDate }}
        components={{ 1: dateRangeSpan }}
      />
    ),
    thisYear: (
      <CommonTrans
        i18nKey="ForThisYear"
        values={{ startDate, endDate }}
        components={{ 1: dateRangeSpan }}
      />
    ),
    lastYear: (
      <CommonTrans
        i18nKey="ForLastYear"
        values={{ startDate, endDate }}
        components={{ 1: dateRangeSpan }}
      />
    ),
  };

  const onDownloadReport = async (serviceName?: string) => {
    await paymentApi.createCustomerOperationsReport({
      customerOperationsReportRequestDto: {
        startDate: formatDate!(from, "start"),
        endDate: formatDate!(to, "end"),
        credit: true,
        debit: true,
        ...(serviceName ? { serviceName } : {}),
      },
    });

    const result = await new Promise<{ resultFileUrl?: string }>(
      (resolve, reject) => {
        const check = async () => {
          try {
            const res = await paymentApi.getCustomerOperationsReport();
            const response = res?.data?.response as
              | { isCompleted?: boolean; resultFileUrl?: string; error?: string }
              | undefined;

            if (!response) { reject(new Error(t("UnexpectedError"))); return; }
            if (response.error) { reject(new Error(response.error)); return; }
            if (response.isCompleted) { resolve(response); return; }
            setTimeout(check, 1000);
          } catch (err) { reject(err); }
        };
        check();
      },
    );

    if (result.resultFileUrl) {
      window.open(result.resultFileUrl, openOnNewPage ? "_blank" : "_self");
    }
  };

  return (
    <div className={styles.usage}>
      <Text className={styles.description}>{t("UsageDescription")}</Text>

      <div className={styles.controls}>
        <PeriodSelect value={period} onSelect={onSelectPeriod} />
        <Link
          fontSize="13px"
          fontWeight={600}
          color="accent"
          textDecoration="underline dashed"
          onClick={() => onDownloadReport()}
          dataTestId="usage_download_report"
        >
          {t("DownloadReportBtnText")}
        </Link>
      </div>

      <div className={styles.totalCard}>
        <Text className={styles.totalLabel}>{t("TotalSpend")}</Text>
        {isLoading ? (
          <RectangleSkeleton width="120px" height="24px" borderRadius="3px" />
        ) : (
          <Text className={styles.totalValue}>
            {formatWalletCurrency(totalSpend, 2)}
          </Text>
        )}
        <Text className={styles.totalCaption}>{periodCaption[period]}</Text>
      </div>

      <SpendingBreakdown
        period={period}
        isLoading={isLoading}
        onDiskStorageClick={onDiskStorageClick}
        onBackupClick={onBackupClick}
        onAIServicesClick={onAIServicesClick}
        onDownloadReport={onDownloadReport}
      />
    </div>
  );
};

export default observer(Usage);

