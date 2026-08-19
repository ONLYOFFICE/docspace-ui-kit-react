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

import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { Scrollbar } from "../scrollbar";
import { Days, Months, Years } from "./sub-components";

import type { DateTime } from "luxon";
import {
  now,
  parseToDateTime,
  startOf,
  endOf,
  dateDiffAbs,
  formatDate,
} from "../../utils/date";

import { getValidDates } from "./utils";
import { CalendarProps } from "./Calendar.types";
import styles from "./Calendar.module.scss";

const Calendar = ({
  locale = "en",
  selectedDate,
  setSelectedDate,
  minDate,
  maxDate,
  id,
  className,
  style,
  initialDate,
  onChange,
  isMobile,
  forwardedRef,
  isScroll = false,
  dataTestId,
  useMaxTime,
}: CalendarProps) => {
  const handleDateChange = (date: DateTime) => {
    // Combine the new date with the existing time from selectedDate
    const dateStr = formatDate(date, "yyyy-MM-dd");
    const timeStr = selectedDate ? formatDate(selectedDate, "HH:mm") : "00:00";
    let formattedDate = parseToDateTime(`${dateStr}T${timeStr}`)!;

    if (useMaxTime) {
      formattedDate = endOf(formattedDate, "day")!;
    }

    setSelectedDate?.(formattedDate);
    onChange?.(formattedDate);
  };

  const [observedDate, setObservedDate] = useState<DateTime>(now());
  const [selectedScene, setSelectedScene] = useState(0);
  const [resultMinDate, setResultMinDate] = useState<DateTime>(now());
  const [resultMaxDate, setResultMaxDate] = useState<DateTime>(now());

  useEffect(() => {
    const [min, max] = getValidDates(minDate, maxDate);

    setResultMaxDate(max);
    setResultMinDate(min);
  }, [minDate, maxDate]);

  useEffect(() => {
    let date = initialDate ? parseToDateTime(initialDate) : null;
    const [min, max] = getValidDates(minDate, maxDate);

    if (!date) {
      const today = now();
      date =
        today <= max && today >= min
          ? today
          : dateDiffAbs(today, min, "days") > dateDiffAbs(today, max, "days")
            ? max
            : min;

      date = startOf(date, "day")!;
      date = now();
    } else if (date > max || date < min) {
      date =
        dateDiffAbs(date, min, "days") > dateDiffAbs(date, max, "days")
          ? max
          : min;

      date = startOf(date, "day")!;

      console.warn(
        "Initial date is out of min/max dates boundaries. Initial date will be set as closest boundary value",
      );
    }
    setObservedDate(date);
  }, [initialDate, maxDate, minDate]);

  const CalendarBodyNode =
    selectedScene === 0 ? (
      <Days
        observedDate={observedDate}
        setObservedDate={setObservedDate}
        setSelectedScene={setSelectedScene}
        selectedDate={selectedDate}
        handleDateChange={handleDateChange}
        minDate={resultMinDate}
        maxDate={resultMaxDate}
        isMobile={isMobile || false}
        isScroll={isScroll}
        locale={locale}
      />
    ) : selectedScene === 1 ? (
      <Months
        observedDate={observedDate}
        setObservedDate={setObservedDate}
        setSelectedScene={setSelectedScene}
        selectedDate={selectedDate}
        minDate={resultMinDate}
        maxDate={resultMaxDate}
        isMobile={isMobile || false}
        isScroll={isScroll}
        locale={locale}
      />
    ) : (
      <Years
        observedDate={observedDate}
        setObservedDate={setObservedDate}
        setSelectedScene={setSelectedScene}
        selectedDate={selectedDate}
        minDate={resultMinDate}
        maxDate={resultMaxDate}
        isMobile={isMobile || false}
        isScroll={isScroll}
      />
    );

  const CalendarNode = isScroll ? (
    <Scrollbar>{CalendarBodyNode}</Scrollbar>
  ) : (
    CalendarBodyNode
  );

  return (
    <div
      id={id}
      className={classNames(styles.container, className, {
        [styles.isScroll]: isScroll,
      })}
      style={style}
      ref={forwardedRef}
      data-testid={dataTestId ?? "calendar"}
    >
      {CalendarNode}
    </div>
  );
};

export { Calendar };
