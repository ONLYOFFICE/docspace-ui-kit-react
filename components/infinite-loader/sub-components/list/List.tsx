import React, { useCallback, useEffect, useRef } from "react";
import { InfiniteLoader, WindowScroller, List } from "react-virtualized";
import classNames from "classnames";

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
  children,
  className,
  scroll,
  showSkeleton,
}: ListComponentProps) => {
  const loaderRef = useRef<InfiniteLoader | null>(null);
  const listRef = useRef<List | null>(null);

  useEffect(() => {
    listRef?.current?.forceUpdate();
  });

  // `table` is drawn as the row list: the table layout went with the old
  // table, and DataTable virtualises its own rows.
  const isRowList = viewAs === "row" || viewAs === "table";

  const getLoader = (style: React.CSSProperties, key: string) => {
    if (!isRowList) return null;

    return (
      <RowsSkeleton key={key} style={style} className="row-loader" count={1} />
    );
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

  const listClassName = classNames(styles.list, className, {
    [styles.tile]: viewAs === "tile",
    [styles.row]: isRowList,
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

              const width =
                document.getElementById("rowContainer")?.getBoundingClientRect()
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
                  rowRenderer={renderRow}
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
                      "--infinite-loader-measured-width": `${width}px`,
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
