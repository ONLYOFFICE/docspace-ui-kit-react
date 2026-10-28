import React from "react";
import classNames from "classnames";
import type { DateTime } from "luxon";

import { getCalendarDays } from "../get-calendar-days";
import styles from "../../Calendar.module.scss";
import {
  parseWithFormat,
  formatDate,
  formatDateLocalized,
  now,
} from "../../../../utils/date";

const parseDay = (key: string): DateTime | null => {
  return parseWithFormat(key, "yyyy-MM-d");
};

export const getDayElements = (
  observedDate: DateTime,
  selectedDate: DateTime,
  handleDateChange: (date: DateTime) => void,
  minDate: DateTime,
  maxDate: DateTime,
  locale?: string,
) => {
  const calendarDays = getCalendarDays(observedDate);

  const currentNow = now();
  const currentDate = `${formatDate(currentNow, "yyyy-MM-")}${currentNow.day}`;
  const selectedDateFormatted = selectedDate
    ? `${formatDate(selectedDate, "yyyy-MM-")}${selectedDate.day}`
    : "";

  const renderDay = (
    day: { key: string; value: string },
    isSecondary: boolean,
  ) => {
    const dt = parseDay(day.key);
    const isDisabled = !dt || dt < minDate || dt > maxDate;
    const isCurrent = day.key === currentDate;
    const isSelected = day.key === selectedDateFormatted;

    // The visible text is the bare number; the name carries the month and year, so the
    // neighbouring months' days, which repeat those numbers, are told apart.
    const label = dt
      ? formatDateLocalized(dt, "DATE_FULL", { locale })
      : undefined;

    return (
      <button
        type="button"
        className={classNames(styles.dateItem, "day", {
          [styles.isSecondary]: isSecondary && !isCurrent,
          [styles.isCurrent]: isCurrent,
          [styles.focused]: isSelected,
          [styles.disabled]: isDisabled,
        })}
        key={day.key}
        aria-label={label || undefined}
        aria-pressed={isSelected}
        aria-current={isCurrent ? "date" : undefined}
        onClick={() => {
          if (dt) handleDateChange(dt);
        }}
        disabled={isDisabled}
      >
        {day.value}
      </button>
    );
  };

  return [
    ...calendarDays.prevMonthDays.map((day) => renderDay(day, true)),
    ...calendarDays.currentMonthDays.map((day) => renderDay(day, false)),
    ...calendarDays.nextMonthDays.map((day) => renderDay(day, true)),
  ];
};
