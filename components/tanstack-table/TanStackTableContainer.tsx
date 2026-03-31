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

import React, { useMemo, useState, useCallback, useEffect, useLayoutEffect, useRef } from "react";
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

  // Track column sizing info (resize-in-progress state) properly
  const [columnSizingInfo, setColumnSizingInfo] = useState(
    {} as import("@tanstack/react-table").ColumnSizingInfoState,
  );
  const wasResizingRef = useRef(false);

  // Detect resize end: when isResizingColumn transitions from truthy to falsy
  useEffect(() => {
    const isResizing = !!columnSizingInfo.isResizingColumn;
    if (wasResizingRef.current && !isResizing) {
      // Resize just ended — persist
      saveSizing(columnSizing);
      onColumnSizingChange?.(columnSizing);
    }
    wasResizingRef.current = isResizing;
  }, [columnSizingInfo.isResizingColumn, columnSizing, saveSizing, onColumnSizingChange]);

  const table = useReactTable({
    data,
    columns,
    defaultColumn: {
      minSize: TABLE_DEFAULTS.MIN_COLUMN_SIZE,
      size: TABLE_DEFAULTS.MIN_COLUMN_SIZE,
    },
    state: {
      columnSizing,
      columnSizingInfo,
      columnVisibility,
      sorting,
    },
    columnResizeMode,
    columnResizeDirection,
    onColumnSizingChange: handleColumnSizingChange,
    onColumnSizingInfoChange: setColumnSizingInfo,
    onColumnVisibilityChange: handleColumnVisibilityChange,
    onSortingChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: sorting ? getSortedRowModel() : undefined,
    enableColumnResizing: true,
  });

  // Measure container width and distribute column sizes proportionally
  // when there's no persisted sizing (first render or after reset)
  const internalRef = useRef<HTMLDivElement>(null);
  const containerRefResolved = (forwardedRef as React.RefObject<HTMLDivElement>) ?? internalRef;
  const [containerWidth, setContainerWidth] = useState(0);

  // Measure container and compute initial column widths
  /** Distribute column widths proportionally to fill the given width */
  const distributeColumns = useCallback(
    (width: number) => {
      const visibleCols = table.getVisibleLeafColumns();
      if (visibleCols.length === 0 || width === 0) return;

      const available = width - TABLE_DEFAULTS.SETTINGS_COLUMN_SIZE;
      const defaultCol = visibleCols.find(
        (c) => (c.columnDef.meta as Record<string, unknown>)?.isDefault,
      );
      const otherCols = visibleCols.filter(
        (c) => (c.columnDef.meta as Record<string, unknown>)?.isDefault !== true,
      );

      const nameWidth = Math.max(
        Math.floor((available * TABLE_DEFAULTS.NAME_COLUMN_PERCENT) / 100),
        TABLE_DEFAULTS.MIN_NAME_COLUMN_SIZE,
      );
      const remainingWidth = available - nameWidth;
      const perOther =
        otherCols.length > 0
          ? Math.max(
              Math.floor(remainingWidth / otherCols.length),
              TABLE_DEFAULTS.MIN_COLUMN_SIZE,
            )
          : 0;

      const newSizing: ColumnSizingState = {};
      if (defaultCol) newSizing[defaultCol.id] = nameWidth;
      for (const col of otherCols) newSizing[col.id] = perOther;

      setColumnSizing(newSizing);
      saveSizing(newSizing);
    },
    [table, saveSizing],
  );

  // Measure container and compute initial + responsive column widths
  const lastWidthRef = useRef(0);

  useLayoutEffect(() => {
    const el = (containerRefResolved as React.RefObject<HTMLDivElement>).current;
    if (!el) return;

    const handleResize = () => {
      const width = el.clientWidth;
      if (width === 0 || width === lastWidthRef.current) return;
      lastWidthRef.current = width;
      setContainerWidth(width);

      // On first mount: use persisted sizing if available
      const hasPersistedSizing = Object.keys(initialSizing).length > 0;
      if (hasPersistedSizing && containerWidth === 0) {
        // First render with persisted data — proportionally scale to fit
        const totalStored = Object.values(initialSizing).reduce(
          (a, b) => a + b,
          0,
        );
        if (totalStored > 0) {
          const available = width - TABLE_DEFAULTS.SETTINGS_COLUMN_SIZE;
          const scale = available / totalStored;
          const scaled: ColumnSizingState = {};
          for (const [key, val] of Object.entries(initialSizing)) {
            scaled[key] = Math.floor(val * scale);
          }
          setColumnSizing(scaled);
          return;
        }
      }

      // Fresh calculation or resize
      distributeColumns(width);
    };

    handleResize();

    const ro = new ResizeObserver(handleResize);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const containerClasses = classNames(
    styles.tanstackTableContainer,
    "table-container",
    className,
  );

  const contextValue = useMemo(
    () => ({ table, containerWidth }),
    [table, containerWidth],
  );

  return (
    <TanStackTableProvider value={contextValue}>
      <div
        id="table-container"
        ref={containerRefResolved as React.RefObject<HTMLDivElement>}
        className={containerClasses}
        data-testid="table-container"
        data-container-width={containerWidth}
      >
        {children}
      </div>
    </TanStackTableProvider>
  );
}
