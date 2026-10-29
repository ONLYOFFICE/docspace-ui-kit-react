import { useCallback, useEffect, useState } from "react";

import type { TTranslation } from "../../../../utils/common";
import type { TServiceLimit, TServiceLimitPeriod } from "../common/types";
import {
  DEFAULT_LIMIT_PERIOD,
  formatAmountInput,
  isAmountOutOfRange,
  MAX_LIMIT_AMOUNT,
  MIN_LIMIT_AMOUNT,
  parseAmount,
} from "../common/utils";

type UseLimitFormParams = {
  limit: TServiceLimit | null;
  currency: string;
  isSaving: boolean;
  isDisabled: boolean;
  formatCurrency: (
    amount: number,
    fractionDigits: number,
    currency: string,
  ) => string;
  t: TTranslation;
};

export const useLimitForm = ({
  limit,
  currency,
  isSaving,
  isDisabled,
  formatCurrency,
  t,
}: UseLimitFormParams) => {
  const [isDraft, setIsDraft] = useState(false);
  const [amountText, setAmountText] = useState("");
  const [period, setPeriod] =
    useState<TServiceLimitPeriod>(DEFAULT_LIMIT_PERIOD);

  const reset = useCallback(() => {
    setAmountText(formatAmountInput(limit?.amountValue));
    setPeriod(limit?.period ?? DEFAULT_LIMIT_PERIOD);
  }, [limit]);

  useEffect(() => {
    reset();
  }, [reset]);

  const isEnabled = Boolean(limit?.enabled);
  const amount = parseAmount(amountText);
  const isOutOfRange = isAmountOutOfRange(amount);

  const isDirty =
    !isEnabled || amount !== limit?.amountValue || period !== limit?.period;

  const canSave =
    amount !== null && !isOutOfRange && isDirty && !isSaving && !isDisabled;

  const getAmountError = () => {
    if (amount === null) return undefined;

    if (amount > MAX_LIMIT_AMOUNT) {
      return t("MaxCurrency", {
        currency: formatCurrency(MAX_LIMIT_AMOUNT, 0, currency),
      });
    }

    if (amount < MIN_LIMIT_AMOUNT) {
      return t("MinCurrency", {
        currency: formatCurrency(MIN_LIMIT_AMOUNT, 0, currency),
      });
    }

    return undefined;
  };

  return {
    isEnabled,
    isDraft,
    setIsDraft,
    amountText,
    setAmountText,
    period,
    setPeriod,
    amount,
    amountError: getAmountError(),
    isOutOfRange,
    isDirty,
    canSave,
    reset,
  };
};
