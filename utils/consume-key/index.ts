"use client";

type HandledKeyEvent = {
  key: string;
  stopPropagation: () => void;
};

/**
 * Keeps a key press a component has handled from reaching listeners further
 * up: the portal's page-wide hotkeys (Enter opens the selected file, the
 * arrows move the selection, Escape clears it) listen for `keydown` on the
 * document, and `ModalDialog` closes on an Escape `keyup` on `window`.
 *
 * Call it from the `keydown` handler that acted on the key. It stops that
 * `keydown`, and stops the matching `keyup` before it reaches `document` and
 * `window`. The `keyup` is picked out on `window` in the capture phase,
 * because focus has often moved by then (a menu closed and handed focus back
 * to its button), so it would not pass through the element that handled the
 * `keydown`. It is stopped only once it has bubbled up to `<html>`, so the
 * element it lands on and React's own `onKeyUp` handlers still receive it.
 *
 * The exception is a React root mounted on `document` itself (hydrating the
 * whole page, as Next.js does): React's listeners are then on `document`,
 * above `<html>`, and its `onKeyUp` handlers miss that one `keyup` too.
 */
export const consumeKey = (e: HandledKeyEvent) => {
  e.stopPropagation();

  if (typeof window === "undefined") return;

  const { key } = e;

  const release = () => {
    window.removeEventListener("keyup", onKeyUp, true);
    window.clearTimeout(timer);
  };

  const onKeyUp = (up: KeyboardEvent) => {
    if (up.key !== key) return;
    release();

    // Stop this one event at the top of the element tree, after the target
    // and every handler on the way up have seen it. If something below stops
    // it first, the listener runs on the next keyup to get there, matches
    // nothing and goes, as `once` removes it either way.
    document.documentElement.addEventListener(
      "keyup",
      (later) => {
        if (later === up) later.stopPropagation();
      },
      { once: true },
    );
  };

  // A keyup that never arrives (the window lost focus mid-press) must not
  // leave the listener to swallow some later, unrelated press.
  const timer = window.setTimeout(release, 1000);

  window.addEventListener("keyup", onKeyUp, true);
};
