"use client";

import { useEffect, useInsertionEffect, useRef } from "react";

import type { RefObject } from "react";

/**
 * Moves the focus into `ref` when it opens and gives it back to the element
 * it came from when it closes - the dialog pattern's two halves; the third,
 * keeping Tab inside, is `useFocusTrap`.
 *
 * Opened, the container takes the focus unless something inside already has
 * it (a field the caller focuses itself), so Space and Enter no longer act on
 * the control behind it. Closed, the focus goes back to where it was - as
 * long as nothing else has taken it in between, and that element is still in
 * the page.
 *
 * Where it was is read before the commit that shows the container touches the
 * DOM: a field with `autoFocus`, or one the content focuses in its own effect,
 * already has the focus by the time an effect runs, and would pass for the
 * opener - so the container would never hand the focus back.
 *
 * The container must be able to hold the focus: give it `tabIndex={-1}`.
 */
export const useFocusReturn = (
  ref: RefObject<HTMLElement | null>,
  active: boolean,
) => {
  const openerRef = useRef<Element | null>(null);
  useInsertionEffect(() => {
    if (active) openerRef.current = document.activeElement;
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const root = ref.current;
    if (!root) return;

    const previous = openerRef.current;
    if (!root.contains(document.activeElement))
      root.focus({ preventScroll: true });

    return () => {
      const { activeElement } = document;
      // The container may have swapped its node while open (a dialog's
      // `hideContent`), so the node captured above may be detached by now;
      // the ref holds the one the focus is actually in.
      const focusLeftWithIt =
        !activeElement ||
        activeElement === document.body ||
        root.contains(activeElement) ||
        !!ref.current?.contains(activeElement);
      if (
        focusLeftWithIt &&
        previous instanceof HTMLElement &&
        previous.isConnected
      )
        previous.focus({ preventScroll: true });
    };
  }, [active, ref]);
};
