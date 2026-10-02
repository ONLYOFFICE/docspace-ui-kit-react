import React from "react";

import classNames from "classnames";
import { getCalendarYears, getYearElements } from "../../utils";
import { YearsProps } from "../../Calendar.types";
import styles from "../../Calendar.module.scss";

export const YearsBody = ({
  observedDate,
  setObservedDate,
  setSelectedScene,
  selectedDate,
  minDate,
  maxDate,
  isScroll,
}: YearsProps) => {
  const years = getCalendarYears(observedDate);
  const yearElements = getYearElements(
    years,
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
      {yearElements}
    </div>
  );
};
