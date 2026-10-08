"use client";

import { useEffect } from "react";

import { useAiChatStore } from "./AiChatStoreProvider";

// Fallback mount used when the host does not provide `getAgentRoomId`
// (see providers/index.tsx). It is meant to derive/sync the chat room id from
// the current `store.agentId` so the chat targets the right room.
// TODO: implement the agentId -> roomId sync; the effect is intentionally empty
// scaffolding until the host-side room resolution is finalized.
const AgentRoomIdSync = () => {
  const store = useAiChatStore();

  useEffect(() => {
    // no-op: pending agentId -> roomId sync (see TODO above)
  }, [store, store.agentId]);

  return null;
};

export default AgentRoomIdSync;
