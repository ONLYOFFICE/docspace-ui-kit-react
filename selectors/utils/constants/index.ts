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

import { FolderType } from "@onlyoffice/docspace-api-sdk";

export const SHOW_LOADER_TIMER = 200;

export const MIN_LOADER_TIMER = 500;

export const PAGE_COUNT = 100;

export const DEFAULT_FILE_EXTS = "file";

/**
 * Root folder type of the "Forms" section (FolderType.Forms on the server).
 *
 * The bundled api-sdk enum stops at DefaultTemplates = 35 and has no Forms
 * member yet, so the value is declared here. It must not be confused with
 * FolderType.FillingFormsRoom = 15, which is the type of an individual form
 * filling room rather than the section that lists them.
 */
export const FORMS_ROOT_FOLDER_TYPE = 36;

/** Synthetic id of the client-side "Forms" root item in the selector tree. */
export const FORMS_SECTION_ID = "forms-section";

/** Search area that lists form filling rooms (SearchArea.Forms). */
export const FORMS_SEARCH_AREA = "Forms";

/**
 * Folder types of the rooms that make up the "Rooms" section, for the
 * folderType scope filter of the Recent/Favorites aggregates.
 *
 * Mirrors ROOMS_SECTION_FOLDER_TYPES in the client package: form filling rooms
 * belong to the "Forms" section and AI rooms to "AI Agents", so both are left
 * out. VirtualRooms = 14 is the root that holds all of them and would leak
 * those two sections back in, so it is not a member either.
 */
export const ROOMS_SECTION_FOLDER_TYPES = [
  FolderType.EditingRoom,
  FolderType.CustomRoom,
  FolderType.PublicRoom,
  FolderType.VirtualDataRoom,
];
