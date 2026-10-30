"use client";

import { useEffect } from "react";

import type { RefObject } from "react";

const CANDIDATES = [
  "a[href]",
  "area[href]",
  "button",
  "input:not([type='hidden'])",
  "select",
  "textarea",
  "iframe",
  "summary",
  "audio[controls]",
  "video[controls]",
  "[contenteditable]:not([contenteditable='false'])",
  "[tabindex]",
].join(", ");

const isRendered = (el: HTMLElement) =>
  el.getClientRects().length > 0 &&
  getComputedStyle(el).visibility !== "hidden";

// A radio group is one Tab stop, the checked radio or else the first one, and
// its arrows move within it - the platform's rule, kept here.
const isRadioStop = (el: HTMLElement, root: HTMLElement) => {
  if (!(el instanceof HTMLInputElement) || el.type !== "radio" || !el.name)
    return true;

  const group = [
    ...root.querySelectorAll<HTMLInputElement>("input[type='radio']"),
  ].filter((radio) => radio.name === el.name && !radio.disabled);
  const checked = group.find((radio) => radio.checked);

  return checked ? checked === el : group[0] === el;
};

/**
 * The elements Tab stops on inside `root`, in document order: focusable,
 * with a tabIndex of 0 or more, enabled, rendered, and outside inert content.
 */
export const getTabStops = (root: HTMLElement): HTMLElement[] =>
  [...root.querySelectorAll<HTMLElement>(CANDIDATES)].filter(
    (el) =>
      el.tabIndex >= 0 &&
      !("disabled" in el && el.disabled === true) &&
      !el.closest("[inert]") &&
      isRendered(el) &&
      isRadioStop(el, root),
  );

// The open traps, in the order they opened. Only one of them owns the Tab key.
const traps: HTMLElement[] = [];

// The last trap to open owns the key, unless another open trap lies inside it
// in the DOM: that one is on top of it whatever order their effects ran in.
const getTopTrap = () => {
  const open = traps.filter((root) => root.isConnected);
  let top = open[open.length - 1];
  if (!top) return undefined;

  for (
    let inner = open.find((root) => root !== top && top.contains(root));
    inner;
    inner = open.find((root) => root !== top && top.contains(root))
  )
    top = inner;

  return top;
};

const onDocumentKeyDown = (e: KeyboardEvent) => {
  if (e.key !== "Tab" || e.defaultPrevented) return;
  if (e.altKey || e.ctrlKey || e.metaKey) return;

  const root = getTopTrap();
  if (!root) return;

  e.preventDefault();

  const stops = getTabStops(root);
  const { activeElement } = document;

  // Nothing to tab to (controls that show only on hover, say): the focus
  // still must not stay behind, so a container that can hold it takes it.
  if (!stops.length) {
    if (!root.contains(activeElement) && root.hasAttribute("tabindex"))
      root.focus({ preventScroll: true });
    return;
  }

  // From the focus when it is inside the trap; from the trap itself when it
  // is still behind it (a panel that opened without taking the focus), so the
  // first Tab lands on the first stop and Shift+Tab on the last.
  const from =
    activeElement instanceof HTMLElement && root.contains(activeElement)
      ? activeElement
      : root;

  // The next stop after the focus in document order, not the next item of
  // the list: the focus may sit on the container or on an element that is no
  // stop of its own.
  const next = e.shiftKey
    ? stops.findLast(
        (stop) =>
          !!(
            from.compareDocumentPosition(stop) &
            Node.DOCUMENT_POSITION_PRECEDING
          ),
      )
    : stops.find(
        (stop) =>
          !!(
            from.compareDocumentPosition(stop) &
            Node.DOCUMENT_POSITION_FOLLOWING
          ),
      );

  (next ?? (e.shiftKey ? stops[stops.length - 1] : stops[0])).focus();
};

/**
 * Keeps Tab and Shift+Tab inside `ref` while `active`: from the last stop Tab
 * goes to the first, from the first Shift+Tab goes to the last, and nothing
 * behind the container is reached - not even when the container opened
 * without taking the focus. `aria-modal` tells assistive technology the page
 * behind is inert, but browsers still tab into it.
 *
 * The stops are read at each key press, so content added, hidden or disabled
 * while the container is open is followed. Of several open traps only the top
 * one acts: the last to open, or one nested inside it. A Tab a control inside
 * has already handled (`defaultPrevented`) is left alone.
 */
export const useFocusTrap = (
  ref: RefObject<HTMLElement | null>,
  active: boolean,
) => {
  useEffect(() => {
    const root = ref.current;
    if (!active || !root) return;

    traps.push(root);
    if (traps.length === 1)
      document.addEventListener("keydown", onDocumentKeyDown);

    return () => {
      const index = traps.lastIndexOf(root);
      if (index !== -1) traps.splice(index, 1);
      if (!traps.length)
        document.removeEventListener("keydown", onDocumentKeyDown);
    };
  }, [ref, active]);
};
