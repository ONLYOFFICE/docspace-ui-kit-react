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

import React, { useRef, useState, useEffect } from "react";
import classNames from "classnames";
import type { DateTime } from "luxon";

import CalendarIcon from "../../assets/calendar.react.svg";

import { parseToDateTime, formatDate, now } from "../../utils/date";

import { Calendar } from "../calendar";
import { AddButton } from "../add-button";
import { SelectedItem } from "../selected-item";

import type { DatePickerProps } from "./DatePicker.types";
import styles from "./DatePicker.module.scss";

export type { DatePickerProps };

const DatePicker = (props: DatePickerProps) => {
  const {
    initialDate,
    onChange,
    selectDateText = "Select date",
    className,
    id,
    minDate,
    maxDate,
    locale,
    showCalendarIcon = true,
    outerDate,
    openDate,
    isMobile,
    hideCross,
    autoPosition,
    testId,
    useMaxTime,
  } = props;

  const calendarRef = useRef<HTMLDivElement | null>(null);
  const selectorRef = useRef<HTMLDivElement | null>(null);
  const selectedItemRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [shouldAlignRight, setShouldAlignRight] = useState(false);

  const [date, setDate] = useState<DateTime | null>(
    initialDate ? parseToDateTime(initialDate) : null,
  );

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const toggleCalendar = () => {
    setIsCalendarOpen((prevIsCalendarOpen) => {
      if (!prevIsCalendarOpen && autoPosition) {
        const container = containerRef.current;
        if (container) {
          const rect = container.getBoundingClientRect();
          const viewportWidth = window.innerWidth;
          const spaceToRight = viewportWidth - rect.left;

          setShouldAlignRight(spaceToRight < 340);
        }
      }
      return !prevIsCalendarOpen;
    });
  };

  const closeCalendar = () => {
    setIsCalendarOpen(false);
  };

  const handleChange = (d: null | DateTime) => {
    onChange?.(d);
    setDate(d);
    closeCalendar();
  };

  const deleteSelectedDate = (
    propKey: string | number,
    label: string | React.ReactNode,
    group: string | undefined,
    e: React.MouseEvent | undefined,
  ) => {
    if (e) e.stopPropagation();
    handleChange(null);
    setIsCalendarOpen(false);
  };

  const handleClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;

    if (
      target.classList.contains("nav-thumb-vertical") ||
      target.classList.contains("nav-thumb-horizontal")
    ) {
      return;
    }

    if (
      !selectorRef?.current?.contains(target) &&
      !calendarRef?.current?.contains(target) &&
      !selectedItemRef?.current?.contains(target)
    )
      setIsCalendarOpen(false);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClick, { capture: true });
    return () =>
      document.removeEventListener("mousedown", handleClick, { capture: true });
  }, []);

  useEffect(() => {
    if (!outerDate) {
      setDate(null);
    }

    if (outerDate) {
      const outerDateFormatted = formatDate(outerDate, "yyyy-MM-d HH:mm");
      const dateFormatted = date ? formatDate(date, "yyyy-MM-d HH:mm") : "";
      if (outerDateFormatted !== dateFormatted) {
        setDate(outerDate);
      }
    }
  }, [date, outerDate]);

  return (
    <div
      className={classNames(styles.wrapper, className)}
      id={id}
      data-testid={testId ?? "date-picker"}
      role="presentation"
      ref={containerRef}
    >
      {!date ? (
        <div
          className={styles.dateSelector}
          onClick={toggleCalendar}
          ref={selectorRef}
          data-testid="date-selector"
          role="button"
          aria-label={selectDateText}
          aria-expanded={isCalendarOpen}
          tabIndex={0}
        >
          <AddButton
            title={selectDateText}
            className="add-delivery-date-button"
            iconNode={<CalendarIcon />}
            label={selectDateText}
            noSelect
          />
        </div>
      ) : null}

      {date ? (
        <SelectedItem
          className={styles.selectedItem}
          propKey=""
          onClose={deleteSelectedDate}
          hideCross={hideCross}
          label={
            showCalendarIcon ? (
              <span
                className={styles.selectedLabel}
                data-testid="selected-label"
              >
                <CalendarIcon
                  className={styles.calendarIcon}
                  data-testid="calendar-icon"
                />
                {formatDate(date, "dd MMM yyyy")}
              </span>
            ) : (
              formatDate(date, "dd MMM yyyy")
            )
          }
          onClick={toggleCalendar}
          forwardedRef={selectedItemRef}
        />
      ) : null}

      {isCalendarOpen ? (
        <Calendar
          className={classNames(styles.calendar, {
            [styles.rightAligned]: shouldAlignRight,
          })}
          isMobile={isMobile}
          selectedDate={date ?? now()}
          setSelectedDate={handleChange}
          onChange={closeCalendar}
          forwardedRef={calendarRef}
          minDate={minDate}
          maxDate={maxDate}
          locale={locale}
          initialDate={openDate}
          useMaxTime={!date ? useMaxTime : false}
        />
      ) : null}
    </div>
  );
};

export { DatePicker };
