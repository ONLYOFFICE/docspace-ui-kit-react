"use client";

import React, { useCallback, useMemo } from "react";
import classNames from "classnames";

import type { DataTableProps } from "./DataTable.types";
import { useColumnLayout } from "./hooks/useColumnLayout";
import { type LayoutColumn, isFlexible } from "./layout/engine";
import { getRenderedColumns } from "./layout/grid";
import { DataTableHeader } from "./sub-components/header/DataTableHeader";
import { DataTableRow } from "./sub-components/row/DataTableRow";
import styles from "./DataTable.module.scss";

const assignRef = <V,>(ref: React.Ref<V> | undefined, value: V | null) => {
  if (typeof ref === "function") ref(value);
  else if (ref) (ref as React.RefObject<V | null>).current = value;
};

export const DataTable = <T,>({
  columns,
  rows,
  getRowKey,
  sort,
  onSortChange,
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

  const { containerRef, gridTemplate, compact } = useColumnLayout(
    layoutColumns,
    widthStorage,
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

  return (
    <div
      ref={setRef}
      id={id}
      role="table"
      aria-label={ariaLabel}
      className={classNames(styles.dataTable, "table-container", className)}
      style={{ "--data-table-grid": gridTemplate } as React.CSSProperties}
      data-testid={testId}
    >
      <DataTableHeader
        columns={renderedColumns}
        sort={sort}
        onSortChange={onSortChange}
        compact={compact}
        id={headerId}
        className={headerClassName}
      />
      <div
        role="rowgroup"
        className={classNames(styles.body, "table-container_body")}
        data-testid="data-table-body"
      >
        {rows.map((row, index) => (
          <DataTableRow
            key={getRowKey(row, index)}
            row={row}
            index={index}
            columns={renderedColumns}
            lastColumnId={lastColumnId}
            compact={compact}
          />
        ))}
      </div>
    </div>
  );
};
