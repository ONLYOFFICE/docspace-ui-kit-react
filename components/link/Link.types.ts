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

import type { LinkTarget, LinkType } from "./Link.enums";
import type { TextProps } from "../text";

export type LinkProps = TextProps & {
  /** Used as HTML `href` property */
  href?: string;
  /** Accepts id */
  id?: string;
  /** Sets font weight */
  isBold?: boolean;
  /** Sets hovered state and link effects */
  isHovered?: boolean;
  /** Sets the 'opacity' css-property to 0.5. Usually applied for the users with "pending" status */
  isSemitransparent?: boolean;
  /** Activates or deactivates _text-overflow_ CSS property with ellipsis (' ... ') value */
  isTextOverflow?: boolean;
  /** Disables hover effect */
  noHover?: boolean;
  /** Enables user selection */
  enableUserSelect?: boolean;
  /** Sets the link type */
  type?: LinkType;
  /** Sets the target attribute */
  target?: LinkTarget;
  /** Label */
  label?: string;
  /** Sets the text decoration style */
  textDecoration?:
    | "none"
    | "underline"
    | "line-through"
    | "overline"
    | "underline dotted"
    | "underline dashed";
  /** Accessibility label for the link */
  ariaLabel?: string;
  /** Data attribute for testing */
  dataTestId?: string;
  /** Sets a callback function that is triggered when the link is clicked. Only for 'action' type of link */
  onClick?: (e: React.MouseEvent<Element>) => void;
  /** Used as HTML `rel` property */
  rel?: string;
  /** Used as HTML `tabindex` property */
  tabIndex?: number;
  /** Used as HTML `title` property */
  title?: string;
  /** CSS color or accent theme color */
  color?: "accent" | (string & {});
};
