import React from "react";
import classNames from "classnames";

import RadioButtonReactSvg from "../../assets/radiobutton.react.svg";
import RadioButtonCheckedReactSvg from "../../assets/radiobutton.checked.react.svg";

import { IconSizeType } from "../../utils";

import { Text } from "../text";

import styles from "./RadioButton.module.scss";
import { pickAriaProps } from "../../utils/aria-props";
import { RadioButtonProps } from "./RadioButton.types";

// Sent on the document by a button checked without `onChange`.
const SIBLING_CHECKED = "radio-button-checked";

const RadiobuttonIcon = ({ isChecked }: { isChecked?: boolean }) => {
  const newProps = {
    "data-size": IconSizeType.medium,
    className: styles.radioButtonIcon,
  };

  return !isChecked ? (
    <RadioButtonReactSvg {...newProps} />
  ) : (
    <RadioButtonCheckedReactSvg {...newProps} />
  );
};

const RadioButton = ({
  isChecked,
  classNameInput,
  name,
  value,
  onChange,
  onClick,
  orientation = "vertical",
  spacing,
  isDisabled,
  id,
  className,
  style,
  fontSize,
  fontWeight,
  label,
  autoFocus,
  testId = "radio-button",
  ...rest
}: RadioButtonProps) => {
  const [isCheckedState, setIsCheckedState] = React.useState(isChecked);
  const labelRef = React.useRef<HTMLLabelElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setIsCheckedState(isChecked);
  }, [isChecked]);

  // The browser fires no change on the radio a click unchecks, so the button
  // that is checked tells the others of its group to clear their dot. It does
  // so inside React's own handler: React then restores the group from the
  // cleared state, not from a stale one that would uncheck the new choice.
  // With `onChange` the dot follows `isChecked` alone.
  React.useEffect(() => {
    if (onChange || !name) return;

    const clearOnSiblingCheck = (e: Event) => {
      const own = inputRef.current;
      const checked = (e as CustomEvent<HTMLInputElement>).detail;
      if (
        own &&
        checked !== own &&
        checked.name === name &&
        checked.form === own.form
      )
        setIsCheckedState(false);
    };

    document.addEventListener(SIBLING_CHECKED, clearOnSiblingCheck);
    return () =>
      document.removeEventListener(SIBLING_CHECKED, clearOnSiblingCheck);
  }, [name, onChange]);

  const onChangeAction = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsCheckedState((s) => !s);
    if (name)
      document.dispatchEvent(
        new CustomEvent(SIBLING_CHECKED, { detail: e.target }),
      );
    onClick?.(e);
  };

  return (
    <label
      id={id}
      ref={labelRef}
      className={classNames(styles.label, className, {
        [styles.disabled]: isDisabled,
        [styles.orientationVertical]: orientation === "vertical",
        [styles.orientationHorizontal]: orientation === "horizontal",
        [styles.spacing]: spacing,
      })}
      data-spacing={spacing}
      style={{
        ...style,
        ["--radio-button-spacing" as string]: spacing,
      }}
      data-testid={testId}
    >
      <input
        {...pickAriaProps(rest)}
        ref={inputRef}
        className={classNames(styles.input, classNameInput)}
        type="radio"
        name={name}
        value={value}
        checked={isCheckedState}
        onChange={onChange || onChangeAction}
        disabled={isDisabled}
        autoFocus={autoFocus}
      />
      <RadiobuttonIcon isChecked={isCheckedState} />
      <Text
        as="span"
        className={classNames(styles.radioButtonText, "radio-button_text")}
        fontSize={fontSize}
        fontWeight={fontWeight}
      >
        {label || value}
      </Text>
    </label>
  );
};

export { RadioButton };
