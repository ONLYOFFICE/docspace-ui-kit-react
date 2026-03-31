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

import React, { useMemo, useState, useCallback, useEffect } from "react";
import classNames from "classnames";

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  type ColumnDef,
  type ColumnSizingState,
  type VisibilityState,
  type SortingState,
  type ColumnResizeMode,
  type OnChangeFn,
} from "@tanstack/react-table";

import { TanStackTableProvider } from "./TanStackTableContext";
import { useColumnPersistence } from "./hooks/useColumnPersistence";
import type { ColumnPersistenceConfig } from "./TanStackTable.types";
import { TABLE_DEFAULTS } from "./TanStackTable.types";
import styles from "./TanStackTable.module.scss";

export interface TanStackTableContainerProps<TData> {
  /** Table data array */
  data: TData[];
  /** TanStack column definitions */
  columns: ColumnDef<TData, unknown>[];
  /** Column keys in order (for localStorage serialization) */
  columnKeys: string[];
  /** localStorage persistence config */
  persistenceConfig: ColumnPersistenceConfig;
  /** Initial column visibility (from legacy column.enable flags) */
  initialVisibility?: VisibilityState;
  /** Controlled sorting state */
  sorting?: SortingState;
  /** Sorting change handler */
  onSortingChange?: OnChangeFn<SortingState>;
  /** Column visibility change handler (syncs with legacy TableStore) */
  onColumnVisibilityChange?: (visibility: VisibilityState) => void;
  /** Column sizing change handler (called on resize end) */
  onColumnSizingChange?: (sizing: ColumnSizingState) => void;
  /** Resize mode: 'onChange' for live preview, 'onEnd' for after release */
  columnResizeMode?: ColumnResizeMode;
  /** RTL direction for column resizing */
  columnResizeDirection?: "ltr" | "rtl";
  /** CSS class name for the container */
  className?: string;
  /** Ref forwarded to the container div */
  forwardedRef?: React.Ref<HTMLDivElement>;
  /** Children (TanStackTableHeader, TanStackTableBody, etc.) */
  children: React.ReactNode;
}

export function TanStackTableContainer<TData>({
  data,
  columns,
  columnKeys,
  persistenceConfig,
  initialVisibility,
  sorting,
  onSortingChange,
  onColumnVisibilityChange,
  onColumnSizingChange,
  columnResizeMode = "onChange",
  columnResizeDirection = "ltr",
  className,
  forwardedRef,
  children,
}: TanStackTableContainerProps<TData>) {
  const { initialSizing, saveSizing } = useColumnPersistence(
    persistenceConfig,
    columnKeys,
  );

  const [columnSizing, setColumnSizing] =
    useState<ColumnSizingState>(initialSizing);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    initialVisibility ?? {},
  );

  const handleColumnVisibilityChange: OnChangeFn<VisibilityState> = useCallback(
    (updater) => {
      setColumnVisibility((prev) => {
        const next =
          typeof updater === "function" ? updater(prev) : updater;
        onColumnVisibilityChange?.(next);
        return next;
      });
    },
    [onColumnVisibilityChange],
  );

  const handleColumnSizingChange: OnChangeFn<ColumnSizingState> = useCallback(
    (updater) => {
      setColumnSizing((prev) => {
        const next =
          typeof updater === "function" ? updater(prev) : updater;
        return next;
      });
    },
    [],
  );

  // Track whether a column is currently being resized
  const isResizingRef = React.useRef(false);

  const table = useReactTable({
    data,
    columns,
    defaultColumn: {
      minSize: TABLE_DEFAULTS.MIN_COLUMN_SIZE,
      size: TABLE_DEFAULTS.MIN_COLUMN_SIZE,
    },
    state: {
      columnSizing,
      columnVisibility,
      sorting,
    },
    columnResizeMode,
    columnResizeDirection,
    onColumnSizingChange: handleColumnSizingChange,
    onColumnSizingInfoChange: (updater) => {
      // Use functional form to detect resize end
      const prevIsResizing = isResizingRef.current;
      // We need to let TanStack handle the update internally;
      // just detect transitions from resizing → not resizing
      if (typeof updater === "function") {
        // Peek at the result to detect resize end
        const dummyPrev = { isResizingColumn: prevIsResizing ? "col" : false };
        const next = updater(dummyPrev as never);
        const nowResizing = !!next.isResizingColumn;
        if (prevIsResizing && !nowResizing) {
          saveSizing(columnSizing);
          onColumnSizingChange?.(columnSizing);
        }
        isResizingRef.current = nowResizing;
      }
    },
    onColumnVisibilityChange: handleColumnVisibilityChange,
    onSortingChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: sorting ? getSortedRowModel() : undefined,
    enableColumnResizing: true,
  });

  // Build gridTemplateColumns string from table column state
  // This maintains compatibility with the existing CSS grid row layout
  const gridTemplateColumns = useMemo(() => {
    const visibleColumns = table.getVisibleLeafColumns();
    const parts = visibleColumns.map((col) => `${col.getSize()}px`);
    parts.push(`${TABLE_DEFAULTS.SETTINGS_COLUMN_SIZE}px`);
    return parts.join(" ");
  }, [table, columnSizing, columnVisibility]);

  const containerClasses = classNames(
    styles.tanstackTableContainer,
    "table-container",
    className,
  );

  return (
    <TanStackTableProvider value={table}>
      <div
        id="table-container"
        ref={forwardedRef}
        className={containerClasses}
        style={{ gridTemplateColumns }}
        data-testid="table-container"
      >
        {children}
      </div>
    </TanStackTableProvider>
  );
}
