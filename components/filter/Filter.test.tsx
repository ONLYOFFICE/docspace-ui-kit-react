import React from "react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  act,
  render,
  screen,
  cleanup,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { DeviceType, FilterGroups, FilterKeys } from "../../enums";
import Filter from ".";
import {
  CustomItemRenderProps,
  TGetSelectedSortData,
  TSortDataItem,
} from "./Filter.types";
import { TViewAs } from "../../types";
import {
  ViewSelector,
  TViewSelectorOption,
} from "./sub-components/ViewSelector";

// Mock selectors
vi.mock("../../selectors/Groups", () => ({
  __esModule: true,
  default: ({ onSelect }: { onSelect: (items: unknown) => void }) => (
    <div data-testid="groups-selector">
      <button
        type="button"
        onClick={() => onSelect({ key: "group1", label: "Group 1" })}
      >
        Select Group
      </button>
    </div>
  ),
}));

vi.mock("../../selectors/People", () => ({
  __esModule: true,
  default: ({ onSelect }: { onSelect: (items: unknown) => void }) => (
    <div data-testid="people-selector">
      <button
        type="button"
        onClick={() => onSelect({ key: "user1", label: "User 1" })}
      >
        Select User
      </button>
    </div>
  ),
}));

vi.mock("../../selectors/Room", () => ({
  __esModule: true,
  default: ({ onSelect }: { onSelect: (items: unknown) => void }) => (
    <div data-testid="room-selector">
      <button
        type="button"
        onClick={() => onSelect({ key: "room1", label: "Room 1" })}
      >
        Select Room
      </button>
    </div>
  ),
}));

const baseProps = {
  onSearch: vi.fn(),
  onClearFilter: vi.fn(),
  clearSearch: false,
  setClearSearch: vi.fn(),
  getSelectedInputValue: vi.fn(() => ""),
  placeholder: "Search...",
  isIndexEditingMode: false,
  getSortData: vi.fn(() => []),
  getSelectedSortData: vi.fn(
    () => ({}) as TSortDataItem,
  ) as TGetSelectedSortData,
  onChangeViewAs: vi.fn(),
  view: "tile",
  viewAs: "tile" as TViewAs,
  viewSelectorVisible: true,
  onSort: vi.fn(),
  getFilterData: vi.fn(() => Promise.resolve([])),
  getSelectedFilterData: vi.fn(() => Promise.resolve([])),
  getViewSettingsData: vi.fn(() => []),
  clearAll: vi.fn(),
  isRecentFolder: false,
  removeSelectedItem: vi.fn(),
  isRooms: false,
  isContactsPage: false,
  isContactsPeoplePage: false,
  isContactsGroupsPage: false,
  isContactsInsideGroupPage: false,
  isContactsGuestsPage: false,
  isIndexing: false,
  filterTitle: "Filter",
  sortByTitle: "Sort by",
  currentDeviceType: DeviceType.desktop,
  userId: "1",
  filterHeader: "Filter",
  selectorLabel: "Select",
  onFilter: vi.fn(),
  onSortButtonClick: vi.fn(() => Promise.resolve([])),
  setEditRoomGroupsDialogVisible: vi.fn(),
};

describe("Filter Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = (props = {}) => {
    return render(<Filter {...baseProps} {...props} />);
  };

  describe("Search Input", () => {
    it("clears search when clearSearch prop is true", async () => {
      const onClearFilter = vi.fn();
      const setClearSearch = vi.fn();

      await act(async () => {
        renderComponent({
          clearSearch: true,
          onClearFilter,
          setClearSearch,
        });
      });

      expect(onClearFilter).toHaveBeenCalled();
      expect(setClearSearch).toHaveBeenCalledWith(false);
    });

    it("does not let a stale query the host applies late overwrite a newer edit", async () => {
      const user = userEvent.setup();
      const onSearch = vi.fn();
      const { rerender } = renderComponent({ onSearch });
      const field = screen.getByPlaceholderText(
        "Search...",
      ) as HTMLInputElement;

      await user.type(field, "budget");
      await vi.waitFor(() => expect(onSearch).toHaveBeenCalledWith("budget"), {
        timeout: 3000,
      });
      // The user clears the field before the host has applied "budget".
      await user.clear(field);
      await vi.waitFor(() => expect(onSearch).toHaveBeenLastCalledWith(""), {
        timeout: 3000,
      });

      // Now the host catches up with the older query...
      rerender(
        <Filter
          {...baseProps}
          onSearch={onSearch}
          getSelectedInputValue={() => "budget"}
        />,
      );
      // ...which must not come back into the field, nor be searched again.
      expect(field.value).toBe("");
      await new Promise((resolve) => setTimeout(resolve, 1200));
      expect(onSearch).toHaveBeenLastCalledWith("");

      // A new identity returning the same value brings nothing new either.
      rerender(
        <Filter
          {...baseProps}
          onSearch={onSearch}
          getSelectedInputValue={() => "budget"}
        />,
      );
      expect(field.value).toBe("");

      // A value the user never sent is the host's own, and is shown.
      rerender(
        <Filter
          {...baseProps}
          onSearch={onSearch}
          getSelectedInputValue={() => "external"}
        />,
      );
      expect(field.value).toBe("external");
    }, 10000);
    it("leaves the field out and keeps the main button when hideSearch is set", async () => {
      await act(async () => {
        renderComponent({
          hideSearch: true,
          showMainButton: true,
          mainButtonProps: { text: "New", model: [] },
          initSearchValue: "draft",
        });
      });

      expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
      expect(screen.queryByDisplayValue("draft")).not.toBeInTheDocument();
      expect(screen.getByText("New")).toBeInTheDocument();
    });
  });

  describe("keyboard", () => {
    it("keeps the search field in the tab order", async () => {
      await act(async () => {
        renderComponent();
      });

      expect(screen.getByRole("textbox")).not.toHaveAttribute("tabindex");
    });

    it("opens the filter panel from the keyboard", async () => {
      const user = userEvent.setup();
      const getFilterData = vi.fn().mockResolvedValue([]);
      await act(async () => {
        renderComponent({ getFilterData });
      });
      const button = screen.getByTestId("filter_icon_button");

      expect(button).toHaveAttribute("role", "button");
      expect(button).toHaveAttribute("aria-expanded", "false");

      button.focus();
      await user.keyboard("{Enter}");

      expect(button).toHaveAttribute("aria-expanded", "true");
    });

    it("opens the sort list from the keyboard and sorts with Enter", async () => {
      const user = userEvent.setup();
      const onSort = vi.fn();
      const sortData = [
        { id: "sort-title", key: "title", label: "Name", default: true },
        { id: "sort-date", key: "date", label: "Modified" },
      ];
      await act(async () => {
        renderComponent({
          onSort,
          getSortData: () => sortData,
          getSelectedSortData: () => ({
            sortId: "title",
            sortDirection: "asc",
          }),
        });
      });
      const sortButton = within(
        screen.getByTestId("filter_sort_combobox"),
      ).getByRole("button");

      sortButton.focus();
      await user.keyboard("{Enter}");

      expect(
        await screen.findByTestId("filter_sort_option_date"),
      ).toBeVisible();

      await user.keyboard("{ArrowDown}{Enter}");

      expect(onSort).toHaveBeenCalled();
    });
  });

  // The panel's tags were divs only the pointer could press: the keyboard
  // never reached a value, nor "Other" and the selector it opens.
  describe("Tags from the keyboard", () => {
    const getFilterData = () =>
      Promise.resolve([
        {
          key: FilterGroups.filterGroup,
          group: FilterGroups.filterGroup,
          label: "Group",
          isHeader: true,
        },
        {
          key: FilterKeys.withoutGroup,
          group: FilterGroups.filterGroup,
          label: "Without group",
        },
        {
          key: FilterKeys.other,
          group: FilterGroups.filterGroup,
          label: "Other",
        },
        {
          key: FilterKeys.selectedGroup,
          group: FilterGroups.filterGroup,
          displaySelectorType: "link",
        },
      ]);

    // The host draws the selector "Other" opens; its button picks a group.
    const renderSelector = ({
      selectorType,
      onSubmit,
    }: {
      selectorType: string;
      onSubmit: (items: { id: string; label: string }[]) => void;
    }) => (
      <div data-testid={selectorType}>
        <button
          type="button"
          onClick={() => onSubmit([{ id: "group-1", label: "Group 1" }])}
        >
          Pick
        </button>
      </div>
    );

    // Opens the selector from "Other" with the keyboard and picks Group 1.
    const pickFromKeyboard = async (
      user: ReturnType<typeof userEvent.setup>,
    ) => {
      const other = await screen.findByRole("button", { name: "Other" });
      other.focus();
      await user.keyboard("{Enter}");
      screen.getByRole("button", { name: "Pick" }).focus();
      await user.keyboard("{Enter}");
    };

    const openFilter = async () => {
      await act(async () => {
        renderComponent({ getFilterData, renderSelector });
      });
      await userEvent.click(screen.getByTestId("filter_icon_button"));
    };

    it("makes a value a toggle button that Enter presses", async () => {
      const user = userEvent.setup();
      await openFilter();
      const tag = await screen.findByRole("button", { name: "Without group" });

      expect(tag).toHaveAttribute("tabindex", "0");
      expect(tag).toHaveAttribute("aria-pressed", "false");

      tag.focus();
      await user.keyboard("{Enter}");

      expect(tag).toHaveAttribute("aria-pressed", "true");
    });

    it("makes Other a button that opens the selector", async () => {
      const user = userEvent.setup();
      await openFilter();
      const other = await screen.findByRole("button", { name: "Other" });

      expect(other).toHaveAttribute("aria-haspopup", "dialog");
      expect(other).not.toHaveAttribute("aria-pressed");

      other.focus();
      await user.keyboard("{Enter}");

      expect(await screen.findByTestId("groups-selector")).toBeInTheDocument();
    });

    // The dialog closes on an Escape keyup: one press on the selector step
    // used to close the whole filter.
    it("goes back from the selector to the filter on Escape", async () => {
      const user = userEvent.setup();
      await openFilter();
      const other = await screen.findByRole("button", { name: "Other" });
      other.focus();
      await user.keyboard("{Enter}");
      expect(await screen.findByTestId("groups-selector")).toBeInTheDocument();

      await user.keyboard("{Escape}");

      expect(screen.queryByTestId("groups-selector")).not.toBeInTheDocument();
      // Still in the filter, back on the tag that opened the selector.
      await waitFor(() =>
        expect(screen.getByRole("button", { name: "Other" })).toHaveFocus(),
      );
    });

    // A pick swaps "Other" for the picked value: the focus, which was in the
    // selector's list, used to fall on the page's body.
    it("gives the focus to the picked value after a pick", async () => {
      const user = userEvent.setup();
      await openFilter();

      await pickFromKeyboard(user);

      const picked = await screen.findByRole("button", { name: "Group 1" });
      expect(picked).toHaveAttribute("aria-haspopup", "dialog");
      await waitFor(() => expect(picked).toHaveFocus());
    });

    // The picked value's tag is the pointer's one target; to the keyboard its
    // label opens the selector again and its cross clears the value.
    it("clears the picked value with its cross and gives the focus to Other", async () => {
      const user = userEvent.setup();
      await openFilter();
      await pickFromKeyboard(user);
      await screen.findByRole("button", { name: "Group 1" });

      const remove = screen.getByRole("button", { name: "Remove" });
      expect(remove).toHaveAttribute("tabindex", "0");
      remove.focus();
      await user.keyboard("{Enter}");

      expect(
        screen.queryByRole("button", { name: "Group 1" }),
      ).not.toBeInTheDocument();
      await waitFor(() =>
        expect(screen.getByRole("button", { name: "Other" })).toHaveFocus(),
      );
    });

    it("opens the selector again from the picked value's label", async () => {
      const user = userEvent.setup();
      await openFilter();
      await pickFromKeyboard(user);
      const picked = await screen.findByRole("button", { name: "Group 1" });

      picked.focus();
      await user.keyboard("{Enter}");

      expect(await screen.findByTestId("groups-selector")).toBeInTheDocument();
    });
  });

  describe("Custom items", () => {
    const getFilterData = () =>
      Promise.resolve([
        {
          key: FilterGroups.filterOther,
          group: FilterGroups.filterOther,
          label: "Metadata",
          isHeader: true,
        },
        {
          key: "metadata",
          group: FilterGroups.filterOther,
          label: "",
          isCustom: true,
        },
      ]);

    const openFilter = async (props = {}) => {
      await act(async () => {
        renderComponent({ getFilterData, ...props });
      });
      await userEvent.click(screen.getByTestId("filter_icon_button"));
    };

    it("applies the value the host sets", async () => {
      const onFilter = vi.fn();
      const renderCustomItem = ({ onChange }: CustomItemRenderProps) => (
        <button
          type="button"
          onClick={() => onChange({ key: "stage", label: "Stage" })}
        >
          Set
        </button>
      );

      await openFilter({ onFilter, renderCustomItem });
      await userEvent.click(await screen.findByText("Set"));
      await userEvent.click(screen.getByTestId("filter_apply_button"));

      expect(onFilter).toHaveBeenCalledWith([
        { group: FilterGroups.filterOther, key: "stage", label: "Stage" },
      ]);
    });

    it("hands a value in force to renderCustomItem whole", async () => {
      const selected = [
        {
          key: '{"stage":"discovery","court":"supreme"}',
          group: FilterGroups.filterOther,
          label: "Case file",
          chips: [
            { key: "stage", label: "Stage is Discovery" },
            { key: "court", label: "Court is Supreme" },
          ],
        },
      ];
      const renderCustomItem = vi.fn(() => null);

      await openFilter({
        renderCustomItem,
        initSelectedFilterData: selected,
        getSelectedFilterData: () => selected,
      });

      await vi.waitFor(() =>
        expect(renderCustomItem).toHaveBeenLastCalledWith(
          expect.objectContaining({
            value: { key: selected[0].key, label: "Case file" },
          }),
        ),
      );
    });

    it("drops the value when the host sets null", async () => {
      const onFilter = vi.fn();
      const selected = [
        { key: "stage", group: FilterGroups.filterOther, label: "Stage" },
      ];
      const renderCustomItem = ({ onChange }: CustomItemRenderProps) => (
        <button type="button" onClick={() => onChange(null)}>
          Clear
        </button>
      );

      await openFilter({
        onFilter,
        renderCustomItem,
        initSelectedFilterData: selected,
        getSelectedFilterData: () => selected,
      });
      await userEvent.click(await screen.findByText("Clear"));
      await userEvent.click(screen.getByTestId("filter_apply_button"));

      expect(onFilter).toHaveBeenCalledWith([]);
    });

    it("opens and closes the nested step", async () => {
      const renderCustomItem = ({
        openPanel,
        closePanel,
      }: CustomItemRenderProps) => (
        <button
          type="button"
          onClick={() =>
            openPanel(() => (
              <button type="button" onClick={closePanel}>
                Back
              </button>
            ))
          }
        >
          Open
        </button>
      );

      await openFilter({ renderCustomItem });
      await userEvent.click(await screen.findByText("Open"));
      await userEvent.click(await screen.findByText("Back"));

      expect(screen.queryByText("Back")).not.toBeInTheDocument();
    });

    it("hands the nested step the value it has just set", async () => {
      const renderCustomItem = ({ openPanel }: CustomItemRenderProps) => (
        <button
          type="button"
          onClick={() =>
            openPanel(({ value, onChange }) => (
              <button
                type="button"
                onClick={() => onChange({ key: "stage", label: "Stage" })}
              >
                {value?.label ?? "Pick"}
              </button>
            ))
          }
        >
          Open
        </button>
      );

      await openFilter({ renderCustomItem });
      await userEvent.click(await screen.findByText("Open"));
      await userEvent.click(await screen.findByText("Pick"));

      expect(await screen.findByText("Stage")).toBeInTheDocument();
    });

    it("shows a value as its chips and removes them one by one", async () => {
      const removeSelectedItem = vi.fn();

      await act(async () => {
        renderComponent({
          removeSelectedItem,
          getSelectedFilterData: () =>
            Promise.resolve([
              {
                key: "state",
                group: FilterGroups.filterOther,
                label: "Case file",
                chips: [
                  { key: "stage", label: "Stage is Discovery" },
                  { key: "court", label: "Court is Supreme" },
                ],
              },
            ]),
        });
      });

      expect(screen.getByText("Stage is Discovery")).toBeInTheDocument();

      await userEvent.click(screen.getByText("Court is Supreme"));

      expect(removeSelectedItem).toHaveBeenCalledWith({
        key: "court",
        group: FilterGroups.filterOther,
      });
    });

    it("removes only the chip clicked when another group shares its key", async () => {
      await act(async () => {
        renderComponent({
          getSelectedFilterData: () =>
            Promise.resolve([
              {
                key: "date",
                group: FilterGroups.filterOther,
                label: "Modified",
                chips: [{ key: "from", label: "From 1 Jan" }],
              },
              {
                key: "size",
                group: FilterGroups.filterType,
                label: "Size",
                chips: [{ key: "from", label: "From 10 MB" }],
              },
            ]),
        });
      });

      await userEvent.click(screen.getByText("From 1 Jan"));

      expect(screen.queryByText("From 1 Jan")).not.toBeInTheDocument();
      expect(screen.getByText("From 10 MB")).toBeInTheDocument();
    });
  });
});

vi.mock("react-svg", () => ({
  ReactSVG: () => <div data-testid="mocked-svg" />,
}));

const mockViewSettings: TViewSelectorOption[] = [
  {
    value: "row",
    icon: "rowIcon.svg",
    id: "row-view",
  },
  {
    value: "tile",
    icon: "tileIcon.svg",
    id: "tile-view",
  },
  {
    value: "compact",
    icon: "compactIcon.svg",
    id: "compact-view",
  },
];

const viewSelectorDefaultProps = {
  isDisabled: false,
  isFilter: false,
  onChangeView: vi.fn(),
  viewAs: "row",
  viewSettings: mockViewSettings,
};

describe("<ViewSelector />", () => {
  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it("renders without error", () => {
    render(<ViewSelector {...viewSelectorDefaultProps} />);
    expect(screen.getByTestId("view-selector")).toBeInTheDocument();
  });

  it("renders all view options", () => {
    render(<ViewSelector {...viewSelectorDefaultProps} />);
    const icons = screen.getAllByTestId("view-selector-icon");
    expect(icons).toHaveLength(mockViewSettings.length);
  });

  it("calls onChangeView when clicking a view option", async () => {
    const onChangeView = vi.fn();
    render(
      <ViewSelector
        {...viewSelectorDefaultProps}
        onChangeView={onChangeView}
      />,
    );

    const icons = screen.getAllByTestId("view-selector-icon");
    const tileIcon = icons.find(
      (icon) => icon.getAttribute("data-view") === "tile",
    );
    await userEvent.click(tileIcon!);

    expect(onChangeView).toHaveBeenCalledWith("tile");
  });

  it("does not call onChangeView when disabled", async () => {
    const onChangeView = vi.fn();
    render(
      <ViewSelector
        {...viewSelectorDefaultProps}
        onChangeView={onChangeView}
        isDisabled
      />,
    );

    const icons = screen.getAllByTestId("view-selector-icon");
    const tileIcon = icons.find(
      (icon) => icon.getAttribute("data-view") === "tile",
    );
    await userEvent.click(tileIcon!);

    expect(onChangeView).not.toHaveBeenCalled();
  });

  it("applies custom className and style", () => {
    const customStyle = { backgroundColor: "red" };
    render(
      <ViewSelector
        {...viewSelectorDefaultProps}
        className="custom-class"
        style={customStyle}
      />,
    );

    const viewSelector = screen.getByTestId("view-selector");
    expect(viewSelector).toHaveClass("custom-class");
    expect(viewSelector.style.backgroundColor).toBe("red");
  });

  it.each(["{Enter}", " "])(
    "switches the view from the keyboard on %s",
    async (key) => {
      const user = userEvent.setup();
      const onChangeView = vi.fn();
      render(
        <ViewSelector
          {...viewSelectorDefaultProps}
          viewAs="row"
          isFilter
          onChangeView={onChangeView}
        />,
      );

      await user.tab();
      expect(screen.getByTestId("view-selector-icon")).toHaveFocus();

      await user.keyboard(key);
      expect(onChangeView).toHaveBeenCalledWith("tile");
    },
  );

  it("leaves a disabled selector out of the Tab order", () => {
    render(<ViewSelector {...viewSelectorDefaultProps} isDisabled />);

    for (const icon of screen.getAllByTestId("view-selector-icon"))
      expect(icon).not.toHaveAttribute("tabindex");
  });

  it("renders only one icon when isFilter is true", () => {
    render(
      <ViewSelector {...viewSelectorDefaultProps} viewAs="row" isFilter />,
    );

    const icons = screen.getAllByTestId("view-selector-icon");
    expect(icons).toHaveLength(1);
  });

  it("executes callback function when provided in viewSettings", async () => {
    const callback = vi.fn();
    const settingsWithCallback = [
      { ...mockViewSettings[0], callback },
      mockViewSettings[1],
    ];

    render(
      <ViewSelector
        {...viewSelectorDefaultProps}
        viewAs="tile"
        viewSettings={settingsWithCallback}
      />,
    );

    const icons = screen.getAllByTestId("view-selector-icon");
    const rowIcon = icons.find(
      (icon) => icon.getAttribute("data-view") === "row",
    );
    await userEvent.click(rowIcon!);

    expect(callback).toHaveBeenCalled();
  });
});
