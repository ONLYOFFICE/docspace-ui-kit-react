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

export type DropDownItemProps = {
  // Display and Layout Props
  /** Whether to render the item as a separator line instead of content */
  isSeparator?: boolean;
  /** Whether to render the item as a header with special styling */
  isHeader?: boolean;
  /** Custom height of the dropdown item in pixels */
  height?: number;
  /** Custom height of the dropdown item for tablet devices in pixels */
  heightTablet?: number;
  /** Whether to use modern compact styling with minimal padding */
  isModern?: boolean;
  /** Whether text content should be truncated with ellipsis when it overflows */
  textOverflow?: boolean;
  /** Whether to apply additional text truncation styling to the label */
  truncateText?: boolean;

  // Icon Related Props
  /** URL or path to the icon to display at the start of the item */
  icon?: string | React.ReactElement | React.ElementType;
  /** Whether the icon should be filled with the current text color. If false, uses original icon colors */
  fillIcon?: boolean;
  /** Whether to hide the icon element even when an icon prop is provided */
  withoutIcon?: boolean;
  /** Whether to show a back arrow icon when item is a header */
  withHeaderArrow?: boolean;
  /** Callback function triggered when the header's back arrow is clicked */
  headerArrowAction?: () => void;

  // Content Props
  /** Primary text content or React node to display in the item */
  label?: string | React.ReactNode;
  /** Additional React nodes to render after the label */
  children?: React.ReactNode;
  /** Additional element to render at the end of the item, after all other content */
  additionalElement?: React.ReactNode;

  // State and Interaction Props
  /** Whether the item is in a disabled state and cannot be interacted with */
  disabled?: boolean;
  /** Whether the item is in an active/pressed state */
  isActive?: boolean;
  /** Whether the item is currently selected in a menu context */
  isSelected?: boolean;
  /** Whether the item is the current active descendant for keyboard navigation */
  isActiveDescendant?: boolean;
  /** Whether to disable the hover state styling */
  noHover?: boolean;
  /** Whether to disable the active/pressed state styling */
  noActive?: boolean;
  /** Whether this item opens a submenu when clicked */
  isSubMenu?: boolean;
  /** Whether to show a beta badge next to the item */
  isBeta?: boolean;
  /** Whether to show a paid badge next to the item */
  isPaidBadge?: boolean;
  /** Sets paid badge label */
  badgeLabel?: string;
  /** Whether to show an external link icon at the end of the item */
  withExternalLink?: boolean;
  /** URL to navigate to when the external link icon is clicked */
  externalLinkPath?: string;
  /** Callback triggered when the external link icon is clicked */
  onExternalLinkClick?: () => void;

  // Toggle Props
  /** Whether to show a toggle switch at the end of the item */
  withToggle?: boolean;
  /** Whether the toggle switch is in a checked state */
  checked?: boolean;

  // Event Handlers
  /** Callback function triggered when the item is clicked */
  onClick?: (
    e: React.MouseEvent<HTMLElement> | React.ChangeEvent<HTMLInputElement>,
  ) => void;
  /** Callback function triggered on mouse down */
  onMouseDown?: (e: React.MouseEvent<HTMLElement>) => void;
  /** Callback function triggered when a selected item is clicked */
  onClickSelectedItem?: () => void;
  /** Callback function to control the open state of a parent dropdown */
  setOpen?: (open: boolean) => void;

  // Styling Props
  /** CSS class name to apply to the root element for custom styling */
  className?: string;
  /** Inline CSS styles to apply to the root element */
  style?: React.CSSProperties;
  /** HTML ID attribute for the root element */
  id?: string;
  /** Tab index for keyboard navigation order */
  tabIndex?: number;
  /** Sets minimum width for the root element */
  minWidth?: string;

  testId?: string;

  tooltip?: string;

  betaLabel?: string;
  paidLabel?: string;

  /** When true, stops mousedown propagation to prevent click-outside detection from closing dropdown before click fires */
  stopMouseDownPropagation?: boolean;
};
