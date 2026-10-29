import { useCallback, useEffect, useRef, useState } from "react";

import styles from "../Section.module.scss";

export const MIN_SECTION_WIDTH = 416;
// How far past the widest docked width the pointer has to be pushed before the
// drag flips the panel into fullscreen — and, in fullscreen, how far back in it
// has to come to leave again. Small enough to feel like "keep going", large
// enough that landing exactly on the limit doesn't trigger it.
const FULLSCREEN_OVERSHOOT = 80;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

// Width of the content the panel sits next to — `#section` in the Section
// layouts, the preceding sibling for hosts that render the panel on their own
// (the dashboard). Both the drag bounds and the reflow clamp are derived from
// it, so the panel never has to know the host's row structure.
const contentWidth = (panel: HTMLElement) => {
  const content =
    document.getElementById("section") ?? panel.previousElementSibling;
  return content
    ? content.getBoundingClientRect().width
    : Number.POSITIVE_INFINITY;
};

const ownWidth = (panel: HTMLElement) => {
  const { width } = panel.getBoundingClientRect();
  const style = window.getComputedStyle(panel);
  if (style.boxSizing === "border-box") return width;

  const px = (value: string) => parseFloat(value) || 0;
  return (
    width -
    px(style.borderLeftWidth) -
    px(style.borderRightWidth) -
    px(style.paddingLeft) -
    px(style.paddingRight)
  );
};

// Section re-measures itself through a throttled ResizeObserver; nudge the
// resize listeners so table columns and tiles settle right away.
const settleLayout = () => window.dispatchEvent(new Event("resize"));

type UseEdgeResizerProps = {
  isVisible?: boolean;
  canResize: boolean;
  isFullscreen?: boolean;
  cssVariable: string;
  minWidth: number;
  maxWidth?: number;
  defaultWidth?: number;
  width?: number;
  onResize?: (value: number) => void;
  onLiveResize?: (value: number) => void;
  onRequestFullscreen?: () => void;
  onExitFullscreen?: () => void;
};

export const useEdgeResizer = ({
  isVisible = true,
  canResize,
  isFullscreen,
  cssVariable,
  minWidth,
  maxWidth,
  defaultWidth,
  width,
  onResize,
  onLiveResize,
  onRequestFullscreen,
  onExitFullscreen,
}: UseEdgeResizerProps) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const widthRef = useRef(width);
  widthRef.current = width;
  const [fitWidth, setFitWidth] = useState<number>();
  // Set while a drag is in flight so an unmount mid-drag still detaches the
  // window listeners and un-freezes the body cursor. Its presence also marks
  // "a drag is in progress" for the reflow clamp below.
  const stopDragRef = useRef<(() => void) | null>(null);

  useEffect(() => () => stopDragRef.current?.(), []);

  // The width is the user's only while the panel is docked. In fullscreen the
  // resizer is still there — as the way back out — but it no longer sets a
  // width, and neither does the reflow clamp.
  const isDockedResize = canResize && !isFullscreen;

  // Hand the width back to the layout the moment it owns it again (fullscreen,
  // or a narrower device): a value left over from a previous drag was written
  // straight to the DOM below, so React's own style diffing cannot clear it.
  useEffect(() => {
    if (!isDockedResize) panelRef.current?.style.removeProperty(cssVariable);
  }, [isDockedResize, cssVariable]);

  useEffect(() => {
    const panel = panelRef.current;
    if (!isVisible || !isDockedResize || !panel) return undefined;

    let frame = 0;
    const clampToRow = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        // A drag already keeps itself inside the same bound, and its live width
        // lives only in the DOM — correcting it from here would fight the
        // pointer and snap the panel back to the last committed width.
        if (stopDragRef.current) return;

        const fit = Math.max(
          minWidth,
          Math.floor(ownWidth(panel) + contentWidth(panel) - MIN_SECTION_WIDTH),
        );

        if (widthRef.current) {
          panel.style.setProperty(
            cssVariable,
            `${Math.min(widthRef.current, fit)}px`,
          );
        }
        setFitWidth(fit);
      });
    };

    const content =
      document.getElementById("section") ?? panel.previousElementSibling;
    const observer = new ResizeObserver(clampToRow);
    if (content) observer.observe(content);
    // The observer covers in-page layout changes; the window listener covers a
    // content element swapped out from under it by a route change.
    window.addEventListener("resize", clampToRow);
    clampToRow();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", clampToRow);
    };
  }, [isVisible, isDockedResize, minWidth, cssVariable]);

  const shownWidth =
    isVisible && isDockedResize && width
      ? Math.min(width, fitWidth ?? width)
      : undefined;

  // Pointer events, not mouse events: a finger or a pen dragging the edge
  // produces no mousemove at all, only a pan the browser would scroll with.
  // `touch-action: none` on the handle hands that gesture to this code.
  const onResizerPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const panel = panelRef.current;
      // One drag at a time: a second finger landing on the edge is ignored.
      if (!panel || e.button !== 0 || stopDragRef.current) return;

      // Suppress the text selection the drag would otherwise start.
      e.preventDefault();

      const { pointerId } = e;

      // The handle sits on the panel's inline-start edge, so in LTR moving the
      // pointer left widens the panel — and the other way round in RTL, where
      // the whole panel is mirrored to the left of the section.
      const direction =
        window.getComputedStyle(panel).direction === "rtl" ? 1 : -1;

      // Anchors of the current stretch of the drag. They are re-based, rather
      // than the drag restarted, when it crosses the fullscreen boundary — that
      // is what makes the gesture continuous in both directions.
      let anchorX = e.clientX;
      let anchorWidth = ownWidth(panel);
      let fullscreen = !!isFullscreen;

      // Grow only into the slack the content next to the panel still has above
      // its own minimum, and never past the panel's own cap. In fullscreen that
      // content is collapsed to zero, so the docked limit is derived from the
      // row the panel currently fills instead. Rounded once here: it is
      // committed as-is by both fullscreen paths, and a fractional rect width
      // would otherwise reach the store.
      const dockedLimit = Math.max(
        anchorWidth,
        anchorWidth + (contentWidth(panel) - MIN_SECTION_WIDTH),
      );
      const limit = Math.round(
        fullscreen
          ? Math.max(minWidth, anchorWidth - MIN_SECTION_WIDTH)
          : Math.min(maxWidth ?? Number.POSITIVE_INFINITY, dockedLimit),
      );

      const startWidth = Math.round(anchorWidth);
      let nextWidth = startWidth;
      let committed = false;

      const onPointerMove = (event: PointerEvent) => {
        if (event.pointerId !== pointerId) return;

        const desiredWidth =
          anchorWidth + direction * (event.clientX - anchorX);

        if (fullscreen) {
          // Dragging the edge back inwards is the way out of fullscreen. Until
          // the pointer has come in far enough, the layout keeps the width.
          if (
            !onExitFullscreen ||
            anchorWidth - desiredWidth < FULLSCREEN_OVERSHOOT
          )
            return;

          // Leave fullscreen and keep the very same drag going, now docked and
          // re-anchored to the widest docked width the row allows, so no
          // re-grab is needed. The panel edge necessarily lands inboard of the
          // pointer — a docked panel cannot be as wide as the whole row — but
          // the drag keeps tracking the pointer from there, in the same
          // direction the user is already moving.
          fullscreen = false;
          anchorX = event.clientX;
          anchorWidth = limit;
          nextWidth = limit;
          committed = true;
          onResize?.(limit);
          onExitFullscreen();
          settleLayout();
          return;
        }

        // Once the panel is pinned at its widest docked width, dragging further
        // in the same direction is a request for fullscreen — the drag ends
        // there and the host takes over, exactly as if the header button had
        // been clicked. Without a host handler the width just stays clamped.
        if (
          onRequestFullscreen &&
          desiredWidth - limit >= FULLSCREEN_OVERSHOOT
        ) {
          stopDrag();
          // Commit the width the panel actually reached, so leaving fullscreen
          // restores the wide panel the user dragged out rather than jumping
          // back to the width the drag started from.
          onResize?.(limit);
          onRequestFullscreen();
          settleLayout();
          return;
        }

        nextWidth = Math.round(clamp(desiredWidth, minWidth, limit));
        committed = false;
        // Drive the DOM directly while the pointer is down: routing every frame
        // through the host store would re-render the whole section tree (list,
        // table header, panel) on each pointermove. The committed value goes
        // to the store once, when the pointer is released.
        panel.style.setProperty(cssVariable, `${nextWidth}px`);
        onLiveResize?.(nextWidth);
      };

      const stopDrag = () => {
        stopDragRef.current = null;
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
        window.removeEventListener("pointercancel", onPointerUp);
        document.body.classList.remove(styles.resizingCursor);
      };

      // A cancelled pointer (the system took the touch over) ends the drag
      // where it stands, exactly like a release.
      function onPointerUp(event: PointerEvent) {
        if (event.pointerId !== pointerId) return;

        stopDrag();
        // A drag that never left fullscreen has no width to commit, and one
        // that left it on its last frame already committed the same value.
        if (!fullscreen && !committed && nextWidth !== startWidth)
          onResize?.(nextWidth);
        settleLayout();
      }

      stopDragRef.current = stopDrag;
      document.body.classList.add(styles.resizingCursor);
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
      window.addEventListener("pointercancel", onPointerUp);
    },
    [
      isFullscreen,
      cssVariable,
      minWidth,
      maxWidth,
      onResize,
      onLiveResize,
      onRequestFullscreen,
      onExitFullscreen,
    ],
  );

  const onResizerDoubleClick = useCallback(() => {
    if (defaultWidth === undefined) return;

    panelRef.current?.style.setProperty(cssVariable, `${defaultWidth}px`);
    onResize?.(defaultWidth);
    settleLayout();
  }, [cssVariable, defaultWidth, onResize]);

  return {
    panelRef,
    isDockedResize,
    shownWidth,
    onResizerPointerDown,
    onResizerDoubleClick,
  };
};
