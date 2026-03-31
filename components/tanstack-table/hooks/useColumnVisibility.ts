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

import { useCallback, useEffect, useRef, useState } from "react";

import type {
  ColumnSizingState,
  Table,
  VisibilityState,
} from "@tanstack/react-table";

import { TABLE_DEFAULTS } from "../TanStackTable.types";

interface UseColumnVisibilityOptions {
  /** The TanStack table instance */
  table: Table<unknown>;
  /** Container width in pixels */
  containerWidth: number;
  /** Column keys that are marked as "default" (always visible, e.g. Name) */
  defaultColumnKeys: string[];
  /** Callback when columns become hidden/shown due to responsive behavior */
  onHideColumnsChange?: (hidden: boolean) => void;
}

/**
 * Hook that manages responsive column hiding when the container is too narrow
 * to fit all enabled columns at their minimum sizes.
 *
 * Replaces the legacy `hideColumns` logic from the old TableHeader.
 */
export function useColumnVisibility({
  table,
  containerWidth,
  defaultColumnKeys,
  onHideColumnsChange,
}: UseColumnVisibilityOptions) {
  const [hideColumns, setHideColumns] = useState(false);
  const prevHideRef = useRef(false);

  const checkColumnsVisibility = useCallback(() => {
    if (!containerWidth) return;

    const visibleColumns = table
      .getAllLeafColumns()
      .filter((col) => col.getIsVisible());

    const totalMinWidth = visibleColumns.reduce<number>((sum, col) => {
      const isDefault = defaultColumnKeys.includes(col.id);
      const minWidth = isDefault
        ? TABLE_DEFAULTS.MIN_NAME_COLUMN_SIZE
        : TABLE_DEFAULTS.MIN_COLUMN_SIZE;
      return sum + minWidth;
    }, TABLE_DEFAULTS.SETTINGS_COLUMN_SIZE);

    const shouldHide =
      totalMinWidth > containerWidth;

    if (shouldHide !== prevHideRef.current) {
      prevHideRef.current = shouldHide;
      setHideColumns(shouldHide);
      onHideColumnsChange?.(shouldHide);
    }
  }, [containerWidth, table, defaultColumnKeys, onHideColumnsChange]);

  useEffect(() => {
    checkColumnsVisibility();
  }, [checkColumnsVisibility]);

  /**
   * Toggle a column's visibility. If the column is a "default" column,
   * it cannot be hidden.
   */
  const toggleColumn = useCallback(
    (columnId: string) => {
      if (defaultColumnKeys.includes(columnId)) return;

      const column = table.getColumn(columnId);
      if (column) {
        column.toggleVisibility();
      }
    },
    [table, defaultColumnKeys],
  );

  return { hideColumns, toggleColumn };
}
