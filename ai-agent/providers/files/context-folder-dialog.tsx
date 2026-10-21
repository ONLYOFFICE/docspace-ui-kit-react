"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { FilterType, FolderType } from "@onlyoffice/docspace-api-sdk";
import { useStores } from "@onlyoffice/ai-chat";

import FilesSelector from "../../../selectors/Files";
import useGetIcon from "../../hooks/useGetIcon";

import { CONTEXT_ROOM_CLOUD } from "../context-room/ContextRoomSync";
import useDeviceType from "./use-device-type";

type ContextFolderDialogProps = {
  onClose: () => void;
};

// The composer's "Add context" picker: any folder of the portal, rooms and
// their subfolders included, handed to the chat library's clouds store as
// the round's context folder. Rendered inside <AiAgentProviders> so
// `useStores()` resolves the store from the widget's context. The selector
// submits the folder the user is standing in, so the list shows folders
// only and the button is live as soon as the first level has loaded.
const ContextFolderDialog: React.FC<ContextFolderDialogProps> = ({
  onClose,
}) => {
  const { t } = useTranslation(["Common"]);
  const { currentDeviceType } = useDeviceType();
  const { getIcon } = useGetIcon();
  const { useCloudsStore } = useStores();

  const onSubmit = React.useCallback<
    React.ComponentProps<typeof FilesSelector>["onSubmit"]
  >(
    (selectedItemId, folderTitle, _isPublic, breadCrumbs) => {
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
      useCloudsStore.getState().selectFolderContext(CONTEXT_ROOM_CLOUD, {
        id: String(selectedItemId),
        name: String(name),
      });
      onClose();
    },
    [onClose, useCloudsStore],
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
    ) => isFirstLoad || isRoot,
    [],
  );

  return (
    <FilesSelector
      isPanelVisible
      openRoot
      withRecentTreeFolder={false}
      withFavoritesTreeFolder={false}
      withAIAgentsTreeFolder
      isRoomsOnly={false}
      isThirdParty={false}
      withCreate={false}
      withSearch
      withBreadCrumbs
      withoutBackButton
      withCancelButton
      withFooterInput={false}
      withFooterCheckbox={false}
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
