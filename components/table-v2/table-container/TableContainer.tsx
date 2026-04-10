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

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import classNames from "classnames";

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  type ColumnSizingState,
  type VisibilityState,
  type SortingState,
  type OnChangeFn,
} from "@tanstack/react-table";

import { TableProvider } from "../context/TableContext";
import {
  useColumnPersistence,
  type ColumnPersistenceConfig,
} from "../hooks/useColumnPersistence";
import { useColumnDistribution } from "../hooks/useColumnDistribution";
import { useColumnResize } from "../hooks/useColumnResize";
import {
  columnDefsFromColumns,
  columnsToVisibility,
  columnsToKeys,
} from "../Table.utils";
import { MIN_COLUMN_SIZE } from "../Table.constants";
import type { TTableColumn } from "../Table.types";

import styles from "../Table.module.scss";

export interface TableContainerProps<TData = unknown> {
  /** Column definitions (TTableColumn shape) */
  columns: TTableColumn[];
  /** Row data (optional — body uses children-as-function for actual rendering) */
  data?: TData[];
  /** localStorage key for column sizing */
  columnStorageName: string;
  /** localStorage key used when info panel is open */
  columnInfoPanelStorageName?: string;
  /** Whether the info panel is currently visible */
  infoPanelVisible?: boolean;
  /** Inline editing mode — hides resize handles */
  isIndexEditingMode?: boolean;
  /** Controlled sorting state */
  sorting?: SortingState;
  /** Sorting change handler */
  onSortingChange?: OnChangeFn<SortingState>;
  /** Called when column visibility changes */
  onColumnVisibilityChange?: (visibility: VisibilityState) => void;
  /** Called when a resize gesture ends */
  onColumnSizingChange?: (sizing: ColumnSizingState) => void;
  /** Notifies parent when hideColumns state changes */
  setHideColumns?: (hide: boolean) => void;
  /** RTL resize direction */
  columnResizeDirection?: "ltr" | "rtl";
  /** Additional CSS class for the container div */
  className?: string;
  /** Forwarded ref for the container div */
  forwardedRef?: React.Ref<HTMLDivElement>;
  children: React.ReactNode;
}

export function TableContainer<TData = unknown>({
  columns,
  data = [],
  columnStorageName,
  columnInfoPanelStorageName,
  infoPanelVisible,
  isIndexEditingMode = false,
  sorting,
  onSortingChange,
  onColumnVisibilityChange,
  onColumnSizingChange,
  setHideColumns,
  columnResizeDirection = "ltr",
  className,
  forwardedRef,
  children,
}: TableContainerProps<TData>) {
  const columnKeys = useMemo(() => columnsToKeys(columns), [columns]);
  const columnDefs = useMemo(
    () => columnDefsFromColumns<TData>(columns),
    [columns],
  );

  const persistenceConfig: ColumnPersistenceConfig = {
    columnStorageName,
    columnInfoPanelStorageName,
    infoPanelVisible,
  };

  const { initialSizing, saveSizing } = useColumnPersistence(
    persistenceConfig,
    columnKeys,
  );

  const {
    columnSizing,
    setColumnSizing,
    containerWidth,
    hideColumns,
    containerRef,
  } = useColumnDistribution(columns, initialSizing, saveSizing, forwardedRef);

  // Notify parent when hideColumns changes
  useEffect(() => {
    setHideColumns?.(hideColumns);
  }, [hideColumns, setHideColumns]);

  // ─── Column visibility ────────────────────────────────────────────────────
  // Derived from the `enable` flag on each column. Synced synchronously when
  // `columns` prop changes (useState only initialises once).

  const derivedVisibility = columnsToVisibility(columns);
  const prevDerivedVisRef = useRef(derivedVisibility);

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    derivedVisibility,
  );

  // Detect prop-driven visibility changes (e.g. toggle from store)
  let effectiveVisibility = columnVisibility;
  if (
    JSON.stringify(derivedVisibility) !==
    JSON.stringify(prevDerivedVisRef.current)
  ) {
    prevDerivedVisRef.current = derivedVisibility;
    effectiveVisibility = derivedVisibility;
    setColumnVisibility(derivedVisibility);
  }

  const handleColumnVisibilityChange: OnChangeFn<VisibilityState> =
    useCallback(
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

  // ─── TanStack table instance ──────────────────────────────────────────────
  // Column resizing is handled via DOM mutations in useColumnResize; TanStack
  // is used only for column definitions, visibility, and sorting.

  const table = useReactTable({
    data: data as TData[],
    columns: columnDefs,
    defaultColumn: {
      minSize: MIN_COLUMN_SIZE,
      size: MIN_COLUMN_SIZE,
    },
    state: {
      columnSizing,
      columnVisibility: effectiveVisibility,
      sorting,
    },
    enableColumnResizing: true,
    columnResizeDirection,
    onColumnSizingChange: setColumnSizing as OnChangeFn<ColumnSizingState>,
    onColumnVisibilityChange: handleColumnVisibilityChange,
    onSortingChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: sorting ? getSortedRowModel() : undefined,
  });

  // ─── DOM-based resize hook ────────────────────────────────────────────────
  // Produces zero React renders during drag; one setColumnSizing call on mouseUp.

  const isRTL = columnResizeDirection === "rtl";

  // Visible column keys in visual order — used by useColumnResize to map the
  // final px widths string back to a ColumnSizingState object.
  const visibleColumnKeys = useMemo(
    () => columnKeys.filter((key) => effectiveVisibility[key] !== false),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [columnKeys, effectiveVisibility],
  );

  const { headerRef, onResizeMouseDown } = useColumnResize({
    containerRef,
    columnSizing,
    containerWidth,
    saveSizing: useCallback(
      (sizing: ColumnSizingState) => {
        saveSizing(sizing);
        onColumnSizingChange?.(sizing);
      },
      [saveSizing, onColumnSizingChange],
    ),
    setColumnSizing,
    columnKeys: visibleColumnKeys,
    isRTL,
  });

  // ─── Context value ────────────────────────────────────────────────────────

  const contextValue = useMemo(
    () => ({
      table,
      containerWidth,
      columnSizing,
      hideColumns,
      isIndexEditingMode,
      headerRef,
      onResizeMouseDown,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [table, containerWidth, columnSizing, hideColumns, isIndexEditingMode, onResizeMouseDown],
  );

  return (
    <TableProvider value={contextValue}>
      <div
        ref={containerRef as React.RefObject<HTMLDivElement>}
        className={classNames(
          styles.tableContainer,
          "table-container",
          className,
        )}
        data-testid="table-container"
        data-container-width={containerWidth}
      >
        {children}
      </div>
    </TableProvider>
  );
}
