import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import ClearIcon from "../../assets/icons/16/clear.react.svg";
import AlertIcon from "../../assets/button.alert.react.svg";
import TickIcon from "../../assets/icons/12/tick.react.svg";
import StoppedIcon from "../../assets/icons/16/catalog.spam.react.svg";
import RightArrowIcon from "../../assets/icons/12/right-arrow.react.svg";

import { Text } from "../text";
import { IconButton } from "../icon-button";
import { LoadingButton } from "../loading-button";
import { globalColors } from "../../providers/theme";

import styles from "./OperationsProgressButton.module.scss";
import { ProgressBarMobileProps } from "./OperationsProgressButton.types";

const ProgressBar = ({
  label,
  alert,
  stopped,
  percent,
  open,
  onCancel,
  withoutProgress,
  icon,
  completed,
  onClearProgress,
  operationId,
  operation,
  onOpenPanel,
  withoutStatus,
}: ProgressBarMobileProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const clearTimerRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimers = () => {
    if (clearTimerRef.current) {
      clearTimeout(clearTimerRef.current);
      clearTimerRef.current = null;
    }
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const onCloseClick = () => {
    if (onClearProgress && operation) {
      setIsVisible(false);
      closeTimerRef.current = setTimeout(() => {
        onClearProgress(operationId ?? null, operation);
      }, 300);
    }
  };

  const onClearClick = () => {
    if (!onClearProgress || !operation) return;
    setIsVisible(false);
    clearTimerRef.current = setTimeout(() => {
      onClearProgress(operationId ?? null, operation);
    }, 300);
  };

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, []);

  return (
    <div
      className={classNames(styles.progressBarWrapper, {
        [styles.isUploading]: open,
        [styles.fadeOut]: !isVisible,
      })}
    >
      <div className={styles.progressWrapper}>
        <div
          className={classNames(styles.progressMainContainer, {
            [styles.withClick]: onOpenPanel,
          })}
          {...(onOpenPanel && { onClick: onOpenPanel })}
        >
          <div>
            <IconButton
              {...(onOpenPanel && { onClick: onOpenPanel })}
              iconNode={icon}
              size={16}
              color="white"
            />
            {!withoutStatus && (stopped || alert || completed) ? (
              <div
                className={classNames(styles.infoIcon, {
                  [styles.stopped]: stopped,
                  [styles.alert]: !stopped && alert,
                  [styles.complete]: !stopped && !alert && completed,
                })}
              >
                {stopped ? (
                  <StoppedIcon />
                ) : alert ? (
                  <AlertIcon />
                ) : (
                  <TickIcon />
                )}
              </div>
            ) : null}
          </div>
          <div className={styles.labelWrapper}>
            <Text
              className={classNames(
                (styles.progressHeader,
                {
                  [styles.withClick]: onOpenPanel,
                }),
              )}
              fontSize="14px"
              fontWeight={600}
              truncate
              color="white"
            >
              {label}
            </Text>
            {onOpenPanel ? <RightArrowIcon /> : null}
          </div>
        </div>

        <div className={styles.progressInfoWrapper}>
          {withoutProgress ? (
            completed ? (
              <ClearIcon onClick={onCloseClick} />
            ) : (
              <div className={styles.progressLoader} />
            )
          ) : completed ? (
            <ClearIcon onClick={onClearClick} />
          ) : (
            <LoadingButton
              percent={percent}
              onClick={onCancel}
              backgroundColor={globalColors.grayText}
              loaderColor={globalColors.white}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export { ProgressBar };

