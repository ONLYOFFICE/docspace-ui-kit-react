"use client";

import React from "react";

import { useAiChatStoreOptional } from "../../providers/ai-chat-store";

/**
 * Opens the AI chat panel, always starting a fresh conversation when the
 * panel was closed (new empty thread + cleared messages). Opening a panel
 * that is already visible leaves the current thread untouched — so flows
 * that drop something into an *open* chat (e.g. "Ask AI") keep the ongoing
 * conversation instead of resetting it.
 *
 * Null-safe: sections that render without an AiChatStoreProvider (e.g. a
 * public room opened by an anonymous user, where the chat is never mounted)
 * get a no-op opener instead of a thrown "must be used within a provider"
 * (Bug 83210). The thread reset lives on AiChatStore/AiChatStoresBridge, so
 * this hook depends only on the null-safe chat store — never the library's
 * throwing `useStores`.
 */
export const useOpenAiChat = () => {
  const aiChatStore = useAiChatStoreOptional();

  return React.useCallback(() => {
    aiChatStore?.openNewChat();
  }, [aiChatStore]);
};
