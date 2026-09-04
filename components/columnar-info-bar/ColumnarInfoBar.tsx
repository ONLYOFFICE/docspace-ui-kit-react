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

  if (variant === "page") {
    return (
      <div className={className} style={style}>
        <div className={styles.pageHeader}>
          {headerText ? (
            <div className={styles.header}>{headerText}</div>
          ) : null}
          {onAction ? (
            <button
              type="button"
              className={styles.closeBtn}
              onClick={onAction}
              aria-label="Close"
            >
              <CrossReactSvg />
            </button>
          ) : null}
        </div>
        <div className={styles.columns}>
          {columns.map(({ label, value }, i) => (
            <div key={i} className={styles.column}>
              <div className={styles.label}>{label}</div>
              <div className={styles.value}>{value}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={className} style={style}>
      <div className={styles.content}>
        {headerText ? <div className={styles.header}>{headerText}</div> : null}
        <div className={styles.columns}>
          {columns.map(({ label, value }, i) => (
            <div key={i} className={styles.column}>
              <div className={styles.label}>{label}</div>
              <div className={styles.value}>{value}</div>
            </div>
          ))}
        </div>
      </div>
      {onAction ? (
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onAction}
          aria-label="Close"
        >
          <CrossReactSvg />
        </button>
      ) : null}
    </div>
  );
};

export { ColumnarInfoBar };

