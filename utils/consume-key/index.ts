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

  // A keyup that never arrives (the window lost focus mid-press, or macOS
  // dropped the keyup of a key released under Cmd) must not leave the
  // listener to swallow some later, unrelated press. Autorepeat keydowns say
  // the key is still held, so each one restarts the wait.
  const GIVE_UP_AFTER = 1000;
  let timer: ReturnType<typeof setTimeout>;

  // Release touches neither `window` nor its methods: the give-up timer may
  // fire after a test environment has torn the window's members down. The
  // listeners go with the signal, and the timer is the global one.
  const listeners = new AbortController();

  const release = () => {
    listeners.abort();
    clearTimeout(timer);
  };

  const onKeyUp = (up: KeyboardEvent) => {
    if (up.key !== key) return;
    up.stopPropagation();
    release();
  };

  const onKeyDown = (down: KeyboardEvent) => {
    if (down.key !== key || !down.repeat) return;
    clearTimeout(timer);
    timer = setTimeout(release, GIVE_UP_AFTER);
  };

  timer = setTimeout(release, GIVE_UP_AFTER);

  const options = { capture: true, signal: listeners.signal };
  window.addEventListener("keyup", onKeyUp, options);
  window.addEventListener("keydown", onKeyDown, options);
};
