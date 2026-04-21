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

import type { Dispatch, RefObject, SetStateAction } from "react";

import type { TTableColumn } from "../Table.types";
import {
  DEFAULT_MIN_COLUMN_SIZE,
  HANDLE_OFFSET,
  MIN_SIZE_NAME_COLUMN,
  SETTINGS_SIZE,
} from "../Table.constants";
import { checkingForUnfixedSize, getSubstring } from "../Table.utils";
import { isDesktop } from "../../../utils";
import type { Nullable } from "../../../types";
import type { UseTableHeaderResizeOptions } from "./hooks/use-table-header-resize";

export function getNextColumn(
  array: TTableColumn[],
  index: number,
  hideColumns: boolean,
): TTableColumn | null | undefined {
  let i = 1;

  while (index + i < array.length) {
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
  columnEls: (HTMLElement | null)[],
  isIndexEditingMode?: boolean,
  index?: number,
): boolean | void {
  if (isIndexEditingMode) return;

  let leftColumn: HTMLElement | null = null;
  let colIndex = index !== undefined ? index : columnIndex - 1;

  if (colIndex < 0) return;

  while (colIndex >= 0) {
    leftColumn = columnEls[colIndex] ?? null;
    if (leftColumn) {
      if (leftColumn.dataset.enable === "true") break;
      else colIndex -= 1;
    } else return false;
  }

  if (leftColumn) {
    const minSize = leftColumn.dataset.minWidth
      ? +leftColumn.dataset.minWidth
      : DEFAULT_MIN_COLUMN_SIZE;

    if (leftColumn.getBoundingClientRect().width <= minSize) {
      if (colIndex < 0) return false;
      moveToLeft(
        widths,
        columnIndex,
        newWidth,
        columnEls,
        isIndexEditingMode,
        colIndex - 1,
      );
      return;
    }

    const offset = getSubstring(widths[columnIndex]) - newWidth;
    const column2Width = getSubstring(widths[colIndex]);
    const leftColumnWidth = column2Width - offset;
    const newLeftWidth = leftColumnWidth < minSize ? minSize : leftColumnWidth;

    widths[colIndex] = `${newLeftWidth}px`;
    const width =
      getSubstring(widths[columnIndex]) +
      (offset - (newLeftWidth - leftColumnWidth));

    widths[columnIndex] = `${width}px`;
  }
}

export function moveToRight(
  widths: string[],
  columnIndex: number,
  newWidth: number,
  columnsLength: number,
  columnEls: (HTMLElement | null)[],
  isIndexEditingMode?: boolean,
  index?: number,
): boolean | void {
  if (isIndexEditingMode) return;

  let rightColumn: HTMLElement | null = null;
  let colIndex = index !== undefined ? index : columnIndex + 1;

  while (colIndex !== columnsLength) {
    rightColumn = columnEls[colIndex] ?? null;
    if (rightColumn) {
      if (rightColumn.dataset.enable === "true") break;
      else colIndex += 1;
    } else return false;
  }

  const offset = getSubstring(widths[columnIndex]) - newWidth;
  const column2Width = getSubstring(widths[colIndex]);

  const defaultColumn = columnEls[colIndex] ?? null;
  if (!defaultColumn || defaultColumn.dataset.defaultSize) return;

  const minSize = rightColumn?.dataset.minWidth
    ? +rightColumn.dataset.minWidth
    : DEFAULT_MIN_COLUMN_SIZE;

  if (column2Width + offset - HANDLE_OFFSET >= minSize) {
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
      columnEls,
      isIndexEditingMode,
      colIndex + 1,
    );
  }
}

export function getColumnMinWidth(column: TTableColumn | undefined): number {
  if (!column) return DEFAULT_MIN_COLUMN_SIZE;
  if (column.default) return column.minWidth || MIN_SIZE_NAME_COLUMN;
  if (column.isShort) return column.minWidth || MIN_SIZE_NAME_COLUMN;
  return DEFAULT_MIN_COLUMN_SIZE;
}

export function distributionOverWidth(
  overWidth: number,
  gridTemplateColumns: string[],
  columns: TTableColumn[],
): string[] {
  const newGridTemplateColumns: string[] = [...gridTemplateColumns];

  let countColumns = 0;
  const defaultColumnSize =
    columns.find((col) => col.defaultSize && col.enable)?.defaultSize || 0;

  newGridTemplateColumns.forEach((item, index) => {
    const unfixedSize = checkingForUnfixedSize(item, defaultColumnSize);
    if (!unfixedSize) return;

    const colMinSize = getColumnMinWidth(columns[index]);
    if (colMinSize !== getSubstring(item)) countColumns += 1;
  });

  const addWidth = overWidth / countColumns;

  newGridTemplateColumns.forEach((item, index) => {
    const unfixedSize = checkingForUnfixedSize(item, defaultColumnSize);
    if (!unfixedSize) return;

    const itemSubstring = getSubstring(item);
    const colMinSize = getColumnMinWidth(columns[index]);

    if (colMinSize === itemSubstring) return;

    const differenceWithMinimum = itemSubstring - colMinSize;

    if (differenceWithMinimum >= addWidth) {
      newGridTemplateColumns[index] = `${itemSubstring - addWidth}px`;
    } else {
      newGridTemplateColumns[index] = `${colMinSize}px`;
    }
  });

  return newGridTemplateColumns;
}

export function getColumnStorageKey(
  infoPanelVisible: boolean,
  columnStorageName: string | undefined,
  columnInfoPanelStorageName: string | undefined,
): string {
  return infoPanelVisible
    ? columnInfoPanelStorageName || ""
    : (columnStorageName ?? "");
}

export function saveColumnSizes(key: string, gridStr: string): void {
  if (!key || !gridStr || typeof gridStr !== "string") return;
  localStorage.setItem(key, gridStr);
}

export function loadColumnSizes(
  key: string,
  columns: TTableColumn[],
): string | null {
  if (!key) return null;

  const raw = localStorage.getItem(key);
  if (raw == null) return null;

  if (typeof raw !== "string") {
    localStorage.removeItem(key);
    return null;
  }

  if (raw.trim() === "") {
    localStorage.removeItem(key);
    return null;
  }

  const parts = raw.split(" ");

  if (parts.length !== columns.length + 1) {
    localStorage.removeItem(key);
    return null;
  }

  if (parts.some((p) => isNaN(getSubstring(p)) || getSubstring(p) <= 0)) {
    localStorage.removeItem(key);
    return null;
  }

  const shortSize = columns.find((c) => c.isShort && c.enable)?.minWidth || 0;

  if (!shortSize && getSubstring(parts[0]) <= DEFAULT_MIN_COLUMN_SIZE) {
    localStorage.removeItem(key);
    return null;
  }

  return raw;
}

export function clearColumnSizes(key: string): void {
  if (!key) return;
  localStorage.removeItem(key);
}

export type OnResizeContext = {
  optionsRef: RefObject<UseTableHeaderResizeOptions>;
  headerRef: RefObject<HTMLDivElement | null>;
  lastContainerWidthRef: RefObject<Nullable<number>>;
  minWidthsIndex: RefObject<number[]>;
  hideColumnsRef: RefObject<boolean>;
  setHideColumns: Dispatch<SetStateAction<boolean>>;
  resetColumns: (isResized?: boolean) => void;
  addNewColumns: (
    gridTemplateColumns: string[],
    activeColumnIndex: number,
    containerWidth: number,
  ) => boolean | void;
};

export function resizeColumns(isResized: boolean, ctx: OnResizeContext): void {
  const {
    columns,
    infoPanelVisible,
    columnStorageName,
    columnInfoPanelStorageName,
    containerRef,
    useReactWindow,
    resetColumnsSize: resetColumnsSizeProp,
    setHideColumnsProp,
  } = ctx.optionsRef.current;

  if (!isDesktop() || !columnStorageName || !columnInfoPanelStorageName) {
    return;
  }

  let activeColumnIndex = null;

  const container =
    containerRef.current ?? document.getElementById("table-container");

  if (!container) return;

  const containerWidth = container.getBoundingClientRect().width;

  const storageSize =
    !resetColumnsSizeProp && loadColumnSizes(columnStorageName ?? "", columns);

  if (!storageSize && !isResized) {
    ctx.resetColumns();
    return;
  }

  // TODO: If defaultSize(75px) is less than defaultMinColumnSize(110px) the calculations work correctly
  const defaultSize =
    columns.find((col) => col.defaultSize && col.enable)?.defaultSize || 0;

  const containerGridTemplateColumns =
    container.style.gridTemplateColumns.split(" ");

  const tableContainer = storageSize
    ? storageSize.split(" ")
    : containerGridTemplateColumns;

  if (
    containerGridTemplateColumns.length === 1 &&
    !ctx.hideColumnsRef.current &&
    storageSize
  ) {
    const hasContent = !!storageSize.split(" ").find((item, index) => {
      if (index === 0) return;
      return checkingForUnfixedSize(item, defaultSize);
    });

    // If content column sizes are calculated as empty after changing view
    if (!hasContent) return ctx.resetColumns();
  }

  if (!container) return;

  const defaultWidth = tableContainer
    .map((column) => getSubstring(column))
    .reduce((x, y) => x + y);

  let oldWidth = defaultWidth - defaultSize - SETTINGS_SIZE;

  let str = "";
  let gridTemplateColumnsWithoutOverfilling: string[] = [];

  if (tableContainer.length > 1) {
    const gridTemplateColumns: string[] = [];
    let hideColumnsConst = false;

    const storageInfoPanelSize = loadColumnSizes(
      columnInfoPanelStorageName || "",
      columns,
    );

    const tableInfoPanelContainer =
      storageInfoPanelSize &&
      storageInfoPanelSize.split(" ").length === tableContainer.length
        ? storageInfoPanelSize.split(" ")
        : tableContainer;

    let containerMinWidth = containerWidth - defaultSize - SETTINGS_SIZE;

    tableInfoPanelContainer.forEach((item, index) => {
      const column = document.getElementById(`column_${index}`);

      const enable =
        index === tableContainer.length - 1 ||
        (column ? column.dataset.enable === "true" : item !== "0px");

      if (
        enable &&
        (item !== `${defaultSize}px` || `${defaultSize}px` === `0px`) &&
        item !== `${SETTINGS_SIZE}px`
      ) {
        if (column?.dataset?.minWidth) {
          containerMinWidth -= +column.dataset.minWidth;
        } else {
          containerMinWidth -= DEFAULT_MIN_COLUMN_SIZE;
        }
      }
    });

    if (containerMinWidth < 0) {
      hideColumnsConst = true;
    }

    if (ctx.hideColumnsRef.current !== hideColumnsConst) {
      ctx.hideColumnsRef.current = hideColumnsConst;
      ctx.setHideColumns(hideColumnsConst);
      setHideColumnsProp?.(hideColumnsConst);
    }

    if (hideColumnsConst) {
      const shortColumnSize =
        columns.find((col) => col.isShort && col.enable)?.minWidth || 0;

      tableInfoPanelContainer.forEach((item, index) => {
        const column = document.getElementById(`column_${index}`);

        if (shortColumnSize && index === 0) {
          gridTemplateColumns.push(`${shortColumnSize}px`);
        } else if (column?.dataset?.minWidth && column?.dataset?.default) {
          gridTemplateColumns.push(
            `${containerWidth - defaultSize - shortColumnSize - SETTINGS_SIZE}px`,
          );
        } else if (
          item === `${defaultSize}px` ||
          item === `${SETTINGS_SIZE}px`
        ) {
          gridTemplateColumns.push(item);
        } else {
          gridTemplateColumns.push("0px");
        }
      });
    }

    let hasGridTemplateColumnsWithoutOverfilling = false;
    if (infoPanelVisible) {
      if (!ctx.hideColumnsRef.current) {
        const contentWidth = containerWidth - defaultSize - SETTINGS_SIZE;

        let enabledColumnsCount = 0;

        tableInfoPanelContainer.forEach((item, index) => {
          if (
            !columns[index]?.isShort &&
            !columns[index]?.default &&
            item !== "0px" &&
            item !== `${defaultSize}px` &&
            item !== `${SETTINGS_SIZE}px`
          ) {
            enabledColumnsCount += 1;
          }
        });

        const changedWidth =
          tableInfoPanelContainer
            .map((column) => getSubstring(column))
            .reduce((x, y) => x + y) -
          defaultSize -
          SETTINGS_SIZE;

        const indexColumnWidth = columns[0].isShort
          ? getSubstring(tableInfoPanelContainer[0])
          : 0;
        const nameColumnWidth = columns[0].default
          ? getSubstring(tableInfoPanelContainer[0])
          : getSubstring(tableInfoPanelContainer[1]);

        if (
          contentWidth - enabledColumnsCount * DEFAULT_MIN_COLUMN_SIZE >
          nameColumnWidth + indexColumnWidth
        ) {
          const currentContentWidth =
            enabledColumnsCount > 0
              ? contentWidth - nameColumnWidth - indexColumnWidth
              : contentWidth;

          let overWidth = 0;

          tableInfoPanelContainer.forEach((item, index) => {
            const column = document.getElementById(`column_${index}`);

            const shortColumSize =
              column?.dataset?.shortColumn && column.dataset.minWidth;

            if (
              (columns[index]?.default || columns[index]?.isShort) &&
              enabledColumnsCount > 0
            ) {
              if (
                columns[index]?.isShort &&
                shortColumSize &&
                !ctx.minWidthsIndex.current.includes(+shortColumSize)
              ) {
                ctx.minWidthsIndex.current = [
                  ...ctx.minWidthsIndex.current,
                  +shortColumSize,
                ];
              }

              let newItemWidth = item;

              if (
                columns[index]?.isShort &&
                shortColumSize &&
                getSubstring(item) < +shortColumSize
              ) {
                overWidth += +shortColumSize - getSubstring(item);
                newItemWidth = `${shortColumSize}px`;
              }

              // Set the previous minimum width of the short column
              // if the user has not changed the width of this column
              if (
                columns[index]?.isShort &&
                shortColumSize &&
                getSubstring(item) > +shortColumSize &&
                ctx.minWidthsIndex.current.includes(getSubstring(item)) &&
                ctx.minWidthsIndex.current.includes(+shortColumSize)
              ) {
                overWidth += getSubstring(item) - +shortColumSize;
                newItemWidth = `${shortColumSize}px`;
              }

              gridTemplateColumns.push(newItemWidth);
            } else {
              const enable =
                index === tableInfoPanelContainer.length - 1 ||
                (column ? column.dataset.enable === "true" : item !== "0px");

              const defaultColumnSize = column && column.dataset.defaultSize;

              if (!enable) {
                gridTemplateColumns.push("0px");
              } else if (item !== `${SETTINGS_SIZE}px`) {
                const percent =
                  enabledColumnsCount === 0
                    ? 100
                    : (getSubstring(item) /
                        (changedWidth - nameColumnWidth - indexColumnWidth)) *
                      100;

                let newItemWidth;

                if (defaultColumnSize) {
                  newItemWidth = `${defaultColumnSize}px`;
                } else if (
                  (currentContentWidth * percent) / 100 >
                    DEFAULT_MIN_COLUMN_SIZE &&
                  !shortColumSize
                ) {
                  newItemWidth = `${(currentContentWidth * percent) / 100}px`;
                } else if (shortColumSize) {
                  newItemWidth = item;
                } else {
                  newItemWidth = `${DEFAULT_MIN_COLUMN_SIZE}px`;
                }

                if (
                  (currentContentWidth * percent) / 100 <
                    DEFAULT_MIN_COLUMN_SIZE &&
                  !defaultColumnSize
                ) {
                  overWidth +=
                    DEFAULT_MIN_COLUMN_SIZE -
                    (currentContentWidth * percent) / 100;
                }

                gridTemplateColumns.push(newItemWidth);
              } else {
                gridTemplateColumns.push(item);
              }
            }
          });

          if (overWidth > 0) {
            gridTemplateColumns.forEach((column, index) => {
              const columnWidth = getSubstring(column);

              if (
                !columns[index]?.default &&
                !columns[index]?.isShort &&
                column !== "0px" &&
                column !== `${defaultSize}px` &&
                column !== `${SETTINGS_SIZE}px` &&
                columnWidth > DEFAULT_MIN_COLUMN_SIZE
              ) {
                const availableWidth = columnWidth - DEFAULT_MIN_COLUMN_SIZE;

                if (availableWidth < Math.abs(overWidth)) {
                  overWidth = Math.abs(overWidth) - availableWidth;
                  return (gridTemplateColumns[index] = `${
                    columnWidth - availableWidth
                  }px`);
                }
                const temp = overWidth;

                overWidth = 0;

                return (gridTemplateColumns[index] = `${
                  columnWidth - Math.abs(temp)
                }px`);
              }
            });
          }
        } else {
          let overWidth = 0;

          const oldWidthIndexAndName = indexColumnWidth + nameColumnWidth;

          tableInfoPanelContainer.forEach((item, index) => {
            const column = document.getElementById(`column_${index}`);

            const enable =
              index === tableInfoPanelContainer.length - 1 ||
              (column ? column.dataset.enable === "true" : item !== "0px");

            const defaultColumnSize = column && column.dataset.defaultSize;
            const shortColumSize =
              column?.dataset?.shortColumn && column.dataset.minWidth;

            const percent = (getSubstring(item) / oldWidthIndexAndName) * 100;

            if (!enable) {
              gridTemplateColumns.push("0px");
            } else if (item !== `${SETTINGS_SIZE}px`) {
              let newItemWidth;

              if (defaultColumnSize) {
                newItemWidth = `${defaultColumnSize}px`;
              } else if (columns[index]?.isShort) {
                if (
                  shortColumSize &&
                  !ctx.minWidthsIndex.current.includes(+shortColumSize)
                ) {
                  ctx.minWidthsIndex.current = [
                    ...ctx.minWidthsIndex.current,
                    +shortColumSize,
                  ];
                }

                if (shortColumSize && getSubstring(item) === +shortColumSize) {
                  newItemWidth = item;
                } else {
                  newItemWidth = `${Math.round(
                    ((contentWidth -
                      enabledColumnsCount * DEFAULT_MIN_COLUMN_SIZE) *
                      percent) /
                      100,
                  )}px`;
                }
              } else if (columns[index]?.default) {
                let diff = 0;
                if (shortColumSize && indexColumnWidth === +shortColumSize) {
                  diff = +shortColumSize;
                }

                newItemWidth = `${
                  Math.round(
                    (contentWidth -
                      diff -
                      enabledColumnsCount * DEFAULT_MIN_COLUMN_SIZE) *
                      percent,
                  ) / 100
                }px`;
              } else {
                newItemWidth = `${DEFAULT_MIN_COLUMN_SIZE}px`;
              }

              // Checking whether the wide column is less than the minimum width
              if (
                columns[index]?.default &&
                getSubstring(newItemWidth) < MIN_SIZE_NAME_COLUMN
              ) {
                overWidth += MIN_SIZE_NAME_COLUMN - getSubstring(newItemWidth);
                newItemWidth = `${MIN_SIZE_NAME_COLUMN}px`;
              }

              // Checking whether the short column is less than the minimum width
              if (
                columns[index]?.isShort &&
                shortColumSize &&
                getSubstring(newItemWidth) < +shortColumSize
              ) {
                overWidth += +shortColumSize - getSubstring(newItemWidth);
                newItemWidth = `${shortColumSize}px`;
              }

              // Set the previous minimum width of the short column
              // if the user has not changed the width of this column
              if (
                columns[index]?.isShort &&
                shortColumSize &&
                getSubstring(newItemWidth) > +shortColumSize &&
                ctx.minWidthsIndex.current.includes(
                  getSubstring(newItemWidth),
                ) &&
                ctx.minWidthsIndex.current.includes(+shortColumSize)
              ) {
                overWidth += getSubstring(newItemWidth) - +shortColumSize;
                newItemWidth = `${shortColumSize}px`;
              }

              gridTemplateColumns.push(newItemWidth);
            } else {
              gridTemplateColumns.push(item);
            }
          });

          if (overWidth > 0) {
            const shortColumnSize =
              columns.find((col) => col.isShort && col.enable)?.minWidth || 0;

            gridTemplateColumns.forEach((column, index) => {
              const columnWidth = getSubstring(column);

              if (columns[index]?.default || columns[index]?.isShort) {
                if (
                  columns[index]?.isShort &&
                  columnWidth === shortColumnSize
                ) {
                  return columnWidth;
                }

                const availableWidth = columnWidth - MIN_SIZE_NAME_COLUMN;

                if (availableWidth < Math.abs(overWidth)) {
                  overWidth = Math.abs(overWidth) - availableWidth;
                  return (gridTemplateColumns[index] = `${
                    columnWidth - availableWidth
                  }px`);
                }
                const temp = overWidth;

                overWidth = 0;

                return (gridTemplateColumns[index] = `${
                  columnWidth - Math.abs(temp)
                }px`);
              }
            });
          }
        }
      }
    } else {
      let overWidth = 0;

      if (!ctx.hideColumnsRef.current && !hideColumnsConst) {
        for (const index in tableContainer) {
          const item = tableContainer[index];

          const column = document.getElementById(`column_${index}`);
          const enable =
            +index === tableContainer.length - 1 ||
            (column ? column.dataset.enable === "true" : item !== "0px");
          const defaultColumnSize = column && column.dataset.defaultSize;
          const shortColumSize =
            column?.dataset?.shortColumn && column.dataset.minWidth;

          const isSettingColumn = Number(index) === tableContainer.length - 1;

          const isActiveNow = item === "0px" && enable;
          if (isActiveNow && column) activeColumnIndex = index;

          if (
            columns[index]?.isShort &&
            shortColumSize &&
            !ctx.minWidthsIndex.current.includes(+shortColumSize)
          ) {
            ctx.minWidthsIndex.current = [
              ...ctx.minWidthsIndex.current,
              +shortColumSize,
            ];
          }

          if (
            columns[index]?.isShort &&
            shortColumSize &&
            getSubstring(item) > +shortColumSize &&
            ctx.minWidthsIndex.current.includes(getSubstring(item)) &&
            ctx.minWidthsIndex.current.includes(+shortColumSize)
          ) {
            const diff = getSubstring(item) - +shortColumSize;
            oldWidth -= diff;
          }

          if (!enable) {
            gridTemplateColumns.push("0px");

            let colIndex = 1;
            let leftEnableColumn = gridTemplateColumns[+index - colIndex];
            while (leftEnableColumn === "0px") {
              colIndex += 1;
              leftEnableColumn = gridTemplateColumns[+index - colIndex];
            }

            // added the size of the disabled column to the left column
            gridTemplateColumns[+index - colIndex] = `${
              getSubstring(gridTemplateColumns[+index - colIndex]) +
              getSubstring(item)
            }px`;
          } else if (isSettingColumn) {
            const newSettingsSize = SETTINGS_SIZE;
            gridTemplateColumns.push(`${newSettingsSize}px`);
          } else if (item !== `${SETTINGS_SIZE}px`) {
            const percent = (getSubstring(item) / oldWidth) * 100;

            if (percent === 100) {
              const enableColumnsLength = columns.filter(
                (c) => !c.defaultSize && c.enable,
              ).length;

              if (enableColumnsLength !== 1) {
                ctx.resetColumns();
                return;
              }
            }

            let newItemWidth;

            if (defaultColumnSize) {
              newItemWidth = `${defaultColumnSize}px`;
            } else if (percent === 0) {
              newItemWidth = `${DEFAULT_MIN_COLUMN_SIZE}px`;
            } else if (shortColumSize) {
              newItemWidth = item;
            } else {
              newItemWidth = `${
                ((containerWidth - defaultSize - SETTINGS_SIZE) * percent) / 100
              }px`;
            }

            const minWidth = column?.dataset?.minWidth;
            const minSize = minWidth ? +minWidth : MIN_SIZE_NAME_COLUMN;

            // Checking whether the wide column is less than the minimum width
            if (
              columns[index]?.default &&
              getSubstring(newItemWidth) < minSize &&
              !shortColumSize
            ) {
              overWidth += MIN_SIZE_NAME_COLUMN - getSubstring(newItemWidth);
              newItemWidth = `${MIN_SIZE_NAME_COLUMN}px`;
            }

            // Checking whether the short column is less than the minimum width
            if (
              columns[index]?.isShort &&
              shortColumSize &&
              getSubstring(newItemWidth) < +shortColumSize
            ) {
              overWidth += +shortColumSize - getSubstring(newItemWidth);
              newItemWidth = `${shortColumSize}px`;
            }

            // Set the previous minimum width of the short column
            // if the user has not changed the width of this column
            if (
              columns[index]?.isShort &&
              shortColumSize &&
              getSubstring(newItemWidth) > +shortColumSize &&
              ctx.minWidthsIndex.current.includes(getSubstring(newItemWidth)) &&
              ctx.minWidthsIndex.current.includes(+shortColumSize)
            ) {
              newItemWidth = `${shortColumSize}px`;
            }

            // Checking whether columns are smaller than the minimum width
            if (
              !columns[index]?.isShort &&
              !columns[index]?.default &&
              !defaultColumnSize &&
              getSubstring(newItemWidth) < DEFAULT_MIN_COLUMN_SIZE
            ) {
              overWidth += DEFAULT_MIN_COLUMN_SIZE - getSubstring(newItemWidth);
              newItemWidth = `${DEFAULT_MIN_COLUMN_SIZE}px`;
            }

            gridTemplateColumns.push(newItemWidth);
          } else {
            gridTemplateColumns.push(item);
          }
        }

        if (overWidth > 0) {
          gridTemplateColumnsWithoutOverfilling = distributionOverWidth(
            overWidth,
            gridTemplateColumns,
            columns,
          );
        }

        hasGridTemplateColumnsWithoutOverfilling =
          gridTemplateColumnsWithoutOverfilling &&
          gridTemplateColumnsWithoutOverfilling.length > 0;

        if (activeColumnIndex) {
          const gridColumns = hasGridTemplateColumnsWithoutOverfilling
            ? gridTemplateColumnsWithoutOverfilling
            : gridTemplateColumns;

          const needReset = ctx.addNewColumns(
            gridColumns,
            +activeColumnIndex,
            containerWidth,
          );
          if (needReset) return;
        }
      }
    }

    str = hasGridTemplateColumnsWithoutOverfilling
      ? gridTemplateColumnsWithoutOverfilling.join(" ")
      : gridTemplateColumns.join(" ");

    const strWidth = str
      .split(" ")
      .map((s) => getSubstring(s))
      .reduce((x, y) => x + y);

    if (
      Math.abs(+strWidth - containerWidth) >= 50 &&
      !isResized &&
      strWidth !== 0
    ) {
      ctx.resetColumns(true);
      return;
    }
  } else if (!isResized) {
    ctx.resetColumns();
    return;
  }

  if (str) {
    container.style.gridTemplateColumns = str;
    updateTableRows(containerRef.current, str, useReactWindow);

    if (ctx.headerRef.current) {
      ctx.headerRef.current.style.gridTemplateColumns = str;
      ctx.headerRef.current.style.width = `${containerWidth}px`;
    }

    saveColumnSizes(
      getColumnStorageKey(
        infoPanelVisible,
        columnStorageName,
        columnInfoPanelStorageName,
      ),
      str,
    );

    if (!infoPanelVisible) {
      clearColumnSizes(columnInfoPanelStorageName || "");
    }
  }
}
