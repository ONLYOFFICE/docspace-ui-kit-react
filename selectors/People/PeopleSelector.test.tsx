import React from "react";
import { act, render, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { TSelectorItem } from "../../components/selector";

/** The subset of the Selector contract these tests observe. */
type CapturedProps = {
  items: TSelectorItem[];
  loadNextPage: (startIndex: number) => void;
  tabsData?: { id: string; onClick: () => void }[];
  hasNextPage?: boolean;
  totalItems?: number;
};

const mocks = vi.hoisted(() => {
  const getGroups = vi.fn();
  const searchUsersByExtendedFilter = vi.fn();
  const getGroupsWithRoomsShared = vi.fn();

  return {
    getGroups,
    searchUsersByExtendedFilter,
    getGroupsWithRoomsShared,
    // Stable across renders, as the real provider's clients are.
    api: {
      baseUrl: "",
      groupApi: { getGroups },
      peopleSearchApi: { searchUsersByExtendedFilter },
      groupSearchApi: { getGroupsWithRoomsShared },
    },
    lastProps: null as unknown as CapturedProps,
  };
});

vi.mock("../../providers/api/ApiProvider", () => ({
  useApi: () => mocks.api,
}));

vi.mock("../../context/ThemeContext", () => ({
  useTheme: () => ({ isBase: true }),
}));

// The real Selector is virtualized and measures the DOM, which jsdom reports
// as zero-height. The stub records its props and asks for page 0 whenever
// `loadNextPage` changes, as Selector.tsx does.
vi.mock("../../components/selector", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("../../components/selector")>();

  const SelectorStub = (props: CapturedProps) => {
    mocks.lastProps = props;

    const { loadNextPage } = props;

    React.useEffect(() => {
      loadNextPage(0);
    }, [loadNextPage]);

    return null;
  };

  return { ...actual, Selector: SelectorStub };
});

const { default: PeopleSelector } = await import("./index");

// The portal's envelope: `count` is the items in this answer, `total` every
// item the query matches.
const groups = (names: string[], total = names.length) => ({
  data: {
    response: names.map((name) => ({ id: `g-${name}`, name })),
    count: names.length,
    total,
  },
});

const people = (names: string[], total = names.length) => ({
  data: {
    response: names.map((name) => ({
      id: `u-${name}`,
      displayName: name,
      email: `${name}@example.com`,
    })),
    count: names.length,
    total,
  },
});

const labels = () => mocks.lastProps.items.map((item) => item.label);

const submit = {
  onSubmit: vi.fn(),
  submitButtonLabel: "Add",
  disableSubmitButton: false,
};

// A stable array, as a caller's memoized one: a new one every render would
// rebuild the page loader and ask for page 0 again.
const EXCLUDED = ["u-Bella"];
const EXCLUDED_PAGE = ["u-Alex", "u-Bella"];

// Asks for the page after `rows` drawn rows, as the Selector does. The loader
// is async: the braced body keeps its promise from `act`, which would take it
// for an async scope left unawaited.
const loadAfter = (rows: number) =>
  act(() => {
    mocks.lastProps.loadNextPage(rows);
  });

beforeEach(() => {
  mocks.getGroups.mockReset();
  mocks.searchUsersByExtendedFilter.mockReset();
  mocks.getGroupsWithRoomsShared.mockReset();
  mocks.getGroups.mockResolvedValue(groups(["Legal", "Sales"]));
  mocks.searchUsersByExtendedFilter.mockResolvedValue(people(["Alex"]));
  mocks.getGroupsWithRoomsShared.mockResolvedValue(groups(["Shared"]));
});

describe("<PeopleSelector /> paging", () => {
  // `count` is one page at most: read as the total it ended the list at the
  // first page, and the rest was never asked for.
  it("asks for the next page while the portal has more people", async () => {
    mocks.searchUsersByExtendedFilter.mockResolvedValueOnce(
      people(["Alex", "Bella"], 3),
    );
    render(<PeopleSelector {...submit} />);

    await waitFor(() => expect(labels()).toEqual(["Alex", "Bella"]));
    expect(mocks.lastProps.totalItems).toBe(3);
    expect(mocks.lastProps.hasNextPage).toBe(true);

    mocks.searchUsersByExtendedFilter.mockResolvedValueOnce(
      people(["Chris"], 3),
    );
    loadAfter(2);

    await waitFor(() => expect(labels()).toEqual(["Alex", "Bella", "Chris"]));
    expect(mocks.searchUsersByExtendedFilter).toHaveBeenLastCalledWith(
      expect.objectContaining({ startIndex: 2 }),
      expect.anything(),
    );
    expect(mocks.lastProps.hasNextPage).toBe(false);
  });

  // The Selector asks by the rows it draws, one fewer than the rows loaded
  // once the current user is left out: the portal is asked by its own rows.
  // The user used to be counted off again on every page, and the list ended
  // a row early.
  it("counts the current user off once across the pages", async () => {
    mocks.searchUsersByExtendedFilter.mockResolvedValueOnce(
      people(["Alex", "Me"], 5),
    );
    render(
      <PeopleSelector
        withOutCurrentAuthorizedUser
        currentUserId="u-Me"
        {...submit}
      />,
    );

    await waitFor(() => expect(labels()).toEqual(["Alex"]));
    expect(mocks.lastProps.totalItems).toBe(4);
    expect(mocks.lastProps.hasNextPage).toBe(true);

    mocks.searchUsersByExtendedFilter.mockResolvedValueOnce(
      people(["Bella", "Chris"], 5),
    );
    loadAfter(1);

    await waitFor(() => expect(labels()).toEqual(["Alex", "Bella", "Chris"]));
    expect(mocks.searchUsersByExtendedFilter).toHaveBeenLastCalledWith(
      expect.objectContaining({ startIndex: 2 }),
      expect.anything(),
    );
    expect(mocks.lastProps.totalItems).toBe(4);
    expect(mocks.lastProps.hasNextPage).toBe(true);

    mocks.searchUsersByExtendedFilter.mockResolvedValueOnce(
      people(["Dana"], 5),
    );
    loadAfter(3);

    await waitFor(() =>
      expect(labels()).toEqual(["Alex", "Bella", "Chris", "Dana"]),
    );
    expect(mocks.searchUsersByExtendedFilter).toHaveBeenLastCalledWith(
      expect.objectContaining({ startIndex: 4 }),
      expect.anything(),
    );
    expect(mocks.lastProps.totalItems).toBe(4);
    expect(mocks.lastProps.hasNextPage).toBe(false);
  });

  it("counts nobody off a list the current user is not in", async () => {
    mocks.searchUsersByExtendedFilter.mockResolvedValueOnce(
      people(["Alex", "Bella"]),
    );
    render(
      <PeopleSelector
        withOutCurrentAuthorizedUser
        currentUserId="u-Me"
        {...submit}
      />,
    );

    await waitFor(() => expect(labels()).toEqual(["Alex", "Bella"]));
    expect(mocks.lastProps.totalItems).toBe(2);
    expect(mocks.lastProps.hasNextPage).toBe(false);
  });

  it("counts an excluded row off once and loads past it", async () => {
    mocks.searchUsersByExtendedFilter.mockResolvedValueOnce(
      people(["Alex", "Bella"], 4),
    );
    render(<PeopleSelector excludeItems={EXCLUDED} {...submit} />);

    await waitFor(() => expect(labels()).toEqual(["Alex"]));
    expect(mocks.lastProps.totalItems).toBe(3);

    mocks.searchUsersByExtendedFilter.mockResolvedValueOnce(
      people(["Chris", "Dana"], 4),
    );
    loadAfter(1);

    await waitFor(() => expect(labels()).toEqual(["Alex", "Chris", "Dana"]));
    expect(mocks.searchUsersByExtendedFilter).toHaveBeenLastCalledWith(
      expect.objectContaining({ startIndex: 2 }),
      expect.anything(),
    );
    expect(mocks.lastProps.totalItems).toBe(3);
    expect(mocks.lastProps.hasNextPage).toBe(false);
  });

  // The Selector asks for the next page from the rows it draws: a first page
  // with every row left out used to leave a loader and no request behind it.
  it("loads on past a page with every row left out", async () => {
    mocks.searchUsersByExtendedFilter
      .mockResolvedValueOnce(people(["Alex", "Bella"], 4))
      .mockResolvedValueOnce(people(["Chris", "Dana"], 4));
    render(<PeopleSelector excludeItems={EXCLUDED_PAGE} {...submit} />);

    await waitFor(() => expect(labels()).toEqual(["Chris", "Dana"]));
    expect(mocks.searchUsersByExtendedFilter).toHaveBeenCalledTimes(2);
    expect(mocks.searchUsersByExtendedFilter).toHaveBeenLastCalledWith(
      expect.objectContaining({ startIndex: 2 }),
      expect.anything(),
    );
    expect(mocks.lastProps.totalItems).toBe(2);
    expect(mocks.lastProps.hasNextPage).toBe(false);
  });

  it("ends an empty list once every page had its rows left out", async () => {
    mocks.searchUsersByExtendedFilter.mockResolvedValueOnce(
      people(["Alex", "Bella"]),
    );
    render(<PeopleSelector excludeItems={EXCLUDED_PAGE} {...submit} />);

    await waitFor(() => expect(mocks.lastProps.hasNextPage).toBe(false));
    expect(labels()).toEqual([]);
    expect(mocks.lastProps.totalItems).toBe(0);
    expect(mocks.searchUsersByExtendedFilter).toHaveBeenCalledTimes(1);
  });

  it("ends the list on an empty page", async () => {
    mocks.searchUsersByExtendedFilter.mockResolvedValueOnce(
      people(["Alex", "Bella"], 3),
    );
    render(<PeopleSelector {...submit} />);

    await waitFor(() => expect(mocks.lastProps.hasNextPage).toBe(true));

    mocks.searchUsersByExtendedFilter.mockResolvedValueOnce(people([], 3));
    loadAfter(2);

    await waitFor(() => expect(mocks.lastProps.hasNextPage).toBe(false));
    expect(labels()).toEqual(["Alex", "Bella"]);
  });
});

describe("<PeopleSelector /> Groups tab", () => {
  it("lists the portal's groups when there is no roomId", async () => {
    render(<PeopleSelector withGroups isGroupsOnly {...submit} />);

    await waitFor(() => expect(labels()).toEqual(["Legal", "Sales"]));
    expect(mocks.getGroups).toHaveBeenCalledWith(
      expect.objectContaining({ startIndex: 0 }),
      expect.anything(),
    );
    expect(mocks.searchUsersByExtendedFilter).not.toHaveBeenCalled();
    expect(mocks.lastProps.items.every((item) => item.isGroup)).toBe(true);
  });

  it("switches from people to groups on the tab", async () => {
    render(<PeopleSelector withGroups {...submit} />);

    await waitFor(() => expect(labels()).toEqual(["Alex"]));

    const groupsTab = mocks.lastProps.tabsData?.find(
      (tab) => tab.id !== mocks.lastProps.tabsData?.[0].id,
    );
    act(() => groupsTab?.onClick());

    await waitFor(() => expect(labels()).toEqual(["Legal", "Sales"]));
    expect(mocks.searchUsersByExtendedFilter).toHaveBeenCalledTimes(1);
  });

  // The current user is left out of people, never of groups: a group list
  // has no current user in it to subtract.
  it("counts every portal group without the current user", async () => {
    mocks.getGroups.mockResolvedValue(groups(["Legal", "Sales"], 3));
    render(
      <PeopleSelector
        withGroups
        isGroupsOnly
        withOutCurrentAuthorizedUser
        {...submit}
      />,
    );

    await waitFor(() => expect(labels()).toEqual(["Legal", "Sales"]));
    expect(mocks.lastProps.totalItems).toBe(3);
    expect(mocks.lastProps.hasNextPage).toBe(true);
  });

  it("keeps the room's sharing query when a roomId is given", async () => {
    render(<PeopleSelector withGroups isGroupsOnly roomId={7} {...submit} />);

    await waitFor(() => expect(labels()).toEqual(["Shared"]));
    expect(mocks.getGroupsWithRoomsShared).toHaveBeenCalledWith(
      expect.objectContaining({ id: 7 }),
      expect.anything(),
    );
    expect(mocks.getGroups).not.toHaveBeenCalled();
  });
});
