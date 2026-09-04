import { memo } from "react";
import MaskedInput from "react-text-mask";

import type { TextInputProps } from "../TextInput.types";
import { InputType } from "../TextInput.enums";

type InputComponentProps = TextInputProps & {
  className?: string;
};

const InputComponent = ({
  // Required props
  type = InputType.text,
  value = "",

  // Optional props with defaults
  isAutoFocussed = false,
  isDisabled = false,
  isReadOnly = false,
  maxLength = 255,
  tabIndex = -1,
  autoComplete = "off",
  placeholder = " ",
  dir = "auto",
  guide = false,
  className = "",

  // Optional props without defaults
  mask,
  forwardedRef,
  keepCharPositions,

  // Rest of props
  ...props
}: InputComponentProps) => {
  const baseClassName = `${className} input-component not-selectable`;

  const commonProps = {
    type,
    placeholder,
    className: baseClassName,
    disabled: isDisabled,
    readOnly: isReadOnly,
    autoFocus: isAutoFocussed,
    value,
    maxLength,
    tabIndex,
    autoComplete,
    dir,
    ...props,
  };

  // MaskedInput expects `size` to be a number, while our TextInput props may use an enum.
  // Omit `size` when rendering MaskedInput and the native input to avoid the type mismatch.
  const { size: _, ...commonPropsForInput } = commonProps;

  if (mask) {
    return (
      <MaskedInput
        {...commonPropsForInput}
        mask={mask}
        guide={guide}
        keepCharPositions={keepCharPositions}
      />
    );
  }

  return <input {...commonPropsForInput} ref={forwardedRef} />;
};

export const Input = memo(InputComponent);

export type { InputComponentProps };
