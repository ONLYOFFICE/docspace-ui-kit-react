"use client";

import type React from "react";
import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import classNames from "classnames";

import {
  DATA_TABLE_LOAD_THRESHOLD,
  DATA_TABLE_OVERSCAN,
  DATA_TABLE_SKELETON_ROWS,
} from "../../DataTable.constants";
import type {
  DataTableApi,
  DataTableLoadMore,
  DataTableRenderRowProps,
  DataTableRowState,
  DataTableVirtualize,
} from "../../DataTable.types";
import { useFastScroll } from "../../hooks/useFastScroll";
import { useLoadMore } from "../../hooks/useLoadMore";
import {
  findScrollParent,
  useRowVirtualizer,
} from "../../hooks/useRowVirtualizer";
import styles from "../../DataTable.module.scss";

import { RowSlot } from "../row/RowSlot";
import { SkeletonRow } from "../row/SkeletonRow";

type DataTableBodyProps<T> = {
  rows: T[];
  getRowKey: (row: T, index: number) => React.Key;
  getRowProps?: (row: T, index: number) => DataTableRowState;
  renderRow?: (props: DataTableRenderRowProps<T>) => React.ReactNode;
  /** The table's `virtualize`, already told apart from `false`. */
  virtualize: DataTableVirtualize | null;
  loadMore?: DataTableLoadMore;
  rowHeight: number;
  apiRef?: React.Ref<DataTableApi>;
};

type Align = "start" | "center" | "end" | "auto";

/**
 * Whether the skeleton rows at the end of a plain list are within `margin`
 * of the view of their scroller.
 */
const useInView = (
  ref: React.RefObject<HTMLElement | null>,
  enabled: boolean,
  margin: number,
) => {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!enabled || !element || typeof IntersectionObserver === "undefined") {
      setInView(false);
      return undefined;
    }

    const parent = findScrollParent(element);
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      {
        root: "scrollY" in parent ? null : parent,
        rootMargin: `${margin}px 0px`,
      },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, enabled, margin]);

  return inView;
};

export const DataTableBody = <T,>({
  rows,
  getRowKey,
  getRowProps,
  renderRow,
  virtualize,
  loadMore,
  rowHeight,
  apiRef,
}: DataTableBodyProps<T>) => {
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const tailRef = useRef<HTMLDivElement | null>(null);

  const loaded = rows.length;
  const skeletonCount = loadMore?.hasMore
    ? (loadMore.skeletonRows ?? DATA_TABLE_SKELETON_ROWS)
    : 0;
  const threshold = loadMore?.threshold ?? DATA_TABLE_LOAD_THRESHOLD;

  const getItemKey = useCallback(
    (index: number) =>
      index < loaded
        ? getRowKey(rows[index], index)
        : `data-table-skeleton-${index - loaded}`,
    [getRowKey, rows, loaded],
  );

  const virtual = useRowVirtualizer({
    enabled: virtualize !== null,
    count: loaded + skeletonCount,
    rowHeight,
    overscan: virtualize?.overscan ?? DATA_TABLE_OVERSCAN,
    scrollElement: virtualize?.scrollElement,
    bodyRef,
    getItemKey,
  });

  const fast = useFastScroll(
    virtual.target,
    virtualize !== null && virtualize.skeletonOnFastScroll !== false,
  );

  const tailInView = useInView(
    tailRef,
    virtualize === null && skeletonCount > 0,
    threshold * rowHeight,
  );

  const lastIndex = virtual.rows.at(-1)?.index;
  const nearEnd = virtualize
    ? lastIndex !== undefined && lastIndex >= loaded - threshold
    : tailInView;

  const { loading } = useLoadMore({
    loadMore,
    loadedCount: loaded,
    nearEnd,
    position: virtualize ? lastIndex : tailInView,
  });

  useImperativeHandle(
    apiRef,
    () => ({
      scrollToIndex: (index: number, options?: { align?: Align }) => {
        const align = options?.align ?? "auto";
        if (virtualize) {
          virtual.scrollToIndex(index, align);
          return;
        }
        bodyRef.current?.children[index]?.scrollIntoView({
          block: align === "auto" ? "nearest" : align,
        });
      },
    }),
    [virtualize, virtual.scrollToIndex],
  );

  const renderSlot = (row: T, index: number, key?: React.Key) => (
    <RowSlot
      key={key}
      row={row}
      index={index}
      getRowProps={getRowProps}
      renderRow={renderRow}
    />
  );

  return (
    <div
      ref={bodyRef}
      role="rowgroup"
      aria-busy={loading || undefined}
      className={classNames(styles.body, "table-container_body")}
      data-testid="data-table-body"
    >
      {virtualize ? (
        // The client's selection area, hotkeys and the data room's index
        // separator read this markup: rows inside `.window-item` wrappers,
        // placed with `top` rather than a transform, in a container as tall
        // as the whole list. Skeleton rows are not `.window-item`s, as in
        // the old table, so nothing counts them as items.
        <div
          className={classNames(styles.virtualList, virtualize.innerClassName)}
          style={{ height: virtual.totalSize }}
        >
          {virtual.rows.map(({ index, key, top }) => {
            const skeleton = fast || index >= loaded;
            return (
              <div
                key={key}
                className={classNames(
                  styles.virtualRow,
                  skeleton ? null : ["table-list-item", "window-item"],
                )}
                style={{ top, height: rowHeight }}
                data-index={index}
              >
                {skeleton ? <SkeletonRow /> : renderSlot(rows[index], index)}
              </div>
            );
          })}
        </div>
      ) : (
        <>
          {/* Rows are direct children of the body here, so scrollToIndex
              finds one by its position. */}
          {rows.map((row, index) =>
            renderSlot(row, index, getRowKey(row, index)),
          )}
          {skeletonCount > 0 ? (
            <div ref={tailRef}>
              {Array.from({ length: skeletonCount }, (_, i) => (
                // Identical placeholders: the index is their identity.
                <SkeletonRow key={i} />
              ))}
            </div>
          ) : null}
        </>
      )}
    </div>
  );
};
