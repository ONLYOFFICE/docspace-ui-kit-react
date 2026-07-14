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

import React from "react";
import classNames from "classnames";
import type { DateTime } from "luxon";

import { getCalendarDays } from "../get-calendar-days";
import styles from "../../Calendar.module.scss";
import { parseWithFormat, formatDate, now } from "../../../../utils/date";

const parseDay = (key: string): DateTime | null => {
  return parseWithFormat(key, "yyyy-MM-d");
};

export const getDayElements = (
  observedDate: DateTime,
  selectedDate: DateTime,
  handleDateChange: (date: DateTime) => void,
  minDate: DateTime,
  maxDate: DateTime,
) => {
  const calendarDays = getCalendarDays(observedDate);

  const isDisabled = (dayKey: string) => {
    const dt = parseDay(dayKey);
    return !dt || dt < minDate || dt > maxDate;
  };

  const monthDays = {
    prevMonthDays: calendarDays.prevMonthDays.map((day) => (
      <button
        type="button"
        className={classNames(styles.dateItem, "day", {
          [styles.isSecondary]: true,
          [styles.disabled]: isDisabled(day.key),
        })}
        key={day.key}
        onClick={() => {
          const dt = parseDay(day.key);
          if (dt) handleDateChange(dt);
        }}
        disabled={isDisabled(day.key)}
      >
        {day.value}
      </button>
    )),
    currentMonthDays: calendarDays.currentMonthDays.map((day) => (
      <button
        type="button"
        className={classNames(styles.dateItem, "day", {
          [styles.disabled]: isDisabled(day.key),
        })}
        key={day.key}
        onClick={() => {
          const dt = parseDay(day.key);
          if (dt) handleDateChange(dt);
        }}
        disabled={isDisabled(day.key)}
      >
        {day.value}
      </button>
    )),
    nextMonthDays: calendarDays.nextMonthDays.map((day) => (
      <button
        type="button"
        className={classNames(styles.dateItem, "day", {
          [styles.isSecondary]: true,
          [styles.disabled]: isDisabled(day.key),
        })}
        key={day.key}
        onClick={() => {
          const dt = parseDay(day.key);
          if (dt) handleDateChange(dt);
        }}
        disabled={isDisabled(day.key)}
      >
        {day.value}
      </button>
    )),
  };

  const currentNow = now();
  const currentDate = `${formatDate(currentNow, "yyyy-MM-")}${currentNow.day}`;
  const selectedDateFormatted = `${formatDate(selectedDate, "yyyy-MM-")}${selectedDate.day}`;

  Object.keys(calendarDays).forEach((key) => {
    if (
      key === "prevMonthDays" ||
      key === "currentMonthDays" ||
      key === "nextMonthDays"
    ) {
      calendarDays[key].forEach((day, index) => {
        if (day.key === currentDate) {
          monthDays[key][index] = (
            <button
              type="button"
              className={classNames(styles.dateItem, "day", {
                [styles.isCurrent]: true,
                [styles.disabled]: isDisabled(day.key),
              })}
              key={day.key}
              onClick={() => {
                const dt = parseDay(day.key);
                if (dt) handleDateChange(dt);
              }}
              disabled={isDisabled(day.key)}
            >
              {day.value}
            </button>
          );
        } else if (day.key === selectedDateFormatted) {
          monthDays[key][index] = (
            <button
              type="button"
              className={classNames(styles.dateItem, "day", {
                [styles.focused]: true,
                [styles.disabled]: isDisabled(day.key),
              })}
              key={day.key}
              onClick={() => {
                const dt = parseDay(day.key);
                if (dt) handleDateChange(dt);
              }}
              disabled={isDisabled(day.key)}
            >
              {day.value}
            </button>
          );
        }
      });
    }
  });

  return [
    ...monthDays.prevMonthDays,
    ...monthDays.currentMonthDays,
    ...monthDays.nextMonthDays,
  ];
};
