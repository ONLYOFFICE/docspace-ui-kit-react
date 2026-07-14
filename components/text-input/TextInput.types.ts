/*
 * Copyright (C) Ascensio System SIA, 2009-2026
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation, together with the
 * additional terms provided in the LICENSE file.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For
 * details, see the GNU AGPL at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA by email at info@onlyoffice.com
 * or by postal mail at 20A-6 Ernesta Birznieka-Upisha Street, Riga,
 * LV-1050, Latvia, European Union.
 *
 * The interactive user interfaces in modified versions of the Program
 * are required to display Appropriate Legal Notices in accordance with
 * Section 5 of the GNU AGPL version 3.
 *
 * No trademark rights are granted under this License.
 *
 * All non-code elements of the Product, including illustrations,
 * icon sets, and technical writing content, are licensed under the
 * Creative Commons Attribution-ShareAlike 4.0 International License:
 * https://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 * This license applies only to such non-code elements and does not
 * modify or replace the licensing terms applicable to the Program's
 * source code, which remains licensed under the GNU Affero General
 * Public License v3.
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

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
