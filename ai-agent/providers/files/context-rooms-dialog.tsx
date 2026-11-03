"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { useStores } from "@onlyoffice/ai-chat";

import RoomSelector from "../../../selectors/Room";
import type { TSelectorItem } from "../../../components/selector";
import { RoomsType } from "../../../enums";

import { CONTEXT_ROOM_CLOUD } from "../context-room/ContextRoomSync";

/** Which composer slot the picker serves: the skills or the knowledge bases. */
export type ContextRoomsKind = "skills" | "knowledge";

type ContextRoomsDialogProps = {
  kind: ContextRoomsKind;
  onClose: () => void;
};

/**
 * The picker behind the composer's Instructions and Knowledge slots: the
 * rooms of that type the user can read, several at once, the connected ones
 * ticked and listed first — the selector an AI project's dialog uses. The
 * pick replaces the chat's skills rooms or knowledge bases; an empty pick
 * disconnects them all.
 */
const ContextRoomsDialog: React.FC<ContextRoomsDialogProps> = ({
  kind,
  onClose,
}) => {
  const { t } = useTranslation(["Common"]);
  const { useCloudsStore } = useStores();
  const isKnowledge = kind === "knowledge";

  const selectedItems = React.useMemo(() => {
    const state = useCloudsStore.getState();
    return (
      isKnowledge
        ? state.selectedKnowledgeFolders
        : state.selectedContextFolders
    )
      .filter((item) => item.cloud === CONTEXT_ROOM_CLOUD)
      .map(
        (item) =>
          ({ id: item.room.id, label: item.room.name }) as TSelectorItem,
      );
  }, [isKnowledge, useCloudsStore]);

  const onSubmit = React.useCallback(
    (items: TSelectorItem[]) => {
      const state = useCloudsStore.getState();
      const rooms = items.map((item) => ({
        id: String(item.id),
        name: String(item.label ?? ""),
      }));
      if (isKnowledge) state.selectKnowledgeFolders(CONTEXT_ROOM_CLOUD, rooms);
      else state.selectContextFolders(CONTEXT_ROOM_CLOUD, rooms);
      onClose();
    },
    [isKnowledge, onClose, useCloudsStore],
  );

  return (
    <RoomSelector
      useAside
      onClose={onClose}
      isMultiSelect
      // Room rows come with `disableMultiSelect`; this overrules it, as the
      // AI project dialog does.
      forceIsMultiSelect
      roomType={
        isKnowledge ? RoomsType.KnowledgeRoom : RoomsType.InstructionsRoom
      }
      withSearch
      withHeader
      headerProps={{
        headerLabel: isKnowledge
          ? t("Common:AIProjectKnowledgeRooms", {
              defaultValue: "Knowledge bases",
            })
          : t("Common:InstructionsRooms", {
              defaultValue: "Instructions rooms",
            }),
        onCloseClick: onClose,
        isCloseable: true,
      }}
      withCancelButton
      cancelButtonLabel={t("Common:CancelButton", { defaultValue: "Cancel" })}
      onCancel={onClose}
      submitButtonLabel={t("Common:SelectAction", { defaultValue: "Select" })}
      selectedItems={selectedItems}
      sortSelectedFirst
      onSubmit={onSubmit}
    />
  );
};

export default ContextRoomsDialog;
