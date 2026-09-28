import { describe, expect, it, vi } from "vitest";

import { FileType } from "../../../enums";
import { demoSource } from "./demo";
import { type Entry, type Query, portalSource } from "./source";

const query = (overrides: Partial<Query> = {}): Query => ({
  place: "rooms",
  folderId: null,
  search: "",
  type: "all",
  sortBy: "AZ",
  ascending: true,
  ...overrides,
});

const titles = (entries: Entry[]) => entries.map((entry) => entry.title);

describe("demoSource", () => {
  it("lists the rooms at the root, where nothing can be created", async () => {
    const listing = await demoSource().list(query());

    expect(listing.entries.every((entry) => entry.kind === "room")).toBe(true);
    expect(titles(listing.entries)).toEqual([
      "Board papers",
      "Finance department",
      "Marketing",
    ]);
    expect(listing.canCreate).toBe(false);
    expect(listing.crumbs).toEqual([]);
    expect(listing.current.title).toBe("Rooms");
  });

  it("walks into a room and a folder with the crumbs nearest first", async () => {
    const source = demoSource();
    const rooms = await source.list(query());
    const finance = rooms.entries.find(
      (entry) => entry.title === "Finance department",
    );
    if (!finance) throw new Error("no Finance department");

    const room = await source.list(query({ folderId: finance.id }));
    expect(room.current).toEqual({
      id: finance.id,
      title: "Finance department",
      isRoom: true,
    });
    expect(room.canCreate).toBe(true);
    expect(room.crumbs).toEqual([
      { id: 0, title: "Rooms", isRoot: true, isRootRoom: false },
    ]);
    // Folders first, then files, both by name.
    expect(titles(room.entries)).toEqual([
      "Invoices",
      "Reports 2026",
      "Annual report 2025.docx",
      "Q4 budget.xlsx",
      "Team presentation.pptx",
    ]);

    const reports = room.entries.find(
      (entry) => entry.title === "Reports 2026",
    );
    if (!reports) throw new Error("no Reports 2026");
    const inside = await source.list(query({ folderId: reports.id }));
    expect(inside.crumbs.map((crumb) => crumb.title)).toEqual([
      "Finance department",
      "Rooms",
    ]);
    expect(inside.crumbs[0].isRootRoom).toBe(true);
    expect(inside.crumbs[1].isRoot).toBe(true);
  });

  it("narrows by search and type and orders by date", async () => {
    const source = demoSource();
    const found = await source.list(query({ folderId: 10, search: "budget" }));
    expect(titles(found.entries)).toEqual(["Q4 budget.xlsx"]);

    const sheets = await source.list(
      query({ folderId: 10, type: "spreadsheets" }),
    );
    expect(titles(sheets.entries)).toEqual(["Q4 budget.xlsx"]);

    const folders = await source.list(query({ folderId: 10, type: "folders" }));
    expect(titles(folders.entries)).toEqual(["Invoices", "Reports 2026"]);

    const newest = await source.list(
      query({ folderId: 10, sortBy: "DateAndTime", ascending: false }),
    );
    expect(titles(newest.entries)).toEqual([
      "Reports 2026",
      "Invoices",
      "Q4 budget.xlsx",
      "Annual report 2025.docx",
      "Team presentation.pptx",
    ]);
  });

  it("creates, renames, trashes and deletes for good", async () => {
    const source = demoSource();
    await source.createFolder(1, "Drafts");
    await source.createDocument(1, "Plan.xlsx");

    let docs = await source.list(query({ place: "documents" }));
    expect(titles(docs.entries)).toContain("Drafts");
    const plan = docs.entries.find((entry) => entry.title === "Plan.xlsx");
    expect(plan?.fileType).toBe(FileType.Spreadsheet);
    if (!plan) throw new Error("no Plan.xlsx");

    await source.rename(plan, "Plan 2027.xlsx");
    docs = await source.list(query({ place: "documents" }));
    expect(titles(docs.entries)).toContain("Plan 2027.xlsx");
    expect(titles(docs.entries)).not.toContain("Plan.xlsx");

    await source.remove([{ ...plan, title: "Plan 2027.xlsx" }], false);
    docs = await source.list(query({ place: "documents" }));
    expect(titles(docs.entries)).not.toContain("Plan 2027.xlsx");
    let trash = await source.list(query({ place: "trash" }));
    expect(titles(trash.entries)).toContain("Plan 2027.xlsx");
    expect(trash.canCreate).toBe(false);

    await source.remove(trash.entries, true);
    trash = await source.list(query({ place: "trash" }));
    expect(trash.entries).toEqual([]);
  });

  it("keeps dropped files where the uploader would have put them", async () => {
    const source = demoSource();
    source.addFiles(1, [new File(["x".repeat(2048)], "scan.pdf")]);
    const docs = await source.list(query({ place: "documents" }));
    const scan = docs.entries.find((entry) => entry.title === "scan.pdf");
    expect(scan?.fileType).toBe(FileType.PDF);
    expect(scan?.detail).toBe("2 KB");
  });
});

const stubApi = () => {
  const answer = (response: unknown) => Promise.resolve({ data: { response } });
  return {
    roomsApi: {
      getRoomsFolder: vi.fn(() =>
        answer({
          folders: [
            {
              id: 201,
              title: "Finance",
              roomType: 5,
              filesCount: 2,
              updated: "2026-09-20T10:00:00.0000000+00:00",
              createdBy: { displayName: "Anna" },
              logo: { color: "4781D1" },
            },
          ],
          files: [],
          total: 1,
          current: { id: 3, title: "Rooms" },
          pathParts: [{ id: 3, title: "Rooms" }],
        }),
      ),
    },
    foldersApi: {
      getFolderByFolderId: vi.fn(() =>
        answer({
          folders: [
            {
              id: 2011,
              title: "Reports",
              filesCount: 1,
              updated: { utcTime: "2026-09-21T10:00:00Z" },
              updatedBy: { displayName: "Boris" },
            },
          ],
          files: [
            {
              id: 9001,
              title: "Timeline.xlsx",
              fileExst: ".xlsx",
              fileType: 5,
              contentLength: "22 KB",
              updated: "2026-09-22T10:00:00Z",
              createdBy: { displayName: "Anna" },
              webUrl: "/doceditor?fileId=9001",
            },
          ],
          total: 2,
          current: { id: 2010, title: "Working files" },
          pathParts: [
            { id: 3, title: "Rooms" },
            { id: 201, title: "Finance", roomType: 5 },
            { id: 2010, title: "Working files" },
          ],
        }),
      ),
      getMyFolder: vi.fn(() =>
        answer({
          folders: [],
          files: [],
          total: 0,
          current: { id: 4, title: "My documents" },
          pathParts: [{ id: 4, title: "My documents" }],
        }),
      ),
      getTrashFolder: vi.fn(() =>
        answer({ folders: [], files: [], total: 0, pathParts: [] }),
      ),
      createFolder: vi.fn(() => answer({})),
      renameFolder: vi.fn(() => answer({})),
    },
    filesApi: {
      createFile: vi.fn(() => answer({})),
      updateFile: vi.fn(() => answer({})),
    },
    operationsApi: {
      deleteBatchItems: vi.fn(() => answer([])),
      getOperationStatuses: vi
        .fn()
        .mockReturnValueOnce(answer([{ id: "op", finished: false }]))
        .mockReturnValue(answer([{ id: "op", finished: true }])),
    },
  };
};

type StubApi = ReturnType<typeof stubApi>;
const asPortal = (api: StubApi) =>
  portalSource(api as unknown as Parameters<typeof portalSource>[0]);

describe("portalSource", () => {
  it("reads the rooms root through getRoomsFolder and maps a room", async () => {
    const api = stubApi();
    const listing = await asPortal(api).list(query({ ascending: false }));

    expect(api.roomsApi.getRoomsFolder).toHaveBeenCalledWith(
      expect.objectContaining({ sortBy: "AZ", sortOrder: 1, count: 100 }),
    );
    expect(listing.canCreate).toBe(false);
    expect(listing.crumbs).toEqual([]);
    expect(listing.entries).toEqual([
      expect.objectContaining({
        id: 201,
        kind: "room",
        title: "Finance",
        by: "Anna",
        color: "4781D1",
        detail: "2 files",
        updated: "2026-09-20T10:00:00.0000000+00:00",
      }),
    ]);
  });

  it("keeps the portal's total for a cut page of rooms", async () => {
    const api = stubApi();
    api.roomsApi.getRoomsFolder.mockReturnValueOnce(
      Promise.resolve({
        data: { response: { folders: [{ id: 1, title: "One" }], total: 250 } },
      }),
    );
    const listing = await asPortal(api).list(query());
    expect(listing.entries).toHaveLength(1);
    expect(listing.total).toBe(250);
  });

  it("narrows the rooms root by type itself, since the call takes none", async () => {
    const api = stubApi();
    const listing = await asPortal(api).list(query({ type: "documents" }));
    expect(listing.entries).toEqual([]);
    expect(listing.total).toBe(0);
    expect(api.roomsApi.getRoomsFolder).toHaveBeenCalledWith(
      expect.not.objectContaining({ filterType: expect.anything() }),
    );
  });

  it("reads a folder with the search, type and sort the portal applies", async () => {
    const api = stubApi();
    const listing = await asPortal(api).list(
      query({
        folderId: 2010,
        search: "time",
        type: "spreadsheets",
        sortBy: "DateAndTime",
      }),
    );

    expect(api.foldersApi.getFolderByFolderId).toHaveBeenCalledWith({
      folderId: 2010,
      count: 100,
      filterValue: "time",
      filterType: 5,
      sortBy: "DateAndTime",
      sortOrder: 0,
    });
    expect(listing.current).toEqual({
      id: 2010,
      title: "Working files",
      isRoom: false,
    });
    expect(listing.canCreate).toBe(true);
    expect(listing.crumbs).toEqual([
      { id: 201, title: "Finance", isRoot: false, isRootRoom: true },
      { id: 3, title: "Rooms", isRoot: true, isRootRoom: false },
    ]);
    expect(listing.entries).toEqual([
      expect.objectContaining({
        kind: "folder",
        title: "Reports",
        by: "Boris",
        updated: "2026-09-21T10:00:00Z",
      }),
      expect.objectContaining({
        kind: "file",
        title: "Timeline.xlsx",
        fileType: FileType.Spreadsheet,
        detail: "22 KB",
        webUrl: "/doceditor?fileId=9001",
      }),
    ]);
  });

  it("reads My documents and Trash through their own calls", async () => {
    const api = stubApi();
    const source = asPortal(api);

    const docs = await source.list(query({ place: "documents" }));
    expect(api.foldersApi.getMyFolder).toHaveBeenCalledTimes(1);
    expect(docs.current.id).toBe(4);
    expect(docs.canCreate).toBe(true);

    const trash = await source.list(query({ place: "trash" }));
    expect(api.foldersApi.getTrashFolder).toHaveBeenCalledTimes(1);
    expect(trash.current.title).toBe("Trash");
    expect(trash.canCreate).toBe(false);
  });

  it("renames a file through updateFile and a folder through renameFolder", async () => {
    const api = stubApi();
    const source = asPortal(api);
    const file = { id: 9001, kind: "file" } as Entry;
    const folder = { id: 2011, kind: "folder" } as Entry;

    await source.rename(file, "Plan.xlsx");
    await source.rename(folder, "Reports 2026");

    expect(api.filesApi.updateFile).toHaveBeenCalledWith({
      fileId: 9001,
      updateFile: { title: "Plan.xlsx" },
    });
    expect(api.foldersApi.renameFolder).toHaveBeenCalledWith({
      folderId: 2011,
      createFolder: { title: "Reports 2026" },
    });
  });

  it("deletes in one batch and waits for the operation to finish", async () => {
    const api = stubApi();
    await asPortal(api).remove(
      [
        { id: 9001, kind: "file" } as Entry,
        { id: 2011, kind: "folder" } as Entry,
        { id: 201, kind: "room" } as Entry,
      ],
      true,
    );

    expect(api.operationsApi.deleteBatchItems).toHaveBeenCalledWith({
      deleteBatchRequestDto: {
        folderIds: [2011],
        fileIds: [9001],
        deleteAfter: false,
        immediately: true,
      },
    });
    expect(api.operationsApi.getOperationStatuses).toHaveBeenCalledTimes(2);
  });
});
