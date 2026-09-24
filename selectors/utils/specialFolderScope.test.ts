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
