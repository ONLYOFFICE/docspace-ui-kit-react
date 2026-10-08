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
