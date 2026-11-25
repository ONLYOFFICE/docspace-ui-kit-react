import React from "react";
import classNames from "classnames";

import MediaNextIcon from "../../../assets/viewer.next.react.svg";
import styles from "./Buttons.module.scss";

type NextButtonProps = {
  nextClick?: VoidFunction;
  isPDFFile?: boolean;
};

export const NextButton = ({ nextClick, isPDFFile }: NextButtonProps) => {
  return (
    <div
      className={classNames(styles.switchToolbar, {
        [styles.right]: !isPDFFile,
        [styles.isPDFFile]: isPDFFile,
      })}
      onClick={nextClick}
      aria-label="Next"
      data-testid="next-button"
    >
      <div className={classNames(styles.buttonScroll, styles.right)}>
        <MediaNextIcon aria-hidden="true" />
      </div>
    </div>
  );
};
