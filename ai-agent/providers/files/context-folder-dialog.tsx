"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { FilterType, FolderType } from "@onlyoffice/docspace-api-sdk";
import { FOLDER_CONTEXTS_LIMIT, useStores } from "@onlyoffice/ai-chat";

import FilesSelector from "../../../selectors/Files";
import type { TSelectorItem } from "../../../components/selector";
import useGetIcon from "../../hooks/useGetIcon";

import { CONTEXT_ROOM_CLOUD } from "../context-room/ContextRoomSync";
import useDeviceType from "./use-device-type";

type ContextFolderDialogProps = {
  onClose: () => void;
  /**
   * What the pick does to the chat's context folders: `"replace"` (default)
   * makes the folder the only one, as an AI project's Folder card does;
   * `"add"` connects it next to the others, as the chat's Data sources do
   * (the chat library holds the limit) - and lets several be ticked at once.
   */
  mode?: "replace" | "add";
};

// The folder picker of an AI project's Folder card and of the chat's Data
// sources: any folder of the portal, rooms and their subfolders included,
// handed to the chat library's clouds store as a context folder of the
// rounds. Rendered inside <AiAgentProviders> so
// `useStores()` resolves the store from the widget's context. The selector
// submits the folder the user is standing in, so the list shows folders
// only and the button is live as soon as the first level has loaded. In
// `"add"` mode the folders also carry checkboxes: the ticked ones, from any
// number of places, are all connected, and the open folder is the pick only
// while nothing is ticked.
const ContextFolderDialog: React.FC<ContextFolderDialogProps> = ({
  onClose,
  mode = "replace",
}) => {
  const { t } = useTranslation(["Common"]);
  const { currentDeviceType } = useDeviceType();
  const { getIcon } = useGetIcon();
  const { useCloudsStore } = useStores();

  const isAdd = mode === "add";
  // The folders ticked so far, by id, with the path each was ticked under.
  const pickedRef = React.useRef(
    new Map<string, { id: string; name: string; path: string }>(),
  );
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
        picked.set(id, { id, name, path: [...crumbs, name].join(" / ") });
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
      const folder = {
        id: String(selectedItemId),
        name: String(name),
        path: crumbs.join(" / "),
      };
      if (isAdd) clouds.addFolderContext(CONTEXT_ROOM_CLOUD, folder);
      else clouds.selectFolderContext(CONTEXT_ROOM_CLOUD, folder);
      onClose();
    },
    [onClose, useCloudsStore, isAdd],
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
      // Ticked folders are a pick wherever the user stands, the root too.
    ) => isFirstLoad || (isRoot && pickedCount === 0),
    [pickedCount],
  );

  return (
    <FilesSelector
      isPanelVisible
      openRoot
      withRecentTreeFolder={false}
      withFavoritesTreeFolder={false}
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
