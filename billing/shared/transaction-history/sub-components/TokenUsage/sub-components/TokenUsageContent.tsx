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

import classNames from "classnames";

import { Text } from "../../../../../../components/text";
import { useCommonTranslation } from "../../../../../../utils/i18n";

import type { OperationTokenUsage } from "../../../../../store/PaymentStore";
import { usePaymentStore } from "../../../../../store/PaymentStoreProvider";
import { formatNumber } from "../../../../../utils/common";
import { getCachedTokensPercent, getTokenUsageSegments } from "../../../utils";

import styles from "../TokenUsage.module.scss";

type Segment = "fromCache" | "notFromCache" | "received";

const segmentClass: Record<Segment, string> = {
  fromCache: styles.fromCache,
  notFromCache: styles.notFromCache,
  received: styles.received,
};

type UsageLineProps = {
  label: string;
  value: string;
  segment?: Segment;
};

const UsageLine = ({ label, value, segment }: UsageLineProps) => (
  <div className={styles.line}>
    {segment ? (
      <span className={`${styles.marker} ${segmentClass[segment]}`} />
    ) : null}
    <Text as="span" fontSize="12px" className={styles.label}>
      {label}
    </Text>
    <Text as="span" fontSize="12px" fontWeight={600} className={styles.value}>
      {value}
    </Text>
  </div>
);

export const TokenUsageContent = ({
  usage,
}: {
  usage: OperationTokenUsage;
}) => {
  const t = useCommonTranslation();
  const { language } = usePaymentStore();
  const segments = getTokenUsageSegments(usage);
  const percent = getCachedTokensPercent(usage);
  const format = (value: number) => formatNumber(language, value);
  const fromCache =
    percent === null
      ? format(segments.fromCache)
      : t("TokenCountWithPercent", {
          tokens: format(segments.fromCache),
          percent,
        });

  const bar = (Object.keys(segments) as Segment[]).filter(
    (segment) => segments[segment] > 0,
  );

  return (
    <div className={styles.content} data-testid="token_usage_content">
      <div className={styles.title}>
        {t("TokenUsageTitle", { total: format(usage.totalTokens) })}
      </div>
      <div className={styles.bar}>
        {bar.map((segment) => (
          <span
            key={segment}
            className={segmentClass[segment]}
            style={{ flexGrow: segments[segment] }}
          />
        ))}
      </div>
      <div className={styles.lines}>
        <UsageLine
          segment="fromCache"
          label={t("TokensFromCache")}
          value={fromCache}
        />
        <UsageLine
          segment="notFromCache"
          label={t("TokensNotFromCache")}
          value={format(segments.notFromCache)}
        />
        <UsageLine
          segment="received"
          label={t("TokensReceived")}
          value={format(segments.received)}
        />
      </div>
      <div className={classNames(styles.lines, styles.details)}>
        <UsageLine
          label={t("TokensWrittenToCache")}
          value={format(usage.cacheWriteTokens)}
        />
        <UsageLine
          label={t("Thinking")}
          value={format(usage.reasoningTokens)}
        />
        <UsageLine label={t("Images")} value={format(usage.imageTokens)} />
      </div>
    </div>
  );
};
