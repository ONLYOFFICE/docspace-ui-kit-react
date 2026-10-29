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
  titleLevel = 3,
}: CardProps) => {
  const hasHeader = title != null || extra != null;

  // A string title is the card's heading. A node is rendered as given, so a
  // Heading passed in is not nested inside a second one.
  const TitleTag =
    typeof title === "string" ? (`h${titleLevel}` as const) : "div";

  // A <section> scopes the <header> and <footer> to the card: inside it they
  // are not the page's banner and contentinfo landmarks. Unnamed, the section
  // itself is not a landmark either.
  return (
    <section
      className={classNames(styles.container, className)}
      style={style}
      data-testid={dataTestId ?? "card"}
    >
      {hasHeader ? (
        <header className={styles.header}>
          {title ? <TitleTag className={styles.title}>{title}</TitleTag> : null}
          {extra ? <div className={styles.extra}>{extra}</div> : null}
        </header>
      ) : null}
      {children ? <div className={styles.body}>{children}</div> : null}
      {footer ? <footer>{footer}</footer> : null}
    </section>
  );
};
