import React, { useState, useEffect } from "react";
import classNames from "classnames";

import type { LoadingButtonProps } from "./LoadingButton.types";
import styles from "./LoadingButton.module.scss";

const CloseIcon = () => (
  <svg
    width="8"
    height="8"
    viewBox="0 0 8 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.70744 6.29356L5.41412 4.00061L7.7075 1.70724L6.29329 0.293026L3.9998 2.58651L1.70588 0.292969L0.291779 1.7073L2.58558 4.00073L0.293285 6.29303L1.7075 7.70724L3.99991 5.41483L6.29334 7.70788L7.70744 6.29356Z"
      fill="white"
    />
  </svg>
);

const LoadingButton: React.FC<LoadingButtonProps> = ({
  percent = 0,
  onClick,
  inConversion = false,
  loaderColor,
  backgroundColor,
  isDefaultMode,
}) => {
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

  return (
    <div
      style={{ "--circle-fill-color": loaderColor } as React.CSSProperties}
      className={classNames(styles.loadingButtonContainer, {
        [styles.defaultMode]: isDefaultMode,
      })}
      onClick={onClick}
      data-testid="loading-button-container"
    >
      <div
        className={classNames(styles.circle, {
          [styles.isProgressZero]: percent === 0,
          [styles.isAnimation]: isAnimation,
          [styles.inConversion]: inConversion,
        })}
        style={{ "--loading-button-percent": percent } as React.CSSProperties}
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

        <div
          style={
            {
              "--loading-button-custom-bg": backgroundColor,
            } as React.CSSProperties
          }
          className={classNames(styles.loadingButton, "loading-button")}
        >
          {!inConversion ? <CloseIcon /> : null}
        </div>
      </div>
    </div>
  );
};

export { LoadingButton };
export type { LoadingButtonProps };
