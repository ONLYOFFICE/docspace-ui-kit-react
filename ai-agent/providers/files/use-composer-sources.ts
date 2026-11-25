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

/**
 * The rows of the chat "+" menu's Knowledge bases and Data sources lists, as
 * DocSpace builds them (the Skill sets entry opens the chat's own skill
 * list, see `WidgetConfig.composerSkillList`). Each list is flat: one row per
 * connected source, with no tick (only connected ones are listed) and a
 * trailing "Remove <name>" control that disconnects it and keeps the menu
 * open, then, right under the rows and with no separator, its own "Manage
 * ..." row in the link colour with a gear.
 *
 * - Knowledge bases: the Knowledge rooms connected to the chat; a click on
 *   one opens it in Files, and "Manage knowledge bases..." opens the room
 *   selector. While knowledge search is off on the portal no base can be
 *   picked: the list keeps the bases connected earlier, still removable,
 *   has no "Manage" row, and with none connected it is empty, which drops
 *   the entry.
 * - Data sources: the folders and rooms connected as the chat's context,
 *   a room with the room icon and a folder with the folder icon, and
 *   "Manage sources..." to connect one more until the library's limit.
 *
 * Inside an agent its knowledge bases are its settings: the bin of a row
 * unlinks the base from the agent (`sourcesManager.onKnowledgeRoomRemove`)
 * and "Manage knowledge bases..." opens the host's selector of the agent's
 * knowledge bases (`sourcesManager.onManage("knowledge")`); a user who may
 * not change the agent gets neither. The data sources stay the user's own there.
 */
export const useComposerSourceLists = ({
  useCloudsStore,
  onPickKnowledgeRooms,
  onOpenContextRoom,
  onAddContextFolder,
  knowledgePickerHidden,
  sourcesManager,
}: {
  useCloudsStore: CloudsStore;
  onPickKnowledgeRooms: () => void;
  onOpenContextRoom: (
    cloud: string,
    room: { id: string; name: string },
  ) => void;
  onAddContextFolder: () => void;
  knowledgePickerHidden: boolean;
  /**
   * Set inside an agent, whose knowledge bases are its settings:
   * "Manage knowledge bases..." opens those settings (`onManage`) and a
   * row's bin unlinks its base from the agent (`onKnowledgeRoomRemove`);
   * each is left out when the user may not change them. `null` for an
   * ordinary chat, which picks its own rooms.
   */
  sourcesManager?: {
    onManage: ((kind: "skills" | "knowledge") => void) | null;
    onKnowledgeRoomRemove?: (roomId: string) => void;
  } | null;
}): {
  composerKnowledge: ComposerMenuItem[];
  composerDataSources: ComposerMenuItem[];
} => {
  const { t, i18n } = useTranslation(["Common"]);
  const knowledgeRooms = useCloudsStore((s) => s.selectedKnowledgeFolders);
  const deselectKnowledgeFolder = useCloudsStore(
    (s) => s.deselectKnowledgeFolder,
  );
  const contextFolders = useCloudsStore((s) => s.selectedFolderContexts);
  const deselectFolderContext = useCloudsStore((s) => s.deselectFolderContext);

  // The labels are ours, so the rows are rebuilt on a language change.
  const removeAction = React.useCallback(
    (
      name: string,
      onClick: () => void,
    ): ComposerMenuItem["trailingAction"] => ({
      icon: "btn-remove",
      label: t("Common:RemoveSource", {
        name,
        defaultValue: "Remove {{name}}",
      }),
      onClick,
    }),
    [t, i18n.language],
  );

  const manage = sourcesManager?.onManage ?? null;
  const onManageOwned = React.useMemo(
    () => (manage ? () => manage("knowledge") : null),
    [manage],
  );
  const owned = !!sourcesManager;
  const removeOwned = sourcesManager?.onKnowledgeRoomRemove ?? null;

  const composerKnowledge = React.useMemo(() => {
    const rows = knowledgeRooms
      .filter((item) => item.cloud === CONTEXT_ROOM_CLOUD)
      .map(({ cloud, room }): ComposerMenuItem => ({
        id: `knowledge-room:${room.id}`,
        text: room.name,
        icon: "btn-room",
        onClick: () => onOpenContextRoom(cloud, room),
        trailingAction: owned
          ? removeOwned
            ? removeAction(room.name, () => removeOwned(room.id))
            : undefined
          : removeAction(room.name, () =>
              deselectKnowledgeFolder(cloud, room.id),
            ),
      }));
    // No base can be picked while knowledge search is off, not even
    // through the agent's selector.
    const onManage = knowledgePickerHidden
      ? null
      : owned
        ? onManageOwned
        : onPickKnowledgeRooms;
    if (!onManage) return rows;
    return [
      ...rows,
      {
        id: "knowledge-manage",
        text: t("Common:ManageKnowledgeBases", {
          defaultValue: "Manage knowledge bases...",
        }),
        icon: "btn-gear",
        tone: "link",
        onClick: onManage,
      } satisfies ComposerMenuItem,
    ];
  }, [
    knowledgeRooms,
    knowledgePickerHidden,
    owned,
    removeOwned,
    onManageOwned,
    onPickKnowledgeRooms,
    onOpenContextRoom,
    deselectKnowledgeFolder,
    removeAction,
    t,
    i18n.language,
  ]);

  // Data sources: the folders and rooms the user connected as the chat's
  // context - any of the portal, several at once, each removed from its
  // own row; "Manage sources..." connects one more until the limit.
  const composerDataSources = React.useMemo(() => {
    const rows = contextFolders
      .filter((item) => item.cloud === CONTEXT_ROOM_CLOUD)
      .map(({ cloud, room }): ComposerMenuItem => ({
        id: `data-source:${room.id}`,
        text: room.name,
        // A source picked before the kind was recorded is a folder.
        icon: room.kind === "room" ? "btn-room" : "source-context",
        trailingAction: removeAction(room.name, () =>
          deselectFolderContext(cloud, room.id),
        ),
      }));
    if (rows.length >= FOLDER_CONTEXTS_LIMIT) return rows;
    return [
      ...rows,
      {
        id: "data-source-manage",
        text: t("Common:ManageSources", { defaultValue: "Manage sources..." }),
        icon: "btn-gear",
        tone: "link",
        onClick: onAddContextFolder,
      } satisfies ComposerMenuItem,
    ];
  }, [
    contextFolders,
    deselectFolderContext,
    onAddContextFolder,
    removeAction,
    t,
    i18n.language,
  ]);

  return { composerKnowledge, composerDataSources };
};
