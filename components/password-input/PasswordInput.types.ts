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
	ref?: React.RefObject<PasswordInputHandle | null>;
	/** Input value */
	inputValue?: string;
	/** Required to associate the password field with the email field */
	emailInputName?: string;
	/** Set of settings for password generator and validator */
	passwordSettings?: TPasswordSettings;
	/** Callback function triggered on validation */
	onValidateInput?: (
		progressScore: boolean,
		passwordValidation: TPasswordValidation,
	) => void;
	/** Set of special characters for password generator */
	generatorSpecial?: string;
	/** Sets the password input view to simple */
	simpleView?: boolean;
	/** Setting display block for full width */
	isFullWidth?: boolean;
	/** Indicating the password type simulation */
	isSimulateType?: boolean;
	/** Sets simulate input symbol */
	simulateSymbol?: string;
	/** Prompts to copy the email and password data */
	clipActionResource?: string;
	/** Prompts that the data has been copied */
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
		/** Input type override */
		inputType?: InputType.text | InputType.password;
		inputName?: string;
		inputWidth?: string;
		/** Callback function triggered on input change */
		onChange?: (e: React.ChangeEvent<HTMLInputElement>, value?: string) => void;
		/** Optional function to sanitize the input value in real time (e.g. strip spaces) */
		sanitizeValue?: (value: string) => string;
	};
