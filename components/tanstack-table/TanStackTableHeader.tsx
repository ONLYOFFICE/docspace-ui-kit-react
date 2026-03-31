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
  /** Additional class name */
  className?: string;
}

export function TanStackTableHeader({
  showSettings = true,
  settingsTitle,
  renderSettings,
  className,
}: TanStackTableHeaderProps) {
  const { table } = useTanStackTable();

  const gridTemplateColumns = useMemo(() => {
    const visibleColumns = table.getVisibleLeafColumns();
    const parts = visibleColumns.map((col) => `${col.getSize()}px`);
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
      {table.getHeaderGroups().map((headerGroup) =>
        headerGroup.headers.map((header) => (
          <HeaderCell key={header.id} header={header} />
        )),
      )}

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
}

function HeaderCell({ header }: HeaderCellProps) {
  const meta = header.column.columnDef.meta as
    | Record<string, unknown>
    | undefined;
  const sortBy = meta?.sortBy as string | undefined;
  const isDefault = (meta?.isDefault as boolean) ?? false;
  const onClick = meta?.onClick as
    | ((sortBy: string, e: React.MouseEvent) => void)
    | undefined;

  const isSorted = header.column.getIsSorted();
  const canResize = header.column.getCanResize();

  const handleSortClick = (e: React.MouseEvent) => {
    if (sortBy && onClick) {
      onClick(sortBy, e);
    }
  };

  const cellClasses = classNames(styles.headerCell, "table-container_header-cell", {
    [styles.isActive]: !!isSorted,
    [styles.isDefault]: isDefault,
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
          role="button"
          tabIndex={0}
        >
          <span className={classNames(styles.text, "header-container-text")}>
            {header.isPlaceholder
              ? null
              : flexRender(
                  header.column.columnDef.header,
                  header.getContext(),
                )}
          </span>
          {isSorted ? (
            <span className={styles.sortIcon} data-testid="sort-icon">
              {isSorted === "asc" ? " \u2191" : " \u2193"}
            </span>
          ) : null}
        </div>
      </div>

      {canResize ? (
        <div
          className={classNames(styles.resizeHandle, {
            [styles.isResizing]: header.column.getIsResizing(),
          })}
          onMouseDown={header.getResizeHandler()}
          onTouchStart={header.getResizeHandler()}
          data-testid="resize-handle"
          data-column={header.index}
        />
      ) : null}
    </div>
  );
}
