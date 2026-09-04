import React from "react";
import classNames from "classnames";

import { Label } from "../label";
import { HelpButton } from "../help-button";
import { Text } from "../text";

import { FieldContainerProps } from "./FieldContainer.types";
import styles from "./FieldContainer.module.scss";

const displayInlineBlock = { display: "inline-block" };

const FieldContainer = ({
  isVertical,
  maxLabelWidth = "110px",
  className,
  id,
  style,
  errorMessageWidth = "293px",
  removeMargin = false,
  labelVisible = false,
  inlineHelpButton,
  isRequired,
  labelText,
  tooltipMaxWidth,
  tooltipContent,
  tooltipClass,
  place = "bottom",
  hasError,
  children,
  errorMessage,
  errorColor,
  dataTestId,
}: FieldContainerProps) => {
  const containerStyle = {
    ...style,
    "--label-width": maxLabelWidth,
  } as React.CSSProperties;

  const errorContainerStyle = {
    ...style,
    "--error-width": errorMessageWidth,
    "--error-color": errorColor,
  } as React.CSSProperties;

  return (
    <div
      className={classNames(
        styles.container,
        {
          [styles.vertical]: isVertical,
          [styles.horizontal]: !isVertical,
          [styles.noMargin]: removeMargin,
        },
        className,
      )}
      id={id}
      style={containerStyle}
      data-testid={dataTestId ?? "field-container"}
      data-vertical={isVertical}
      data-label-width={maxLabelWidth}
    >
      {labelVisible ? (
        !inlineHelpButton ? (
          <div className={styles.fieldLabelIcon}>
            <Label
              isRequired={isRequired}
              text={labelText}
              truncate
              className={styles.fieldLabel}
              tooltipMaxWidth={tooltipMaxWidth}
              htmlFor=""
            />
            {tooltipContent ? (
              <HelpButton
                className={classNames(styles.iconButton, tooltipClass)}
                tooltipContent={tooltipContent}
                place={place}
                dataTestId={
                  dataTestId ? `${dataTestId}_help_button` : undefined
                }
              />
            ) : null}
          </div>
        ) : (
          <div className={styles.fieldLabelIcon}>
            <Label
              isRequired={isRequired}
              htmlFor=""
              text={labelText}
              truncate
              className={styles.fieldLabel}
            >
              {tooltipContent ? (
                <HelpButton
                  className={classNames(styles.iconButton, tooltipClass)}
                  tooltipContent={tooltipContent}
                  place={place}
                  style={displayInlineBlock}
                  offsetRight={0}
                  dataTestId={
                    dataTestId ? `${dataTestId}_help_button` : undefined
                  }
                />
              ) : null}
            </Label>
          </div>
        )
      ) : null}

      <div className={`${styles.fieldBody} field-body`}>
        {children}
        {hasError && errorMessage ? (
          <Text
            className={styles.errorContainer}
            style={errorContainerStyle}
            fontSize="12px"
            color={errorColor}
          >
            {errorMessage}
          </Text>
        ) : null}
      </div>
    </div>
  );
};

export { FieldContainer };
