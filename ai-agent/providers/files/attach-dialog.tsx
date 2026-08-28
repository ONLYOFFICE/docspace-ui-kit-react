// (c) Copyright Ascensio System SIA 2009-2026
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

"use client";

import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { FileType, FolderType } from "@onlyoffice/docspace-api-sdk";
import { useStores } from "@onlyoffice/ai-chat";

import FilesSelector from "../../../selectors/Files";
import type { TSelectorItem } from "../../../components/selector";
import { toastr, type TData } from "../../../components/toast";
import useGetIcon from "../../hooks/useGetIcon";

import { getOnlyofficeFileType } from "./file-type";
import { attachFilesToChat, type OnFilesAttached } from "./attach-files";
import { splitDuplicateAttachments } from "./duplicate-attachments";
import useDeviceType from "./use-device-type";

type AttachDialogProps = {
  onClose: () => void;
  // Reports the attached files so the caller can keep the record flags the
  // attachments store drops (`canAnalyze`).
  onFilesAttached?: OnFilesAttached;
};

// Rendered inside <AiAgentProviders> so `useStores()` resolves the
// AttachmentsStore from the widget's context. `addAttachmentFile` round-trips
// to the AI backend, which resolves the entryId server-side — `content` here
// is a placeholder and is ignored by the host integration.
const AttachDialog: React.FC<AttachDialogProps> = observer((props) => {
  const { onClose, onFilesAttached } = props;
  const { t } = useTranslation(["Common"]);
  const { currentDeviceType } = useDeviceType();
  const { getIcon } = useGetIcon();
  const { useAttachmentsStore } = useStores();

  const selectedFilesRef = React.useRef<TSelectorItem[]>([]);

  const onSelectItem = React.useCallback((item: TSelectorItem) => {
    if ("isFolder" in item && item.isFolder) return;
    const idx = selectedFilesRef.current.findIndex((f) => f.id === item.id);
    if (idx >= 0) {
      selectedFilesRef.current = selectedFilesRef.current.filter(
        (f) => f.id !== item.id,
      );
    } else {
      selectedFilesRef.current = [...selectedFilesRef.current, item];
    }
  }, []);

  const onSubmit = React.useCallback<
    React.ComponentProps<typeof FilesSelector>["onSubmit"]
  >(
    async (
      _selectedItemId,
      _folderTitle,
      _isPublic,
      _breadCrumbs,
      _fileName,
      _isChecked,
      _selectedTreeNode,
      selectedFileInfo,
    ) => {
      // Align the input array with the original selector items so we know
      // which records to re-key as images after `addAttachmentFile`.
      const sources =
        selectedFilesRef.current.length > 0
          ? selectedFilesRef.current.map((f) => ({
              id: f.id,
              title: f.label,
              fileType: "fileType" in f ? f.fileType : undefined,
              fileExst: "fileExst" in f ? (f.fileExst ?? "") : "",
              isForm: "isForm" in f ? f.isForm : undefined,
            }))
          : selectedFileInfo
            ? [
                {
                  id: selectedFileInfo.id,
                  title: selectedFileInfo.title,
                  fileType: selectedFileInfo.fileType,
                  fileExst: selectedFileInfo.fileExst ?? "",
                  isForm: (selectedFileInfo as { isForm?: boolean }).isForm,
                },
              ]
            : [];

      // One chip per file: a pick that is already on the message (or picked
      // twice across folders) is dropped before any chip is reserved.
      const { keep } = splitDuplicateAttachments(
        useAttachmentsStore,
        sources.map((s) => String(s.id)),
      );
      const picked = keep.map((index) => sources[index]);

      const inputs = picked.map((s) => ({
        path: String(s.id),
        title: s.fileExst ? `${s.title}${s.fileExst}` : s.title,
        type: getOnlyofficeFileType(s.fileExst || s.title),
        content: "",
        isForm: s.isForm,
      }));

      const imageIndices = new Set<number>();
      picked.forEach((s, i) => {
        if (s.fileType === FileType.Image) imageIndices.add(i);
      });

      // Reserve the loading chips before closing so they are already in the
      // composer when the dialog disappears; the reservation also applies
      // the attachment cap (extra picks simply get no chip).
      const pendingIds = useAttachmentsStore
        .getState()
        .beginPendingAttachments(
          inputs.map((input) => ({
            title: input.title,
            kind: "file" as const,
            type: input.type,
          })),
        );
      const accepted = inputs.slice(0, pendingIds.length);

      onClose();
      if (accepted.length === 0) return;

      try {
        // `imageIndices` at or past `accepted.length` are never looked up.
        const attached = await attachFilesToChat(
          useAttachmentsStore,
          accepted,
          imageIndices,
          pendingIds,
        );
        onFilesAttached?.(attached);
      } catch (e) {
        useAttachmentsStore.getState().failPendingAttachments(pendingIds);
        toastr.error(e as TData);
      }
    },
    [onClose, onFilesAttached, useAttachmentsStore],
  );

  const getIsDisabled = React.useCallback<
    React.ComponentProps<typeof FilesSelector>["getIsDisabled"]
  >((isFirstLoad, _a, _b, _c, _d, _e, selectedFileInfo) => {
    if (isFirstLoad) return true;
    return selectedFilesRef.current.length === 0 && !selectedFileInfo;
  }, []);

  return (
    <FilesSelector
      isPanelVisible
      openRoot
      isMultiSelect
      withRecentTreeFolder
      withFavoritesTreeFolder
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
      onSelectItem={onSelectItem}
      getIcon={getIcon}
      getIsDisabled={getIsDisabled}
      currentFolderId=""
      rootFolderType={FolderType.USER}
      disabledItems={[]}
      filterParam="ALL"
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
});
AttachDialog.displayName = "AttachDialog";

export default AttachDialog;
