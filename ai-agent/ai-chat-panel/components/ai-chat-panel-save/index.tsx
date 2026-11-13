"use client";

import { useStores } from "@onlyoffice/ai-chat";

import { useAiChatStore } from "../../../providers/ai-chat-store";
import type { AiChatPresetRoom } from "../../../providers/ai-chat-store";

/**
 * What "Save as new agent" in the panel title's menu does: hands the chat's
 * current settings — the model, the skills rooms and the knowledge bases —
 * to the host's `AiChatStore.onSavePreset`, which keeps them as a named
 * agent. `null` while the host has not wired that hook: nothing to offer.
 */
export const useSaveChatAsAgent = (): (() => void) | null => {
  const store = useAiChatStore();
  const { useCloudsStore, useProfilesStore, selectCurrentChatProfile } =
    useStores();

  // The model the composer's picker shows: the session pick, else the
  // chat's, else the default one — a chat never touched still runs on a
  // model, and that is the one to save.
  const profile = useProfilesStore(selectCurrentChatProfile);
  const contextFolders = useCloudsStore((s) => s.selectedContextFolders);
  const knowledgeFolders = useCloudsStore((s) => s.selectedKnowledgeFolders);

  // Read here, so an observer that calls the hook follows the host wiring
  // and unwiring it.
  const onSavePreset = store.onSavePreset;
  if (!onSavePreset) return null;

  const asPresetRoom = (selected: {
    cloud: string;
    room: { id: string; name: string };
  }): AiChatPresetRoom => ({
    cloud: selected.cloud,
    id: selected.room.id,
    name: selected.room.name,
  });

  return () => {
    // A picked agent shows its profile under the agent's name; the agent
    // stores the model, so the name comes from the profile itself.
    const model = profile
      ? (useProfilesStore.getState().getProfileById(profile.id) ?? profile)
      : null;
    onSavePreset({
      profileId: model?.id ?? null,
      profileName: model?.name ?? null,
      contextRooms: contextFolders.map(asPresetRoom),
      knowledgeRooms: knowledgeFolders.map(asPresetRoom),
    });
  };
};
