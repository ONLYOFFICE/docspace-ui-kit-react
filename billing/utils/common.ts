import { Duration } from "luxon";

import { isLanguageRtl } from "../../providers/theme/rtl-utils";
import { dateDiff, now } from "../../utils/date";
import { LATIN_NUMBERING_SYSTEM } from "../../utils/latin-digits";

const FIRST_STRONG_ISOLATE = "\u2068";
const POP_DIRECTIONAL_ISOLATE = "\u2069";

export const isolateCurrencySymbol = (language: string, symbol: string) =>
  symbol && isLanguageRtl(language)
    ? `${FIRST_STRONG_ISOLATE}${symbol}${POP_DIRECTIONAL_ISOLATE}`
    : symbol;

export const isolateCurrencyParts = (
  language: string,
  parts: Intl.NumberFormatPart[],
): Intl.NumberFormatPart[] =>
  parts.map((part) =>
    part.type === "currency"
      ? { ...part, value: isolateCurrencySymbol(language, part.value) }
      : part,
  );

export const formatCurrencyIsolated = (
  language: string,
  formatter: Intl.NumberFormat,
  amount: number,
) =>
  isolateCurrencyParts(language, formatter.formatToParts(amount))
    .map(({ value }) => value)
    .join("");

/**
 * Whole days from now until `date` (negative if the date is in the past).
 */
export const daysUntil = (date: Date | string | null | undefined) =>
  Math.floor(dateDiff(date, now(), "days"));

/**
 * Human-readable remaining period, e.g. "15 days" (localized).
 * Falls back to the "< 1 day" label when there is one day or less left.
 */
export const formatRemainingDays = (
  days: number,
  language: string,
  t: (key: string) => string,
) =>
  days > 1
    ? Duration.fromObject(
        { days },
        // Its own setting, not the host's luxon default: Storybook sets none.
        { locale: language, numberingSystem: LATIN_NUMBERING_SYSTEM },
      ).toHuman()
    : t("LessThanOneDay");

// Done in a similar way to server code
// https://github.com/ONLYOFFICE/DocSpace-server/blob/master/common/ASC.Common/Utils/CommonFileSizeComment.cs
export const getPowerFromBytes = (bytes: number, maxPower = 6) => {
  const power = Math.floor(Math.log(bytes) / Math.log(1024));
  return power <= maxPower ? power : maxPower;
};

export const getSizeFromBytes = (bytes: number, power: number) => {
  const size = bytes / 1024 ** power;
  const truncateToTwo = Math.trunc(size * 100) / 100;

  return truncateToTwo;
};

export const getConvertedSize = (
  t: (key: string) => string,
  bytes: number,
  withoutSizeName: boolean = false,
) => {
  let power = 0;
  let resultSize = bytes;

  const sizeNames = [
    t("Common:Bytes"),
    t("Common:Kilobyte"),
    t("Common:Megabyte"),
    t("Common:Gigabyte"),
    t("Common:Terabyte"),
    t("Common:Petabyte"),
    t("Common:Exabyte"),
  ];

  if (bytes <= 0) return `${`0 ${t("Common:Bytes")}`}`;

  if (bytes >= 1024) {
    power = getPowerFromBytes(bytes, sizeNames.length - 1);
    resultSize = getSizeFromBytes(bytes, power);
  }

  if (withoutSizeName) return `${resultSize}`;

  return `${resultSize} ${sizeNames[power]}`;
};

export const calculateTotalPrice = (
  quantity: number,
  unitPrice: number,
): number => {
  return Number((quantity * unitPrice).toFixed(2));
};

export const truncateNumberToFraction = (
  value: number,
  digits: number = 2,
): string => {
  const [intPart, fracPart = ""] = value.toString().split(".");
  const truncated = fracPart.slice(0, digits).padEnd(digits, "0");
  return `${intPart}.${truncated}`;
};

export const formatCurrencyValue = (
  language: string,
  amount: number,
  currency: string,
  fractionDigits: number = 3,
) => {
  const truncatedStr = truncateNumberToFraction(amount, fractionDigits);
  const truncated = Number(truncatedStr);

  const formatter = new Intl.NumberFormat(language, {
    numberingSystem: LATIN_NUMBERING_SYSTEM,
    style: "currency",
    currency,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });

  return formatCurrencyIsolated(language, formatter, truncated);
};

/** Formats a fee percent with the locale's decimal separator, e.g. 5.5 → "5,5". */
export const formatPercentValue = (language: string, value: number) =>
  new Intl.NumberFormat(language, {
    numberingSystem: LATIN_NUMBERING_SYSTEM,
    maximumFractionDigits: 2,
  }).format(value);

export const formatNumber = (language: string, value: number) =>
  new Intl.NumberFormat(language, {
    numberingSystem: LATIN_NUMBERING_SYSTEM,
  }).format(value);

export const formatCompactNumber = (value: number, language = "en"): string =>
  new Intl.NumberFormat(language, {
    numberingSystem: LATIN_NUMBERING_SYSTEM,
    notation: value >= 1_000_000 ? "compact" : "standard",
    maximumFractionDigits: 2,
  }).format(value);

export const getCurrencySymbol = (
  currency?: string,
  language = "en",
): string => {
  if (!currency) return "";
  try {
    return isolateCurrencySymbol(
      language,
      new Intl.NumberFormat(language, {
        numberingSystem: LATIN_NUMBERING_SYSTEM,
        style: "currency",
        currency,
      })
        .formatToParts(0)
        .find((part) => part.type === "currency")?.value ?? currency,
    );
  } catch {
    return currency;
  }
};
