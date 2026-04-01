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

import React, { useRef, useMemo, useCallback, useEffect } from "react";
import classNames from "classnames";

import { useWindowVirtualizer } from "@tanstack/react-virtual";

import { useTanStackTable } from "./TanStackTableContext";
import { TABLE_DEFAULTS } from "./TanStackTable.types";
import styles from "./TanStackTable.module.scss";

export interface TanStackTableBodyProps {
  /** Row height in pixels (default: 48) */
  itemHeight?: number;
  /** Number of rows to render outside visible area (default: 20) */
  overscan?: number;
  /** Whether there are more items to load */
  hasMore?: boolean;
  /** Whether items are currently being loaded */
  isLoading?: boolean;
  /** Callback to fetch more items */
  fetchMore?: () => void;
  /** Distance from bottom to trigger loading (default: 300px) */
  loadThreshold?: number;
  /** Render function for each row. Must return direct cell elements (no wrapper div)
   *  — they become CSS grid children of the virtual row container. */
  renderRow: (rowIndex: number) => React.ReactNode;
  /** Optional: return extra props (className, onClick, data-testid, etc.)
   *  to apply to each virtual row container div. */
  getRowContainerProps?: (rowIndex: number) => Record<string, unknown>;
  /** Total item count (may be larger than data.length for pagination) */
  totalCount?: number;
  /** Additional class name */
  className?: string;
}

export function TanStackTableBody({
  itemHeight = 48,
  overscan = 20,
  hasMore = false,
  isLoading = false,
  fetchMore,
  loadThreshold = 300,
  renderRow,
  getRowContainerProps,
  totalCount,
  className,
}: TanStackTableBodyProps) {
  const { table } = useTanStackTable();
  const rows = table.getRowModel().rows;
  const count = totalCount ?? rows.length;

  const virtualizer = useWindowVirtualizer({
    count,
    estimateSize: () => itemHeight,
    overscan,
  });

  // Infinite scroll: trigger fetchMore near bottom
  const isLoadingRef = useRef(isLoading);
  isLoadingRef.current = isLoading;

  useEffect(() => {
    if (!hasMore || !fetchMore) return;

    const items = virtualizer.getVirtualItems();
    if (items.length === 0) return;

    const lastItem = items[items.length - 1];
    if (!lastItem) return;

    if (lastItem.index >= count - 1 && !isLoadingRef.current) {
      fetchMore();
    }
  }, [
    hasMore,
    fetchMore,
    count,
    virtualizer.getVirtualItems().length,
  ]);

  // gridTemplateColumns from table state (not from localStorage)
  const gridTemplateColumns = useMemo(() => {
    const visibleColumns = table.getVisibleLeafColumns();
    const parts = visibleColumns.map((col) => `${col.getSize()}px`);
    // Context menu / settings column
    parts.push(`${TABLE_DEFAULTS.SETTINGS_COLUMN_SIZE}px`);
    return parts.join(" ");
  }, [table, table.getState().columnSizing, table.getState().columnVisibility]);

  const virtualItems = virtualizer.getVirtualItems();
  const totalSize = virtualizer.getTotalSize();

  const bodyClasses = classNames(
    styles.tanstackTableBody,
    "table-container_body",
    className,
  );

  return (
    <div className={bodyClasses} data-testid="table-body">
      <div style={{ height: totalSize, position: "relative" }}>
        {virtualItems.map((virtualRow) => {
          const rowStyle: React.CSSProperties = {
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: virtualRow.size,
            transform: `translateY(${virtualRow.start}px)`,
            display: "grid",
            gridTemplateColumns,
          };

          const extraProps = getRowContainerProps?.(virtualRow.index) ?? {};

          return (
            <div
              key={virtualRow.key}
              data-index={virtualRow.index}
              style={rowStyle}
              {...extraProps}
              className={`${styles.rowContainer} table-list-item window-item ${
                (extraProps.className as string) ?? ""
              }`}
            >
              {renderRow(virtualRow.index)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
