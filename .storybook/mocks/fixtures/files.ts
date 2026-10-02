// The demo portal's rooms, folders and files. Every name is made up; the
// only address anything points at is the `.invalid` demo origin.
//
// Kept as a small in-memory store rather than as frozen DTOs: counts, paths
// and breadcrumbs are derived from it on every answer, so a folder created or
// a file uploaded during the session shows up everywhere at once.

import { FileType, FolderType, RoomType } from "@onlyoffice/docspace-api-sdk";

import { DEMO_PORTAL_URL, daysAgo } from "../demoPortal";
import { DEMO_PEOPLE, DEMO_SELF, authorOf, type DemoEmployee } from "./people";

type Security = Record<string, boolean>;

/** Every flag the portal sends, set to `value`, then `overrides` on top. */
const flags = (keys: string[], value: boolean, overrides: Security = {}) => ({
  ...Object.fromEntries(keys.map((key) => [key, value])),
  ...overrides,
});

const FOLDER_FLAGS = [
  "Read",
  "Create",
  "Delete",
  "EditRoom",
  "Rename",
  "CopyTo",
  "Copy",
  "MoveTo",
  "Move",
  "Pin",
  "Mute",
  "EditAccess",
  "Duplicate",
  "Download",
  "CopySharedLink",
  "ReadHistory",
  "ReadLinks",
  "ChangeOwner",
  "CreateRoomFrom",
  "CopyLink",
  "Embed",
  "IndexExport",
  "Reconnect",
  "EditInternal",
  "EditExpiration",
  "Vectorization",
  "AskAi",
  "UseChat",
];

const FILE_FLAGS = [
  "Read",
  "Comment",
  "FillForms",
  "Review",
  "Create",
  "CreateFrom",
  "Edit",
  "Delete",
  "CustomFilter",
  "Rename",
  "ReadHistory",
  "Lock",
  "EditHistory",
  "Copy",
  "Move",
  "Duplicate",
  "SubmitToFormGallery",
  "Download",
  "Convert",
  "CopySharedLink",
  "ReadLinks",
  "CopyLink",
  "Embed",
  "StartFilling",
  "FillingStatus",
  "ResetFilling",
  "StopFilling",
  "OpenForm",
  "EditInternal",
  "EditExpiration",
  "Vectorization",
  "AskAi",
  "UseChat",
  "UpdateXlsx",
  "AnalyzeResponses",
];

// The key the demo portal runs as is the owner's, so nearly everything is
// allowed; the section roots are the exceptions a real owner meets too.
const ROOM_SECURITY = flags(FOLDER_FLAGS, true, { Reconnect: false });
const FOLDER_SECURITY = flags(FOLDER_FLAGS, true, {
  EditRoom: false,
  Pin: false,
  Mute: false,
  ChangeOwner: false,
  CreateRoomFrom: false,
  IndexExport: false,
  Reconnect: false,
});
const FILE_SECURITY = flags(FILE_FLAGS, true, {
  FillForms: false,
  CustomFilter: false,
  SubmitToFormGallery: false,
  StartFilling: false,
  FillingStatus: false,
  ResetFilling: false,
  StopFilling: false,
  OpenForm: false,
  UpdateXlsx: false,
  AnalyzeResponses: false,
});
const FORM_SECURITY = {
  ...FILE_SECURITY,
  FillForms: true,
  SubmitToFormGallery: true,
  StartFilling: true,
  FillingStatus: true,
  OpenForm: true,
};
const ROOT_SECURITY = flags(FOLDER_FLAGS, false, {
  Read: true,
  Create: true,
});
const READ_ONLY_ROOT_SECURITY = flags(FOLDER_FLAGS, false, { Read: true });
const ARCHIVED_ROOM_SECURITY = flags(FOLDER_FLAGS, false, {
  Read: true,
  Download: true,
  Delete: true,
  ReadHistory: true,
  ReadLinks: true,
});

/** A room's folder type, from its room type. */
export const ROOM_FOLDER_TYPE: Record<number, number> = {
  [RoomType.FillingFormsRoom]: FolderType.FillingFormsRoom,
  [RoomType.EditingRoom]: FolderType.EditingRoom,
  [RoomType.CustomRoom]: FolderType.CustomRoom,
  [RoomType.PublicRoom]: FolderType.PublicRoom,
  [RoomType.VirtualDataRoom]: FolderType.VirtualDataRoom,
  [RoomType.AiRoom]: FolderType.AiRoom,
};

// The section roots. The ids are the demo portal's own; the rest of the
// store points at them through `parentId`.
export const MY_DOCUMENTS_ID = 1;
export const ROOMS_ID = 2;
export const ARCHIVE_ID = 3;
export const TRASH_ID = 4;
export const RECENT_ID = 5;
export const FAVORITES_ID = 6;

export type DemoFolder = {
  id: number;
  title: string;
  parentId: number;
  /** `FolderType` of the folder itself. */
  type: number;
  roomType?: number;
  /** A room's logo colour, in the portal's own format (no leading sign). */
  color?: string;
  shared?: boolean;
  pinned?: boolean;
  lifetime?: { value: number; period: 0 | 1 | 2 };
  quotaLimit?: number;
  security: Security;
  author: DemoEmployee;
  createdDays: number;
  updatedDays: number;
};

export type DemoFile = {
  id: number;
  title: string;
  folderId: number;
  size: number;
  isForm?: boolean;
  isFavorite?: boolean;
  author: DemoEmployee;
  createdDays: number;
  updatedDays: number;
  /** Set on files uploaded during the session, instead of `updatedDays`. */
  updatedAt?: string;
};

const [ALEX, , JONAS, MARIA, KENJI, AMARA, LUCAS, SOFIA] = DEMO_PEOPLE;

const root = (
  id: number,
  title: string,
  type: number,
  security: Security,
): DemoFolder => ({
  id,
  title,
  parentId: 0,
  type,
  security,
  author: DEMO_SELF,
  createdDays: 400,
  updatedDays: 1,
});

const room = (
  id: number,
  title: string,
  roomType: number,
  color: string,
  author: DemoEmployee,
  createdDays: number,
  updatedDays: number,
  extra: Partial<DemoFolder> = {},
): DemoFolder => ({
  id,
  title,
  parentId: ROOMS_ID,
  type: ROOM_FOLDER_TYPE[roomType],
  roomType,
  color,
  security: ROOM_SECURITY,
  author,
  createdDays,
  updatedDays,
  ...extra,
});

const folder = (
  id: number,
  title: string,
  parentId: number,
  author: DemoEmployee,
  createdDays: number,
  updatedDays: number,
  type: number = FolderType.DEFAULT,
): DemoFolder => ({
  id,
  title,
  parentId,
  type,
  security: FOLDER_SECURITY,
  author,
  createdDays,
  updatedDays,
});

export const folders: DemoFolder[] = [
  root(MY_DOCUMENTS_ID, "My documents", FolderType.USER, ROOT_SECURITY),
  root(ROOMS_ID, "Rooms", FolderType.VirtualRooms, ROOT_SECURITY),
  root(ARCHIVE_ID, "Archive", FolderType.Archive, READ_ONLY_ROOT_SECURITY),
  root(TRASH_ID, "Trash", FolderType.TRASH, READ_ONLY_ROOT_SECURITY),
  root(RECENT_ID, "Recent", FolderType.Recent, READ_ONLY_ROOT_SECURITY),
  root(
    FAVORITES_ID,
    "Favorites",
    FolderType.Favorites,
    READ_ONLY_ROOT_SECURITY,
  ),

  // Rooms. Colours are from the portal's own logo palette.
  room(101, "Contracts 2026", RoomType.CustomRoom, "4781D1", JONAS, 120, 1, {
    pinned: true,
  }),
  room(
    102,
    "Marketing campaign Q3",
    RoomType.EditingRoom,
    "FF8541",
    MARIA,
    60,
    2,
  ),
  room(
    103,
    "Client onboarding kit",
    RoomType.PublicRoom,
    "5CC3A7",
    ALEX,
    90,
    6,
    {
      shared: true,
    },
  ),
  room(
    104,
    "Northwind acquisition due diligence",
    RoomType.VirtualDataRoom,
    "9F6BC6",
    ALEX,
    45,
    0,
    { lifetime: { value: 90, period: 0 }, quotaLimit: 5 * 1024 * 1024 * 1024 },
  ),
  room(
    105,
    "Employee feedback forms",
    RoomType.FillingFormsRoom,
    "E5A330",
    AMARA,
    30,
    3,
  ),
  room(106, "Product roadmap", RoomType.EditingRoom, "3EA6CB", LUCAS, 200, 4),
  room(107, "Board meetings", RoomType.CustomRoom, "D35F5F", ALEX, 300, 12),
  room(108, "Press kit", RoomType.PublicRoom, "4AA56B", MARIA, 150, 20, {
    shared: true,
  }),
  room(
    109,
    "Vendor agreements",
    RoomType.VirtualDataRoom,
    "6E7BD8",
    SOFIA,
    80,
    9,
  ),
  room(110, "Sales proposals", RoomType.CustomRoom, "C76A9E", KENJI, 70, 5),
  room(
    111,
    "Supplier registration",
    RoomType.FillingFormsRoom,
    "B08A4F",
    AMARA,
    25,
    8,
  ),
  room(112, "Office move 2024", RoomType.CustomRoom, "8A8F98", ALEX, 500, 180, {
    parentId: ARCHIVE_ID,
    security: ARCHIVED_ROOM_SECURITY,
  }),

  // Folders inside the rooms and My documents.
  folder(201, "Signed", 101, JONAS, 100, 3),
  folder(202, "Drafts", 101, SOFIA, 100, 1),
  folder(203, "Assets", 102, MARIA, 55, 2),
  folder(204, "Financials", 104, AMARA, 44, 1),
  folder(205, "Legal", 104, JONAS, 44, 0),
  folder(206, "Intellectual property", 205, JONAS, 40, 0),
  folder(207, "Complete", 105, AMARA, 30, 3, FolderType.ReadyFormFolder),
  folder(208, "In process", 105, AMARA, 30, 3, FolderType.InProcessFormFolder),
  folder(209, "2026", 107, ALEX, 250, 12),
  folder(210, "Personal", MY_DOCUMENTS_ID, DEMO_SELF, 300, 15),
];

const KB = 1024;
const MB = 1024 * KB;

const file = (
  id: number,
  title: string,
  folderId: number,
  size: number,
  author: DemoEmployee,
  createdDays: number,
  updatedDays: number,
  extra: Partial<DemoFile> = {},
): DemoFile => ({
  id,
  title,
  folderId,
  size,
  author,
  createdDays,
  updatedDays,
  ...extra,
});

export const files: DemoFile[] = [
  // My documents
  file(1001, "Meeting notes.docx", MY_DOCUMENTS_ID, 38 * KB, ALEX, 20, 1, {
    isFavorite: true,
  }),
  file(1002, "Quarterly review.pptx", MY_DOCUMENTS_ID, 2.4 * MB, ALEX, 40, 6),
  file(1003, "Reading list.txt", MY_DOCUMENTS_ID, 3 * KB, ALEX, 90, 30),
  file(1004, "Travel expenses.xlsx", 210, 21 * KB, ALEX, 60, 15),

  // Contracts 2026
  file(1101, "Master services agreement.docx", 101, 84 * KB, JONAS, 110, 2, {
    isFavorite: true,
  }),
  file(1102, "NDA template.docx", 101, 29 * KB, SOFIA, 115, 40),
  file(1103, "Contoso supply agreement.pdf", 201, 612 * KB, JONAS, 80, 10),
  file(1104, "Fabrikam lease agreement.pdf", 201, 1.1 * MB, JONAS, 70, 3),
  file(1105, "Litware licensing draft.docx", 202, 56 * KB, SOFIA, 12, 1),

  // Marketing campaign Q3
  file(1201, "Campaign brief.docx", 102, 47 * KB, MARIA, 58, 2),
  file(1202, "Budget Q3.xlsx", 102, 64 * KB, AMARA, 50, 4),
  file(1203, "Launch presentation.pptx", 102, 5.8 * MB, MARIA, 30, 2),
  file(1204, "Banner mockup.png", 203, 820 * KB, MARIA, 20, 20),
  file(1205, "Teaser video.mp4", 203, 48 * MB, LUCAS, 15, 15),

  // Client onboarding kit
  file(1301, "Welcome guide.pdf", 103, 1.6 * MB, ALEX, 88, 6),
  file(1302, "Onboarding checklist.docx", 103, 22 * KB, KENJI, 85, 10),

  // Northwind acquisition due diligence
  file(1401, "Balance sheet 2025.xlsx", 204, 142 * KB, AMARA, 43, 1),
  file(1402, "Independent audit report.pdf", 204, 3.2 * MB, AMARA, 40, 5),
  file(1403, "Corporate structure.pdf", 205, 540 * KB, JONAS, 42, 0),
  file(1404, "Patent register.xlsx", 206, 36 * KB, JONAS, 38, 0),

  // Employee feedback forms
  file(1501, "Annual feedback form.pdf", 105, 210 * KB, AMARA, 30, 3, {
    isForm: true,
  }),
  file(
    1502,
    "Annual feedback form - Kenji Sato.pdf",
    207,
    226 * KB,
    KENJI,
    5,
    5,
    {
      isForm: true,
    },
  ),
  file(
    1503,
    "Annual feedback form - Lucas Martin.pdf",
    208,
    214 * KB,
    LUCAS,
    3,
    3,
    { isForm: true },
  ),

  // Product roadmap
  file(1601, "Roadmap 2026.xlsx", 106, 98 * KB, LUCAS, 190, 4),
  file(1602, "Architecture overview.vsdx", 106, 460 * KB, LUCAS, 150, 25),
  file(1603, "Release notes.docx", 106, 41 * KB, LUCAS, 30, 7),

  // Board meetings
  file(1701, "Board charter.pdf", 107, 380 * KB, ALEX, 290, 120),
  file(1702, "Minutes - January.docx", 209, 33 * KB, SOFIA, 240, 230),
  file(1703, "Minutes - February.docx", 209, 31 * KB, SOFIA, 210, 200),

  // Press kit
  file(1801, "Brand guidelines.pdf", 108, 7.4 * MB, MARIA, 140, 20),
  file(1802, "Logo pack.zip", 108, 12 * MB, MARIA, 140, 60),
  file(1803, "Press release.docx", 108, 27 * KB, MARIA, 25, 20),

  // Vendor agreements
  file(1901, "Approved vendors.xlsx", 109, 52 * KB, SOFIA, 78, 9),
  file(1902, "Data processing addendum.pdf", 109, 420 * KB, JONAS, 60, 30),

  // Sales proposals
  file(2001, "Proposal - Contoso.pptx", 110, 3.9 * MB, KENJI, 60, 5),
  file(2002, "Pricing calculator.xlsx", 110, 88 * KB, KENJI, 65, 11),

  // Supplier registration
  file(2101, "Supplier registration form.pdf", 111, 185 * KB, AMARA, 25, 8, {
    isForm: true,
  }),

  // Office move 2024 (archived)
  file(2201, "Floor plan.pdf", 112, 2.2 * MB, ALEX, 480, 180),
];

// Ids for whatever the session creates, clear of the fixtures above.
let nextFolderId = 500;
let nextFileId = 5000;

export const findFolder = (id: number) => folders.find((f) => f.id === id);

export const addFolder = (
  title: string,
  parentId: number,
  roomType?: number,
): DemoFolder => {
  const parent = findFolder(parentId);
  const created: DemoFolder = {
    id: nextFolderId++,
    title,
    parentId,
    type: roomType ? ROOM_FOLDER_TYPE[roomType] : FolderType.DEFAULT,
    roomType,
    color: roomType ? "4781D1" : undefined,
    security: roomType
      ? ROOM_SECURITY
      : parent?.security === READ_ONLY_ROOT_SECURITY
        ? READ_ONLY_ROOT_SECURITY
        : FOLDER_SECURITY,
    author: DEMO_SELF,
    createdDays: 0,
    updatedDays: 0,
  };
  folders.push(created);
  return created;
};

export const addFile = (title: string, folderId: number, size: number) => {
  const created: DemoFile = {
    id: nextFileId++,
    title,
    folderId,
    size,
    author: DEMO_SELF,
    createdDays: 0,
    updatedDays: 0,
    updatedAt: new Date().toISOString(),
  };
  files.push(created);
  return created;
};

export const removeFile = (id: number) => {
  const index = files.findIndex((f) => f.id === id);
  if (index !== -1) files.splice(index, 1);
};

// --- Derived shapes -------------------------------------------------------

/** The folders from the section root down to `folder`, itself included. */
export const ancestry = (target: DemoFolder): DemoFolder[] => {
  const chain: DemoFolder[] = [];
  let current: DemoFolder | undefined = target;
  while (current) {
    chain.unshift(current);
    current = current.parentId ? findFolder(current.parentId) : undefined;
  }
  return chain;
};

const sectionOf = (target: DemoFolder) => ancestry(target)[0] ?? target;

/** The room `folder` sits in, or itself when it is one. */
export const roomOf = (target: DemoFolder) =>
  ancestry(target).find((f) => f.roomType !== undefined);

export const extensionOf = (title: string) => {
  const dot = title.lastIndexOf(".");
  return dot > 0 ? title.slice(dot).toLowerCase() : "";
};

const FILE_TYPES: Record<string, number> = {
  ".docx": FileType.Document,
  ".doc": FileType.Document,
  ".odt": FileType.Document,
  ".txt": FileType.Document,
  ".rtf": FileType.Document,
  ".xlsx": FileType.Spreadsheet,
  ".xls": FileType.Spreadsheet,
  ".ods": FileType.Spreadsheet,
  ".csv": FileType.Spreadsheet,
  ".pptx": FileType.Presentation,
  ".ppt": FileType.Presentation,
  ".odp": FileType.Presentation,
  ".pdf": FileType.Pdf,
  ".vsdx": FileType.Diagram,
  ".zip": FileType.Archive,
  ".rar": FileType.Archive,
  ".7z": FileType.Archive,
  ".png": FileType.Image,
  ".jpg": FileType.Image,
  ".jpeg": FileType.Image,
  ".gif": FileType.Image,
  ".svg": FileType.Image,
  ".webp": FileType.Image,
  ".mp4": FileType.Video,
  ".mov": FileType.Video,
  ".mp3": FileType.Audio,
  ".wav": FileType.Audio,
};

export const fileTypeOf = (title: string) =>
  FILE_TYPES[extensionOf(title)] ?? FileType.Unknown;

const humanSize = (bytes: number) => {
  if (bytes >= MB) return `${(bytes / MB).toFixed(1)} MB`;
  if (bytes >= KB) return `${(bytes / KB).toFixed(1)} KB`;
  return `${bytes} bytes`;
};

const dates = (entry: {
  createdDays: number;
  updatedDays: number;
  updatedAt?: string;
}) => ({
  created: entry.updatedAt ?? daysAgo(entry.createdDays, 9),
  updated: entry.updatedAt ?? daysAgo(entry.updatedDays, 16),
});

const entryCommon = (entry: DemoFolder | DemoFile, section: DemoFolder) => {
  const author = authorOf(entry.author);
  return {
    access: 0,
    shared: false,
    canShare: true,
    ...dates(entry),
    createdBy: author,
    updatedBy: author,
    rootFolderId: section.id,
    rootFolderType: section.type,
    providerItem: false,
    isFavorite: false,
  };
};

export const folderDto = (target: DemoFolder) => {
  const section = sectionOf(target);
  const parentRoom = roomOf(target);
  const isRoom = target.roomType !== undefined;
  return {
    ...entryCommon(target, section),
    id: target.id,
    title: target.title,
    parentId: target.parentId,
    type: target.type,
    filesCount: files.filter((f) => f.folderId === target.id).length,
    foldersCount: folders.filter((f) => f.parentId === target.id).length,
    security: target.security,
    shared: target.shared ?? false,
    fileEntryType: 1,
    new: 0,
    mute: false,
    pinned: target.pinned ?? false,
    private: false,
    isShareable: isRoom,
    inRoom: !!parentRoom,
    parentRoomType: parentRoom?.type,
    indexing: false,
    denyDownload: false,
    tags: [],
    ...(isRoom
      ? {
          roomType: target.roomType,
          // No pictures: the kit draws the room's initials on this colour.
          logo: {
            original: "",
            large: "",
            medium: "",
            small: "",
            color: target.color ?? "4781D1",
          },
          lifetime: target.lifetime
            ? { ...target.lifetime, deletePermanently: false, enabled: true }
            : null,
          quotaLimit: target.quotaLimit ?? -1,
          isCustomQuota: target.quotaLimit !== undefined,
          usedSpace: files
            .filter((f) => ancestry(folderOf(f)).includes(target))
            .reduce((sum, f) => sum + f.size, 0),
        }
      : {}),
  };
};

const folderOf = (entry: DemoFile) =>
  findFolder(entry.folderId) ?? (findFolder(MY_DOCUMENTS_ID) as DemoFolder);

export const fileDto = (entry: DemoFile) => {
  const parent = folderOf(entry);
  const section = sectionOf(parent);
  const fileExst = extensionOf(entry.title);
  const parentRoom = roomOf(parent);
  const viewUrl = `${DEMO_PORTAL_URL}/filehandler.ashx?action=view&fileid=${entry.id}`;
  return {
    ...entryCommon(entry, section),
    id: entry.id,
    title: entry.title,
    folderId: entry.folderId,
    version: 1,
    versionGroup: 1,
    contentLength: humanSize(entry.size),
    pureContentLength: Math.round(entry.size),
    fileStatus: 0,
    mute: false,
    viewUrl,
    webUrl: `${DEMO_PORTAL_URL}/doceditor?fileId=${entry.id}`,
    shortWebUrl: "",
    fileType: fileTypeOf(entry.title),
    fileExst,
    comment: "",
    encrypted: false,
    thumbnailUrl: "",
    thumbnailStatus: 0,
    locked: false,
    hasDraft: false,
    isForm: entry.isForm ?? false,
    customFilterEnabled: false,
    viewAccessibility: {},
    security: entry.isForm ? FORM_SECURITY : FILE_SECURITY,
    fileEntryType: 2,
    isFavorite: entry.isFavorite ?? false,
    parentRoomType: parentRoom?.type,
  };
};

/** Breadcrumbs as the portal sends them: section root down to `folder`. */
export const pathParts = (target: DemoFolder) =>
  ancestry(target).map((f) => ({
    id: f.id,
    title: f.title,
    folderType: f.type,
    ...(f.roomType !== undefined ? { roomType: f.roomType } : {}),
  }));

/** `files/settings`, trimmed to what the kit reads plus the usual neighbours. */
export const FILES_SETTINGS = {
  extsImagePreviewed: [".png", ".jpg", ".jpeg", ".gif", ".bmp", ".webp"],
  extsMediaPreviewed: [".mp4", ".mp3", ".wav", ".webm"],
  extsWebPreviewed: [".docx", ".xlsx", ".pptx", ".pdf", ".txt", ".vsdx"],
  extsWebEdited: [".docx", ".xlsx", ".pptx", ".pdf", ".txt", ".csv"],
  extsWebEncrypt: [".docx", ".xlsx", ".pptx"],
  extsWebReviewed: [".docx"],
  extsWebCustomFilterEditing: [".xlsx"],
  extsWebRestrictedEditing: [".docx", ".pdf"],
  extsWebCommented: [".docx", ".xlsx", ".pptx"],
  extsWebTemplate: [".dotx", ".xltx", ".potx"],
  extsMustConvert: [".doc", ".xls", ".ppt"],
  extsConvertible: {},
  extsUploadable: [],
  extsArchive: [".zip", ".rar", ".7z", ".tar", ".gz"],
  extsVideo: [".mp4", ".mov", ".webm", ".avi"],
  extsAudio: [".mp3", ".wav", ".ogg", ".m4a"],
  extsImage: [".png", ".jpg", ".jpeg", ".gif", ".bmp", ".svg", ".webp"],
  extsSpreadsheet: [".xlsx", ".xls", ".ods", ".csv"],
  extsPresentation: [".pptx", ".ppt", ".odp"],
  extsDocument: [".docx", ".doc", ".odt", ".txt", ".rtf"],
  extsDiagram: [".vsdx"],
  internalFormats: {
    Document: ".docx",
    Spreadsheet: ".xlsx",
    Presentation: ".pptx",
    Pdf: ".pdf",
  },
  masterFormExtension: ".pdf",
  confirmDelete: true,
  enableThirdParty: false,
  externalShare: true,
  externalShareSocialMedia: false,
  storeOriginalFiles: false,
  keepNewFileName: false,
  displayFileExtension: false,
  convertNotify: true,
  hideConfirmCancelOperation: false,
  hideConfirmConvertSave: false,
  hideConfirmConvertOpen: false,
  hideConfirmRoomLifetime: false,
  defaultOrder: { is_asc: false, property: "DateAndTime" },
  forcesave: false,
  storeForcesave: false,
  recentSection: true,
  favoritesSection: true,
  templatesSection: true,
  downloadTarGz: false,
  canSearchByContent: false,
  maxUploadThreadCount: 4,
  chunkUploadSize: 10 * MB,
  openEditorInSameTab: false,
};
