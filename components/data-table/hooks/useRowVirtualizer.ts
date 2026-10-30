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

// The only module that imports the virtualizer, so it can be swapped for
// another one, or for code of our own, without the table noticing.

type ScrollTarget = HTMLElement | Window;

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

const isRoot = (node: Element) =>
  node === document.documentElement || node === document.body;

// Not `instanceof Window`: a window from another realm (an iframe, jsdom)
// fails it.
const isWindow = (target: ScrollTarget | null): target is Window =>
  target !== null && (target as Window).window === target;

/** The nearest ancestor that scrolls vertically, or the window. */
export const findScrollParent = (from: Element | null): ScrollTarget => {
  for (let node = from?.parentElement; node && !isRoot(node);) {
    const { overflowY } = getComputedStyle(node);
    if (/auto|scroll|overlay/.test(overflowY)) return node;
    node = node.parentElement;
  }
  return window;
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
  const [target, setTarget] = useState<ScrollTarget | null>(null);
  const [scrollMargin, setScrollMargin] = useState(0);
  // The sticky header covers the top of the view, so a row scrolled "to the
  // top" has to land below it.
  const [headerHeight, setHeaderHeight] = useState(0);

  // Found before the first paint, so the first rows paint with the table.
  useLayoutEffect(() => {
    if (!enabled) {
      setTarget(null);
      return;
    }
    setTarget(scrollElement ?? findScrollParent(bodyRef.current));
  }, [enabled, scrollElement, bodyRef]);

  const updateScrollMargin = useCallback(() => {
    const body = bodyRef.current;
    const next = measureScrollMargin(body, target);
    setScrollMargin((prev) => (Math.abs(prev - next) < 0.5 ? prev : next));

    // The header is the body's previous sibling.
    const header = body?.previousElementSibling;
    setHeaderHeight(header ? header.getBoundingClientRect().height : 0);
  }, [bodyRef, target]);

  useLayoutEffect(() => {
    if (enabled) updateScrollMargin();
  });

  // One hook for both kinds of scroller: the element functions and the
  // window ones differ only in what they observe.
  const virtualizer = useVirtualizer<Element, HTMLElement>({
    enabled: enabled && target !== null,
    count: enabled ? count : 0,
    getScrollElement: () => target as Element | null,
    estimateSize: () => rowHeight,
    overscan,
    scrollMargin,
    scrollPaddingStart: headerHeight,
    getItemKey: (index) => getItemKey(index) as string | number,
    // A content change above the table moves it within the scroller; the
    // next scroll measures where it went.
    onChange: updateScrollMargin,
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
  };
};
