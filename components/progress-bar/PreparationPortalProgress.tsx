import classNames from "classnames";

import { Text } from "../text";

import { PreparationPortalProgressProps } from "./ProgressBar.types";
import styles from "./ProgressBar.module.scss";

export const PreparationPortalProgress = ({
  text,
  percent,
  className,
  ...rest
}: PreparationPortalProgressProps) => {
  return (
    <div data-testid="preparation-portal-progress" className={className} {...rest}>
      <div className={styles.preparationPortalProgress}>
        <div className={styles.preparationPortalProgressBar}>
          <div
            className={styles.preparationPortalProgressLine}
            style={
              {
                "--preparation-portal-progress-percent": `${percent}%`,
              } as React.CSSProperties
            }
          />
        </div>
        <Text
          className={classNames(styles.preparationPortalPercent, {
            [styles.moreThan50Percent]: percent > 50,
          })}
        >{`${percent} %`}</Text>
      </div>
      <Text className={styles.preparationPortalText}>{text}</Text>
    </div>
  );
};
