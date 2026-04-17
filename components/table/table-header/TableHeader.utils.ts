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

import type { TTableColumn } from "../Table.types";
import {
  DEFAULT_MIN_COLUMN_SIZE,
  HANDLE_OFFSET,
  MIN_SIZE_NAME_COLUMN,
} from "../Table.constants";
import { checkingForUnfixedSize, getSubstring } from "../Table.utils";

export function getNextColumn(
  array: TTableColumn[],
  index: number,
  hideColumns: boolean,
): TTableColumn | null | undefined {
  let i = 1;

  while (array.length !== i) {
    const item = array[index + i];

    if (!item || hideColumns) return null;
    if (!item.enable) i += 1;
    else return item;
  }
}

export function updateTableRows(
  container: HTMLElement | null,
  str: string,
  useReactWindow: boolean,
): void {
  if (!useReactWindow) return;
  if (!container) return;

  container
    .querySelectorAll<HTMLElement>(".table-row, .table-list-item")
    .forEach((row) => {
      row.style.gridTemplateColumns = str;
    });
}

export function moveToLeft(
  widths: string[],
  columnIndex: number,
  newWidth: number,
  isIndexEditingMode?: boolean,
  index?: number,
): boolean | void {
  if (isIndexEditingMode) return;

  let leftColumn: HTMLElement | null = null;
  let colIndex =
    index !== undefined ? index : columnIndex ? columnIndex - 1 : 0;

  if (colIndex < 0) return;

  while (colIndex >= 0) {
    leftColumn = document.getElementById(`column_${colIndex}`);
    if (leftColumn) {
      if (leftColumn.dataset.enable === "true") break;
      else colIndex -= 1;
    } else return false;
  }

  if (leftColumn) {
    const minSize = leftColumn.dataset.minWidth
      ? leftColumn.dataset.minWidth
      : DEFAULT_MIN_COLUMN_SIZE;

    if (leftColumn.getBoundingClientRect().width <= +minSize) {
      if (colIndex < 0) return false;
      moveToLeft(widths, columnIndex, newWidth, isIndexEditingMode, colIndex - 1);
      return;
    }

    const offset = getSubstring(widths[columnIndex]) - newWidth;
    const column2Width = getSubstring(widths[colIndex]);
    const leftColumnWidth = column2Width - offset;
    const newLeftWidth =
      leftColumnWidth < +minSize ? minSize : leftColumnWidth;

    widths[colIndex] = `${newLeftWidth}px`;
    const width =
      getSubstring(widths[columnIndex]) +
      (offset - (+newLeftWidth - leftColumnWidth));

    widths[columnIndex] = `${width}px`;
  }
}

export function moveToRight(
  widths: string[],
  columnIndex: number,
  newWidth: number,
  columnsLength: number,
  isIndexEditingMode?: boolean,
  index?: number,
): boolean | void {
  if (isIndexEditingMode) return;

  let rightColumn: HTMLElement | null = null;
  let colIndex = index || columnIndex + 1;

  while (colIndex !== columnsLength) {
    rightColumn = document.getElementById(`column_${colIndex}`);
    if (rightColumn) {
      if (rightColumn.dataset.enable === "true") break;
      else colIndex += 1;
    } else return false;
  }

  const offset = getSubstring(widths[columnIndex]) - newWidth;
  const column2Width = getSubstring(widths[colIndex]);

  const defaultColumn = document.getElementById(`column_${colIndex}`);
  if (!defaultColumn || defaultColumn.dataset.defaultSize) return;

  const minSize = rightColumn?.dataset.minWidth
    ? +rightColumn.dataset.minWidth
    : DEFAULT_MIN_COLUMN_SIZE;

  if (column2Width + offset - HANDLE_OFFSET >= +minSize) {
    widths[columnIndex] = `${newWidth + HANDLE_OFFSET}px`;
    widths[colIndex] = `${column2Width + offset - HANDLE_OFFSET}px`;
  } else if (column2Width !== minSize) {
    const width =
      getSubstring(widths[columnIndex]) +
      getSubstring(widths[colIndex]) -
      minSize;

    widths[columnIndex] = `${width}px`;
    widths[colIndex] = `${minSize}px`;
  } else {
    if (colIndex === columnsLength) return false;
    moveToRight(
      widths,
      columnIndex,
      newWidth,
      columnsLength,
      isIndexEditingMode,
      colIndex + 1,
    );
  }
}

export function distributionOverWidth(
  overWidth: number,
  gridTemplateColumns: string[],
  columns: TTableColumn[],
): string[] {
  const newGridTemplateColumns: string[] = JSON.parse(
    JSON.stringify(gridTemplateColumns),
  );

  let countColumns = 0;
  const defaultColumnSize =
    columns.find((col) => col.defaultSize && col.enable)?.defaultSize || 0;

  newGridTemplateColumns.forEach((item, index) => {
    const unfixedSize = checkingForUnfixedSize(item, defaultColumnSize);
    if (!unfixedSize) return;

    const column = document.getElementById(`column_${index}`);
    const minWidth = column?.dataset?.minWidth;
    const minSize = minWidth ? +minWidth : MIN_SIZE_NAME_COLUMN;

    if (
      (columns[index]?.key === "Name" || columns[index]?.key === "Index"
        ? minSize
        : DEFAULT_MIN_COLUMN_SIZE) !== getSubstring(item)
    )
      countColumns += 1;
  });

  const addWidth = overWidth / countColumns;

  newGridTemplateColumns.forEach((item, index) => {
    const unfixedSize = checkingForUnfixedSize(item, defaultColumnSize);
    if (!unfixedSize) return;

    const column = document.getElementById(`column_${index}`);
    const minWidth = column?.dataset?.minWidth;
    const minSize = minWidth ? +minWidth : MIN_SIZE_NAME_COLUMN;

    const itemSubstring = getSubstring(item);

    if (
      (columns[index]?.key === "Name" || columns[index]?.key === "Index"
        ? minSize
        : DEFAULT_MIN_COLUMN_SIZE) === itemSubstring
    )
      return;

    const differenceWithMinimum =
      itemSubstring -
      (columns[index]?.key === "Name" || columns[index]?.key === "Index"
        ? minSize
        : DEFAULT_MIN_COLUMN_SIZE);

    if (differenceWithMinimum >= addWidth) {
      newGridTemplateColumns[index] = `${itemSubstring - addWidth}px`;
    } else {
      newGridTemplateColumns[index] = `${
        columns[index]?.key === "Name" || columns[index]?.key === "Index"
          ? minSize
          : DEFAULT_MIN_COLUMN_SIZE
      }px`;
    }
  });

  return newGridTemplateColumns;
}
