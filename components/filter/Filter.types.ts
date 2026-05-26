/*
 * Copyright (C) Ascensio System SIA, 2009-2026
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation, together with the
 * additional terms provided in the LICENSE file.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For
 * details, see the GNU AGPL at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA by email at info@onlyoffice.com
 * or by postal mail at 20A-6 Ernesta Birznieka-Upisha Street, Riga,
 * LV-1050, Latvia, European Union.
 *
 * The interactive user interfaces in modified versions of the Program
 * are required to display Appropriate Legal Notices in accordance with
 * Section 5 of the GNU AGPL version 3.
 *
 * No trademark rights are granted under this License.
 *
 * All non-code elements of the Product, including illustrations,
 * icon sets, and technical writing content, are licensed under the
 * Creative Commons Attribution-ShareAlike 4.0 International License:
 * https://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 * This license applies only to such non-code elements and does not
 * modify or replace the licensing terms applicable to the Program's
 * source code, which remains licensed under the GNU Affero General
 * Public License v3.
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

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
  getFilterData: TGetFilterData;
  onFilter: TOnFilter;

  selectedFilterValue: Map<FilterGroups, Map<string | number, TItem>>;

  filterHeader: string;
  selectorLabel: string;

  hideFilterBlock: () => void;
  userId: string;
  isRooms: boolean;
  isContactsPage: boolean;
  isContactsPeoplePage: boolean;
  isContactsGroupsPage: boolean;
  isContactsInsideGroupPage: boolean;
  isContactsGuestsPage: boolean;

  isFlowsPage?: boolean;
  disableThirdParty?: boolean;

  renderSelector?: TRenderSelector;
};

export type FilterButtonProps = Omit<FilterBlockProps, "hideFilterBlock"> & {
  id: string;
  title: string;
};

export type SortButtonProps = {
  id: string;
  title: string;

  getSortData: TGetSortData;
  getSelectedSortData: TGetSelectedSortData;

  onChangeViewAs: TOnChangeViewAs;
  view: string;
  viewAs: TViewAs;
  viewSettings: TViewSelectorOption[];

  onSort: TOnSort;
  viewSelectorVisible: boolean;

  onSortButtonClick: TOnSortButtonClick;
};

export type SearchInputProps = {
  onSearch: (value: string) => void;
  onClearFilter: () => void;

  clearSearch: boolean;
  setClearSearch: (value: boolean) => void;

  getSelectedInputValue: () => string;

  placeholder: string;

  isIndexEditingMode: boolean;

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
    getSelectedFilterData: () => Promise<TItem[]> | TItem[];
    getViewSettingsData: () => TViewSelectorOption[];

    clearAll: () => void;

    isRecentFolder: boolean;
    removeSelectedItem: ({
      key,
      group,
    }: {
      key: string | number;
      group?: FilterGroups;
    }) => void;

    isIndexing: boolean;

    filterTitle: string;
    sortByTitle: string;

    currentDeviceType: DeviceType;
    initSelectedFilterData?: TItem[];
    setEditRoomGroupsDialogVisible?: (
      visible: boolean,
      roomIds?: number[] | null,
      openInCreateMode?: boolean,
    ) => void;
    getAllRoomGroups?: () => Promise<TRoomGroup[]>;
    roomGroups?: TRoomGroup[];
    onFilterByGroup?: (groupId: string | null) => void;
    /** Current group ID from URL filter - used to highlight the correct group tag on page load */
    currentGroupId?: string | null;
    isRoomsFolder?: boolean;
    organizeRoomsGrouping?: boolean;
    /** When true, hides the room grouping row because filters/search are active */
    isFilterOrSearchActive?: boolean;
  };
