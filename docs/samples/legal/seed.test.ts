import { describe, expect, it } from "vitest";

import { DEMO_ROOMS } from "./demo-matters";
import {
  CLIENT_ROOM_IDS,
  minimalPdf,
  pixelPng,
  type SeedClient,
  type SeedStep,
  seedPortal,
} from "./seed";

type Call = [string, ...unknown[]];

/** A portal that remembers what it was asked and hands out ids in order. */
const recorder = (
  existing: string[] = [],
  failOn?: string,
): SeedClient & { calls: Call[] } => {
  let nextId = 1000;
  const calls: Call[] = [];
  const note = (...call: Call) => {
    calls.push(call);
  };
  return {
    calls,
    roomTitles: async () => existing,
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

describe("seedPortal", () => {
  it("creates every demo room, tags the matters and fills their folders", async () => {
    const portal = recorder();
    const steps: SeedStep[] = [];
    const summary = await seedPortal(portal, { onStep: (s) => steps.push(s) });

    expect(summary).toEqual({
      done: DEMO_ROOMS.lawyer.length,
      skipped: 0,
      failed: 0,
    });
    expect(named(portal.calls, "createRoom")).toHaveLength(9);
    // Two demo rooms carry no Practice tag; one of them has no tag at all.
    expect(named(portal.calls, "tagRoom")).toHaveLength(8);

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

  it("skips rooms already on the portal, whatever their case", async () => {
    const portal = recorder(["  harper v. northwind LOGISTICS ", "Marketing"]);
    const summary = await seedPortal(portal);

    expect(summary.skipped).toBe(2);
    expect(summary.done).toBe(7);
    expect(
      named(portal.calls, "createRoom").map(([, title]) => title),
    ).not.toContain("Harper v. Northwind Logistics");
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
        "The portal answered 403: this identity may not create rooms here.",
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
