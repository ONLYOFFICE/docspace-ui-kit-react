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
