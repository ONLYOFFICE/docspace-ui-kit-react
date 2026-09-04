import React from "react";

import { InputSize } from "../text-input";
import type { MainButtonProps } from "../main-button/MainButton.types";

export type SearchInputProps = {
	/** Used as HTML `id` property */
	id?: string;
	/** Forwarded ref */
	forwardedRef?: React.Ref<HTMLInputElement>;
	/** Sets the unique element name */
	name?: string;
	/** Accepts class */
	className?: string;
	/** Supported size of the input fields. */
	size: InputSize;
	/** Input value */
	value: string;
	/** Indicates that the input field has scale  */
	scale?: boolean;
	/** Placeholder text for the input */
	placeholder?: string;
	/** Sets a callback function that allows handling the component's changing events */
	onChange?: (value: string) => void;
	/** Sets a callback function that is triggered when the clear icon of the search input is clicked */
	onClearSearch?: () => void;
	onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
	/** Indicates that the field cannot be used (e.g not authorized, or the changes have not been saved) */
	isDisabled?: boolean;
	/** Displays the Clear Button */
	showClearButton?: boolean;
	/** Sets the refresh timeout of the input  */
	refreshTimeout?: number;
	/** Sets the input to refresh automatically */
	autoRefresh?: boolean;
	/** Child elements */
	children?: React.ReactNode;
	/** Accepts css style */
	style?: React.CSSProperties;
	/** The callback function that is called when the field is focused  */
	onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
	/** Added data-testid for testing  */
	dataTestId?: string;
	/** HTML tabindex property */
	tabIndex?: number;
	/** Shows a MainButton to the left of the search field */
	showMainButton?: boolean;
	/** Props for the MainButton displayed to the left of the search field */
	mainButtonProps?: MainButtonProps;
	/** Icon node rendered inside the MainButton (12x12) */
	mainButtonIcon?: React.ReactNode;
	/** data-testid for the main button wrapper element */
	mainButtonDataTestId?: string;
};
