"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import {
  FOLDER_CONTEXTS_LIMIT,
  type ComposerMenuItem,
  type useStores,
} from "@onlyoffice/ai-chat";

import { CONTEXT_ROOM_CLOUD } from "../context-room/ContextRoomSync";

type CloudsStore = ReturnType<typeof useStores>["useCloudsStore"];
type ConnectedRoom = { cloud: string; room: { id: string; name: string } };

/**
 * The rows of the chat "+" menu's Skill sets and Knowledge bases submenus,
 * as DocSpace builds them: the Instructions or Knowledge rooms connected to
 * the chat, ticked — a click opens the room in Files — and below them
 * "Manage sources", the room selector that connects and disconnects them.
 *
 * While knowledge search is off on the portal no knowledge base can be
 * picked: the Knowledge bases list keeps the bases connected earlier and
 * offers "Disconnect" in place of "Manage sources", and with none connected it is
 * empty, which drops the row.
 */
export const useComposerSourceLists = ({
  useCloudsStore,
  onPickContextRooms,
  onPickKnowledgeRooms,
  onOpenContextRoom,
  onAddContextFolder,
  knowledgePickerHidden,
  sourcesManager,
}: {
  useCloudsStore: CloudsStore;
  onPickContextRooms: () => void;
  onPickKnowledgeRooms: () => void;
  onOpenContextRoom: (
    cloud: string,
    room: { id: string; name: string },
  ) => void;
  onAddContextFolder: () => void;
  knowledgePickerHidden: boolean;
  /**
   * Set inside an AI project, whose rooms are its settings: "Manage sources"
   * opens those settings (`onManage`), or is left out when the user may not
   * change them. `null` for an ordinary chat, which picks its own rooms.
   */
  sourcesManager?: { onManage: (() => void) | null } | null;
}): {
  composerSkills: ComposerMenuItem[];
  composerKnowledge: ComposerMenuItem[];
  composerDataSources: ComposerMenuItem[];
} => {
  const { t, i18n } = useTranslation(["Common"]);
  const skillsRooms = useCloudsStore((s) => s.selectedContextFolders);
  const knowledgeRooms = useCloudsStore((s) => s.selectedKnowledgeFolders);
  const clearKnowledgeFolder = useCloudsStore((s) => s.clearKnowledgeFolder);
  const contextFolders = useCloudsStore((s) => s.selectedFolderContexts);
  const deselectFolderContext = useCloudsStore((s) => s.deselectFolderContext);

  const build = React.useCallback(
    (
      kind: "skills" | "knowledge",
      connected: ConnectedRoom[],
      footer: ComposerMenuItem | null,
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
      if (!footer) return rooms;
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
      text: t("Common:ManageSources", { defaultValue: "Manage sources" }),
      icon: "btn-settings",
      onClick,
    }),
    [t, i18n.language],
  );

  const onManageOwned = sourcesManager?.onManage ?? null;
  const owned = !!sourcesManager;

  const composerSkills = React.useMemo(() => {
    if (owned)
      return build(
        "skills",
        skillsRooms,
        onManageOwned ? manage("skills", onManageOwned) : null,
      );
    return build("skills", skillsRooms, manage("skills", onPickContextRooms));
  }, [build, manage, skillsRooms, onPickContextRooms, owned, onManageOwned]);
  const composerKnowledge = React.useMemo(() => {
    if (owned)
      return build(
        "knowledge",
        knowledgeRooms,
        onManageOwned ? manage("knowledge", onManageOwned) : null,
      );
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
    owned,
    onManageOwned,
  ]);

  // Data sources: the folders and rooms the user connected as the chat's
  // context - any of the portal, several at once. Each opens a second level
  // with its way out; "Add folder" connects one more until the limit.
  const composerDataSources = React.useMemo(() => {
    const folders = contextFolders
      .filter((item) => item.cloud === CONTEXT_ROOM_CLOUD)
      .map(({ cloud, room }): ComposerMenuItem => ({
        id: `data-source:${room.id}`,
        text: room.name,
        icon: "source-context",
        checked: true,
        items: [
          {
            id: `data-source-disconnect:${room.id}`,
            text: t("Common:Disconnect", { defaultValue: "Disconnect" }),
            icon: "btn-close",
            onClick: () => deselectFolderContext(cloud, room.id),
          },
        ],
      }));
    const rows: ComposerMenuItem[] = [...folders];
    if (folders.length < FOLDER_CONTEXTS_LIMIT) {
      if (folders.length > 0)
        rows.push({ id: "data-source-separator", text: "", isSeparator: true });
      rows.push({
        id: "data-source-add",
        text: t("Common:AIProjectAddFolder", { defaultValue: "Add folder" }),
        icon: "btn-settings",
        onClick: onAddContextFolder,
      });
    }
    return rows;
  }, [
    contextFolders,
    deselectFolderContext,
    onAddContextFolder,
    t,
    i18n.language,
  ]);

  return { composerSkills, composerKnowledge, composerDataSources };
};
