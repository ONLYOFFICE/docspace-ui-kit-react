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

import type { TFunction } from "i18next";
import { ContextMenuModel } from "../../context-menu/ContextMenu.types";
import type { TagClickEvent, TagType } from "../../tag";
import { TileItem } from "../tile-container/TileContainer.types";

export interface RoomItem extends TileItem {
  title: string;
  roomType: string;
  providerType?: string;
  providerKey?: string;
  thirdPartyIcon?: string;
  tags?: Array<TagType | string>;
  contextOptions?: ContextMenuModel[];
  logo?: {
    small?: string;
    color?: string;
    cover?: string;
  };
  isAIAgent?: boolean;
}

export interface SelectOption {
  option: "typeProvider" | "defaultTypeRoom";
  value: string;
}

export type RoomTileProps = {
  /** Indicates if the room is selected */
  checked?: boolean;
  /** Indicates if the room is in active state */
  isActive?: boolean;
  /** Indicates if the room is in a blocking operation state */
  isBlockingOperation?: boolean;
  /** Room data object */
  item: RoomItem;
  /** Callback when room is selected */
  onSelect?: (checked: boolean, item: RoomItem) => void;
  /** Callback when thumbnail is clicked */
  thumbnailClick?: (e: React.MouseEvent) => void;
  /** Function to get context menu model */
  getContextModel?: () => ContextMenuModel[];
  /** Child elements */
  children?: React.ReactNode;
  /** Checkbox indeterminate state flag */
  indeterminate?: boolean;
  /** Additional React element */
  element?: React.ReactNode;
  /** Context menu options */
  contextOptions: ContextMenuModel[];
  /** Column count for tags layout */
  columnCount: number;
  /** Callback for tag selection */
  selectTag: (tag: TagClickEvent) => void;
  /** Callback for option selection */
  selectOption: (option: SelectOption) => void;
  /** Function to get room type name */
  getRoomTypeName: (
    type: string,
    t:
      | TFunction
      | ((
          key: string,
          interpolation?: Record<string, string | number>,
        ) => string),
  ) => string;
  /** Room badges */
  badges?: React.ReactNode;
  /** Indicates if room is in progress state */
  inProgress?: boolean;
  /** Flag to show hotkey border */
  showHotkeyBorder?: boolean;
  /** Flag for edit mode */
  isEdit?: boolean;
  /** Data test id for the tile */
  dataTestId?: string;

  customBottomContent?: (
    isHovered: boolean,
    tags: Array<TagType | string>,
  ) => React.ReactNode;
};
