"use client";

import React from "react";

import AiChatStore from "./AiChatStore";

const AiChatStoreContext = React.createContext<AiChatStore | null>(null);

export const AiChatStoreProvider = ({
  store: hostStore,
  children,
}: {
  /**
   * Use this instance instead of creating one. `AiAgentProviders` passes the
   * store it built in its own body: the analyze mode lives on this store, and
   * the provider body — which assembles the widget config, the attachment cap
   * and the chips off that mode — sits above this provider and could not read
   * it through the context.
   */
  store?: AiChatStore;
  children: React.ReactNode;
}) => {
  const ownStore = React.useMemo(() => new AiChatStore(), []);
  const store = hostStore ?? ownStore;
  return (
    <AiChatStoreContext.Provider value={store}>
      {children}
    </AiChatStoreContext.Provider>
  );
};

export const useAiChatStore = () => {
  const store = React.useContext(AiChatStoreContext);
  if (!store) {
    throw new Error(
      "useAiChatStore must be used within an AiChatStoreProvider",
    );
  }
  return store;
};

// Null-safe variant for hooks with an `enabled` opt-out: sections without the
// provider (e.g. private rooms) must be able to call them without throwing.
export const useAiChatStoreOptional = (): AiChatStore | null =>
  React.useContext(AiChatStoreContext);
