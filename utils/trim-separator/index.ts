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

import type { ContextMenuModel } from "../../components/context-menu";

const DESTRUCTIVE_ACTIONS = [
  "delete",
  "remove-from-recent",
  "remove-shared-folder-or-file",
  "remove-shared-room",
  "unsubscribe",
];

export function trimSeparator(array: ContextMenuModel[]) {
  if (!array || !Array.isArray(array) || array.length === 0) return array;

  const { length } = array;
  const result: ContextMenuModel[] = [];

  for (let index = 0; index < length; index += 1) {
    const el = array[index];

    if (el?.isSeparator && result.length > 0) {
      if (!result[result.length - 1]?.isSeparator) result.push(el);
    } else if (!el?.isSeparator && !el?.disabled) {
      result.push(el);
    }
  }

  // If there are few elements, remove all separators and leave only between the destructive group

  const nonSeparatorItems = result.filter((item) => !item?.isSeparator);

  if (nonSeparatorItems.length < 6) {
    const filteredResult: ContextMenuModel[] = [];

    for (let i = 0; i < result.length; i++) {
      const item = result[i];

      if (item?.isSeparator) {
        const nextItem = result[i + 1];
        if (
          nextItem &&
          DESTRUCTIVE_ACTIONS.includes(nextItem.key?.toString() || "")
        ) {
          filteredResult.push(item);
        }
      } else {
        filteredResult.push(item);
      }
    }

    if (filteredResult[filteredResult.length - 1]?.isSeparator) {
      filteredResult.pop();
    }

    return filteredResult;
  }

  if (result[result.length - 1]?.isSeparator) result.pop();

  return result;
}
