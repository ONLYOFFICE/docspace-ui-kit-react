"use client";

import type React from "react";
import { memo, useCallback, useMemo, useRef } from "react";
import classNames from "classnames";

import type { ContextMenuRefType } from "../../../context-menu";

import {
  DataTableRowContext,
  type DataTableRowContextValue,
  useDataTableContext,
} from "../../DataTable.context";
import type { DataTableRowProps } from "../../DataTable.types";
import styles from "../../DataTable.module.scss";

const DataTableRowPure = <T,>({
  row,
  index,
  checked,
  active,
  hover = true,
  caret,
  dropTarget,
  dropOver,
  dimmed,
  highlight,
  busy,
  className,
  style,
  cellProps,
  contextMenu,
  onClick,
  onDoubleClick,
  onContextMenu,
  onMouseEnter,
  onMouseLeave,
  testId = "data-table-row",
  ref,
}: DataTableRowProps<T>) => {
  const table = useDataTableContext();
  const menuRef = useRef<ContextMenuRefType | null>(null);
  const anchorRef = useRef<HTMLDivElement | null>(null);

  const openMenu = useCallback(
    (event: React.MouseEvent) => {
      const menu = menuRef.current;
      if (!menu) return;

      contextMenu?.onOpen?.(event.button === 2);
      // A click inside the row first, as the old table did: it closes any
      // other menu, which listens for clicks outside itself.
      if (!menu.menuRef.current) anchorRef.current?.click();
      menu.show(event);
    },
    [contextMenu],
  );

  const rowContext = useMemo<DataTableRowContextValue>(
    () => ({ contextMenu, menuRef, anchorRef, openMenu }),
    [contextMenu, openMenu],
  );

  if (!table) return null;

  const { renderedColumns, lastColumnId, compact, virtualized } = table;

  // The click `openMenu` sends still reaches listeners above the row, but it
  // is not the user clicking the row: it must not select it.
  const onRowClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === anchorRef.current && event.detail === 0) return;
    onClick?.(event);
  };

  const onRowContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    onContextMenu?.(event);
    if (event.defaultPrevented) return;
    openMenu(event);
  };

  return (
    <DataTableRowContext value={rowContext}>
      <div
        ref={ref}
        role="row"
        aria-selected={checked}
        // The header is row 1.
        aria-rowindex={virtualized ? index + 2 : undefined}
        className={classNames(styles.row, "table-container_row", className, {
          checked,
          [styles.isFirstRow]: index === 0,
          [styles.isClickable]: !!onClick,
          [styles.hasHover]: hover,
          [styles.isChecked]: checked,
          [styles.isActive]: active,
          [styles.isCaret]: caret,
          [styles.isDropTarget]: dropTarget,
          [styles.isDropOver]: dropOver,
          [styles.isDimmed]: dimmed,
          [styles.isHighlight]: highlight,
          [styles.isBusy]: busy,
        })}
        style={style}
        onClick={onRowClick}
        onDoubleClick={onDoubleClick}
        onContextMenu={onRowContextMenu}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        data-testid={testId}
      >
        {renderedColumns.map((column) => (
          <div
            key={column.id}
            role="cell"
            className={classNames(
              styles.cell,
              "table-container_cell",
              column.cellClassName,
              cellProps?.className,
            )}
            style={cellProps?.style}
            // `value` is not an attribute React knows on a div; drag and drop
            // reads it, as it did on the old table's cells.
            {...(cellProps?.value === undefined
              ? null
              : ({ value: cellProps.value } as object))}
            data-document-title={cellProps?.documentTitle}
            data-column-id={column.id}
            data-testid={column.cellTestId?.(row, index)}
          >
            {column.cell(row, {
              index,
              isLast: column.id === lastColumnId,
              compact,
            })}
          </div>
        ))}
      </div>
    </DataTableRowContext>
  );
};

/**
 * One row of a DataTable: a cell for every rendered column, laid out by the
 * table's grid. The table renders it for each row; a `renderRow` returns it,
 * wrapped as needed. Memoised on its props, so a row re-renders when its own
 * data or state changes, or when the table's columns do; widths never reach it.
 */
export const DataTableRow = memo(DataTableRowPure) as typeof DataTableRowPure;
