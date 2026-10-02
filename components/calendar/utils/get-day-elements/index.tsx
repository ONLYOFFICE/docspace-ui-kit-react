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
