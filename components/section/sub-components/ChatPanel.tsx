import { useEffect } from "react";
import classNames from "classnames";

import { DeviceType } from "../../../enums";
import { Text } from "../../text";

import { useEdgeResizer } from "../hooks/useEdgeResizer";
import { ChatPanelProps } from "../Section.types";
import styles from "../Section.module.scss";

// The lower resize bound keeps the chat composer usable; the upper one is
// derived per drag from how much width the section can give up before its own
// content (table columns / tiles) stops fitting.
const MIN_CHAT_PANEL_WIDTH = 360;

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
  onShownWidthChange,
  isFullscreen,
  onRequestFullscreen,
  onExitFullscreen,
}: ChatPanelProps) => {
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

  const canResize = !!isResizable && currentDeviceType === DeviceType.desktop;

  const { panelRef, isDockedResize, shownWidth, onResizerPointerDown } =
    useEdgeResizer({
      isVisible,
      canResize,
      isFullscreen,
      cssVariable: "--chat-panel-width",
      minWidth: MIN_CHAT_PANEL_WIDTH,
      width,
      onResize,
      onRequestFullscreen,
      onExitFullscreen,
    });

  useEffect(() => {
    onShownWidthChange?.(shownWidth);
    return () => onShownWidthChange?.(undefined);
  }, [shownWidth, onShownWidthChange]);

  if (!isVisible) return null;

  return (
    <div
      ref={panelRef}
      className={classNames("chat-panel", styles.chatPanel)}
      id="ChatPanelWrapper"
      style={
        isDockedResize && shownWidth
          ? ({ "--chat-panel-width": `${shownWidth}px` } as React.CSSProperties)
          : undefined
      }
    >
      {canResize ? (
        <div
          role="presentation"
          className={classNames(styles.chatPanelResizer, "not-selectable")}
          onPointerDown={onResizerPointerDown}
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
