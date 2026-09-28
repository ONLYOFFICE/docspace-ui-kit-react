import {
  type FileDtoInteger,
  type FolderContentDtoInteger,
  type FolderDtoInteger,
  FilterType,
  FolderType,
  RoomType,
  SearchArea,
  SortOrder,
  SubjectFilter,
} from "@onlyoffice/docspace-api-sdk";

import { FileType } from "../../enums";
import type { TApiContext } from "../../providers/api";

/**
 * What the three section stories read, and the one shape both of their back
 * ends answer in.
 *
 * Files, Rooms and Forms are the portal's three top-level lists. Each is a
 * search box, a sort order and a filter over one listing, and a folder or a
 * room in it opens in place -- with nothing to create, rename or remove, so
 * a source here only lists. `portalSource` answers from the portal behind
 * `useApi()`, `demoSource` (in `demo.ts`) from memory, and the screen never
 * learns which.
 */

export type SectionKind = "files" | "rooms" | "forms";

/** A filter the section offers, keyed by the value the chip carries. */
export type SectionFilter =
  { group: "type"; key: TypeKey } | { group: "owner"; key: "me" };

export type TypeKey =
  | "folders"
  | "documents"
  | "spreadsheets"
  | "presentations"
  | "pdf"
  | "collaboration"
  | "public"
  | "custom"
  | "vdr";

export type SortKey = "AZ" | "DateAndTime";

export type SectionQuery = {
  /** A folder or room opened inside the section, or null for its own list. */
  folderId: number | null;
  search: string;
  filters: SectionFilter[];
  sortBy: SortKey;
  ascending: boolean;
};

export type SectionItem = {
  id: number;
  title: string;
  kind: "folder" | "file" | "room";
  /** Extension with the dot for a file; empty otherwise. */
  fileExst: string;
  fileType: FileType;
  /** A room's type as the SDK spells it; undefined for files and folders. */
  roomType?: RoomType;
  /** ISO date of the last change; empty when the portal gave none. */
  updated: string;
  /** Who owns a room, or who last changed a file. */
  by: string;
  /** A file's size as the portal formats it; a room's or folder's item count. */
  detail: string;
  /** A room's colour, six hex digits without the hash. */
  color: string;
  /**
   * A folder's own type, as the portal sends it in `type`: it tells a form
   * room's Complete and In process folders from a plain one. Undefined for
   * files, rooms, and a folder with nothing special about it.
   */
  folderType?: FolderType;
  /** Where the portal opens a file, relative to it; empty for folders and in demo. */
  webUrl: string;
};

/** One ancestor in the breadcrumb. */
export type SectionCrumb = {
  id: number;
  title: string;
  /** The section's own list: going there is `folderId: null`. */
  isRoot: boolean;
  /** A room, which the breadcrumb draws with the room's mark. */
  isRootRoom: boolean;
};

export type SectionListing = {
  /** What is open: the section itself, or a folder or room in it. */
  current: { id: number | null; title: string; isRoom: boolean };
  /** The ancestors, nearest first, the section last. Empty at the section. */
  crumbs: SectionCrumb[];
  items: SectionItem[];
  /** How many there are in all; more than `items` when a page was cut. */
  total: number;
};

export type SectionSource = {
  list: (query: SectionQuery) => Promise<SectionListing>;
};

export const SECTION_TITLES: Record<SectionKind, string> = {
  // The section's name, as the portal's sidebar has it; the list itself is
  // the caller's My documents folder.
  files: "Files",
  rooms: "Rooms",
  forms: "Forms",
};

type FilterOption = { key: TypeKey | "me"; label: string };
export type FilterGroup = {
  group: SectionFilter["group"];
  label: string;
  options: FilterOption[];
};

const FILE_TYPE_GROUP: FilterGroup = {
  group: "type",
  label: "Type",
  options: [
    { key: "folders", label: "Folders" },
    { key: "documents", label: "Documents" },
    { key: "spreadsheets", label: "Spreadsheets" },
    { key: "presentations", label: "Presentations" },
    { key: "pdf", label: "PDF" },
  ],
};

const OWNER_GROUP: FilterGroup = {
  group: "owner",
  label: "Owner",
  options: [{ key: "me", label: "Me" }],
};

/**
 * What each section's own list offers -- the same split the portal makes.
 * Forms is already scoped to form-filling rooms, so, as in the portal, it
 * has no room-type group; Files has no owner, since My documents is one
 * person's.
 */
export const FILTER_GROUPS: Record<SectionKind, FilterGroup[]> = {
  files: [FILE_TYPE_GROUP],
  rooms: [
    {
      group: "type",
      label: "Room type",
      options: [
        { key: "collaboration", label: "Collaboration" },
        { key: "public", label: "Public" },
        { key: "custom", label: "Custom" },
        { key: "vdr", label: "Virtual data room" },
      ],
    },
    OWNER_GROUP,
  ],
  forms: [OWNER_GROUP],
};

/**
 * Inside a folder or a room every section lists folders and files, so the
 * filter becomes the file-type one, as the portal's does once a room is open.
 */
export const filterGroupsFor = (
  kind: SectionKind,
  folderId: number | null,
): FilterGroup[] =>
  folderId === null ? FILTER_GROUPS[kind] : [FILE_TYPE_GROUP];

/** The picked type, if any; a section carries at most one per group. */
const typeOf = (query: SectionQuery) =>
  query.filters.find((filter) => filter.group === "type")?.key as
    TypeKey | undefined;

const ownedByMe = (query: SectionQuery) =>
  query.filters.some((filter) => filter.group === "owner");

export const FILE_FILTER: Partial<Record<TypeKey, FilterType>> = {
  folders: FilterType.FoldersOnly,
  documents: FilterType.DocumentsOnly,
  spreadsheets: FilterType.SpreadsheetsOnly,
  presentations: FilterType.PresentationsOnly,
  pdf: FilterType.Pdf,
};

export const ROOM_FILTER: Partial<Record<TypeKey, RoomType>> = {
  collaboration: RoomType.EditingRoom,
  public: RoomType.PublicRoom,
  custom: RoomType.CustomRoom,
  vdr: RoomType.VirtualDataRoom,
};

/**
 * The Forms section's search area. The server splits rooms between the two
 * sections by it -- `Active` never returns a form-filling room, `Forms`
 * returns nothing else -- and reads it by name from the query string
 * (`SearchArea.cs` in ASC.Files). The SDK's `SearchArea` predates the split
 * and stops at `AiAgents`, hence the cast.
 */
const FORMS_SEARCH_AREA = "Forms" as unknown as SearchArea;

const FILE_TYPE_BY_EXST: Record<string, FileType> = {
  ".docx": FileType.Document,
  ".xlsx": FileType.Spreadsheet,
  ".pptx": FileType.Presentation,
  ".pdf": FileType.PDF,
  ".png": FileType.Image,
};

/**
 * Which of a form room's two submission folders a folder is, if either.
 * The SDK names each twice -- `ReadyFormFolder` / `FormFillingFolderDone`,
 * `InProcessFormFolder` / `FormFillingFolderInProgress` -- and both pairs are
 * accepted rather than guessing which one a given portal sends.
 */
export const formFolderOf = (item: SectionItem): "done" | "progress" | null => {
  switch (item.folderType) {
    case FolderType.ReadyFormFolder:
    case FolderType.FormFillingFolderDone:
      return "done";
    case FolderType.InProcessFormFolder:
    case FolderType.FormFillingFolderInProgress:
      return "progress";
    default:
      return null;
  }
};

/** "1 item", "2 items": what a folder or room row says about its contents. */
export const itemCount = (count: number) =>
  `${count} ${count === 1 ? "item" : "items"}`;

export const extensionOf = (title: string) => {
  const dot = title.lastIndexOf(".");
  return dot > 0 ? title.slice(dot).toLowerCase() : "";
};

export const fileTypeOf = (fileExst: string) =>
  FILE_TYPE_BY_EXST[fileExst] ?? FileType.Unknown;

/** Whether an item passes the query's filters; the demo applies them by hand. */
export const matchesQuery = (
  item: SectionItem,
  query: SectionQuery,
  me: string,
) => {
  const needle = query.search.trim().toLowerCase();
  if (needle && !item.title.toLowerCase().includes(needle)) return false;
  if (ownedByMe(query) && item.by !== me) return false;

  const type = typeOf(query);
  if (!type) return true;
  if (item.kind === "room") return item.roomType === ROOM_FILTER[type];
  if (type === "folders") return item.kind === "folder";
  const wanted: Partial<Record<TypeKey, FileType>> = {
    documents: FileType.Document,
    spreadsheets: FileType.Spreadsheet,
    presentations: FileType.Presentation,
    pdf: FileType.PDF,
  };
  return item.kind === "file" && item.fileType === wanted[type];
};

/** Folders before files, then by the query's field and direction. */
export const sortItems = (items: SectionItem[], query: SectionQuery) => {
  const sign = query.ascending ? 1 : -1;
  const rank = (item: SectionItem) => (item.kind === "file" ? 1 : 0);
  return [...items].sort((a, b) => {
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

/** The wire's `pathParts`, typed `any` by the SDK: `{ id, title, roomType? }` per level. */
type PathPart = { id?: number; title?: string; roomType?: number | null };

const isRoomDto = (folder: { roomType?: unknown }) =>
  folder.roomType !== undefined && folder.roomType !== null;

const PAGE = 100;

/** The wire carries full DTOs where the SDK types promise only the base. */
export const toListing = (
  content: FolderContentDtoInteger | undefined,
  kind: SectionKind,
  folderId: number | null,
): SectionListing => {
  const folders = (content?.folders ?? []) as FolderDtoInteger[];
  const files = (content?.files ?? []) as FileDtoInteger[];

  const items: SectionItem[] = [
    ...folders.map((folder): SectionItem => {
      const isRoom = isRoomDto(folder);
      return {
        id: folder.id ?? 0,
        title: folder.title ?? "",
        kind: isRoom ? "room" : "folder",
        fileExst: "",
        fileType: FileType.Unknown,
        roomType: isRoom ? (folder.roomType as RoomType) : undefined,
        updated: whenOf(folder.updated),
        by: isRoom
          ? (folder.createdBy?.displayName ?? "")
          : (folder.updatedBy?.displayName ??
            folder.createdBy?.displayName ??
            ""),
        detail: itemCount(
          (folder.filesCount ?? 0) + (folder.foldersCount ?? 0),
        ),
        color: folder.logo?.color ?? "",
        webUrl: "",
        folderType: isRoom ? undefined : (folder.type ?? undefined),
      };
    }),
    ...files.map((file): SectionItem => ({
      id: file.id ?? 0,
      title: file.title ?? "",
      kind: "file",
      fileExst: file.fileExst ?? extensionOf(file.title ?? ""),
      fileType: (file.fileType ?? FileType.Unknown) as FileType,
      updated: whenOf(file.updated),
      by: file.updatedBy?.displayName ?? file.createdBy?.displayName ?? "",
      detail: file.contentLength ?? "",
      color: "",
      webUrl: file.webUrl ?? "",
    })),
  ];

  if (folderId === null) {
    return {
      current: { id: null, title: SECTION_TITLES[kind], isRoom: false },
      crumbs: [],
      items,
      total: content?.total ?? items.length,
    };
  }

  // `pathParts` runs from the portal's root to the open folder. Without the
  // open folder and reversed it is the breadcrumb; its root is the section,
  // named the way the story names it rather than the way the portal does.
  const parts = (
    Array.isArray(content?.pathParts) ? content.pathParts : []
  ) as PathPart[];
  const crumbs = parts
    .slice(0, -1)
    .reverse()
    .map((part, index, all): SectionCrumb => {
      const isRoot = index === all.length - 1;
      return {
        id: part.id ?? 0,
        title: isRoot ? SECTION_TITLES[kind] : (part.title ?? ""),
        isRoot,
        isRootRoom: isRoomDto(part),
      };
    });

  const current = content?.current;
  return {
    current: {
      id: current?.id ?? folderId,
      title: current?.title ?? "",
      isRoom: current ? isRoomDto(current) : false,
    },
    crumbs,
    items,
    total: content?.total ?? items.length,
  };
};

/**
 * The portal behind `useApi()`, whoever the nearest provider speaks for.
 *
 * Every filter goes to the server rather than being applied to a page:
 * `filterType` for My documents and inside a folder or room, `type` for the
 * rooms list, `subjectId` with `SubjectFilter.Owner` for "Owner: Me", which
 * needs the caller's own id and asks for it once.
 */
export const portalSource = (
  api: Pick<TApiContext, "roomsApi" | "foldersApi" | "profilesApi">,
  kind: SectionKind,
): SectionSource => {
  let me: Promise<string | undefined> | null = null;
  const myId = () => {
    me ??= api.profilesApi
      .getSelfProfile()
      .then((response) => response.data.response?.id);
    return me;
  };

  const fetch = async (query: SectionQuery) => {
    const paging = {
      count: PAGE,
      filterValue: query.search.trim() || undefined,
      sortBy: query.sortBy,
      sortOrder: query.ascending ? SortOrder.Ascending : SortOrder.Descending,
    };
    const type = typeOf(query);
    const filterType = type ? FILE_FILTER[type] : undefined;

    if (query.folderId !== null) {
      return api.foldersApi.getFolderByFolderId({
        folderId: query.folderId,
        ...paging,
        filterType,
      });
    }

    if (kind === "files") {
      return api.foldersApi.getMyFolder({ ...paging, filterType });
    }

    const roomType = type ? ROOM_FILTER[type] : undefined;
    const owner = ownedByMe(query)
      ? { subjectId: await myId(), subjectFilter: SubjectFilter.Owner }
      : {};

    return api.roomsApi.getRoomsFolder({
      ...paging,
      ...owner,
      searchArea: kind === "forms" ? FORMS_SEARCH_AREA : SearchArea.Active,
      type: roomType !== undefined ? [roomType] : undefined,
    });
  };

  return {
    list: async (query) =>
      toListing((await fetch(query)).data.response, kind, query.folderId),
  };
};
