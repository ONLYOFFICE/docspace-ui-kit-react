"use client";

import React from "react";

import AiChatStore from "./AiChatStore";

const AiChatStoreContext = React.createContext<AiChatStore | null>(null);

export const AiChatStoreProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const store = React.useMemo(() => new AiChatStore(), []);
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
