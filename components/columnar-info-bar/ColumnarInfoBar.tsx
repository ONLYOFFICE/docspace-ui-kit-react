import React, { useEffect, useRef } from "react";

import CrossReactSvg from "../../assets/icons/12/cross.react.svg";
import { useLiveRegionTextOf } from "../../hooks/useLiveRegionText";

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

  const header = headerText ? (
    <h3 className={styles.header}>{headerText}</h3>
  ) : null;

  // The default and neutral bars appear in response to something, so they
  // are announced -- their content only, so the close button's name is not
  // read out with the message. The content is drawn at once and is not live
  // itself: a region inserted together with its text is usually not
  // announced, so a visually hidden status region beside it stays empty for
  // a moment and then takes the content's text. The page block is static
  // and announces nothing.
  const contentRef = useRef<HTMLDivElement>(null);
  const announcement = useLiveRegionTextOf(contentRef);

  if (variant === "page") {
    return (
      <div className={className} style={style}>
        <div className={styles.pageHeader}>
          {header}
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

  return (
    <div className={className} style={style}>
      <div className={styles.content} ref={contentRef}>
        {header}
        {list}
      </div>
      <span
        role="status"
        className={styles.visuallyHidden}
        data-testid="columnar-info-bar-announcement"
      >
        {announcement}
      </span>
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
