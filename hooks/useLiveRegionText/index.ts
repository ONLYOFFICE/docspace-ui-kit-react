import { useEffect, useState, type RefObject } from "react";

/**
 * How long a new live region stays empty, in milliseconds. One render is not
 * enough: after a click React commits the empty region and its text within
 * the same frame, and a screen reader then sees a region that arrived with
 * its text. Safari with VoiceOver needs more than a frame as well.
 */
export const LIVE_REGION_DELAY = 100;

// Whether the component has been on the page for LIVE_REGION_DELAY.
const useLiveRegionReady = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), LIVE_REGION_DELAY);

    return () => window.clearTimeout(timer);
  }, []);

  return ready;
};

/**
 * Text for a live region that mounts together with what it announces.
 *
 * Screen readers announce a change inside a live region they already know
 * about; a region inserted together with its text is usually read by nobody.
 * This returns `undefined` until the component has been on the page for
 * `LIVE_REGION_DELAY`, so the region reaches the DOM empty, and the text from
 * then on. Use it for a visually hidden region beside the visible content,
 * never for the visible content itself, which would then blink in late.
 *
 * Internal, like the rest of this module: deliberately not re-exported from
 * `hooks/index.ts`, which is part of the plugin API.
 */
export const useLiveRegionText = <T>(text: T): T | undefined => {
  const ready = useLiveRegionReady();

  return ready ? text : undefined;
};

// The text of an element as it reads, its text nodes joined by spaces, with
// anything under aria-hidden (icons, a drawn copy) left out.
const readText = (element: HTMLElement) => {
  const parts: string[] = [];
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);

  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (node.parentElement?.closest('[aria-hidden="true"]')) continue;
    const part = node.nodeValue?.trim();
    if (part) parts.push(part);
  }

  return parts.join(" ") || undefined;
};

/**
 * The same, for content that is drawn as nodes: the plain text of the
 * element `ref` points at, for a visually hidden region beside it. It is
 * read from the DOM after every commit once the delay has passed, and on
 * every change of that element's DOM, so a change of the content is
 * announced too, even one this component did not render. Copying the nodes into the region
 * instead would duplicate any link or button among them as an invisible tab
 * stop.
 */
export const useLiveRegionTextOf = (ref: RefObject<HTMLElement | null>) => {
  const ready = useLiveRegionReady();
  const [text, setText] = useState<string>();

  // No dependency list: the content can change with any render. Setting the
  // same string again does not re-render.
  useEffect(() => {
    if (ready && ref.current) setText(readText(ref.current));
  });

  // The content can also change without this component rendering: a child
  // with state of its own, a translation that arrives late, an SVG injected
  // after it loads. Those are read when the DOM changes.
  useEffect(() => {
    const element = ref.current;
    if (!ready || !element || typeof MutationObserver === "undefined") return;

    const observer = new MutationObserver(() => setText(readText(element)));
    observer.observe(element, {
      subtree: true,
      childList: true,
      characterData: true,
      attributeFilter: ["aria-hidden"],
    });

    return () => observer.disconnect();
  }, [ready, ref]);

  return ready ? text : undefined;
};
