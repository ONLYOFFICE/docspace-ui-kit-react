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
import { useTranslation } from "react-i18next";
import { FolderType } from "@onlyoffice/docspace-api-sdk";

import { useApi as useFilesApi } from "../../../providers/api";
import FilesSelector from "../../../selectors/Files";
import { toastr, type TData } from "../../../components/toast";
import SocketHelper, {
  SocketCommands,
  SocketEvents,
  type TOptSocket,
} from "../../../utils/socket";
import { CommonTrans } from "../../../utils/i18n/CommonTrans";
import useGetIcon from "../../chat/hooks/useGetIcon";

import useDeviceType from "./use-device-type";

const stripDocxExt = (name: string) => name.replace(/\.docx$/i, "");

// How long to wait for the AI Worker to deliver the converted .docx before
// silently dropping the completion watcher (no error toast — the file may
// still arrive later; the user just won't get the notification).
const EXPORT_WATCH_TIMEOUT_MS = 2 * 60 * 1000;

// The export is asynchronous: `startTextToDocx` only queues the conversion,
// and the saved file surfaces as the standard `s:modify-folder` create
// event. Watch that event for a file with the expected name in the target
// folder and toast once it lands. Module-level on purpose — the dialog
// closes right after the export starts, so the watcher must outlive it.
const watchForExportedFile = (
  folderId: number,
  title: string,
  onCreated: (createdTitle: string) => void,
) => {
  const roomPart = `DIR-${folderId}`;
  // Join the folder's socket room if nobody has yet — and never leave it.
  // SocketHelper's subscription map is flat (no ref-counting), so an
  // unsubscribe here would also kill the room for any consumer that
  // subscribed after us (e.g. the files view navigating into this folder).
  // A lingering joined room is cheap: its events just go unhandled once
  // the watcher below detaches, and the natural owner's own lifecycle
  // (subscribe on enter / unsubscribe on leave) keeps working.
  if (!SocketHelper?.socketSubscribers.has(roomPart)) {
    SocketHelper?.emit(SocketCommands.Subscribe, {
      roomParts: roomPart,
      individual: true,
    });
  }

  const expectedBase = stripDocxExt(title);
  let timer: ReturnType<typeof setTimeout> | null = null;

  const cleanup = () => {
    if (timer) clearTimeout(timer);
    timer = null;
    SocketHelper?.off(SocketEvents.ModifyFolder, handler);
  };

  const handler = (opt?: TOptSocket) => {
    if (opt?.cmd !== "create" || opt?.type !== "file" || !opt?.data) return;
    try {
      const file = JSON.parse(opt.data) as { folderId?: unknown; title?: unknown };
      if (String(file.folderId) !== String(folderId)) return;
      // The converter dedupes clashing names ("name (1).docx"), so match by
      // the base-name prefix rather than exact equality.
      if (
        typeof file.title !== "string" ||
        !stripDocxExt(file.title).startsWith(expectedBase)
      )
        return;
      cleanup();
      onCreated(file.title);
    } catch {
      // malformed payload — keep watching
    }
  };

  SocketHelper?.on(SocketEvents.ModifyFolder, handler);
  timer = setTimeout(cleanup, EXPORT_WATCH_TIMEOUT_MS);
};

type SaveDialogProps = {
  // Markdown body of the message to save, and the library's default file name
  // (e.g. "<title>.docx").
  content: string;
  defaultName: string;
  // Called once the user has saved or cancelled, to close the dialog and
  // resolve the library's awaiting saveAsFile promise.
  onFinish: () => void;
};

// Folder selector for the chat library's message "Save" action. The user picks
// a folder/filename and the message markdown is written to a file there via the
// host files API. Rendered inside <AiAgentProviders> so ui-kit
// useApi()/useGetIcon() resolve their context.
const SaveDialog = ({ content, defaultName, onFinish }: SaveDialogProps) => {
  const { t } = useTranslation(["Common"]);
  const { currentDeviceType } = useDeviceType();
  const { getIcon } = useGetIcon();
  const { filesApi, aiApi } = useFilesApi();

  const onSubmit = React.useCallback<
    React.ComponentProps<typeof FilesSelector>["onSubmit"]
  >(
    async (selectedItemId, _folderTitle, _isPublic, _breadCrumbs, fileName) => {
      if (selectedItemId != null) {
        const title = /\.docx$/i.test(fileName) ? fileName : `${fileName}.docx`;
        const folderId = Number(selectedItemId);
        // Reuse the message-export toast key from the legacy chat (it has
        // translations for every locale); without a `components` entry the
        // <1>…</1> file name renders as plain text.
        const exportedToast = (createdTitle: string) =>
          toastr.success(
            <CommonTrans
              i18nKey="MessageExported"
              values={{ fileName: createdTitle }}
            />,
          );
        try {
          // Real md → docx conversion via the AI Worker. The call only
          // queues the job; the toast fires when the converted file lands
          // in the folder (files socket create event). Arm the watcher only
          // after the queueing succeeded so a fallback save can't trigger a
          // duplicate toast.
          await aiApi.startTextToDocx(folderId, title, content);
          watchForExportedFile(folderId, title, exportedToast);
        } catch {
          // Legacy fallback: write the raw markdown as a text file, exactly
          // as this dialog behaved before the async export existed. The
          // creation is synchronous here, so toast right away.
          try {
            await filesApi.createTextFile({
              folderId,
              createTextOrHtmlFile: { title, content },
            });
            exportedToast(title);
          } catch (e) {
            toastr.error(e as TData);
          }
        }
      }
      onFinish();
    },
    [content, filesApi, aiApi, onFinish],
  );

  const getIsDisabled = React.useCallback<
    React.ComponentProps<typeof FilesSelector>["getIsDisabled"]
  >(
    (
      _isFirstLoad,
      _isSelectedParent,
      _selectedItemId,
      selectedItemType,
      _isRoot,
      selectedItemSecurity,
    ) => {
      if (selectedItemType === "rooms" || selectedItemType === "agents")
        return true;
      if (
        selectedItemSecurity &&
        "Create" in selectedItemSecurity &&
        selectedItemSecurity.Create
      )
        return false;
      return true;
    },
    [],
  );

  return (
    <FilesSelector
      isPanelVisible
      openRoot
      isRoomsOnly={false}
      isThirdParty={false}
      withCreate={false}
      withSearch
      withBreadCrumbs
      withoutBackButton
      withCancelButton
      withFooterInput
      withFooterCheckbox={false}
      onCancel={onFinish}
      onSubmit={onSubmit}
      getIcon={getIcon}
      getIsDisabled={getIsDisabled}
      currentFolderId=""
      rootFolderType={FolderType.USER}
      disabledItems={[]}
      filterParam="ALL"
      submitButtonLabel={t("Common:SaveButton", { defaultValue: "Save" })}
      cancelButtonLabel={t("Common:CancelButton", { defaultValue: "Cancel" })}
      descriptionText=""
      footerCheckboxLabel=""
      footerInputHeader={t("Common:FileName", { defaultValue: "File name" })}
      currentFooterInputValue={stripDocxExt(defaultName)}
      getFilesArchiveError={() => ""}
      currentDeviceType={currentDeviceType}
    />
  );
};

export default SaveDialog;
