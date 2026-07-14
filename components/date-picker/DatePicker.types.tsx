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

import type { DateTime } from "luxon";
import type { Nullable } from "../../types";

export type DatePickerProps = {
  /** Allows to change select date text */
  selectDateText?: string;
  /** Selected date */
  initialDate?: Nullable<DateTime | Date | string>;
  /** Allow you to handle changing events of component */
  onChange: (d: null | DateTime) => void;
  /** Allows to set classname */
  className?: string;
  /** Allows to set id */
  id?: string;
  /** Specifies min choosable calendar date */
  minDate?: DateTime | Date;
  /** Specifies max choosable calendar date */
  maxDate?: DateTime | Date;
  /** Specifies calendar locale */
  locale: string;
  /** Shows calendar icon in selected item */
  showCalendarIcon?: boolean;
  /** Allows to track date outside the component */
  outerDate?: DateTime | null;
  /** Allows to set first shown date in calendar */
  openDate: DateTime | Date;
  isMobile?: boolean;
  hideCross?: boolean;
  /** Automatically positions the calendar based on available space */
  autoPosition?: boolean;
  testId?: string;
  useMaxTime?: boolean;
};
