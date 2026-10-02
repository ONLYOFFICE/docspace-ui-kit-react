import { http } from "msw";

import { api, ok, page } from "../demoPortal";
import {
  DEMO_GROUPS,
  DEMO_PEOPLE,
  DEMO_SELF,
  type DemoEmployee,
} from "../fixtures/people";

const matches = (person: DemoEmployee, text: string) => {
  const needle = text.trim().toLowerCase();
  return (
    !needle ||
    person.displayName.toLowerCase().includes(needle) ||
    person.email.toLowerCase().includes(needle)
  );
};

// `EmployeeType` as the filter sends it, by name or by number.
const TYPE_TEST: Record<string, (person: DemoEmployee) => boolean> = {
  DocSpaceAdmin: (p) => p.isAdmin,
  "1": (p) => p.isAdmin,
  RoomAdmin: (p) => p.isRoomAdmin,
  "2": (p) => p.isRoomAdmin,
  User: (p) => p.isCollaborator,
  "4": (p) => p.isCollaborator,
  Guest: (p) => p.isVisitor,
  "3": (p) => p.isVisitor,
};

/** The people list, filtered the way `people/filter` and `people/search` are. */
const filterPeople = (url: URL) => {
  const params = url.searchParams;
  const text = params.get("filterValue") ?? params.get("query") ?? "";
  // `Area`: 1 people, 2 guests, 0 or absent both.
  const area = params.get("area");
  const status = params.get("employeeStatus");
  const types = [
    ...params.getAll("employeeTypes"),
    ...params.getAll("employeeType"),
  ].filter((type) => type && type !== "All" && type !== "0");
  const groupId = params.get("groupId");

  return DEMO_PEOPLE.filter((person) => {
    if (!matches(person, text)) return false;
    if ((area === "1" || area === "People") && person.isVisitor) return false;
    if ((area === "2" || area === "Guests") && !person.isVisitor) return false;
    if (status && status !== "7" && Number(status) !== person.status)
      return false;
    if (types.length && !types.some((type) => TYPE_TEST[type]?.(person)))
      return false;
    if (groupId && !person.groups.some((group) => group.id === groupId))
      return false;
    return true;
  });
};

const peopleList = ({ request }: { request: Request }) => {
  const url = new URL(request.url);
  const { slice, total } = page(filterPeople(url), url);
  return ok(slice, { count: slice.length, total });
};

const groupsList = ({ request }: { request: Request }) => {
  const url = new URL(request.url);
  const text = (url.searchParams.get("filterValue") ?? "").toLowerCase();
  const groups = DEMO_GROUPS.filter((group) =>
    group.name.toLowerCase().includes(text),
  ).map((group) => ({
    ...group,
    manager: null,
    isLDAP: false,
    membersCount: DEMO_PEOPLE.filter((person) =>
      person.groups.some((g) => g.id === group.id),
    ).length,
  }));
  const { slice, total } = page(groups, url);
  return ok(slice, { count: slice.length, total });
};

export const peopleHandlers = [
  http.get(api("people/@self"), () => ok(DEMO_SELF)),
  http.get(api("people/filter"), peopleList),
  http.get(api("people/search"), peopleList),
  http.get(api("people/:id"), ({ params }) => {
    const person = DEMO_PEOPLE.find((p) => p.id === params.id);
    return ok(person ?? DEMO_SELF);
  }),
  http.get(api("group"), groupsList),
  // "Shared with" lists for a room, folder or file: nobody has it yet, so
  // the selector offers every group.
  http.get(api("group/room/:id"), groupsList),
  http.get(api("group/folder/:id"), groupsList),
  http.get(api("group/file/:id"), groupsList),
];
