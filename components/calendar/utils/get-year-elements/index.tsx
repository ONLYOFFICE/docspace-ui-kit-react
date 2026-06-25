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

import styles from "../../Calendar.module.scss";
import { now, endOf, createDateTime } from "../../../../utils/date";

export const getYearElements = (
  years: string[],
  setObservedDate: React.Dispatch<React.SetStateAction<DateTime>>,
  setSelectedScene: React.Dispatch<React.SetStateAction<number>>,
  selectedDate: DateTime,
  minDate: DateTime,
  maxDate: DateTime,
) => {
  const onDateClick = (year: string) => {
    const yearNum = parseInt(year, 10);
    setObservedDate((prevObservedDate) =>
      createDateTime(yearNum, prevObservedDate.month, 1),
    );
    setSelectedScene((prevSelectedScene) => prevSelectedScene - 1);
  };

  const isDisabled = (year: string) => {
    const yearNum = parseInt(year, 10);
    const yearStart = createDateTime(yearNum, 1, 1);
    const yearEnd = endOf(createDateTime(yearNum, 12, 1), "month")!;
    return yearEnd < minDate || yearStart > maxDate;
  };

  const yearElements = years.map((year) => (
    <button
      type="button"
      className={classNames(styles.dateItem, "year", {
        [styles.disabled]: isDisabled(year),
        [styles.big]: true,
        [styles.isSecondary]: true,
      })}
      key={year}
      onClick={() => onDateClick(year)}
      disabled={isDisabled(year)}
    >
      {year}
    </button>
  ));

  for (let i = 1; i < 11; i += 1) {
    yearElements[i] = (
      <button
        type="button"
        className={classNames(styles.dateItem, "year", {
          [styles.disabled]: isDisabled(years[i]),
          [styles.big]: true,
        })}
        key={years[i]}
        onClick={() => onDateClick(years[i])}
        disabled={isDisabled(years[i])}
      >
        {years[i]}
      </button>
    );
  }

  const currentYear = String(now().year);
  const selectedYear = String(selectedDate.year);
  const currentYearIndex = years.indexOf(currentYear);
  const selectedYearIndex = years.indexOf(selectedYear);

  if (selectedYearIndex !== -1) {
    yearElements[selectedYearIndex] = (
      <button
        type="button"
        className={classNames(styles.dateItem, "year", {
          [styles.disabled]: isDisabled(years[selectedYearIndex]),
          [styles.big]: true,
          [styles.focused]: true,
        })}
        key={years[selectedYearIndex]}
        onClick={() => onDateClick(years[selectedYearIndex])}
        disabled={isDisabled(years[selectedYearIndex])}
      >
        {years[selectedYearIndex]}
      </button>
    );
  }
  if (currentYearIndex !== -1) {
    yearElements[currentYearIndex] = (
      <button
        type="button"
        className={classNames(styles.dateItem, "year", {
          [styles.disabled]: isDisabled(years[currentYearIndex]),
          [styles.big]: true,
          [styles.isCurrent]: true,
        })}
        key={years[currentYearIndex]}
        onClick={() => onDateClick(years[currentYearIndex])}
        disabled={isDisabled(years[currentYearIndex])}
      >
        {years[currentYearIndex]}
      </button>
    );
  }

  return yearElements;
};
