import React, { useEffect, useId, useRef } from "react";
import classNames from "classnames";

import { Label } from "../label";
import { HelpButton } from "../help-button";
import { Text } from "../text";

import { FieldContainerProps } from "./FieldContainer.types";
import styles from "./FieldContainer.module.scss";

const displayInlineBlock = { display: "inline-block" };

// The form control the container describes: the element `labelFor` names when
// it sits in the field body, otherwise the body's first input, textarea or
// select.
const findControl = (body: HTMLElement, labelFor?: string) => {
  if (labelFor) {
    const named = body.ownerDocument.getElementById(labelFor);
    if (named && body.contains(named)) return named;
  }
  return body.querySelector<HTMLElement>(
    'input:not([type="hidden"]), textarea, select',
  );
};

const splitIds = (value: string | null) =>
  (value ?? "").split(/\s+/).filter(Boolean);

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
  labelFor,
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
  const bodyRef = useRef<HTMLDivElement>(null);
  const errorId = useId();
  const showError = !!(hasError && errorMessage);

  // `isRequired` and `hasError` describe the field, so they are stated on the
  // control, where ARIA allows them and a screen reader reads them -- not on
  // the <label>. An attribute the control already carries is left alone, and
  // whatever is added here is taken off again when the prop turns off.
  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;
    const control = findControl(body, labelFor);
    if (!control) return;

    const undo: (() => void)[] = [];
    const setIfAbsent = (name: string, value: string) => {
      if (control.hasAttribute(name)) return;
      control.setAttribute(name, value);
      undo.push(() => control.removeAttribute(name));
    };

    if (isRequired) setIfAbsent("aria-required", "true");
    if (hasError) setIfAbsent("aria-invalid", "true");

    if (showError) {
      const ids = splitIds(control.getAttribute("aria-describedby"));
      if (!ids.includes(errorId)) {
        control.setAttribute("aria-describedby", [...ids, errorId].join(" "));
        undo.push(() => {
          const rest = splitIds(
            control.getAttribute("aria-describedby"),
          ).filter((value) => value !== errorId);
          if (rest.length) {
            control.setAttribute("aria-describedby", rest.join(" "));
          } else {
            control.removeAttribute("aria-describedby");
          }
        });
      }
    }

    return () => {
      for (const revert of undo) revert();
    };
  }, [isRequired, hasError, showError, labelFor, errorId]);

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
              htmlFor={labelFor}
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
              htmlFor={labelFor}
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

      <div className={`${styles.fieldBody} field-body`} ref={bodyRef}>
        {children}
        {showError ? (
          <Text
            id={errorId}
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
