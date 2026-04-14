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

import React from "react";
import classNames from "classnames";

import SortDescReactSvgUrl from "../../../../assets/sort.desc.react.svg";

import { IconButton } from "../../../icon-button";
import { Checkbox } from "../../../checkbox";

import { getColumnMeta } from "../../Table.meta";
import styles from "../../Table.module.scss";

import type { HeaderCellProps } from "./HeaderCell.types";

export function HeaderCell({
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
      onClick={handleSortClick}
    >
      {checkboxMeta ? (
        <Checkbox
          isChecked={checkboxMeta.value}
          isIndeterminate={checkboxMeta.isIndeterminate}
          onChange={checkboxMeta.onChange}
          className="table-container_row-checkbox"
        />
      ) : null}

      <div className={styles.headerItem}>
        <div className={styles.textWrapper}>
          <span className={classNames(styles.text, "header-container-text")}>
            {header.isPlaceholder
              ? null
              : (meta.title ?? String(header.column.columnDef.header ?? ""))}
          </span>
        </div>
        {sortBy && (
          <IconButton
            size={12}
            dataTestId="sort-icon"
            iconNode={<SortDescReactSvgUrl />}
            className={styles.sortIcon}
          />
        )}
      </div>

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

