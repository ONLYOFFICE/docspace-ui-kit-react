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

  // A preset opens a fresh conversation with its rooms connected and its
  // model picked. The skills rooms are also handed to the host's
  // `contextRoom` by the host itself, so ContextRoomSync keeps them when the
  // pane mounts; the knowledge bases and the model have no such sync and
  // are set here.
  useEffect(
    () =>
      reaction(
        () => store.pendingPreset,
        (preset) => {
          if (!preset) return;
          const fresh = store.pendingPresetFresh;
          if (fresh) {
            stores.useThreadsStore
              .getState()
              .onSwitchToNewThread({ keepSessionProfile: true });
          }
          const clouds = stores.useCloudsStore.getState();
          // The rooms of a preset share one cloud (the portal); a mixed
          // list is connected one room at a time.
          const connect = (
            rooms: typeof preset.contextRooms,
            replace: (
              cloud: string,
              list: { id: string; name: string }[],
            ) => void,
            add: (cloud: string, room: { id: string; name: string }) => void,
            clear: () => void,
          ) => {
            const clouds = new Set(rooms.map((room) => room.cloud));
            if (clouds.size <= 1) {
              const cloud = rooms[0]?.cloud;
              if (cloud)
                replace(
                  cloud,
                  rooms.map(({ id, name }) => ({ id, name })),
                );
              else clear();
              return;
            }
            clear();
            for (const { cloud, id, name } of rooms) add(cloud, { id, name });
          };
          connect(
            preset.contextRooms,
            clouds.selectContextFolders,
            clouds.selectContextFolder,
            clouds.clearContextFolder,
          );
          connect(
            preset.knowledgeRooms,
            clouds.selectKnowledgeFolders,
            clouds.selectKnowledgeFolder,
            clouds.clearKnowledgeFolder,
          );
          // A preset holds no context folder: a fresh conversation starts
          // without one, whatever the previous chat had connected; applied in
          // place, the chat keeps the folder the user connected.
          if (fresh) clouds.clearFolderContext();
          // The model is looked up among the loaded profiles: opened before
          // they arrive (a deep link to the projects page), the lookup would
          // miss and the chat would fall back to the default model, so the
          // load is awaited first. `init` shares one request in flight.
          const applyProfile = () => {
            const profiles = stores.useProfilesStore.getState();
            const profile = preset.profileId
              ? profiles.getProfileById(preset.profileId)
              : null;
            profiles.setSessionChatProfile(profile);
          };
          const { initialized, init } = stores.useProfilesStore.getState();
          if (preset.profileId && !initialized) void init().then(applyProfile);
          else applyProfile();
          store.consumePendingPreset();
        },
      ),
    [store, stores],
  );

  // A folder connected through the Context slot belongs to the page that
  // offers the slot: once the host switches the slot off, the folder would
  // keep scoping every round with nothing on screen to show or remove it.
  useEffect(
    () =>
      reaction(
        () => store.folderContextPickerEnabled,
        (enabled) => {
          if (!enabled) stores.useCloudsStore.getState().clearFolderContext();
        },
      ),
    [store, stores],
  );

  return null;
};

export default AiChatStoresBridge;
