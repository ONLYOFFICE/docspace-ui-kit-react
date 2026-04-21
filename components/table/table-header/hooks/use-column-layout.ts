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

import {
  useCallback,
  useEffect,
  useEffectEvent,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from "react";

import type { TTableColumn } from "../../Table.types";
import type { Nullable } from "../../../../types";
import {
  DEFAULT_MIN_COLUMN_SIZE,
  MIN_SIZE_NAME_COLUMN,
  SETTINGS_SIZE,
} from "../../Table.constants";
import { checkingForUnfixedSize, getSubstring } from "../../Table.utils";
import {
  clearColumnSizes,
  getColumnStorageKey,
  loadColumnSizes,
  resizeColumns,
  saveColumnSizes,
  updateTableRows,
} from "../TableHeader.utils";
import type { UseTableHeaderResizeOptions } from "./use-table-header-resize";

type TPrevHeaderData = Nullable<{
  columnStorageName?: string;
  sortBy?: string;
  sorted?: boolean;
  columns: TTableColumn[];
}>;

type UseColumnLayoutOptions = {
  optionsRef: RefObject<UseTableHeaderResizeOptions>;
  headerRef: RefObject<HTMLDivElement | null>;
  options: UseTableHeaderResizeOptions;
};

export function useColumnLayout({
  optionsRef,
  headerRef,
  options,
}: UseColumnLayoutOptions): boolean {
  const lastContainerWidthRef = useRef<Nullable<number>>(null);
  const isMountedRef = useRef(false);
  const prevHeaderDataRef = useRef<TPrevHeaderData>(null);
  const minWidthsIndex = useRef<number[]>([]);

  const columnsKey = options.columns
    .map((c) => `${c.key}:${c.enable}`)
    .join(",");

  const [hideColumns, setHideColumns] = useState(false);
  const hideColumnsRef = useRef(false);

  // ─── Column distribution ──────────────────────────────────────────────────

  const resetColumns = useCallback((isResized: boolean = false) => {
    const {
      columns,
      infoPanelVisible,
      columnStorageName,
      columnInfoPanelStorageName,
      containerRef,
      useReactWindow,
      withoutWideColumn,
    } = optionsRef.current;

    clearColumnSizes(
      getColumnStorageKey(
        infoPanelVisible,
        columnStorageName,
        columnInfoPanelStorageName,
      ),
    );

    let str = "";

    const enableColumns = columns
      .filter((x) => x.enable)
      .filter((x) => !x.defaultSize)
      .filter((x) => !x.default)
      .filter((x) => !x.isShort);

    const container =
      containerRef.current ?? document.getElementById("table-container");

    if (!container) return;

    const defaultColumnSize =
      columns.find((col) => col.defaultSize && col.enable)?.defaultSize || 0;

    const isShortColumnSize =
      columns.find((col) => col.isShort && col.enable)?.minWidth || 0;

    const containerWidth =
      container.clientWidth -
      defaultColumnSize -
      SETTINGS_SIZE -
      isShortColumnSize;

    let nameColumnPercent = enableColumns.length > 0 ? 40 : 100;
    let percent = enableColumns.length > 0 ? 60 / enableColumns.length : 0;

    if (withoutWideColumn) {
      nameColumnPercent = 100 / columns.length;
      percent = 100 / columns.length;
    }

    let wideColumnSize = (containerWidth * nameColumnPercent) / 100;
    let otherColumns = (containerWidth * percent) / 100;

    if (otherColumns < DEFAULT_MIN_COLUMN_SIZE) {
      wideColumnSize -=
        (DEFAULT_MIN_COLUMN_SIZE - otherColumns) * enableColumns.length;
      otherColumns = DEFAULT_MIN_COLUMN_SIZE;
    }

    columns.forEach((col) => {
      if (col.default) {
        str += `${wideColumnSize}px `;
      } else if (col.isShort) {
        str += `${col.minWidth}px `;
      } else {
        str += col.enable
          ? col.defaultSize
            ? `${col.defaultSize}px `
            : `${otherColumns}px `
          : "0px ";
      }
    });

    str += `${SETTINGS_SIZE}px`;

    if (container) container.style.gridTemplateColumns = str;
    if (headerRef.current) {
      headerRef.current.style.gridTemplateColumns = str;
      headerRef.current.style.width = `${container.clientWidth}px`;
    }

    if (str) {
      saveColumnSizes(
        getColumnStorageKey(
          infoPanelVisible,
          columnStorageName,
          columnInfoPanelStorageName,
        ),
        str,
      );

      updateTableRows(containerRef.current, str, useReactWindow);
    }

    // Only call onResize if not already resized and container width has changed
    if (!isResized && container.clientWidth !== lastContainerWidthRef.current) {
      // Cache lastContainerWidth result to prevent recursive calls
      lastContainerWidthRef.current = container.clientWidth;
      resizeColumns(true, {
        optionsRef,
        headerRef,
        lastContainerWidthRef,
        minWidthsIndex,
        hideColumnsRef,
        setHideColumns,
        resetColumns,
        addNewColumns,
      });
    }
  }, []);

  const addNewColumns = useCallback(
    (
      gridTemplateColumns: string[],
      activeColumnIndex: number,
      containerWidth: number,
    ): boolean | void => {
      const { columns } = optionsRef.current;

      const clearSize = gridTemplateColumns.map((c) => getSubstring(c));
      const maxSize = Math.max(...clearSize);

      const { defaultSize } = columns[activeColumnIndex - 1];

      const indexOfMaxSize = clearSize.findLastIndex((s) => s === maxSize);

      const addedColumn = 1;
      const enableColumnsLength =
        columns.filter((column) => !column.defaultSize && column.enable)
          .length - addedColumn;

      const allColumnsLength = columns.filter(
        (column) => !column.defaultSize,
      ).length;

      const defaultSizeColumn = columns.find(
        (column) => column.defaultSize,
      )?.defaultSize;

      const widthColumns =
        containerWidth - SETTINGS_SIZE - (defaultSizeColumn || 0);

      const newColumnSize = defaultSize || widthColumns / allColumnsLength;

      const newSizeMaxColumn = maxSize - newColumnSize;

      const AddColumn = () => {
        gridTemplateColumns[indexOfMaxSize] = `${newSizeMaxColumn}px`;
        gridTemplateColumns[activeColumnIndex] = `${newColumnSize}px`;
        return false;
      };

      const ResetColumnsSize = () => {
        resetColumns();
        return true;
      };

      if (
        (indexOfMaxSize === 0 && newSizeMaxColumn < MIN_SIZE_NAME_COLUMN) ||
        (indexOfMaxSize !== 0 && newSizeMaxColumn < DEFAULT_MIN_COLUMN_SIZE) ||
        newColumnSize < DEFAULT_MIN_COLUMN_SIZE ||
        enableColumnsLength === 1
      ) {
        return ResetColumnsSize();
      }

      AddColumn();
    },
    [resetColumns],
  );

  const onResize = useCallback(
    (isResized: boolean = false) => {
      resizeColumns(isResized, {
        optionsRef,
        headerRef,
        lastContainerWidthRef,
        minWidthsIndex,
        hideColumnsRef,
        setHideColumns,
        resetColumns,
        addNewColumns,
      });
    },
    [resetColumns, addNewColumns],
  );

  // ─── Effects ──────────────────────────────────────────────────────────────

  useLayoutEffect(() => {
    if (!isMountedRef.current) {
      onResize();
    }
  }, []);

  const handleWindowResize = useEffectEvent(() => {
    onResize(true);
  });

  useEffect(() => {
    let rafId = 0;

    const onWindowResize = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(handleWindowResize);
    };

    window.addEventListener("resize", onWindowResize, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onWindowResize);
    };
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!isMountedRef.current) return;

    const {
      columns,
      columnStorageName,
      sortBy,
      sorted,
      infoPanelVisible,
      columnInfoPanelStorageName,
      resetColumnsSize: resetColumnsSizeProp,
    } = optionsRef.current;

    const prevHeaderData = prevHeaderDataRef.current;

    const updatePrevHeaderData = () => {
      prevHeaderDataRef.current = {
        columns,
        columnStorageName,
        sortBy,
        sorted,
      };
    };

    if (!prevHeaderData) {
      updatePrevHeaderData();
      return;
    }

    let shouldReset = false;

    if (columnStorageName === prevHeaderData.columnStorageName) {
      const storageSize = loadColumnSizes(
        getColumnStorageKey(
          infoPanelVisible,
          columnStorageName,
          columnInfoPanelStorageName,
        ),
        columns,
      );

      if (
        sortBy !== prevHeaderData.sortBy ||
        sorted !== prevHeaderData.sorted
      ) {
        const sortedColumnIndex = columns.findIndex(
          (c) => c?.sortBy === sortBy,
        );

        if (sortedColumnIndex > -1 && !columns[sortedColumnIndex].enable) {
          columns[sortedColumnIndex].onChange?.(columns[sortedColumnIndex].key);
        }
      }

      // columns.length + 1 - its settings column
      const isColumnsCountMismatch =
        storageSize && storageSize.split(" ").length !== columns.length + 1;

      if (isColumnsCountMismatch) {
        shouldReset = true;
      }
    }

    const storageSize =
      !resetColumnsSizeProp &&
      loadColumnSizes(columnStorageName ?? "", columns);

    if (columns.length !== prevHeaderData.columns.length && !storageSize) {
      shouldReset = true;
    }

    updatePrevHeaderData();

    if (shouldReset) {
      resetColumns();
    } else {
      onResize();
    }
  }, [
    columnsKey,
    options.columns,
    options.columnStorageName,
    options.sortBy,
    options.sorted,
    options.infoPanelVisible,
    options.columnInfoPanelStorageName,
    options.resetColumnsSize,
  ]);

  return hideColumns;
}
