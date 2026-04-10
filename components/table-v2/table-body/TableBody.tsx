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
import { SETTINGS_COLUMN_SIZE } from "../Table.constants";
import styles from "../Table.module.scss";

export interface TableBodyProps {
  /** Total number of rows (may exceed loaded data for infinite scroll) */
  itemCount: number;
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
   * CSS selector for the scroll container element.
   * Defaults to ".section-scroll" (DocSpace section scroll).
   */
  scrollContainerSelector?: string;
  /** Additional CSS class for the body wrapper */
  className?: string;
  /**
   * Optional extra HTML attributes injected into each virtual row container div.
   * Use this to attach onClick, onContextMenu, className, data-*, etc.
   */
  getRowProps?: (index: number) => React.HTMLAttributes<HTMLDivElement>;
  /**
   * Children-as-function — receives the row index and returns the row node.
   * This decouples the body from row data: the consumer renders whatever it
   * needs (including checkboxes, context menus, etc.) using its own data.
   */
  children: (index: number) => React.ReactNode;
}

export function TableBody({
  itemCount,
  hasMore = false,
  isLoading = false,
  fetchMore,
  itemHeight = 48,
  overscan = 20,
  scrollContainerSelector = ".section-scroll",
  className,
  getRowProps,
  children,
}: TableBodyProps) {
  const { table, columnSizing, hideColumns } = useTableCtx();

  const gridTemplateColumns = useMemo(() => {
    const visibleCols = table.getVisibleLeafColumns();

    const parts = visibleCols.map((col, i) => {
      const meta = col.columnDef.meta as Record<string, unknown> | undefined;
      const isDefault = meta?.isDefault as boolean | undefined;
      const isShort = meta?.isShort as boolean | undefined;

      if (
        hideColumns &&
        !isDefault &&
        !isShort &&
        i !== visibleCols.length - 1
      ) {
        return "0px";
      }

      if (i === visibleCols.length - 1) return "1fr";
      return `${col.getSize()}px`;
    });

    parts.push(`${SETTINGS_COLUMN_SIZE}px`);
    return parts.join(" ");
  }, [table, columnSizing, hideColumns]);

  const virtualizer = useVirtualizer({
    count: itemCount,
    estimateSize: () => itemHeight,
    overscan,
    getScrollElement: () =>
      document.querySelector<HTMLElement>(scrollContainerSelector),
  });

  const virtualItems = virtualizer.getVirtualItems();

  // Infinite scroll: trigger fetchMore when the last virtual item approaches
  // the end of the loaded data
  useEffect(() => {
    if (!fetchMore || !hasMore || isLoading) return;

    const lastItem = virtualItems[virtualItems.length - 1];
    if (!lastItem) return;

    if (lastItem.index >= itemCount - 1) {
      fetchMore();
    }
  }, [virtualItems, itemCount, hasMore, isLoading, fetchMore]);

  return (
    <div
      className={classNames(styles.tableBody, "table-container_body", className)}
      data-testid="table-body"
      style={{ height: `${virtualizer.getTotalSize()}px` }}
    >
      {virtualItems.map((virtualItem) => {
        const rowProps = getRowProps?.(virtualItem.index) ?? {};
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
              gridTemplateColumns,
              transform: `translateY(${virtualItem.start}px)`,
              height: `${virtualItem.size}px`,
            }}
            data-index={virtualItem.index}
            data-testid="table-virtual-row"
            {...restRowProps}
          >
            {children(virtualItem.index)}
          </div>
        );
      })}
    </div>
  );
}
