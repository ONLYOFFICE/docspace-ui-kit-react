import type React from "react";

import type { TextProps } from "../text";

type PickedTextProps = Pick<TextProps, "title" | "truncate">;

type PickedInputProps = Pick<
	React.ComponentPropsWithoutRef<"input">,
	"name" | "value" | "tabIndex" | "onChange"
>;

type PickedLabelProps = Pick<
	React.LabelHTMLAttributes<HTMLLabelElement>,
	"id" | "style" | "className"
>;

export type CheckboxProps = PickedTextProps &
	PickedInputProps &
	PickedLabelProps & {
		/** Label of the input */
		label?: string;
		/** Sets the checked state of the checkbox */
		isChecked?: boolean;
		/** The state is displayed as a rectangle in the checkbox when set to true */
		isIndeterminate?: boolean;
		/** Disables the Checkbox input */
		isDisabled?: boolean;
		/** Renders the help button */
		helpButton?: React.ReactNode;
		/** Notifies if the error occurs */
		hasError?: boolean;
		/** Test id for the checkbox */
		dataTestId?: string;
	};
