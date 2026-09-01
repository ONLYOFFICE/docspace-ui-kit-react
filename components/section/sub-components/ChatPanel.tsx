/*
 * Copyright (C) Ascensio System SIA, 2009-2026
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation, together with the
 * additional terms provided in the LICENSE file.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For
 * details, see the GNU AGPL at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA by email at info@onlyoffice.com
 * or by postal mail at 20A-6 Ernesta Birznieka-Upisha Street, Riga,
 * LV-1050, Latvia, European Union.
 *
 * The interactive user interfaces in modified versions of the Program
 * are required to display Appropriate Legal Notices in accordance with
 * Section 5 of the GNU AGPL version 3.
 *
 * No trademark rights are granted under this License.
 *
 * All non-code elements of the Product, including illustrations,
 * icon sets, and technical writing content, are licensed under the
 * Creative Commons Attribution-ShareAlike 4.0 International License:
 * https://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 * This license applies only to such non-code elements and does not
 * modify or replace the licensing terms applicable to the Program's
 * source code, which remains licensed under the GNU Affero General
 * Public License v3.
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useCallback, useEffect, useRef } from "react";
import classNames from "classnames";

import { DeviceType } from "../../../enums";
import { Text } from "../../text";

import { ChatPanelProps } from "../Section.types";
import styles from "../Section.module.scss";

// Resize bounds for the docked panel. The lower bound keeps the chat composer
// usable; the upper one is derived per drag from how much width the section can
// give up before its own content (table columns / tiles) stops fitting.
const MIN_CHAT_PANEL_WIDTH = 360;
const MIN_SECTION_WIDTH = 416;
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
  const content = document.getElementById("section") ?? panel.previousElementSibling;
  return content
    ? content.getBoundingClientRect().width
    : Number.POSITIVE_INFINITY;
};

/**
 * Right-side region dedicated to the AI Chat panel. Unlike `InfoPanel` it never
 * switches into the portal-based "Aside" overlay on tablet/mobile: it always
 * renders inline (so the chat's live state is never lost to a remount across a
 * resize) and the full-screen layout on tablet/mobile is handled purely in CSS
 * (`.chatPanel`). Desktop width — windowed vs. full — is driven by the host via
 * the `--chat-panel-width` CSS variable.
 *
 * In the docked desktop layout the host can additionally opt into a drag
 * resizer on the panel's inline-start edge (`isResizable` + `width`/`onResize`).
 * It is desktop-only on purpose: on tablet/mobile — and in fullscreen — the
 * panel's width belongs to the layout, not to the user. Pushing that drag past
 * the widest docked width hands the panel to `onRequestFullscreen`, i.e. the
 * same state the header's fullscreen button produces; the resizer stays put in
 * fullscreen (`isFullscreen`) so the same gesture, dragged back inwards, calls
 * `onExitFullscreen` and goes on resizing the docked panel without a re-grab.
 */
const ChatPanel = ({
  children,
  isVisible,
  currentDeviceType,
  setIsVisible,
  dropTargetLabel,
  isResizable,
  width,
  onResize,
  isFullscreen,
  onRequestFullscreen,
  onExitFullscreen,
}: ChatPanelProps) => {
  const panelRef = useRef<HTMLDivElement>(null);
  // Set while a drag is in flight so an unmount mid-drag still detaches the
  // window listeners and un-freezes the body cursor. Its presence also marks
  // "a drag is in progress" for the reflow clamp below.
  const stopDragRef = useRef<(() => void) | null>(null);

  // On tablet/mobile the panel is full-screen, so the browser back button
  // closes it (mirrors InfoPanel). Use addEventListener rather than
  // window.onpopstate so it doesn't clobber InfoPanel's own handler.
  useEffect(() => {
    if (currentDeviceType === DeviceType.desktop || !isVisible)
      return undefined;

    const onPopState = () => setIsVisible?.(false);

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [currentDeviceType, isVisible, setIsVisible]);

  useEffect(() => () => stopDragRef.current?.(), []);

  const canResize = !!isResizable && currentDeviceType === DeviceType.desktop;
  // The width is the user's only while the panel is docked. In fullscreen the
  // resizer is still there — as the way back out — but it no longer sets a
  // width, and neither does the reflow clamp.
  const isDockedResize = canResize && !isFullscreen;

  // Hand the width back to the layout the moment it owns it again (fullscreen,
  // or a narrower device): a value left over from a previous drag was written
  // straight to the DOM below, so React's own style diffing cannot clear it.
  useEffect(() => {
    if (!isDockedResize)
      panelRef.current?.style.removeProperty("--chat-panel-width");
  }, [isDockedResize]);

  // A dragged width is an absolute pixel value on a `flex-shrink: 0` element, so
  // every later loss of row width (window resize, the article sidebar
  // expanding) is absorbed by the section alone — far enough and its navigation
  // header collapses. Give the width back as the row shrinks, down to the
  // panel's own minimum. Shrink-only: growing the window again leaves the width
  // the user last chose alone.
  useEffect(() => {
    const panel = panelRef.current;
    if (!isDockedResize || !onResize || !panel) return undefined;

    let frame = 0;
    const clampToRow = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        // A drag already keeps itself inside the same bound, and its live width
        // lives only in the DOM — correcting it from here would fight the
        // pointer and snap the panel back to the last committed width.
        if (stopDragRef.current) return;

        const deficit = MIN_SECTION_WIDTH - contentWidth(panel);
        // Sub-pixel rounding of the flex row is not a deficit worth acting on.
        if (deficit < 1) return;

        const current = panel.getBoundingClientRect().width;
        const next = Math.max(MIN_CHAT_PANEL_WIDTH, Math.round(current - deficit));
        if (next < current) onResize(next);
      });
    };

    const content = document.getElementById("section") ?? panel.previousElementSibling;
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
  }, [isDockedResize, onResize]);

  const onResizerMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const panel = panelRef.current;
      if (!panel || e.button !== 0) return;

      // Suppress the text selection the drag would otherwise start.
      e.preventDefault();

      // The handle sits on the panel's inline-start edge, so in LTR moving the
      // pointer left widens the panel — and the other way round in RTL, where
      // the whole panel is mirrored to the left of the section.
      const direction =
        window.getComputedStyle(panel).direction === "rtl" ? 1 : -1;

      // Anchors of the current stretch of the drag. They are re-based, rather
      // than the drag restarted, when it crosses the fullscreen boundary — that
      // is what makes the gesture continuous in both directions.
      let anchorX = e.clientX;
      let anchorWidth = panel.getBoundingClientRect().width;
      let fullscreen = !!isFullscreen;

      // Grow only into the slack the content next to the panel still has above
      // its own minimum. In fullscreen that content is collapsed to zero, so the
      // docked limit is derived from the row the panel currently fills instead.
      const maxWidth = fullscreen
        ? Math.max(MIN_CHAT_PANEL_WIDTH, anchorWidth - MIN_SECTION_WIDTH)
        : Math.max(
            anchorWidth,
            anchorWidth + (contentWidth(panel) - MIN_SECTION_WIDTH),
          );

      let nextWidth = anchorWidth;
      let committed = false;

      const onMouseMove = (event: MouseEvent) => {
        const desiredWidth = anchorWidth + direction * (event.clientX - anchorX);

        if (fullscreen) {
          // Dragging the edge back inwards is the way out of fullscreen. Until
          // the pointer has come in far enough, the layout keeps the width.
          if (
            !onExitFullscreen ||
            anchorWidth - desiredWidth < FULLSCREEN_OVERSHOOT
          )
            return;

          // Leave fullscreen and keep the very same drag going, now docked and
          // re-anchored to the widest docked width the row allows — so the
          // panel picks up under the pointer instead of needing a re-grab.
          fullscreen = false;
          anchorX = event.clientX;
          anchorWidth = maxWidth;
          nextWidth = maxWidth;
          committed = true;
          onResize?.(maxWidth);
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
          desiredWidth - maxWidth >= FULLSCREEN_OVERSHOOT
        ) {
          stopDrag();
          // Commit the width the panel actually reached, so leaving fullscreen
          // restores the wide panel the user dragged out rather than jumping
          // back to the width the drag started from.
          onResize?.(Math.round(maxWidth));
          onRequestFullscreen();
          settleLayout();
          return;
        }

        nextWidth = Math.round(
          clamp(desiredWidth, MIN_CHAT_PANEL_WIDTH, maxWidth),
        );
        committed = false;
        // Drive the DOM directly while the pointer is down: routing every frame
        // through the host store would re-render the whole section tree (list,
        // table header, chat) on each mousemove. The committed value goes to
        // the store once, on mouse up.
        panel.style.setProperty("--chat-panel-width", `${nextWidth}px`);
      };

      const stopDrag = () => {
        stopDragRef.current = null;
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
        document.body.classList.remove(styles.resizingCursor);
      };

      // Section re-measures itself through a throttled ResizeObserver; nudge the
      // resize listeners so table columns and tiles settle right away.
      const settleLayout = () => window.dispatchEvent(new Event("resize"));

      function onMouseUp() {
        stopDrag();
        // A drag that never left fullscreen has no width to commit, and one
        // that left it on its last frame already committed the same value.
        if (!fullscreen && !committed) onResize?.(nextWidth);
        settleLayout();
      }

      stopDragRef.current = stopDrag;
      document.body.classList.add(styles.resizingCursor);
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    },
    [isFullscreen, onResize, onRequestFullscreen, onExitFullscreen],
  );

  if (!isVisible) return null;

  return (
    <div
      ref={panelRef}
      className={classNames("chat-panel", styles.chatPanel)}
      id="ChatPanelWrapper"
      style={
        isDockedResize && width
          ? ({ "--chat-panel-width": `${width}px` } as React.CSSProperties)
          : undefined
      }
    >
      {canResize ? (
        <div
          role="presentation"
          className={classNames(styles.chatPanelResizer, "not-selectable")}
          onMouseDown={onResizerMouseDown}
          data-testid="chat-panel-resizer"
        />
      ) : null}
      {children}
      {dropTargetLabel ? (
        <div className={styles.chatPanelDropOverlay}>
          <Text className={styles.chatPanelDropText} noSelect>
            {dropTargetLabel}
          </Text>
        </div>
      ) : null}
    </div>
  );
};

export default ChatPanel;
