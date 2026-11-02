"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { DataTableLoadMore } from "../DataTable.types";

type LoadMoreOptions = {
  loadMore?: DataTableLoadMore;
  /** How many rows are loaded. */
  loadedCount: number;
  /** Whether the view is within the threshold of the last loaded row. */
  nearEnd: boolean;
  /** Changes whenever the view moves, such as the last rendered index. */
  position: unknown;
};

const isPromise = (value: unknown): value is Promise<unknown> =>
  typeof (value as Promise<unknown> | undefined)?.then === "function";

/**
 * Asks for the next page when the view nears the end. One call per loaded
 * count: a page that brings no rows does not set off another call, so a
 * `hasMore` that stays true by mistake cannot loop. A rejected call is
 * repeated only once the view moves, never straight away, so a server that
 * keeps failing is not asked in a tight loop.
 */
export const useLoadMore = ({
  loadMore,
  loadedCount,
  nearEnd,
  position,
}: LoadMoreOptions) => {
  const [loading, setLoading] = useState(false);
  const inFlightRef = useRef(false);
  const requestedAtRef = useRef<number | null>(null);
  const failedAtRef = useRef<unknown>(undefined);
  const failedRef = useRef(false);

  const hasMore = Boolean(loadMore?.hasMore);
  const onLoadMore = loadMore?.onLoadMore;

  const request = useCallback(() => {
    if (!hasMore || !onLoadMore || inFlightRef.current) return;
    if (requestedAtRef.current === loadedCount) return;

    requestedAtRef.current = loadedCount;
    const result = onLoadMore();
    if (!isPromise(result)) return;

    inFlightRef.current = true;
    setLoading(true);

    const settle = () => {
      inFlightRef.current = false;
      setLoading(false);
    };
    result.then(settle, () => {
      failedRef.current = true;
      failedAtRef.current = position;
      settle();
    });
  }, [hasMore, onLoadMore, loadedCount, position]);

  // `loading` is a dependency so that a page which did not fill the view
  // asks for the next one as soon as it settles.
  useEffect(() => {
    if (failedRef.current && position !== failedAtRef.current) {
      failedRef.current = false;
      requestedAtRef.current = null;
    }
    if (nearEnd && !loading) request();
  }, [nearEnd, loading, position, request]);

  return { loading };
};
