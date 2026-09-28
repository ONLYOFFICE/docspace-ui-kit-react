"use client";

import React from "react";

// The chat widget's own root element. Everything the user can type into
// inside it is the composer or one of its dialogs; anything outside is the
// host app and none of our business.
const CHAT_ROOT_SELECTOR = ".aui-root";

const isTypingTarget = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) return false;
  if (!target.closest(CHAT_ROOT_SELECTOR)) return false;
  return (
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLInputElement ||
    target.isContentEditable
  );
};

/**
 * Calls `onTyping` the first time the user writes anything into the chat's
 * composer while `enabled`.
 *
 * Read off the DOM on purpose: the chat library exposes `setComposerText` but
 * no change callback and no composer text on its stores, so there is nothing
 * to subscribe to (checked against @onlyoffice/ai-chat 0.5.108). A
 * capture-phase `beforeinput` listener is the narrowest read that still
 * catches every way text arrives — typing, paste, dictation — and it is
 * scoped to the widget's root so the host's own inputs never trigger it.
 *
 * Replace this with a library callback as soon as one exists.
 */
export const useComposerTyping = (
  enabled: boolean,
  onTyping: () => void,
): void => {
  React.useEffect(() => {
    if (!enabled) return;

    const handle = (event: Event) => {
      if (!isTypingTarget(event.target)) return;
      onTyping();
    };

    document.addEventListener("beforeinput", handle, true);
    return () => document.removeEventListener("beforeinput", handle, true);
  }, [enabled, onTyping]);
};
