import { FileType } from "../../../enums";
import {
  type Entry,
  extensionOf,
  type FilesSource,
  fileTypeOf,
  type Listing,
  matchesType,
  PLACE_TITLES,
  type Place,
  type Query,
  sortEntries,
} from "./source";

/**
 * The same `FilesSource`, answered from memory, for a page opened with no
 * portal behind it. Three rooms, a personal folder, a trash: enough to try
 * every control on the screen. It forgets everything on reload.
 */

/** The three roots. Rooms has no folder of its own, so its id is never an entry's. */
const ROOMS = 0;
const DOCS = 1;
const TRASH = 2;

type Node = Entry & { parentId: number };

const DAY = 864e5;
const ago = (days: number) =>
  new Date(Date.parse("2026-09-28T09:00:00Z") - days * DAY).toISOString();

const node = (
  id: number,
  parentId: number,
  title: string,
  kind: Node["kind"],
  days: number,
  by: string,
  detail = "",
  color = "",
): Node => {
  const fileExst = kind === "file" ? extensionOf(title) : "";
  return {
    id,
    parentId,
    title,
    kind,
    fileExst,
    fileType: kind === "file" ? fileTypeOf(fileExst) : FileType.Unknown,
    updated: ago(days),
    by,
    detail,
    webUrl: "",
    color,
  };
};

const seed = (): Node[] => [
  node(1, ROOMS, PLACE_TITLES.documents, "folder", 0, ""),
  node(2, ROOMS, PLACE_TITLES.trash, "folder", 0, ""),
  node(
    10,
    ROOMS,
    "Finance department",
    "room",
    1,
    "Anna Petrova",
    "",
    "4781D1",
  ),
  node(11, ROOMS, "Marketing", "room", 4, "Ivan Sokolov", "", "F2A93B"),
  node(12, ROOMS, "Board papers", "room", 12, "Elena Volkova", "", "6D4EC2"),
  node(100, 10, "Reports 2026", "folder", 2, "Anna Petrova"),
  node(101, 10, "Invoices", "folder", 6, "Maria Ivanova"),
  node(102, 10, "Q4 budget.xlsx", "file", 1, "Ivan Sokolov", "846 KB"),
  node(103, 10, "Annual report 2025.docx", "file", 3, "Anna Petrova", "2.4 MB"),
  node(104, 10, "Team presentation.pptx", "file", 5, "Maria Ivanova", "5.1 MB"),
  node(110, 100, "Budget overview.xlsx", "file", 2, "Anna Petrova", "312 KB"),
  node(111, 100, "Board summary.pdf", "file", 2, "Anna Petrova", "1.1 MB"),
  node(120, 101, "Invoice 2026-041.pdf", "file", 6, "Maria Ivanova", "98 KB"),
  node(130, 11, "Campaign plan.docx", "file", 4, "Ivan Sokolov", "640 KB"),
  node(131, 11, "Logo drafts.png", "file", 9, "Ivan Sokolov", "3.2 MB"),
  node(140, 12, "Minutes 2026-09.docx", "file", 12, "Elena Volkova", "210 KB"),
  node(200, DOCS, "Templates", "folder", 8, "You"),
  node(201, DOCS, "Notes.docx", "file", 0, "You", "24 KB"),
  node(202, DOCS, "Contract draft.docx", "file", 7, "You", "180 KB"),
  node(203, DOCS, "Holiday photo.png", "file", 20, "You", "3.7 MB"),
  node(210, 200, "Letter.docx", "file", 8, "You", "31 KB"),
  node(300, TRASH, "Old logo.png", "file", 15, "Ivan Sokolov", "1.9 MB"),
];

const rootOf = (place: Place) =>
  place === "documents" ? DOCS : place === "trash" ? TRASH : ROOMS;

export type DemoSource = FilesSource & {
  /** What the drop zone hands over; the uploader would have sent it to the portal. */
  addFiles: (parentId: number, files: File[]) => void;
};

export const demoSource = (): DemoSource => {
  const nodes = new Map(seed().map((entry) => [entry.id, entry]));
  let nextId = 1000;

  const childrenOf = (parentId: number) =>
    [...nodes.values()].filter((entry) => entry.parentId === parentId);

  const withCount = (entry: Node): Entry =>
    entry.kind === "file"
      ? entry
      : { ...entry, detail: `${childrenOf(entry.id).length} items` };

  const crumbsOf = (id: number, place: Place): Listing["crumbs"] => {
    const crumbs: Listing["crumbs"] = [];
    let current = nodes.get(id);
    while (current && current.parentId !== ROOMS) {
      const parent = nodes.get(current.parentId);
      if (!parent) break;
      crumbs.push({
        id: parent.id,
        title: parent.title,
        isRoot: parent.id === rootOf(place),
        isRootRoom: parent.kind === "room",
      });
      current = parent;
    }
    if (place === "rooms" && id !== ROOMS) {
      crumbs.push({
        id: ROOMS,
        title: PLACE_TITLES.rooms,
        isRoot: true,
        isRootRoom: false,
      });
    }
    return crumbs;
  };

  const list: FilesSource["list"] = async (query) => {
    const id = query.folderId ?? rootOf(query.place);
    const folder = nodes.get(id);
    const needle = query.search.trim().toLowerCase();
    const entries = sortEntries(
      childrenOf(id)
        .filter((entry) => entry.parentId !== ROOMS || entry.kind === "room")
        .filter((entry) => matchesType(entry, query.type))
        .filter(
          (entry) => !needle || entry.title.toLowerCase().includes(needle),
        )
        .map(withCount),
      query,
    );

    return {
      current: {
        id,
        title: folder?.title ?? PLACE_TITLES[query.place],
        isRoom: folder?.kind === "room",
      },
      canCreate: query.place !== "trash" && id !== ROOMS,
      crumbs: crumbsOf(id, query.place),
      entries,
      total: entries.length,
    };
  };

  const add = (parentId: number, title: string, kind: Node["kind"]) => {
    nextId += 1;
    nodes.set(nextId, node(nextId, parentId, title, kind, 0, "You"));
  };

  return {
    list,

    createFolder: async (parentId, title) => add(parentId, title, "folder"),

    createDocument: async (parentId, title) => add(parentId, title, "file"),

    rename: async (entry, title) => {
      const current = nodes.get(entry.id);
      if (current) nodes.set(entry.id, { ...current, title });
    },

    remove: async (entries, forever) => {
      for (const entry of entries) {
        const current = nodes.get(entry.id);
        if (!current) continue;
        if (forever) {
          nodes.delete(entry.id);
        } else {
          nodes.set(entry.id, { ...current, parentId: TRASH, updated: ago(0) });
        }
      }
    },

    addFiles: (parentId, files) => {
      for (const file of files) {
        nextId += 1;
        nodes.set(
          nextId,
          node(
            nextId,
            parentId,
            file.name,
            "file",
            0,
            "You",
            `${Math.max(1, Math.round(file.size / 1024))} KB`,
          ),
        );
      }
    },
  };
};
