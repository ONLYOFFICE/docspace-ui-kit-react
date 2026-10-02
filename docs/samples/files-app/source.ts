import {
  type DeleteBatchRequestDto,
  type FileDtoInteger,
  type FolderContentDtoInteger,
  type FolderDtoInteger,
  FilterType,
  type OperationsApi,
  SearchArea,
  SortOrder,
} from "@onlyoffice/docspace-api-sdk";

import { FileType } from "../../../enums";
import type { TApiContext } from "../../../providers/api";

/**
 * What the Files app reads and writes, and the one shape both of its
 * back ends answer in.
 *
 * The screen never sees the SDK. It asks a `FilesSource` for a `Listing`
 * and tells it what to create, rename and remove; `portalSource` answers
 * with the portal behind `useApi()`, `demoSource` (in `demo.ts`) with a
 * tree in memory. Everything the screen needs to draw a row -- title, kind,
 * who changed it and when, size, where the portal opens it -- is on the
 * `Entry`, so the mapping from the wire happens exactly once, here.
 */

/** The three places the sidebar offers. */
export type Place = "rooms" | "documents" | "trash";

export type TypeFilter =
  "all" | "documents" | "spreadsheets" | "presentations" | "folders";

/** What is being asked for: a place, a folder in it, and how to narrow and order it. */
export type Query = {
  place: Place;
  /** A folder inside the place, or null for the place's own root. */
  folderId: number | null;
  search: string;
  type: TypeFilter;
  sortBy: "AZ" | "DateAndTime";
  ascending: boolean;
};

export type Entry = {
  id: number;
  title: string;
  kind: "room" | "folder" | "file";
  /** Extension with the dot for a file; empty otherwise. */
  fileExst: string;
  fileType: FileType;
  /** ISO date of the last change; empty when the portal gave none. */
  updated: string;
  /** Who made that change. */
  by: string;
  /** A file's size as the portal formats it; a folder's item count. */
  detail: string;
  /** Where the portal opens a file; empty for folders and in demo. */
  webUrl: string;
  /** A room's colour, as the portal keeps it: six hex digits without the hash. */
  color: string;
};

/** One ancestor in the breadcrumb. */
export type Crumb = {
  id: number;
  title: string;
  /** The place's own root: Rooms, My documents, Trash. */
  isRoot: boolean;
  /** The room the current folder lives in. */
  isRootRoom: boolean;
};

export type Listing = {
  current: { id: number; title: string; isRoom: boolean };
  /** Whether folders and files can be made here: never at the Rooms root or in Trash. */
  canCreate: boolean;
  /** The ancestors, nearest first, the place's root last. Empty at a root. */
  crumbs: Crumb[];
  entries: Entry[];
  /** How many there are in all; more than `entries` when a page was cut. */
  total: number;
};

export type FilesSource = {
  list: (query: Query) => Promise<Listing>;
  createFolder: (parentId: number, title: string) => Promise<void>;
  /** An office document made by the document server; the extension picks the kind. */
  createDocument: (parentId: number, title: string) => Promise<void>;
  rename: (entry: Entry, title: string) => Promise<void>;
  /** To Trash, or gone for good when `forever` -- which is what Trash itself offers. */
  remove: (entries: Entry[], forever: boolean) => Promise<void>;
};

export const PLACE_TITLES: Record<Place, string> = {
  rooms: "Rooms",
  documents: "My documents",
  trash: "Trash",
};

const FILE_TYPE_BY_EXST: Record<string, FileType> = {
  ".docx": FileType.Document,
  ".doc": FileType.Document,
  ".odt": FileType.Document,
  ".txt": FileType.Document,
  ".xlsx": FileType.Spreadsheet,
  ".xls": FileType.Spreadsheet,
  ".csv": FileType.Spreadsheet,
  ".pptx": FileType.Presentation,
  ".ppt": FileType.Presentation,
  ".pdf": FileType.PDF,
  ".png": FileType.Image,
  ".jpg": FileType.Image,
  ".jpeg": FileType.Image,
  ".gif": FileType.Image,
  ".zip": FileType.Archive,
  ".mp4": FileType.Video,
};

export const extensionOf = (title: string) => {
  const dot = title.lastIndexOf(".");
  return dot > 0 ? title.slice(dot).toLowerCase() : "";
};

export const fileTypeOf = (fileExst: string) =>
  FILE_TYPE_BY_EXST[fileExst] ?? FileType.Unknown;

/** Whether an entry passes the Type filter; the demo and the Rooms root apply it by hand. */
export const matchesType = (entry: Entry, type: TypeFilter) => {
  switch (type) {
    case "all":
      return true;
    case "folders":
      return entry.kind !== "file";
    case "documents":
      return entry.fileType === FileType.Document;
    case "spreadsheets":
      return entry.fileType === FileType.Spreadsheet;
    case "presentations":
      return entry.fileType === FileType.Presentation;
  }
};

/** Sorts folders before files, then by the query's field and direction. */
export const sortEntries = (entries: Entry[], query: Query) => {
  const sign = query.ascending ? 1 : -1;
  const rank = (entry: Entry) => (entry.kind === "file" ? 1 : 0);
  return [...entries].sort((a, b) => {
    if (rank(a) !== rank(b)) return rank(a) - rank(b);
    if (query.sortBy === "DateAndTime" && a.updated !== b.updated) {
      return sign * a.updated.localeCompare(b.updated);
    }
    return sign * a.title.localeCompare(b.title);
  });
};

/** `updated` is typed as an object and arrives as a string; take either. */
const whenOf = (value: unknown): string =>
  typeof value === "string"
    ? value
    : ((value as { utcTime?: string } | undefined)?.utcTime ?? "");

const authorOf = (entry: FolderDtoInteger | FileDtoInteger) =>
  entry.updatedBy?.displayName ?? entry.createdBy?.displayName ?? "";

/** The wire's `pathParts`, typed `any` by the SDK: `{ id, title, roomType? }` per level. */
type PathPart = { id?: number; title?: string; roomType?: number | null };

const isRoomDto = (folder: FolderDtoInteger | PathPart) =>
  folder.roomType !== undefined && folder.roomType !== null;

const PAGE = 100;

const API_FILTER: Record<TypeFilter, FilterType | undefined> = {
  all: undefined,
  documents: FilterType.DocumentsOnly,
  spreadsheets: FilterType.SpreadsheetsOnly,
  presentations: FilterType.PresentationsOnly,
  folders: FilterType.FoldersOnly,
};

/** Waits for the portal's file operations -- deletes run in the background -- to finish. */
const settled = async (operationsApi: OperationsApi) => {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const operations =
      (await operationsApi.getOperationStatuses()).data.response ?? [];
    if (operations.every((operation) => operation.finished)) return;
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
};

/** The portal behind `useApi()`, whoever the nearest provider speaks for. */
export const portalSource = (
  api: Pick<
    TApiContext,
    "roomsApi" | "foldersApi" | "filesApi" | "operationsApi"
  >,
): FilesSource => {
  const fetch = async (query: Query) => {
    const paging = {
      count: PAGE,
      filterValue: query.search || undefined,
      sortBy: query.sortBy,
      sortOrder: query.ascending ? SortOrder.Ascending : SortOrder.Descending,
    };
    const filtered = { ...paging, filterType: API_FILTER[query.type] };

    if (query.folderId !== null) {
      return api.foldersApi.getFolderByFolderId({
        folderId: query.folderId,
        ...filtered,
      });
    }
    if (query.place === "rooms") {
      return api.roomsApi.getRoomsFolder({
        searchArea: SearchArea.Active,
        ...paging,
      });
    }
    if (query.place === "documents") {
      return api.foldersApi.getMyFolder(filtered);
    }
    return api.foldersApi.getTrashFolder(filtered);
  };

  const toListing = (
    content: FolderContentDtoInteger | undefined,
    query: Query,
  ): Listing => {
    const current = content?.current;
    // The wire carries full DTOs where the SDK types promise only the base.
    const folders = (content?.folders ?? []) as FolderDtoInteger[];
    const files = (content?.files ?? []) as FileDtoInteger[];
    const parts = (
      Array.isArray(content?.pathParts) ? content.pathParts : []
    ) as PathPart[];

    const crumbs: Crumb[] = parts
      .slice(0, -1)
      .reverse()
      .map((part, index, all) => ({
        id: part.id ?? 0,
        title: part.title ?? "",
        isRoot: index === all.length - 1,
        isRootRoom: isRoomDto(part),
      }));

    let entries: Entry[] = [
      ...folders.map((folder): Entry => ({
        id: folder.id ?? 0,
        title: folder.title ?? "",
        kind: isRoomDto(folder) ? "room" : "folder",
        fileExst: "",
        fileType: FileType.Unknown,
        updated: whenOf(folder.updated),
        by: authorOf(folder),
        detail: `${folder.filesCount ?? 0} files`,
        webUrl: "",
        color: folder.logo?.color ?? "",
      })),
      ...files.map((file): Entry => ({
        id: file.id ?? 0,
        title: file.title ?? "",
        kind: "file",
        fileExst: file.fileExst ?? extensionOf(file.title ?? ""),
        fileType: (file.fileType ?? FileType.Unknown) as FileType,
        updated: whenOf(file.updated),
        by: authorOf(file),
        detail: file.contentLength ?? "",
        webUrl: file.webUrl ?? "",
        color: "",
      })),
    ];

    // The rooms list takes no type filter, so the page is narrowed here.
    const atRoomsRoot = query.place === "rooms" && query.folderId === null;
    if (atRoomsRoot) {
      entries = entries.filter((entry) => matchesType(entry, query.type));
    }

    return {
      current: {
        id: current?.id ?? 0,
        title: current?.title ?? PLACE_TITLES[query.place],
        isRoom: current ? isRoomDto(current) : false,
      },
      canCreate: query.place !== "trash" && !atRoomsRoot,
      crumbs,
      entries,
      total:
        atRoomsRoot && query.type !== "all"
          ? entries.length
          : (content?.total ?? entries.length),
    };
  };

  return {
    list: async (query) => toListing((await fetch(query)).data.response, query),

    createFolder: async (parentId, title) => {
      await api.foldersApi.createFolder({
        folderId: parentId,
        createFolder: { title },
      });
    },

    createDocument: async (parentId, title) => {
      await api.filesApi.createFile({
        folderId: parentId,
        createFileJsonElement: { title },
      });
    },

    rename: async (entry, title) => {
      if (entry.kind === "file") {
        await api.filesApi.updateFile({
          fileId: entry.id,
          updateFile: { title },
        });
      } else {
        await api.foldersApi.renameFolder({
          folderId: entry.id,
          createFolder: { title },
        });
      }
    },

    remove: async (entries, forever) => {
      // Rooms are not deleted from here: the portal archives them first.
      const request: DeleteBatchRequestDto = {
        folderIds: entries
          .filter((entry) => entry.kind === "folder")
          .map((entry) => entry.id),
        fileIds: entries
          .filter((entry) => entry.kind === "file")
          .map((entry) => entry.id),
        deleteAfter: false,
        immediately: forever,
      };
      await api.operationsApi.deleteBatchItems({
        deleteBatchRequestDto: request,
      });
      await settled(api.operationsApi);
    },
  };
};
