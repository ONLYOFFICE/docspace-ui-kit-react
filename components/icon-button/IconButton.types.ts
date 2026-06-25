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

import type { IconSizeType as IconSize } from "../../utils/common-icons-style";
import type { InputSize } from "../text-input";
export type { IconSize };

export type IconButtonProps = {
  /** Sets component class */
  className?: string;
  /** Icon color */
  color?: "accent" | (string & {});
  /** Icon color on hover action */
  hoverColor?: "accent" | (string & {});
  /** Icon color on click action */
  clickColor?: "accent" | (string & {});
  /** Button height and width value */
  size?: number | IconSize | InputSize;
  /** Determines if icon fill is needed */
  isFill?: boolean;
  /** Determines if icon stroke is needed */
  isStroke?: boolean;
  /** Sets the button to present a disabled state */
  isDisabled?: boolean;
  /** Sets cursor value */
  isClickable?: boolean;
  /** Icon node */
  iconNode?: React.ReactNode;
  /** Icon name */
  iconName?: string;
  /** Icon name on hover action */
  iconHoverName?: string;
  /** Icon name on click action */
  iconClickName?: string;
  /** Sets a button callback function triggered when the button is clicked */
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  /** Sets a button callback function triggered when the cursor enters the area */
  onMouseEnter?: (e: React.MouseEvent) => void;
  /** Sets a button callback function triggered when the cursor moves down */
  onMouseDown?: (e: React.MouseEvent<HTMLDivElement>) => void;
  /** Sets a button callback function triggered when the cursor moves up */
  onMouseUp?: (e: React.MouseEvent<HTMLDivElement>) => void;
  /** Sets a button callback function triggered when the cursor leaves the icon */
  onMouseLeave?: (e: React.MouseEvent) => void;
  /** Sets component id */
  id?: string;
  /** Accepts css style */
  style?: React.CSSProperties;
  /** The data-* attribute is used to store custom data private to the page or application. Required to display a tip over the hovered element */
  dataTip?: string;
  /** Data when user hover on icon */
  title?: string;
  /** Id for testing */
  dataTestId?: string;

  tooltipId?: string;
  tooltipContent?: string;

  /** Tab index for keyboard navigation */
  tabIndex?: number;
  /** Sets a callback function triggered on key down */
  onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
};
