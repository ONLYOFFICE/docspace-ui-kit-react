import React from "react";
import { act, render, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { TSelectorItem } from "../../components/selector";
import { apiPage, names } from "../../test/apiPage";

/** The subset of the Selector contract these tests observe. */
type CapturedProps = {
  items: TSelectorItem[];
  loadNextPage: (startIndex: number) => void | Promise<void>;
  tabsData?: { id: string; onClick: () => void }[];
  hasNextPage?: boolean;
  totalItems?: number;
};

const mocks = vi.hoisted(() => {
  const getGroups = vi.fn();
  const searchUsersByExtendedFilter = vi.fn();
  const getUsersWithRoomShared = vi.fn();
  const getGroupsWithRoomsShared = vi.fn();

  return {
    getGroups,
    searchUsersByExtendedFilter,
    getUsersWithRoomShared,
    getGroupsWithRoomsShared,
    // Stable across renders, as the real provider's clients are.
    api: {
      baseUrl: "",
      groupApi: { getGroups },
      peopleSearchApi: { searchUsersByExtendedFilter, getUsersWithRoomShared },
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

// Shaped as the portal answers: `count` is this page, `total` all matches.
const groups = (list: string[], total = list.length) =>
  apiPage(
    list.map((name) => ({ id: `g-${name}`, name })),
    total,
  );

const people = (list: string[], total = list.length) =>
  apiPage(
    list.map((name) => ({
      id: `u-${name}`,
      displayName: name,
      email: `${name}@example.com`,
    })),
    total,
  );

const labels = () => mocks.lastProps.items.map((item) => item.label);

const submit = {
  onSubmit: vi.fn(),
  submitButtonLabel: "Add",
  disableSubmitButton: false,
};

describe("<PeopleSelector /> Groups tab", () => {
  beforeEach(() => {
    mocks.getGroups.mockReset();
    mocks.searchUsersByExtendedFilter.mockReset();
    mocks.getUsersWithRoomShared.mockReset();
    mocks.getGroupsWithRoomsShared.mockReset();
    mocks.getGroups.mockResolvedValue(groups(["Legal", "Sales"]));
    mocks.searchUsersByExtendedFilter.mockResolvedValue(people(["Alex"]));
    mocks.getGroupsWithRoomsShared.mockResolvedValue(groups(["Shared"]));
  });

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

// The portal pages every list by 100 and reports the page in `count` and all
// the matches in `total`. Reading `count` as the total ends the list after the
// first page: on nct2, 100 of 327 people, the rest never requested.
describe("<PeopleSelector /> paging", () => {
  const PAGE = 100;
  const TOTAL = 327;

  beforeEach(() => {
    mocks.searchUsersByExtendedFilter.mockReset();
    mocks.getUsersWithRoomShared.mockReset();
    mocks.getGroupsWithRoomsShared.mockReset();
  });

  const loadsTheSecondPage = async (fetcher: ReturnType<typeof vi.fn>) => {
    await waitFor(() => expect(labels()).toHaveLength(PAGE));
    expect(mocks.lastProps.totalItems).toBe(TOTAL);
    expect(mocks.lastProps.hasNextPage).toBe(true);

    await act(async () => {
      await mocks.lastProps.loadNextPage(PAGE);
    });

    await waitFor(() => expect(labels()).toHaveLength(2 * PAGE));
    expect(fetcher).toHaveBeenLastCalledWith(
      expect.objectContaining({ startIndex: PAGE, count: PAGE }),
      expect.anything(),
    );
    expect(labels()[PAGE]).toBe("Member 101");
    expect(mocks.lastProps.hasNextPage).toBe(true);
  };

  it("goes on past the first page of the portal's people", async () => {
    mocks.searchUsersByExtendedFilter
      .mockResolvedValueOnce(people(names(PAGE), TOTAL))
      .mockResolvedValueOnce(people(names(PAGE, "Member", PAGE + 1), TOTAL));

    render(<PeopleSelector {...submit} />);

    await loadsTheSecondPage(mocks.searchUsersByExtendedFilter);
  });

  it("goes on past the first page of a room's people", async () => {
    mocks.getUsersWithRoomShared
      .mockResolvedValueOnce(people(names(PAGE), TOTAL))
      .mockResolvedValueOnce(people(names(PAGE, "Member", PAGE + 1), TOTAL));

    render(<PeopleSelector roomId={18082} {...submit} />);

    await loadsTheSecondPage(mocks.getUsersWithRoomShared);
  });

  it("goes on past the first page of a room's groups", async () => {
    mocks.getGroupsWithRoomsShared
      .mockResolvedValueOnce(groups(names(PAGE), TOTAL))
      .mockResolvedValueOnce(groups(names(PAGE, "Member", PAGE + 1), TOTAL));

    render(<PeopleSelector withGroups isGroupsOnly roomId={7} {...submit} />);

    await loadsTheSecondPage(mocks.getGroupsWithRoomsShared);
  });

  it("stops once the last page is in", async () => {
    mocks.getUsersWithRoomShared.mockResolvedValueOnce(people(names(42), 42));

    render(<PeopleSelector roomId={18082} {...submit} />);

    await waitFor(() => expect(labels()).toHaveLength(42));
    expect(mocks.lastProps.hasNextPage).toBe(false);
  });
});
