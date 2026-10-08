import React, { MouseEvent } from "react";

import { InputType } from "../text-input";
import { InputBlockProps } from "../input-block";

export type TPasswordSettings = {
  /** Minimum length requirement for the password */
  minLength?: number;
  /** Requires uppercase characters in the password */
  upperCase?: boolean;
  /** Requires digits in the password */
  digits?: boolean;
  /** Requires special symbols in the password */
  specSymbols?: boolean;
  /** Regular expression for validating digits */
  digitsRegexStr?: string;
  /** Regular expression for validating uppercase characters */
  upperCaseRegexStr?: string;
  /** Regular expression for validating special symbols */
  specSymbolsRegexStr?: string;
  /** Regular expression for allowed characters */
  allowedCharactersRegexStr?: string;
};

export type TPasswordValidation = {
  /** Whether all characters are allowed */
  allowed: boolean;
  /** Whether digits requirement is met */
  digits: boolean;
  /** Whether capital letters requirement is met */
  capital: boolean;
  /** Whether special characters requirement is met */
  special: boolean;
  /** Whether length requirement is met */
  length: boolean;
};

export type TPasswordState = {
  /** Current input type (text/password) */
  type: InputType.text | InputType.password;
  /** Current input value */
  value?: string;
  /** Copy button label */
  copyLabel?: string;
  /** Whether copy action is disabled */
  disableCopyAction?: boolean;
  /** Whether tooltip is displayed */
  displayTooltip: boolean;
  /** Validation states */
  validLength: boolean;
  validDigits: boolean;
  validCapital: boolean;
  validSpecial: boolean;
};

export type PasswordInputHandle = {
  /** Generate password handler */
  onGeneratePassword: (e: MouseEvent) => void;
  /** Set component state */
  setState(state: TPasswordState): void;
  /** Current value */
  value?: string;
};

export type TPasswordTooltipProps = {
  /** Title for password requirements tooltip */
  tooltipPasswordTitle?: string;
  /** Prompt for minimum length requirement */
  tooltipPasswordLength?: string;
  /** Prompt for digits requirement */
  tooltipPasswordDigits?: string;
  /** Prompt for capital letters requirement */
  tooltipPasswordCapital?: string;
  /** Prompt for special characters requirement */
  tooltipPasswordSpecial?: string;
  /** Title for allowed characters tooltip */
  tooltipAllowedCharacters?: string;
  /** Allows to hide Tooltip */
  isDisableTooltip?: boolean;
  /** Title of the password generation button */
  generatePasswordTitle?: string;
};

type PasswordInputBaseProps = {
  /** Handle for generating a password and reading the current value. */
  ref?: React.RefObject<PasswordInputHandle | null>;
  /**
   * Value the field starts with. The component owns the value from then on:
   * changing this later is ignored unless it becomes an empty string, or
   * `isSimulateType` is set.
   */
  inputValue?: string;
  /** Ignored. It only sets an internal flag for a copy button that is not rendered. */
  emailInputName?: string;
  /**
   * The rules the generator and the checker use. Left out, only a minimum
   * length of 8 is required — digits, capitals and symbols are all off.
   */
  passwordSettings?: TPasswordSettings;
  /**
   * Called after every change with whether every rule passes, and with each
   * rule's own result. It never fires in `simpleView`, which skips checking.
   */
  onValidateInput?: (
    progressScore: boolean,
    passwordValidation: TPasswordValidation,
  ) => void;
  /**
   * Characters the generator may pick symbols from.
   * @default "!@#$%^&*"
   */
  generatorSpecial?: string;
  /**
   * Strips the component down to the field and the reveal eye: no strength
   * tooltip, no generate link, and no validation at all.
   */
  simpleView?: boolean;
  /** Whether the wrapper is a full-width block rather than shrinking to the field. */
  isFullWidth?: boolean;
  /**
   * Renders the value as repeated `simulateSymbol` characters in a **text**
   * field, keeping the real value in state. It needs the input's `id` to be
   * `conversion-password`, which is where it reads the caret from.
   */
  isSimulateType?: boolean;
  /**
   * The character drawn for each real one under `isSimulateType`.
   * @default "•"
   */
  simulateSymbol?: string;
  /** Ignored. It feeds a copy button that is not rendered. */
  clipActionResource?: string;
  /** Ignored. It feeds a copy button that is not rendered. */
  clipCopiedResource?: string;
};

export type PasswordInputProps = Omit<
  InputBlockProps,
  | "type"
  | "value"
  | "onChange"
  | "children"
  | "iconName"
  | "iconButtonClassName"
  | "name"
  | "width"
> &
  PasswordInputBaseProps &
  TPasswordTooltipProps & {
    /**
     * Whether the field starts revealed. The eye toggles it from then on, and
     * `isDisabled` forces it back to hidden.
     * @default InputType.password
     */
    inputType?: InputType.text | InputType.password;
    /**
     * `name` of the field, and the fallback for the tooltip's anchor id when no
     * `id` is given — so two fields on one page need distinct ids.
     * @default "passwordInput"
     */
    inputName?: string;
    /** Width of the field's wrapper, as a CSS length. */
    inputWidth?: string;
    /**
     * Called on every change with the DOM event and the value after sanitising.
     * Read the second argument: under `isSimulateType` the event carries the
     * masking characters, not the password.
     */
    onChange?: (e: React.ChangeEvent<HTMLInputElement>, value?: string) => void;
    /** Runs on every change before the value is stored — stripping spaces, say. */
    sanitizeValue?: (value: string) => string;
  };
