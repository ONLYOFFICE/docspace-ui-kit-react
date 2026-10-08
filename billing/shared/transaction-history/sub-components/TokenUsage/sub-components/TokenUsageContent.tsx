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
          label={t("TokensReasoning")}
          value={format(usage.reasoningTokens)}
        />
        <UsageLine label={t("Images")} value={format(usage.imageTokens)} />
      </div>
    </div>
  );
};
