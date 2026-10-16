import React from "react";
import { observer } from "mobx-react";

import { Text } from "../../../../components/text";
import { CommonTrans } from "../../../../utils/i18n/CommonTrans";
import { usePaymentStore } from "../../../store/PaymentStoreProvider";

import type { TServiceLimit, TServiceLimitUsage } from "../common/types";
import {
  formatPeriodEnd,
  getLimitUsagePercent,
  isLimitApproaching,
  isLimitReached,
} from "../common/utils";
import styles from "../styles/ServiceLimits.module.scss";

type LimitStatusProps = {
  limit: TServiceLimit | null;
  usage: TServiceLimitUsage | null;
  draftAmount: number | null;
  currency: string;
  testId: string;
};

const LimitStatus = ({
  limit,
  usage,
  draftAmount,
  currency,
  testId,
}: LimitStatusProps) => {
  const { language, formatWalletCurrency } = usePaymentStore();

  if (!usage) return null;

  const spent = formatWalletCurrency(usage.amountConsumed, 2, currency);
  const date = formatPeriodEnd(usage.periodEnd, language);

  const renderStatus = (
    i18nKey: string,
    values: Record<string, string | number>,
    highlightClass: string = styles.statusWarning,
  ) => (
    <Text className={styles.status} dataTestId={testId}>
      <CommonTrans
        i18nKey={i18nKey}
        values={values}
        components={{
          1: <Text as="span" fontWeight={600} className={highlightClass} />,
        }}
      />
    </Text>
  );

  if (draftAmount !== null && draftAmount < usage.amountConsumed) {
    const amount = formatWalletCurrency(draftAmount, 2, currency);

    return renderStatus("LimitBelowSpent", { spent, amount, date });
  }

  const limitValue = limit?.enabled ? limit.amountValue : null;

  if (limitValue === null) return null;

  const limitText = formatWalletCurrency(limitValue, 2, currency);

  if (isLimitReached(usage.amountConsumed, limitValue)) {
    return renderStatus("LimitReached", { date }, styles.statusReached);
  }

  if (isLimitApproaching(usage.amountConsumed, limitValue)) {
    const percent = getLimitUsagePercent(usage.amountConsumed, limitValue);

    return renderStatus("LimitSpentOfPercent", {
      spent,
      limit: limitText,
      percent,
      date,
    });
  }

  return renderStatus("LimitSpentOf", { spent, limit: limitText, date });
};

export default observer(LimitStatus);
