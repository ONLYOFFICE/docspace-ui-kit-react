"use client";

import React from "react";

import { useAiChatStoreOptional } from "../../providers/ai-chat-store";

import AiChatTrigger from "../components/ai-chat-trigger";
import AiChatPanelHeaderContainer from "../components/ai-chat-panel-header-container";
import AiChatPanelBody, {
  type AiChatPanelBodyProps,
} from "../components/ai-chat-panel-body";

// Everything a host layout needs to mount the AI chat panel: the header trigger
// button, the panel content (header + body), and the reactive visibility/
// fullscreen state. Section-agnostic — it reads only the shared AiChatStore, so
// any product surface (Personal Files, Rooms, …) consumes the same bindings.
// Cross-panel coordination (e.g. closing a host info panel) is intentionally
// left to the host, which owns those stores.
export type AiChatPanelBindings = {
  isChatPanelVisible: boolean;
  isChatPanelFullscreen: boolean;
  // Docked width driven by the panel's edge resizer, and its setter. Session
  // state: it lives in the store and resets to the default on every open, so
  // hosts pass it straight to Section without persisting anything.
  chatPanelWidth: number;
  setChatPanelWidth: (value: number) => void;
  // Explicit on/off rather than a toggle: the edge resizer reaches for them
  // from a known state — fullscreen on when the widening drag is pushed past
  // the widest docked width, off when it is dragged back inwards.
  setChatPanelFullscreen: () => void;
  unsetChatPanelFullscreen: () => void;
  chatButton: React.ReactNode;
  chatPanelContent: React.ReactNode;
  closeChatPanel: () => void;
};

// `enabled` lets a section opt out (e.g. private rooms) without a conditional
// hook call: every hook (here just `useAiChatStoreOptional`) runs unconditionally
// before the guard, so the early `undefined` return is not a Rules-of-Hooks
// violation — the hook order never changes. The overloads keep callers that always enable AI
// (default / `true`) free of an undefined check, while a dynamic boolean widens
// the result to `| undefined`. Consumers must be `observer`s so the returned
// visibility/fullscreen flags stay reactive.
//
// INVARIANT: `enabled` must be stable for the component's lifetime (it is always
// derived from a per-route value like `isPrivate`). Flipping it after mount is
// unsupported — the panel/button would mount or unmount mid-session, which no
// host currently does.
//
// `chatProps` is optional on purpose. A host that can route the user to portal
// AI settings (the DocSpace client) passes them and gets the branded
// not-available empty view; a host that cannot (the embedded sdk layouts) omits
// them and the panel falls back to the chat widget's own setup screen, which
// configures an AI profile in place.
export function useAiChatPanel(
  enabled?: true,
  chatProps?: AiChatPanelBodyProps,
): AiChatPanelBindings;
export function useAiChatPanel(
  enabled: boolean,
  chatProps?: AiChatPanelBodyProps,
): AiChatPanelBindings | undefined;
export function useAiChatPanel(
  enabled = true,
  chatProps?: AiChatPanelBodyProps,
): AiChatPanelBindings | undefined {
  // Null-safe read: with `enabled=false` the section may not mount the
  // provider at all (private rooms), and the hook must not throw.
  const aiChatStore = useAiChatStoreOptional();

  if (!enabled) return undefined;

  if (!aiChatStore) {
    throw new Error(
      "useAiChatPanel requires an AiChatStoreProvider when enabled",
    );
  }

  return {
    isChatPanelVisible: aiChatStore.isVisible,
    isChatPanelFullscreen: aiChatStore.effectiveFullscreen,
    chatPanelWidth: aiChatStore.panelWidth,
    setChatPanelWidth: aiChatStore.setPanelWidth,
    setChatPanelFullscreen: () => aiChatStore.setFullscreen(true),
    unsetChatPanelFullscreen: () => aiChatStore.setFullscreen(false),
    chatButton: <AiChatTrigger />,
    chatPanelContent: (
      <>
        <AiChatPanelHeaderContainer />
        <AiChatPanelBody {...chatProps} />
      </>
    ),
    closeChatPanel: () => aiChatStore.close(),
  };
}
