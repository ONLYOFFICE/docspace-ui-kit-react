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

import { ReactNode, CSSProperties } from "react";
import { TTooltipPlace } from "../tooltip";

export type FieldContainerProps = {
  /** Vertical or horizontal alignment */
  isVertical?: boolean;
  /** Remove default margin property */
  removeMargin?: boolean;
  /** CSS class name for custom styling */
  className?: string;
  /** Indicates that the field is required */
  isRequired?: boolean;
  /** Indicates that the field has an error state */
  hasError?: boolean;
  /** Controls visibility of the field label section */
  labelVisible?: boolean;
  /** Field label text or element */
  labelText?: string | ReactNode;
  /** Icon source URL */
  icon?: string;
  /** Renders the help button inline instead of in a separate div */
  inlineHelpButton?: boolean;
  /** Child elements */
  children: ReactNode;
  /** Content to display in the tooltip */
  tooltipContent?: string | ReactNode;
  /** Global position of the tooltip */
  place?: TTooltipPlace;
  /** Tooltip header content (displayed in aside) */
  helpButtonHeaderContent?: string;
  /** Maximum label width in horizontal alignment (e.g., "110px") */
  maxLabelWidth?: string;
  /** Error message to display when hasError is true */
  errorMessage?: string;
  /** Custom color for error text */
  errorColor?: string;
  /** Width of the error message container (e.g., "293px") */
  errorMessageWidth?: string;
  /** HTML id attribute */
  id?: string;
  /** Inline CSS styles */
  style?: CSSProperties;
  /** Right offset in pixels */
  offsetRight?: number;
  /** Maximum width of the tooltip */
  tooltipMaxWidth?: string;
  /** Additional CSS class for tooltip */
  tooltipClass?: string;

  dataTestId?: string;
};
