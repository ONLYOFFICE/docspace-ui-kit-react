"use client";

import React, { useCallback, useEffect, useMemo, useRef } from "react";
import classNames from "classnames";

import {
  DataTableContext,
  type DataTableContextValue,
} from "./DataTable.context";
import type { DataTableProps } from "./DataTable.types";
import { useColumnLayout } from "./hooks/useColumnLayout";
import { useColumnResize } from "./hooks/useColumnResize";
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
import { RowSlot } from "./sub-components/row/RowSlot";
import styles from "./DataTable.module.scss";

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
  ariaLabel,
  id,
  className,
  headerId,
  headerClassName,
  testId = "data-table",
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

  const layout = useColumnLayout(layoutColumns, widthStorage);
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

  const context = useMemo<DataTableContextValue>(
    () => ({
      columns: columns as DataTableContextValue["columns"],
      renderedColumns:
        renderedColumns as DataTableContextValue["renderedColumns"],
      lastColumnId,
      compact,
      onColumnVisibilityChange,
    }),
    [columns, renderedColumns, lastColumnId, compact, onColumnVisibilityChange],
  );

  return (
    <DataTableContext value={context}>
      <div
        ref={setRef}
        id={id}
        role="table"
        aria-label={ariaLabel}
        className={classNames(styles.dataTable, "table-container", className, {
          [styles.isResizing]: resizingId !== null,
        })}
        style={{ "--data-table-grid": gridTemplate } as React.CSSProperties}
        data-testid={testId}
      >
        <DataTableHeader
          columns={renderedColumns}
          sort={sort}
          onSortChange={onSortChange}
          compact={compact}
          resize={resize}
          id={headerId}
          className={headerClassName}
        />
        <div
          role="rowgroup"
          className={classNames(styles.body, "table-container_body")}
          data-testid="data-table-body"
        >
          {rows.map((row, index) => (
            <RowSlot
              key={getRowKey(row, index)}
              row={row}
              index={index}
              getRowProps={getRowProps}
              renderRow={renderRow}
            />
          ))}
        </div>
      </div>
    </DataTableContext>
  );
};
