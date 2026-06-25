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

import type React from "react";

import type { TextProps } from "../text";

export type BadgeProps = TextProps & {
  /** Ref to access the DOM element or React component instance */
  ref?: React.RefObject<HTMLDivElement>;
  /** Content to be displayed inside the badge. Can be a number (e.g., notification count) or text */
  label?: string | number;
  /** Custom border radius to adjust badge corners. Accepts CSS size values */
  borderRadius?: string;
  /** Custom padding to adjust badge spacing. Accepts CSS padding values */
  padding?: string;
  /** Maximum width of the badge. Useful for text truncation. Accepts CSS size values */
  maxWidth?: string;
  /** Mouse leave event handler */
  onMouseLeave?: (e: React.MouseEvent) => void;
  /** Mouse over event handler */
  onMouseOver?: (e: React.MouseEvent) => void;
  /** Disable hover effect */
  noHover?: boolean;
  /** Sets badge type to high priority. Changes visual appearance */
  type?: "high";
  /** Custom border style for the badge. Accepts CSS border values */
  border?: string;
  /** Custom height for the badge. Accepts CSS size values */
  height?: string;
  /** When true, applies version badge specific styling. Used for displaying version numbers */
  isVersionBadge?: boolean;
  /** When true, applies muted styling for less prominent notifications or inactive states */
  isMutedBadge?: boolean;
  /** When true, applies special styling for paid/premium features */
  isPaidBadge?: boolean;
  /** Handler for mouse over events. Used for hover state management and interactions */
  /** When true, applies custom hover styles */
  isHovered?: boolean;
  /** Data test id for testing */
  dataTestId?: string;
};
