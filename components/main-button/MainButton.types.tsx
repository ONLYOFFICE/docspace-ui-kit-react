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

import { RefObject } from "react";
import { ContextMenuModel } from "../context-menu";
import { GuidanceRefKey } from "../../enums";


export type MainButtonProps = {
  /** Button text */
  text?: string;
  /** Sets the button to present a disabled state */
  isDisabled?: boolean;
  /** Activates a drop-down list for MainButton */
  isDropdown?: boolean;
  /** Sets a callback function that is triggered when the button is clicked */
  onAction?: (e: React.MouseEvent) => void;
  /** Opens DropDown */
  opened?: boolean; // TODO: Make us whole
  /** Accepts class */
  className?: string;
  /** Accepts id */
  id?: string;
  /** Accepts css style */
  style?: React.CSSProperties;
  /** Data model menu */
  model: ContextMenuModel[];
  /** Hide the dropdown arrow while keeping dropdown functionality */
  hideArrow?: boolean;
  /** Function to set reference map */
  setRefMap?: (
    key: GuidanceRefKey,
    ref: RefObject<HTMLDivElement | null>,
  ) => void;
  /**
   * Element used to anchor and size the dropdown. Defaults to the button's
   * own rect; pass an outer wrapper when the button is visually nested
   * inside a larger clickable area (e.g. inside SearchInput).
   */
  anchorRef?: RefObject<HTMLElement | null>;
};