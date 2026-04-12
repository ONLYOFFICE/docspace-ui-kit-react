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

import { useCallback, useEffect, useMemo } from "react";
import classNames from "classnames";

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  type ColumnSizingState,
  type VisibilityState,
  type OnChangeFn,
} from "@tanstack/react-table";

import { TableProvider } from "../context/TableContext";
import { useColumnPersistence } from "../hooks/useColumnPersistence";
import { useColumnDistribution } from "../hooks/useColumnDistribution";
import { useColumnResize } from "../hooks/useColumnResize";
import {
  columnDefsFromColumns,
  columnsToVisibility,
  columnsToKeys,
} from "../Table.utils";
import {
  MIN_COLUMN_SIZE,
  MIN_NAME_COLUMN_SIZE,
  SETTINGS_COLUMN_SIZE,
} from "../Table.constants";
import styles from "../Table.module.scss";
import type { ColumnPersistenceConfig } from "../Table.types";
import type { TableContainerStyle, TableContainerProps } from "./TableContainer.types";


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

  const { initialPercents, saveSizing } = useColumnPersistence(
    persistenceConfig,
    columnKeys,
    columns,
  );

  const {
    columnSizing,
    setColumnSizing,
    containerWidth,
    hideColumns,
    containerRef,
  } = useColumnDistribution(columns, initialPercents, saveSizing, forwardedRef);

  // Notify parent when hideColumns changes
  useEffect(() => {
    setHideColumns?.(hideColumns);
  }, [hideColumns, setHideColumns]);

  // ─── Column visibility ────────────────────────────────────────────────────
  // Derived purely from `columns` prop every render — no internal state, no
  // extra re-render. Visibility changes are always driven by the consumer via
  // the `columns` prop (enable flag), so a single synchronous derivation is
  // sufficient and eliminates the flicker caused by setState-triggered renders.

  const effectiveVisibility = useMemo(
    () => columnsToVisibility(columns),
    [columns],
  );

  const handleColumnVisibilityChange: OnChangeFn<VisibilityState> = useCallback(
    (updater) => {
      const next =
        typeof updater === "function" ? updater(effectiveVisibility) : updater;
      onColumnVisibilityChange?.(next);
    },
    [effectiveVisibility, onColumnVisibilityChange],
  );

  // ─── gridTemplateColumns CSS variable ────────────────────────────────────
  // Computed once here from typed `columns` prop — no TanStack meta access needed.
  // Set as --table-gtc on the container; header and rows read it via var(--table-gtc).
  // During drag useColumnResize writes the same property directly, zero React renders.

  const gridTemplateColumns = useMemo(() => {
    const visibleCols = columns.filter(
      (c) => effectiveVisibility[c.key] !== false,
    );
    const parts = visibleCols.map((col) => {
      if (col.defaultSize != null) return `${col.defaultSize}px`;
      if (col.isShort) {
        const sz = columnSizing[col.key] ?? col.minWidth ?? MIN_COLUMN_SIZE;
        return `${sz}px`;
      }
      if (hideColumns && !col.default) return "0px";
      const size =
        columnSizing[col.key] ??
        (col.default ? MIN_NAME_COLUMN_SIZE : MIN_COLUMN_SIZE);
      const minSize =
        col.minWidth ?? (col.default ? MIN_NAME_COLUMN_SIZE : MIN_COLUMN_SIZE);
      return `minmax(${minSize}px, ${size}fr)`;
    });
    parts.push(`${SETTINGS_COLUMN_SIZE}px`);
    return parts.join(" ");
  }, [columns, columnSizing, effectiveVisibility, hideColumns]);

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
    [columnKeys, effectiveVisibility],
  );

  const { onResizeMouseDown } = useColumnResize({
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
      onResizeMouseDown,
    }),
    [
      table,
      containerWidth,
      columnSizing,
      hideColumns,
      isIndexEditingMode,
      onResizeMouseDown,
    ],
  );

  const gtcStyle: TableContainerStyle = { "--table-gtc": gridTemplateColumns };

  return (
    <TableProvider value={contextValue}>
      <div
        ref={containerRef}
        className={classNames(
          styles.tableContainer,
          "table-container",
          className,
        )}
        style={gtcStyle}
        data-testid="table-container"
        data-container-width={containerWidth}
      >
        {children}
      </div>
    </TableProvider>
  );
}
