/**
 * Which of the two applications a signed-in person belongs in.
 *
 * The answer comes from the portal, not from this application: the portal
 * already says what everyone may do, and a second list of roles kept here
 * would drift from it the first time someone's type changes on the portal.
 * The mapping is the firm's convention, and the one every later sample uses:
 *
 *   Guest              -> the client cabinet. Clients are invited as guests,
 *                         who see only the rooms shared with them.
 *   Owner, admin       -> the lawyer's workspace, with firm settings.
 *   Room admin         -> the lawyer's workspace: room admins open and run
 *                         matters.
 *   Power user, user   -> the lawyer's workspace, working inside matters
 *                         others opened.
 */
export type Persona = "lawyer" | "client";

export type PersonaInfo = {
  persona: Persona;
  /** What the firm calls this person. */
  label: string;
  /** Why the portal's role leads here, in one sentence for the screen. */
  reason: string;
};

export type RoleFlags = {
  isOwner?: boolean | null;
  isAdmin?: boolean | null;
  isRoomAdmin?: boolean | null;
  isCollaborator?: boolean | null;
  isVisitor?: boolean | null;
};

export const personaFromRoles = (flags: RoleFlags): PersonaInfo => {
  if (flags.isVisitor) {
    return {
      persona: "client",
      label: "Client",
      reason:
        "A guest on the portal, so they see only the matters shared with them.",
    };
  }

  if (flags.isOwner || flags.isAdmin) {
    return {
      persona: "lawyer",
      label: "Managing partner",
      reason:
        "A portal admin, so the whole practice and its settings are theirs.",
    };
  }

  if (flags.isRoomAdmin) {
    return {
      persona: "lawyer",
      label: "Lawyer",
      reason: "A room admin, so they open matters and decide who joins them.",
    };
  }

  return {
    persona: "lawyer",
    label: flags.isCollaborator ? "Paralegal" : "Staff",
    reason: "Works inside matters that a lawyer opened and shared with them.",
  };
};
