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

export type TextProps = {
  /** Ref to access the DOM element or React component instance */
  ref?: React.RefObject<HTMLDivElement | null>;
  /** Sets the tag through which the component is rendered */
  as?: React.ElementType;
  /** Accepts the tag id */
  tag?: string;
  /** Sets background color */
  backgroundColor?: string;
  /** Specifies the text color */
  color?: string;
  /** Sets the 'display' property */
  display?: string;
  /** Sets the font size */
  fontSize?: string;
  /** Sets the font weight */
  fontWeight?: number | string;
  /** Sets font weight value to bold */
  isBold?: boolean;
  /** Sets the 'display: inline-block' property */
  isInline?: boolean;
  /** Sets the font style to italic */
  isItalic?: boolean;
  /** Sets the line height */
  lineHeight?: string;
  /** Disables text selection */
  noSelect?: boolean;
  /** Sets the 'text-align' property */
  textAlign?: "left" | "center" | "right" | "justify";
  /** Title attribute for hover tooltip */
  title?: string;
  /** Sets the class name */
  className?: string;
  /** Disables word wrapping */
  truncate?: boolean;
  /** HTML id attribute */
  id?: string;
  /** Additional inline styles */
  style?: React.CSSProperties;
  /** Text direction */
  dir?: "ltr" | "rtl" | "auto";
  /** Child elements */
  children?: React.ReactNode;
  /** Click event handler */
  onClick?: (e: React.MouseEvent<Element>) => void;
  /** For label association */
  htmlFor?: string;
  /** Visual style variant */
  view?: string;
  /** Link href */
  href?: string;
  /** Used as HTML `rel` property */
  rel?: string;
  /** Used as HTML `tabindex` property */
  tabIndex?: number;
  /** Used in container component */
  containerWidth?: string;
  /** Used in container component */
  containerMinWidth?: string;
  /** Test id */
  dataTestId?: string;
};
