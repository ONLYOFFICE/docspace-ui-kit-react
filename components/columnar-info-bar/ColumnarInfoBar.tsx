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
        {headerText ? <h3 className={styles.header}>{headerText}</h3> : null}
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
          aria-label={closeLabel}
        >
          <CrossReactSvg />
        </button>
      ) : null}
    </div>
  );
};

export { ColumnarInfoBar };
