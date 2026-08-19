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

import { VDRIndexingAction } from "../../../enums";
import { ContextMenuModel } from "../../context-menu";

export type RowItemType = {
  icon?: string;
  avatar?: string;
  title?: string;
  displayName?: string;
  logo?: {
    color?: string;
    medium?: string;
    cover?: string;
    small?: string;
    large?: string;
  };
};

export type TData = {
  contextOptions: ContextMenuModel[];
};

export type TMode = "modern" | "default";

export type RowProps = {
  /** Required for hosting the Checkbox component. Its location is always fixed in the first position.
   * If there is no value, the occupied space is distributed among the other child elements. */
  checked?: boolean;
  /** Displays the child elements */
  children?: React.ReactElement<{ item: RowItemType }>;
  /** Accepts class */
  className?: string;
  /** Required for displaying a certain element in the row */
  contentElement?: React.ReactNode;
  /** Sets the width of the ContextMenuButton component. */
  contextButtonSpacerWidth?: string;
  /** Required for hosting the ContextMenuButton component. It is always located near the right border of the container,
   * regardless of the contents of the child elements. If there is no value, the occupied space is distributed among the other child elements. */
  contextOptions?: ContextMenuModel[];
  /** Current row item information. */
  data?: TData;
  /** In case Checkbox component is specified, it is located in a fixed order,
   * otherwise it is located in the first position. If there is no value, the occupied space is distributed among the other child elements. */
  element?: React.ReactElement;
  /** Accepts id  */
  id?: string;
  /** If true, this state is shown as a rectangle in the checkbox */
  indeterminate?: boolean;
  /** Sets a callback function that is triggered when a row element is selected. Returns data value. */
  onSelect?: (checked: boolean, data?: unknown) => void;
  /** Sets a callback function that is triggered when any element except the checkbox and context menu is clicked. */
  onRowClick?: (e: React.MouseEvent) => void;
  /** Function that is invoked on clicking the icon button in the context-menu */
  onContextClick?: (value?: boolean) => void;
  /** Accepts css style  */
  style?: React.CSSProperties;
  /** Displays the loader */
  inProgress?: boolean;
  /** Function that returns an object containing the elements of the context menu */
  getContextModel?: () => ContextMenuModel[];
  /** Changes the row mode */
  mode?: TMode;
  /** Removes the borders */
  withoutBorder?: boolean;
  /** Required for index editing mode */
  isIndexEditingMode?: boolean;
  /** Indicates if the row represents a room */
  isRoom?: boolean;
  /** Title for the context menu */
  contextTitle?: string;
  /** Component for displaying badges */
  badgesComponent?: React.ReactNode;
  /** Indicates if the row is archived */
  isArchive?: boolean;
  /** Callback for closing the row context */
  rowContextClose?: () => void;
  /** URL for the badge */
  badgeUrl?: string;
  /** Disables checkbox */
  isDisabled?: boolean;
  /** Callback for changing index */
  onChangeIndex?: (action: VDRIndexingAction) => void;
  /** The item data for the row */
  item?: RowItemType;
  /** Data test id for the row */
  dataTestId?: string;
};
