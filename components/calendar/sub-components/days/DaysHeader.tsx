import React from "react";
import classNames from "classnames";
import { HeaderButtons } from "../header-buttons/HeaderButtons";
import { DaysHeaderProps } from "../../Calendar.types";
import styles from "../../Calendar.module.scss";
import {
  subtractFromDate,
  addToDate,
  endOf,
  startOf,
  formatDate,
} from "../../../../utils/date";

export const DaysHeader = ({
  observedDate,
  setObservedDate,
  setSelectedScene,
  minDate,
  maxDate,
  isMobile,
  locale,
}: DaysHeaderProps) => {
  const onTitleClick = () =>
    setSelectedScene((prevSelectedScene) => prevSelectedScene + 1);

  const onLeftClick = () =>
    setObservedDate(
      (prevObservedDate) => subtractFromDate(prevObservedDate, 1, "months")!,
    );

  const onRightClick = () =>
    setObservedDate(
      (prevObservedDate) => addToDate(prevObservedDate, 1, "months")!,
    );

  const isLeftDisabled =
    endOf(subtractFromDate(observedDate, 1, "months")!, "month")! < minDate;
  const isRightDisabled =
    startOf(addToDate(observedDate, 1, "months")!, "month")! > maxDate;

  const monthName = formatDate(observedDate, "MMMM", { locale });

  return (
    <div className={styles.headerContainer}>
      <h2
        onClick={onTitleClick}
        className={classNames(styles.title, "days-header")}
      >
        {monthName.charAt(0).toUpperCase() + monthName.substring(1)}{" "}
        {formatDate(observedDate, "yyyy", { locale })}
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
