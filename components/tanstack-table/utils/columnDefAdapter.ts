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

import type { ColumnDef, VisibilityState } from "@tanstack/react-table";

import type { TTableColumn } from "../../table/Table.types";
import { TABLE_DEFAULTS } from "../TanStackTable.types";

/**
 * Adapts legacy TTableColumn definitions to TanStack ColumnDef format.
 *
 * The legacy columns carry UI callbacks (onClick for sorting, onChange for
 * visibility toggle) that don't map to TanStack's declarative model.
 * Those callbacks are preserved in `meta` so consumers can access them.
 */
export function adaptLegacyColumns<TData>(
  columns: TTableColumn[],
): ColumnDef<TData>[] {
  return columns.map((col) => ({
    id: col.key,
    header: col.title,
    enableResizing: col.resizable ?? false,
    enableSorting: !!col.sortBy,
    minSize: col.minWidth ?? TABLE_DEFAULTS.MIN_COLUMN_SIZE,
    size: col.defaultSize,
    meta: {
      legacyKey: col.key,
      sortBy: col.sortBy,
      isDefault: col.default ?? false,
      isShort: col.isShort ?? false,
      withTagRef: col.withTagRef ?? false,
      onClick: col.onClick,
      onChange: col.onChange,
      onIconClick: col.onIconClick,
      checkbox: col.checkbox,
      isDisabled: col.isDisabled,
    },
  }));
}

/**
 * Extracts initial VisibilityState from legacy column definitions.
 */
export function extractVisibility(columns: TTableColumn[]): VisibilityState {
  const visibility: VisibilityState = {};
  for (const col of columns) {
    visibility[col.key] = col.enable !== false;
  }
  return visibility;
}

/**
 * Finds the default (Name) column key from a list of legacy columns.
 * Returns undefined if no column is marked as default.
 */
export function findDefaultColumnKey(
  columns: TTableColumn[],
): string | undefined {
  return columns.find((col) => col.default)?.key;
}
