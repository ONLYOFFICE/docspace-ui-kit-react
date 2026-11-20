import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
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
  "aria-label": ariaLabel,
}: ListComponentProps) => {
  const loaderRef = useRef<InfiniteLoader | null>(null);
  const listRef = useRef<List | null>(null);

  const listItemRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [rowListWidth, setRowListWidth] = useState(0);

  useEffect(() => {
    listRef?.current?.forceUpdate();
  });

  // A row list is as wide as the element it sits in, whatever that one's id.
  useLayoutEffect(() => {
    if (viewAs === "table") return;

    const container = wrapperRef.current?.parentElement;
    if (!container) return;

    const measure = () =>
      setRowListWidth(container.getBoundingClientRect().width);

    measure();

    // jsdom has no ResizeObserver: a consumer's tests get one measurement.
    if (typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(measure);
    observer.observe(container);
    return () => observer.disconnect();
  }, [viewAs]);

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
      ref={wrapperRef}
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
                viewAs === "table"
                  ? (document
                      .getElementById("table-container")
                      ?.getBoundingClientRect().width ?? 0)
                  : rowListWidth;

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
                  aria-label={ariaLabel}
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
