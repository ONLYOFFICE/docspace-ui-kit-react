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

import { ContextMenuModel } from "../context-menu";
import { type TDirectionX, TDirectionY } from "../../types";

export type TDropdownType = "alwaysDashed" | "appearDashedAfterHover";

export type SimpleLinkWithDropdownProps = {
  /** Sets font weight to bold */
  isBold?: boolean;
  /** Link font size */
  fontSize?: string;
  /** Link font weight */
  fontWeight?: number;
  /** Activates text-overflow with ellipsis */
  isTextOverflow?: boolean;
  /** Indicates if the link is in hover state */
  isHovered?: boolean;
  /** Sets opacity to 0.5 for pending status */
  isSemitransparent?: boolean;
  /** Link color */
  color?: string;
  /** Link title attribute */
  title?: string;
  /** Disables the link */
  isDisabled?: boolean;
  /** Dropdown display type */
  dropdownType?: TDropdownType;
  /** Dropdown menu items */
  data?: ContextMenuModel[];
  /** Link content */
  children?: React.ReactNode;
};

export type LinkWithDropDownProps = SimpleLinkWithDropdownProps & {
  /** Displays the expander icon */
  withExpander?: boolean;
  /** Controls dropdown visibility */
  isOpen?: boolean;
  /** Additional CSS class for the link */
  className?: string;
  /** Additional CSS class for the dropdown */
  dropDownClassName?: string;
  /** HTML id attribute */
  id?: string;
  /** Additional inline styles */
  style?: React.CSSProperties;
  /** Sets the dropdown opening horizontal direction */
  directionX?: TDirectionX;
  /** Sets the dropdown opening vertical direction */
  directionY?: TDirectionY;
  /** Enables scrollbar in dropdown */
  hasScroll?: boolean;
  /** Manual width for the dropdown */
  manualWidth?: string;
  /** Is aside */
  isAside?: boolean;
  /** Without blur background */
  withoutBackground?: boolean;
  /** Fix dropdown direction regardless of available space */
  fixedDirection?: boolean;
  /** Use default mode for dropdown positioning */
  isDefaultMode?: boolean;
  /** Minimum space from top of viewport */
  topSpace?: number;
  /** Minimum space from bottom of viewport */
  bottomSpace?: number;
  /** Enables dynamic height calculation and project Scrollbar for the dropdown list */
  withDynamicScrollbar?: boolean;
};
