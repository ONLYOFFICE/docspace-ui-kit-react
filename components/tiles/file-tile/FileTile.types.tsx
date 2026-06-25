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

import { ReactElement } from "react";

import { ContextMenuModel } from "../../context-menu/ContextMenu.types";

import type { FileType } from "../../../enums";
import { TileItem } from "../tile-container/TileContainer.types";

export interface FileItem extends TileItem {
  title: string;
  contextOptions?: string[];
  logo?: {
    small?: string;
    color?: string;
    cover?: string;
  };
}

export type FileItemType = {
  /** Unique identifier for the file */
  id: string | number;
  /** Title/name of the file */
  title: string;
  /** File extension (e.g., ".docx") */
  fileExst?: string;
  /** File type (e.g., "docx", "pdf") */
  fileType?: FileType;
  /** Whether this item is a plugin */
  isPlugin?: boolean;
  /** Icon URL for plugin files */
  fileTileIcon?: string;
  /** Logo configuration for the file */
  logo?: {
    /** Original size logo URL */
    original?: string;
    /** Large size logo URL */
    large?: string;
    /** Medium size logo URL */
    medium?: string;
    /** Small size logo URL */
    small?: string;
    /** Logo color */
    color?: string;
    /** Logo cover image URL */
    cover?: string;
  };
  /** View accessibility settings for the file */
  viewAccessibility?: {
    /** Whether image view is enabled */
    ImageView: boolean;
    /** Whether media view is enabled */
    MediaView: boolean;
  };
  /** Context menu options for this file */
  contextOptions?: string[];
};

/** Props for the FileTile component */
export type FileTileProps = {
  /** Indicates if the tile is in checked/selected state */
  checked?: boolean;
  /** Child components to render within the tile. Can be a single element or an array of elements */
  children?: ReactElement | ReactElement[];
  /** Width of the spacer for the context menu button */
  contextButtonSpacerWidth?: number;
  /** Array of context menu options to display when the context menu is opened */
  contextOptions: ContextMenuModel[];
  /** Indicates if the tile is in a loading/progress state */
  inProgress?: boolean;
  /** The file item data associated with this tile */
  item: FileItemType;
  /** Function called when the tile is selected */
  onSelect?: (checked: boolean, item: FileItemType) => void;
  /** Function called when the thumbnail is clicked */
  thumbnailClick?: (e: React.MouseEvent) => void;
  /** The thumbnail image URL to display */
  thumbnail?: string;
  /** The temporary icon to display when thumbnail is not available */
  temporaryIcon?: string | ReactElement;
  /** Function to handle selection with Ctrl key */
  withCtrlSelect?: (item: FileItemType) => void;
  /** Function to handle selection with Shift key */
  withShiftSelect?: (item: FileItemType) => void;
  /** Custom element to render within the tile */
  element?: ReactElement;
  /** Function called when the context menu button is clicked */
  tileContextClick?: (isRightClick?: boolean) => void;
  /** Function to get the context menu model */
  getContextModel?: () => ContextMenuModel[];
  /** Function to hide the context menu */
  hideContextMenu?: () => void;
  /** Color for the left border of the tile */
  sideColor?: string;
  /** Function to set the selection state of the tile */
  setSelection?: (items: FileItem[]) => void;
  /** Custom content element to be rendered in the tile */
  contentElement?: ReactElement;
  /** Custom badges to be displayed on the tile */
  badges?: ReactElement;
  /** Flag indicating if the tile should be highlighted */
  isHighlight?: boolean;
  /** Indicates if the file is in a blocking operation state */
  isBlockingOperation?: boolean;
  /** Flag to show hotkey border around the tile */
  showHotkeyBorder?: boolean;
  /** Indicates if the file is currently being dragged */
  isDragging?: boolean;
  /** Size of the thumbnail in pixels */
  thumbSize?: number;
  /** Indicates if the file is in active state */
  isActive?: boolean;
  /** Flag for edit mode */
  isEdit?: boolean;
  forwardRef?: React.RefObject<HTMLDivElement | null>;
  /** Data test id for the tile */
  dataTestId?: string;
};

export type FileChildProps = {
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
