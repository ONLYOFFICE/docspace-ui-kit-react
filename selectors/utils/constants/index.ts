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
