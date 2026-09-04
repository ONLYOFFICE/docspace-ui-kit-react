import React from "react";

import { Text } from "../text";

import styles from "./ProgressBar.module.scss";

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
  const progressPercent = percent > 100 ? 100 : percent;

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
        aria-valuenow={progressPercent}
        aria-valuemin={0}
        aria-valuemax={100}
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
      {status || error ? (
        <Text
          className={error ? styles.statusError : styles.statusText}
          fontSize="12px"
          fontWeight="400"
          lineHeight="16px"
          as="p"
          title={error || status}
        >
          {error || status}
        </Text>
      ) : null}
    </div>
  );
};

export { ProgressBar };
