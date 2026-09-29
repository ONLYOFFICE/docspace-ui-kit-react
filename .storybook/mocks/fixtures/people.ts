// The demo portal's people and groups. Every name and address is made up:
// `example.com` is reserved for exactly this (RFC 2606).

type DemoRole = "owner" | "admin" | "roomAdmin" | "user" | "guest";

type DemoPerson = {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  role: DemoRole;
  /** `EmployeeStatus`: 1 active, 2 disabled. */
  status?: 1 | 2;
  /** `EmployeeActivationStatus`: 1 activated, 2 invited and not yet signed in. */
  activationStatus?: 1 | 2;
  groups?: string[];
};

export const DEMO_GROUPS = [
  { id: "7e1f0a10-0000-4000-8000-000000000001", name: "Legal" },
  { id: "7e1f0a10-0000-4000-8000-000000000002", name: "Marketing" },
  { id: "7e1f0a10-0000-4000-8000-000000000003", name: "Sales" },
  { id: "7e1f0a10-0000-4000-8000-000000000004", name: "Engineering" },
  { id: "7e1f0a10-0000-4000-8000-000000000005", name: "Finance" },
];

const [LEGAL, MARKETING, SALES, ENGINEERING, FINANCE] = DEMO_GROUPS.map(
  (group) => group.id,
);

const PEOPLE: DemoPerson[] = [
  {
    id: "5a9e3c10-0000-4000-8000-000000000001",
    firstName: "Alex",
    lastName: "Morgan",
    title: "Managing partner",
    role: "owner",
    groups: [LEGAL],
  },
  {
    id: "5a9e3c10-0000-4000-8000-000000000002",
    firstName: "Priya",
    lastName: "Raman",
    title: "IT administrator",
    role: "admin",
    groups: [ENGINEERING],
  },
  {
    id: "5a9e3c10-0000-4000-8000-000000000003",
    firstName: "Jonas",
    lastName: "Weber",
    title: "Senior associate",
    role: "roomAdmin",
    groups: [LEGAL],
  },
  {
    id: "5a9e3c10-0000-4000-8000-000000000004",
    firstName: "Maria",
    lastName: "Silva",
    title: "Marketing lead",
    role: "roomAdmin",
    groups: [MARKETING],
  },
  {
    id: "5a9e3c10-0000-4000-8000-000000000005",
    firstName: "Kenji",
    lastName: "Sato",
    title: "Account executive",
    role: "user",
    groups: [SALES],
  },
  {
    id: "5a9e3c10-0000-4000-8000-000000000006",
    firstName: "Amara",
    lastName: "Okafor",
    title: "Financial analyst",
    role: "user",
    groups: [FINANCE],
  },
  {
    id: "5a9e3c10-0000-4000-8000-000000000007",
    firstName: "Lucas",
    lastName: "Martin",
    title: "Frontend developer",
    role: "user",
    groups: [ENGINEERING],
  },
  {
    id: "5a9e3c10-0000-4000-8000-000000000008",
    firstName: "Sofia",
    lastName: "Rossi",
    title: "Paralegal",
    role: "user",
    groups: [LEGAL],
  },
  {
    id: "5a9e3c10-0000-4000-8000-000000000009",
    firstName: "Noah",
    lastName: "Fischer",
    title: "Content writer",
    role: "user",
    groups: [MARKETING],
    activationStatus: 2,
  },
  {
    id: "5a9e3c10-0000-4000-8000-000000000010",
    firstName: "Elena",
    lastName: "Petrova",
    title: "Former sales manager",
    role: "user",
    groups: [SALES],
    status: 2,
  },
  {
    id: "5a9e3c10-0000-4000-8000-000000000011",
    firstName: "Daniel",
    lastName: "Kim",
    title: "External auditor",
    role: "guest",
  },
  {
    id: "5a9e3c10-0000-4000-8000-000000000012",
    firstName: "Olivia",
    lastName: "Brown",
    title: "Client",
    role: "guest",
  },
  {
    id: "5a9e3c10-0000-4000-8000-000000000013",
    firstName: "Mateo",
    lastName: "Garcia",
    title: "Contractor",
    role: "guest",
    activationStatus: 2,
  },
];

const ROLE_FLAGS: Record<DemoRole, Record<string, boolean>> = {
  owner: { isOwner: true, isAdmin: true },
  admin: { isAdmin: true },
  roomAdmin: { isRoomAdmin: true },
  user: { isCollaborator: true },
  guest: { isVisitor: true },
};

const toEmployee = (person: DemoPerson) => {
  const displayName = `${person.firstName} ${person.lastName}`;
  return {
    id: person.id,
    displayName,
    firstName: person.firstName,
    lastName: person.lastName,
    userName: `${person.firstName}.${person.lastName}`.toLowerCase(),
    email: `${person.firstName}.${person.lastName}@example.com`.toLowerCase(),
    title: person.title,
    // No picture: the kit draws initials for "default_user_photo", and a
    // path here would be an image request the fixtures would have to serve.
    avatar: "",
    avatarSmall: "",
    avatarMax: "",
    hasAvatar: false,
    isOwner: false,
    isAdmin: false,
    isRoomAdmin: false,
    isCollaborator: false,
    isVisitor: false,
    ...ROLE_FLAGS[person.role],
    isLDAP: false,
    isSSO: false,
    status: person.status ?? 1,
    activationStatus: person.activationStatus ?? 1,
    isAnonim: false,
    cultureName: "en-US",
    groups: (person.groups ?? []).map((groupId) => ({
      id: groupId,
      name: DEMO_GROUPS.find((group) => group.id === groupId)?.name ?? "",
      manager: "",
    })),
    workFrom: "2024-02-01T09:00:00.0000000+00:00",
    profileUrl: "",
    shared: false,
  };
};

export const DEMO_PEOPLE = PEOPLE.map(toEmployee);

/** Whose key the demo portal pretends to be: its owner. */
export const DEMO_SELF = DEMO_PEOPLE[0];

export type DemoEmployee = (typeof DEMO_PEOPLE)[number];

export const isGuest = (person: DemoEmployee) => person.isVisitor;

/** The small author block rooms, files and folders carry. */
export const authorOf = (person: DemoEmployee) => ({
  id: person.id,
  displayName: person.displayName,
  avatarSmall: "",
  profileUrl: "",
  hasAvatar: false,
  isAnonim: false,
});
