import React, { useState, useEffect } from "react";
import classNames from "classnames";

import { useCommonTranslation } from "../../utils/i18n";

import type { LoadingButtonProps } from "./LoadingButton.types";
import styles from "./LoadingButton.module.scss";

const CloseIcon = () => (
  <svg
    width="8"
    height="8"
    viewBox="0 0 8 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.70744 6.29356L5.41412 4.00061L7.7075 1.70724L6.29329 0.293026L3.9998 2.58651L1.70588 0.292969L0.291779 1.7073L2.58558 4.00073L0.293285 6.29303L1.7075 7.70724L3.99991 5.41483L6.29334 7.70788L7.70744 6.29356Z"
      fill="white"
    />
  </svg>
);

const clampPercent = (value: number) =>
  Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0;

const LoadingButton: React.FC<LoadingButtonProps> = ({
  id,
  className,
  style,
  percent = 0,
  onClick,
  inConversion = false,
  loaderColor,
  backgroundColor,
  isDefaultMode,
  cancelLabel,
  progressLabel = "Progress",
}) => {
  const t = useCommonTranslation();
  const [isAnimation, setIsAnimation] = useState<boolean>(true);

  const stopAnimation = (): void => {
    setIsAnimation(false);
  };

  useEffect(() => {
    const timer = setTimeout(stopAnimation, 5000);

    return function cleanup() {
      clearTimeout(timer);
    };
  }, [isAnimation]);

  const value = clampPercent(percent);
  const cancelName = cancelLabel ?? (t("Common:CancelButton") || "Cancel");

  // The disc in the middle is the cancel control for the keyboard: a click on
  // it bubbles to the container's onClick like any other click in the square.
  const onCancelKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    onClick?.();
  };

  return (
    <div
      id={id}
      style={
        {
          ...style,
          "--circle-fill-color": loaderColor,
        } as React.CSSProperties
      }
      className={classNames(styles.loadingButtonContainer, className, {
        [styles.defaultMode]: isDefaultMode,
      })}
      onClick={onClick}
      data-testid="loading-button-container"
    >
      <div
        className={classNames(styles.circle, {
          [styles.isProgressZero]: value === 0,
          [styles.isAnimation]: isAnimation,
          [styles.inConversion]: inConversion,
        })}
        style={{ "--loading-button-percent": value } as React.CSSProperties}
        role="progressbar"
        aria-label={progressLabel}
        aria-valuemin={0}
        aria-valuemax={100}
        // At 0 the ring spins: the progress is not known yet.
        aria-valuenow={value === 0 ? undefined : value}
        data-testid="loading-button-progress"
      >
        <div
          className={classNames(
            styles.circleMask,
            styles.circleFull,
            "circle__mask circle__full",
          )}
        >
          <div className={classNames(styles.circleFill, "circle__fill")} />
        </div>
        <div className={classNames(styles.circleMask, "circle__mask")}>
          <div className={classNames(styles.circleFill, "circle__fill")} />
        </div>
      </div>

      <div
        style={
          {
            "--loading-button-custom-bg": backgroundColor,
          } as React.CSSProperties
        }
        className={classNames(styles.loadingButton, "loading-button")}
        {...(onClick
          ? {
              role: "button",
              tabIndex: 0,
              "aria-label": cancelName,
              onKeyDown: onCancelKeyDown,
            }
          : {})}
        data-testid="loading-button-cancel"
      >
        {!inConversion ? <CloseIcon /> : null}
      </div>
    </div>
  );
};

export { LoadingButton };
export type { LoadingButtonProps };
