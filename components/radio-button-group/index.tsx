import React, { useEffect, useLayoutEffect } from "react";
import classNames from "classnames";

import { RadioButton } from "../radio-button";
import { Text } from "../text";
import { pickAriaProps } from "../../utils/aria-props";

import styles from "./RadioButtonGroup.module.scss";
import {
  RadioButtonGroupProps,
  TRadioButtonOption,
} from "./RadioButtonGroup.types";

const RadioButtonGroup = ({
  id,
  className,
  style,
  orientation = "horizontal",
  width,
  options,
  name,
  selected,
  fontSize,
  fontWeight,
  onClick,
  isDisabled,
  spacing,
  dataTestId,
  ...rest
}: RadioButtonGroupProps) => {
  const [selectedOption, setSelectedOption] = React.useState(selected);
  const radioButtonGroupRef = React.useRef<HTMLDivElement>(null);

  const handleOptionChange = (
    changeEvent: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSelectedOption(changeEvent.target.value);
  };

  useEffect(() => {
    setSelectedOption(selected);
  }, [selected]);

  useLayoutEffect(() => {
    if (!radioButtonGroupRef.current) return;

    if (width) {
      radioButtonGroupRef.current.style.setProperty(
        "--radio-button-group-width",
        width,
      );
    }
  }, [width]);

  return (
    <div
      {...pickAriaProps(rest)}
      ref={radioButtonGroupRef}
      role="radiogroup"
      id={id}
      className={classNames(
        styles.radioButtonGroup,
        styles[orientation],
        className,
      )}
      style={{ width, ...style }}
      data-testid={dataTestId ?? "radio-button-group"}
    >
      {options.map((option: TRadioButtonOption, index) => {
        if (option.type === "text")
          return (
            <Text
              key={`radio-text-${index}`}
              className={styles.subtext}
              data-testid={option.dataTestId ?? "radio-button-group_text"}
            >
              {option.label}
            </Text>
          );

        return (
          <RadioButton
            id={option.id}
            key={option.value}
            name={name || ""}
            value={option.value}
            isChecked={`${selectedOption}` === `${option.value}`}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              handleOptionChange(e);
              onClick(e);
            }}
            isDisabled={isDisabled || option.disabled}
            label={option.label}
            fontSize={fontSize}
            fontWeight={fontWeight}
            spacing={spacing}
            orientation={orientation}
            autoFocus={option.autoFocus}
            testId={option.dataTestId || option.id}
          />
        );
      })}
    </div>
  );
};

export { RadioButtonGroup };
