import React from "react";

import { Text } from "../text";

import styles from "./ProgressBar.module.scss";
import { clampPercent } from "./ProgressBar.utils";

import type { ProgressBarProps } from "./ProgressBar.types";

const ProgressBar = ({
  percent,
  label,
  isInfiniteProgress,
  className,
  status,
  error,
  style,
  ...rest
}: ProgressBarProps) => {
  const progressPercent = clampPercent(percent);

  return (
    <div className={styles.container} style={style}>
      <Text
        className={styles.fullText}
        fontSize="12px"
        fontWeight="400"
        lineHeight="16px"
        title={label}
      >
        {label}
      </Text>
      <div
        {...rest}
        className={`${styles.progressBar} ${className || ""}`}
        data-testid="progress-bar"
        role="progressbar"
        // An indeterminate progress bar has no current value: leaving
        // aria-valuenow out is what tells assistive technology so.
        aria-valuenow={isInfiniteProgress ? undefined : progressPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-busy={isInfiniteProgress || undefined}
        aria-label={label}
        data-status={status || undefined}
        data-error={error || undefined}
        data-progress={progressPercent}
      >
        {isInfiniteProgress ? (
          <div
            className={styles.animation}
            data-testid="progress-bar-animation"
          />
        ) : (
          <div
            className={styles.percent}
            data-testid="progress-bar-percent"
            style={{ width: `${progressPercent}%` }}
          />
        )}
      </div>
      {/* Always mounted, so a status that appears or changes later is
          announced: a live region inserted together with its text is not. */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        data-testid="progress-bar-status"
      >
        {status && !error ? (
          <Text
            className={styles.statusText}
            fontSize="12px"
            fontWeight="400"
            lineHeight="16px"
            as="p"
            title={status}
          >
            {status}
          </Text>
        ) : null}
      </div>
      {error ? (
        <Text
          className={styles.statusError}
          fontSize="12px"
          fontWeight="400"
          lineHeight="16px"
          as="p"
          title={error}
          role="alert"
        >
          {error}
        </Text>
      ) : null}
    </div>
  );
};

export { ProgressBar };
