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

import { ContextMenuModel } from "../../context-menu";
import { TileItem } from "../tile-container/TileContainer.types";

export interface TemplateItem extends TileItem {
  title: string;
  createdBy?: {
    displayName: string;
    id: string;
  };
  security?: {
    EditRoom?: boolean;
    [key: string]: boolean | undefined;
  };
  logo?: {
    small?: string;
    color?: string;
    cover?: string;
  };
}

export type SpaceQuotaProps = {
  item: TemplateItem;
  type: string;
  isReadOnly?: boolean;
  className?: string;
};

export type TemplateTileProps = {
  /** Indicates if the room is selected */
  checked?: boolean;
  /** Indicates if the room is in active state */
  isActive?: boolean;
  /** Indicates if the room is in a blocking operation state */
  isBlockingOperation?: boolean;
  /** Template data object */
  item: TemplateItem;
  /** Callback when template is selected */
  onSelect?: (checked: boolean, item: TemplateItem) => void;
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
  /** Callback when context menu is clicked */
  tileContextClick?: () => void;
  /** Callback to hide context menu */
  hideContextMenu?: () => void;
  /** Number of columns in the grid */
  columnCount: number;
  /** Room badges */
  badges?: React.ReactNode;
  /** Indicates if room is in progress state */
  inProgress?: boolean;
  /** Flag to show hotkey border */
  showHotkeyBorder?: boolean;
  /** Flag for edit mode */
  isEdit?: boolean;
  showStorageInfo?: boolean;
  openUser: () => void;
  SpaceQuotaComponent?: React.ComponentType<SpaceQuotaProps>;
};
