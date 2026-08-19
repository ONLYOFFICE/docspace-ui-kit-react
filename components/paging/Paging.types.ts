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

import { TOption } from "../combobox";

export interface PagingProps {
  /** Label for the previous button */
  previousLabel: string;
  /** Label for the next button */
  nextLabel: string;
  /** Action for the previous button */
  previousAction: (e?: React.MouseEvent) => Promise<void> | void;
  /** Action for the next button */
  nextAction: (e?: React.MouseEvent) => Promise<void> | void;
  /** Sets previous button disabled */
  disablePrevious?: boolean;
  /** Sets the next button disabled */
  disableNext?: boolean;
  /** Initial value for pageItems */
  selectedPageItem: TOption;
  /** Initial value for countItems */
  selectedCountItem: TOption;
  /** Sets a callback function that is triggered when the page is selected */
  onSelectPage?: (option: TOption) => Promise<void> | void;
  /** Sets a callback function that is triggered when the page items are selected */
  onSelectCount?: (option: TOption) => Promise<void> | void;
  /** Paging combo box items */
  pageItems: TOption[];
  /** Items per page combo box items */
  countItems: TOption[];
  /** Indicates opening direction of combo box */
  openDirection?: "bottom" | "top" | "both";
  /** Accepts class */
  className?: string;
  /** Accepts id */
  id?: string;
  /** Accepts css style */
  style?: React.CSSProperties;
  /** Displays a combobox with the number of items per page */
  showCountItem?: boolean;
  /** Unique test id */
  dataTestId?: string;
}
