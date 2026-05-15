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
};
