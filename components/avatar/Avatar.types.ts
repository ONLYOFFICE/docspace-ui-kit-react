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

import type React from "react";

import type { AvatarRole, AvatarSize, AvatarActionKeys } from "./Avatar.enums";

export type TAvatarModel = { label: string; icon: string } & (
	| {
			key: string;
			onClick: () => void;
	  }
	| {
			key: typeof AvatarActionKeys.PROFILE_AVATAR_UPLOAD;
			onClick: (ref?: React.RefObject<HTMLDivElement | null>) => void;
	  }
);

export type AvatarProps = {
	/** Size of avatar */
	size: AvatarSize;
	/** Adds a table of user roles */
	role: AvatarRole;
	/** Displays as `Picture` in case the url is specified and as `Icon` in case the path to the .svg file is specified */
	source?: string | React.JSX.Element;
	/** Allows to display a user name as initials when `source` is set to blank */
	userName?: string;
	/** Enables avatar editing */
	editing?: boolean;
	/** Allows to display as a default icon when `source` is set to blank */
	isDefaultSource?: boolean;
	/** Function called when the avatar change button is pressed */
	editAction?: () => void;
	/** Hides user role */
	hideRoleIcon?: boolean;
	/** Accepts class */
	className?: string;
	/** Accepts id */
	id?: string;
	/** Accepts css style  */
	style?: React.CSSProperties;
	/** Show tooltip on hover role icon */
	withTooltip?: boolean;
	/** Tooltip content */
	tooltipContent?: string;
	onClick?: (e: React.MouseEvent) => void;
	/** Display initials for group when `source` is set to blank */
	isGroup?: boolean;
	/** Accepts roleIcon */
	roleIcon?: React.ReactElement;
	noClick?: boolean;
	hasAvatar?: boolean;
	onChangeFile?: () => void;

	model?: TAvatarModel[];
	isNotIcon?: boolean;
	imgClassName?: string;
	dataTestId?: string;
};
