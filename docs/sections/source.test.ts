import {
  FilterType,
  FolderType,
  RoomType,
  SearchArea,
  SortOrder,
  SubjectFilter,
} from "@onlyoffice/docspace-api-sdk";
import { describe, expect, it, vi } from "vitest";

import { DEMO_ROOTS, demoSource } from "./demo";
import {
  filterGroupsFor,
  formFolderOf,
  portalSource,
  type SectionItem,
  type SectionKind,
  type SectionQuery,
} from "./source";

const query = (overrides: Partial<SectionQuery> = {}): SectionQuery => ({
  folderId: null,
  search: "",
  filters: [],
  sortBy: "AZ",
  ascending: true,
  ...overrides,
});

const titles = (items: SectionItem[]) => items.map((item) => item.title);

const list = (kind: SectionKind, overrides: Partial<SectionQuery> = {}) =>
  demoSource(kind).list(query(overrides));

describe("demoSource", () => {
  it("puts folders before files in My documents, each by name", async () => {
    const { items, total, current, crumbs } = await list("files");

    expect(titles(items).slice(0, 2)).toEqual(["Templates", "Travel"]);
    expect(items.slice(2).every((item) => item.kind === "file")).toBe(true);
    expect(total).toBe(items.length);
    expect(current).toEqual({ id: null, title: "Files", isRoom: false });
    expect(crumbs).toEqual([]);
  });

  it("counts what is inside each folder and room", async () => {
    const { items } = await list("files");

    expect(items.find((item) => item.title === "Templates")?.detail).toBe(
      "2 items",
    );
  });

  it("narrows My documents by type and by search", async () => {
    const pdf = await list("files", {
      filters: [{ group: "type", key: "pdf" }],
    });
    expect(titles(pdf.items)).toEqual(["Tax return 2025.pdf"]);

    const folders = await list("files", {
      filters: [{ group: "type", key: "folders" }],
    });
    expect(folders.items.every((item) => item.kind === "folder")).toBe(true);

    const found = await list("files", { search: "BUDGET" });
    expect(titles(found.items)).toEqual(["Household budget.xlsx"]);
  });

  it("keeps form-filling rooms out of Rooms and everything else out of Forms", async () => {
    const rooms = await list("rooms");
    const forms = await list("forms");

    expect(
      rooms.items.some((item) => item.roomType === RoomType.FillingFormsRoom),
    ).toBe(false);
    expect(
      forms.items.every((item) => item.roomType === RoomType.FillingFormsRoom),
    ).toBe(true);
  });

  it("filters rooms by type and by owner, together", async () => {
    const publicRooms = await list("rooms", {
      filters: [{ group: "type", key: "public" }],
    });
    expect(titles(publicRooms.items)).toEqual(["Partner portal", "Press kit"]);

    const mine = await list("rooms", {
      filters: [
        { group: "type", key: "public" },
        { group: "owner", key: "me" },
      ],
    });
    expect(titles(mine.items)).toEqual(["Partner portal"]);
  });

  it("orders by date, newest first when descending", async () => {
    const { items } = await list("forms", {
      sortBy: "DateAndTime",
      ascending: false,
    });

    expect(titles(items)).toEqual([
      "Job applications",
      "Vacation requests",
      "Customer survey",
      "Expense reports",
    ]);
  });

  it("opens a room, then a folder in it, with the crumbs nearest first", async () => {
    const source = demoSource("rooms");

    const room = await source.list(query({ folderId: 100 }));
    expect(room.current).toEqual({
      id: 100,
      title: "Finance department",
      isRoom: true,
    });
    expect(titles(room.items)).toEqual([
      "Invoices",
      "Reports 2026",
      "Annual report 2025.docx",
      "Q4 budget.xlsx",
    ]);
    expect(room.crumbs).toEqual([
      { id: DEMO_ROOTS.rooms, title: "Rooms", isRoot: true, isRootRoom: false },
    ]);

    const folder = await source.list(query({ folderId: 110 }));
    expect(folder.current).toEqual({
      id: 110,
      title: "Reports 2026",
      isRoom: false,
    });
    expect(folder.crumbs.map((crumb) => crumb.title)).toEqual([
      "Finance department",
      "Rooms",
    ]);
    expect(folder.crumbs[0].isRootRoom).toBe(true);
    expect(folder.crumbs[1].isRoot).toBe(true);
  });

  it("narrows inside a room by file type", async () => {
    const { items } = await list("forms", {
      folderId: 200,
      filters: [{ group: "type", key: "folders" }],
    });

    expect(titles(items)).toEqual(["Complete", "In process"]);
  });

  it("says so when nothing matches", async () => {
    const { items, total } = await list("forms", { search: "no such form" });

    expect(items).toEqual([]);
    expect(total).toBe(0);
  });
});

describe("formFolderOf", () => {
  const withType = (folderType?: FolderType) =>
    ({ kind: "folder", folderType }) as SectionItem;

  it("tells a form room's two folders apart, under either of their names", () => {
    expect(formFolderOf(withType(FolderType.ReadyFormFolder))).toBe("done");
    expect(formFolderOf(withType(FolderType.FormFillingFolderDone))).toBe(
      "done",
    );
    expect(formFolderOf(withType(FolderType.InProcessFormFolder))).toBe(
      "progress",
    );
    expect(formFolderOf(withType(FolderType.FormFillingFolderInProgress))).toBe(
      "progress",
    );
    expect(formFolderOf(withType(FolderType.DEFAULT))).toBeNull();
    expect(formFolderOf(withType())).toBeNull();
  });

  it("marks the demo's Complete and In process folders", async () => {
    const { items } = await list("forms", { folderId: 200 });
    const byTitle = (title: string) =>
      items.find((item) => item.title === title) as SectionItem;

    expect(formFolderOf(byTitle("Complete"))).toBe("done");
    expect(formFolderOf(byTitle("In process"))).toBe("progress");
  });
});

describe("filterGroupsFor", () => {
  it("offers the section's own groups at its list, file types inside", () => {
    const labels = (kind: SectionKind, folderId: number | null) =>
      filterGroupsFor(kind, folderId).map((group) => group.label);

    expect(labels("rooms", null)).toEqual(["Room type", "Owner"]);
    expect(labels("forms", null)).toEqual(["Owner"]);
    expect(labels("files", null)).toEqual(["Type"]);
    expect(labels("rooms", 100)).toEqual(["Type"]);
    expect(labels("forms", 200)).toEqual(["Type"]);
  });
});

const content = {
  current: { id: 7, title: "Press kit", roomType: RoomType.PublicRoom },
  pathParts: [
    { id: 1, title: "VirtualRooms" },
    { id: 7, title: "Press kit", roomType: RoomType.PublicRoom },
  ],
  folders: [
    {
      id: 7,
      title: "Press kit",
      roomType: RoomType.PublicRoom,
      updated: "2026-09-20T10:00:00Z",
      createdBy: { displayName: "Ivan Sokolov" },
      filesCount: 3,
      foldersCount: 1,
      logo: { color: "3B9E4F" },
    },
    {
      id: 8,
      title: "Travel",
      roomType: null,
      type: FolderType.ReadyFormFolder,
      updated: { utcTime: "2026-09-21T10:00:00Z" },
      updatedBy: { displayName: "You" },
      filesCount: 5,
    },
  ],
  files: [
    {
      id: 9,
      title: "Notes.docx",
      fileExst: ".docx",
      fileType: 7,
      updated: "2026-09-22T10:00:00Z",
      createdBy: { displayName: "You" },
      contentLength: "24 KB",
      webUrl: "/doceditor?fileId=9",
    },
  ],
  total: 42,
};

const fakeApi = () => {
  const answer = { data: { response: content } };
  return {
    foldersApi: {
      getMyFolder: vi.fn().mockResolvedValue(answer),
      getFolderByFolderId: vi.fn().mockResolvedValue(answer),
    },
    roomsApi: { getRoomsFolder: vi.fn().mockResolvedValue(answer) },
    profilesApi: {
      getSelfProfile: vi
        .fn()
        .mockResolvedValue({ data: { response: { id: "me-id" } } }),
    },
  };
};

type FakeApi = ReturnType<typeof fakeApi>;

const sourceFor = (api: FakeApi, kind: SectionKind) =>
  portalSource(api as unknown as Parameters<typeof portalSource>[0], kind);

describe("portalSource", () => {
  it("reads My documents with the type, search and sort sent to the portal", async () => {
    const api = fakeApi();

    await sourceFor(api, "files").list(
      query({
        search: "  notes ",
        filters: [{ group: "type", key: "documents" }],
        sortBy: "DateAndTime",
        ascending: false,
      }),
    );

    expect(api.foldersApi.getMyFolder).toHaveBeenCalledWith({
      count: 100,
      filterValue: "notes",
      sortBy: "DateAndTime",
      sortOrder: SortOrder.Descending,
      filterType: FilterType.DocumentsOnly,
    });
    expect(api.roomsApi.getRoomsFolder).not.toHaveBeenCalled();
  });

  it("reads active rooms by type, and asks who 'me' is only once", async () => {
    const api = fakeApi();
    const source = sourceFor(api, "rooms");
    const mine = query({
      filters: [
        { group: "type", key: "vdr" },
        { group: "owner", key: "me" },
      ],
    });

    await source.list(mine);
    await source.list(mine);

    expect(api.roomsApi.getRoomsFolder).toHaveBeenLastCalledWith({
      count: 100,
      filterValue: undefined,
      sortBy: "AZ",
      sortOrder: SortOrder.Ascending,
      subjectId: "me-id",
      subjectFilter: SubjectFilter.Owner,
      searchArea: SearchArea.Active,
      type: [RoomType.VirtualDataRoom],
    });
    expect(api.profilesApi.getSelfProfile).toHaveBeenCalledTimes(1);
  });

  it("reads the Forms section by its search area, with no room type", async () => {
    const api = fakeApi();

    await sourceFor(api, "forms").list(query());

    const [request] = api.roomsApi.getRoomsFolder.mock.calls[0];
    expect(request.searchArea).toBe("Forms");
    expect(request.type).toBeUndefined();
    expect(request.subjectId).toBeUndefined();
    expect(api.profilesApi.getSelfProfile).not.toHaveBeenCalled();
  });

  it("opens a folder or room by id, with the file type filter", async () => {
    const api = fakeApi();

    await sourceFor(api, "rooms").list(
      query({ folderId: 7, filters: [{ group: "type", key: "pdf" }] }),
    );

    expect(api.foldersApi.getFolderByFolderId).toHaveBeenCalledWith({
      folderId: 7,
      count: 100,
      filterValue: undefined,
      sortBy: "AZ",
      sortOrder: SortOrder.Ascending,
      filterType: FilterType.Pdf,
    });
    expect(api.roomsApi.getRoomsFolder).not.toHaveBeenCalled();
  });

  it("turns pathParts into crumbs, with the section as the root", async () => {
    const listing = await sourceFor(fakeApi(), "rooms").list(
      query({ folderId: 7 }),
    );

    expect(listing.current).toEqual({
      id: 7,
      title: "Press kit",
      isRoom: true,
    });
    expect(listing.crumbs).toEqual([
      { id: 1, title: "Rooms", isRoot: true, isRootRoom: false },
    ]);
  });

  it("maps rooms, folders and files off the wire", async () => {
    const { items, total, crumbs } = await sourceFor(fakeApi(), "rooms").list(
      query(),
    );

    expect(total).toBe(42);
    expect(crumbs).toEqual([]);
    expect(items).toEqual([
      expect.objectContaining({
        id: 7,
        kind: "room",
        roomType: RoomType.PublicRoom,
        by: "Ivan Sokolov",
        detail: "4 items",
        color: "3B9E4F",
      }),
      expect.objectContaining({
        id: 8,
        kind: "folder",
        roomType: undefined,
        updated: "2026-09-21T10:00:00Z",
        by: "You",
        detail: "5 items",
        folderType: FolderType.ReadyFormFolder,
      }),
      expect.objectContaining({
        id: 9,
        kind: "file",
        fileExst: ".docx",
        by: "You",
        detail: "24 KB",
        webUrl: "/doceditor?fileId=9",
      }),
    ]);
  });
});
