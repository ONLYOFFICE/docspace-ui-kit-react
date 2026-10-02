import React from "react";
import classNames from "classnames";
import { getWeekdays } from "../../../../utils/date";
import styles from "../../Calendar.module.scss";

export const getWeekdayElements = (locale?: string) => {
  // Get minimal weekday names starting from Monday (luxon uses Monday=1 by default)
  const weekdays = getWeekdays("narrow", locale).map(
    (weekday) => weekday.charAt(0).toUpperCase() + weekday.substring(1),
  );
  return weekdays.map((day, index) => (
    <span
      className={classNames(styles.weekDay, "weekday")}
      key={`${day}-${index}`}
    >
      {day}
    </span>
  ));
};
