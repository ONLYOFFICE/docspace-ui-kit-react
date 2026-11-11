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
 * `composerKnowledge` stays unset while knowledge search is off on the
 * portal: the library's own list then offers only the way out for a base
 * connected earlier, and no row at all when there is none.
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
  composerKnowledge: ComposerMenuItem[] | undefined;
} => {
  const { t, i18n } = useTranslation(["Common"]);
  const skillsRooms = useCloudsStore((s) => s.selectedContextFolders);
  const knowledgeRooms = useCloudsStore((s) => s.selectedKnowledgeFolders);

  const build = React.useCallback(
    (
      kind: "skills" | "knowledge",
      connected: ConnectedRoom[],
      onManage: () => void,
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
        {
          id: `${kind}-manage`,
          text: t("Common:Manage", { defaultValue: "Manage" }),
          icon: "btn-settings",
          onClick: onManage,
        },
      ];
    },
    // The labels are ours, so the rows are rebuilt on a language change.
    [t, i18n.language, onOpenContextRoom],
  );

  const composerSkills = React.useMemo(
    () => build("skills", skillsRooms, onPickContextRooms),
    [build, skillsRooms, onPickContextRooms],
  );
  const composerKnowledge = React.useMemo(
    () =>
      knowledgePickerHidden
        ? undefined
        : build("knowledge", knowledgeRooms, onPickKnowledgeRooms),
    [build, knowledgeRooms, onPickKnowledgeRooms, knowledgePickerHidden],
  );

  return { composerSkills, composerKnowledge };
};
