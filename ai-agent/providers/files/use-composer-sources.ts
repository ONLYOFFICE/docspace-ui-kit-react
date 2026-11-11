"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import type { ComposerMenuItem, useStores } from "@onlyoffice/ai-chat";

import { CONTEXT_ROOM_CLOUD } from "../context-room/ContextRoomSync";

type CloudsStore = ReturnType<typeof useStores>["useCloudsStore"];
type ConnectedRoom = { cloud: string; room: { id: string; name: string } };

/**
 * The rows of the chat "+" menu's Skill sets and Knowledge bases submenus,
 * as DocSpace builds them: the Instructions or Knowledge rooms connected to
 * the chat, ticked — a click opens the room in Files — and below them
 * "Manage", the room selector that connects and disconnects them.
 *
 * While knowledge search is off on the portal no knowledge base can be
 * picked: the Knowledge bases list keeps the bases connected earlier and
 * offers "Disconnect" in place of "Manage", and with none connected it is
 * empty, which drops the row.
 */
export const useComposerSourceLists = ({
  useCloudsStore,
  onPickContextRooms,
  onPickKnowledgeRooms,
  onOpenContextRoom,
  knowledgePickerHidden,
}: {
  useCloudsStore: CloudsStore;
  onPickContextRooms: () => void;
  onPickKnowledgeRooms: () => void;
  onOpenContextRoom: (
    cloud: string,
    room: { id: string; name: string },
  ) => void;
  knowledgePickerHidden: boolean;
}): {
  composerSkills: ComposerMenuItem[];
  composerKnowledge: ComposerMenuItem[];
} => {
  const { t, i18n } = useTranslation(["Common"]);
  const skillsRooms = useCloudsStore((s) => s.selectedContextFolders);
  const knowledgeRooms = useCloudsStore((s) => s.selectedKnowledgeFolders);
  const clearKnowledgeFolder = useCloudsStore((s) => s.clearKnowledgeFolder);

  const build = React.useCallback(
    (
      kind: "skills" | "knowledge",
      connected: ConnectedRoom[],
      footer: ComposerMenuItem,
    ): ComposerMenuItem[] => {
      const rooms = connected
        .filter((item) => item.cloud === CONTEXT_ROOM_CLOUD)
        .map(({ cloud, room }): ComposerMenuItem => ({
          id: `${kind}-room:${room.id}`,
          text: room.name,
          icon: "btn-room",
          checked: true,
          onClick: () => onOpenContextRoom(cloud, room),
        }));
      return [
        ...rooms,
        ...(rooms.length > 0
          ? [{ id: `${kind}-separator`, text: "", isSeparator: true }]
          : []),
        footer,
      ];
    },
    [onOpenContextRoom],
  );

  // The labels are ours, so the rows are rebuilt on a language change.
  const manage = React.useCallback(
    (kind: "skills" | "knowledge", onClick: () => void): ComposerMenuItem => ({
      id: `${kind}-manage`,
      text: t("Common:Manage", { defaultValue: "Manage" }),
      icon: "btn-settings",
      onClick,
    }),
    [t, i18n.language],
  );

  const composerSkills = React.useMemo(
    () => build("skills", skillsRooms, manage("skills", onPickContextRooms)),
    [build, manage, skillsRooms, onPickContextRooms],
  );
  const composerKnowledge = React.useMemo(() => {
    if (!knowledgePickerHidden) {
      return build(
        "knowledge",
        knowledgeRooms,
        manage("knowledge", onPickKnowledgeRooms),
      );
    }
    const connected = knowledgeRooms.some(
      (item) => item.cloud === CONTEXT_ROOM_CLOUD,
    );
    return connected
      ? build("knowledge", knowledgeRooms, {
          id: "knowledge-disconnect",
          text: t("Common:Disconnect", { defaultValue: "Disconnect" }),
          icon: "btn-close",
          onClick: clearKnowledgeFolder,
        })
      : [];
  }, [
    build,
    manage,
    t,
    knowledgeRooms,
    onPickKnowledgeRooms,
    knowledgePickerHidden,
    clearKnowledgeFolder,
  ]);

  return { composerSkills, composerKnowledge };
};
