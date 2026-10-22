import React from "react";
import { observer } from "mobx-react";

import { Text } from "../../../../components/text";
import { CommonTrans } from "../../../../utils/i18n/CommonTrans";
import { usePaymentStore } from "../../../store/PaymentStoreProvider";

import type {
  TServiceLimit,
  TServiceLimitPeriod,
  TServiceLimitUsage,
} from "../common/types";
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
  draftPeriod: TServiceLimitPeriod;
  currency: string;
  testId: string;
};

const highlight = (className: string) => ({
  1: <Text as="span" fontWeight={600} className={className} />,
});

/**
 * Every translation key is written out as a literal: the locale sync finds
 * keys by scanning for them, and a key built at runtime would be dropped.
 * A lifetime limit never resets, so its usage has no period end and its
 * texts have no date. A limit read without its spending, such as the one for
 * every user, still says when it resets, from the period end sent with it.
 */
const LimitStatus = ({
  limit,
  usage,
  draftAmount,
  draftPeriod,
  currency,
  testId,
}: LimitStatusProps) => {
  const { language, formatWalletCurrency } = usePaymentStore();

  const render = (content: React.ReactNode) => (
    <Text className={styles.status} dataTestId={testId}>
      {content}
    </Text>
  );

  if (!usage) {
    const periodEnd =
      limit?.enabled && draftPeriod === limit.period ? limit.periodEnd : null;

    if (!periodEnd) return null;

    return render(
      <CommonTrans
        i18nKey="LimitResets"
        values={{ date: formatPeriodEnd(periodEnd, language) }}
      />,
    );
  }

  const spent = formatWalletCurrency(usage.amountConsumed, 2, currency);
  const date = formatPeriodEnd(usage.periodEnd, language);
  const hasReset = Boolean(usage.periodEnd);
  const warning = highlight(styles.statusWarning);

  if (draftAmount !== null && draftAmount < usage.amountConsumed) {
    const values = {
      spent,
      amount: formatWalletCurrency(draftAmount, 2, currency),
      date,
    };

    return render(
      hasReset ? (
        <CommonTrans
          i18nKey="LimitBelowSpent"
          values={values}
          components={warning}
        />
      ) : (
        <CommonTrans
          i18nKey="LimitBelowSpentLifetime"
          values={values}
          components={warning}
        />
      ),
    );
  }

  const limitValue = limit?.enabled ? limit.amountValue : null;

  if (limitValue === null) return null;

  const limitText = formatWalletCurrency(limitValue, 2, currency);

  if (isLimitReached(usage.amountConsumed, limitValue)) {
    const reached = highlight(styles.statusReached);

    return render(
      hasReset ? (
        <CommonTrans
          i18nKey="LimitReached"
          values={{ date }}
          components={reached}
        />
      ) : (
        <CommonTrans i18nKey="LimitReachedLifetime" components={reached} />
      ),
    );
  }

  if (isLimitApproaching(usage.amountConsumed, limitValue)) {
    const percent = getLimitUsagePercent(usage.amountConsumed, limitValue);
    const values = { spent, limit: limitText, percent, date };

    return render(
      hasReset ? (
        <CommonTrans
          i18nKey="LimitSpentOfPercent"
          values={values}
          components={warning}
        />
      ) : (
        <CommonTrans
          i18nKey="LimitSpentOfPercentLifetime"
          values={values}
          components={warning}
        />
      ),
    );
  }

  const values = { spent, limit: limitText, date };

  return render(
    hasReset ? (
      <CommonTrans
        i18nKey="LimitSpentOf"
        values={values}
        components={warning}
      />
    ) : (
      <CommonTrans
        i18nKey="LimitSpentOfLifetime"
        values={values}
        components={warning}
      />
    ),
  );
};

export default observer(LimitStatus);
