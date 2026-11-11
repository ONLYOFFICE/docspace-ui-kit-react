"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { DataTableLoadMore } from "../DataTable.types";

type LoadMoreOptions = {
  loadMore?: DataTableLoadMore;
  /** How many rows are loaded. */
  loadedCount: number;
  /** Key of the first loaded row: a new one means the list was replaced. */
  firstKey: unknown;
  /** Whether the view is within the threshold of the last loaded row. */
  nearEnd: boolean;
  /** Changes whenever the view moves, such as the last rendered index. */
  position: unknown;
};

const isPromise = (value: unknown): value is Promise<unknown> =>
  typeof (value as Promise<unknown> | undefined)?.then === "function";

/**
 * Asks for the next page when the view nears the end. One call per loaded
 * count: a page that brings no rows does not set off another call straight
 * away, so a `hasMore` that stays true by mistake cannot loop. Such a call is
 * repeated only once the view moves, as a rejected one is, so a server that
 * keeps failing is not asked in a tight loop, and a consumer that skipped the
 * call - because another load of its own was running - is asked again.
 *
 * A list that was replaced starts over: fewer rows than before, or another
 * first row, is a new sort, filter or folder, and its first page may be as
 * long as the list the last call was made at.
 */
export const useLoadMore = ({
  loadMore,
  loadedCount,
  firstKey,
  nearEnd,
  position,
}: LoadMoreOptions) => {
  const [loading, setLoading] = useState(false);
  const inFlightRef = useRef(false);
  const requestedAtRef = useRef<number | null>(null);
  const failedAtRef = useRef<unknown>(undefined);
  const failedRef = useRef(false);
  // The count a call that resolved was made at, until a render shows whether
  // its page brought rows: the consumer may set them after resolving.
  const resolvedAtRef = useRef<number | null>(null);
  const listRef = useRef({ loadedCount, firstKey });
  // Where the view is now, rather than where it was when the call was made.
  const positionRef = useRef(position);
  positionRef.current = position;

  const hasMore = Boolean(loadMore?.hasMore);
  const onLoadMore = loadMore?.onLoadMore;

  const request = useCallback(() => {
    if (!hasMore || !onLoadMore || inFlightRef.current) return;
    if (requestedAtRef.current === loadedCount) return;

    requestedAtRef.current = loadedCount;
    const requestedAt = loadedCount;
    const result = onLoadMore();
    if (!isPromise(result)) return;

    inFlightRef.current = true;
    setLoading(true);

    const settle = () => {
      inFlightRef.current = false;
      setLoading(false);
    };
    result.then(
      () => {
        resolvedAtRef.current = requestedAt;
        settle();
      },
      () => {
        failedRef.current = true;
        failedAtRef.current = positionRef.current;
        settle();
      },
    );
  }, [hasMore, onLoadMore, loadedCount]);

  // `loading` is a dependency so that a page which did not fill the view
  // asks for the next one as soon as it settles.
  useEffect(() => {
    const list = listRef.current;
    if (loadedCount < list.loadedCount || firstKey !== list.firstKey) {
      requestedAtRef.current = null;
    }
    // Rows came, however late: nothing is stuck any more.
    if (loadedCount > list.loadedCount) failedRef.current = false;
    listRef.current = { loadedCount, firstKey };

    if (!loading && resolvedAtRef.current !== null) {
      // Resolved with no rows: waits for the view to move, as a failure does.
      if (resolvedAtRef.current === loadedCount) {
        failedRef.current = true;
        failedAtRef.current = position;
      }
      resolvedAtRef.current = null;
    }

    if (failedRef.current && position !== failedAtRef.current) {
      failedRef.current = false;
      requestedAtRef.current = null;
    }
    if (nearEnd && !loading) request();
  }, [nearEnd, loading, position, request, loadedCount, firstKey]);

  return { loading };
};
