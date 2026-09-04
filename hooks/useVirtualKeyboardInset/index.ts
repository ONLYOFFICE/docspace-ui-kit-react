import { useEffect, useState } from "react";

import { isTouchDevice } from "../../utils/device";

// Sub-pixel deltas (e.g. 0.18px) appear during keyboard animations on some
// browsers; treat them as "no keyboard".
const KEYBOARD_HEIGHT_THRESHOLD = 1;

/**
 * Tracks how many CSS pixels of the layout viewport's bottom are covered by
 * the virtual keyboard, so an in-flow container can reserve that space (e.g.
 * as `padding-bottom`) and keep its bottom-anchored content — a chat
 * composer — visible above the keyboard.
 *
 * Differs from `useKeyboardAwareSheet`, which offsets a `position: fixed`
 * bottom sheet: this hook is for normally-flowing flex layouts where the
 * covered area must be re-added inside the container itself.
 *
 * Returns 0 on non-touch devices, when `enabled` is false, when
 * `visualViewport` is unavailable, and while no keyboard is shown.
 */
export function useVirtualKeyboardInset(enabled = true): number {
  const [inset, setInset] = useState(0);

  useEffect(() => {
    if (!enabled || !isTouchDevice) return undefined;
    const vv = window.visualViewport;
    if (!vv) return undefined;

    let frame = 0;
    const update = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        // Bottom overlap = layout viewport height minus the visual viewport's
        // bottom edge. `offsetTop` matters on iOS: Safari scrolls the page to
        // reveal a focused input, which shrinks the actually covered area.
        const covered = Math.max(
          0,
          Math.round(window.innerHeight - vv.height - vv.offsetTop),
        );
        setInset(covered > KEYBOARD_HEIGHT_THRESHOLD ? covered : 0);
      });
    };

    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    update();

    return () => {
      if (frame) cancelAnimationFrame(frame);
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
      setInset(0);
    };
  }, [enabled]);

  return inset;
}
