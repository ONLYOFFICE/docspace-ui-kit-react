import React from "react";
import classNames from "classnames";
import { motion, useAnimation } from "framer-motion";

import { Text } from "../text";

import type { ToggleButtonProps, ToggleIconProps } from "./ToggleButton.types";
import styles from "./ToggleButton.module.scss";

enum ToggleControls {
  loading = "isLoading",
  checked = "checked",
  unchecked = "notChecked",
}

const ToggleIcon = ({
  isChecked,
  isLoading,
  noAnimation = false,
}: ToggleIconProps) => {
  const controls = useAnimation();

  const transition = noAnimation ? { duration: 0 } : {};

  React.useEffect(() => {
    if (isLoading) {
      controls.start(ToggleControls.loading);
    } else if (isChecked) {
      controls.start(ToggleControls.checked);
    } else {
      controls.start(ToggleControls.unchecked);
    }
  }, [isLoading, isChecked, controls]);

  return (
    <motion.svg
      data-testid="toggle-button-icon"
      width="28"
      height="16"
      viewBox="0 0 28 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <motion.rect width="28" height="16" rx="8" />
      <motion.circle
        cy="8"
        variants={{
          notChecked: { cx: 8, r: 6 },
          checked: { cx: 20, r: 6 },
          isLoading: { r: [5, 6, 6] },
        }}
        initial={isChecked ? ToggleControls.checked : ToggleControls.unchecked}
        transition={{
          r: {
            ...transition,
            repeat: Infinity,
            repeatType: "reverse",
            duration: 0.6,
            ease: "easeOut",
          },
          cx: transition,
        }}
        animate={controls}
      />
    </motion.svg>
  );
};

const ToggleButton = ({
  label,
  isChecked,
  isDisabled,
  onChange,
  id,
  className,
  style,
  isLoading,
  noAnimation,
  name,
  fontWeight,
  fontSize,
  dataTestId,
  dataTooltipId,
}: ToggleButtonProps) => {
  return (
    <div
      id={id}
      className={classNames(styles.container, className)}
      style={style}
      data-testid={dataTestId ?? "toggle-button"}
      data-tooltip-id={dataTooltipId}
      aria-checked={isChecked}
    >
      <label
        id={id}
        className={classNames(styles.label, className, {
          [styles.disabled]: isDisabled,
          [styles.checked]: isChecked,
        })}
        style={style}
        data-testid="toggle-button-container"
      >
        <input
          className={styles.hiddenInput}
          name={name}
          type="checkbox"
          checked={isChecked}
          disabled={isDisabled}
          onChange={onChange}
          data-testid="toggle-button-input"
        />
        <ToggleIcon
          isChecked={isChecked}
          isLoading={isLoading}
          noAnimation={noAnimation || false}
        />
        {label ? (
          <Text
            className={styles.toggleButtonText}
            as="span"
            fontWeight={fontWeight}
            fontSize={fontSize}
            data-testid="toggle-button-label"
          >
            {label}
          </Text>
        ) : null}
      </label>
    </div>
  );
};

export { ToggleButton };
