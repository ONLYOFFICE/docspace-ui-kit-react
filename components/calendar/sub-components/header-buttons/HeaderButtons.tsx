import React from "react";
import classNames from "classnames";
import { HeaderButtonsProps } from "../../Calendar.types";
import styles from "../../Calendar.module.scss";

export const HeaderButtons = ({
  onLeftClick,
  onRightClick,
  isLeftDisabled,
  isRightDisabled,
  isMobile,
}: HeaderButtonsProps) => {
  const marginSize = isMobile ? "12px" : "8px";

  return (
    <div className={styles.buttonsContainer}>
      <button
        type="button"
        className={classNames(styles.roundButton, "arrow-previous", {
          [styles.disabled]: isLeftDisabled,
        })}
        style={{ marginInlineEnd: marginSize }}
        onClick={onLeftClick}
        disabled={isLeftDisabled}
        aria-label="Previous"
      >
        <span
          className={classNames(styles.arrowIcon, { [styles.prev]: true })}
        />
      </button>

      <button
        type="button"
        className={classNames(styles.roundButton, "arrow-next", {
          [styles.disabled]: isRightDisabled,
        })}
        onClick={onRightClick}
        disabled={isRightDisabled}
        aria-label="Next"
      >
        <span
          className={classNames(styles.arrowIcon, { [styles.next]: true })}
        />
      </button>
    </div>
  );
};
