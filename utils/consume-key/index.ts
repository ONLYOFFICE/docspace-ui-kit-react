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
 * `keydown`, and swallows the matching `keyup` before anything else sees it.
 * The `keyup` is caught on `window` in the capture phase, because focus has
 * often moved by then (a menu closed and handed focus back to its button), so
 * it would not pass through the element that handled the `keydown`.
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
    up.stopPropagation();
    release();
  };

  // A keyup that never arrives (the window lost focus mid-press) must not
  // leave the listener to swallow some later, unrelated press.
  const timer = window.setTimeout(release, 1000);

  window.addEventListener("keyup", onKeyUp, true);
};
