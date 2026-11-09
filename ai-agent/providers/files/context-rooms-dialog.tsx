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

/**
 * The chat keeps room ids as strings while the selector lists the rooms
 * with the API's numeric ids, and ticks a row only on a strict match. A
 * connected room handed over as "12" is therefore shown unticked, and
 * picking it again sends it twice: once from the preselection and once
 * from the row. The id goes to the selector in the row's form.
 */
const toSelectorId = (id: string): string | number =>
  /^\d+$/.test(id) ? Number(id) : id;

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
          ({
            id: toSelectorId(item.room.id),
            label: item.room.name,
          }) as TSelectorItem,
      );
  }, [isKnowledge, useCloudsStore]);

  const onSubmit = React.useCallback(
    (items: TSelectorItem[]) => {
      const state = useCloudsStore.getState();
      // One entry per room, whatever form its id came in.
      const seen = new Set<string>();
      const rooms = items.flatMap((item) => {
        const id = String(item.id);
        if (seen.has(id)) return [];
        seen.add(id);
        return [{ id, name: String(item.label ?? "") }];
      });
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
