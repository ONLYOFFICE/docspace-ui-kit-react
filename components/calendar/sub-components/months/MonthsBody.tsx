import React from "react";
import classNames from "classnames";
import { getCalendarMonths, getMonthElements } from "../../utils";
import { MonthsBodyProps } from "../../Calendar.types";
import styles from "../../Calendar.module.scss";

export const MonthsBody = ({
  observedDate,
  setObservedDate,
  setSelectedScene,
  selectedDate,
  minDate,
  maxDate,
  isScroll,
  locale,
}: MonthsBodyProps) => {
  const months = getCalendarMonths(observedDate, locale);
  const monthsElements = getMonthElements(
    months,
    setObservedDate,
    setSelectedScene,
    selectedDate,
    minDate,
    maxDate,
  );

  return (
    <div
      className={classNames(styles.calendarContainer, {
        [styles.big]: true,
        [styles.isScroll]: isScroll,
      })}
    >
      {monthsElements}
    </div>
  );
};
