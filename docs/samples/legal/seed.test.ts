import { describe, expect, it } from "vitest";

import { DEMO_ROOMS } from "./demo-matters";
import type { FolderContents } from "./matterRoom";
import {
  CLIENT_ROOM_IDS,
  minimalPdf,
  pixelPng,
  type SeedClient,
  type SeedStep,
  seedPortal,
} from "./seed";

type Call = [string, ...unknown[]];

type Existing = {
  id: number;
  title: string;
  tags?: string[];
  /** What listing this room, and folders inside it, answers. */
  folders?: Record<number, FolderContents>;
};

/** A portal that remembers what it was asked and hands out ids in order. */
const recorder = (
  existing: Existing[] = [],
  failOn?: string,
): SeedClient & { calls: Call[] } => {
  let nextId = 1000;
  const calls: Call[] = [];
  const note = (...call: Call) => {
    calls.push(call);
  };
  const listings: Record<number, FolderContents> = Object.assign(
    {},
    ...existing.map((room) => room.folders ?? {}),
  );
  return {
    calls,
    rooms: async () =>
      existing.map(({ id, title, tags }) => ({ id, title, tags: tags ?? [] })),
    listFolder: async (folderId) => {
      note("listFolder", folderId);
      return listings[folderId] ?? { folders: [], files: [] };
    },
    createRoom: async (title, color) => {
      note("createRoom", title, color);
      if (title === failOn) throw { response: { status: 403 } };
      return ++nextId;
    },
    tagRoom: async (id, tags) => note("tagRoom", id, tags),
    createFolder: async (parentId, title) => {
      note("createFolder", parentId, title);
      return ++nextId;
    },
    createDocument: async (folderId, title) =>
      note("createDocument", folderId, title),
    uploadFile: async (folderId, title, bytes, type) =>
      note("uploadFile", folderId, title, bytes.length, type),
    invite: async (roomId, email) => note("invite", roomId, email),
  };
};

const named = (calls: Call[], name: string) =>
  calls.filter(([call]) => call === name);

/** Titles created under one parent, in order. */
const madeUnder = (calls: Call[], parent: number) =>
  named(calls, "createFolder")
    .filter(([, where]) => where === parent)
    .map(([, , title]) => title);

const EMPTY = { done: 0, completed: 0, skipped: 0, failed: 0 };

describe("seedPortal", () => {
  it("creates every demo room, tags the matters and fills their folders", async () => {
    const portal = recorder();
    const steps: SeedStep[] = [];
    const summary = await seedPortal(portal, { onStep: (s) => steps.push(s) });

    expect(summary).toEqual({ ...EMPTY, done: DEMO_ROOMS.lawyer.length });
    expect(named(portal.calls, "createRoom")).toHaveLength(9);
    // Two demo rooms carry no Practice tag; one of them has no tag at all.
    expect(named(portal.calls, "tagRoom")).toHaveLength(8);
    // A room just made holds nothing, so nothing is listed.
    expect(named(portal.calls, "listFolder")).toHaveLength(0);

    // Harper: three top folders, five requests, three received, two drafts.
    const harper = steps.find((s) => s.label.startsWith("Harper"));
    expect(harper).toMatchObject({ status: "done" });
    expect(harper?.detail).toBe("2 tags, 8 folders, 5 files");

    const folders = named(portal.calls, "createFolder").map(([, , t]) => t);
    expect(folders).toEqual(
      expect.arrayContaining([
        "From the client",
        "From the firm",
        "Working files",
        "Passport",
        "Payslips, last 3 months",
        "Landlord's proposal",
      ]),
    );
  });

  it("makes office files through the document server and uploads the rest", async () => {
    const portal = recorder();
    await seedPortal(portal);

    const documents = named(portal.calls, "createDocument").map(([, , t]) => t);
    expect(documents).toEqual(
      expect.arrayContaining(["Draft claim.docx", "Counter-proposal v2.docx"]),
    );

    const uploads = named(portal.calls, "uploadFile");
    const pdf = uploads.find(([, , title]) => title === "passport-scan.pdf");
    expect(pdf?.[4]).toBe("application/pdf");
    const png = uploads.find(([, , title]) => title === "floor-plan.png");
    expect(png?.[4]).toBe("image/png");
  });

  it("leaves a room alone when it already holds everything", async () => {
    // Marketing has nothing inside in the demo, so being there is enough;
    // Firm templates needs its one tag, and has it, whatever the case.
    const portal = recorder([
      { id: 5, title: "  MARKETING " },
      { id: 6, title: "Firm templates", tags: ["internal"] },
    ]);
    const summary = await seedPortal(portal);

    expect(summary.skipped).toBe(2);
    expect(summary.done).toBe(7);
    expect(named(portal.calls, "tagRoom").map(([, id]) => id)).not.toContain(6);
    expect(
      named(portal.calls, "createRoom").map(([, title]) => title),
    ).not.toContain("Marketing");
  });

  it("gives a room made by hand the tags it lacks", async () => {
    const portal = recorder([
      { id: 6, title: "Firm templates" },
      { id: 7, title: "Sokolova residence permit", tags: ["Urgent"] },
    ]);
    const steps: SeedStep[] = [];
    const summary = await seedPortal(portal, { onStep: (s) => steps.push(s) });

    expect(summary.completed).toBe(2);
    expect(named(portal.calls, "tagRoom")).toContainEqual([
      "tagRoom",
      6,
      ["Internal"],
    ]);
    expect(named(portal.calls, "tagRoom")).toContainEqual([
      "tagRoom",
      7,
      ["Practice: Immigration", "Stage: Hearing"],
    ]);
    expect(steps.find((s) => s.label.startsWith("Sokolova"))?.detail).toBe(
      "Already there; added 2 tags.",
    );
  });

  it("fills in what a half-made room is missing, then shares it", async () => {
    // Harper stopped after "From the client" and its first request.
    const portal = recorder([
      {
        id: 5,
        title: "Harper v. Northwind Logistics",
        folders: {
          5: {
            folders: [{ id: 51, title: "From the client", filesCount: 0 }],
            files: [],
          },
          51: {
            folders: [{ id: 511, title: "passport", filesCount: 1 }],
            files: [],
          },
          511: {
            folders: [],
            files: [{ id: 5111, title: "passport-scan.pdf" }],
          },
        },
      },
    ]);
    const steps: SeedStep[] = [];
    const summary = await seedPortal(portal, {
      clientEmail: "emma@example.com",
      onStep: (s) => steps.push(s),
    });

    expect(summary.completed).toBe(1);
    expect(summary.done).toBe(8);
    expect(steps.find((s) => s.label.startsWith("Harper"))).toMatchObject({
      status: "completed",
      detail:
        "Already there; added 2 tags, 6 folders, 4 files, shared with emma@example.com.",
    });

    // The room keeps its checklist folder and gets the two it lacked.
    expect(madeUnder(portal.calls, 5)).toEqual([
      "From the firm",
      "Working files",
    ]);
    // The checklist keeps "passport", whatever its case, and gets the rest.
    expect(madeUnder(portal.calls, 51)).toEqual([
      "Employment contract",
      "Payslips, last 3 months",
      "Dismissal letter",
      "Correspondence with HR",
    ]);
    expect(
      named(portal.calls, "uploadFile").filter(([, where]) => where === 511),
    ).toHaveLength(0);
    expect(named(portal.calls, "invite")).toContainEqual([
      "invite",
      5,
      "emma@example.com",
    ]);
  });

  it("shares only the client's rooms, and only when an email is given", async () => {
    const quiet = recorder();
    await seedPortal(quiet);
    expect(named(quiet.calls, "invite")).toHaveLength(0);

    const shared = recorder();
    const steps: SeedStep[] = [];
    await seedPortal(shared, {
      clientEmail: " emma@example.com ",
      onStep: (s) => steps.push(s),
    });
    const invites = named(shared.calls, "invite");
    expect(invites).toHaveLength(CLIENT_ROOM_IDS.length);
    expect(invites.every(([, , email]) => email === "emma@example.com")).toBe(
      true,
    );
    expect(
      steps.find((s) => s.label.startsWith("Lease renewal"))?.detail,
    ).toContain("shared with emma@example.com");
  });

  it("reports a refused room and carries on with the next", async () => {
    const portal = recorder([], "Estate of Margaret Ellis");
    const steps: SeedStep[] = [];
    const summary = await seedPortal(portal, { onStep: (s) => steps.push(s) });

    expect(summary.failed).toBe(1);
    expect(summary.done).toBe(8);
    expect(steps.find((s) => s.status === "failed")).toMatchObject({
      label: "Estate of Margaret Ellis",
      detail:
        "The portal answered 403: this identity may not write to this portal.",
    });
  });
});

describe("the files it makes", () => {
  it("writes a PDF whose cross-reference offsets are right", () => {
    const text = new TextDecoder().decode(minimalPdf("passport-scan.pdf"));

    expect(text.startsWith("%PDF-1.4\n")).toBe(true);
    const startxref = Number(/startxref\n(\d+)\n%%EOF/.exec(text)?.[1]);
    expect(text.slice(startxref, startxref + 4)).toBe("xref");
    // The first object's offset points at "1 0 obj".
    const first = Number(/\n(\d{10}) 00000 n/.exec(text)?.[1]);
    expect(text.slice(first, first + 7)).toBe("1 0 obj");
    expect(text).toContain("(passport-scan.pdf) Tj");
  });

  it("writes a PNG with the PNG signature", () => {
    const png = pixelPng();
    expect(Array.from(png.slice(0, 8))).toEqual([
      137, 80, 78, 71, 13, 10, 26, 10,
    ]);
  });
});
