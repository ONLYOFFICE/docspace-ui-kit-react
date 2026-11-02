"use client";

import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";

import { useStores } from "@onlyoffice/ai-chat";

import { IconButton } from "../../../../components/icon-button";

import { useAiChatStore } from "../../../providers/ai-chat-store";
import type { AiChatPresetRoom } from "../../../providers/ai-chat-store";

import SaveIcon from "../../../../assets/icons/17/save.react.svg";

/**
 * The panel header's save button: hands the chat's current settings — the
 * model, the skills room and the knowledge base — to the host's
 * `AiChatStore.onSavePreset`, which keeps them as a named preset. Rendered
 * only while the host has wired that hook.
 */
const AiChatPanelSave = observer(() => {
  const { t } = useTranslation(["Common"]);
  const store = useAiChatStore();
  const { useCloudsStore, useProfilesStore, selectCurrentChatProfile } =
    useStores();

  // The model the composer's picker shows: the session pick, else the
  // chat's, else the default one — a chat never touched still runs on a
  // model, and that is the one to save.
  const profile = useProfilesStore(selectCurrentChatProfile);
  const contextFolders = useCloudsStore((s) => s.selectedContextFolders);
  const knowledgeFolders = useCloudsStore((s) => s.selectedKnowledgeFolders);

  if (!store.onSavePreset) return null;

  const asPresetRoom = (selected: {
    cloud: string;
    room: { id: string; name: string };
  }): AiChatPresetRoom => ({
    cloud: selected.cloud,
    id: selected.room.id,
    name: selected.room.name,
  });

  const onClick = () => {
    // A picked agent shows its profile under the agent's name; the project
    // stores the model, so the name comes from the profile itself.
    const model = profile
      ? (useProfilesStore.getState().getProfileById(profile.id) ?? profile)
      : null;
    store.onSavePreset?.({
      profileId: model?.id ?? null,
      profileName: model?.name ?? null,
      contextRooms: contextFolders.map(asPresetRoom),
      knowledgeRooms: knowledgeFolders.map(asPresetRoom),
    });
  };

  return (
    <IconButton
      iconNode={<SaveIcon />}
      size={17}
      // A stroked glyph in its own grey, like the fullscreen and close
      // icons beside it: the default fill recolor would paint the outline
      // shut and in a dimmer grey.
      isFill={false}
      onClick={onClick}
      tooltipId="ai-chat-panel-save-tooltip"
      tooltipContent={t("Common:SaveAIProject", {
        defaultValue: "Save as AI project",
      })}
      dataTestId="ai-chat-panel-save"
    />
  );
});

export default AiChatPanelSave;
