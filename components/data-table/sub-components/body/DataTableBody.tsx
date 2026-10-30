"use client";

import type React from "react";
import { useCallback, useImperativeHandle, useRef } from "react";
import classNames from "classnames";

import { DATA_TABLE_OVERSCAN } from "../../DataTable.constants";
import type {
  DataTableApi,
  DataTableRenderRowProps,
  DataTableRowState,
  DataTableVirtualize,
} from "../../DataTable.types";
import { useRowVirtualizer } from "../../hooks/useRowVirtualizer";
import styles from "../../DataTable.module.scss";

import { RowSlot } from "../row/RowSlot";

type DataTableBodyProps<T> = {
  rows: T[];
  getRowKey: (row: T, index: number) => React.Key;
  getRowProps?: (row: T, index: number) => DataTableRowState;
  renderRow?: (props: DataTableRenderRowProps<T>) => React.ReactNode;
  /** The table's `virtualize`, already told apart from `false`. */
  virtualize: DataTableVirtualize | null;
  rowHeight: number;
  apiRef?: React.Ref<DataTableApi>;
};

type Align = "start" | "center" | "end" | "auto";

export const DataTableBody = <T,>({
  rows,
  getRowKey,
  getRowProps,
  renderRow,
  virtualize,
  rowHeight,
  apiRef,
}: DataTableBodyProps<T>) => {
  const bodyRef = useRef<HTMLDivElement | null>(null);

  const getItemKey = useCallback(
    (index: number) => getRowKey(rows[index], index),
    [getRowKey, rows],
  );

  const virtual = useRowVirtualizer({
    enabled: virtualize !== null,
    count: rows.length,
    rowHeight,
    overscan: virtualize?.overscan ?? DATA_TABLE_OVERSCAN,
    scrollElement: virtualize?.scrollElement,
    bodyRef,
    getItemKey,
  });

  useImperativeHandle(
    apiRef,
    () => ({
      scrollToIndex: (index: number, options?: { align?: Align }) => {
        const align = options?.align ?? "auto";
        if (virtualize) {
          virtual.scrollToIndex(index, align);
          return;
        }
        bodyRef.current?.children[index]?.scrollIntoView({
          block: align === "auto" ? "nearest" : align,
        });
      },
    }),
    [virtualize, virtual.scrollToIndex],
  );

  const renderSlot = (row: T, index: number, key?: React.Key) => (
    <RowSlot
      key={key}
      row={row}
      index={index}
      getRowProps={getRowProps}
      renderRow={renderRow}
    />
  );

  return (
    <div
      ref={bodyRef}
      role="rowgroup"
      className={classNames(styles.body, "table-container_body")}
      data-testid="data-table-body"
    >
      {virtualize ? (
        // The client's selection area, hotkeys and the data room's index
        // separator read this markup: rows inside `.window-item` wrappers,
        // placed with `top` rather than a transform, in a container as tall
        // as the whole list.
        <div
          className={classNames(styles.virtualList, virtualize.innerClassName)}
          style={{ height: virtual.totalSize }}
        >
          {virtual.rows.map(({ index, key, top }) => (
            <div
              key={key}
              className={classNames(
                styles.virtualRow,
                "table-list-item",
                "window-item",
              )}
              style={{ top, height: rowHeight }}
              data-index={index}
            >
              {renderSlot(rows[index], index)}
            </div>
          ))}
        </div>
      ) : (
        // Rows are direct children of the body here, so scrollToIndex finds
        // one by its position.
        rows.map((row, index) => renderSlot(row, index, getRowKey(row, index)))
      )}
    </div>
  );
};
