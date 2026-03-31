// (c) Copyright Ascensio System SIA 2009-2026
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

import type { ColumnSizingState } from "@tanstack/react-table";

import { TABLE_DEFAULTS } from "../TanStackTable.types";

/**
 * Parses a legacy gridTemplateColumns string (e.g. "300px 200px 150px 24px")
 * into an array of pixel values.
 */
export function parseGridTemplateColumns(gridTemplate: string): number[] {
  return gridTemplate
    .split(" ")
    .map((s) => parseFloat(s))
    .filter((n) => !Number.isNaN(n));
}

/**
 * Converts a legacy gridTemplateColumns string from localStorage
 * to TanStack's ColumnSizingState.
 *
 * @param gridTemplate - e.g. "340px 200px 200px 24px"
 * @param columnKeys - ordered column keys matching the grid template,
 *                     excluding the settings column (last 24px)
 * @returns ColumnSizingState, e.g. { Name: 340, People: 200, "Head of Group": 200 }
 */
export function migrateGridTemplateToSizing(
  gridTemplate: string,
  columnKeys: string[],
): ColumnSizingState {
  const widths = parseGridTemplateColumns(gridTemplate);
  const sizing: ColumnSizingState = {};

  for (let i = 0; i < columnKeys.length; i++) {
    const width = widths[i];
    if (width !== undefined && width !== TABLE_DEFAULTS.SETTINGS_COLUMN_SIZE) {
      sizing[columnKeys[i]] = width;
    }
  }

  return sizing;
}

/**
 * Converts TanStack ColumnSizingState back to a legacy gridTemplateColumns string.
 * Used during migration to write both formats for safe rollback.
 *
 * @param sizing - TanStack column sizing state
 * @param columnKeys - ordered column keys
 * @returns CSS gridTemplateColumns string, e.g. "340px 200px 200px 24px"
 */
export function sizingToGridTemplate(
  sizing: ColumnSizingState,
  columnKeys: string[],
  defaultSize: number = TABLE_DEFAULTS.MIN_COLUMN_SIZE,
): string {
  const parts = columnKeys.map(
    (key) => `${sizing[key] ?? defaultSize}px`,
  );
  parts.push(`${TABLE_DEFAULTS.SETTINGS_COLUMN_SIZE}px`);
  return parts.join(" ");
}

/**
 * Detects whether a localStorage value is in the legacy format
 * (space-separated "Npx" values) or the new JSON format.
 */
export function isLegacyFormat(value: string): boolean {
  return value.includes("px") && !value.startsWith("{");
}

/**
 * Reads column sizing from localStorage, supporting both legacy and new formats.
 */
export function readSizingFromStorage(
  storageKey: string,
  columnKeys: string[],
): ColumnSizingState | null {
  const raw = localStorage.getItem(storageKey);
  if (!raw) return null;

  if (isLegacyFormat(raw)) {
    return migrateGridTemplateToSizing(raw, columnKeys);
  }

  try {
    return JSON.parse(raw) as ColumnSizingState;
  } catch {
    return null;
  }
}

/**
 * Writes column sizing to localStorage in both formats during migration.
 * After migration is complete, only the JSON format will be written.
 */
export function writeSizingToStorage(
  storageKey: string,
  sizing: ColumnSizingState,
  columnKeys: string[],
  dualWrite: boolean = true,
): void {
  if (dualWrite) {
    // Write legacy format for rollback compatibility
    localStorage.setItem(
      storageKey,
      sizingToGridTemplate(sizing, columnKeys),
    );
  } else {
    localStorage.setItem(storageKey, JSON.stringify(sizing));
  }
}
