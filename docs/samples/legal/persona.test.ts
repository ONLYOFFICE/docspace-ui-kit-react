import { describe, it, expect } from "vitest";

import { personaFromRoles } from "./persona";

describe("personaFromRoles", () => {
  it("sends a guest to the client cabinet", () => {
    expect(personaFromRoles({ isVisitor: true }).persona).toBe("client");
  });

  it("sends portal admins and the owner to the workspace", () => {
    expect(personaFromRoles({ isOwner: true })).toMatchObject({
      persona: "lawyer",
      label: "Managing partner",
    });
    expect(personaFromRoles({ isAdmin: true }).label).toBe("Managing partner");
  });

  it("tells a lawyer from a paralegal by the portal's room-admin role", () => {
    expect(personaFromRoles({ isRoomAdmin: true }).label).toBe("Lawyer");
    expect(personaFromRoles({ isCollaborator: true }).label).toBe("Paralegal");
    expect(personaFromRoles({}).label).toBe("Staff");
  });

  it("lets the guest flag win over anything else the profile says", () => {
    // A guest with a stale admin flag must never land in the workspace.
    expect(
      personaFromRoles({ isVisitor: true, isRoomAdmin: true }).persona,
    ).toBe("client");
  });
});
