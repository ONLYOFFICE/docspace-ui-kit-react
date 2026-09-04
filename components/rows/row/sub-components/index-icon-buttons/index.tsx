import classNames from "classnames";

import ArrowReactSvg from "../../../../../assets/arrow2.react.svg";

import { IconButton } from "../../../../icon-button";
import { IconSizeType } from "../../../../../utils";

import styles from "./IndexIconButtons.module.scss";
import type { IndexIconButtonsProps } from "./IndexIconButtons.types";

export const IndexIconButtons = ({
  onUpIndexClick,
  onDownIndexClick,
  containerClassName,
  upIconClassName,
  downIconClassName,
  commonIconClassName,
  style,
}: IndexIconButtonsProps) => {
  return (
    <div
      className={classNames(styles.container, containerClassName)}
      style={style}
      data-testid="index-icon-buttons"
    >
      <div className={styles.iconWrapper} onClick={onUpIndexClick}>
        <IconButton
          dataTestId="index-up-icon"
          className={classNames(
            styles.indexUpIcon,
            upIconClassName,
            commonIconClassName,
          )}
          iconNode={<ArrowReactSvg />}
          size={IconSizeType.small}
        />
      </div>
      <div className={styles.iconWrapper} onClick={onDownIndexClick}>
        <IconButton
          dataTestId="index-down-icon"
          className={classNames(
            styles.indexDownIcon,
            downIconClassName,
            commonIconClassName,
          )}
          iconNode={<ArrowReactSvg />}
          size={IconSizeType.small}
        />
      </div>
    </div>
  );
};
