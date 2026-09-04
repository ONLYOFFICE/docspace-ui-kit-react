import React from "react";
import classNames from "classnames";
import { HeaderButtons } from "../header-buttons/HeaderButtons";
import { YearsHeaderProps } from "../../Calendar.types";
import styles from "../../Calendar.module.scss";
import {
  subtractFromDate,
  addToDate,
  endOf,
  createDateTime,
} from "../../../../utils/date";

export const YearsHeader = ({
  observedDate,
  setObservedDate,
  minDate,
  maxDate,
  isMobile,
}: YearsHeaderProps) => {
  const selectedYear = observedDate.year;
  const firstYear = selectedYear;

  const onLeftClick = () =>
    setObservedDate((prevObservedDate) =>
      subtractFromDate(prevObservedDate, 10, "years")!,
    );

  const onRightClick = () =>
    setObservedDate((prevObservedDate) =>
      addToDate(prevObservedDate, 10, "years")!,
    );

  const prevYearEnd = endOf(
    endOf(createDateTime(firstYear - 1, 12, 1), "year")!,
    "month",
  )!;
  const isLeftDisabled = prevYearEnd < minDate;
  const nextYearStart = createDateTime(firstYear + 10, 1, 1);
  const isRightDisabled = nextYearStart > maxDate;

  return (
    <div className={styles.headerContainer}>
      <h2
        className={classNames(styles.title, "years-header", {
          [styles.disabled]: true,
        })}
      >
        {firstYear}-{firstYear + 9}
        <span className={styles.headerActionIcon} />
      </h2>
      <HeaderButtons
        onLeftClick={onLeftClick}
        onRightClick={onRightClick}
        isLeftDisabled={isLeftDisabled}
        isRightDisabled={isRightDisabled}
        isMobile={isMobile}
      />
    </div>
  );
};
