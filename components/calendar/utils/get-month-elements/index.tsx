import React from "react";
import classNames from "classnames";
import type { DateTime } from "luxon";

import styles from "../../Calendar.module.scss";
import {
  parseWithFormat,
  now,
  endOf,
  startOf,
  createDateTime,
} from "../../../../utils/date";

const parseMonth = (key: string): DateTime | null => {
  return parseWithFormat(key, "yyyy-M");
};

export const getMonthElements = (
  months: {
    key: string;
    value: string;
  }[],
  setObservedDate: React.Dispatch<React.SetStateAction<DateTime>>,
  setSelectedScene: React.Dispatch<React.SetStateAction<number>>,
  selectedDate: DateTime,
  minDate: DateTime,
  maxDate: DateTime,
) => {
  const onDateClick = (dateString: string) => {
    const parsed = parseMonth(dateString);
    if (parsed) {
      setObservedDate(() => createDateTime(parsed.year, parsed.month, 1));
    }
    setSelectedScene((prevSelectedScene) => prevSelectedScene - 1);
  };

  const isDisabled = (monthKey: string) => {
    const dt = parseMonth(monthKey);
    if (!dt) return true;
    return endOf(dt, "month")! < minDate || startOf(dt, "month")! > maxDate;
  };

  const monthsElements = months.map((month) => (
    <button
      type="button"
      className={classNames(styles.dateItem, "month", {
        [styles.disabled]: isDisabled(month.key),
        [styles.big]: true,
      })}
      key={month.key}
      onClick={() => onDateClick(month.key)}
      disabled={isDisabled(month.key)}
    >
      {month.value}
    </button>
  ));

  for (let i = 12; i < 16; i += 1) {
    monthsElements[i] = (
      <button
        type="button"
        className={classNames(styles.dateItem, "month", {
          [styles.disabled]: isDisabled(months[i].key),
          [styles.big]: true,
          [styles.isSecondary]: true,
        })}
        key={months[i].key}
        onClick={() => onDateClick(months[i].key)}
        disabled={isDisabled(months[i].key)}
      >
        {months[i].value}
      </button>
    );
  }

  const currentNow = now();
  const currentDate = `${currentNow.year}-${currentNow.month}`;
  const formattedDate = `${selectedDate.year}-${selectedDate.month}`;

  months.forEach((month, index) => {
    if (month.key === currentDate) {
      monthsElements[index] = (
        <button
          type="button"
          className={classNames(styles.dateItem, "month", {
            [styles.disabled]: isDisabled(month.key),
            [styles.big]: true,
            [styles.isCurrent]: true,
          })}
          key={month.key}
          onClick={() => onDateClick(month.key)}
          disabled={isDisabled(month.key)}
        >
          {month.value}
        </button>
      );
    } else if (month.key === formattedDate) {
      monthsElements[index] = (
        <button
          type="button"
          className={classNames(styles.dateItem, "month", {
            [styles.disabled]: isDisabled(month.key),
            [styles.big]: true,
            [styles.focused]: true,
          })}
          key={month.key}
          onClick={() => onDateClick(month.key)}
          disabled={isDisabled(month.key)}
        >
          {month.value}
        </button>
      );
    }
  });
  return monthsElements;
};
