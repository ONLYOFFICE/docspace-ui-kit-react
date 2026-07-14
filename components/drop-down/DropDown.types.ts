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

import type { JSX } from "react";
import type { TDirectionX, TDirectionY } from "../../types";

export interface DropDownProps {
  /** Children elements */
  children?: React.ReactNode;
  /** Accepts class */
  className?: string;
  /** Required for determining a click outside DropDown with the withBackdrop parameter */
  clickOutsideAction?: (e: Event, open: boolean) => void;
  disableOnClickOutside?: boolean;
  enableOnClickOutside?: () => void;
  /** Sets the opening direction relative to the parent */
  directionX?: TDirectionX;
  /** Sets the opening direction relative to the parent */
  directionY?: TDirectionY;
  /** Accepts id */
  id?: string;
  /** Required for specifying the exact width of the component; for example; 100% */
  manualWidth?: string;
  /** (Non portal only) Required for specifying the exact distance from the parent component */
  manualX?: string;
  /** (Non portal only) Required for specifying the exact distance from the parent component */
  manualY?: string;
  /** Required if the scrollbar is displayed */
  maxHeight?: number;
  /** Sets the dropdown to be opened */
  open?: boolean;
  /** Accepts css style */
  style?: React.CSSProperties;
  /** Used to display backdrop */
  withBackdrop?: boolean;
  /** Count of columns */
  columnCount?: number;
  /** Sets the disabled items to display */
  showDisabledItems?: boolean;
  forwardedRef?: React.RefObject<HTMLElement | null>;
  /** Sets the operation mode of the component. The default option is set to portal mode */
  isDefaultMode?: boolean;
  /** Disables check position. Used to set the direction explicitly */
  fixedDirection?: boolean;
  /** Enables blur for backdrop */
  withBlur?: boolean;
  /** (Portal only) Specifies the horizontal offset */
  offsetX?: number;
  /** Test id */
  dataTestId?: string;

  isMobileView?: boolean;
  isNoFixedHeightOptions?: boolean;
  /** Disables scrollbar inline padding to allow hover styles to extend to edge */
  disableScrollbarPadding?: boolean;
  /** Use flexible maxHeight instead of fixed height for scrollbar (allows shrinking when fewer items) */
  useFlexibleHeight?: boolean;
  enableKeyboardEvents?: boolean;
  appendTo?: HTMLElement;
  isAside?: boolean;
  withBackground?: boolean;
  eventTypes?: string[] | string;
  forceCloseClickOutside?: boolean;
  withoutBackground?: boolean;
  zIndex?: number;
  topSpace?: number;
  bottomSpace?: number;
  withDynamicScrollbar?: boolean;
  usePortalBackdrop?: boolean;
  backDrop?: JSX.Element | null;
  shouldShowBackdrop?: boolean;
}

export interface VirtualListProps {
  /** Width of the list */
  width: number;
  /** Whether the dropdown is open */
  isOpen: boolean;
  /** Number of items in the list */
  itemCount: number;
  /** Maximum height of the list */
  maxHeight?: number;
  /** Calculated height based on items and maxHeight */
  calculatedHeight: number;
  /** Whether to use fixed height options */
  isNoFixedHeightOptions: boolean;
  /** Disables scrollbar inline padding to allow hover styles to extend to edge */
  disableScrollbarPadding?: boolean;
  /** Use flexible maxHeight instead of fixed height for scrollbar */
  useFlexibleHeight?: boolean;
  /** Clean children elements */
  cleanChildren?: React.ReactNode;
  /** Children elements */
  children: React.ReactElement | React.ReactNode;
  /** Row component */
  Row: React.MemoExoticComponent<
    ({ data, index, style }: RowProps) => JSX.Element
  >;
  /** Whether to enable keyboard events */
  enableKeyboardEvents: boolean;
  /** Function to get item size */
  getItemSize: (index: number) => number;
}

export interface RowProps {
  /** Row data */
  data: {
    /** Children elements */
    children?: React.ReactNode;
    /** Currently active index */
    activeIndex?: number;
    /** Currently selected index */
    activedescendant?: number;
    /** Mouse move handler */
    handleMouseMove?: (index: number) => void;
  };
  /** Row index */
  index: number;
  /** Row style */
  style: React.CSSProperties;
}
