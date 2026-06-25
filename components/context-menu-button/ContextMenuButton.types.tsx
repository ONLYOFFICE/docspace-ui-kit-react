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

import type { TDirectionX, TDirectionY } from "../../types";
import type { ContextMenuModel } from "../context-menu";
import type { ContextMenuButtonDisplayType } from "./ContextMenuButton.enums";

export interface ContextMenuButtonProps {
	/** Sets the button to present an opened state */
	opened?: boolean;
	/** Array of options for display */
	data?: ContextMenuModel[];
	/** Function for converting to inner data */
	getData?: () => ContextMenuModel[];
	/** Specifies the icon title */
	title?: string;
	/** Specifies the icon name */
	iconName?: string;
	/** Specifies the icon size */
	size?: number;
	/** Specifies the icon color */
	color?: string;
	/** Sets the button to present a disabled state */
	isDisabled?: boolean;
	/** Specifies the icon hover color */
	hoverColor?: string;
	/** Specifies the icon click color */
	clickColor?: string;
	/** Specifies the icon hover name */
	iconHoverName?: string;
	/** Specifies the icon click name */
	iconClickName?: string;
	/** Specifies the icon open name */
	iconOpenName?: string;
	/** Triggers a callback function when the mouse enters the button borders */
	onMouseEnter?: (e: React.MouseEvent) => void;
	/** Triggers a callback function when the mouse leaves the button borders */
	onMouseLeave?: (e: React.MouseEvent) => void;
	/** Triggers a callback function when the mouse moves over the button borders */
	onMouseOver?: (e: React.MouseEvent) => void;
	/** Triggers a callback function when the mouse moves out of the button borders */
	onMouseOut?: (e: React.MouseEvent) => void;
	onClick?: (e: React.MouseEvent) => void;
	/** Direction X */
	directionX?: TDirectionX;
	/** Direction Y */
	directionY?: TDirectionY;
	/** Fixes the direction of the dropdown */
	fixedDirection?: boolean;
	/** Accepts class */
	className?: string;
	/** Accepts id */
	id?: string;
	/** Accepts css style */
	style?: React.CSSProperties;
	/** Sets the number of columns */
	columnCount?: number;
	/** Sets the display type */
	displayType?: ContextMenuButtonDisplayType;
	/** Closing event */
	onClose?: () => void;
	/** Sets the drop down open with the portal */
	usePortal?: boolean;
	/** Sets the class of the drop down element */
	dropDownClassName?: string;
	/** Sets the class of the icon button */
	iconClassName?: string;
	/** Enables displaying the icon borders  */
	displayIconBorder?: boolean;
	isFill?: boolean;
	zIndex?: number;
	asideHeader?: React.ReactNode;
	testId?: string;
}
