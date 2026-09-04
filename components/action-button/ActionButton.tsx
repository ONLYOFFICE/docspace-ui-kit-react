import type { ElementType } from "react";
import classNames from "classnames";

import styles from "./ActionButton.module.scss";
import type { ActionButtonProps } from "./ActionButton.types";

export function ActionButton<C extends ElementType = "button">({
  as,
  icon,
  className,
  label,
  ref,
  ...rest
}: ActionButtonProps<C>) {
  const Component: ElementType = as ?? "button";

  return (
    <Component
      ref={ref}
      className={classNames(styles.actionButton, className)}
      {...rest}
    >
      {icon ? <span className={styles.icon}>{icon}</span> : null}
      {label}
    </Component>
  );
}
