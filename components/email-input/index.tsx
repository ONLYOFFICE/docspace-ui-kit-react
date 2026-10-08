import React from "react";
import { isIOS, isMobile } from "react-device-detect";

import { parseAddress } from "../../utils/email";
import { TextInput, InputType } from "../text-input";
import type { EmailInputProps, TValidate } from "./EmailInput.types";
import styles from "./EmailInput.module.scss";

export type { EmailInputProps, TValidate };

export const EmailInput = ({
  onValidateInput,
  customValidate,
  emailSettings,
  value = "",
  isAutoFocussed,
  autoComplete = "email",
  hasError,
  handleAnimationStart,
  onChange,
  onBlur,
  dataTestId,
  ...rest
}: EmailInputProps) => {
  const [inputValue, setInputValue] = React.useState(value);
  const [validationState, setValidationState] = React.useState<TValidate>({
    value: "",
    isValid: true,
    errors: [],
  });

  const validateEmail = React.useCallback(
    (emailValue: string): TValidate => {
      if (customValidate) return customValidate(emailValue);

      const emailObj = parseAddress(emailValue, emailSettings);
      const isValid = emailObj.isValid();
      const errors =
        emailObj.parseErrors?.map(
          (error: { errorKey: string }) => error.errorKey,
        ) ?? [];

      return { value: emailValue, isValid, errors };
    },
    [customValidate, emailSettings],
  );

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      const validation = validateEmail(newValue);

      setInputValue(newValue);
      setValidationState(validation);

      onChange?.(e);
      onValidateInput?.(validation);
    },
    [onChange, onValidateInput, validateEmail],
  );

  React.useEffect(() => {
    setInputValue(value);
    setValidationState(validateEmail(value));
  }, [value, validateEmail]);

  const computedHasError =
    hasError ?? Boolean(inputValue && !validationState.isValid);

  return (
    <TextInput
      {...rest}
      className={styles.emailInput}
      type={InputType.text}
      value={inputValue}
      hasError={computedHasError}
      autoComplete={autoComplete}
      isAutoFocussed={isMobile && isIOS ? false : isAutoFocussed}
      onChange={handleChange}
      onBlur={onBlur}
      onAnimationStart={handleAnimationStart}
      testId={dataTestId ?? "email-input"}
    />
  );
};
