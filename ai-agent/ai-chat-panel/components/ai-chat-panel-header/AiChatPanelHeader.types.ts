import type React from "react";

export type AiChatPanelHeaderProps = {
  title?: React.ReactNode;
  /** Optional id forwarded to the title element so the parent Aside can wire `aria-labelledby`. */
  titleId?: string;
  /** Slot rendered next to the title (e.g. "Chat history", "+ New chat" actions). */
  extras?: React.ReactNode;
  /** Slot rendered before the fullscreen toggle / close pair. */
  rightExtras?: React.ReactNode;

  isFullscreen?: boolean;
  /** When omitted, the fullscreen toggle is not rendered. */
  onToggleFullscreen?: () => void;
  /** When omitted, the close button is not rendered. */
  onClose?: () => void;

  enterFullscreenTooltip?: string;
  exitFullscreenTooltip?: string;
  closeTooltip?: string;

  className?: string;
};
