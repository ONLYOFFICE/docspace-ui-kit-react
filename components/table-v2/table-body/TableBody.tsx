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

import React, { useEffect, useMemo } from "react";
import classNames from "classnames";
import { useVirtualizer } from "@tanstack/react-virtual";

import { useTableCtx } from "../context/TableContext";
import type { TTableColumnDef } from "../Table.types";
import styles from "../Table.module.scss";

export interface TableBodyProps<TData> {
  /** Row data array. When omitted, itemCount must be provided for infinite scroll. */
  data: TData[];
  /** Column definitions with typed render functions. */
  columns: TTableColumnDef<TData>[];
  /**
   * Total number of rows for the virtualizer.
   * Defaults to data.length. Override for infinite scroll with a server total.
   */
  itemCount?: number;
  /** Whether there are more rows to load */
  hasMore?: boolean;
  /** Whether a load is currently in progress */
  isLoading?: boolean;
  /** Called when the user scrolls near the end of loaded rows */
  fetchMore?: () => void;
  /** Row height in pixels (default: 48) */
  itemHeight?: number;
  /** Virtualizer overscan count (default: 20) */
  overscan?: number;
  /**
   * Ref to the scroll container element.
   * Takes priority over scrollContainerSelector when provided.
   */
  scrollElementRef?: React.RefObject<HTMLElement | null>;
  /**
   * CSS selector for the scroll container element.
   * Used as fallback when scrollElementRef is not provided.
   * Defaults to ".section-scroll" (DocSpace section scroll).
   */
  scrollContainerSelector?: string;
  /** Additional CSS class for the body wrapper */
  className?: string;
  /**
   * antd-style row event handler — mirrors Table onRow.
   * Returns HTML attributes applied to the virtual row div.
   */
  onRow?: (
    record: TData,
    index: number,
  ) => React.HTMLAttributes<HTMLDivElement> & Record<string, unknown>;
  /**
   * Renders content inside the last (settings/actions) column for each row.
   * Typically a ContextMenuButton.
   */
  rowActions?: (record: TData, index: number) => React.ReactNode;
}

export function TableBody<TData>({
  data,
  columns,
  itemCount,
  hasMore = false,
  isLoading = false,
  fetchMore,
  itemHeight = 48,
  overscan = 20,
  scrollElementRef,
  scrollContainerSelector = ".section-scroll",
  className,
  onRow,
  rowActions,
}: TableBodyProps<TData>) {
  const { table, columnSizing } = useTableCtx();

  const resolvedItemCount = itemCount ?? data.length;

  // Visible columns matched to TTableColumnDef entries by key.
  // grid-template-columns is applied via --table-gtc CSS variable set on the
  // container; rows inherit it automatically — no inline style needed here.
  const visibleColumns = useMemo(() => {
    const visibleIds = new Set(table.getVisibleLeafColumns().map((c) => c.id));
    return columns.filter((c) => visibleIds.has(c.key));
  }, [table, columns, columnSizing]);

  const virtualizer = useVirtualizer({
    count: resolvedItemCount,
    estimateSize: () => itemHeight,
    overscan,
    getScrollElement: () =>
      scrollElementRef?.current ??
      document.querySelector<HTMLElement>(scrollContainerSelector),
  });

  const virtualItems = virtualizer.getVirtualItems();

  useEffect(() => {
    if (!fetchMore || !hasMore || isLoading) return;

    const lastItem = virtualItems[virtualItems.length - 1];
    if (!lastItem) return;

    if (lastItem.index >= resolvedItemCount - 1) {
      fetchMore();
    }
  }, [virtualItems, resolvedItemCount, hasMore, isLoading, fetchMore]);

  return (
    <div
      className={classNames(
        styles.tableBody,
        "table-container_body",
        className,
      )}
      data-testid="table-body"
      style={{ height: `${virtualizer.getTotalSize()}px` }}
    >
      {virtualItems.map((virtualItem) => {
        const index = virtualItem.index;
        const record = data[index];

        const rowProps = onRow?.(record, index) ?? {};
        const { className: rowClassName, ...restRowProps } = rowProps;

        return (
          <div
            key={virtualItem.key}
            className={classNames(
              styles.virtualRow,
              "table-container_row",
              rowClassName,
            )}
            style={{
              transform: `translateY(${virtualItem.start}px)`,
              height: `${virtualItem.size}px`,
            }}
            data-index={index}
            data-testid="table-virtual-row"
            {...restRowProps}
          >
            {visibleColumns.map((col) => {
              const value = col.dataIndex ? record[col.dataIndex] : record;

              const extraClass =
                typeof col.cellClassName === "function"
                  ? col.cellClassName(record, index)
                  : col.cellClassName;

              return (
                <div
                  key={col.key}
                  className={classNames("table-container_cell", extraClass)}
                >
                  {col.render
                    ? col.render(value, record, index)
                    : String(value ?? "")}
                </div>
              );
            })}

            {/* Settings / actions column — always rendered last */}
            <div className="table-container_row-context-menu-wrapper">
              {rowActions?.(record, index)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

