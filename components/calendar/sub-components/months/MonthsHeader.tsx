import React from "react";
import classNames from "classnames";
import { HeaderButtons } from "../header-buttons/HeaderButtons";
import { MonthsHeaderProps } from "../../Calendar.types";
import styles from "../../Calendar.module.scss";
import {
  subtractFromDate,
  addToDate,
  endOf,
  startOf,
  formatDate,
} from "../../../../utils/date";

export const MonthsHeader = ({
  observedDate,
  setObservedDate,
  setSelectedScene,
  minDate,
  maxDate,
  isMobile,
}: MonthsHeaderProps) => {
  const onTitleClick = () =>
    setSelectedScene((prevSelectedScene) => prevSelectedScene + 1);

  const onLeftClick = () =>
    setObservedDate((prevObservedDate) =>
      subtractFromDate(prevObservedDate, 1, "years")!,
    );

  const onRightClick = () =>
    setObservedDate((prevObservedDate) =>
      addToDate(prevObservedDate, 1, "years")!,
    );

  const prevYear = subtractFromDate(observedDate, 1, "years")!;
  const isLeftDisabled = endOf(endOf(prevYear, "year")!, "month")! < minDate;

  const nextYear = addToDate(observedDate, 1, "years")!;
  const isRightDisabled =
    startOf(startOf(nextYear, "year")!, "month")! > maxDate;

  return (
    <div className={styles.headerContainer}>
      <h2
        className={classNames(styles.title, "months-header")}
        onClick={onTitleClick}
      >
        {formatDate(observedDate, "yyyy")}
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
