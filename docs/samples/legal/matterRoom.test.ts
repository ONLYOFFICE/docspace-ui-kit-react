import { describe, expect, it, vi } from "vitest";

import {
  CLIENT_FOLDER,
  FIRM_FOLDER,
  type FolderContents,
  formatSize,
  isSection,
  progressOf,
  readMatterRoom,
  requestFrom,
} from "./matterRoom";

const folder = (
  id: number,
  title: string,
  filesCount = 0,
  extra: Record<string, unknown> = {},
) => ({ id, title, filesCount, foldersCount: 0, ...extra });

const file = (
  id: number,
  title: string,
  extra: Record<string, unknown> = {},
) => ({
  id,
  title,
  fileExst: title.slice(title.lastIndexOf(".")),
  pureContentLength: 1024,
  createdBy: { displayName: "Emma Harper" },
  updated: "2026-09-20T10:00:00.0000000+00:00",
  webUrl: `/doceditor?fileId=${id}`,
  ...extra,
});

const portal: Record<number, FolderContents> = {
  101: {
    folders: [
      folder(1011, "from  the CLIENT ", 0, { foldersCount: 3 }),
      folder(1012, "From the firm", 2),
      folder(1013, "Working files", 9),
    ],
    files: [file(9, "notes.docx")],
  },
  1011: {
    folders: [
      folder(1, "Passport", 1, { created: "2026-09-10T09:00:00Z" }),
      folder(2, "Payslips", 0, {
        created: { utcTime: "2026-09-11T09:00:00Z" },
      }),
      folder(3, "Contract", 1),
    ],
    files: [],
  },
  1: { folders: [], files: [file(11, "passport.pdf")] },
  3: {
    folders: [],
    files: [
      file(31, "old.pdf", { updated: "2026-09-01T10:00:00Z" }),
      file(32, "contract.pdf", { updated: "2026-09-21T10:00:00Z" }),
    ],
  },
  1012: {
    folders: [],
    files: [
      file(51, "Engagement letter.docx", { updated: "2026-09-05T10:00:00Z" }),
      file(52, "Draft claim.docx", { updated: "2026-09-22T10:00:00Z" }),
    ],
  },
  102: { folders: [folder(1021, "Intake")], files: [file(8, "intake.docx")] },
};

const read = vi.fn(
  async (id: number) => portal[id] ?? { folders: [], files: [] },
);

describe("isSection", () => {
  it("matches the folder names without regard to case or spacing", () => {
    expect(isSection(folder(1, "  from THE  client"), CLIENT_FOLDER)).toBe(
      true,
    );
    expect(isSection(folder(1, "From the firm"), FIRM_FOLDER)).toBe(true);
    expect(isSection(folder(1, "From the clients"), CLIENT_FOLDER)).toBe(false);
  });
});

describe("requestFrom", () => {
  it("is received when the folder holds a file, newest file first", () => {
    const request = requestFrom(folder(3, "Contract", 2), portal[3].files);

    expect(request.received).toBe(true);
    expect(request.documents.map((document) => document.title)).toEqual([
      "contract.pdf",
      "old.pdf",
    ]);
    expect(request.documents[0]).toMatchObject({
      ext: ".pdf",
      bytes: 1024,
      by: "Emma Harper",
      url: "/doceditor?fileId=32",
    });
  });

  it("trusts the portal's count when the files were not fetched", () => {
    expect(requestFrom(folder(1, "Passport", 1), []).received).toBe(true);
    expect(requestFrom(folder(2, "Payslips", 0), []).received).toBe(false);
  });

  it("takes the asked-on time in either form the portal sends", () => {
    expect(
      requestFrom(folder(1, "A", 0, { created: "2026-09-10T09:00:00Z" }), [])
        .asked,
    ).toBe("2026-09-10T09:00:00Z");
    expect(
      requestFrom(
        folder(1, "A", 0, { created: { utcTime: "2026-09-11T09:00:00Z" } }),
        [],
      ).asked,
    ).toBe("2026-09-11T09:00:00Z");
  });

  it("dates a received request by its newest file, not the folder", () => {
    const stale = folder(3, "Contract", 2, { updated: "2026-08-01T10:00:00Z" });
    expect(requestFrom(stale, portal[3].files).updated).toBe(
      "2026-09-21T10:00:00Z",
    );
    expect(requestFrom(stale, []).updated).toBe("2026-08-01T10:00:00Z");
  });
});

describe("progressOf", () => {
  it("counts received requests", () => {
    const requests = [
      requestFrom(folder(1, "A", 1), []),
      requestFrom(folder(2, "B", 0), []),
      requestFrom(folder(3, "C", 1), []),
    ];
    expect(progressOf(requests)).toEqual({
      received: 2,
      total: 3,
      percent: 67,
    });
    expect(progressOf([])).toEqual({ received: 0, total: 0, percent: 0 });
  });
});

describe("formatSize", () => {
  it("rounds to the unit a person reads", () => {
    expect(formatSize(0)).toBe("");
    expect(formatSize(900)).toBe("900 B");
    expect(formatSize(380 * 1024)).toBe("380 KB");
    expect(formatSize(1.25 * 1024 * 1024)).toBe("1.3 MB");
  });
});

describe("readMatterRoom", () => {
  it("walks the room, the checklist, the received slots and the firm's folder", async () => {
    read.mockClear();
    const room = await readMatterRoom(101, read);

    expect(room.layout).toBe("matter");
    if (room.layout !== "matter") return;

    expect(room.clientFolderId).toBe(1011);
    expect(room.firmFolderId).toBe(1012);
    expect(
      room.requests.map((request) => [request.title, request.received]),
    ).toEqual([
      ["Passport", true],
      ["Payslips", false],
      ["Contract", true],
    ]);
    expect(room.requests[2].documents[0].title).toBe("contract.pdf");
    expect(room.drafts.map((draft) => draft.title)).toEqual([
      "Draft claim.docx",
      "Engagement letter.docx",
    ]);
    expect(room.otherFolders).toBe(1);
    expect(room.otherFiles).toBe(1);

    // Empty slots cost no call: the room, the two sections, two received slots.
    expect(read.mock.calls.map(([id]) => id).sort((a, b) => a - b)).toEqual([
      1, 3, 101, 1011, 1012,
    ]);
  });

  it("reports a room without the checklist folder as plain", async () => {
    expect(await readMatterRoom(102, read)).toEqual({
      layout: "plain",
      folders: 1,
      files: 1,
    });
  });

  it("copes with a checklist folder and no firm folder", async () => {
    const room = await readMatterRoom(7, async (id) =>
      id === 7
        ? { folders: [folder(70, CLIENT_FOLDER)], files: [] }
        : { folders: [], files: [] },
    );
    expect(room).toMatchObject({
      layout: "matter",
      firmFolderId: undefined,
      requests: [],
      drafts: [],
      otherFolders: 0,
    });
  });
});
