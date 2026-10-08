import classNames from "classnames";

import { Text } from "../text";

import { PreparationPortalProgressProps } from "./ProgressBar.types";
import { clampPercent } from "./ProgressBar.utils";
import styles from "./ProgressBar.module.scss";

export const PreparationPortalProgress = ({
  text,
  percent,
  className,
  ...rest
}: PreparationPortalProgressProps) => {
  const progressPercent = clampPercent(percent);

  return (
    <div
      data-testid="preparation-portal-progress"
      className={className}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progressPercent}
      aria-label={text || undefined}
      {...rest}
    >
      <div className={styles.preparationPortalProgress}>
        <div className={styles.preparationPortalProgressBar}>
          <div
            className={styles.preparationPortalProgressLine}
            data-testid="preparation-portal-progress-line"
            style={
              {
                "--preparation-portal-progress-percent": `${progressPercent}%`,
              } as React.CSSProperties
            }
          />
        </div>
        <Text
          className={classNames(styles.preparationPortalPercent, {
            [styles.moreThan50Percent]: progressPercent > 50,
          })}
        >{`${progressPercent} %`}</Text>
      </div>
      <Text className={styles.preparationPortalText}>{text}</Text>
    </div>
  );
};
