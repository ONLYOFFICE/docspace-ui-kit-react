// (c) Copyright Ascensio System SIA 2009-2026
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

import { globalColors } from "../providers/theme/themes";

export const LOADER_STYLE = Object.freeze({
	title: "",
	width: "100%",
	height: "32",
	backgroundColor: globalColors.darkBlack,
	foregroundColor: globalColors.darkBlack,
	backgroundOpacity: 0.1,
	foregroundOpacity: 0.15,
	borderRadius: "3",
	radius: "3",
	speed: 2,
	animate: true,
});

export const OPERATIONS_NAME = Object.freeze({
	trash: "trash",
	deletePermanently: "deletePermanently",
	download: "download",
	duplicate: "duplicate",
	exportIndex: "exportIndex",
	markAsRead: "markAsRead",
	copy: "copy",
	move: "move",
	convert: "convert",
	other: "other",
	upload: "upload",
	deleteVersionFile: "deleteVersionFile",
	backup: "backup",
});

export const EMPTY_ARRAY = Object.freeze([]) as [];

export const ROOM_ACTION_KEYS = {
	CREATE_EDIT_ROOM_UPLOAD: "create_edit_room_upload",
	CREATE_EDIT_ROOM_DELETE: "create_edit_room_delete",
	CREATE_EDIT_ROOM_CUSTOMIZE_COVER: "create_edit_room_customize_cover",
} as const;

export const ASIDE_PADDING_AFTER_LAST_ITEM = "12px";

export const LIVE_CHAT_LOCAL_STORAGE_KEY = "live_chat_state";

export const LANGUAGE = "asc_language";
