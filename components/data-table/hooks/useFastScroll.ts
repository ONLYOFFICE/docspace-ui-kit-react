"use client";

import { useEffect, useState } from "react";

import { MAX_INFINITE_LOADER_SHIFT } from "../../../utils/device";

import { DATA_TABLE_FAST_SCROLL_HOLD } from "../DataTable.constants";

type ScrollTarget = HTMLElement | Window;

const readOffset = (target: ScrollTarget) =>
  "scrollY" in target ? target.scrollY : target.scrollTop;

/**
 * Whether the scroller is being flung: true from a scroll event that moved
 * more than `MAX_INFINITE_LOADER_SHIFT` (800 px) since the previous one, until
 * the scroll has been calm for `DATA_TABLE_FAST_SCROLL_HOLD`. The old table's
 * infinite loader drew skeleton rows on the same rule.
 */
export const useFastScroll = (
  target: ScrollTarget | null,
  enabled: boolean,
) => {
  const [fast, setFast] = useState(false);

  useEffect(() => {
    if (!target || !enabled) {
      setFast(false);
      return undefined;
    }

    let last = readOffset(target);
    let timer: ReturnType<typeof setTimeout> | null = null;

    const onScroll = () => {
      const offset = readOffset(target);
      const shift = Math.abs(offset - last);
      last = offset;
      if (shift <= MAX_INFINITE_LOADER_SHIFT) return;

      setFast(true);
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        setFast(false);
      }, DATA_TABLE_FAST_SCROLL_HOLD);
    };

    target.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      target.removeEventListener("scroll", onScroll);
      if (timer) clearTimeout(timer);
    };
  }, [target, enabled]);

  return fast;
};
