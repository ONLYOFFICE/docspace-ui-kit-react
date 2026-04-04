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

import React, { useMemo } from "react";
import classNames from "classnames";

import { flexRender, type Header, type Table } from "@tanstack/react-table";

import { useTanStackTable } from "./TanStackTableContext";
import { TABLE_DEFAULTS } from "./TanStackTable.types";
import styles from "./TanStackTable.module.scss";

export interface TanStackTableHeaderProps {
  /** Whether to show the column settings gear button */
  showSettings?: boolean;
  /** Title attribute for the settings button */
  settingsTitle?: string;
  /** Render prop for the settings dropdown content */
  renderSettings?: (table: Table<unknown>) => React.ReactNode;
  /** External sort key (e.g. "title", "membersCount") — used when sorting
   *  is managed outside TanStack Table (e.g. via URL filter params). */
  activeSortBy?: string;
  /** External sort direction — "ascending" or "descending" */
  activeSortOrder?: "ascending" | "descending";
  /** Additional class name */
  className?: string;
}

export function TanStackTableHeader({
  showSettings = true,
  settingsTitle,
  renderSettings,
  activeSortBy,
  activeSortOrder,
  className,
}: TanStackTableHeaderProps) {
  const { table } = useTanStackTable();

  const gridTemplateColumns = useMemo(() => {
    const visibleColumns = table.getVisibleLeafColumns();
    const { isResizingColumn, columnSizingStart = [], deltaOffset = 0 } =
      table.getState().columnSizingInfo;

    const resizingIdx = isResizingColumn
      ? visibleColumns.findIndex((c) => c.id === isResizingColumn)
      : -1;
    const resizingStartSize = isResizingColumn
      ? (columnSizingStart.find(([id]) => id === isResizingColumn)?.[1] ?? 0)
      : 0;
    const adjacentIdx =
      resizingIdx >= 0 && resizingIdx < visibleColumns.length - 1
        ? resizingIdx + 1
        : -1;

    const parts = visibleColumns.map((col, i) => {
      const isLastDataCol = i === visibleColumns.length - 1;

      if (i === resizingIdx && isResizingColumn && deltaOffset) {
        const minSize = col.columnDef.minSize ?? TABLE_DEFAULTS.MIN_COLUMN_SIZE;
        return `${Math.max(resizingStartSize + deltaOffset, minSize)}px`;
      }
      // Last visible column always fills remaining space; 1fr naturally
      // compensates when an adjacent column is resized — no px override needed.
      if (isLastDataCol) return "1fr";
      if (i === adjacentIdx && isResizingColumn && deltaOffset) {
        const currentSize = col.getSize();
        const minSize = col.columnDef.minSize ?? TABLE_DEFAULTS.MIN_COLUMN_SIZE;
        const resizingMinSize =
          visibleColumns[resizingIdx].columnDef.minSize ??
          TABLE_DEFAULTS.MIN_COLUMN_SIZE;
        const actualResizingSize = Math.max(
          resizingStartSize + deltaOffset,
          resizingMinSize,
        );
        const actualDelta = actualResizingSize - resizingStartSize;
        return `${Math.max(currentSize - actualDelta, minSize)}px`;
      }
      return `${col.getSize()}px`;
    });

    // Settings column: 32px icon area, content right-aligned
    parts.push(`${TABLE_DEFAULTS.SETTINGS_COLUMN_SIZE}px`);
    return parts.join(" ");
  }, [
    table,
    // Re-derive when sizing or visibility changes
    table.getState().columnSizing,
    table.getState().columnVisibility,
    table.getState().columnSizingInfo,
  ]);

  const headerClasses = classNames(
    styles.tanstackTableHeader,
    "table-container_header",
    className,
  );

  return (
    <div
      id="table-container_caption-header"
      className={headerClasses}
      style={{ gridTemplateColumns }}
      data-testid="table-header"
    >
      {table.getHeaderGroups().map((headerGroup) => {
        const visibleHeaders = headerGroup.headers.filter((h) =>
          h.column.getIsVisible(),
        );
        return visibleHeaders.map((header, idx) => (
          <HeaderCell
            key={header.id}
            header={header}
            activeSortBy={activeSortBy}
            activeSortOrder={activeSortOrder}
            isLastColumn={idx === visibleHeaders.length - 1}
          />
        ));
      })}

      {showSettings ? (
        <div
          className={styles.settingsBlock}
          title={settingsTitle}
          data-testid="settings-block"
        >
          {renderSettings?.(table)}
        </div>
      ) : null}
    </div>
  );
}

interface HeaderCellProps {
  header: Header<unknown, unknown>;
  activeSortBy?: string;
  activeSortOrder?: "ascending" | "descending";
  isLastColumn?: boolean;
}

function HeaderCell({ header, activeSortBy, activeSortOrder, isLastColumn }: HeaderCellProps) {
  const meta = header.column.columnDef.meta as
    | Record<string, unknown>
    | undefined;
  const sortBy = meta?.sortBy as string | undefined;
  const isDefault = (meta?.isDefault as boolean) ?? false;
  const onClick = meta?.onClick as
    | ((sortBy: string, e: React.MouseEvent) => void)
    | undefined;

  // Support both TanStack-managed sorting and external (URL-based) sorting
  const tanstackSorted = header.column.getIsSorted();
  const isExternalSorted = sortBy ? activeSortBy === sortBy : false;
  const isSorted = tanstackSorted || isExternalSorted;
  const sortDirection = tanstackSorted
    ? tanstackSorted
    : activeSortOrder === "descending" ? "desc" : "asc";
  const canResize = header.column.getCanResize();

  const handleSortClick = (e: React.MouseEvent) => {
    if (sortBy && onClick) {
      onClick(sortBy, e);
    }
  };

  const cellClasses = classNames(styles.headerCell, "table-container_header-cell", {
    [styles.isActive]: isSorted,
    [styles.isDefault]: isDefault,
    [styles.sortable]: !!sortBy,
    [styles.sorted]: sortDirection === "desc",
  });

  return (
    <div
      className={cellClasses}
      id={`column_${header.index}`}
      data-enable={header.column.getIsVisible()}
      data-default={isDefault}
      data-min-width={header.column.columnDef.minSize}
      data-testid={`column-${header.id}`}
    >
      <div className={styles.headerItem}>
        <div
          className={styles.textWrapper}
          onClick={handleSortClick}
        >
          <span className={classNames(styles.text, "header-container-text")}>
            {header.isPlaceholder
              ? null
              : flexRender(
                  header.column.columnDef.header,
                  header.getContext(),
                )}
          </span>
        </div>
        {/* Sort icon: same SVG as legacy TableHeaderCell (arrow-down, flipped via CSS for asc) */}
        <span className={styles.sortIcon} data-testid="sort-icon">
          <svg width="12" height="12" viewBox="0 0 12 12">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M6.14453 10.8536C6.33979 11.0488 6.65638 11.0488 6.85164 10.8536L10.3516 7.35355L9.64453 6.64645L6.99808 9.29289V2H5.99808V9.29289L3.35164 6.64645L2.64453 7.35355L6.14453 10.8536Z"
              fill="currentColor"
            />
          </svg>
        </span>
      </div>

      {canResize && !isLastColumn ? (
        <div
          className={`${styles.resizeHandle} not-selectable`}
          onMouseDown={header.getResizeHandler()}
          onTouchStart={header.getResizeHandler()}
          data-testid="resize-handle"
          data-column={header.index}
        />
      ) : null}
    </div>
  );
}
