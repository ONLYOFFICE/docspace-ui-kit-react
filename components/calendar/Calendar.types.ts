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

export interface CalendarProps {
  /** Class name */
  className?: string;
  /** Used as HTML `id` property  */
  id?: string;
  /** Specifies the calendar locale */
  locale: string;
  /** Value of selected date (DateTime object) */
  selectedDate: DateTime;
  /** Allows handling the changing events of the component */
  onChange?: (formattedDate: DateTime) => void;
  /** Changes the selected date state */
  setSelectedDate?: (formattedDate: DateTime) => void;
  /** Specifies the minimum selectable date */
  minDate?: DateTime | Date;
  /** Specifies the maximum selectable date */
  maxDate?: DateTime | Date;
  /** Accepts css style */
  style?: React.CSSProperties;
  /** First shown date */
  initialDate?: DateTime | Date;
  isMobile?: boolean;
  forwardedRef?: React.RefObject<HTMLDivElement | null>;
  isScroll?: boolean;
  /** Data test id for testing */
  dataTestId?: string;
  useMaxTime?: boolean;
}

export interface DaysProps {
  observedDate: DateTime;
  setObservedDate: React.Dispatch<React.SetStateAction<DateTime>>;
  setSelectedScene: React.Dispatch<React.SetStateAction<number>>;
  handleDateChange: (date: DateTime) => void;
  selectedDate: DateTime;
  minDate: DateTime;
  maxDate: DateTime;
  isMobile: boolean;
  isScroll?: boolean;
  locale?: string;
}

export interface DaysHeaderProps {
  observedDate: DateTime;
  setObservedDate: React.Dispatch<React.SetStateAction<DateTime>>;
  setSelectedScene: React.Dispatch<React.SetStateAction<number>>;
  minDate: DateTime;
  maxDate: DateTime;
  isMobile: boolean;
  locale?: string;
}

export interface DaysBodyProps {
  observedDate: DateTime;
  handleDateChange: (date: DateTime) => void;
  selectedDate: DateTime;
  minDate: DateTime;
  maxDate: DateTime;
  isMobile: boolean;
  isScroll?: boolean;
  locale?: string;
}

export interface HeaderButtonsProps {
  onLeftClick: React.MouseEventHandler<HTMLButtonElement>;
  onRightClick: React.MouseEventHandler<HTMLButtonElement>;
  isLeftDisabled: boolean;
  isRightDisabled: boolean;
  isMobile: boolean;
}

export interface MonthsProps {
  observedDate: DateTime;
  setObservedDate: React.Dispatch<React.SetStateAction<DateTime>>;
  selectedDate: DateTime;
  setSelectedScene: React.Dispatch<React.SetStateAction<number>>;
  minDate: DateTime;
  maxDate: DateTime;
  isMobile: boolean;
  isScroll?: boolean;
  locale?: string;
}

export interface MonthsBodyProps {
  observedDate: DateTime;
  setObservedDate: React.Dispatch<React.SetStateAction<DateTime>>;
  selectedDate: DateTime;
  setSelectedScene: React.Dispatch<React.SetStateAction<number>>;
  minDate: DateTime;
  maxDate: DateTime;
  isMobile: boolean;
  isScroll?: boolean;
  locale?: string;
}

export interface MonthsHeaderProps {
  observedDate: DateTime;
  setObservedDate: React.Dispatch<React.SetStateAction<DateTime>>;
  setSelectedScene: React.Dispatch<React.SetStateAction<number>>;
  minDate: DateTime;
  maxDate: DateTime;
  isMobile: boolean;
}

export interface YearsProps {
  observedDate: DateTime;
  setObservedDate: React.Dispatch<React.SetStateAction<DateTime>>;
  selectedDate: DateTime;
  setSelectedScene: React.Dispatch<React.SetStateAction<number>>;
  minDate: DateTime;
  maxDate: DateTime;
  isMobile: boolean;
  isScroll?: boolean;
}

export interface YearsHeaderProps {
  observedDate: DateTime;
  setObservedDate: React.Dispatch<React.SetStateAction<DateTime>>;
  minDate: DateTime;
  maxDate: DateTime;
  isMobile: boolean;
}
