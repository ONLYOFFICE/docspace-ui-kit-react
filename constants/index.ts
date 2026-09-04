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
