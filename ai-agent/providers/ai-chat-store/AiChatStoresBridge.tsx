"use client";

import { useEffect } from "react";
import { reaction } from "mobx";

import { useStores } from "@onlyoffice/ai-chat";

import { dropAnalyzeAttachment } from "../files/form-attachments";
import { useAnalyzeLock } from "../files/use-analyze-lock";

import { endAnalyzeOnChipRemoval, watchAnalyzeClose } from "./AiChatStore";
import { useAiChatStore } from "./AiChatStoreProvider";

// Sole Zustand → MobX sync point. Mirrors upstream router page and
// profiles presence into AiChatStore so every consumer can derive
// fullscreen/header state through computed getters on a single
// observable store.
//
// Mounted inside <AiAgentProviders> (which owns <StoresProvider>).
const AiChatStoresBridge = () => {
  const store = useAiChatStore();
  const stores = useStores();
  const currentPage = stores.useRouter((s) => s.currentPage);
  const profiles = stores.useProfilesStore((s) => s.profiles);
  const initialized = stores.useProfilesStore((s) => s.initialized);

  useEffect(() => {
    store.setCurrentPage(currentPage);
  }, [store, currentPage]);

  useEffect(() => {
    // A rebuilt store bundle (entity/scope switch) starts with an empty,
    // not-yet-hydrated profiles list. Mirroring that would flap
    // hasProfiles to false and blink every gated UI across the app, so the
    // last known value is kept until hydration completes.
    if (!initialized) return;
    store.setHasProfiles(profiles.length > 0);
  }, [store, profiles, initialized]);

  const hasAnalyzeChip = useAnalyzeLock(stores.useAttachmentsStore);

  useEffect(() => {
    endAnalyzeOnChipRemoval(store, hasAnalyzeChip);
  }, [store, hasAnalyzeChip]);

  useEffect(
    () =>
      // Closing the chat ends the analyze mode, and the form it attached goes
      // with it — the rest of the draft is left alone.
      watchAnalyzeClose(store, (phase) =>
        dropAnalyzeAttachment(stores.useAttachmentsStore, {
          inFlight: phase === "attaching",
        }),
      ),
    [store, stores],
  );

  useEffect(
    () =>
      // `useOpenAiChat` opens the panel by setting `pendingNewChat` on the
      // MobX store alone (so a section without this provider can call it as a
      // no-op). The actual thread reset needs the lib stores, which live here,
      // so it is performed on this side when the flag is raised.
      reaction(
        () => store.pendingNewChat,
        (pending) => {
          if (!pending) return;
          stores.useThreadsStore.getState().onSwitchToNewThread();
          store.consumePendingNewChat();
        },
      ),
    [store, stores],
  );

  return null;
};

export default AiChatStoresBridge;
