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
  syncDatabase: "syncDatabase",
});

export const EMPTY_ARRAY = Object.freeze([]) as [];
export const EMPTY_OBJECT = Object.freeze({});
export const FUNCTION_EMPTY = (): void => {};

export const ROOM_ACTION_KEYS = {
  CREATE_EDIT_ROOM_UPLOAD: "create_edit_room_upload",
  CREATE_EDIT_ROOM_DELETE: "create_edit_room_delete",
  CREATE_EDIT_ROOM_CUSTOMIZE_COVER: "create_edit_room_customize_cover",
} as const;

export const ASIDE_PADDING_AFTER_LAST_ITEM = "12px";

export const LIVE_CHAT_LOCAL_STORAGE_KEY = "live_chat_state";

export const LANGUAGE = "asc_language";

export const FOLDER_FORM_VALIDATION = /[*+:"<>?|\\\/]/gim;

export const TEMPLATE_GALLERY_FORMATS = [".docx", ".xlsx", ".pptx", ".pdf"];

export const HTML_EXST = [".htm", ".mht", ".html", ".mhtml"];

export const EBOOK_EXST = [".fb2", ".pb2", ".ibk", ".prc", ".epub", ".djvu"];

export const DEFAULT_CHUNK_UPLOAD_SIZE = 5 * 1024 * 1024;
export const DEFAULT_MAX_UPLOAD_THREAD_COUNT = 3;
export const DEFAULT_MAX_UPLOAD_FILES_COUNT = 2;

export const MAX_VISIBLE_EXTENSIONS = 5;
