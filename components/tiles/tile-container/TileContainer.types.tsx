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

/** Base tile item data structure */
export type TileItem = {
  /** Indicates if the item is a folder */
  isFolder?: boolean;
  /** Indicates if the item is a room */
  isRoom?: boolean;
  /** File extension */
  fileExst?: string;
  /** Unique identifier for the item */
  id: number | string;
  isTemplate?: boolean;
  /** Optional display title */
  title?: string;
  /** Optional alternative display name */
  displayName?: string;
  /** Optional icon identifier */
  icon?: string;
  /** Optional logo data used by tiles/headers */
  logo?: {
    original?: string;
    large?: string;
    medium?: string;
    small?: string;
    color?: string;
    cover?: string | { data: string; id: string };
  };
};

/** Common properties for tile items */
export interface CommonTileProps {
  /** Indicates if the tile is selected */
  checked?: boolean;
  /** Indicates if the tile is in active state */
  isActive?: boolean;
  /** Indicates if the tile is in a blocking operation state */
  isBlockingOperation?: boolean;
  /** Child elements */
  children?: React.ReactNode;
  /** Checkbox indeterminate state flag */
  indeterminate?: boolean;
  /** Additional React element */
  element?: React.ReactNode;
  /** Badges to display */
  badges?: React.ReactNode;
  /** Click handler for the thumbnail */
  thumbnailClick?: (e: React.MouseEvent) => void;
  /** Selection handler */
  onSelect?: (checked: boolean) => void;
  /** Class name for styling */
  className?: string;
  /** Style object for inline styling */
  style?: React.CSSProperties;
}

/** Props for individual tile items */
export type TileItemProps = CommonTileProps & {
  /** The tile item data */
  item: TileItem;
};

export type TileContainerProps = {
  /** Child elements to be rendered within the container */
  children: React.ReactNode;
  /** Additional CSS class names */
  className?: string;
  /** Container's HTML id attribute */
  id?: string;
  /** Inline styles for the container */
  style?: React.CSSProperties;
  /** Flag to enable React Window for virtualization */
  useReactWindow?: boolean;
  /** Component for rendering infinite grid layout */
  infiniteGrid?: React.ComponentType<{
    children: React.ReactNode;
    isRooms?: boolean;
    isTemplates?: boolean;
  }>;
  /** Custom heading for folders section */
  headingFolders?: React.ReactNode;
  /** Custom heading for files section */
  headingFiles?: React.ReactNode;
  /** Flag to indicate descending order */
  isDesc?: boolean;
  /** Disables text selection */
  noSelect?: boolean;
};
