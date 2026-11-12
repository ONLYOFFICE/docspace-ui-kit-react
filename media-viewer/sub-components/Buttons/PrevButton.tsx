import classNames from "classnames";

import MediaPrevIcon from "../../../assets/viewer.prew.react.svg";
import styles from "./Buttons.module.scss";

type PrevButtonProps = {
  prevClick?: VoidFunction;
};

export const PrevButton = ({ prevClick }: PrevButtonProps) => {
  return (
    <div
      className={classNames(styles.switchToolbar, styles.left)}
      onClick={prevClick}
      aria-label="Previous"
      data-testid="prev-button"
    >
      <div className={classNames(styles.buttonScroll, styles.left)}>
        <MediaPrevIcon aria-hidden="true" />
      </div>
    </div>
  );
};
