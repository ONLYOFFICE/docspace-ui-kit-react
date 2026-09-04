import type { Mask } from "react-text-mask";
import type { InputSize, InputType } from "./TextInput.enums";

type HTMLInputProps = Omit<
	React.InputHTMLAttributes<HTMLInputElement>,
	| "size"
	| "type"
	| "value"
	| "onChange"
	| "onBlur"
	| "onFocus"
	| "onKeyDown"
	| "onClick"
	| "onContextMenu"
	| "disabled"
	| "readOnly"
	| "className"
	| "style"
	| "dir"
	| "ref"
>;

export type TextInputProps = HTMLInputProps & {
	/** Used as HTML `id` property */
	id?: string;
	/** Forwarded ref */
	forwardedRef?: React.Ref<HTMLInputElement>;
	/** Used as HTML `name` property */
	name?: string;
	/** Supported type of the input fields */
	type: InputType;
	/** Value of the input */
	value: string;
	/** Default maxLength value of the input */
	maxLength?: number;
	/** Placeholder text for the input */
	placeholder?: string;
	/** Used as HTML `tabindex` property */
	tabIndex?: number;
	/** Input text mask */
	mask?: Mask | ((value: string) => Mask);
	/** Allows to add or delete characters without changing the positions of the existing characters */
	keepCharPositions?: boolean;
	/** When guide is true, Text Mask always shows both placeholder characters and non-placeholder mask characters */
	guide?: boolean;
	/** Supported size of the input fields */
	size?: InputSize;
	/** Indicates the input field has scale */
	scale?: boolean;
	/** Called with the new value. Required when input is not read only */
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	/** Called when field is blurred */
	onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
	/** Called when field is focused */
	onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
	/** Called when a key is pressed */
	onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
	/** Called when clicked */
	onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
	/** Called when context menu is triggered */
	onContextMenu?: (e: React.MouseEvent<HTMLInputElement>) => void;
	/** Focus the input field on initial render */
	isAutoFocussed?: boolean;
	/** Indicates that the field cannot be used */
	isDisabled?: boolean;
	/** Indicates that the field is displaying read-only content */
	isReadOnly?: boolean;
	/** Indicates the input field has an error */
	hasError?: boolean;
	/** Indicates the input field has a warning */
	hasWarning?: boolean;
	/** Used as HTML `autocomplete` property */
	autoComplete?: string;
	/** Used as HTML `spellcheck` property */
	spellCheck?: boolean;
	/** CSS class name */
	className?: string;
	/** Inline CSS styles */
	style?: React.CSSProperties;
	/** Sets the font weight */
	fontWeight?: number | string;
	/** Sets font weight value to 600 */
	isBold?: boolean;
	/** Indicates that component contains border */
	withBorder?: boolean;
	/** Text direction */
	dir?: string;
	/** Input mode for virtual keyboard */
	inputMode?:
		| "none"
		| "text"
		| "decimal"
		| "numeric"
		| "tel"
		| "search"
		| "email"
		| "url";
	/** HTML data-testid attribute */
	testId?: string;
};
