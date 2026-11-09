"use client";

import type React from "react";
import { useLayoutEffect, useState } from "react";

export type ScrollTarget = HTMLElement | Window;

const isRoot = (node: Element) =>
  node === document.documentElement || node === document.body;

// Not `instanceof Window`: a window from another realm (an iframe, jsdom)
// fails it.
export const isWindow = (target: ScrollTarget | null): target is Window =>
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

// How many frames a scroller that does not scroll yet is waited for.
const RETRY_FRAMES = 10;

/**
 * The scroller around `ref`: `scrollElement` when given, else the nearest
 * ancestor that scrolls, else the window.
 *
 * A custom scrollbar can turn its element's overflow on only after its own
 * first render, by which time the table inside it has looked and settled on
 * the window - and would never see a scroll. So a window found that way is
 * looked past again: on the next frames, and on the first scroll of an element
 * round the table, which shows that one is the scroller.
 */
export const useScrollParent = (
  ref: React.RefObject<Element | null>,
  enabled: boolean,
  scrollElement?: HTMLElement | null,
) => {
  const [target, setTarget] = useState<ScrollTarget | null>(null);

  // Found before the first paint, so whatever reads it paints with the table.
  useLayoutEffect(() => {
    if (!enabled) {
      setTarget(null);
      return undefined;
    }
    if (scrollElement) {
      setTarget(scrollElement);
      return undefined;
    }

    const found = findScrollParent(ref.current);
    setTarget(found);
    if (!isWindow(found)) return undefined;

    const settle = (element: HTMLElement) => {
      cancelAnimationFrame(frame);
      document.removeEventListener("scroll", onScroll, true);
      setTarget(element);
    };

    let frame = 0;
    let attempts = 0;
    const retry = () => {
      const next = findScrollParent(ref.current);
      if (!isWindow(next)) settle(next);
      else if ((attempts += 1) < RETRY_FRAMES)
        frame = requestAnimationFrame(retry);
    };

    // Element scrolls do not bubble; a capturing listener on the document
    // still hears them.
    const onScroll = (e: Event) => {
      const element = e.target;
      if (
        element instanceof HTMLElement &&
        !isRoot(element) &&
        ref.current &&
        element.contains(ref.current)
      )
        settle(element);
    };

    frame = requestAnimationFrame(retry);
    document.addEventListener("scroll", onScroll, true);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("scroll", onScroll, true);
    };
  }, [ref, enabled, scrollElement]);

  return target;
};
