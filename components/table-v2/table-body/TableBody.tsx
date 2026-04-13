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

import { useEffect, useMemo } from "react";
import classNames from "classnames";
import { match, P } from "ts-pattern";
import { useVirtualizer } from "@tanstack/react-virtual";

import { useTableCtx } from "../context/TableContext";
import { TableSkeleton } from "../sub-components/table-skeleton";
import styles from "../Table.module.scss";
import type { TableBodyProps } from "./TableBody.types";

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
  const { table } = useTableCtx();

  const resolvedItemCount = itemCount ?? data.length;

  // Visible columns matched to TTableColumnDef entries by key.
  // grid-template-columns is applied via --table-gtc CSS variable set on the
  // container; rows inherit it automatically — no inline style needed here.
  const visibleColumns = useMemo(() => {
    const visibleIds = new Set(table.getVisibleLeafColumns().map((c) => c.id));
    return columns.filter((c) => visibleIds.has(c.key));
  }, [table, columns]);

  const virtualizer = useVirtualizer({
    useFlushSync: false,
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

    // Trigger fetch when scrolling near the end of loaded data,
    // not the end of total — data may not be fully loaded yet.
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

        // Data not yet loaded for this index — render empty placeholder row
        if (!record) {
          return (
            <div
              key={virtualItem.key}
              className={classNames(styles.virtualRow, "table-container_row")}
              style={{
                transform: `translateY(${virtualItem.start}px)`,
                height: `${virtualItem.size}px`,
              }}
              data-index={index}
            />
          );
        }

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
              const extraClass =
                typeof col.cellClassName === "function"
                  ? col.cellClassName(record, index)
                  : col.cellClassName;

              return (
                <div
                  key={col.key}
                  className={classNames("table-container_cell", extraClass)}
                >
                  {match(col)
                    .with({ render: P.not(P.nullish) }, (c) =>
                      c.render(record, index),
                    )
                    .when(
                      (c) => !!c.dataIndex,
                      (c) => String(record[c.dataIndex!] ?? ""),
                    )
                    .otherwise(() => "")}
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

      {/* Skeleton loader — shown at the bottom while fetching more rows */}
      {isLoading && (
        <TableSkeleton
          rowHeight={itemHeight}
          columnCount={visibleColumns.length}
          offsetTop={virtualizer.getTotalSize()}
        />
      )}
    </div>
  );
}

