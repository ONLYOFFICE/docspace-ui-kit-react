import type { TTranslation } from "../../../../utils/common";
import { formatWithTimezone, getAppTimezone } from "../../../../utils/date";

import type { TServiceLimitPeriod } from "./types";

export const LIMIT_PERIODS: TServiceLimitPeriod[] = [
  "Day",
  "Week",
  "Month",
  "Lifetime",
];

export const DEFAULT_LIMIT_PERIOD: TServiceLimitPeriod = "Day";

export const getPeriodLabel = (
  t: TTranslation,
  period: TServiceLimitPeriod,
): string => {
  switch (period) {
    case "Week":
      return t("LimitPerWeek");
    case "Month":
      return t("LimitPerMonth");
    case "Lifetime":
      return t("LimitLifetime");
    default:
      return t("LimitPerDay");
  }
};

export const MIN_LIMIT_AMOUNT = 1;
export const MAX_LIMIT_AMOUNT = 10000;

export const AMOUNT_FRACTION_DIGITS = 2;

/** Digits with an optional decimal part of up to two digits, after a dot or a comma. */
const AMOUNT_PATTERN = /^\d*([.,]\d{0,2})?$/;

export const isAmountInputValid = (value: string): boolean =>
  AMOUNT_PATTERN.test(value);

export const parseAmount = (value: string): number | null => {
  const trimmed = value.trim().replace(",", ".");
  if (trimmed === "" || !AMOUNT_PATTERN.test(trimmed)) return null;
  const amount = Number(trimmed);
  return Number.isFinite(amount) && amount >= 0 ? amount : null;
};

export const isAmountOutOfRange = (amount: number | null): boolean =>
  amount !== null && (amount < MIN_LIMIT_AMOUNT || amount > MAX_LIMIT_AMOUNT);

export const formatAmountInput = (amount: number | null | undefined): string =>
  amount === null || amount === undefined
    ? ""
    : String(Number(amount.toFixed(AMOUNT_FRACTION_DIGITS)));

export const getCurrencySymbol = (
  language: string,
  currency: string | null | undefined,
): string => {
  if (!currency) return "";
  try {
    return (
      new Intl.NumberFormat(language, { style: "currency", currency })
        .formatToParts(0)
        .find((part) => part.type === "currency")?.value ?? currency
    );
  } catch {
    return currency;
  }
};

export const isCurrencySymbolAfter = (
  language: string,
  currency: string | null | undefined,
): boolean => {
  if (!currency) return false;
  try {
    const types = new Intl.NumberFormat(language, {
      style: "currency",
      currency,
    })
      .formatToParts(1)
      .map((part) => part.type);
    return types.indexOf("currency") > types.indexOf("integer");
  } catch {
    return false;
  }
};

const toZonedIso = (value: string): string =>
  /(Z|[+-]\d{2}:?\d{2})$/.test(value) ? value : `${value}Z`;

export const formatPeriodEnd = (
  periodEnd: string | null | undefined,
  language: string,
): string => {
  if (!periodEnd) return "";
  return formatWithTimezone(toZonedIso(periodEnd), "LLL d, tt", {
    locale: language,
    timezone: getAppTimezone(),
  });
};

export const isLimitReached = (
  amountConsumed: number,
  amountValue: number | null,
): boolean => amountValue !== null && amountConsumed >= amountValue;

export const LIMIT_APPROACHING_RATIO = 0.8;

export const getLimitUsagePercent = (
  amountConsumed: number,
  amountValue: number | null,
): number =>
  amountValue
    ? Math.min(100, Math.floor((amountConsumed / amountValue) * 100))
    : 0;

export const isLimitApproaching = (
  amountConsumed: number,
  amountValue: number | null,
): boolean =>
  amountValue !== null &&
  amountValue > 0 &&
  amountConsumed < amountValue &&
  amountConsumed / amountValue >= LIMIT_APPROACHING_RATIO;
