"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { FilterType, FolderType } from "@onlyoffice/docspace-api-sdk";
import {
  FOLDER_CONTEXTS_LIMIT,
  useStores,
  type ContextRoom,
  type ContextRoomKind,
} from "@onlyoffice/ai-chat";

import FilesSelector from "../../../selectors/Files";
import type { TBreadCrumb, TSelectorItem } from "../../../components/selector";
import useGetIcon from "../../hooks/useGetIcon";

import { CONTEXT_ROOM_CLOUD } from "../context-room/ContextRoomSync";
import useDeviceType from "./use-device-type";

type ContextFolderDialogProps = {
  onClose: () => void;
  /**
   * What the pick does to the chat's context folders: `"replace"` (default)
   * makes the folder the only one, as an AI project's Folder card does;
   * `"add"` connects it next to the others, as the chat's Data sources do
   * (the chat library holds the limit) - and lets several be ticked at once;
   * with none ticked it connects the folder or the section the user stands
   * in.
   */
  mode?: "replace" | "add";
  /**
   * The Rooms section is offered. A host passes `false` while the section is
   * switched off in Settings -> Apps: a room nobody can open is no place to
   * pick. Shown by default.
   */
  withRoomsTreeFolder?: boolean;
};

/**
 * Whether a picked entry is a room or a folder, for the chat to draw its
 * icon and word its remove control by: the selector marks a room, as a row
 * and as a crumb, with its room type.
 */
const kindOf = (
  entry: TSelectorItem | TBreadCrumb | undefined,
): ContextRoomKind =>
  entry && "roomType" in entry && entry.roomType != null ? "room" : "folder";

// The folder picker of an AI project's Folder card and of the chat's Data
// sources: any folder of the portal, rooms and their subfolders included,
// handed to the chat library's clouds store as a context folder of the
// rounds. Rendered inside <AiAgentProviders> so
// `useStores()` resolves the store from the widget's context. The selector
// submits the folder the user is standing in, so the list shows folders
// only and the button is live as soon as the first level has loaded. In
// `"add"` mode the folders also carry checkboxes and the ticked ones, from
// any number of places, are the pick. With none ticked the pick is the place
// the user stands in - a folder, a room or a whole section such as Files,
// Rooms or Forms, which has no row to tick: the root lists the sections as
// places to open. The AI section is left
// out: its Instructions and Knowledge rooms are the chat's Skill sets and
// Knowledge bases, picked in lists of their own, not data sources.
const ContextFolderDialog: React.FC<ContextFolderDialogProps> = ({
  onClose,
  mode = "replace",
  withRoomsTreeFolder = true,
}) => {
  const { t } = useTranslation(["Common"]);
  const { currentDeviceType } = useDeviceType();
  const { getIcon } = useGetIcon();
  const { useCloudsStore } = useStores();

  const isAdd = mode === "add";
  // The folders ticked so far, by id, with the path each was ticked under
  // and whether it is a room.
  const pickedRef = React.useRef(new Map<string, ContextRoom>());
  const [pickedCount, setPickedCount] = React.useState(0);
  // How many more folders the chat takes; read once, when the dialog opens.
  const freeSlots = React.useMemo(
    () =>
      Math.max(
        FOLDER_CONTEXTS_LIMIT -
          (useCloudsStore.getState().selectedFolderContexts?.length ?? 0),
        0,
      ),
    [useCloudsStore],
  );

  const onFolderToggle = React.useCallback<
    NonNullable<React.ComponentProps<typeof FilesSelector>["onFolderToggle"]>
  >(
    (item: TSelectorItem, breadCrumbs) => {
      if (item.id === undefined || item.id === null || item.id === "") return;
      const picked = pickedRef.current;
      const id = String(item.id);
      if (item.isSelected) picked.delete(id);
      else if (picked.size < freeSlots) {
        const name = String(item.label ?? "");
        const crumbs = breadCrumbs
          .filter((crumb) => crumb.id !== "" && crumb.label)
          .map((crumb) => crumb.label);
        picked.set(id, {
          id,
          name,
          path: [...crumbs, name].join(" / "),
          kind: kindOf(item),
        });
      }
      setPickedCount(picked.size);
    },
    [freeSlots],
  );

  const onSubmit = React.useCallback<
    React.ComponentProps<typeof FilesSelector>["onSubmit"]
  >(
    (selectedItemId, folderTitle, _isPublic, breadCrumbs) => {
      const clouds = useCloudsStore.getState();
      if (isAdd && pickedRef.current.size > 0) {
        for (const folder of pickedRef.current.values())
          clouds.addFolderContext(CONTEXT_ROOM_CLOUD, folder);
        onClose();
        return;
      }
      if (isAdd && freeSlots === 0) return;
      // The selector opens on the virtual root, whose id is empty: that is
      // no folder to scope a round to.
      if (
        selectedItemId === undefined ||
        selectedItemId === null ||
        selectedItemId === ""
      )
        return;
      const name =
        folderTitle || breadCrumbs[breadCrumbs.length - 1]?.label || "";
      // Where the folder sits, for its pill: the crumbs above it, the
      // folder itself last. The virtual root crumb is not a place.
      const crumbs = breadCrumbs
        .filter((crumb) => crumb.id !== "" && crumb.label)
        .map((crumb) => crumb.label);
      if (crumbs[crumbs.length - 1] !== name) crumbs.push(String(name));
      // The open folder is the last crumb, which says whether it is a room.
      const openCrumb = breadCrumbs[breadCrumbs.length - 1];
      const folder: ContextRoom = {
        id: String(selectedItemId),
        name: String(name),
        path: crumbs.join(" / "),
        kind: kindOf(
          openCrumb && String(openCrumb.id) === String(selectedItemId)
            ? openCrumb
            : undefined,
        ),
      };
      // With nothing ticked the Data sources take the open place itself.
      if (isAdd) clouds.addFolderContext(CONTEXT_ROOM_CLOUD, folder);
      else clouds.selectFolderContext(CONTEXT_ROOM_CLOUD, folder);
      onClose();
    },
    [onClose, useCloudsStore, isAdd, freeSlots],
  );

  const getIsDisabled = React.useCallback<
    React.ComponentProps<typeof FilesSelector>["getIsDisabled"]
  >(
    (
      isFirstLoad,
      _isSelectedParentFolder,
      _selectedItemId,
      _itemType,
      isRoot,
      // Ticked folders are a pick wherever the user stands; with none
      // ticked the open place is, anywhere but the root - unless the chat
      // has no room for one more.
    ) =>
      isFirstLoad ||
      (isAdd && pickedCount > 0 ? false : isRoot || (isAdd && freeSlots === 0)),
    [isAdd, pickedCount, freeSlots],
  );

  return (
    <FilesSelector
      isPanelVisible
      openRoot
      withRecentTreeFolder={false}
      withFavoritesTreeFolder={false}
      withAIRoomsTreeFolder={false}
      withRoomsTreeFolder={withRoomsTreeFolder}
      isRoomsOnly={false}
      isThirdParty={false}
      withCreate={false}
      // A title and a close button of its own, as the product's other
      // selectors have: without them the root crumb stands in the title's
      // place. Several folders can be ticked for the Data sources.
      withHeader
      headerProps={{
        headerLabel: isAdd
          ? t("Common:SelectAction", { defaultValue: "Select" })
          : t("Common:SelectFolder", { defaultValue: "Select folder" }),
        onCloseClick: onClose,
        isCloseable: true,
      }}
      withSearch
      withBreadCrumbs
      withoutBackButton
      withCancelButton
      withFooterInput={false}
      withFooterCheckbox={false}
      isMultiSelect={isAdd}
      withFolderSelection={isAdd}
      maxSelectedItems={isAdd ? freeSlots : undefined}
      onFolderToggle={onFolderToggle}
      onCancel={onClose}
      onSubmit={onSubmit}
      getIcon={getIcon}
      getIsDisabled={getIsDisabled}
      currentFolderId=""
      rootFolderType={FolderType.USER}
      disabledItems={[]}
      filterParam={FilterType.FoldersOnly}
      submitButtonLabel={t("Common:SelectAction", { defaultValue: "Select" })}
      cancelButtonLabel={t("Common:CancelButton", { defaultValue: "Cancel" })}
      descriptionText=""
      footerCheckboxLabel=""
      footerInputHeader=""
      currentFooterInputValue=""
      getFilesArchiveError={() => ""}
      currentDeviceType={currentDeviceType}
    />
  );
};

export default ContextFolderDialog;
