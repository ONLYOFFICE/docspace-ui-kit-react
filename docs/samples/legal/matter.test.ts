import { describe, expect, it } from "vitest";

import {
  byAttention,
  type Matter,
  matterFromRoom,
  roomUrl,
  updatedAgo,
} from "./matter";

const room = (tags: string[], extra: Record<string, unknown> = {}) => ({
  id: 7,
  title: "Harper v. Northwind Logistics",
  tags,
  filesCount: 12,
  foldersCount: 4,
  createdBy: { displayName: "Daniel Reyes" },
  updated: "2026-09-20T10:00:00.0000000+00:00",
  ...extra,
});

describe("matterFromRoom", () => {
  it("reads practice and stage from their tags", () => {
    const matter = matterFromRoom(
      room(["Practice: Employment", "Stage: Discovery", "Urgent"]),
    );

    expect(matter).toMatchObject({
      id: 7,
      practice: "Employment",
      stage: "Discovery",
      stageKnown: true,
      isClosed: false,
      lead: "Daniel Reyes",
      documents: 12,
      sections: 4,
      otherTags: ["Urgent"],
    });
  });

  it("is not a matter without a practice tag", () => {
    expect(matterFromRoom(room(["Stage: Intake"]))).toBeNull();
    expect(matterFromRoom(room([]))).toBeNull();
  });

  it("forgives case and spacing, and spells a known stage canonically", () => {
    const matter = matterFromRoom(
      room(["practice:Family", "STAGE :  closed "]),
    );

    expect(matter?.practice).toBe("Family");
    expect(matter?.stage).toBe("Closed");
    expect(matter?.isClosed).toBe(true);
  });

  it("keeps a stage it has no wording for, and says so", () => {
    const matter = matterFromRoom(
      room(["Practice: Tax", "Stage: Appeal filed"]),
    );

    expect(matter?.stage).toBe("Appeal filed");
    expect(matter?.stageKnown).toBe(false);
  });

  it("marks a matter with no stage tag", () => {
    const matter = matterFromRoom(room(["Practice: Tax"]));

    expect(matter?.stage).toBe("No stage");
    expect(matter?.stageKnown).toBe(false);
  });

  // The SDK types `updated` as { utcTime }, the portal sends a string.
  it("takes the update time in either shape", () => {
    expect(matterFromRoom(room(["Practice: Tax"]))?.updated).toBe(
      "2026-09-20T10:00:00.0000000+00:00",
    );
    expect(
      matterFromRoom(
        room(["Practice: Tax"], {
          updated: { utcTime: "2026-09-21T00:00:00Z" },
        }),
      )?.updated,
    ).toBe("2026-09-21T00:00:00Z");
  });
});

describe("byAttention", () => {
  const matter = (title: string, updated: string, isClosed = false) =>
    ({ title, updated, isClosed }) as Matter;

  it("puts open matters first, the most recently changed on top", () => {
    const sorted = [
      matter("closed", "2026-09-24T00:00:00Z", true),
      matter("older", "2026-09-01T00:00:00Z"),
      matter("newer", "2026-09-20T00:00:00Z"),
    ].sort(byAttention);

    expect(sorted.map(({ title }) => title)).toEqual([
      "newer",
      "older",
      "closed",
    ]);
  });
});

describe("updatedAgo", () => {
  const now = new Date(2026, 8, 25, 15, 0);

  // `updatedAgo` speaks the reader's locale on purpose, so the expected words
  // come from the same formatter rather than being spelled in English: on a
  // machine set to Russian "today" is "сегодня", and the day count is what is
  // under test, not the language.
  const inLocale = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });

  it("counts calendar days, not 24-hour periods", () => {
    expect(updatedAgo(new Date(2026, 8, 25, 1, 0).toISOString(), now)).toBe(
      inLocale.format(0, "day"),
    );
    expect(updatedAgo(new Date(2026, 8, 24, 23, 0).toISOString(), now)).toBe(
      inLocale.format(-1, "day"),
    );
    expect(updatedAgo(new Date(2026, 8, 20).toISOString(), now)).toBe(
      inLocale.format(-5, "day"),
    );
  });

  it("returns nothing for a missing date", () => {
    expect(updatedAgo("", now)).toBe("");
  });
});

describe("roomUrl", () => {
  it("points at the room's page on the portal", () => {
    expect(roomUrl("https://portal.example.com", 42)).toBe(
      "https://portal.example.com/rooms/shared/42/filter?folder=42",
    );
  });
});
