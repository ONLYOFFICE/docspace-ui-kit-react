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

import type { TColorScheme } from "../../context/ThemeContext";

export type SliderProps = {
  /** Accepts id */
  id?: string;

  /** Accepts class */
  className?: string;
  /** Sets the width of the input thumb */
  thumbWidth?: string;
  /** Sets the height of the input thumb */
  thumbHeight?: string;
  /** Sets the border width of the input thumb */
  thumbBorderWidth?: string;
  /** Sets the height of the runnableTrack for the input */
  runnableTrackHeight?: string;
  /** The change event is triggered when the elelment's value is modified */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Determines min range value */
  min: number;
  /** Determines max range value */
  max: number;
  /** Specifies the increment/decrement step size */
  step?: number;
  /** Default input value */
  value: number;
  /** Sets the background color of the runnableTrack */
  withPouring?: boolean;
  /** Disables the input  */
  isDisabled?: boolean;
  /** Accepts css */
  style?: React.CSSProperties;
  /** Accepts dataTestId */
  dataTestId?: string;
};

export type SliderThemeProps = SliderProps & {
  $currentColorScheme?: TColorScheme;
  sizeProp?: string;
};
