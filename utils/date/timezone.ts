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

import { DateTime, Settings } from "luxon";
import { parseToDateTime } from "./parse";

// Note: Window.timezone is declared in types/index.ts

/**
 * Gets the browser's timezone
 * @returns IANA timezone string (e.g., "America/New_York")
 */
export function getBrowserTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/**
 * Gets the application timezone (from window.timezone or browser default)
 * @returns IANA timezone string
 */
export function getAppTimezone(): string {
  return window.timezone || getBrowserTimezone();
}

/**
 * Converts a date to a specific timezone
 * @param date - Date to convert
 * @param timezone - Target timezone (IANA format)
 * @returns DateTime in the specified timezone
 */
export function toTimezone(
  date: Date | string | DateTime | null | undefined,
  timezone: string,
): DateTime | null {
  const dt = parseToDateTime(date);
  if (!dt) return null;

  return dt.setZone(timezone);
}

/**
 * Converts a date to the application timezone
 * @param date - Date to convert
 * @returns DateTime in the application timezone
 */
export function toAppTimezone(
  date: Date | string | DateTime | null | undefined,
): DateTime | null {
  return toTimezone(date, getAppTimezone());
}

/**
 * Checks if a timezone string is valid
 * @param timezone - Timezone to validate
 * @returns True if the timezone is valid
 */
export function isValidTimezone(timezone: string): boolean {
  const dt = DateTime.now().setZone(timezone);
  return dt.isValid;
}

/**
 * Gets the UTC offset for a timezone
 * @param timezone - Timezone to check
 * @returns UTC offset in minutes
 */
export function getTimezoneOffset(timezone: string): number {
  const dt = DateTime.now().setZone(timezone);
  return dt.offset;
}

/**
 * Formats a date with timezone applied
 * @param date - Date to format
 * @param format - Format string (luxon format)
 * @param options - Formatting options
 * @returns Formatted date string
 */
export function formatWithTimezone(
  date: Date | string | DateTime | null | undefined,
  format: string,
  options?: {
    timezone?: string;
    locale?: string;
  },
): string {
  const dt = parseToDateTime(date);
  if (!dt) return "";

  let result = dt;

  const tz = options?.timezone || getAppTimezone();
  result = result.setZone(tz);

  if (options?.locale) {
    result = result.setLocale(options.locale);
  }

  return result.toFormat(format);
}

/**
 * Sets the default timezone for luxon
 * @param timezone - Timezone to set as default
 */
export function setDefaultTimezone(timezone: string): void {
  Settings.defaultZone = timezone;
}

/**
 * Sets the default locale for luxon
 * @param locale - Locale to set as default
 */
export function setDefaultLocale(locale: string): void {
  Settings.defaultLocale = locale;
}

/**
 * Gets Unix timestamp in seconds
 * @param date - Date to convert
 * @returns Unix timestamp (seconds since epoch)
 */
export function toUnixTimestamp(
  date: Date | string | DateTime | null | undefined,
): number {
  const dt = parseToDateTime(date);
  if (!dt) return 0;

  return Math.floor(dt.toMillis() / 1000);
}

/**
 * Creates DateTime from Unix timestamp
 * @param timestamp - Unix timestamp (seconds since epoch)
 * @returns DateTime object
 */
export function fromUnixTimestamp(timestamp: number): DateTime {
  return DateTime.fromSeconds(timestamp);
}

/**
 * Converts DateTime to ISO string
 * @param date - Date to convert
 * @returns ISO 8601 string
 */
export function toISOString(
  date: Date | string | DateTime | null | undefined,
): string {
  const dt = parseToDateTime(date);
  if (!dt) return "";

  return dt.toISO() ?? "";
}

/**
 * Converts DateTime to JavaScript Date object
 * @param dateTime - DateTime to convert
 * @returns JavaScript Date object
 */
export function toJSDate(
  dateTime: DateTime | null | undefined,
): Date | null {
  if (!dateTime || !dateTime.isValid) return null;
  return dateTime.toJSDate();
}
