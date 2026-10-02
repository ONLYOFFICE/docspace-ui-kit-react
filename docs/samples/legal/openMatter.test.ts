import { describe, expect, it } from "vitest";

import {
  colorFor,
  type MatterWriter,
  type OpenStep,
  openMatter,
  validate,
} from "./openMatter";

type Call = [string, ...unknown[]];

const recorder = (failOn?: string): MatterWriter & { calls: Call[] } => {
  let nextId = 100;
  const calls: Call[] = [];
  const note = (...call: Call) => {
    calls.push(call);
  };
  const refuse = (what: string) => {
    if (what === failOn) throw { response: { status: 403 } };
  };
  return {
    calls,
    createRoom: async (title, color) => {
      note("createRoom", title, color);
      refuse("createRoom");
      return ++nextId;
    },
    tagRoom: async (id, tags) => {
      note("tagRoom", id, tags);
      refuse("tagRoom");
    },
    createFolder: async (parentId, title) => {
      note("createFolder", parentId, title);
      refuse("createFolder");
      return ++nextId;
    },
    invite: async (roomId, email) => {
      note("invite", roomId, email);
      refuse("invite");
    },
  };
};

const spec = {
  title: "  Nguyen v. Harbor Freight ",
  practice: "Employment",
  stage: "Intake" as const,
  requests: ["Passport or ID", " Payslips, last 3 months", ""],
  clientEmail: "linh@example.com",
};

describe("openMatter", () => {
  it("makes the room, the tags, the folders and the invitation, in order", async () => {
    const portal = recorder();
    const steps: OpenStep[] = [];
    const { roomId } = await openMatter(portal, spec, (s) => steps.push(s));

    expect(roomId).toBe(101);
    expect(portal.calls).toEqual([
      [
        "createRoom",
        "Nguyen v. Harbor Freight",
        colorFor("Nguyen v. Harbor Freight"),
      ],
      ["tagRoom", 101, ["Practice: Employment", "Stage: Intake"]],
      ["createFolder", 101, "From the client"],
      ["createFolder", 102, "Passport or ID"],
      ["createFolder", 102, "Payslips, last 3 months"],
      ["createFolder", 101, "From the firm"],
      ["invite", 101, "linh@example.com"],
    ]);
    expect(steps.map((s) => [s.label, s.status])).toEqual([
      ["Room", "done"],
      ["Tags", "done"],
      ["Checklist", "done"],
      ["Firm's folder", "done"],
      ["Client", "done"],
    ]);
  });

  it("skips the invitation when there is no email", async () => {
    const portal = recorder();
    await openMatter(portal, { ...spec, clientEmail: "  " });
    expect(portal.calls.some(([call]) => call === "invite")).toBe(false);
  });

  it("stops at the step the portal refused and says which", async () => {
    const portal = recorder("createFolder");
    const steps: OpenStep[] = [];
    await expect(
      openMatter(portal, spec, (s) => steps.push(s)),
    ).rejects.toThrow("The portal answered 403.");

    expect(steps.at(-1)).toEqual({
      label: "Checklist",
      status: "failed",
      detail: "The portal answered 403.",
    });
    // The room and its tags were made before the refusal, and stay.
    expect(portal.calls.map(([call]) => call)).toEqual([
      "createRoom",
      "tagRoom",
      "createFolder",
    ]);
  });
});

describe("validate", () => {
  it("wants a name and a practice, and a real email if any", () => {
    expect(validate({ ...spec, title: " " })).toBe("Give the matter a name.");
    expect(validate({ ...spec, practice: "" })).toBe("Pick a practice area.");
    expect(validate({ ...spec, clientEmail: "linh@" })).toBe(
      "That does not look like an email address.",
    );
    expect(validate(spec)).toBe("");
    expect(validate({ ...spec, clientEmail: "" })).toBe("");
  });
});

describe("colorFor", () => {
  it("is stable and stays within the demo's palette", () => {
    expect(colorFor("Harper v. Northwind Logistics")).toBe(
      colorFor("Harper v. Northwind Logistics"),
    );
    expect(colorFor("anything")).toMatch(/^[0-9A-F]{6}$/);
  });
});
