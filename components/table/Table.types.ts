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
import { IndexRange } from "react-virtualized";

import { ContextMenuModel } from "../context-menu";

export interface TableContainerProps {
  forwardedRef: React.Ref<HTMLDivElement>;
  noSelect?: boolean;
  useReactWindow: boolean;
  children?: React.ReactNode;
  className?: string;
}

export type TTableColumn = {
  key: string;
  title: string;
  enable?: boolean;
  active?: boolean;
  minWidth?: number;
  withTagRef?: boolean;
  sortBy?: string;
  onClick?: (sortBy: string, e: React.MouseEvent) => void;
  onIconClick?: () => void;
  onChange?: (key: string, e?: React.ChangeEvent<HTMLInputElement>) => void;
  isDisabled?: boolean;
  defaultSize?: number;
  default?: boolean;
  resizable?: boolean;
  isShort?: boolean;
  checkbox?: {
    value: boolean;
    isIndeterminate: boolean;
    onChange: (e?: React.ChangeEvent<HTMLInputElement>) => void;
  };
};

export interface TableHeaderProps {
  containerRef: { current: HTMLDivElement | null };
  columns: TTableColumn[];
  sortBy?: string;
  sorted?: boolean;
  columnStorageName: string;
  sectionWidth: number;
  onClick?: () => void;
  resetColumnsSize?: boolean;
  isLengthenHeader?: boolean;
  sortingVisible?: boolean;
  infoPanelVisible?: boolean;
  useReactWindow: boolean;
  showSettings: boolean;
  setHideColumns?: (value: boolean) => void;
  columnInfoPanelStorageName?: string;
  settingsTitle?: string;
  tagRef?:
    | React.ForwardedRef<HTMLDivElement>
    | ((node: HTMLDivElement) => void);
  isIndexEditingMode?: boolean;
  withoutWideColumn?: boolean;
  style?: React.CSSProperties;
}

export interface TableHeaderCellProps {
  column: TTableColumn;
  index: number;
  onMouseDown: (event: React.MouseEvent) => void;
  resizable?: boolean;
  sorted: boolean;
  sortBy: string;
  defaultSize?: number;
  sortingVisible: boolean;
  tagRef?:
    | React.ForwardedRef<HTMLDivElement>
    | ((node: HTMLDivElement) => void);
  testId?: string;
}

export interface TableSettingsProps {
  columns: TTableColumn[];
  disableSettings?: boolean;
}

export interface TableBodyProps {
  columnStorageName: string;
  columnInfoPanelStorageName?: string;
  fetchMoreFiles: (params: IndexRange) => Promise<void>;
  children: React.ReactNode[];
  filesLength: number;
  hasMoreFiles: boolean;
  itemCount: number;
  itemHeight: number;
  useReactWindow: boolean;
  onScroll?: () => void;
  infoPanelVisible?: boolean;
  isIndexEditingMode?: boolean;
}

export interface TableRowProps {
  fileContextClick?: (value?: boolean) => void;
  children: React.ReactNode;
  contextOptions?: ContextMenuModel[];
  onHideContextMenu?: () => void;
  selectionProp?: { className?: string; value?: string };
  className?: string;
  style?: React.CSSProperties;
  contextMenuCellStyle?: React.CSSProperties;
  title?: string;
  getContextModel?: () => ContextMenuModel[];
  badgeUrl?: string;
  isIndexEditingMode?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onDoubleClick?: (e: React.MouseEvent) => void;
  forwardedRef?: React.ForwardedRef<HTMLDivElement>;
  hideColumns?: boolean;
  isActive?: boolean;
  checked?: boolean;
  dragging?: boolean;
  dataTestId?: string;
  contextMenuTestId?: string;

  onMouseEnter?: (e: React.MouseEvent) => void;
  onMouseLeave?: (e: React.MouseEvent) => void;
}

export interface TableCellProps {
  className?: string;
  hasAccess?: boolean;
  checked?: boolean;
  forwardedRef?: React.ForwardedRef<HTMLDivElement>;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  value?: string;
  dataTestId?: string;
  documentTitle?: string;
}

export type TGroupMenuItem = {
  label: string;
  disabled: boolean;
  onClick: (e: React.MouseEvent) => void;
  iconUrl: string;
  title: string;
  withDropDown?: boolean;
  options?: ContextMenuModel[];
  id: string;
  isMobileView?: boolean;
  /** When true, applies fixed width (161px) and responsive height for the dropdown */
  fixedDropdownStyles?: boolean;
};

interface TableGroupMenuBased {
  isChecked: boolean;
  isIndeterminate: boolean;
  headerMenu: TGroupMenuItem[];
  checkboxOptions?: React.ReactElement<{ children?: React.ReactNode }>;
  onClick?: () => void;
  onChange: (isChecked: boolean) => void;
  checkboxMargin?: string;
  withoutInfoPanelToggler: boolean;
  isInfoPanelVisible?: boolean;
  isMobileView?: boolean;
  isBlocked?: boolean;
  toggleInfoPanel?: () => void;
  withComboBox?: boolean;
  headerLabel?: string;
}

export type TGroupMenuProps = Pick<
  TableGroupMenuBased,
  "headerMenu" | "isBlocked" | "isMobileView"
>;

export type TableGroupMenuProps =
  | (TableGroupMenuBased & {
      isCloseable?: undefined;
      onCloseClick?: undefined;
    })
  | (TableGroupMenuBased & { isCloseable: boolean; onCloseClick: () => void });
