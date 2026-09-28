import { beforeEach, describe, expect, it } from "vitest";

import { demoPortal, demoSeedClient } from "./demo-portal";

describe("demoPortal", () => {
  beforeEach(() => demoPortal.reset());

  it("shows a new room to the lawyer, and to the client once shared", () => {
    const before = demoPortal.roomsFor("client").length;
    const id = demoPortal.createRoom("Nguyen v. Harbor Freight", "3B72A7");

    expect(demoPortal.roomsFor("lawyer")[0]).toMatchObject({
      id,
      title: "Nguyen v. Harbor Freight",
    });
    expect(demoPortal.roomsFor("client")).toHaveLength(before);

    demoPortal.share(id);
    expect(demoPortal.roomsFor("client").map((room) => room.id)).toContain(id);
  });

  it("counts a file in the folder's listing entry, as the portal does", () => {
    const room = demoPortal.createRoom("A", "555F6B");
    const checklist = demoPortal.createFolder(room, "From the client");
    const slot = demoPortal.createFolder(checklist, "Passport");

    demoPortal.addFile(slot, { title: "passport.pdf", bytes: 10, by: "You" });

    const entry = demoPortal
      .listFolder(checklist)
      .folders.find((folder) => folder.id === slot);
    expect(entry?.filesCount).toBe(1);
    expect(demoPortal.listFolder(slot).files[0]).toMatchObject({
      title: "passport.pdf",
      fileExst: ".pdf",
    });
    expect(demoPortal.listFolder(room).folders[0]?.foldersCount).toBe(1);
  });

  it("tells subscribers about every write", () => {
    let calls = 0;
    const stop = demoPortal.subscribe(() => {
      calls += 1;
    });
    const id = demoPortal.createRoom("B", "555F6B");
    demoPortal.tagRoom(id, ["Practice: Family"]);
    stop();
    demoPortal.share(id);

    expect(calls).toBe(2);
    expect(demoPortal.get().rooms[0]?.tags).toEqual(["Practice: Family"]);
  });

  it("speaks the seeder's words", async () => {
    const client = demoSeedClient();
    const id = await client.createRoom("C", "555F6B");
    await client.tagRoom(id, ["Practice: Probate", "Stage: Intake"]);
    const folder = await client.createFolder(id, "From the firm");
    await client.createDocument(folder, "Engagement letter.docx");
    await client.invite(id, "someone@example.com");

    expect((await client.rooms())[0]).toMatchObject({
      id,
      tags: ["Practice: Probate", "Stage: Intake"],
    });
    expect((await client.listFolder(folder)).files[0]?.title).toBe(
      "Engagement letter.docx",
    );
    expect(demoPortal.roomsFor("client").map((room) => room.id)).toContain(id);
  });
});
