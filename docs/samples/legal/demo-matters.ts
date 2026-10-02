import type { RoomLike } from "./matter";

/**
 * What a small practice's portal answers when there is no portal: rooms in
 * the shape `getRoomsFolder` returns them, so the demo goes through the same
 * `matterFromRoom` a real answer does.
 *
 * Two answers, because the portal gives two. A lawyer sees every matter they
 * were added to; a client -- a guest on the portal -- sees only the rooms
 * shared with them. The portal does that filtering, not this application, and
 * the demo imitates it rather than filtering one list by a name.
 */
const daysAgo = (days: number) =>
  new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

const room = (
  id: number,
  title: string,
  tags: string[],
  lead: string,
  files: number,
  folders: number,
  updatedDaysAgo: number,
  color: string,
): RoomLike => ({
  id,
  title,
  tags,
  createdBy: { displayName: lead },
  filesCount: files,
  foldersCount: folders,
  updated: daysAgo(updatedDaysAgo),
  // No picture: `RoomIcon` draws the initials on the room's colour, which the
  // portal sends as six hex digits without a leading sign.
  logo: { original: "", large: "", medium: "", small: "", color },
});

const harper = room(
  101,
  "Harper v. Northwind Logistics",
  ["Practice: Employment", "Stage: Discovery"],
  "Daniel Reyes",
  18,
  5,
  1,
  "3B72A7",
);

const lease = room(
  104,
  "Lease renewal, 14 Canal Street",
  ["Practice: Real estate", "Stage: Negotiation"],
  "Tom Whitfield",
  9,
  4,
  12,
  "6E8B3D",
);

export const DEMO_ROOMS: Record<"lawyer" | "client", RoomLike[]> = {
  lawyer: [
    harper,
    room(
      102,
      "Estate of Margaret Ellis",
      ["Practice: Probate", "Stage: Intake"],
      "Priya Nair",
      4,
      3,
      2,
      "8C5AA8",
    ),
    room(
      103,
      "Sokolova residence permit",
      ["Practice: Immigration", "Stage: Hearing", "Urgent"],
      "Daniel Reyes",
      26,
      6,
      6,
      "C2553F",
    ),
    lease,
    room(
      105,
      "Okafor custody arrangement",
      ["Practice: Family", "Stage: Negotiation"],
      "Priya Nair",
      14,
      5,
      3,
      "D08A2E",
    ),
    room(
      106,
      "Brightwater acquisition",
      ["Practice: Corporate", "Stage: Due diligence"],
      "Tom Whitfield",
      41,
      7,
      2,
      "2E8C85",
    ),
    room(
      107,
      "Delgado v. City Transit",
      ["Practice: Personal injury", "Stage: Closed"],
      "Daniel Reyes",
      33,
      6,
      120,
      "737373",
    ),
    // Rooms that are not matters: no practice tag, so they are left out.
    room(
      108,
      "Firm templates",
      ["Internal"],
      "Priya Nair",
      22,
      3,
      30,
      "555F6B",
    ),
    room(109, "Marketing", [], "Tom Whitfield", 7, 1, 45, "555F6B"),
  ],
  client: [harper, lease],
};

export const DEMO_PEOPLE = {
  lawyer: "Daniel Reyes",
  client: "Emma Harper",
};
