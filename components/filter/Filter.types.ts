import React from "react";

import { DeviceType, FilterGroups } from "../../enums";
import { TSortBy, TViewAs } from "../../types";

import { TViewSelectorOption } from "./sub-components/ViewSelector";
import { TSelectorItem as TSelectorItemBase } from "../selector";
import { TOption } from "../combobox";
import type { MainButtonProps } from "../main-button/MainButton.types";

export type SelectorRenderProps = {
  selectorType: string | null;
  onSubmit: (items: TSelectorItemBase[]) => void;
  onBackClick: () => void;
  onCloseClick: () => void;
  selectorLabel: string;
  isRooms: boolean;
  userId: string;
  disableThirdParty?: boolean;
};

export type TRenderSelector = (props: SelectorRenderProps) => React.ReactNode;

export type TSortDataItem = {
  id: string;
  className?: string;
  key: string;
  isSelected?: boolean;
  label: string;
  sortDirection?: string;
  sortId?: string;
};

export type TGetSortData = () => TSortDataItem[];

export type TGetSelectedSortData = () => {
  sortDirection: "asc" | "desc";
  sortId: TSortBy;
};

export type TOnChangeViewAs = () => void;

export type TOnSort = (key: string, sortDirection: string) => void;

export type TOnSortButtonClick = (value: boolean) => void;

export type TChangeFilterValue = (
  group: FilterGroups,
  key: string,
  isSelected: boolean,
  label?: string,
  isMultiSelect?: boolean,
) => void;

export type TShowSelector = (selectorType: string, group: FilterGroups) => void;

export type TSelectorItem = {
  group: FilterGroups;
  isSelected?: boolean;
  selectedKey?: string | number;
  displaySelectorType?: string;
  key: string | number;
  selectedLabel?: string;
  label?: string;
};

export type TToggleButtonItem = {
  group: FilterGroups;
  key: string | number;
  label?: string;
  isSelected?: boolean;
  isToggle?: boolean;
};

export type TWithOptionItem = {
  group: FilterGroups;
  options: TOption[];
  withOptions?: boolean;
  id?: string;
  key?: string | number;
  label?: undefined;
  isSelected?: boolean;
};

export type TCheckboxItem = {
  group: FilterGroups;
  key: string | number;
  id: string;
  label?: string;
  isSelected?: boolean;
  isDisabled?: boolean;
  isCheckbox?: boolean;
};

export type TTagItem = {
  group: FilterGroups;
  key: string | number | string[];
  label?: string;
  isSelected?: boolean;
  id?: string;
  isMultiSelect?: boolean;
};

export type TGroupItem =
  | TTagItem
  | TCheckboxItem
  | TWithOptionItem
  | TSelectorItem
  | TToggleButtonItem;

export interface FilterBlockItemProps {
  group: FilterGroups;
  label: string;
  groupItem: TGroupItem[];
  isLast: boolean;
  withoutHeader: boolean;
  withoutSeparator: boolean;
  changeFilterValue: TChangeFilterValue;
  showSelector: TShowSelector;
  isFirst: boolean;
  withMultiItems: boolean;
}

export type TItem = {
  id?: string;
  key: string | number | string[];
  label: string;
  group: FilterGroups;
  isLast?: boolean;
  withoutHeader?: boolean;
  withoutSeparator?: boolean;
  withMultiItems?: boolean;
  isHeader?: boolean;
  isSelected?: boolean;
  groupItem?: TGroupItem[];
  selectedKey?: string;
  displaySelectorType?: string;
  isMultiSelect?: boolean;
  selectedLabel?: string;
  isCheckbox?: boolean;
};

export type TGetFilterData = () => Promise<TItem[]>;
export type TOnFilter = (value: TItem[] | TGroupItem[]) => void;

export type FilterBlockProps = {
  /** Loads the groups of filter options, awaited when the filter panel opens. */
  getFilterData: TGetFilterData;
  /** Called with the whole new selection whenever the filter panel is applied. */
  onFilter: TOnFilter;

  selectedFilterValue: Map<FilterGroups, Map<string | number, TItem>>;

  /** Heading of the filter panel. Nothing translates it for you. */
  filterHeader: string;
  /** Heading of the selector the panel opens for a group that picks a person or a room. */
  selectorLabel: string;

  hideFilterBlock: () => void;
  /** Id of the signed-in person, handed to the selector so it can exclude them. */
  userId: string;
  /** Whether the listing is of rooms, which changes which filter groups are offered. */
  isRooms: boolean;
  /** Whether the listing is the contacts page. It and the four flags below decide which groups the panel shows. */
  isContactsPage: boolean;
  /** Whether the contacts page is showing people. */
  isContactsPeoplePage: boolean;
  /** Whether the contacts page is showing groups. */
  isContactsGroupsPage: boolean;
  /** Whether the contacts page is showing the members of one group. */
  isContactsInsideGroupPage: boolean;
  /** Whether the contacts page is showing guests. */
  isContactsGuestsPage: boolean;

  /** Whether the listing is the flows page. It removes the filter button, the sort button and the view selector outright. */
  isFlowsPage?: boolean;
  /** Removes the third-party storage group from the filter panel. */
  disableThirdParty?: boolean;

  /** Renders the selector the panel opens for a person or a room group. Without it that step is empty — this package ships no portal selector. */
  renderSelector?: TRenderSelector;
};

export type FilterButtonProps = Omit<FilterBlockProps, "hideFilterBlock"> & {
  id: string;
  title: string;
};

export type SortButtonProps = {
  id: string;
  title: string;

  /** Returns the sort options. It is called when the sort menu opens. */
  getSortData: TGetSortData;
  /** Returns the sort in force, as a key and a direction. */
  getSelectedSortData: TGetSelectedSortData;

  /** Called when the view is switched. The component holds no view state of its own. */
  onChangeViewAs: TOnChangeViewAs;
  /** Name of the current page, used as the key under which the sort menu remembers its width. */
  view: string;
  /** The listing's current view. `"table"` is treated as `"row"` by the sort menu and the view selector. */
  viewAs: TViewAs;
  viewSettings: TViewSelectorOption[];

  /** Called with the chosen key and direction. */
  onSort: TOnSort;
  /** Whether a view selector belongs on screen at all. On a desktop it is a separate control; below that breakpoint it moves inside the sort menu. */
  viewSelectorVisible: boolean;

  /** Called with `true` when the sort menu opens and `false` when it closes. */
  onSortButtonClick: TOnSortButtonClick;
};

export type SearchInputProps = {
  /** Called with the search string on every keystroke — the string itself, not an event. The component keeps no value of its own beyond the caret. */
  onSearch: (value: string) => void;
  /** Called when the search box is cleared through `clearSearch`. */
  onClearFilter: () => void;

  /** Set it to `true` to clear the search box. The component empties the field, calls `onClearFilter` and then calls `setClearSearch(false)` itself. */
  clearSearch: boolean;
  /** Called with `false` once a requested clear has been carried out. */
  setClearSearch: (value: boolean) => void;

  /** Returns the text the search box should show. **Give it a stable identity**: the effect that reads it also focuses the field, so a new function on every render keeps stealing focus. */
  getSelectedInputValue: () => string;

  /** Placeholder of the search box. Nothing translates it for you. */
  placeholder: string;

  /** Removes the filter button while the listing is being reordered. */
  isIndexEditingMode: boolean;

  /** Text the search box starts with, read once. */
  initSearchValue?: string;

  /** Shows a MainButton to the left of the search field */
  showMainButton?: boolean;
  /** Props for the MainButton displayed to the left of the search field */
  mainButtonProps?: MainButtonProps;
  /** Icon node rendered inside the MainButton (12x12) */
  mainButtonIcon?: React.ReactNode;
};

export type TRoomGroupIcon = {
  id: string;
  data: {
    small: string;
    default: string;
  };
};

export type TRoomGroup = {
  id: string;
  name: string;
  icon: TRoomGroupIcon | string | null;
  userId: string;
  totalRooms: number;
};

export type FilterProps = SearchInputProps &
  Omit<SortButtonProps, "id" | "title" | "viewSettings"> &
  Omit<FilterButtonProps, "id" | "title" | "selectedFilterValue"> & {
    /** Returns the filters in force, which become the chips under the bar. **Give it a stable identity**: it is re-read whenever the function changes. */
    getSelectedFilterData: () => Promise<TItem[]> | TItem[];
    /** Returns the views the selector offers. **Give it a stable identity**: it is called during render and again in an effect keyed on the function itself, so a new one each render loops. */
    getViewSettingsData: () => TViewSelectorOption[];

    /** Called by the "clear all" link, which appears once more than one chip carries a label. */
    clearAll: () => void;

    /** Whether the listing is the recent folder. It hides the sort button and keeps the view selector on screen below the desktop breakpoint. */
    isRecentFolder: boolean;
    /** Called when one chip is removed. The component drops the chip from its own list first and does not wait for you. */
    removeSelectedItem: ({
      key,
      group,
    }: {
      key: string | number;
      group?: FilterGroups;
    }) => void;

    /** Whether the listing is being reordered, which removes the sort button and the view selector. */
    isIndexing: boolean;

    /** Native tooltip of the filter button. */
    filterTitle: string;
    /** Native tooltip of the sort button. */
    sortByTitle: string;

    /** Which layout to render: on a desktop the view selector is a control of its own, below that it moves inside the sort menu. Nothing here measures the viewport. */
    currentDeviceType: DeviceType;
    /** The filters in force at the first render, so the chips are right before `getSelectedFilterData` has resolved. */
    initSelectedFilterData?: TItem[];
    /** Opens the host's "manage room groups" dialog. Without it the group management button and the create-group chip do nothing. */
    setEditRoomGroupsDialogVisible?: (
      visible: boolean,
      roomIds?: number[] | null,
      openInCreateMode?: boolean,
    ) => void;
    /** Loads the room groups. It is awaited once, only while `organizeRoomsGrouping` is set, and only to decide that the row may be shown — the groups themselves come from `roomGroups`. */
    getAllRoomGroups?: () => Promise<TRoomGroup[]>;
    /** The room groups to show as chips. Only those whose `icon` is an object are rendered; a string or `null` icon drops the group from the row. */
    roomGroups?: TRoomGroup[];
    /** Called with a group's id when its chip is chosen, and with `null` for "all rooms". */
    onFilterByGroup?: (groupId: string | null) => void;
    /** Current group ID from URL filter - used to highlight the correct group tag on page load */
    currentGroupId?: string | null;
    /** Whether the listing is the rooms folder. It is one of four conditions for the room grouping row. */
    isRoomsFolder?: boolean;
    /** Whether room grouping is turned on for the portal. Without it the grouping row is never rendered. */
    organizeRoomsGrouping?: boolean;
    /** When true, hides the room grouping row because filters/search are active */
    isFilterOrSearchActive?: boolean;
  };
