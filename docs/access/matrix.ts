// Who may do what in ONLYOFFICE Apps, by portal user type and by room role.
//
// Transcribed from the product's access-rights specification ("Types and
// Roles. Access rights"), by way of `.claude/rules/access-matrix.md` in the
// DocSpace-client repository, which carries the same tables for the client.
// The specification is the source of truth: where it and this file disagree,
// this file is stale.

/** The five portal user types, in the order `getUserType` asks for them. */
export const PORTAL_TYPES = [
  { key: "O", label: "Owner", code: "EmployeeType.Owner", flag: "isOwner" },
  {
    key: "A",
    label: "Full admin",
    code: "EmployeeType.Admin",
    flag: "isAdmin",
  },
  {
    key: "RA",
    label: "Room admin",
    code: "EmployeeType.RoomAdmin",
    flag: "isRoomAdmin",
  },
  {
    key: "U",
    label: "User",
    code: "EmployeeType.User",
    flag: "isCollaborator",
  },
  { key: "G", label: "Guest", code: "EmployeeType.Guest", flag: "isVisitor" },
] as const;

/** The eight roles a member can hold inside one room. */
export const ROOM_ROLES = [
  { key: "RO", label: "Room owner", code: "ShareAccessRights.FullAccess" },
  { key: "RM", label: "Room manager", code: "ShareAccessRights.RoomManager" },
  {
    key: "CC",
    label: "Content creator",
    code: "ShareAccessRights.Collaborator",
  },
  { key: "Ed", label: "Editor", code: "ShareAccessRights.Editing" },
  { key: "FF", label: "Form filler", code: "ShareAccessRights.FormFilling" },
  { key: "Rv", label: "Reviewer", code: "ShareAccessRights.Review" },
  { key: "Cm", label: "Commentator", code: "ShareAccessRights.Comment" },
  { key: "Vw", label: "Viewer", code: "ShareAccessRights.ReadOnly" },
] as const;

export type TPortalTypeKey = (typeof PORTAL_TYPES)[number]["key"];
export type TRoomRoleKey = (typeof ROOM_ROLES)[number]["key"];

export type TAccessRow<K extends string> = {
  action: string;
  /** Who may; everyone else in the table's columns may not. */
  allowed: readonly K[];
};

export type TAccessMatrix =
  | {
      id: string;
      title: string;
      axis: "type";
      /** Leaves out the types that never reach the section at all. */
      columns?: readonly TPortalTypeKey[];
      rows: readonly TAccessRow<TPortalTypeKey>[];
    }
  | {
      id: string;
      title: string;
      axis: "role";
      columns?: readonly TRoomRoleKey[];
      rows: readonly TAccessRow<TRoomRoleKey>[];
    };

const ALL_TYPES = ["O", "A", "RA", "U", "G"] as const;
const STAFF = ["O", "A", "RA"] as const;
const ADMINS = ["O", "A"] as const;

const ALL_ROLES = ["RO", "RM", "CC", "Ed", "FF", "Rv", "Cm", "Vw"] as const;
const MANAGERS = ["RO", "RM"] as const;
const CREATORS = ["RO", "RM", "CC"] as const;

export const MATRICES = {
  myDocuments: {
    id: "my-documents",
    title: "My documents",
    axis: "type",
    rows: [
      { action: "Open the section", allowed: ["O", "A", "RA", "U"] },
      {
        action: "Create, upload, move, copy, rename, download, delete",
        allowed: ["O", "A", "RA", "U"],
      },
    ],
  },
  rooms: {
    id: "rooms",
    title: "Rooms",
    axis: "type",
    rows: [
      { action: "See all rooms", allowed: ADMINS },
      { action: "See rooms I own", allowed: STAFF },
      { action: "Create rooms", allowed: STAFF },
      { action: "See rooms I was invited to", allowed: ALL_TYPES },
      { action: "Pin rooms", allowed: ALL_TYPES },
      { action: "View members, history, room info", allowed: ALL_TYPES },
      { action: "Edit own rooms", allowed: STAFF },
      { action: "Invite external users to a room", allowed: ALL_TYPES },
      {
        action: "Invite portal users and groups to a room",
        allowed: ["O", "A", "RA", "U"],
      },
      { action: "Set a member's role when inviting", allowed: ALL_TYPES },
      { action: "Change member and group roles", allowed: STAFF },
      { action: "Remove members and groups", allowed: STAFF },
      { action: "Archive own rooms", allowed: STAFF },
      { action: "Duplicate own room", allowed: STAFF },
      { action: "Duplicate someone else's room", allowed: ADMINS },
      { action: "Change the owner of someone else's room", allowed: ADMINS },
      { action: "Archive someone else's room", allowed: ADMINS },
    ],
  },
  archive: {
    id: "archive",
    title: "Archive",
    axis: "type",
    rows: [
      { action: "See all archived rooms", allowed: ADMINS },
      { action: "See archived rooms I own", allowed: STAFF },
      { action: "See archived rooms I was invited to", allowed: ALL_TYPES },
      { action: "View members, history, room info", allowed: ALL_TYPES },
      { action: "Duplicate own room into Rooms", allowed: STAFF },
      { action: "Duplicate someone else's room into Rooms", allowed: ADMINS },
      { action: "Restore own room", allowed: STAFF },
      { action: "Restore any room", allowed: ADMINS },
      { action: "Delete own room", allowed: STAFF },
      { action: "Delete any room", allowed: ADMINS },
    ],
  },
  accounts: {
    id: "accounts",
    title: "Accounts",
    axis: "type",
    columns: STAFF,
    rows: [
      { action: "Invite a Full admin", allowed: ["O"] },
      { action: "Invite a Room admin", allowed: ADMINS },
      { action: "Invite a User", allowed: STAFF },
      { action: "Promote to Full admin", allowed: ["O"] },
      { action: "Promote to Room admin", allowed: ADMINS },
      { action: "Promote a Guest to User", allowed: STAFF },
      {
        action: "Demote a Full admin (to Room admin or User)",
        allowed: ["O"],
      },
      { action: "Demote a Room admin to User", allowed: ADMINS },
      { action: "Demote a User to Guest", allowed: ADMINS },
      { action: "Block or delete a Full admin", allowed: ["O"] },
      {
        action: "Block or delete a Room admin, User or Guest",
        allowed: ADMINS,
      },
      { action: "Reassign a deleted person's data", allowed: ADMINS },
      {
        action: "Create and edit groups, change their membership",
        allowed: ADMINS,
      },
      { action: "See the group list and its contents", allowed: STAFF },
      { action: "See guests invited by other people", allowed: ADMINS },
      { action: "See own guests", allowed: STAFF },
    ],
  },
  settings: {
    id: "settings",
    title: "Portal settings",
    axis: "type",
    rows: [
      { action: "Open portal settings", allowed: ADMINS },
      { action: "Delete the portal", allowed: ["O"] },
    ],
  },
  share: {
    id: "share",
    title: "Sharing files",
    axis: "type",
    rows: [
      {
        action: "Share files with portal users",
        allowed: ["O", "A", "RA", "U"],
      },
      { action: "Share files with guests", allowed: STAFF },
      { action: "Share with guests the sharer cannot see", allowed: ADMINS },
      { action: "See the user and group list while sharing", allowed: STAFF },
      { action: "Quick share for forms", allowed: ["O", "A", "RA", "U"] },
    ],
  },
  room: {
    id: "room",
    title: "The room itself",
    axis: "role",
    rows: [
      { action: "Edit the room", allowed: MANAGERS },
      { action: "Invite users, set their role on invite", allowed: ALL_ROLES },
      { action: "Change member roles", allowed: MANAGERS },
      { action: "Create, edit and delete room links", allowed: MANAGERS },
      { action: "Moderate people asking to join", allowed: MANAGERS },
      { action: "Remove members", allowed: MANAGERS },
      { action: "View members, history, room info", allowed: ALL_ROLES },
      { action: "Archive the room", allowed: ["RO"] },
      { action: "Delete the room", allowed: ["RO"] },
    ],
  },
  roomContent: {
    id: "room-content",
    title: "Files and folders in a room",
    axis: "role",
    rows: [
      { action: "Create, upload", allowed: CREATORS },
      { action: "Edit files", allowed: ["RO", "RM", "CC", "Ed"] },
      { action: "Fill form fields", allowed: ["RO", "RM", "CC", "Ed", "FF"] },
      { action: "Review", allowed: ["RO", "RM", "CC", "Ed", "Rv"] },
      {
        action: "Comment",
        allowed: ["RO", "RM", "CC", "Ed", "FF", "Rv", "Cm"],
      },
      { action: "Lock files against co-authors", allowed: CREATORS },
      { action: "View version history", allowed: ["RO", "RM", "CC", "Ed"] },
      { action: "Manage version history", allowed: CREATORS },
      { action: "Create, edit and delete file links", allowed: MANAGERS },
      {
        action: "View content and comments, copy, print, download",
        allowed: ALL_ROLES,
      },
      { action: "Save docxf as oform", allowed: CREATORS },
      { action: "Delete, move and copy own files", allowed: CREATORS },
      {
        action: "Delete, move, copy, rename other people's files",
        allowed: MANAGERS,
      },
      { action: "Copy files in from My documents", allowed: CREATORS },
    ],
  },
} as const satisfies Record<string, TAccessMatrix>;

export type TMatrixName = keyof typeof MATRICES;
