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
// its arrows move within it - the platform's rule, kept here. Each group is
// looked up once per scan of `root`, not once per radio in it.
const radioStops = (root: HTMLElement) => {
  const stopOf = new Map<string, HTMLInputElement | undefined>();
  return (el: HTMLElement) => {
    if (!(el instanceof HTMLInputElement) || el.type !== "radio" || !el.name)
      return true;

    if (!stopOf.has(el.name)) {
      const group = [
        ...root.querySelectorAll<HTMLInputElement>("input[type='radio']"),
      ].filter((radio) => radio.name === el.name && !radio.disabled);
      stopOf.set(el.name, group.find((radio) => radio.checked) ?? group[0]);
    }
    return stopOf.get(el.name) === el;
  };
};

// Focusable, with a tabIndex of 0 or more, enabled, outside inert content
// and rendered - the layout reads last, as they are the costly part.
const isTabStop = (
  el: HTMLElement,
  isRadioStop: (el: HTMLElement) => boolean,
) =>
  el.tabIndex >= 0 &&
  // :disabled also covers a control inside a disabled fieldset, which takes
  // no focus though its own disabled is false.
  !el.matches(":disabled") &&
  !el.closest("[inert]") &&
  isRendered(el) &&
  isRadioStop(el);

/**
 * The elements Tab stops on inside `root`, in document order: focusable,
 * with a tabIndex of 0 or more, enabled, rendered, and outside inert content.
 */
export const getTabStops = (root: HTMLElement): HTMLElement[] => {
  const isRadioStop = radioStops(root);
  return [...root.querySelectorAll<HTMLElement>(CANDIDATES)].filter((el) =>
    isTabStop(el, isRadioStop),
  );
};

/**
 * Whether `root` holds any element Tab stops on, by the rule of
 * `getTabStops` - reading the layout no further than the first one.
 */
export const hasTabStop = (root: HTMLElement): boolean => {
  const isRadioStop = radioStops(root);
  for (const el of root.querySelectorAll<HTMLElement>(CANDIDATES))
    if (isTabStop(el, isRadioStop)) return true;
  return false;
};

// The open traps, in the order they opened. Only one of them owns the Tab key.
const traps: HTMLElement[] = [];

// The element in each open trap that last had the focus. A menu or a list a
// control in the trap opened lives in a portal, outside it, and does not handle
// Tab itself: Tab there goes on from that control, as it would from the menu's
// own place, instead of starting the trap over from its first stop.
const lastFocused = new WeakMap<HTMLElement, HTMLElement>();
// A popup over the page: the kit's context menu and drop-down render in a
// portal with these classes, and a menu or a list says so by its role.
const POPUP =
  '.p-contextmenu, .dropdown-container, [role="menu"], [role="listbox"]';
const onDocumentFocusIn = (e: FocusEvent) => {
  if (!(e.target instanceof HTMLElement)) return;
  for (const root of traps)
    if (root.contains(e.target)) lastFocused.set(root, e.target);
};

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

// The browser's Tab order: positive tabIndex values first, lowest first, then
// the rest, each in document order (the sort is stable).
const inTabOrder = (stops: HTMLElement[]) => [
  ...stops
    .filter((stop) => stop.tabIndex > 0)
    .sort((a, b) => a.tabIndex - b.tabIndex),
  ...stops.filter((stop) => stop.tabIndex === 0),
];

// Where Tab (Shift+Tab when `back`) goes from `from`; undefined past an end.
// From a stop, the next one in Tab order. From an element that is no stop of
// its own (the container, say), the nearest stop past it in document order.
const stopBeside = (
  from: HTMLElement,
  stops: HTMLElement[],
  ordered: HTMLElement[],
  back: boolean,
) => {
  const index = ordered.indexOf(from);
  if (index !== -1) return ordered[index + (back ? -1 : 1)];

  const side = back
    ? Node.DOCUMENT_POSITION_PRECEDING
    : Node.DOCUMENT_POSITION_FOLLOWING;
  const isPast = (stop: HTMLElement) =>
    !!(from.compareDocumentPosition(stop) & side);
  return back ? stops.findLast(isPast) : stops.find(isPast);
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

  const ordered = inTabOrder(stops);
  const back = e.shiftKey;

  // In a popup the trap opened, outside it, Tab goes on from the element in
  // the trap that had the focus last. With the focus behind the trap (a panel
  // that opened without taking it) there is nothing to go on from: the first
  // Tab lands on the first stop and Shift+Tab on the last, as past either end.
  const inside =
    activeElement instanceof HTMLElement && root.contains(activeElement)
      ? activeElement
      : activeElement?.closest(POPUP)
        ? lastFocused.get(root)
        : undefined;
  const next =
    inside?.isConnected && root.contains(inside)
      ? stopBeside(inside, stops, ordered, back)
      : undefined;

  (next ?? (back ? ordered[ordered.length - 1] : ordered[0])).focus();
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
 * has already handled (`defaultPrevented`) is left alone. Tab from a menu in a
 * portal goes on from the control in the trap that had the focus before it.
 */
export const useFocusTrap = (
  ref: RefObject<HTMLElement | null>,
  active: boolean,
) => {
  useEffect(() => {
    const root = ref.current;
    if (!active || !root) return;

    traps.push(root);
    if (traps.length === 1) {
      document.addEventListener("keydown", onDocumentKeyDown);
      document.addEventListener("focusin", onDocumentFocusIn);
    }
    if (root.contains(document.activeElement))
      lastFocused.set(root, document.activeElement as HTMLElement);

    return () => {
      const index = traps.lastIndexOf(root);
      if (index !== -1) traps.splice(index, 1);
      lastFocused.delete(root);
      if (!traps.length) {
        document.removeEventListener("keydown", onDocumentKeyDown);
        document.removeEventListener("focusin", onDocumentFocusIn);
      }
    };
  }, [ref, active]);
};
