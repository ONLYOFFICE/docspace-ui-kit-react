import React, { useState, useEffect } from "react";

import type { ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen, waitFor, within } from "storybook/test";

import ViewRowsReactSvg from "../../assets/view-rows.react.svg";
import ViewTilesReactSvg from "../../assets/view-tiles.react.svg";

import { DeviceType, FilterGroups, FilterKeys } from "../../enums";
import Filter from ".";
import type { FilterProps, TItem, TSortDataItem } from "./Filter.types";
import {
  ViewSelector,
  type ViewSelectorProps,
} from "./sub-components/ViewSelector";

const mockSortData: TSortDataItem[] = [
  {
    key: "AZ",
    label: "Name",
    isSelected: false,
    id: "1",
    className: "",
    sortDirection: "asc",
    sortId: "1",
  },
  {
    key: "DateAndTime",
    label: "Modified",
    isSelected: false,
    id: "2",
    className: "",
    sortDirection: "asc",
    sortId: "1",
  },
  {
    key: "Size",
    label: "Size",
    isSelected: false,
    id: "3",
    className: "",
    sortDirection: "asc",
    sortId: "1",
  },
];

const mockViewSettings = [
  { id: "1", label: "List", value: "row", icon: <ViewRowsReactSvg /> },
  { id: "2", label: "Grid", value: "tile", icon: <ViewTilesReactSvg /> },
];

const defaultViewSettings = [
  { id: "row-view", value: "row", icon: <ViewRowsReactSvg /> },
  { id: "tile-view", value: "tile", icon: <ViewTilesReactSvg /> },
];

// The getters are module-level so their identity is stable across renders, as the component requires.
const getSortData = () => mockSortData;
const getSelectedSortData = () => ({
  sortDirection: "asc" as const,
  sortId: "AZ" as const,
});
const getViewSettingsData = () => mockViewSettings;
const getNoSelectedFilterData = () => Promise.resolve([]);
const getSelectedInputValue = () => "";

const documentTypeItems: TItem[] = [
  {
    key: FilterGroups.filterType,
    group: FilterGroups.filterType,
    label: "Type",
    isHeader: true,
    isLast: true,
  },
  {
    id: "filter_type-documents",
    key: "documents",
    group: FilterGroups.filterType,
    label: "Documents",
  },
  {
    id: "filter_type-spreadsheets",
    key: "spreadsheets",
    group: FilterGroups.filterType,
    label: "Spreadsheets",
  },
  {
    id: "filter_type-presentations",
    key: "presentations",
    group: FilterGroups.filterType,
    label: "Presentations",
  },
  {
    id: "filter_type-images",
    key: "images",
    group: FilterGroups.filterType,
    label: "Images",
    isLast: true,
  },
];

const selectedDocuments: TItem[] = [
  {
    id: "filter_type-documents",
    key: "documents",
    group: FilterGroups.filterType,
    label: "Documents",
    isSelected: true,
  },
];

const selectedChips: TItem[] = [
  {
    key: "documents",
    group: FilterGroups.filterType,
    label: "Documents",
  },
  {
    key: "me",
    group: FilterGroups.filterAuthor,
    label: "Me",
  },
  {
    key: FilterKeys.excludeSubfolders,
    group: FilterGroups.filterFolders,
    label: "Exclude subfolders",
  },
];

const optionKindItems = [
  {
    key: FilterGroups.filterType,
    group: FilterGroups.filterType,
    label: "Type",
    isHeader: true,
  },
  {
    id: "filter_type-documents",
    key: "documents",
    group: FilterGroups.filterType,
    label: "Documents",
  },
  {
    id: "filter_type-spreadsheets",
    key: "spreadsheets",
    group: FilterGroups.filterType,
    label: "Spreadsheets",
  },
  {
    key: FilterGroups.filterLocation,
    group: FilterGroups.filterLocation,
    label: "Location",
    isHeader: true,
  },
  {
    id: "filter_location",
    key: "filter_location",
    group: FilterGroups.filterLocation,
    withOptions: true,
    options: [
      { key: "anywhere", label: "Anywhere" },
      { key: "my-documents", label: "My documents" },
      { key: "shared", label: "Shared with me" },
    ],
  },
  {
    key: FilterGroups.filterFolders,
    group: FilterGroups.filterFolders,
    label: "Search",
    isHeader: true,
    withoutHeader: true,
    isLast: true,
  },
  {
    id: "filter_folders",
    key: FilterKeys.excludeSubfolders,
    group: FilterGroups.filterFolders,
    label: "Exclude subfolders",
    isCheckbox: true,
  },
] as TItem[];

const groupIcon = {
  id: "folder",
  data: {
    small:
      '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path d="M1 3.5A1.5 1.5 0 0 1 2.5 2h3.4l1.5 1.5h6.1A1.5 1.5 0 0 1 15 5v7.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 12.5z" fill="#657077"/></svg>',
    default: "",
  },
};

const mockRoomGroups = [
  "Projects",
  "Clients",
  "Contracts",
  "Invoices",
  "Reports",
  "Templates",
  "Drafts",
  "Research",
  "Design",
  "Legal",
  "Partners",
  "Training",
  "Events",
  "Archive",
].map((name, index) => ({
  id: String(index + 1),
  name,
  icon: groupIcon,
  userId: "1",
  totalRooms: 3,
}));

const getAllRoomGroups = () => Promise.resolve(mockRoomGroups);

const baseFilterArgs = {
  viewAs: "row",
  view: "View",
  getSortData,
  getSelectedSortData,
  getViewSettingsData,
  getSelectedFilterData: getNoSelectedFilterData,
  getSelectedInputValue,
  getFilterData: () => Promise.resolve(documentTypeItems),
  onSearch: fn(),
  onClearFilter: fn(),
  onChangeViewAs: fn(),
  onSort: fn(),
  onFilter: fn(),
  onSortButtonClick: fn(),
  removeSelectedItem: fn(),
  clearAll: fn(),
  setClearSearch: fn(),
  clearSearch: false,
  filterTitle: "Filter",
  sortByTitle: "Sort by",
  filterHeader: "Filter",
  selectorLabel: "Select",
  viewSelectorVisible: true,
  placeholder: "Search...",
  userId: "1",
  currentDeviceType: DeviceType.desktop,
  initSelectedFilterData: [],
  isRooms: false,
  isContactsPage: false,
  isContactsPeoplePage: false,
  isContactsGroupsPage: false,
  isContactsInsideGroupPage: false,
  isContactsGuestsPage: false,
  isIndexing: false,
  isIndexEditingMode: false,
  isRecentFolder: false,
} satisfies Partial<FilterProps>;

const meta = {
  title: "UI/Navigation/Filter",
  component: Filter,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
  },
  args: baseFilterArgs as FilterProps,
  argTypes: {
    placeholder: {
      control: "text",
      description:
        "Placeholder of the search box; nothing translates it for you",
    },
    onSearch: {
      action: "onSearch",
      description:
        "Called with the search string itself once typing pauses for a second, and with an empty string when the cross in the box is clicked",
    },
    onClearFilter: {
      action: "onClearFilter",
      description:
        "Called when the search box is emptied because `clearSearch` was raised",
    },
    clearSearch: {
      control: "boolean",
      description:
        "Raise it to empty the search box; the component clears the field, calls `onClearFilter` and lowers it again through `setClearSearch(false)`",
    },
    setClearSearch: {
      action: "setClearSearch",
      description: "Called with `false` once a requested clear is carried out",
    },
    getSelectedInputValue: {
      control: false,
      description:
        "Returns the text the search box shows, read each time the function changes; a value it returned before, or a query the user has already replaced, leaves the field alone",
    },
    initSearchValue: {
      control: "text",
      description: "Text the search box starts with, read once",
    },
    showMainButton: {
      control: "boolean",
      description:
        "Shows a main button inside the search box, to the left of the field; it needs `mainButtonProps` as well",
    },
    mainButtonProps: {
      control: false,
      description:
        "Props of the main button, such as its text and the items of its menu",
    },
    mainButtonIcon: {
      control: false,
      description:
        "Icon shown at 12 by 12 pixels inside the main button; a plus when omitted",
    },
    isIndexEditingMode: {
      control: "boolean",
      description:
        "Disables the search box and removes the filter button while the listing is being reordered",
    },
    isIndexing: {
      control: "boolean",
      description:
        "Removes the sort button and the view switch while the listing is being reordered",
    },
    getFilterData: {
      control: false,
      description:
        "Loads the groups of the filter panel: each group is a header item followed by its options, awaited every time the panel opens",
    },
    onFilter: {
      action: "onFilter",
      description:
        "Called with the whole new selection when Apply is pressed, and with an empty list when the panel's clear button empties a selection that was in force",
    },
    getSelectedFilterData: {
      control: false,
      description:
        "Returns the filters in force, which become the chips under the bar; give it a stable identity, because it is read again whenever the function changes",
    },
    initSelectedFilterData: {
      control: "object",
      description:
        "The filters in force at the first render, so the chips are right before `getSelectedFilterData` resolves",
    },
    removeSelectedItem: {
      action: "removeSelectedItem",
      description:
        "Called with the key and group of a chip when it is clicked; the chip leaves the bar at once, without waiting for the host",
    },
    clearAll: {
      action: "clearAll",
      description:
        'Called by the "Clear all" link, which appears once more than one chip carries a label',
    },
    filterHeader: {
      control: "text",
      description: "Heading of the filter panel; nothing translates it for you",
    },
    filterTitle: {
      control: "text",
      description: "Tooltip of the filter button",
    },
    selectorLabel: {
      control: "text",
      description:
        "Heading handed to `renderSelector` for the step where a group picks a person or a room",
    },
    renderSelector: {
      control: false,
      description:
        "Renders the step the panel opens when a group picks a person or a room; without it that step stays empty",
    },
    userId: {
      control: "text",
      description: "Id of the signed-in person, handed to `renderSelector`",
    },
    disableThirdParty: {
      control: "boolean",
      description: "Handed to `renderSelector` as it is",
    },
    isRooms: {
      control: "boolean",
      description:
        "Shows a loading skeleton in the filter panel for half a second before its options, and is handed to `renderSelector`",
    },
    isContactsPage: {
      control: "boolean",
      description:
        "Shapes the filter panel's loading skeleton for a contacts listing; the skeleton appears only while `isRooms` is set",
    },
    isContactsPeoplePage: {
      control: "boolean",
      description:
        "Shapes the filter panel's loading skeleton for a listing of people",
    },
    isContactsGroupsPage: {
      control: "boolean",
      description:
        "Shapes the filter panel's loading skeleton for a listing of groups",
    },
    isContactsInsideGroupPage: {
      control: "boolean",
      description:
        "Shapes the filter panel's loading skeleton for the members of one group",
    },
    isContactsGuestsPage: {
      control: "boolean",
      description:
        "Shapes the filter panel's loading skeleton for a listing of guests",
    },
    isFlowsPage: {
      control: "boolean",
      description:
        "Leaves only the search box: removes the filter button, the sort button and the view switch",
    },
    isRecentFolder: {
      control: "boolean",
      description:
        "Removes the sort button and keeps the view switch on the bar on every device",
    },
    getSortData: {
      control: false,
      description:
        "Returns the sort fields, read on mount and again whenever the listing's columns change",
    },
    getSelectedSortData: {
      control: false,
      description:
        "Returns the sort in force as a field key and a direction, `asc` or `desc`",
    },
    onSort: {
      action: "onSort",
      description:
        "Called with the chosen field's key and the direction; picking the current field again reverses the direction",
    },
    onSortButtonClick: {
      action: "onSortButtonClick",
      description:
        "Called with `false` when the sort menu opens and with `true` when it closes, and once with `true` on mount",
    },
    sortByTitle: {
      control: "text",
      description: "Tooltip of the sort button",
    },
    view: {
      control: "text",
      description:
        "Label of the row that holds the view switch inside the sort menu, shown below the desktop layout",
    },
    viewAs: {
      control: "select",
      options: ["row", "table", "tile"],
      description:
        'The listing\'s current view; `"table"` is shown as `"row"`, and the switch offers the other one',
    },
    viewSelectorVisible: {
      control: "boolean",
      description:
        "Whether the view switch is shown at all: beside the sort button on a desktop, inside the sort menu on smaller screens",
    },
    getViewSettingsData: {
      control: false,
      description:
        "Returns the views the switch offers, each with a value and an icon; give it a stable identity",
    },
    onChangeViewAs: {
      action: "onChangeViewAs",
      description:
        "Called when the view switch is clicked; the component keeps no view of its own, so `viewAs` has to change",
    },
    currentDeviceType: {
      control: "select",
      options: Object.values(DeviceType),
      description:
        "Picks the layout: on a desktop the view switch sits on the bar, on other devices it moves into the sort menu; nothing here measures the window",
    },
    withRoomGroups: {
      control: "boolean",
      description:
        "Allows the grouping row under the bar; it shows only together with `organizeRoomsGrouping`",
    },
    organizeRoomsGrouping: {
      control: "boolean",
      description: "Turns grouping on; without it the grouping row never shows",
    },
    roomGroups: {
      control: "object",
      description:
        "The groups shown as chips in the grouping row; a group whose `icon` is not an object is left out",
    },
    getAllRoomGroups: {
      control: false,
      description:
        "Awaited once when grouping turns on, and the grouping row waits for it; the chips themselves come from `roomGroups`",
    },
    onFilterByGroup: {
      action: "onFilterByGroup",
      description:
        'Called with a group\'s id when its chip is clicked, and with `null` for the "all" chip',
    },
    currentGroupId: {
      control: "text",
      description:
        'Id of the group whose chip is highlighted; the "all" chip is highlighted when it is empty',
    },
    isFormsSection: {
      control: "boolean",
      description:
        'Words the grouping row for spaces rather than rooms: "All spaces" instead of "All rooms"',
    },
    isFilterOrSearchActive: {
      control: "boolean",
      description:
        "Hides the grouping row and, if a group was chosen, calls `onFilterByGroup(null)`",
    },
    setEditRoomGroupsDialogVisible: {
      action: "setEditRoomGroupsDialogVisible",
      description:
        "Called by the management button at the end of the grouping row, and by the create chip shown when there are no groups",
    },
  },
} satisfies Meta<typeof Filter>;

type Story = StoryObj<ComponentProps<typeof Filter>>;

export default meta;

type PlayContext = Parameters<NonNullable<Story["play"]>>[0];

// The filter panel is an aside dialog in a portal.
const filterPanel = async () => {
  const panel = await waitFor(() => {
    const element = screen.getByTestId("modal-dialog");
    expect(element).toBeVisible();
    return element;
  });
  return within(panel);
};

// Closed, the panel unmounts.
const panelClosed = () =>
  waitFor(() => expect(screen.queryByTestId("modal-dialog")).toBeNull());

const tag = (key: string) => screen.getByTestId(`filter_tag_${key}`);

const applyButton = () => screen.getByTestId("filter_apply_button");

const openPanel = async ({ canvas, userEvent }: PlayContext) => {
  await userEvent.click(canvas.getByTestId("filter_icon_button"));
  return filterPanel();
};

const Wrapper = (props: { children: React.ReactNode }) => {
  return <div style={{ height: "140px" }}>{props.children}</div>;
};

const OpenOnMount = (props: { children: React.ReactNode; testId: string }) => {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      const button = ref.current?.querySelector(
        `[data-testid="${props.testId}"]`,
      ) as HTMLElement | null;
      button?.click();
    }, 100);

    return () => clearTimeout(timer);
  }, [props.testId]);

  return <div ref={ref}>{props.children}</div>;
};

const FilterTemplate = (args: FilterProps) => (
  <Wrapper>
    <Filter {...args} />
  </Wrapper>
);

const OpenPanelTemplate = (args: FilterProps) => (
  <Wrapper>
    <OpenOnMount testId="filter_icon_button">
      <Filter {...args} />
    </OpenOnMount>
  </Wrapper>
);

// The filter panel covers the whole window, so on the Docs page it gets a frame of its own.
const panelDocsStory = { inline: false, height: "480px" };

export const Default: Story = {
  render: (args) => <FilterTemplate {...args} />,
  play: async (context) => {
    const { args, canvas, userEvent } = context;
    // Typing searches.
    await userEvent.type(canvas.getByPlaceholderText("Search..."), "report");
    // The search is debounced.
    await waitFor(() => expect(args.onSearch).toHaveBeenCalledWith("report"), {
      timeout: 3000,
    });

    // The filter button opens the panel; Cancel closes it.
    const panel = await openPanel(context);
    await expect(panel.getByTestId("filter_block_header")).toHaveTextContent(
      "Filter",
    );
    await userEvent.click(panel.getByTestId("filter_cancel_button"));
    await panelClosed();

    // The sort menu reports the field picked.
    await userEvent.click(canvas.getByTestId("filter_sort_button"));
    await userEvent.click(
      await waitFor(() => screen.getByTestId("filter_sort_option_Size")),
    );
    await expect(args.onSort).toHaveBeenCalledWith("Size", "asc");

    // On a desktop the single view button switches to the other view.
    await userEvent.click(canvas.getByTestId("view-selector-icon"));
    await expect(args.onChangeViewAs).toHaveBeenCalledWith("tile");
  },
  parameters: {
    docs: {
      description: {
        story:
          "The bar as a desktop listing shows it: the search box, the filter button, the sort button and the button that switches to the other view. Change any prop live in the Controls panel below.",
      },
      source: {
        code: `<Filter
  placeholder="Search..."
  onSearch={setSearch}
  getFilterData={getFilterData}
  getSelectedFilterData={getSelectedFilterData}
  onFilter={applyFilter}
  getSortData={getSortData}
  getSelectedSortData={getSelectedSortData}
  onSort={applySort}
  getViewSettingsData={getViewSettingsData}
  viewAs="row"
  viewSelectorVisible
  onChangeViewAs={switchView}
  currentDeviceType={DeviceType.desktop}
  {...requiredProps}
/>`,
      },
    },
  },
};

export const DocumentTypes: Story = {
  render: (args) => <OpenPanelTemplate {...args} />,
  args: {
    getFilterData: () => Promise.resolve(documentTypeItems),
  },
  play: async ({ args, userEvent }) => {
    await filterPanel();
    // Apply waits for a change.
    await expect(applyButton()).toBeDisabled();
    await userEvent.click(await waitFor(() => tag("spreadsheets")));
    await expect(tag("spreadsheets")).toHaveAttribute("data-selected", "true");
    await userEvent.click(applyButton());
    await expect(args.onFilter).toHaveBeenCalledWith([
      expect.objectContaining({
        key: "spreadsheets",
        group: FilterGroups.filterType,
      }),
    ]);
    await panelClosed();
  },
  parameters: {
    docs: {
      story: panelDocsStory,
      description: {
        story:
          "The filter panel with one group of options, opened for you when the story loads. Pick a type and press Apply to see the selection reach `onFilter` in the Actions panel.",
      },
      source: {
        code: `<Filter
  getFilterData={() => Promise.resolve([
    { key: FilterGroups.filterType, group: FilterGroups.filterType, label: "Type", isHeader: true, isLast: true },
    { id: "filter_type-documents", key: "documents", group: FilterGroups.filterType, label: "Documents" },
    { id: "filter_type-spreadsheets", key: "spreadsheets", group: FilterGroups.filterType, label: "Spreadsheets" },
    { id: "filter_type-presentations", key: "presentations", group: FilterGroups.filterType, label: "Presentations" },
    { id: "filter_type-images", key: "images", group: FilterGroups.filterType, label: "Images", isLast: true },
  ])}
  {...props}
/>`,
      },
    },
  },
};

export const WithSelectedFilters: Story = {
  render: (args) => <OpenPanelTemplate {...args} />,
  args: {
    getFilterData: () => Promise.resolve(documentTypeItems),
    initSelectedFilterData: selectedDocuments,
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByTestId("filter_selected_item_documents"),
    ).toHaveTextContent("Documents");
    await filterPanel();
    await waitFor(() =>
      expect(tag("documents")).toHaveAttribute("data-selected", "true"),
    );
    await expect(applyButton()).toBeDisabled();
  },
  parameters: {
    docs: {
      story: panelDocsStory,
      description: {
        story:
          "A filter already in force when the bar mounts: its chip is under the search box and its option is highlighted in the panel, opened for you when the story loads (`initSelectedFilterData`). Apply stays disabled until the selection changes.",
      },
      source: {
        code: `<Filter
  initSelectedFilterData={[
    { id: "filter_type-documents", key: "documents", group: FilterGroups.filterType, label: "Documents", isSelected: true },
  ]}
  {...props}
/>`,
      },
    },
  },
};

export const MultipleFilterGroups: Story = {
  render: (args) => <OpenPanelTemplate {...args} />,
  args: {
    getFilterData: () =>
      Promise.resolve([
        {
          key: FilterGroups.filterType,
          group: FilterGroups.filterType,
          label: "Type",
          isHeader: true,
        },
        {
          id: "filter_type-documents",
          key: "documents",
          group: FilterGroups.filterType,
          label: "Documents",
        },
        {
          id: "filter_type-spreadsheets",
          key: "spreadsheets",
          group: FilterGroups.filterType,
          label: "Spreadsheets",
        },
        {
          key: FilterGroups.filterStatus,
          group: FilterGroups.filterStatus,
          label: "Status",
          isHeader: true,
        },
        {
          id: "filter_status-active",
          key: "active",
          group: FilterGroups.filterStatus,
          label: "Active",
        },
        {
          id: "filter_status-archived",
          key: "archived",
          group: FilterGroups.filterStatus,
          label: "Archived",
        },
        {
          key: FilterGroups.filterAuthor,
          group: FilterGroups.filterAuthor,
          label: "Author",
          isHeader: true,
          isLast: true,
        },
        {
          id: "filter_author-me",
          key: "me",
          group: FilterGroups.filterAuthor,
          label: "Me",
        },
        {
          id: "filter_author-shared",
          key: "shared",
          group: FilterGroups.filterAuthor,
          label: "Shared with me",
        },
      ]),
  },
  play: async ({ args, userEvent }) => {
    const panel = await filterPanel();
    for (const group of [
      FilterGroups.filterType,
      FilterGroups.filterStatus,
      FilterGroups.filterAuthor,
    ]) {
      await waitFor(() =>
        expect(panel.getByTestId(`filter_block_item_${group}`)).toBeVisible(),
      );
    }
    // One pick per group, applied together.
    await userEvent.click(tag("active"));
    await userEvent.click(tag("me"));
    await userEvent.click(applyButton());
    await expect(args.onFilter).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ key: "active" }),
        expect.objectContaining({ key: "me" }),
      ]),
    );
  },
  parameters: {
    docs: {
      story: panelDocsStory,
      description: {
        story:
          "Several groups in one panel, each under its heading and divided by a line, so a listing can be narrowed by type, status and author at once. The panel opens for you when the story loads; one option can be picked per group.",
      },
      source: {
        code: `<Filter
  getFilterData={() => Promise.resolve([
    { key: FilterGroups.filterType, group: FilterGroups.filterType, label: "Type", isHeader: true },
    { key: "documents", group: FilterGroups.filterType, label: "Documents" },
    { key: FilterGroups.filterStatus, group: FilterGroups.filterStatus, label: "Status", isHeader: true },
    { key: "active", group: FilterGroups.filterStatus, label: "Active" },
    { key: FilterGroups.filterAuthor, group: FilterGroups.filterAuthor, label: "Author", isHeader: true, isLast: true },
    { key: "me", group: FilterGroups.filterAuthor, label: "Me" },
  ])}
  {...props}
/>`,
      },
    },
  },
};

export const RoomsFilter: Story = {
  render: (args) => <OpenPanelTemplate {...args} />,
  args: {
    isRooms: true,
    getFilterData: () =>
      Promise.resolve([
        {
          key: FilterGroups.filterRoom,
          group: FilterGroups.filterRoom,
          label: "Room",
          isHeader: true,
          isLast: true,
        },
        {
          id: "filter_room-all",
          key: FilterKeys.withContent,
          group: FilterGroups.filterRoom,
          label: "All Rooms",
        },
        {
          id: "filter_room-marketing",
          key: "room-1",
          group: FilterGroups.filterRoom,
          label: "Marketing Room",
        },
        {
          id: "filter_room-development",
          key: "room-2",
          group: FilterGroups.filterRoom,
          label: "Development Room",
        },
        {
          id: "filter_room-sales",
          key: "room-3",
          group: FilterGroups.filterRoom,
          label: "Sales Room",
          isLast: true,
        },
      ]),
  },
  play: async () => {
    const panel = await filterPanel();
    // A skeleton first, then the rooms.
    await expect(panel.getByTestId("filter-block-loader")).toBeVisible();
    await waitFor(() => expect(tag("room-1")).toBeVisible(), {
      timeout: 2000,
    });
    await expect(panel.queryByTestId("filter-block-loader")).toBeNull();
  },
  parameters: {
    docs: {
      story: panelDocsStory,
      description: {
        story:
          "The panel of a listing of rooms: it shows a loading skeleton for half a second before the options appear, and passes the rooms flag on to `renderSelector` (`isRooms`). The panel opens for you when the story loads.",
      },
      source: {
        code: `<Filter
  isRooms
  getFilterData={() => Promise.resolve([
    { key: FilterGroups.filterRoom, group: FilterGroups.filterRoom, label: "Room", isHeader: true, isLast: true },
    { key: FilterKeys.withContent, group: FilterGroups.filterRoom, label: "All Rooms" },
    { key: "room-1", group: FilterGroups.filterRoom, label: "Marketing Room" },
    { key: "room-2", group: FilterGroups.filterRoom, label: "Development Room" },
  ])}
  {...props}
/>`,
      },
    },
  },
};

export const DisabledFilter: Story = {
  render: (args) => <FilterTemplate {...args} />,
  args: {
    isIndexEditingMode: true,
    isIndexing: true,
    getFilterData: () => Promise.resolve([]),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByPlaceholderText("Search...")).toBeDisabled();
    await expect(canvas.queryByTestId("filter_icon_button")).toBeNull();
    await expect(canvas.queryByTestId("filter_sort_button")).toBeNull();
    await expect(canvas.queryByTestId("view-selector-icon")).toBeNull();
  },
  parameters: {
    docs: {
      description: {
        story:
          "The bar while the listing is being reordered, when searching, filtering and sorting would fight the new order: the search box is disabled and the filter button is gone (`isIndexEditingMode`), and so are the sort button and the view switch (`isIndexing`).",
      },
      source: {
        code: `<Filter isIndexEditingMode isIndexing {...props} />`,
      },
    },
  },
};

// --- ViewSelector Stories ---

const InteractiveViewSelectorTemplate = ({
  viewAs: argsViewAs,
  onChangeView: _,
  ...rest
}: ViewSelectorProps) => {
  const [viewAs, setViewAs] = useState(argsViewAs);

  useEffect(() => {
    setViewAs(argsViewAs);
  }, [argsViewAs]);

  return (
    <ViewSelector
      {...rest}
      viewAs={viewAs}
      onChangeView={(view) => setViewAs(view)}
    />
  );
};

const ViewSelectorDefaultTemplate = () => {
  return (
    <InteractiveViewSelectorTemplate
      viewSettings={defaultViewSettings}
      viewAs="row"
      isDisabled={false}
      isFilter={false}
      onChangeView={() => {}}
    />
  );
};

export const ViewSelectorDefault: Story = {
  render: () => <ViewSelectorDefaultTemplate />,
  play: async ({ canvas, userEvent }) => {
    const [row, tile] = canvas.getAllByTestId("view-selector-icon");
    await expect(row.className).toMatch(/checked/);
    await userEvent.click(tile);
    await expect(tile.className).toMatch(/checked/);
    await expect(row.className).not.toMatch(/checked/);
  },
  parameters: {
    docs: {
      description: {
        story:
          "The view switch the sort menu holds on smaller screens: one button per view, the current one filled. Click the other icon to switch views.",
      },
      source: {
        code: `<ViewSelector
  viewSettings={[
    { id: "row-view", value: "row", icon: <ViewRowsReactSvg /> },
    { id: "tile-view", value: "tile", icon: <ViewTilesReactSvg /> },
  ]}
  viewAs="row"
  onChangeView={(view) => setViewAs(view)}
/>`,
      },
    },
  },
};

const ViewSelectorDisabledTemplate = () => {
  return (
    <InteractiveViewSelectorTemplate
      viewSettings={defaultViewSettings}
      viewAs="row"
      isDisabled
      isFilter={false}
      onChangeView={() => {}}
    />
  );
};

export const ViewSelectorDisabled: Story = {
  render: () => <ViewSelectorDisabledTemplate />,
  play: async ({ canvas, userEvent }) => {
    const [row, tile] = canvas.getAllByTestId("view-selector-icon");
    await userEvent.click(tile);
    await expect(row.className).toMatch(/checked/);
    await expect(tile.className).not.toMatch(/checked/);
  },
  parameters: {
    docs: {
      description: {
        story:
          "The view switch greyed out while switching views is not possible; clicks on its icons do nothing (`isDisabled`).",
      },
      source: {
        code: `<ViewSelector viewSettings={viewSettings} viewAs="row" isDisabled />`,
      },
    },
  },
};

const ViewSelectorFilterModeTemplate = () => {
  return (
    <InteractiveViewSelectorTemplate
      viewSettings={defaultViewSettings}
      viewAs="row"
      isDisabled={false}
      isFilter
      onChangeView={() => {}}
    />
  );
};

export const ViewSelectorFilterMode: Story = {
  render: () => <ViewSelectorFilterModeTemplate />,
  play: async ({ canvas, userEvent }) => {
    // One button, carrying the view it switches to.
    const button = canvas.getByTestId("view-selector-icon");
    await expect(button).toHaveAttribute("data-view", "tile");
    await userEvent.click(button);
    await expect(canvas.getByTestId("view-selector-icon")).toHaveAttribute(
      "data-view",
      "row",
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "The single button the bar shows on a desktop: it carries the icon of the view you would switch to, not the current one, and turns into the other icon when clicked (`isFilter`).",
      },
      source: {
        code: `<ViewSelector viewSettings={viewSettings} viewAs="row" isFilter />`,
      },
    },
  },
};

export const WithFilterChips: Story = {
  render: (args) => <FilterTemplate {...args} />,
  args: {
    initSelectedFilterData: selectedChips,
    getSelectedFilterData: () => selectedChips,
  },
  play: async ({ args, canvas, userEvent }) => {
    await expect(canvas.getByTestId("filter_selected_item_me")).toBeVisible();
    await userEvent.click(
      within(canvas.getByTestId("filter_selected_item_me")).getByText("Me"),
    );
    await expect(args.removeSelectedItem).toHaveBeenCalledWith(
      expect.objectContaining({ key: "me", group: FilterGroups.filterAuthor }),
    );
    await userEvent.click(canvas.getByTestId("filter_clear_all_link"));
    await expect(args.clearAll).toHaveBeenCalledTimes(1);
  },
  parameters: {
    docs: {
      description: {
        story:
          'The filters in force as chips under the bar, so the reader sees what narrows the listing and can drop any of it in one click. Click a chip to remove it (`removeSelectedItem`); the "Clear all" link appears once more than one chip is shown (`clearAll`).',
      },
      source: {
        code: `<Filter
  initSelectedFilterData={selected}
  getSelectedFilterData={getSelectedFilterData}
  removeSelectedItem={({ key, group }) => removeFilter(key, group)}
  clearAll={clearFilters}
  {...props}
/>`,
      },
    },
  },
};

export const PanelOptionKinds: Story = {
  render: (args) => <OpenPanelTemplate {...args} />,
  args: {
    getFilterData: () => Promise.resolve(optionKindItems),
  },
  play: async ({ args, userEvent }) => {
    const panel = await filterPanel();
    // A drop-down of values and a checkbox, besides the tags.
    await waitFor(() =>
      expect(panel.getAllByText("Anywhere")[0]).toBeVisible(),
    );
    const checkbox = within(
      panel.getByTestId(
        `filter_checkbox_container_${FilterKeys.excludeSubfolders}`,
      ),
    ).getByRole("checkbox");
    await userEvent.click(checkbox);
    await expect(checkbox).toBeChecked();
    await userEvent.click(applyButton());
    await expect(args.onFilter).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ key: FilterKeys.excludeSubfolders }),
      ]),
    );
  },
  parameters: {
    docs: {
      story: panelDocsStory,
      description: {
        story: `The kinds of option a group can hold besides tags, for filters that are not a choice among a few words. The panel opens for you when the story loads:

- **Documents**, **Spreadsheets** — tags, one of which can be picked
- **Anywhere** — a drop-down list of values (\`withOptions\` with \`options\`)
- **Exclude subfolders** — a checkbox, in a group without a heading (\`isCheckbox\`, \`withoutHeader\`)`,
      },
      source: {
        code: `<Filter
  getFilterData={() => Promise.resolve([
    { key: FilterGroups.filterType, group: FilterGroups.filterType, label: "Type", isHeader: true },
    { key: "documents", group: FilterGroups.filterType, label: "Documents" },
    { key: FilterGroups.filterLocation, group: FilterGroups.filterLocation, label: "Location", isHeader: true },
    { key: "filter_location", group: FilterGroups.filterLocation, withOptions: true, options: [
      { key: "anywhere", label: "Anywhere" },
      { key: "my-documents", label: "My documents" },
    ] },
    { key: FilterGroups.filterFolders, group: FilterGroups.filterFolders, label: "Search", isHeader: true, withoutHeader: true, isLast: true },
    { key: FilterKeys.excludeSubfolders, group: FilterGroups.filterFolders, label: "Exclude subfolders", isCheckbox: true },
  ])}
  {...props}
/>`,
      },
    },
  },
};

export const SortMenuOnTablet: Story = {
  render: (args) => (
    <div style={{ height: "300px" }}>
      <OpenOnMount testId="filter_sort_button">
        <Filter {...args} />
      </OpenOnMount>
    </div>
  ),
  args: {
    currentDeviceType: DeviceType.tablet,
  },
  play: async ({ args, userEvent }) => {
    // The view switch heads the open menu, above the sort fields.
    await waitFor(() =>
      expect(
        screen.getByTestId("filter_sort_view_selector_item"),
      ).toBeVisible(),
    );
    await userEvent.click(screen.getByTestId("filter_sort_option_DateAndTime"));
    await expect(args.onSort).toHaveBeenCalledWith("DateAndTime", "asc");
  },
  parameters: {
    docs: {
      story: { inline: false, height: "326px" },
      description: {
        story:
          "The sort menu on a device narrower than a desktop, opened for you when the story loads: the view switch has left the bar and heads the menu, above the sort fields (`currentDeviceType`). The current field carries an arrow for its direction; pick it again to reverse it (`onSort`).",
      },
      source: {
        code: `<Filter currentDeviceType={DeviceType.tablet} viewSelectorVisible {...props} />`,
      },
    },
  },
};

export const WithGroupingRow: Story = {
  render: (args) => (
    <div style={{ height: "180px" }}>
      <Filter {...args} />
    </div>
  ),
  args: {
    withRoomGroups: true,
    organizeRoomsGrouping: true,
    roomGroups: mockRoomGroups,
    getAllRoomGroups,
    currentGroupId: "2",
    onFilterByGroup: fn(),
    setEditRoomGroupsDialogVisible: fn(),
  },
  play: async ({ args, canvas, userEvent }) => {
    // The chosen group is highlighted; another chip chooses its group.
    const current = await waitFor(() => canvas.getByTestId("room_group_tag_2"));
    await expect(current).toHaveTextContent("Clients");
    await userEvent.click(canvas.getByTestId("room_group_tag_1"));
    await expect(args.onFilterByGroup).toHaveBeenCalled();
    await userEvent.click(canvas.getByTestId("create_group_icon_button"));
    await expect(args.setEditRoomGroupsDialogVisible).toHaveBeenCalled();
  },
  parameters: {
    docs: {
      description: {
        story:
          'A row of group chips under the bar, for a listing its host has sorted into groups: "All rooms" first, the chosen group highlighted (`currentGroupId`), and the groups that do not fit behind the "..." button. Click a chip to choose it (`onFilterByGroup`); the button at the end of the row opens the host\'s group management (`setEditRoomGroupsDialogVisible`).',
      },
      source: {
        code: `<Filter
  withRoomGroups
  organizeRoomsGrouping
  roomGroups={groups}
  getAllRoomGroups={loadGroups}
  currentGroupId="2"
  onFilterByGroup={filterByGroup}
  setEditRoomGroupsDialogVisible={openGroupManagement}
  {...props}
/>`,
      },
    },
  },
};

export const WithMainButton: Story = {
  render: (args) => <FilterTemplate {...args} />,
  args: {
    showMainButton: true,
    mainButtonProps: { text: "New", model: [] },
  },
  play: async ({ canvas }) => {
    await expect(
      within(canvas.getByTestId("filter_container")).getByText("New"),
    ).toBeVisible();
  },
  parameters: {
    docs: {
      description: {
        story:
          "A main button inside the search box, for a listing that has no room for one of its own beside the bar (`showMainButton`, `mainButtonProps`).",
      },
      source: {
        code: `<Filter
  showMainButton
  mainButtonProps={{ text: "New", model: menuItems }}
  {...props}
/>`,
      },
    },
  },
};

export const RightToLeft: Story = {
  render: (args) => (
    <div dir="rtl">
      <FilterTemplate {...args} />
    </div>
  ),
  globals: { direction: "rtl" },
  play: async ({ canvas }) => {
    // The search box at the right, the buttons at the left.
    const search = canvas.getByPlaceholderText("بحث").getBoundingClientRect();
    const filterButton = canvas
      .getByTestId("filter_icon_button")
      .getBoundingClientRect();
    await expect(search.left).toBeGreaterThan(filterButton.right);
  },
  args: {
    placeholder: "بحث",
    initSelectedFilterData: selectedChips,
    getSelectedFilterData: () => selectedChips,
  },
  parameters: {
    noPadding: true,
    docs: {
      // Framed so the right-to-left direction does not flip the rest of the Docs page.
      story: { inline: false, height: "166px" },
      description: {
        story:
          'The bar in a right-to-left interface: the search box starts at the right edge, the filter, sort and view buttons line up at the left, and the chips and the "Clear all" link run from right to left.',
      },
      source: {
        code: `<div dir="rtl">
  <Filter placeholder="بحث" {...props} />
</div>`,
      },
    },
  },
};

export const CssCustomization: Story = {
  render: (args) => (
    <div
      style={
        {
          height: "140px",
          "--filter-btn-border": "1px solid #0082c9",
          "--filter-btn-hover-border": "1px solid #004f7a",
          "--filter-btn-open-fill": "#0082c9",
          "--filter-btn-radius": "6px",
          "--filter-sort-bg": "#e6f3fb",
          "--filter-sort-selected-bg": "#cce5f6",
          "--filter-sort-fill": "#0082c9",
          "--filter-view-fill": "#e6f3fb",
          "--filter-view-checked": "#0082c9",
          "--filter-view-border": "#0082c9",
          "--filter-view-hover-border": "#004f7a",
          "--filter-view-hover-icon": "#004f7a",
        } as React.CSSProperties
      }
    >
      <Filter {...args} />
    </div>
  ),
  args: {
    getFilterData: () => Promise.resolve([]),
  },
  play: async ({ canvas }) => {
    const button = getComputedStyle(canvas.getByTestId("filter_icon_button"));
    await expect(button.borderTopColor).toBe("rgb(0, 130, 201)");
    await expect(button.borderTopLeftRadius).toBe("6px");
  },
  parameters: {
    docs: {
      description: {
        story: `The variables of the bar set on one wrapper -- the variables are listed under CSS variables on this page. Hover the filter and view buttons, and open the sort menu, to see the hover and menu values. The sort menu's view icons appear only below the desktop layout, so set those two with \`currentDeviceType\` in the Controls panel; the panel's variables apply only on \`:root\` or \`body\`, because it renders in a portal.`,
      },
      source: {
        code: `<div style={{
  "--filter-btn-border": "1px solid #0082c9",
  "--filter-btn-hover-border": "1px solid #004f7a",
  "--filter-btn-open-fill": "#0082c9",
  "--filter-btn-radius": "6px",
  "--filter-sort-bg": "#e6f3fb",
  "--filter-sort-selected-bg": "#cce5f6",
  "--filter-sort-fill": "#0082c9",
  "--filter-view-fill": "#e6f3fb",
  "--filter-view-checked": "#0082c9",
  "--filter-view-border": "#0082c9",
  "--filter-view-hover-border": "#004f7a",
  "--filter-view-hover-icon": "#004f7a",
}}>
  <Filter {...props} />
</div>`,
      },
    },
  },
};
