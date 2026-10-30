"use client";

import type React from "react";

import { consumeKey } from "../consume-key";

/**
 * Keydown handler for an element that acts as a button without being a
 * `<button>`: Enter and Space on the element itself (not on a control inside
 * it) call `activate`, are kept from the page-wide hotkeys (Enter opens the
 * selected file), and Space does not scroll the page.
 */
export const activateOnButtonKey = <T extends HTMLElement>(
  e: React.KeyboardEvent<T>,
  activate: (e: React.KeyboardEvent<T>) => void,
) => {
  if (e.target !== e.currentTarget) return;
  if (e.key !== "Enter" && e.key !== " ") return;
  e.preventDefault();
  consumeKey(e);
  activate(e);
};

// A click event positioned at the element's lower start corner -- the left
// one, or the right one in RTL, where ContextMenu puts the menu's right edge
// at pageX -- for an action the keyboard started. It is never dispatched, so it is given the
// target, currentTarget and nativeEvent a handler typed for a React mouse
// event reads, and the methods React adds to its events, so a handler that
// calls isDefaultPrevented() or persist() does not throw.
export const keyboardClickAt = <T extends HTMLElement>(
  element: T | null,
  isRTL: boolean,
): React.MouseEvent<T> => {
  const rect = element?.getBoundingClientRect();
  const left = (isRTL ? rect?.right : rect?.left) ?? 0;
  const bottom = rect?.bottom ?? 0;
  const event = new MouseEvent("click", {
    bubbles: true,
    cancelable: true,
    clientX: left,
    clientY: bottom,
  });
  Object.defineProperty(event, "pageX", { value: left + window.scrollX });
  Object.defineProperty(event, "pageY", { value: bottom + window.scrollY });
  Object.defineProperty(event, "target", { value: element });
  Object.defineProperty(event, "currentTarget", { value: element });
  Object.defineProperty(event, "nativeEvent", { value: event });
  let propagationStopped = false;
  const stopPropagation = event.stopPropagation.bind(event);
  Object.assign(event, {
    stopPropagation: () => {
      propagationStopped = true;
      stopPropagation();
    },
    isDefaultPrevented: () => event.defaultPrevented,
    isPropagationStopped: () => propagationStopped,
    persist: () => {},
  });
  return event as unknown as React.MouseEvent<T>;
};
