import React from "react";
import classNames from "classnames";

import RadioButtonReactSvg from "../../assets/radiobutton.react.svg";
import RadioButtonCheckedReactSvg from "../../assets/radiobutton.checked.react.svg";

import { IconSizeType } from "../../utils";

import { Text } from "../text";

import styles from "./RadioButton.module.scss";
import { RadioButtonProps } from "./RadioButton.types";

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
}: RadioButtonProps) => {
  const [isCheckedState, setIsCheckedState] = React.useState(isChecked);
  const labelRef = React.useRef<HTMLLabelElement>(null);

  React.useEffect(() => {
    setIsCheckedState(isChecked);
  }, [isChecked]);

  const onChangeAction = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsCheckedState((s) => !s);
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
