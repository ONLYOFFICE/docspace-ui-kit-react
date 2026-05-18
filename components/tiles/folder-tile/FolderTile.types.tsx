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

import { ContextMenuModel } from "../../context-menu/ContextMenu.types";
import { TileItem } from "../tile-container/TileContainer.types";

export interface FolderItem extends TileItem {
  title: string;
  contextOptions?: string[];
  logo?: {
    small?: string;
    color?: string;
    cover?: string;
  };
}

export type FolderTileProps = {
  /** Folder data object */
  item: FolderItem;
  /** Indicates if the folder is selected */
  checked?: boolean;
  /** Flag to show hotkey border */
  showHotkeyBorder?: boolean;
  /** Indicates if folder is in progress state */
  inProgress?: boolean;
  /** Callback when folder is selected */
  onSelect?: (checked: boolean, item: FolderItem) => void;
  /** Callback when thumbnail is clicked */
  thumbnailClick?: (e: React.MouseEvent) => void;
  /** Function to get context menu model */
  getContextModel?: () => ContextMenuModel[];
  /** Function to set selected items */
  setSelection?: (items: FolderItem[]) => void;
  /** Handler for Ctrl + Click selection */
  withCtrlSelect?: (item: FolderItem) => void;
  /** Handler for Shift + Click selection */
  withShiftSelect?: (item: FolderItem) => void;
  /** Additional React element */
  element?: React.ReactNode;
  /** Child elements */
  children?: React.ReactNode;
  /** Callback to hide context menu */
  hideContextMenu?: () => void;
  /** Custom header for context menu */
  contextMenuHeader?: React.ReactNode;
  /** Callback when context menu is clicked */
  tileContextClick?: (isRightClick?: boolean) => void;
  /** Folder badges */
  badges?: React.ReactNode;
  /** Context menu options */
  contextOptions: ContextMenuModel[];
  /** Checkbox indeterminate state flag */
  indeterminate?: boolean;
  /** Indicates if folder is being dragged */
  isDragging?: boolean;
  /** Alternative flag for drag state */
  dragging?: boolean;
  /** Indicates if folder is in active state */
  isActive?: boolean;
  /** Flag for edit mode */
  isEdit?: boolean;
  forwardRef?: React.RefObject<HTMLDivElement | null>;
  /** The temporary icon to display when thumbnail is not available */
  temporaryIcon?: string | React.ReactElement;
  isBigFolder?: boolean;
  /** Data test id for the tile */
  dataTestId?: string;
};

export type FolderChildProps = {
  item: {
    title?: string;
    icon?: string;
    logo?: {
      original?: string;
      large?: string;
      medium?: string;
      small?: string;
      color?: string;
      cover?: string | { data: string; id: string };
    };
    displayName?: string;
  };
};
