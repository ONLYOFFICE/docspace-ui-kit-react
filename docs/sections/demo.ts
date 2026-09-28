import { FolderType, RoomType } from "@onlyoffice/docspace-api-sdk";

import { FileType } from "../../enums";
import {
  extensionOf,
  fileTypeOf,
  itemCount,
  matchesQuery,
  SECTION_TITLES,
  type SectionCrumb,
  type SectionItem,
  type SectionKind,
  type SectionSource,
  sortItems,
} from "./source";

/**
 * The same `SectionSource`, answered from memory, for a story opened with no
 * portal behind it -- CI, the published Storybook, anyone who has not
 * connected one in the API Config toolbar. One small tree per section, deep
 * enough to open a room, then a folder in it, and come back by the
 * breadcrumb; every filter, the search box and both sort orders have
 * something to narrow at each level.
 */

/** Who "Owner: Me" means here. */
export const DEMO_ME = "You";

/** The three sections' own lists. Never an entry's id. */
export const DEMO_ROOTS: Record<SectionKind, number> = {
  files: -1,
  rooms: -2,
  forms: -3,
};

type Node = SectionItem & { parentId: number };

const DAY = 864e5;
const ago = (days: number) =>
  new Date(Date.parse("2026-09-28T09:00:00Z") - days * DAY).toISOString();

const base = {
  fileExst: "",
  fileType: FileType.Unknown,
  color: "",
  webUrl: "",
};

const file = (
  id: number,
  parentId: number,
  title: string,
  days: number,
  by: string,
  detail: string,
): Node => {
  const fileExst = extensionOf(title);
  return {
    ...base,
    id,
    parentId,
    title,
    kind: "file",
    fileExst,
    fileType: fileTypeOf(fileExst),
    updated: ago(days),
    by,
    detail,
  };
};

const folder = (
  id: number,
  parentId: number,
  title: string,
  days: number,
  by: string,
  folderType?: FolderType,
): Node => ({
  ...base,
  id,
  parentId,
  title,
  kind: "folder",
  updated: ago(days),
  by,
  detail: "",
  folderType,
});

const room = (
  id: number,
  parentId: number,
  title: string,
  roomType: RoomType,
  days: number,
  by: string,
  color: string,
): Node => ({
  ...base,
  id,
  parentId,
  title,
  kind: "room",
  roomType,
  updated: ago(days),
  by,
  detail: "",
  color,
});

const { files: FILES, rooms: ROOMS, forms: FORMS } = DEMO_ROOTS;

const seed = (): Node[] => [
  // My documents
  folder(1, FILES, "Templates", 8, DEMO_ME),
  folder(2, FILES, "Travel", 21, DEMO_ME),
  file(10, FILES, "Notes.docx", 0, DEMO_ME, "24 KB"),
  file(11, FILES, "Contract draft.docx", 7, DEMO_ME, "180 KB"),
  file(12, FILES, "Household budget.xlsx", 2, DEMO_ME, "96 KB"),
  file(13, FILES, "Conference talk.pptx", 11, DEMO_ME, "4.8 MB"),
  file(14, FILES, "Tax return 2025.pdf", 30, DEMO_ME, "1.3 MB"),
  file(15, FILES, "Holiday photo.png", 20, DEMO_ME, "3.7 MB"),
  file(20, 1, "Letter.docx", 8, DEMO_ME, "31 KB"),
  file(21, 1, "Invoice template.xlsx", 9, DEMO_ME, "44 KB"),
  file(22, 2, "Itinerary.pdf", 21, DEMO_ME, "220 KB"),
  file(23, 2, "Beach.png", 22, DEMO_ME, "2.9 MB"),

  // Rooms
  room(
    100,
    ROOMS,
    "Finance department",
    RoomType.EditingRoom,
    1,
    "Anna Petrova",
    "4781D1",
  ),
  room(101, ROOMS, "Marketing", RoomType.CustomRoom, 4, DEMO_ME, "F2A93B"),
  room(
    102,
    ROOMS,
    "Press kit",
    RoomType.PublicRoom,
    6,
    "Ivan Sokolov",
    "3B9E4F",
  ),
  room(
    103,
    ROOMS,
    "Board papers",
    RoomType.VirtualDataRoom,
    12,
    "Elena Volkova",
    "6D4EC2",
  ),
  room(
    104,
    ROOMS,
    "Product launch",
    RoomType.EditingRoom,
    2,
    DEMO_ME,
    "D94F70",
  ),
  room(
    105,
    ROOMS,
    "Partner portal",
    RoomType.PublicRoom,
    18,
    DEMO_ME,
    "2A9DA8",
  ),
  folder(110, 100, "Reports 2026", 2, "Anna Petrova"),
  folder(111, 100, "Invoices", 6, "Maria Ivanova"),
  file(112, 100, "Q4 budget.xlsx", 1, "Ivan Sokolov", "846 KB"),
  file(113, 100, "Annual report 2025.docx", 3, "Anna Petrova", "2.4 MB"),
  file(114, 110, "Budget overview.xlsx", 2, "Anna Petrova", "312 KB"),
  file(115, 110, "Board summary.pdf", 2, "Anna Petrova", "1.1 MB"),
  file(116, 111, "Invoice 2026-041.pdf", 6, "Maria Ivanova", "98 KB"),
  file(120, 101, "Campaign plan.docx", 4, DEMO_ME, "640 KB"),
  file(121, 101, "Logo drafts.png", 9, "Ivan Sokolov", "3.2 MB"),
  file(130, 102, "Press release.docx", 6, "Ivan Sokolov", "88 KB"),
  file(131, 102, "Brand book.pdf", 7, "Ivan Sokolov", "12.4 MB"),
  folder(140, 103, "Due diligence", 12, "Elena Volkova"),
  file(141, 103, "Minutes 2026-09.docx", 12, "Elena Volkova", "210 KB"),
  file(142, 140, "Financial statements.xlsx", 13, "Elena Volkova", "1.8 MB"),
  file(150, 104, "Launch deck.pptx", 2, DEMO_ME, "9.6 MB"),
  file(151, 104, "Timeline.xlsx", 3, DEMO_ME, "58 KB"),

  // Forms
  room(
    200,
    FORMS,
    "Job applications",
    RoomType.FillingFormsRoom,
    1,
    DEMO_ME,
    "4781D1",
  ),
  room(
    201,
    FORMS,
    "Vacation requests",
    RoomType.FillingFormsRoom,
    3,
    "Maria Ivanova",
    "F2A93B",
  ),
  room(
    202,
    FORMS,
    "Customer survey",
    RoomType.FillingFormsRoom,
    9,
    DEMO_ME,
    "3B9E4F",
  ),
  room(
    203,
    FORMS,
    "Expense reports",
    RoomType.FillingFormsRoom,
    14,
    "Anna Petrova",
    "6D4EC2",
  ),
  // A form room keeps its submissions in two folders of its own, as the portal does.
  folder(210, 200, "Complete", 1, DEMO_ME, FolderType.ReadyFormFolder),
  folder(211, 200, "In process", 1, DEMO_ME, FolderType.InProcessFormFolder),
  file(212, 200, "Application form.pdf", 5, DEMO_ME, "412 KB"),
  file(213, 210, "Application - Oleg Smirnov.pdf", 1, "Oleg Smirnov", "430 KB"),
  file(214, 210, "Application - Julia Novak.pdf", 2, "Julia Novak", "428 KB"),
  file(215, 211, "Application - Pavel Orlov.pdf", 1, "Pavel Orlov", "415 KB"),
  file(220, 201, "Vacation request.pdf", 3, "Maria Ivanova", "205 KB"),
  file(230, 202, "Satisfaction survey.pdf", 9, DEMO_ME, "318 KB"),
  file(240, 203, "Expense claim.pdf", 14, "Anna Petrova", "260 KB"),
];

export const demoSource = (kind: SectionKind): SectionSource => {
  const nodes = new Map(seed().map((node) => [node.id, node]));
  const root = DEMO_ROOTS[kind];

  const childrenOf = (parentId: number) =>
    [...nodes.values()].filter((node) => node.parentId === parentId);

  // What the portal gives a folder or room: how much is inside it.
  const withCount = (node: Node): SectionItem => {
    const { parentId: _parentId, ...item } = node;
    if (item.kind === "file") return item;
    return { ...item, detail: itemCount(childrenOf(item.id).length) };
  };

  const crumbsOf = (id: number): SectionCrumb[] => {
    const crumbs: SectionCrumb[] = [];
    let current = nodes.get(id);
    while (current && current.parentId !== root) {
      const parent = nodes.get(current.parentId);
      if (!parent) break;
      crumbs.push({
        id: parent.id,
        title: parent.title,
        isRoot: false,
        isRootRoom: parent.kind === "room",
      });
      current = parent;
    }
    crumbs.push({
      id: root,
      title: SECTION_TITLES[kind],
      isRoot: true,
      isRootRoom: false,
    });
    return crumbs;
  };

  return {
    list: async (query) => {
      const open =
        query.folderId === null ? undefined : nodes.get(query.folderId);
      const items = sortItems(
        childrenOf(open?.id ?? root)
          .map(withCount)
          .filter((item) => matchesQuery(item, query, DEMO_ME)),
        query,
      );

      return {
        current: open
          ? { id: open.id, title: open.title, isRoom: open.kind === "room" }
          : { id: null, title: SECTION_TITLES[kind], isRoom: false },
        crumbs: open ? crumbsOf(open.id) : [],
        items,
        total: items.length,
      };
    },
  };
};
