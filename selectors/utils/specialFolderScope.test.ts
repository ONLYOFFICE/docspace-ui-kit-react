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

import { describe, expect, it } from "vitest";
import { FolderType } from "@onlyoffice/docspace-api-sdk";

import { buildScopedFolderUrl, buildSpecialFolderItems } from ".";
import { ROOMS_SECTION_FOLDER_TYPES } from "./constants";

const folder = { id: 11, parentId: 0, filesCount: 0, foldersCount: 0 };

const scopeOf = (folderType?: number | number[]) => {
  const [recent] = buildSpecialFolderItems({
    section: "files",
    recentFolder: folder,
    withRecent: true,
    folderType,
    t: (key: string) => key,
  });

  return recent.specialFolderScope;
};

const typesOf = (url: string) =>
  new URL(url, "https://localhost").searchParams.getAll("folderType");

describe("buildScopedFolderUrl folderType scope", () => {
  it("sends a single folder type as one key", () => {
    const url = buildScopedFolderUrl({
      folderId: 11,
      startIndex: 0,
      count: 100,
      folderType: FolderType.AiRoom,
    });

    expect(typesOf(url)).toEqual(["31"]);
  });

  // The server binds folderType to a List<FolderType>, so a section made of
  // several room types has to repeat the key instead of comma-joining it.
  it("repeats the key for a section made of several folder types", () => {
    const url = buildScopedFolderUrl({
      folderId: 11,
      startIndex: 0,
      count: 100,
      folderType: ROOMS_SECTION_FOLDER_TYPES,
    });

    expect(typesOf(url)).toEqual(["16", "19", "22", "29"]);
  });

  it("omits the scope entirely when no folder type is given", () => {
    const url = buildScopedFolderUrl({
      folderId: 11,
      startIndex: 0,
      count: 100,
    });

    expect(typesOf(url)).toEqual([]);
  });
});

describe("buildSpecialFolderItems scope", () => {
  it("carries the folder type through to the item scope", () => {
    expect(scopeOf(FolderType.USER)?.folderType).toBe(FolderType.USER);
    expect(scopeOf(ROOMS_SECTION_FOLDER_TYPES)?.folderType).toEqual(
      ROOMS_SECTION_FOLDER_TYPES,
    );
  });
});

describe("ROOMS_SECTION_FOLDER_TYPES", () => {
  // VirtualRooms is the root holding every room, so scoping the Rooms section
  // to it would bring form filling and AI rooms back into Recent/Favorites.
  it("lists room types only, without the section root", () => {
    expect(ROOMS_SECTION_FOLDER_TYPES).toEqual([
      FolderType.EditingRoom,
      FolderType.CustomRoom,
      FolderType.PublicRoom,
      FolderType.VirtualDataRoom,
    ]);
    expect(ROOMS_SECTION_FOLDER_TYPES).not.toContain(FolderType.VirtualRooms);
    expect(ROOMS_SECTION_FOLDER_TYPES).not.toContain(
      FolderType.FillingFormsRoom,
    );
    expect(ROOMS_SECTION_FOLDER_TYPES).not.toContain(FolderType.AiRoom);
  });
});
