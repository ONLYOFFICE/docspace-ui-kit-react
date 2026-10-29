import React from "react";
import type { ChangeEvent } from "react";

import classNames from "classnames";

import CheckboxIndeterminateIcon from "../../assets/checkbox.indeterminate.react.svg";
import CheckboxCheckedIcon from "../../assets/checkbox.checked.react.svg";
import CheckboxIcon from "../../assets/checkbox.react.svg";

import { Text } from "../text";
import { TooltipContainer } from "../tooltip";

import type { CheckboxProps } from "./Checkbox.types";
import styles from "./Checkbox.module.scss";

export * from "./Checkbox.types";

// Purely decorative: the input beside it holds the focus, so swapping one icon
// for another as the state changes loses nothing.
const RenderCheckboxIcon = React.memo(
  ({
    isChecked,
    isIndeterminate,
  }: {
    isChecked: boolean;
    isIndeterminate: boolean;
  }) => {
    const className = classNames(styles.checkbox, "not-selectable");
    return isIndeterminate ? (
      <CheckboxIndeterminateIcon aria-hidden className={className} />
    ) : isChecked ? (
      <CheckboxCheckedIcon aria-hidden className={className} />
    ) : (
      <CheckboxIcon aria-hidden className={className} />
    );
  },
);

const CheckboxPure = ({
  id,
  className,
  style,
  label,
  value,
  title,
  truncate = false,
  hasError = false,
  onChange,
  isChecked = false,
  isIndeterminate = false,
  isDisabled,
  name,
  // Goes on the input, the focusable element; this used to default to -1,
  // which took the whole control out of the tab order.
  tabIndex = 0,
  helpButton,
  dataTestId,
  ...rest
}: CheckboxProps) => {
  const [checked, setChecked] = React.useState(isChecked);
  const ref = React.useRef<HTMLInputElement | null>(null);
  const prevProps = React.useRef({
    indeterminate: false,
    prevChecked: isChecked,
  });

  React.useEffect(() => {
    if (prevProps.current.indeterminate !== isIndeterminate && ref.current) {
      prevProps.current.indeterminate = isIndeterminate || false;
      ref.current.indeterminate = isIndeterminate || false;
    }
    if (prevProps.current.prevChecked !== isChecked) {
      setChecked(isChecked);

      prevProps.current.prevChecked = isChecked;
    }
  }, [isIndeterminate, isChecked]);

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (isDisabled) e.preventDefault();
    e.stopPropagation();

    setChecked(e.target.checked);
    onChange?.(e);
  };

  const onClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    return e.preventDefault();
  };

  return (
    <TooltipContainer
      as="label"
      id={id}
      style={style}
      className={classNames(styles.label, className, {
        [styles.disabled]: isDisabled,
        [styles.indeterminate]: isIndeterminate,
        [styles.error]: hasError,
      })}
      title={title}
      data-testid={dataTestId ?? "checkbox"}
    >
      <input
        className={styles.hiddenInput}
        name={name}
        type="checkbox"
        checked={checked}
        disabled={isDisabled}
        ref={ref}
        value={value}
        onChange={onInputChange}
        tabIndex={tabIndex}
        {...rest}
      />
      <RenderCheckboxIcon
        isChecked={checked || false}
        isIndeterminate={isIndeterminate || false}
      />
      <div
        className={classNames(styles.wrapper, "wrapper", {
          [styles.truncate]: truncate,
        })}
      >
        {label ? (
          <Text
            as="span"
            title={title}
            truncate={truncate}
            className={`${styles.checkboxText} checkbox-text`}
            lineHeight="16px"
          >
            {label}
          </Text>
        ) : null}
        {helpButton ? (
          <span
            className={`${styles.helpButton} help-button`}
            onClick={onClick}
            data-testid="checkbox-help-button"
          >
            {helpButton}
          </span>
        ) : null}
      </div>
    </TooltipContainer>
  );
};

CheckboxPure.displayName = "CheckboxPure";

const Checkbox = React.memo(CheckboxPure);

export { Checkbox };
