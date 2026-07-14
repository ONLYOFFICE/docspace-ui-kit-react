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

import type { DateTime } from "luxon";
import {
  startOf,
  formatDate,
  subtractFromDate,
  addToDate,
  daysInMonth,
} from "../../../../utils/date";

export const getCalendarDays = (date: DateTime) => {
  const observedDate = date;

  const prevMonthDays: { key: string; value: string }[] = [];
  const currentMonthDays: { key: string; value: string }[] = [];
  const nextMonthDays: { key: string; value: string }[] = [];
  const maxCalendarDays = 42;

  // Get first day of month, then start of that week (Monday)
  const firstOfMonth = startOf(observedDate, "month")!;
  const firstCalendarMonday = startOf(firstOfMonth, "week")!.day;

  let yearMonthDate = formatDate(observedDate, "yyyy-MM-");

  const currentMonthDaysCount = daysInMonth(observedDate);
  for (let i = 1; i <= currentMonthDaysCount; i += 1) {
    currentMonthDays.push({
      key: yearMonthDate + String(i),
      value: String(i),
    });
  }

  if (firstCalendarMonday !== 1) {
    const prevMonth = subtractFromDate(observedDate, 1, "months")!;
    const prevMonthLength = daysInMonth(prevMonth);

    yearMonthDate = formatDate(prevMonth, "yyyy-MM-");

    for (let i = firstCalendarMonday; i <= prevMonthLength; i += 1) {
      prevMonthDays.push({
        key: yearMonthDate + String(i),
        value: String(i),
      });
    }
  }

  const nextMonth = addToDate(observedDate, 1, "months")!;
  yearMonthDate = formatDate(nextMonth, "yyyy-MM-");

  for (
    let i = 1;
    i <= maxCalendarDays - currentMonthDays.length - prevMonthDays.length;
    i += 1
  ) {
    nextMonthDays.push({
      key: yearMonthDate + String(i),
      value: String(i),
    });
  }

  return { prevMonthDays, currentMonthDays, nextMonthDays };
};
