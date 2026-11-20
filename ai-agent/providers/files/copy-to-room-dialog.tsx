"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { FilterType, FolderType } from "@onlyoffice/docspace-api-sdk";

import { useApi as useFilesApi } from "../../../providers/api";
import FilesSelector from "../../../selectors/Files";
import { toastr, type TData } from "../../../components/toast";
import { CommonTrans } from "../../../utils/i18n/CommonTrans";
import { getBrandName } from "../../../constants/brands";
import useGetIcon from "../../hooks/useGetIcon";

import { copyFileToFolder } from "./copy-file";
import useDeviceType from "./use-device-type";

/** A file a reply produced, as "Save to room..." copies it. */
export type CopyToRoomFile = {
  /** The portal file id. */
  id: number | string;
  /** The file's name, extension included, for the toast. */
  title: string;
};

type CopyToRoomDialogProps = {
  file: CopyToRoomFile;
  /** Called once the user has picked a place or cancelled. */
  onClose: () => void;
};

// The folder selector behind "Save to room..." on a file a reply produced
// (a created document): the user picks a room or folder
// they may add files to, and a copy of the file is put there; the file
// itself stays where it is, and so does its card. Rendered inside
// <AiAgentProviders> so useApi()/useGetIcon() resolve their context.
const CopyToRoomDialog = ({ file, onClose }: CopyToRoomDialogProps) => {
  const { t } = useTranslation(["Common"]);
  const { currentDeviceType } = useDeviceType();
  const { getIcon } = useGetIcon();
  const { operationsApi } = useFilesApi();

  const onSubmit = React.useCallback<
    React.ComponentProps<typeof FilesSelector>["onSubmit"]
  >(
    (selectedItemId, folderTitle, _isPublic, breadCrumbs) => {
      onClose();
      if (
        selectedItemId === undefined ||
        selectedItemId === null ||
        selectedItemId === ""
      )
        return;
      const folderName =
        folderTitle || breadCrumbs[breadCrumbs.length - 1]?.label || "";
      // The dialog is gone by now: the copy runs on the portal and the
      // toast tells when it has landed.
      copyFileToFolder(operationsApi, file.id, selectedItemId)
        .then((done) => {
          if (!done) return;
          toastr.success(
            <CommonTrans
              i18nKey="CopyItem"
              values={{ title: file.title, folderName }}
              components={{ 1: <strong />, 2: <strong /> }}
            />,
          );
        })
        .catch((error: unknown) => toastr.error(error as TData));
    },
    [file, onClose, operationsApi],
  );

  // A room, or a folder, the user may add files to: the rooms list itself
  // and a room the user only reads cannot be confirmed.
  const getIsDisabled = React.useCallback<
    React.ComponentProps<typeof FilesSelector>["getIsDisabled"]
  >(
    (
      isFirstLoad,
      _isSelectedParent,
      _selectedItemId,
      selectedItemType,
      isRoot,
      selectedItemSecurity,
    ) => {
      if (isFirstLoad || isRoot || selectedItemType === "rooms") return true;
      return !(
        selectedItemSecurity &&
        "Create" in selectedItemSecurity &&
        selectedItemSecurity.Create
      );
    },
    [],
  );

  return (
    <FilesSelector
      isPanelVisible
      openRoot
      isRoomsOnly={false}
      // The Forms section takes PDF forms only, and the AI section's rooms
      // are skill sets and knowledge bases, filled in their own lists.
      withFormsTreeFolder={false}
      withAIRoomsTreeFolder={false}
      // A Form Filling space is still reached through Rooms; the selector
      // says why it cannot take the file instead of letting the copy fail.
      formProps={{
        isRoomFormAccessible: false,
        message: t("Common:WarningCopyToFormRoom", {
          organizationName: getBrandName("OrganizationName"),
          defaultValue:
            "The file cannot be copied to this space. Please try to copy the {{organizationName}} PDF form.",
        }),
      }}
      isThirdParty={false}
      withCreate={false}
      withHeader
      headerProps={{
        headerLabel: t("Common:SelectFolder", {
          defaultValue: "Select folder",
        }),
        onCloseClick: onClose,
        isCloseable: true,
      }}
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
      submitButtonLabel={t("Common:CopyHere", { defaultValue: "Copy here" })}
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

export default CopyToRoomDialog;
