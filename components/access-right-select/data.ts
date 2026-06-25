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

// import ActionsDocumentReactSvgUrl from "PUBLIC_DIR/images/actions.documents.react.svg?url";
// import CheckReactSvgUrl from "PUBLIC_DIR/images/check.react.svg?url";
// import AccessEditReactSvgUrl from "PUBLIC_DIR/images/access.edit.react.svg?url";
// import AccessReviewReactSvgUrl from "PUBLIC_DIR/images/access.review.react.svg?url";
// import AccessCommentReactSvgUrl from "PUBLIC_DIR/images/access.comment.react.svg?url";
// import EyeReactSvgUrl from "PUBLIC_DIR/images/eye.react.svg?url";
// import AccessNoneReactSvgUrl from "PUBLIC_DIR/images/access.none.react.svg?url";

import { globalColors } from "../../providers/theme";

import type { TOption } from "../combobox";

export const data: TOption[] = [
	{
		key: "key1",
		label: "Room administrator",
		description: `Administration of rooms, archiving of rooms, inviting and managing users in rooms.`,
		quota: "free",
		color: globalColors.tickColor,
	},
	{
		key: "key2",
		label: "Full access",
		description: `Edit, upload, create, view, download, delete files and folders.`,
		quota: "paid",
		color: globalColors.favoritesStatus,
	},

	{ key: "key3", label: "", isSeparator: true },
	{
		key: "key4",
		label: "Editing",
		description: `Editing, viewing, downloading files and folders, filling out forms.`,
	},
	{
		key: "key5",
		label: "Review",
		description: `Reviewing, viewing, downloading files and folders, filling out forms.`,
	},
	{
		key: "key6",
		label: "Comment",
		description: `Commenting on files, viewing, downloading files and folders, filling out forms.`,
	},
	{
		key: "key7",
		label: "Read only",
		description: `Viewing, downloading files and folders, filling out forms.`,
	},
	{
		key: "key8",
		label: "Deny access",
		description: "",
	},
];
