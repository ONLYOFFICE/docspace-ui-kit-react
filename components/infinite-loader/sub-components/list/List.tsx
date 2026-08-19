/*
 * Copyright (C) Ascensio System SIA, 2009-2026
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation, together with the
 * additional terms provided in the LICENSE file.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For
 * details, see the GNU AGPL at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA by email at info@onlyoffice.com
 * or by postal mail at 20A-6 Ernesta Birznieka-Upisha Street, Riga,
 * LV-1050, Latvia, European Union.
 *
 * The interactive user interfaces in modified versions of the Program
 * are required to display Appropriate Legal Notices in accordance with
 * Section 5 of the GNU AGPL version 3.
 *
 * No trademark rights are granted under this License.
 *
 * All non-code elements of the Product, including illustrations,
 * icon sets, and technical writing content, are licensed under the
 * Creative Commons Attribution-ShareAlike 4.0 International License:
 * https://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 * This license applies only to such non-code elements and does not
 * modify or replace the licensing terms applicable to the Program's
 * source code, which remains licensed under the GNU Affero General
 * Public License v3.
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useCallback, useEffect, useRef } from "react";
import { InfiniteLoader, WindowScroller, List } from "react-virtualized";
import classNames from "classnames";

import { TableSkeleton } from "../../../table/sub-components/skeletons";
import { RowsSkeleton } from "../../../rows/skeletons/RowsSkeleton";

import { ListComponentProps } from "../../InfiniteLoader.types";
import styles from "../../InfiniteLoader.module.scss";

const ListComponent = ({
  viewAs,
  hasMoreFiles,
  filesLength,
  itemCount,
  onScroll,
  loadMoreItems,
  itemSize,
  columnStorageName,
  columnInfoPanelStorageName,
  children,
  className,
  scroll,
  infoPanelVisible,
  showSkeleton,
}: ListComponentProps) => {
  const loaderRef = useRef<InfiniteLoader | null>(null);
  const listRef = useRef<List | null>(null);

  const listItemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef?.current?.forceUpdate();
  });

  const getLoader = (style: React.CSSProperties, key: string) => {
    switch (viewAs) {
      case "table":
        return (
          <TableSkeleton
            key={key}
            style={style}
            className="table-container_body-loader"
            count={1}
          />
        );
      case "row":
        return (
          <RowsSkeleton
            key={key}
            style={style}
            className="row-loader"
            count={1}
          />
        );
      default:
        return null;
    }
  };

  const isItemLoaded = useCallback(
    ({ index }: { index: number }) => !hasMoreFiles || index < filesLength,
    [filesLength, hasMoreFiles],
  );

  const renderRow = ({
    key,
    index,
    style,
    isScrolling,
  }: {
    key: string;
    index: number;
    style: React.CSSProperties;
    isScrolling: boolean;
  }) => {
    const isLoaded = isItemLoaded({ index });
    if (!isLoaded || (isScrolling && showSkeleton))
      return getLoader(style, key);

    return (
      <div className="row-list-item window-item" style={style} key={key}>
        {children[index]}
      </div>
    );
  };

  const renderTable = ({
    index,
    style,
    key,
    isScrolling,
  }: {
    index: number;
    style: React.CSSProperties;
    key: string;
    isScrolling: boolean;
  }) => {
    if (!columnInfoPanelStorageName || !columnStorageName) {
      throw new Error("columnStorageName is required for a table view");
    }

    const storageSize = infoPanelVisible
      ? localStorage.getItem(columnInfoPanelStorageName)
      : localStorage.getItem(columnStorageName);

    const isLoaded = isItemLoaded({ index });
    if (!isLoaded || (isScrolling && showSkeleton))
      return getLoader(style, key);

    return (
      <div
        className="table-list-item window-item"
        ref={listItemRef}
        style={{
          ...style,
          display: "grid",
          gridTemplateColumns: storageSize!,
        }}
        key={key}
      >
        {children[index]}
      </div>
    );
  };

  const listClassName = classNames(styles.list, className, {
    [styles.tile]: viewAs === "tile",
    [styles.row]: viewAs === "row",
    [styles.table]: viewAs === "table",
  });

  return (
    <div
      style={{ display: "contents" }}
      data-testid="infinite-loader-container-list"
    >
      <InfiniteLoader
        isRowLoaded={isItemLoaded}
        rowCount={itemCount}
        loadMoreRows={loadMoreItems}
        ref={loaderRef}
      >
        {({ onRowsRendered, registerChild }) => (
          <WindowScroller scrollElement={scroll}>
            {({ height, isScrolling, onChildScroll, scrollTop }) => {
              let newHeight = height;
              if (height === undefined && scroll instanceof Element) {
                newHeight = scroll.getBoundingClientRect().height;
              }

              const viewId =
                viewAs === "table" ? "table-container" : "rowContainer";

              const width =
                document.getElementById(viewId)?.getBoundingClientRect()
                  .width ?? 0;

              return (
                <List
                  autoHeight
                  height={newHeight}
                  onRowsRendered={onRowsRendered}
                  ref={(ref: List | null) => {
                    listRef.current = ref;
                    registerChild(ref);
                  }}
                  rowCount={
                    hasMoreFiles ? children.length + 2 : children.length
                  }
                  rowHeight={itemSize}
                  rowRenderer={viewAs === "table" ? renderTable : renderRow}
                  isScrolling={isScrolling}
                  onChildScroll={onChildScroll}
                  scrollTop={scrollTop}
                  overscanRowCount={3}
                  onScroll={onScroll}
                  viewAs={viewAs}
                  width={width}
                  // React virtualized sets "LTR" by default.
                  style={
                    {
                      direction: "inherit",
                      "--infinite-loader-table-width": `${width}px`,
                    } as React.CSSProperties
                  }
                  className={listClassName}
                />
              );
            }}
          </WindowScroller>
        )}
      </InfiniteLoader>
    </div>
  );
};

export default ListComponent;
