import classNames from "classnames";

import styles from "./Card.module.scss";
import type { CardProps } from "./Card.types";

export const Card = ({
  title,
  extra,
  children,
  className,
  style,
  dataTestId,
  footer,
}: CardProps) => {
  const hasHeader = title != null || extra != null;

  return (
    <div
      className={classNames(styles.container, className)}
      style={style}
      data-testid={dataTestId ?? "card"}
    >
      {hasHeader ? (
        <header className={styles.header}>
          {title ? <div className={styles.title}>{title}</div> : null}
          {extra ? <div className={styles.extra}>{extra}</div> : null}
        </header>
      ) : null}
      {children ? <div className={styles.body}>{children}</div> : null}
      {footer ? <footer>{footer}</footer> : null}
    </div>
  );
};
