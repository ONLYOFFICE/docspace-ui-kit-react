import React from "react";
import classNames from "classnames";
import { getDayElements, getWeekdayElements } from "../../utils";
import { DaysBodyProps } from "../../Calendar.types";
import styles from "../../Calendar.module.scss";

export const DaysBody = ({
  observedDate,
  handleDateChange,
  selectedDate,
  minDate,
  maxDate,
  isScroll,
  locale,
}: DaysBodyProps) => {
  const daysElements = getDayElements(
    observedDate,
    selectedDate,
    handleDateChange,
    minDate,
    maxDate,
  );
  const weekdayElements = getWeekdayElements(locale);

  return (
    <div
      className={classNames(styles.calendarContainer, {
        [styles.isScroll]: isScroll,
      })}
    >
      {weekdayElements} {daysElements}
    </div>
  );
};
