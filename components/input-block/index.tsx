import React, { useCallback, useState } from "react";
import classNames from "classnames";

import { TextInput } from "../text-input";
import { IconButton } from "../icon-button";

import { InputBlockProps } from "./InputBlock.types";
import styles from "./InputBlock.module.scss";

const InputBlock = React.memo(
  ({
    id,
    name,
    type,
    value = "",
    placeholder,
    tabIndex = -1,
    maxLength = 255,
    autoComplete = "off",
    mask,
    keepCharPositions = false,

    hasError = false,
    hasWarning = false,
    isDisabled = false,
    isReadOnly,
    isAutoFocussed,
    scale = false,

    iconName = "",
    iconNode,
    iconSize,
    iconColor,
    hoverColor,
    iconButtonClassName = "",
    isIconFill = false,
    noIcon = false,

    onChange,
    onIconClick,
    onBlur,
    onFocus,
    onKeyDown,
    onClick,

    size,
    className,
    style,

    children,
    forwardedRef,
    testId,
    dataTestId,
    ...rest
  }: InputBlockProps) => {
    const [isFocus, setIsFocus] = useState(isAutoFocussed);

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => onChange?.(e),
      [onChange],
    );

    const handleIconClick = useCallback(
      (e: React.MouseEvent) => onIconClick?.(e),
      [onIconClick],
    );

    const handleFocus = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocus(true);
        onFocus?.(e);
      },
      [onFocus],
    );

    const handleBlur = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocus(false);
        onBlur?.(e);
      },
      [onBlur],
    );

    const inputProps = {
      ...rest,
      id,
      type,
      name,
      value,
      placeholder,
      maxLength,
      autoComplete,
      mask,
      keepCharPositions,
      isDisabled,
      hasError,
      hasWarning,
      isReadOnly,
      isAutoFocussed,
      scale,
      size,
      withBorder: false,
      forwardedRef,
      onClick,
      onBlur: handleBlur,
      onFocus: handleFocus,
      onKeyDown,
      tabIndex,
      onChange: handleChange,
      testId,
    };

    const inputGroupClassName = classNames(styles.inputGroup, className, {
      [styles.error]: hasError,
      [styles.warning]: hasWarning,
      [styles.disabled]: isDisabled,
    });

    return (
      <div
        className={inputGroupClassName}
        style={style}
        data-testid={dataTestId || "input-block"}
        data-size={size}
        data-scale={scale}
        data-error={hasError}
        data-focus={isFocus}
        data-warning={hasWarning}
        data-disabled={isDisabled}
      >
        {children ? (
          <div className={styles.prepend}>
            <div className={styles.childrenBlock}>{children}</div>
          </div>
        ) : null}

        <TextInput {...inputProps} />

        {!noIcon && !isDisabled ? (
          <div className="append">
            <div
              className={`${styles.iconBlock} ${iconButtonClassName} input-block-icon`}
              onClick={handleIconClick}
              data-size={size}
            >
              <IconButton
                size={iconSize || size}
                iconNode={iconNode}
                iconName={iconName}
                className="input-block-icon"
                isFill={isIconFill}
                isClickable={typeof onIconClick === "function"}
                color={iconColor}
                isDisabled={typeof onIconClick !== "function"}
                hoverColor={hoverColor}
              />
            </div>
          </div>
        ) : null}
      </div>
    );
  },
);

InputBlock.displayName = "InputBlock";

export { InputBlock };
export type { InputBlockProps };
