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

import type { TTableColumn } from "./Table.types";
import { MIN_COLUMN_SIZE, MIN_NAME_COLUMN_SIZE } from "./Table.constants";

/** Convert TTableColumn[] to TanStack ColumnDef[]. */
export function columnDefsFromColumns<TData>(
  cols: TTableColumn[],
): ColumnDef<TData, unknown>[] {
  return cols.map((col) => ({
    id: col.key,
    // Stub accessor — table-v2 uses children-as-function cell rendering
    // biome-ignore lint: accessorFn must return something; null is fine here
    accessorFn: () => null as unknown,
    header: col.title,
    minSize:
      col.minWidth ?? (col.default ? MIN_NAME_COLUMN_SIZE : MIN_COLUMN_SIZE),
    size:
      col.defaultSize ??
      (col.default ? MIN_NAME_COLUMN_SIZE : MIN_COLUMN_SIZE),
    enableResizing: !col.defaultSize && col.resizable !== false,
    meta: {
      default: col.default ?? false,
      isShort: col.isShort ?? false,
      isDisabled: col.isDisabled ?? false,
      defaultSize: col.defaultSize,
      sortBy: col.sortBy,
      onClick: col.onClick,
      onIconClick: col.onIconClick,
      onChange: col.onChange,
      checkbox: col.checkbox,
      title: col.title,
      withTagRef: col.withTagRef ?? false,
    },
  }));
}

/** Build a TanStack VisibilityState from TTableColumn[]. */
export function columnsToVisibility(cols: TTableColumn[]): VisibilityState {
  return Object.fromEntries(cols.map((c) => [c.key, c.enable !== false]));
}

/** Extract ordered column key array from TTableColumn[]. */
export function columnsToKeys(cols: TTableColumn[]): string[] {
  return cols.map((c) => c.key);
}
