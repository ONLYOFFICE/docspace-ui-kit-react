import React, { useState, useEffect } from "react";

import type { ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen, waitFor, within } from "storybook/test";

import ViewRowsReactSvg from "../../assets/view-rows.react.svg";
import ViewTilesReactSvg from "../../assets/view-tiles.react.svg";

import { DeviceType, FilterGroups, FilterKeys } from "../../enums";
import { Button, ButtonSize } from "../button";
import { Text } from "../text";
import Filter from ".";
import type {
  CustomItemRenderProps,
  FilterProps,
  TItem,
  TSortDataItem,
} from "./Filter.types";
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

// A host's own group: the enum lists only the groups the portal ships.
const ratingGroup = "filter-rating" as FilterGroups;

const ratingOptions = [
  { key: "3", label: "3 stars and up" },
  { key: "4", label: "4 stars and up" },
  { key: "5", label: "5 stars" },
];

const customGroupItems = [
  {
    key: ratingGroup,
    group: ratingGroup,
    label: "Rating",
    isHeader: true,
    isLast: true,
  },
  { key: "rating", group: ratingGroup, label: "", isCustom: true },
] as TItem[];

const RatingStep = ({
  onChange,
  closePanel,
}: Pick<CustomItemRenderProps, "onChange" | "closePanel">) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      padding: "16px",
    }}
  >
    <Text fontSize="16px" fontWeight={700}>
      Rating
    </Text>
    {ratingOptions.map((option) => (
      <Button
        key={option.key}
        label={option.label}
        size={ButtonSize.small}
        scale
        onClick={() => {
          onChange(option);
          closePanel();
        }}
      />
    ))}
    <Button label="Back" size={ButtonSize.small} scale onClick={closePanel} />
  </div>
);

const renderRatingItem = ({
  value,
  onChange,
  openPanel,
  closePanel,
}: CustomItemRenderProps) => (
  <div style={{ display: "flex", gap: "8px" }}>
    <Button
      label={value?.label ?? "Choose rating"}
      size={ButtonSize.small}
      onClick={() =>
        openPanel(() => (
          <RatingStep onChange={onChange} closePanel={closePanel} />
        ))
      }
    />
    {value ? (
      <Button
        label="Clear"
        size={ButtonSize.small}
        onClick={() => onChange(null)}
      />
    ) : null}
  </div>
);

const multiChipSelection: TItem[] = [
  {
    key: '{"rating":"4","reviews":"10"}',
    group: ratingGroup,
    label: "Rating",
    chips: [
      { key: "rating", label: "Rating: 4 stars and up" },
      { key: "reviews", label: "Reviews: 10 and more" },
    ],
  },
];

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
        "Placeholder of the search box. Nothing translates it for you.",
    },
    onSearch: {
      action: "onSearch",
      description:
        'Called with the search string, not an event, a second after typing stops. The cross calls it with `""` at once.',
    },
    onClearFilter: {
      action: "onClearFilter",
      description:
        "Called when the search box is cleared through `clearSearch`.",
    },
    clearSearch: {
      control: "boolean",
      description:
        "Set to `true` to clear the search box. The bar empties it, calls `onClearFilter`, then `setClearSearch(false)`.",
    },
    setClearSearch: {
      action: "setClearSearch",
      description:
        "Called with `false` once a requested clear has been carried out.",
    },
    getSelectedInputValue: {
      control: false,
      description:
        "Returns the text the search box shows, read whenever the function changes. A repeat or a replaced query leaves the field alone; any other value fills and focuses it.",
    },
    initSearchValue: {
      control: "text",
      description: "Text the search box starts with, read once.",
    },
    showMainButton: {
      control: "boolean",
      description:
        "Shows a MainButton before the search field. It needs `mainButtonProps` too.",
    },
    mainButtonProps: {
      control: false,
      description:
        "Props of that MainButton. Without them no main button is drawn.",
    },
    mainButtonIcon: {
      control: false,
      description:
        "Icon inside the main button, painted white in a 12px box. A plus by default.",
    },
    hideSearch: {
      control: "boolean",
      description:
        "Leaves the search field out of the bar while the main button stays. Without a main button the search block is empty space.",
    },
    isIndexEditingMode: {
      control: "boolean",
      description: "Removes the filter button and disables the search box.",
    },
    isIndexing: {
      control: "boolean",
      description:
        "Whether the listing is being reordered, which removes the sort button and the view selector.",
    },
    getFilterData: {
      control: false,
      description:
        "Loads the groups of filter options, awaited when the filter panel opens.",
    },
    onFilter: {
      action: "onFilter",
      description:
        "Called with the whole new selection when Apply is pressed, and with `[]` from the panel's clear icon.",
    },
    getSelectedFilterData: {
      control: false,
      description:
        "Returns the filters in force, drawn as chips under the bar. Re-read whenever the function changes, so keep it stable.",
    },
    initSelectedFilterData: {
      control: "object",
      description:
        "The filters in force at the first render, so the chips are right before `getSelectedFilterData` has resolved.",
    },
    removeSelectedItem: {
      action: "removeSelectedItem",
      description:
        "Called when a chip is clicked or its cross pressed. The bar has already dropped the chip by then.",
    },
    clearAll: {
      action: "clearAll",
      description:
        'Called by the "clear all" link, which appears once more than one chip carries a label.',
    },
    filterHeader: {
      control: "text",
      description:
        "Heading of the filter panel, and its accessible name. Nothing translates it for you.",
    },
    filterTitle: {
      control: "text",
      description: "Tooltip and accessible name of the filter button.",
    },
    selectorLabel: {
      control: "text",
      description: "Passed to `renderSelector` as the heading of its step.",
    },
    renderSelector: {
      control: false,
      description:
        "Renders the step a selector item opens inside the panel. Without it that step is empty.",
    },
    renderCustomItem: {
      control: false,
      description:
        "Renders a group item marked `isCustom`. Without it such an item is empty.",
    },
    userId: {
      control: "text",
      description:
        "Passed to `renderSelector`; the bar itself does nothing with it.",
    },
    disableThirdParty: {
      control: "boolean",
      description:
        "Forwarded unchanged to `renderSelector`; nothing in the bar or the panel reads it.",
    },
    isRooms: {
      control: "boolean",
      description:
        "Shows a skeleton in the opening panel until the groups arrive, and is passed to `renderSelector`.",
    },
    isContactsPage: {
      control: "boolean",
      description:
        "Shapes the panel's skeleton, which only `isRooms` shows. The groups come from `getFilterData`.",
    },
    isContactsPeoplePage: {
      control: "boolean",
      description: "Shapes the panel's skeleton, which only `isRooms` shows.",
    },
    isContactsGroupsPage: {
      control: "boolean",
      description: "Shapes the panel's skeleton, which only `isRooms` shows.",
    },
    isContactsInsideGroupPage: {
      control: "boolean",
      description: "Shapes the panel's skeleton, which only `isRooms` shows.",
    },
    isContactsGuestsPage: {
      control: "boolean",
      description: "Shapes the panel's skeleton, which only `isRooms` shows.",
    },
    isFlowsPage: {
      control: "boolean",
      description:
        "Removes the filter button, the sort button and the view selector, leaving the search box alone.",
    },
    isRecentFolder: {
      control: "boolean",
      description:
        "Whether the listing is the recent folder. It hides the sort button and keeps the view selector on screen below the desktop breakpoint.",
    },
    getSortData: {
      control: false,
      description:
        "Returns the sort options. Read on mount, on a column change and when either sort getter changes.",
    },
    getSelectedSortData: {
      control: false,
      description:
        "Returns the sort in force, read with `getSortData`. After a pick the menu keeps its own.",
    },
    onSort: {
      action: "onSort",
      description:
        "Called with the picked key and direction. Picking the current key again reverses the direction.",
    },
    onSortButtonClick: {
      action: "onSortButtonClick",
      description:
        "Called with `true` when the sort menu opens and `false` when it closes.",
    },
    sortByTitle: {
      control: "text",
      description:
        "Accessible name of the sort button, and its tooltip on the wrapper.",
    },
    view: {
      control: "text",
      description:
        "Text beside the view selector inside the sort menu, shown below the desktop layout.",
    },
    viewAs: {
      control: "select",
      options: ["row", "table", "tile"],
      description:
        'The listing\'s current view. `"table"` is treated as `"row"` by the sort menu and the view selector.',
    },
    viewSelectorVisible: {
      control: "boolean",
      description:
        "Shows the view selector: beside the sort button on a desktop, inside the sort menu below it.",
    },
    getViewSettingsData: {
      control: false,
      description:
        "Returns the views the selector offers. Read on every render and when it changes, so a new function each render loops.",
    },
    onChangeViewAs: {
      action: "onChangeViewAs",
      description:
        "Called with the view picked in the view selector. The bar keeps no view state of its own.",
    },
    currentDeviceType: {
      control: "select",
      options: Object.values(DeviceType),
      description:
        "Picks where the view selector goes: beside the sort button on a desktop, inside the sort menu below.",
    },
    withRoomGroups: {
      control: "boolean",
      description:
        "Allows the grouping row, which also needs `organizeRoomsGrouping` and no `isFilterOrSearchActive`.",
    },
    organizeRoomsGrouping: {
      control: "boolean",
      description:
        "Whether room grouping is turned on for the portal. Without it the grouping row is never rendered.",
    },
    roomGroups: {
      control: "object",
      description:
        "The room groups shown as chips in the grouping row. A group whose `icon` is a string or `null` is left out.",
    },
    getAllRoomGroups: {
      control: false,
      description:
        "Called while `organizeRoomsGrouping` is set; the grouping row waits for it to settle. The chips come from `roomGroups`.",
    },
    onFilterByGroup: {
      action: "onFilterByGroup",
      description:
        'Called with a group\'s id when its chip is chosen, and with `null` for "all rooms".',
    },
    currentGroupId: {
      control: "text",
      description:
        'Id of the group whose chip is marked as chosen; `null` marks "all rooms". Later changes are followed.',
    },
    isFormsSection: {
      control: "boolean",
      description:
        "Switches the grouping row wording from rooms to form spaces.",
    },
    isFilterOrSearchActive: {
      control: "boolean",
      description:
        "Hides the grouping row, and on turning `true` resets a chosen group through `onFilterByGroup(null)`.",
    },
    setEditRoomGroupsDialogVisible: {
      action: "setEditRoomGroupsDialogVisible",
      description:
        'Opens the host\'s "manage room groups" dialog. Without it the group management button and the create-group chip do nothing.',
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
  name: "Desktop bar",
  render: (args) => <FilterTemplate {...args} />,
  play: async (context) => {
    const { args, canvas, userEvent } = context;
    // Typing searches.
    await userEvent.type(canvas.getByPlaceholderText("Search..."), "report");
    // The search is debounced.
    await waitFor(() => expect(args.onSearch).toHaveBeenCalledWith("report"), {
      timeout: 3000,
    });

    // The filter button opens the panel; Cancel closes it. A tap on it
    // draws no grey flash.
    await expect(
      getComputedStyle(
        canvas.getByTestId("filter_icon_button"),
      ).getPropertyValue("-webkit-tap-highlight-color"),
    ).toBe("rgba(0, 0, 0, 0)");
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
          "The bar as a desktop listing shows it: the search box, then the filter, sort and view switch buttons.",
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
  name: "Filter panel, one group",
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
          "The filter panel with one group of options, opened when the story loads. Apply hands the picked type to `onFilter`.",
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
  name: "Filter already in force",
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
          "A filter already in force when the bar mounts (`initSelectedFilterData`). Its chip is under the search box, and its option is highlighted in the opened panel. Apply stays disabled until the selection changes.",
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
  name: "Several groups",
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
          "Several groups in one opened panel, each under its heading and divided by a line. A listing is narrowed by type, status and author at once, one option per group.",
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
  name: "Rooms listing",
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
          "The opened panel of a listing of rooms (`isRooms`). A loading skeleton shows for half a second before the options, and the flag reaches `renderSelector`.",
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
  name: "While reordering",
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
          "The bar while the listing is being reordered. The search box is disabled and the filter button gone (`isIndexEditingMode`); so are the sort button and view switch (`isIndexing`).",
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
  name: "View switch in the sort menu",
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
          "The view switch the sort menu holds on smaller screens: one button per view, the current one filled. A click on the other calls `onChangeView`.",
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
  name: "View switch disabled",
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
  name: "View switch on the bar",
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
          "The single button the bar shows on a desktop (`isFilter`). It carries the icon of the view it switches to, not the current one.",
      },
      source: {
        code: `<ViewSelector viewSettings={viewSettings} viewAs="row" isFilter />`,
      },
    },
  },
};

export const WithFilterChips: Story = {
  name: "Chips of filters in force",
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
          'The filters in force as chips under the bar. A click on a chip removes it (`removeSelectedItem`), and "Clear all" appears with more than one chip (`clearAll`).',
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

export const OneFilterManyChips: Story = {
  name: "One filter, several chips",
  render: (args) => <FilterTemplate {...args} />,
  args: {
    initSelectedFilterData: multiChipSelection,
    getSelectedFilterData: () => multiChipSelection,
  },
  parameters: {
    docs: {
      description: {
        story:
          "One filter value drawn as several chips, one per entry of `chips`. Removing one calls `removeSelectedItem` with that chip's key and the item's group.",
      },
      source: {
        code: `const selected = [
  {
    key: serializedValue,
    group: "filter-rating",
    label: "Rating",
    chips: [
      { key: "rating", label: "Rating: 4 stars and up" },
      { key: "reviews", label: "Reviews: 10 and more" },
    ],
  },
];

<Filter
  initSelectedFilterData={selected}
  getSelectedFilterData={() => selected}
  removeSelectedItem={({ key, group }) => dropCondition(group, key)}
  {...props}
/>`,
      },
    },
  },
};

export const PanelOptionKinds: Story = {
  name: "Kinds of option",
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
        story: `The kinds of option a group can hold besides tags, in an opened panel:

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

export const CustomGroupItem: Story = {
  name: "Group drawn by the host",
  render: (args) => <OpenPanelTemplate {...args} />,
  args: {
    getFilterData: () => Promise.resolve(customGroupItems),
    renderCustomItem: renderRatingItem,
  },
  parameters: {
    docs: {
      story: panelDocsStory,
      description: {
        story:
          "A group the host draws itself, marked `isCustom` and rendered by `renderCustomItem`. **Choose rating** opens a nested step (`openPanel`). A choice there sets the value (`onChange`) and returns (`closePanel`).",
      },
      source: {
        code: `<Filter
  getFilterData={() => Promise.resolve([
    { key: "filter-rating", group: "filter-rating", label: "Rating", isHeader: true, isLast: true },
    { key: "rating", group: "filter-rating", label: "", isCustom: true },
  ])}
  renderCustomItem={({ value, onChange, openPanel, closePanel }) => (
    <Button
      label={value?.label ?? "Choose rating"}
      onClick={() => openPanel(() => (
        <RatingStep onChange={onChange} closePanel={closePanel} />
      ))}
    />
  )}
  {...props}
/>`,
      },
    },
  },
};

export const SortMenuOnTablet: Story = {
  name: "Sort menu below desktop",
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
          "The opened sort menu below the desktop layout (`currentDeviceType`). The view switch heads the menu, and the current field carries an arrow for its direction.",
      },
      source: {
        code: `<Filter currentDeviceType={DeviceType.tablet} viewSelectorVisible {...props} />`,
      },
    },
  },
};

export const WithGroupingRow: Story = {
  name: "Room grouping row",
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
          'A row of group chips under the bar: "All rooms" first, the chosen group highlighted (`currentGroupId`), the rest behind "...". The button at the end opens the host\'s group management (`setEditRoomGroupsDialogVisible`).',
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
  name: "With a main button",
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

export const WithoutSearch: Story = {
  name: "Without the search field",
  render: (args) => <FilterTemplate {...args} />,
  args: {
    hideSearch: true,
    showMainButton: true,
    mainButtonProps: { text: "New", model: [] },
  },
  play: async ({ canvas }) => {
    const bar = within(canvas.getByTestId("filter_container"));
    await expect(bar.getByText("New")).toBeVisible();
    await expect(bar.queryByRole("searchbox")).not.toBeInTheDocument();
    await expect(bar.queryByRole("textbox")).not.toBeInTheDocument();
  },
  parameters: {
    docs: {
      description: {
        story:
          "A listing the server cannot search (`hideSearch`). The field is left out, the main button keeps its place, and the filter and sort controls stay at the end.",
      },
      source: {
        code: `<Filter
  hideSearch
  showMainButton
  mainButtonProps={{ text: "New", model: menuItems }}
  {...props}
/>`,
      },
    },
  },
};

export const RightToLeft: Story = {
  name: "Right to left",
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
          "The bar in a right-to-left interface. The search box starts at the right edge, the buttons line up at the left, and the chips run right to left.",
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
  name: "CSS variables",
  render: (args) => (
    <div
      style={
        {
          height: "140px",
          "--filter-btn-border": "1px solid #0082c9",
          "--filter-btn-hover-border": "1px solid light-dark(#004f7a, #7cc3ea)",
          "--filter-btn-open-fill": "#0082c9",
          "--filter-btn-radius": "6px",
          "--filter-sort-bg": "light-dark(#e6f3fb, #16303e)",
          "--filter-sort-selected-bg": "light-dark(#cce5f6, #1f4a61)",
          "--filter-sort-fill": "#0082c9",
          "--filter-view-fill": "light-dark(#e6f3fb, #16303e)",
          "--filter-view-checked": "#0082c9",
          "--filter-view-border": "#0082c9",
          "--filter-view-hover-border": "light-dark(#004f7a, #7cc3ea)",
          "--filter-view-hover-icon": "light-dark(#004f7a, #7cc3ea)",
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
        story: `The bar's variables set on one wrapper: the filter, sort and view buttons recoloured, with hover and menu values.

The panel's variables work only on \`:root\` or \`body\`, because the panel renders in a portal.`,
      },
      source: {
        code: `<div style={{
  "--filter-btn-border": "1px solid #0082c9",
  "--filter-btn-hover-border": "1px solid light-dark(#004f7a, #7cc3ea)",
  "--filter-btn-open-fill": "#0082c9",
  "--filter-btn-radius": "6px",
  "--filter-sort-bg": "light-dark(#e6f3fb, #16303e)",
  "--filter-sort-selected-bg": "light-dark(#cce5f6, #1f4a61)",
  "--filter-sort-fill": "#0082c9",
  "--filter-view-fill": "light-dark(#e6f3fb, #16303e)",
  "--filter-view-checked": "#0082c9",
  "--filter-view-border": "#0082c9",
  "--filter-view-hover-border": "light-dark(#004f7a, #7cc3ea)",
  "--filter-view-hover-icon": "light-dark(#004f7a, #7cc3ea)",
}}>
  <Filter {...props} />
</div>`,
      },
    },
  },
};
