import React from "react";
import { act, render, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { TSelectorItem } from "../../components/selector";

/** The subset of the Selector contract these tests observe. */
type CapturedProps = {
  items: TSelectorItem[];
  loadNextPage: (startIndex: number) => void;
  tabsData?: { id: string; onClick: () => void }[];
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

const groups = (names: string[]) => ({
  data: {
    response: names.map((name) => ({ id: `g-${name}`, name })),
    count: names.length,
  },
});

const people = (names: string[]) => ({
  data: {
    response: names.map((name) => ({
      id: `u-${name}`,
      displayName: name,
      email: `${name}@example.com`,
    })),
    count: names.length,
  },
});

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
