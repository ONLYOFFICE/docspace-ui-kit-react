import React, { useEffect } from "react";

import CrossReactSvg from "../../assets/icons/12/cross.react.svg";

import type { ColumnarInfoBarProps } from "./ColumnarInfoBar.types";
import styles from "./ColumnarInfoBar.module.scss";

const ColumnarInfoBar = ({
  headerText,
  columns,
  onAction,
  onLoad,
  style,
  variant = "default",
  closeLabel = "Close",
}: ColumnarInfoBarProps) => {
  useEffect(() => {
    onLoad?.();
  }, []);

  const variantClass =
    variant === "neutral"
      ? styles.neutral
      : variant === "page"
        ? styles.page
        : "";
  const className = [styles.bar, variantClass].filter(Boolean).join(" ");

  // A description list, so each label is announced as the term for its value.
  const list = (
    <dl className={styles.columns}>
      {columns.map(({ label, value }, i) => (
        <div key={i} className={styles.column}>
          <dt className={styles.label}>{label}</dt>
          <dd className={styles.value}>{value}</dd>
        </div>
      ))}
    </dl>
  );

  if (variant === "page") {
    return (
      <div className={className} style={style}>
        <div className={styles.pageHeader}>
          {headerText ? <h3 className={styles.header}>{headerText}</h3> : null}
          {onAction ? (
            <button
              type="button"
              className={styles.closeBtn}
              onClick={onAction}
              aria-label={closeLabel}
            >
              <CrossReactSvg />
            </button>
          ) : null}
        </div>
        {list}
      </div>
    );
  }

  // The default and neutral bars appear in response to something, so they
  // are a polite live region; the page block is static content.
  return (
    <div className={className} style={style} role="status">
      <div className={styles.content}>
        {headerText ? <h3 className={styles.header}>{headerText}</h3> : null}
        {list}
      </div>
      {onAction ? (
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onAction}
          aria-label={closeLabel}
        >
          <CrossReactSvg />
        </button>
      ) : null}
    </div>
  );
};

export { ColumnarInfoBar };
