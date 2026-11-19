import React from "react";

import { DeviceType, FilterGroups, FilterSelectorTypes } from "../../enums";
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
  /** The filter group whose selector item opened the selector. */
  group?: FilterGroups;
  isRooms: boolean;
  userId: string;
  disableThirdParty?: boolean;
};

export type TRenderSelector = (props: SelectorRenderProps) => React.ReactNode;

export type TCustomItemValue = {
  key: string;
  label?: string;
};

export type CustomItemRenderProps = {
  group: FilterGroups;
  value?: TCustomItemValue;
  onChange: (value: TCustomItemValue | null) => void;
  openPanel: (render: TRenderCustomItem) => void;
  closePanel: () => void;
  closeFilter: () => void;
};

export type TRenderCustomItem = (
  props: CustomItemRenderProps,
) => React.ReactNode;

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

/** Called by the view selector with the chosen view ("row" / "tile"). */
export type TOnChangeViewAs = (view: string) => void;

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
  /** The selector this item opens; by default it follows the group (rooms for `filterRoom`, groups for `filterGroup`, people otherwise). */
  selectorType?: FilterSelectorTypes;
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

export type TCustomItem = {
  group: FilterGroups;
  key: string;
  isCustom: true;
  label?: string;
  isSelected?: boolean;
};

export type TGroupItem =
  | TTagItem
  | TCheckboxItem
  | TWithOptionItem
  | TSelectorItem
  | TToggleButtonItem
  | TCustomItem;

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
  renderCustom?: (item: TCustomItem) => React.ReactNode;
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
  /** The selector a `displaySelectorType` item opens; by default it follows the group. */
  selectorType?: FilterSelectorTypes;
  isMultiSelect?: boolean;
  selectedLabel?: string;
  isCheckbox?: boolean;
  isCustom?: boolean;
  chips?: { key: string; label: string }[];
};

export type TGetFilterData = () => Promise<TItem[]>;
export type TOnFilter = (value: TItem[] | TGroupItem[]) => void;

export type FilterBlockProps = {
  /** Loads the groups of filter options, awaited when the filter panel opens. */
  getFilterData: TGetFilterData;
  /** Called with the whole new selection when Apply is pressed, and with `[]` from the panel's clear icon. */
  onFilter: TOnFilter;

  selectedFilterValue: Map<FilterGroups, Map<string | number, TItem>>;

  /** Heading of the filter panel. Nothing translates it for you. */
  filterHeader: string;
  /** Passed to `renderSelector` as the heading of its step. */
  selectorLabel: string;

  hideFilterBlock: () => void;
  /** Passed to `renderSelector`; the bar itself does nothing with it. */
  userId: string;
  /** Shows a skeleton in the opening panel until the groups arrive, and is passed to `renderSelector`. */
  isRooms: boolean;
  /** Shapes the panel's skeleton, which only `isRooms` shows. The groups come from `getFilterData`. */
  isContactsPage: boolean;
  /** Shapes the panel's skeleton, which only `isRooms` shows. */
  isContactsPeoplePage: boolean;
  /** Shapes the panel's skeleton, which only `isRooms` shows. */
  isContactsGroupsPage: boolean;
  /** Shapes the panel's skeleton, which only `isRooms` shows. */
  isContactsInsideGroupPage: boolean;
  /** Shapes the panel's skeleton, which only `isRooms` shows. */
  isContactsGuestsPage: boolean;

  /** Removes the filter button, the sort button and the view selector, leaving the search box alone. */
  isFlowsPage?: boolean;
  /** Forwarded unchanged to `renderSelector`; nothing in the bar or the panel reads it. */
  disableThirdParty?: boolean;

  /** Renders the step a selector item opens inside the panel. Without it that step is empty. */
  renderSelector?: TRenderSelector;
  /** Renders a group item marked `isCustom`. Without it such an item is empty. */
  renderCustomItem?: TRenderCustomItem;
};

export type FilterButtonProps = Omit<FilterBlockProps, "hideFilterBlock"> & {
  id: string;
  title: string;
};

export type SortButtonProps = {
  id: string;
  title: string;

  /** Returns the sort options. Read on mount, on a column change and when either sort getter changes. */
  getSortData: TGetSortData;
  /** Returns the sort in force, read with `getSortData`. After a pick the menu keeps its own. */
  getSelectedSortData: TGetSelectedSortData;

  /** Called with the view picked in the view selector. The bar keeps no view state of its own. */
  onChangeViewAs: TOnChangeViewAs;
  /** Text beside the view selector inside the sort menu, shown below the desktop layout. */
  view: string;
  /** The listing's current view. `"table"` is treated as `"row"` by the sort menu and the view selector. */
  viewAs: TViewAs;
  viewSettings: TViewSelectorOption[];

  /** Called with the picked key and direction. Picking the current key again reverses the direction. */
  onSort: TOnSort;
  /** Shows the view selector: beside the sort button on a desktop, inside the sort menu below it. */
  viewSelectorVisible: boolean;

  /** Called with `true` when the sort menu opens and `false` when it closes. */
  onSortButtonClick: TOnSortButtonClick;
};

export type SearchInputProps = {
  /** Called with the search string, not an event, a second after typing stops. The cross calls it with `""` at once. */
  onSearch: (value: string) => void;
  /** Called when the search box is cleared through `clearSearch`. */
  onClearFilter: () => void;

  /** Set to `true` to clear the search box. The bar empties it, calls `onClearFilter`, then `setClearSearch(false)`. */
  clearSearch: boolean;
  /** Called with `false` once a requested clear has been carried out. */
  setClearSearch: (value: boolean) => void;

  /** Returns the text the search box shows, read whenever the function changes. A repeat or a replaced query leaves the field alone; any other value fills and focuses it. */
  getSelectedInputValue: () => string;

  /** Placeholder of the search box. Nothing translates it for you. */
  placeholder: string;

  /** Removes the filter button and disables the search box. */
  isIndexEditingMode: boolean;

  /** Text the search box starts with, read once. */
  initSearchValue?: string;

  /** Shows a MainButton before the search field. It needs `mainButtonProps` too. */
  showMainButton?: boolean;
  /** Props of that MainButton. Without them no main button is drawn. */
  mainButtonProps?: MainButtonProps;
  /** Icon inside the main button, painted white in a 12px box. A plus by default. */
  mainButtonIcon?: React.ReactNode;
  /** Leaves the search field out of the bar while the main button stays.
   * Without a main button the search block is empty space. */
  hideSearch?: boolean;
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
    /** Returns the filters in force, drawn as chips under the bar. Re-read whenever the function changes, so keep it stable. */
    getSelectedFilterData: () => Promise<TItem[]> | TItem[];
    /** Returns the views the selector offers. Read on every render and when it changes, so a new function each render loops. */
    getViewSettingsData: () => TViewSelectorOption[];

    /** Called by the "clear all" link, which appears once more than one chip carries a label. */
    clearAll: () => void;

    /** Whether the listing is the recent folder. It hides the sort button and keeps the view selector on screen below the desktop breakpoint. */
    isRecentFolder: boolean;
    /** Called when a chip is clicked or its cross pressed. The bar has already dropped the chip by then. */
    removeSelectedItem: ({
      key,
      group,
    }: {
      key: string | number;
      group?: FilterGroups;
    }) => void;

    /** Whether the listing is being reordered, which removes the sort button and the view selector. */
    isIndexing: boolean;

    /** Tooltip and accessible name of the filter button. */
    filterTitle: string;
    /** Tooltip of the sort button, set on its wrapper; the button itself stays unnamed. */
    sortByTitle: string;

    /** Picks where the view selector goes: beside the sort button on a desktop, inside the sort menu below. */
    currentDeviceType: DeviceType;
    /** The filters in force at the first render, so the chips are right before `getSelectedFilterData` has resolved. */
    initSelectedFilterData?: TItem[];
    /** Opens the host's "manage room groups" dialog. Without it the group management button and the create-group chip do nothing. */
    setEditRoomGroupsDialogVisible?: (
      visible: boolean,
      roomIds?: number[] | null,
      openInCreateMode?: boolean,
    ) => void;
    /** Called while `organizeRoomsGrouping` is set; the grouping row waits for it to settle. The chips come from `roomGroups`. */
    getAllRoomGroups?: () => Promise<TRoomGroup[]>;
    /** The room groups shown as chips in the grouping row. A group whose `icon` is a string or `null` is left out. */
    roomGroups?: TRoomGroup[];
    /** Called with a group's id when its chip is chosen, and with `null` for "all rooms". */
    onFilterByGroup?: (groupId: string | null) => void;
    /** Id of the group whose chip is marked as chosen; `null` marks "all rooms". Later changes are followed. */
    currentGroupId?: string | null;
    /** Allows the grouping row, which also needs `organizeRoomsGrouping` and no `isFilterOrSearchActive`. */
    withRoomGroups?: boolean;
    /** Switches the grouping row wording from rooms to form spaces. */
    isFormsSection?: boolean;
    /** Whether room grouping is turned on for the portal. Without it the grouping row is never rendered. */
    organizeRoomsGrouping?: boolean;
    /** Hides the grouping row, and on turning `true` resets a chosen group through `onFilterByGroup(null)`. */
    isFilterOrSearchActive?: boolean;
  };
