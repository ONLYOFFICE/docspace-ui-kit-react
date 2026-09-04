import { DateTime, DurationLikeObject } from "luxon";
import { parseToDateTime } from "./parse";

export type DateUnit =
  | "years"
  | "months"
  | "weeks"
  | "days"
  | "hours"
  | "minutes"
  | "seconds"
  | "milliseconds";

/**
 * Adds a duration to a date
 * @param date - Base date
 * @param amount - Amount to add
 * @param unit - Unit of time
 * @returns New DateTime with added duration
 */
export function addToDate(
  date: Date | string | DateTime | null | undefined,
  amount: number,
  unit: DateUnit,
): DateTime | null {
  const dt = parseToDateTime(date);
  if (!dt) return null;

  const duration: DurationLikeObject = { [unit]: amount };
  return dt.plus(duration);
}

/**
 * Subtracts a duration from a date
 * @param date - Base date
 * @param amount - Amount to subtract
 * @param unit - Unit of time
 * @returns New DateTime with subtracted duration
 */
export function subtractFromDate(
  date: Date | string | DateTime | null | undefined,
  amount: number,
  unit: DateUnit,
): DateTime | null {
  const dt = parseToDateTime(date);
  if (!dt) return null;

  const duration: DurationLikeObject = { [unit]: amount };
  return dt.minus(duration);
}

/**
 * Gets the start of a time unit
 * @param date - Base date
 * @param unit - Unit to get start of
 * @returns DateTime at the start of the specified unit
 */
export function startOf(
  date: Date | string | DateTime | null | undefined,
  unit: "year" | "month" | "week" | "day" | "hour" | "minute" | "second",
): DateTime | null {
  const dt = parseToDateTime(date);
  if (!dt) return null;

  return dt.startOf(unit);
}

/**
 * Gets the end of a time unit
 * @param date - Base date
 * @param unit - Unit to get end of
 * @returns DateTime at the end of the specified unit
 */
export function endOf(
  date: Date | string | DateTime | null | undefined,
  unit: "year" | "month" | "week" | "day" | "hour" | "minute" | "second",
): DateTime | null {
  const dt = parseToDateTime(date);
  if (!dt) return null;

  return dt.endOf(unit);
}

/**
 * Creates a DateTime from the current moment with specified additions
 * Equivalent to moment().add(X, unit)
 * @param amount - Amount to add
 * @param unit - Unit of time
 * @returns DateTime with added duration from now
 */
export function fromNowPlus(amount: number, unit: DateUnit): DateTime {
  return DateTime.now().plus({ [unit]: amount });
}

/**
 * Creates a DateTime from the current moment with specified subtractions
 * Equivalent to moment().subtract(X, unit)
 * @param amount - Amount to subtract
 * @param unit - Unit of time
 * @returns DateTime with subtracted duration from now
 */
export function fromNowMinus(amount: number, unit: DateUnit): DateTime {
  return DateTime.now().minus({ [unit]: amount });
}

/**
 * Gets the number of days in the month of the given date
 * @param date - Date to check
 * @returns Number of days in the month
 */
export function daysInMonth(
  date: Date | string | DateTime | null | undefined,
): number {
  const dt = parseToDateTime(date);
  if (!dt) return 0;

  return dt.daysInMonth ?? 0;
}

/**
 * Sets specific date/time components
 * @param date - Base date
 * @param values - Object with values to set
 * @returns New DateTime with updated values
 */
export function setDateValues(
  date: Date | string | DateTime | null | undefined,
  values: {
    year?: number;
    month?: number;
    day?: number;
    hour?: number;
    minute?: number;
    second?: number;
    millisecond?: number;
  },
): DateTime | null {
  const dt = parseToDateTime(date);
  if (!dt) return null;

  return dt.set(values);
}

/**
 * Gets specific date/time components
 * @param date - Date to extract from
 * @returns Object with date components
 */
export function getDateValues(
  date: Date | string | DateTime | null | undefined,
): {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  millisecond: number;
  weekday: number;
} | null {
  const dt = parseToDateTime(date);
  if (!dt) return null;

  return {
    year: dt.year,
    month: dt.month,
    day: dt.day,
    hour: dt.hour,
    minute: dt.minute,
    second: dt.second,
    millisecond: dt.millisecond,
    weekday: dt.weekday,
  };
}
