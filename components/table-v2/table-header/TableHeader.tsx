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

import { useTableCtx } from "../context/TableContext";
import { getColumnMeta } from "../Table.meta";
import { TableSettings } from "../sub-components/table-settings";
import styles from "../Table.module.scss";
import type { TableHeaderProps, HeaderCellProps } from "./TableHeader.types";

export function TableHeader({
  activeSortBy,
  activeSortOrder,
  showSettings = true,
  settingsTitle,
  renderSettings,
  tagRef,
  className,
}: TableHeaderProps) {
  const { table, columnSizing, hideColumns, isIndexEditingMode, onResizeMouseDown } =
    useTableCtx();

  // Build settings columns list from table columns that have onChange meta
  const settingsColumns = useMemo(() => {
    return table.getAllColumns().map((col) => {
      const meta = getColumnMeta(col);
      return {
        key: col.id,
        title: meta.title ?? col.id,
        enable: col.getIsVisible(),
        isDisabled: meta.isDisabled ?? false,
        onChange: meta.onChange ? () => meta.onChange!(col.id) : undefined,
      };
    });
  }, [table, columnSizing]);

  return (
    <div
      ref={tagRef}
      className={classNames(
        styles.tableHeader,
        "table-container_header",
        className,
      )}
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
            visualIndex={idx}
            activeSortBy={activeSortBy}
            activeSortOrder={activeSortOrder}
            isLastColumn={idx === visibleHeaders.length - 1}
            hideColumns={hideColumns}
            isIndexEditingMode={isIndexEditingMode}
            onResizeMouseDown={onResizeMouseDown}
          />
        ));
      })}

      {showSettings && (
        <div
          className={styles.settingsBlock}
          title={settingsTitle}
          data-testid="settings-block"
        >
          {renderSettings ? (
            renderSettings(table)
          ) : (
            <TableSettings columns={settingsColumns} />
          )}
        </div>
      )}
    </div>
  );
}


function HeaderCell({
  header,
  visualIndex,
  activeSortBy,
  activeSortOrder,
  isLastColumn,
  hideColumns,
  isIndexEditingMode,
  onResizeMouseDown,
}: HeaderCellProps) {
  const meta = getColumnMeta(header.column);

  const { sortBy, onClick, defaultSize } = meta;
  const isDefault = meta.default ?? false;
  const isShort = meta.isShort ?? false;

  const tanstackSorted = header.column.getIsSorted();
  const isExternalSorted = sortBy ? activeSortBy === sortBy : false;
  const isSorted = tanstackSorted || isExternalSorted;
  const sortDirection = tanstackSorted
    ? tanstackSorted
    : activeSortOrder === "descending"
      ? "desc"
      : "asc";

  // Resize handle: not on last column, not in editing mode, not on fixed-size columns
  const canResize = !isLastColumn && !isIndexEditingMode && !defaultSize;

  const handleSortClick = (e: React.MouseEvent) => {
    if (sortBy && onClick) {
      onClick(sortBy, e);
    }
  };

  const cellClasses = classNames(
    styles.headerCell,
    "table-container_header-cell",
    {
      [styles.isActive]: isSorted,
      [styles.isDefault]: isDefault,
      [styles.sortable]: !!sortBy,
      [styles.sorted]: sortDirection === "desc",
    },
  );

  const checkboxMeta = meta.checkbox;

  return (
    <div
      className={cellClasses}
      id={`column_${visualIndex}`}
      data-enable={header.column.getIsVisible()}
      data-default={isDefault}
      data-is-short={isShort}
      data-min-width={header.column.columnDef.minSize}
      data-default-size={defaultSize ?? undefined}
      data-testid={`column-${header.id}`}
    >
      {checkboxMeta ? (
        <input
          type="checkbox"
          checked={checkboxMeta.value}
          ref={(el) => {
            if (el) el.indeterminate = checkboxMeta.isIndeterminate;
          }}
          onChange={checkboxMeta.onChange}
          className="table-container_row-checkbox"
          data-testid="header-checkbox"
        />
      ) : (
        <div className={styles.headerItem}>
          <div className={styles.textWrapper} onClick={handleSortClick}>
            <span className={classNames(styles.text, "header-container-text")}>
              {header.isPlaceholder
                ? null
                : (meta.title ?? String(header.column.columnDef.header ?? ""))}
            </span>
          </div>
          {sortBy && (
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
          )}
        </div>
      )}

      {canResize && !hideColumns && (
        <div
          className={classNames(styles.resizeHandle, "not-selectable")}
          onMouseDown={onResizeMouseDown(visualIndex)}
          data-testid="resize-handle"
          data-column={visualIndex}
        />
      )}
    </div>
  );
}
