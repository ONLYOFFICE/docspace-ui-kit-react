// (c) Copyright Ascensio System SIA 2009-2026
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { DateTime, Settings } from "luxon";

import {
  formatDate,
  formatDateLocalized,
  convertMomentFormatToLuxon,
  getWeekdays,
  getMonths,
} from "./formatDate";

import {
  addToDate,
  subtractFromDate,
  startOf,
  endOf,
  fromNowPlus,
  fromNowMinus,
  daysInMonth,
  setDateValues,
  getDateValues,
} from "./dateArithmetic";

import {
  dateDiff,
  dateDiffAbs,
  isBefore,
  isAfter,
  isSame,
  isBetween,
  isValidDate,
  isPast,
  isFuture,
  isSameDay,
  minDate,
  maxDate,
} from "./dateComparison";

import {
  humanizeDuration,
  fromNow,
  createDuration,
  toRelative,
  convertDuration,
} from "./duration";

import {
  parseToDateTime,
  parseISO,
  parseWithFormat,
  createDateTime,
  today,
  now,
  fromMillis,
  fromSeconds,
  utc,
} from "./parse";

import {
  toTimezone,
  toAppTimezone,
  isValidTimezone,
  getBrowserTimezone,
  getAppTimezone,
  getTimezoneOffset,
  toUnixTimestamp,
  fromUnixTimestamp,
  toISOString,
  formatWithTimezone,
  setDefaultTimezone,
  setDefaultLocale,
  toJSDate,
} from "./timezone";

describe("Date Utilities", () => {
  describe("formatDate", () => {
    it("formats Date object correctly", () => {
      const date = new Date(2024, 0, 15, 10, 30, 0);
      expect(formatDate(date, "yyyy-MM-dd")).toBe("2024-01-15");
      expect(formatDate(date, "dd MMM yyyy")).toBe("15 Jan 2024");
      expect(formatDate(date, "HH:mm")).toBe("10:30");
    });

    it("formats ISO string correctly", () => {
      const isoString = "2024-01-15T10:30:00.000Z";
      expect(formatDate(isoString, "yyyy-MM-dd")).toBe("2024-01-15");
    });

    it("formats DateTime object correctly", () => {
      const dt = DateTime.fromObject({ year: 2024, month: 1, day: 15 });
      expect(formatDate(dt, "yyyy-MM-dd")).toBe("2024-01-15");
    });

    it("returns empty string for null/undefined", () => {
      expect(formatDate(null, "yyyy-MM-dd")).toBe("");
      expect(formatDate(undefined, "yyyy-MM-dd")).toBe("");
    });

    it("applies locale correctly", () => {
      const date = new Date(2024, 0, 15);
      const result = formatDate(date, "MMMM", { locale: "en" });
      expect(result).toBe("January");
    });
  });

  describe("convertMomentFormatToLuxon", () => {
    it("converts basic tokens", () => {
      expect(convertMomentFormatToLuxon("YYYY-MM-DD")).toBe("yyyy-MM-dd");
      expect(convertMomentFormatToLuxon("DD MMM YYYY")).toBe("dd MMM yyyy");
      expect(convertMomentFormatToLuxon("HH:mm:ss")).toBe("HH:mm:ss");
    });

    it("converts locale-aware tokens", () => {
      expect(convertMomentFormatToLuxon("LL")).toBe("DDD");
      expect(convertMomentFormatToLuxon("LT")).toBe("t");
    });
  });

  describe("formatDateLocalized", () => {
    it("formats with preset correctly", () => {
      const date = new Date(2024, 0, 15);
      const result = formatDateLocalized(date, "DATE_SHORT", { locale: "en" });
      expect(result).toContain("2024");
    });
  });

  describe("getWeekdays and getMonths", () => {
    it("returns weekday names", () => {
      const weekdays = getWeekdays("long", "en");
      expect(weekdays).toHaveLength(7);
      expect(weekdays).toContain("Monday");
    });

    it("returns month names", () => {
      const months = getMonths("long", "en");
      expect(months).toHaveLength(12);
      expect(months).toContain("January");
    });
  });

  describe("dateArithmetic", () => {
    it("adds days correctly", () => {
      const date = new Date(2024, 0, 15);
      const result = addToDate(date, 7, "days");
      expect(result?.day).toBe(22);
    });

    it("subtracts months correctly", () => {
      const date = new Date(2024, 5, 15);
      const result = subtractFromDate(date, 2, "months");
      expect(result?.month).toBe(4);
    });

    it("gets start of day", () => {
      const date = new Date(2024, 0, 15, 14, 30, 45);
      const result = startOf(date, "day");
      expect(result?.hour).toBe(0);
      expect(result?.minute).toBe(0);
      expect(result?.second).toBe(0);
    });

    it("gets end of day", () => {
      const date = new Date(2024, 0, 15, 10, 30, 0);
      const result = endOf(date, "day");
      expect(result?.hour).toBe(23);
      expect(result?.minute).toBe(59);
      expect(result?.second).toBe(59);
    });

    it("now returns current time", () => {
      const result = now();
      expect(result.isValid).toBe(true);
    });

    it("fromNowPlus adds correctly", () => {
      const result = fromNowPlus(7, "days");
      const expected = DateTime.now().plus({ days: 7 });
      expect(result.day).toBe(expected.day);
    });

    it("fromNowMinus subtracts correctly", () => {
      const result = fromNowMinus(1, "months");
      const expected = DateTime.now().minus({ months: 1 });
      expect(result.month).toBe(expected.month);
    });

    it("daysInMonth returns correct count", () => {
      expect(daysInMonth(new Date(2024, 1, 1))).toBe(29); // Feb 2024 is leap year
      expect(daysInMonth(new Date(2024, 0, 1))).toBe(31); // January
      expect(daysInMonth(null)).toBe(0);
    });

    it("setDateValues updates correctly", () => {
      const date = new Date(2024, 0, 15);
      const result = setDateValues(date, { year: 2025, month: 2 });
      expect(result?.year).toBe(2025);
      expect(result?.month).toBe(2);
      expect(result?.day).toBe(15);
      expect(setDateValues(null, { year: 2025 })).toBeNull();
    });

    it("getDateValues returns correct components", () => {
      const date = new Date(2024, 0, 15, 10, 30, 45, 500);
      const result = getDateValues(date);
      expect(result).toEqual({
        year: 2024,
        month: 1,
        day: 15,
        hour: 10,
        minute: 30,
        second: 45,
        millisecond: 500,
        weekday: 1, // 2024-01-15 is Monday
      });
      expect(getDateValues(null)).toBeNull();
    });

    it("handles null/undefined in arithmetic functions", () => {
      expect(addToDate(null, 1, "days")).toBeNull();
      expect(subtractFromDate(null, 1, "days")).toBeNull();
      expect(startOf(null, "day")).toBeNull();
      expect(endOf(null, "day")).toBeNull();
    });
  });

  describe("dateComparison", () => {
    it("calculates diff correctly", () => {
      const date1 = new Date(2024, 0, 20);
      const date2 = new Date(2024, 0, 15);
      expect(dateDiff(date1, date2, "days")).toBe(5);
    });

    it("calculates absolute diff", () => {
      const date1 = new Date(2024, 0, 10);
      const date2 = new Date(2024, 0, 15);
      expect(dateDiffAbs(date1, date2, "days")).toBe(5);
    });

    it("isBefore works correctly", () => {
      const date1 = new Date(2024, 0, 10);
      const date2 = new Date(2024, 0, 15);
      expect(isBefore(date1, date2)).toBe(true);
      expect(isBefore(date2, date1)).toBe(false);
    });

    it("isAfter works correctly", () => {
      const date1 = new Date(2024, 0, 20);
      const date2 = new Date(2024, 0, 15);
      expect(isAfter(date1, date2)).toBe(true);
      expect(isAfter(date2, date1)).toBe(false);
    });

    it("isSame works correctly", () => {
      const date1 = new Date(2024, 0, 15, 10, 30);
      const date2 = new Date(2024, 0, 15, 14, 45);
      expect(isSame(date1, date2, "day")).toBe(true);
      expect(isSame(date1, date2, "hour")).toBe(false);
    });

    it("isBetween works correctly", () => {
      const date = new Date(2024, 0, 15);
      const start = new Date(2024, 0, 10);
      const end = new Date(2024, 0, 20);
      expect(isBetween(date, start, end)).toBe(true);
      expect(isBetween(start, date, end)).toBe(false);
    });

    it("isValidDate works correctly", () => {
      expect(isValidDate(new Date(2024, 0, 15))).toBe(true);
      expect(isValidDate("2024-01-15")).toBe(true);
      expect(isValidDate("invalid")).toBe(false);
      expect(isValidDate(null)).toBe(false);
    });

    it("isPast and isFuture work correctly", () => {
      const pastDate = new Date(2020, 0, 1);
      const futureDate = new Date(2030, 0, 1);
      expect(isPast(pastDate)).toBe(true);
      expect(isFuture(pastDate)).toBe(false);
      expect(isPast(futureDate)).toBe(false);
      expect(isFuture(futureDate)).toBe(true);
      expect(isPast(null)).toBe(false);
      expect(isFuture(null)).toBe(false);
    });

    it("isSameDay works correctly", () => {
      const date1 = new Date(2024, 0, 15, 10, 30);
      const date2 = new Date(2024, 0, 15, 20, 45);
      const date3 = new Date(2024, 0, 16);
      expect(isSameDay(date1, date2)).toBe(true);
      expect(isSameDay(date1, date3)).toBe(false);
      expect(isSameDay(null, date1)).toBe(false);
    });

    it("minDate and maxDate work correctly", () => {
      const date1 = new Date(2024, 0, 10);
      const date2 = new Date(2024, 0, 20);
      expect(minDate(date1, date2)?.day).toBe(10);
      expect(maxDate(date1, date2)?.day).toBe(20);

      expect(minDate(null, date1)?.day).toBe(10);
      expect(maxDate(date1, null)?.day).toBe(10);
      expect(minDate(null, null)).toBeNull();
    });

    it("isBetween with inclusive/exclusive boundaries", () => {
      const date = new Date(2024, 0, 15);
      const start = new Date(2024, 0, 10);
      const end = new Date(2024, 0, 15);
      expect(isBetween(date, start, end, true)).toBe(true);
      expect(isBetween(date, start, end, false)).toBe(false);
    });

    it("isSame without units", () => {
      const date1 = new Date(2024, 0, 15, 10, 30);
      const date2 = new Date(2024, 0, 15, 10, 30);
      const date3 = new Date(2024, 0, 15, 10, 31);
      expect(isSame(date1, date2)).toBe(true);
      expect(isSame(date1, date3)).toBe(false);
    });

    it("handles null in comparison functions", () => {
      expect(dateDiff(null, new Date(), "days")).toBe(0);
      expect(isBefore(null, new Date())).toBe(false);
      expect(isAfter(null, new Date())).toBe(false);
      expect(isSame(null, new Date())).toBe(false);
      expect(isBetween(null, new Date(), new Date())).toBe(false);
    });
  });

  describe("duration", () => {
    it("creates duration correctly", () => {
      const duration = createDuration(5, "days");
      expect(duration.as("days")).toBe(5);
    });

    it("humanizes duration", () => {
      expect(humanizeDuration(1, "days")).toBe("1 day");
      expect(humanizeDuration(5, "days")).toBe("5 days");
      expect(humanizeDuration(1, "hours")).toBe("1 hour");
      expect(humanizeDuration(2, "hours")).toBe("2 hours");
    });

    it("humanizes with suffix", () => {
      expect(humanizeDuration(2, "days", { addSuffix: true })).toBe(
        "in 2 days",
      );
      expect(humanizeDuration(-2, "days", { addSuffix: true })).toBe(
        "2 days ago",
      );
    });

    it("humanizes with thresholds", () => {
      // Threshold 45 days means if we have >= 45 days, force using 'days' unit
      expect(humanizeDuration(50, "days", { thresholds: { days: 45 } })).toBe(
        "50 days",
      );
    });

    it("humanizes with locale", () => {
      const result = humanizeDuration(1, "days", { locale: "fr" }).replace(
        /\s/g,
        " ",
      );
      expect(result).toBe("1 jour");
    });

    it("fromNow works correctly", () => {
      const past = DateTime.now().minus({ days: 10, hours: 1 });
      const future = DateTime.now().plus({ days: 10, hours: 1 });

      expect(fromNow(past)).toContain("10 days ago");
      expect(fromNow(future)).toContain("10 days");
      expect(fromNow(null)).toBe("");
    });

    it("handles different input types in fromNow", () => {
      const now = DateTime.now();
      expect(
        fromNow(now.minus({ days: 2 }).toJSDate()).replace(/\s/g, " "),
      ).toContain("2 days ago");
      expect(
        fromNow(now.minus({ days: 2 }).toISO()).replace(/\s/g, " "),
      ).toContain("2 days ago");
      expect(fromNow("invalid")).toBe("");
    });

    it("toRelative calculates difference between dates", () => {
      const start = DateTime.now();
      const end = start.plus({ days: 10, hours: 1 });
      expect(toRelative(start, end)).toContain("10 days");
      expect(toRelative(end, start)).toContain("10 days ago");
      expect(toRelative(null, end)).toBe("");
    });

    it("handles different input types in toRelative", () => {
      const start = DateTime.now();
      const end = start.plus({ days: 2 });
      expect(toRelative(start, end.toJSDate()).replace(/\s/g, " ")).toContain(
        "in 2 days",
      );
      expect(toRelative(start.toISO(), end).replace(/\s/g, " ")).toContain(
        "in 2 days",
      );
      expect(toRelative("invalid", end)).toBe("");
      expect(toRelative(start, "invalid")).toBe("");
    });

    it("identifies significant units correctly", () => {
      const now = DateTime.now().minus({ milliseconds: 100 }); // subtract small amount to ensure 'now' is slightly in the future
      expect(fromNow(now.minus({ years: 2 }))).toContain("2 years ago");
      expect(fromNow(now.minus({ months: 2 }))).toContain("2 months ago");
      expect(fromNow(now.minus({ hours: 2 }))).toContain("2 hours ago");
      expect(fromNow(now.minus({ minutes: 2 }))).toContain("2 minutes ago");
      expect(fromNow(now.minus({ seconds: 30 }))).toContain("30 seconds ago");
    });

    it("convertDuration works", () => {
      expect(convertDuration(1, "days", "hours")).toBe(24);
      expect(convertDuration(60, "minutes", "hours")).toBe(1);
    });
  });

  describe("parse", () => {
    it("parses ISO strings", () => {
      const result = parseISO("2024-01-15T10:30:00.000Z");
      expect(result?.year).toBe(2024);
      expect(result?.month).toBe(1);
      expect(result?.day).toBe(15);
    });

    it("parses Date objects", () => {
      const date = new Date(2024, 0, 15);
      const result = parseToDateTime(date);
      expect(result?.year).toBe(2024);
    });

    it("parses various string formats", () => {
      expect(parseToDateTime("2024-01-15")?.day).toBe(15);
      expect(parseToDateTime("2024/01/15")?.day).toBe(15);
    });

    it("returns null for invalid dates", () => {
      expect(parseToDateTime(null)).toBeNull();
      expect(parseToDateTime("")).toBeNull();
      expect(parseToDateTime("0001-01-01T00:00:00.0000000Z")).toBeNull();
    });

    it("parseWithFormat works correctly", () => {
      const result = parseWithFormat("15 Jan 2024", "dd MMM yyyy");
      expect(result?.year).toBe(2024);
      expect(result?.month).toBe(1);
      expect(result?.day).toBe(15);
    });

    it("createDateTime creates correct date", () => {
      const result = createDateTime(2024, 1, 15, 10, 30, 45);
      expect(result.year).toBe(2024);
      expect(result.month).toBe(1);
      expect(result.day).toBe(15);
      expect(result.hour).toBe(10);
      expect(result.minute).toBe(30);
      expect(result.second).toBe(45);
    });

    it("today returns start of current day", () => {
      const result = today();
      expect(result.hour).toBe(0);
      expect(result.minute).toBe(0);
      expect(result.second).toBe(0);
    });

    it("parses DateTime objects", () => {
      const dt = DateTime.fromISO("2024-01-15T10:30:00Z");
      const result = parseToDateTime(dt);
      expect(result?.toISO()).toBe(dt.toISO());

      const invalidDt = DateTime.fromISO("invalid");
      expect(parseToDateTime(invalidDt)).toBeNull();
    });

    it("parses invalid Date objects", () => {
      const invalidDate = new Date("invalid");
      expect(parseToDateTime(invalidDate)).toBeNull();
    });

    it("parses SQL, HTTP and RFC2822 formats", () => {
      // SQL
      const sqlStr = "2024-01-15 10:30:00";
      expect(parseToDateTime(sqlStr)?.year).toBe(2024);

      // HTTP
      const httpStr = "Mon, 15 Jan 2024 10:30:00 GMT";
      expect(parseToDateTime(httpStr)?.day).toBe(15);

      // RFC2822
      const rfcStr = "Mon, 15 Jan 2024 10:30:00 +0000";
      expect(parseToDateTime(rfcStr)?.day).toBe(15);
    });

    it("parses various custom formats", () => {
      expect(parseToDateTime("2024-01-15 10:30:00")?.hour).toBe(10);
      expect(parseToDateTime("2024-01-15 10:30")?.minute).toBe(30);
      expect(parseToDateTime("15 Jan 2024")?.month).toBe(1);
      expect(parseToDateTime("15 January 2024")?.month).toBe(1);
      expect(parseToDateTime("01/15/2024")?.month).toBe(1);
      expect(parseToDateTime("15/01/2024")?.month).toBe(1);
      expect(parseToDateTime("2024/01/15")?.month).toBe(1);
    });

    it("falls back to JS Date parsing", () => {
      const jsDateStr = "Jan 15, 2024";
      const result = parseToDateTime(jsDateStr);
      expect(result?.year).toBe(2024);
      expect(result?.month).toBe(1);
      expect(result?.day).toBe(15);
    });

    it("fromMillis and fromSeconds work", () => {
      const millis = 1705314600000; // 2024-01-15T10:30:00Z
      expect(fromMillis(millis).toMillis()).toBe(millis);

      const seconds = 1705314600;
      expect(fromSeconds(seconds).toSeconds()).toBe(seconds);
    });

    it("utc creation works", () => {
      const result = utc({ year: 2024, month: 1, day: 15 });
      expect(result.zoneName).toBe("UTC");
      expect(result.year).toBe(2024);

      const nowUtc = utc();
      expect(nowUtc.zoneName).toBe("UTC");
    });

    it("parseWithFormat handles locale", () => {
      const result = parseWithFormat("15 janv. 2024", "dd MMM yyyy", {
        locale: "fr",
      });
      expect(result?.month).toBe(1);
      expect(result?.day).toBe(15);
    });
  });

  describe("timezone", () => {
    beforeEach(() => {
      vi.restoreAllMocks();
      const win = window as Window & { timezone?: string };
      Reflect.deleteProperty(win, "timezone");
      Settings.defaultZone = undefined as unknown as string;
      Settings.defaultLocale = undefined as unknown as string;
    });

    afterEach(() => {
      vi.restoreAllMocks();
      const win = window as Window & { timezone?: string };
      Reflect.deleteProperty(win, "timezone");
      Settings.defaultZone = undefined as unknown as string;
      Settings.defaultLocale = undefined as unknown as string;
    });

    it("converts to timezone correctly", () => {
      const date = DateTime.fromISO("2024-01-15T10:00:00.000Z");
      const result = toTimezone(date, "America/New_York");
      expect(result?.zoneName).toBe("America/New_York");
    });

    it("returns null when converting null to timezone", () => {
      expect(toTimezone(null, "UTC")).toBeNull();
    });

    it("gets browser and app timezone", () => {
      const dateTimeFormatSpy = vi
        .spyOn(Intl, "DateTimeFormat")
        .mockImplementation(
          () =>
            ({
              resolvedOptions: () => ({ timeZone: "UTC" }),
            }) as unknown as Intl.DateTimeFormat,
        );

      expect(getBrowserTimezone()).toBe("UTC");
      const win = window as Window & { timezone?: string };
      win.timezone = "Europe/Riga";
      expect(getAppTimezone()).toBe("Europe/Riga");

      dateTimeFormatSpy.mockRestore();
    });

    it("falls back to browser timezone when app timezone is unset", () => {
      const dateTimeFormatSpy = vi
        .spyOn(Intl, "DateTimeFormat")
        .mockImplementation(
          () =>
            ({
              resolvedOptions: () => ({ timeZone: "Asia/Tokyo" }),
            }) as unknown as Intl.DateTimeFormat,
        );

      const win = window as Window & { timezone?: string };
      Reflect.deleteProperty(win, "timezone");
      expect(getAppTimezone()).toBe("Asia/Tokyo");

      dateTimeFormatSpy.mockRestore();
    });

    it("converts to app timezone", () => {
      const win = window as Window & { timezone?: string };
      win.timezone = "UTC";
      const result = toAppTimezone("2024-01-15T10:00:00Z");

      expect(result?.zoneName).toBe("UTC");
    });

    it("validates timezone correctly", () => {
      expect(isValidTimezone("America/New_York")).toBe(true);
      expect(isValidTimezone("Invalid/Timezone")).toBe(false);
    });

    it("returns timezone offset", () => {
      vi.spyOn(DateTime, "now").mockReturnValue(
        DateTime.fromISO("2024-01-01T00:00:00Z", {
          zone: "UTC",
        }) as unknown as DateTime,
      );

      expect(getTimezoneOffset("UTC")).toBe(0);
    });

    it("converts to/from Unix timestamp", () => {
      const date = new Date(2024, 0, 15, 0, 0, 0);
      const timestamp = toUnixTimestamp(date);
      expect(timestamp).toBeGreaterThan(0);

      const backToDate = fromUnixTimestamp(timestamp);
      expect(backToDate.year).toBe(2024);
    });

    it("returns zero timestamp for null input", () => {
      expect(toUnixTimestamp(null)).toBe(0);
    });

    it("converts to ISO string", () => {
      const date = new Date(2024, 0, 15, 10, 30, 0);
      const result = toISOString(date);
      expect(result).toContain("2024-01-15");
    });

    it("returns empty string for ISO conversion when date is null", () => {
      expect(toISOString(null)).toBe("");
    });

    it("formats with timezone and locale", () => {
      const formatted = formatWithTimezone("2024-01-01T00:00:00Z", "ZZ", {
        timezone: "Europe/Riga",
        locale: "fr",
      });

      expect(formatted).toBe("+02:00");
    });

    it("returns empty string when formatting null date", () => {
      expect(formatWithTimezone(null, "yyyy")).toBe("");
    });

    it("sets default timezone and locale", () => {
      setDefaultTimezone("UTC");
      setDefaultLocale("fr");

      expect(Settings.defaultZone?.name).toBe("UTC");
      expect(Settings.defaultLocale).toBe("fr");
    });

    it("handles toJSDate for invalid and valid DateTime", () => {
      expect(toJSDate(null)).toBeNull();

      const valid = DateTime.fromISO("2024-01-01T00:00:00Z");
      expect(toJSDate(valid)).toBeInstanceOf(Date);
    });
  });
});
