"use client";

import type React from "react";
import { useCallback, useLayoutEffect, useState } from "react";
import {
  type Virtualizer,
  elementScroll,
  observeElementOffset,
  observeElementRect,
  observeWindowOffset,
  observeWindowRect,
  useVirtualizer,
  windowScroll,
} from "@tanstack/react-virtual";

import {
  type ScrollTarget,
  isWindow,
  useScrollParent,
} from "./useScrollParent";

// The only module that imports the virtualizer, so it can be swapped for
// another one, or for code of our own, without the table noticing.

type RowVirtualizerOptions = {
  /** Whether to virtualise at all; when false the hook does nothing. */
  enabled: boolean;
  count: number;
  rowHeight: number;
  overscan: number;
  /** The scroller the consumer named; found from `bodyRef` when absent. */
  scrollElement?: HTMLElement | null;
  /** The element the rows are positioned in. */
  bodyRef: React.RefObject<HTMLElement | null>;
  getItemKey: (index: number) => React.Key;
};

export type VirtualRow = {
  index: number;
  key: React.Key;
  /** Offset of the row from the top of the body, in pixels. */
  top: number;
};

/** Where the body starts within the scroller's content, in pixels. */
const measureScrollMargin = (
  body: HTMLElement | null,
  target: ScrollTarget | null,
) => {
  if (!body || !target) return 0;

  const top = body.getBoundingClientRect().top;
  if (isWindow(target)) return top + target.scrollY;

  return (
    top -
    target.getBoundingClientRect().top -
    target.clientTop +
    target.scrollTop
  );
};

export const useRowVirtualizer = ({
  enabled,
  count,
  rowHeight,
  overscan,
  scrollElement,
  bodyRef,
  getItemKey,
}: RowVirtualizerOptions) => {
  const target = useScrollParent(bodyRef, enabled, scrollElement);
  const [scrollMargin, setScrollMargin] = useState(0);
  // The sticky header, and whatever it stops below, covers the top of the
  // view, so a row scrolled "to the top" has to land below it.
  const [headerBottom, setHeaderBottom] = useState(0);

  const updateScrollMargin = useCallback(() => {
    const body = bodyRef.current;
    const next = measureScrollMargin(body, target);
    setScrollMargin((prev) => (Math.abs(prev - next) < 0.5 ? prev : next));

    // The header is the body's previous sibling; its `top` is where it sticks.
    const header = body?.previousElementSibling;
    const bottom = header
      ? (Number.parseFloat(getComputedStyle(header).top) || 0) +
        header.getBoundingClientRect().height
      : 0;
    setHeaderBottom((prev) => (Math.abs(prev - bottom) < 0.5 ? prev : bottom));
  }, [bodyRef, target]);

  // Measured when the table, its row count or its scroller changes, and when
  // something in the scroller changes size - a filter growing above the
  // table, say - but never on a scroll, which moves nothing within the
  // scroller: a measurement right after the rows changed makes the browser
  // restyle and lay them out on the spot, once more each frame.
  useLayoutEffect(() => {
    if (!enabled || !target) return undefined;
    updateScrollMargin();

    const content = isWindow(target) ? [document.body] : [...target.children];
    let scheduled = false;
    let frame = 0;
    const observer = new ResizeObserver(() => {
      if (scheduled) return;
      scheduled = true;
      frame = requestAnimationFrame(() => {
        scheduled = false;
        updateScrollMargin();
      });
    });
    for (const element of content) observer.observe(element);

    return () => {
      observer.disconnect();
      if (scheduled) cancelAnimationFrame(frame);
    };
  }, [enabled, target, count, updateScrollMargin]);

  // One hook for both kinds of scroller: the element functions and the
  // window ones differ only in what they observe.
  const virtualizer = useVirtualizer<Element, HTMLElement>({
    enabled: enabled && target !== null,
    count: enabled ? count : 0,
    getScrollElement: () => target as Element | null,
    estimateSize: () => rowHeight,
    overscan,
    scrollMargin,
    scrollPaddingStart: headerBottom,
    getItemKey: (index) => getItemKey(index) as string | number,
    useFlushSync: false,
    ...(isWindow(target)
      ? ({
          observeElementRect: observeWindowRect,
          observeElementOffset: observeWindowOffset,
          scrollToFn: windowScroll,
        } as unknown as Partial<Virtualizer<Element, HTMLElement>["options"]>)
      : {
          observeElementRect,
          observeElementOffset,
          scrollToFn: elementScroll,
        }),
  });

  const rows: VirtualRow[] = enabled
    ? virtualizer.getVirtualItems().map((item) => ({
        index: item.index,
        key: item.key as React.Key,
        top: item.start - scrollMargin,
      }))
    : [];

  const scrollToIndex = useCallback(
    (index: number, align: "start" | "center" | "end" | "auto" = "auto") =>
      virtualizer.scrollToIndex(index, { align }),
    [virtualizer],
  );

  return {
    rows,
    totalSize: enabled ? virtualizer.getTotalSize() : 0,
    scrollToIndex,
    /** The scroller in use, once found. */
    target,
  };
};
