import type React from "react";
import { useEffect, useState } from "react";

import { useScrollParent } from "./useScrollParent";

/**
 * Whether the sticky header has stuck, that is, rows are scrolling under it.
 * A sticky element's `offsetTop` is where it is drawn within the table, so it
 * is 0 until the header starts following the scroller. Checked once per frame
 * of scrolling; the state only changes when the answer does.
 */
export const useStuckHeader = (
  headerRef: React.RefObject<HTMLElement | null>,
  scrollElement?: HTMLElement | null,
) => {
  const [stuck, setStuck] = useState(false);
  const target = useScrollParent(headerRef, true, scrollElement);

  useEffect(() => {
    const header = headerRef.current;
    if (!header || !target) return undefined;

    const check = () => setStuck(header.offsetTop > 0);

    // The flag, not the id, says whether a frame is pending: the id is
    // assigned after `requestAnimationFrame` returns, which can be after the
    // callback already ran.
    let scheduled = false;
    let frame = 0;
    const onScroll = () => {
      if (scheduled) return;
      scheduled = true;
      frame = requestAnimationFrame(() => {
        scheduled = false;
        check();
      });
    };

    check();
    target.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      target.removeEventListener("scroll", onScroll);
      if (scheduled) cancelAnimationFrame(frame);
    };
  }, [headerRef, target]);

  return stuck;
};
