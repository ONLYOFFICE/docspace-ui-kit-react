import type React from "react";
import classNames from "classnames";
import { Loader, LoaderTypes } from "../loader";
import { Tooltip } from "../tooltip";
import type { ButtonProps } from "./Button.types";
import { ButtonSize } from "./Button.enums";
import styles from "./Button.module.scss";

export const Button = (props: React.PropsWithChildren<ButtonProps>) => {
  const {
    ref,
    label,
    primary,
    size = ButtonSize.normal,
    scale,
    icon,
    isDisabled,
    isLoading,
    isHovered,
    isClicked,
    className,
    testId = "button",
    type,
    id,
    minWidth,
    filled,
    filledStroke,
    accent,
    style,
    tooltipText,
    children,
    ...rest
  } = props;

  const buttonClasses = classNames(
    styles.button,
    {
      [styles.primary]: primary,
      [styles.scale]: scale,
      [styles[size]]: size,
      [styles.filled]: filled,
      [styles.filledStroke]: filledStroke,
      [styles.accent]: accent,
      [styles.isLoading]: isLoading,
      [styles.isHovered]: isHovered,
      [styles.isClicked]: isClicked,
      [styles.isDisabled]: isDisabled,
    },
    className,
  );

  const contentClasses = classNames(styles.buttonContent, {
    [styles.loading]: isLoading,
    "button-content": true,
  });

  const buttonStyle = minWidth ? { ...style, minWidth } : style;

  const tooltipId = tooltipText ? (id ?? "button-tooltip") : undefined;

  return (
    <>
      <button
        {...rest}
        id={id}
        ref={ref as React.Ref<HTMLButtonElement>}
        type={type === "submit" ? "submit" : "button"}
        className={buttonClasses}
        disabled={isDisabled || isLoading}
        data-testid={testId}
        data-size={size}
        aria-label={label}
        aria-disabled={isDisabled ? "true" : undefined}
        aria-busy={isLoading ? "true" : undefined}
        style={buttonStyle}
        data-tooltip-id={tooltipId}
        data-tooltip-content={tooltipText}
      >
        {isLoading ? (
          <Loader
            id={id}
            className={classNames(styles.loader, "loader", {
              [styles.primary]: primary,
            })}
            size="20px"
            type={LoaderTypes.track}
            label={label}
            primary={primary}
            isDisabled={isDisabled}
          />
        ) : null}
        <div className={contentClasses}>
          {icon ? (
            <div className={classNames(styles.icon, "icon")}>{icon}</div>
          ) : null}
          {label ? <span>{label}</span> : children}
        </div>
      </button>
      {tooltipText ? (
        <Tooltip id={tooltipId} place="bottom" offset={10} float />
      ) : null}
    </>
  );
};

Button.displayName = "Button";
