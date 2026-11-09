"use client";

import React, { useCallback, useEffect, useMemo, useRef } from "react";
import classNames from "classnames";

import {
  DataTableContext,
  type DataTableContextValue,
} from "./DataTable.context";
import type { DataTableProps, DataTableVirtualize } from "./DataTable.types";
import { useColumnLayout } from "./hooks/useColumnLayout";
import { useColumnResize } from "./hooks/useColumnResize";
import { useStuckHeader } from "./hooks/useStuckHeader";
import {
  type LayoutColumn,
  hasResizeHandle,
  isFlexible,
} from "./layout/engine";
import { getRenderedColumns } from "./layout/grid";
import {
  DataTableHeader,
  type HeaderResize,
} from "./sub-components/header/DataTableHeader";
import { DataTableBody } from "./sub-components/body/DataTableBody";
import { DATA_TABLE_ROW_HEIGHT } from "./DataTable.constants";
import styles from "./DataTable.module.scss";

const NO_OPTIONS: DataTableVirtualize = {};

const assignRef = <V,>(ref: React.Ref<V> | undefined, value: V | null) => {
  if (typeof ref === "function") ref(value);
  else if (ref) (ref as React.RefObject<V | null>).current = value;
};

export const DataTable = <T,>({
  columns,
  rows,
  getRowKey,
  getRowProps,
  renderRow,
  sort,
  onSortChange,
  onColumnVisibilityChange,
  onCompactChange,
  widthStorage,
  virtualize = false,
  loadMore,
  rowHeight = DATA_TABLE_ROW_HEIGHT,
  apiRef,
  ariaLabel,
  id,
  className,
  headerId,
  headerClassName,
  testId = "data-table",
  headerTestId = "data-table-header",
  bodyTestId = "data-table-body",
  ref,
}: DataTableProps<T>) => {
  const visibleColumns = useMemo(
    () => columns.filter((column) => column.visible !== false),
    [columns],
  );

  const layoutColumns = useMemo<LayoutColumn[]>(
    () =>
      visibleColumns.map(({ id: columnId, width, resizable }) => ({
        id: columnId,
        width,
        resizable,
      })),
    [visibleColumns],
  );

  // Hidden columns count too: a column shown takes the flexible area divided
  // by all of them, as the old table gave it.
  const flexibleTotal = columns.filter(
    (column) => column.width.type !== "fixed",
  ).length;

  const layout = useColumnLayout(layoutColumns, widthStorage, flexibleTotal);
  const { containerRef, gridTemplate, compact } = layout;

  const { bind, resizingId } = useColumnResize(layout);

  const resize = useMemo<HeaderResize | undefined>(
    () =>
      compact
        ? undefined
        : {
            canResize: (columnId) => hasResizeHandle(layout.columns, columnId),
            valueOf: (columnId) =>
              Math.round((layout.fractions[columnId] ?? 0) * 100),
            bind,
            resizingId,
          },
    [compact, layout.columns, layout.fractions, bind, resizingId],
  );

  // Header and rows map over this one array, so they always render the same
  // cells in the same order as the grid has tracks.
  const renderedColumns = useMemo(
    () => getRenderedColumns(visibleColumns, compact),
    [visibleColumns, compact],
  );

  const lastColumnId = useMemo(
    () => renderedColumns.filter(isFlexible).at(-1)?.id,
    [renderedColumns],
  );

  const setRef = useCallback(
    (element: HTMLDivElement | null) => {
      containerRef.current = element;
      assignRef(ref, element);
    },
    [containerRef, ref],
  );

  // Reported on a change only; a table that mounts compact reports `true`.
  const reportedCompactRef = useRef(false);
  useEffect(() => {
    if (reportedCompactRef.current === compact) return;
    reportedCompactRef.current = compact;
    onCompactChange?.(compact);
  }, [compact, onCompactChange]);

  // Sorting by a column the user hid turns it back on, as the old table did,
  // so the sorted values are on screen. Only when the sort moves there.
  const sortKey = sort?.key;
  const lastSortKeyRef = useRef(sortKey);
  useEffect(() => {
    if (lastSortKeyRef.current === sortKey) return;
    lastSortKeyRef.current = sortKey;

    const sorted = columns.find(
      (column) => sortKey !== undefined && column.sortKey === sortKey,
    );
    if (sorted && sorted.visible === false && sorted.hideable) {
      onColumnVisibilityChange?.(sorted.id, true);
    }
  }, [sortKey, columns, onColumnVisibilityChange]);

  const virtualOptions =
    virtualize === false ? null : virtualize === true ? NO_OPTIONS : virtualize;
  const virtualized = virtualOptions !== null;

  const headerRef = useRef<HTMLDivElement | null>(null);
  const headerStuck = useStuckHeader(headerRef, virtualOptions?.scrollElement);

  const context = useMemo<DataTableContextValue>(
    () => ({
      columns: columns as DataTableContextValue["columns"],
      renderedColumns:
        renderedColumns as DataTableContextValue["renderedColumns"],
      lastColumnId,
      compact,
      virtualized,
      onColumnVisibilityChange,
    }),
    [
      columns,
      renderedColumns,
      lastColumnId,
      compact,
      virtualized,
      onColumnVisibilityChange,
    ],
  );

  return (
    <DataTableContext value={context}>
      <div
        ref={setRef}
        id={id}
        role="table"
        aria-label={ariaLabel}
        // With only some rows in the DOM, the count says how many there are;
        // the header row is one of them.
        aria-rowcount={virtualized ? rows.length + 1 : undefined}
        className={classNames(styles.dataTable, "table-container", className, {
          [styles.isResizing]: resizingId !== null,
        })}
        style={
          {
            "--data-table-grid": gridTemplate,
            "--data-table-row-height": `${rowHeight}px`,
          } as React.CSSProperties
        }
        data-testid={testId}
      >
        <DataTableHeader
          columns={renderedColumns}
          sort={sort}
          onSortChange={onSortChange}
          compact={compact}
          resize={resize}
          stuck={headerStuck}
          id={headerId}
          className={headerClassName}
          testId={headerTestId}
          ref={headerRef}
        />
        <DataTableBody
          rows={rows}
          getRowKey={getRowKey}
          getRowProps={getRowProps}
          renderRow={renderRow}
          virtualize={virtualOptions}
          loadMore={loadMore}
          rowHeight={rowHeight}
          apiRef={apiRef}
          testId={bodyTestId}
        />
      </div>
    </DataTableContext>
  );
};
