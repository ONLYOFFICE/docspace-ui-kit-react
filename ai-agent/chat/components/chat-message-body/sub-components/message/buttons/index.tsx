/*
 * Copyright (C) Ascensio System SIA, 2009-2026
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation, together with the
 * additional terms provided in the LICENSE file.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For
 * details, see the GNU AGPL at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA by email at info@onlyoffice.com
 * or by postal mail at 20A-6 Ernesta Birznieka-Upisha Street, Riga,
 * LV-1050, Latvia, European Union.
 *
 * The interactive user interfaces in modified versions of the Program
 * are required to display Appropriate Legal Notices in accordance with
 * Section 5 of the GNU AGPL version 3.
 *
 * No trademark rights are granted under this License.
 *
 * All non-code elements of the Product, including illustrations,
 * icon sets, and technical writing content, are licensed under the
 * Creative Commons Attribution-ShareAlike 4.0 International License:
 * https://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 * This license applies only to such non-code elements and does not
 * modify or replace the licensing terms applicable to the Program's
 * source code, which remains licensed under the GNU Affero General
 * Public License v3.
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from "react";
import copy from "copy-to-clipboard";
import { observer } from "mobx-react";

import CopyIcon from "../../../../../../../assets/icons/16/copy.react.svg";
// import RefreshIcon from "../../../.././../../assets/16/refresh.react.svg";
import SaveToFileIcon from "../../../../../../../assets/message.save.svg";

import socket, {
  SocketCommands,
  SocketEvents,
} from "../../../../../../../utils/socket";

import { TBreadCrumb } from "../../../../../../../components/selector";
import { toastr } from "../../../../../../../components/toast";
import {
  Link,
  LinkTarget,
  LinkType,
} from "../../../../../../../components/link";

import { useMessageStore } from "../../../../../store/messageStore";
import { useChatStore } from "../../../../../store/chatStore";

import { openFileInEditor } from "../../../../../utils";

import ExportSelector from "../../../../export-selector";

import styles from "../../../ChatMessageBody.module.scss";

import { MessageButtonsProps } from "../../../../../Chat.types";
import { FOLDER_FORM_VALIDATION } from "../../../../../../../constants";
import { ContentType } from "../../../../../../../enums";
import { useCommonTranslation } from "../../../../../../../utils/i18n";
import { useApi } from "../../../../../../../providers/api";
import { CommonTrans } from "../../../../../../../utils/i18n/CommonTrans";

const Buttons = ({
  text,
  chatName,
  messageId,
  // isLast,
  getIcon,
  messageIndex,
  getResultStorageId,
  openFile,
}: MessageButtonsProps) => {
  const t = useCommonTranslation();
  const { agentId, findPreviousUserMessage } = useMessageStore();
  const { currentChat } = useChatStore();
  const { aiApi, baseUrl } = useApi();

  const handleFileOpen = (fileId: string) => {
    if (openFile) {
      openFile(fileId);
    } else {
      openFileInEditor(fileId, baseUrl);
    }
  };

  const [showFolderSelector, setShowFolderSelector] = React.useState(false);

  const onCloseFolderSelector = () => setShowFolderSelector(false);

  const onCopyAction = () => {
    const textWithoutThink = text.replace(/<think>[\s\S]*?<\/think>/g, "").trim();
    copy(textWithoutThink, { format: "text/plain" });
    toastr.success(t("MessageCopiedSuccess"));
  };

  const onExportMessage = async (
    selectedItemId: string | number | undefined,
    folderTitle: string,
    isPublic: boolean,
    breadCrumbs: TBreadCrumb[],
    fileName: string,
    isChecked: boolean,
  ) => {
    if (!messageId || !selectedItemId || !currentChat) return;

    const chatParts = ["CHAT-" + currentChat.id];

    socket?.emit(SocketCommands.Subscribe, {
      roomParts: chatParts,
      individual: true,
    });

    await aiApi.exportChatMessage(messageId, selectedItemId, fileName);

    socket?.on(SocketEvents.ExportChat, (data) => {
      const { resultFile } = data;

      if (resultFile) {
        if (isChecked) {
          handleFileOpen(resultFile.id!.toString());
        }

        const toastMsg = (
          <CommonTrans
            i18nKey="MessageExported"
            values={{ fileName }}
            components={{
              1: (
                <Link
                  type={LinkType.action}
                  onClick={() => handleFileOpen(resultFile.id!.toString())}
                />
              ),
            }}
          />
        );

        toastr.success(toastMsg);
      } else {
        toastr.error(data.error);
      }

      socket?.off(SocketEvents.ExportChat);
      socket?.emit(SocketCommands.Unsubscribe, {
        roomParts: chatParts,
        individual: true,
      });
    });

    setShowFolderSelector(false);
  };

  const getExportedFileName = () => {
    const userMessage = findPreviousUserMessage(messageIndex);
    let text = "";

    if (userMessage && userMessage.contents?.length > 0) {
      for (const content of userMessage.contents) {
        if (content.type === ContentType.Text) {
          text = content.text;
        }
      }
    }

    if (!text) {
      text = chatName || "";
    }

    const sanitizedStr = text
      .slice(0, 49) // only first 50 chars
      .replace(/[\r\n]+/g, " ") // multiline to single line
      .replace(FOLDER_FORM_VALIDATION, "_") // unacceptable symbols to "_"
      .replace(/_+/g, "_") // remove "_" duplicates
      .trim();

    return sanitizedStr;
  };

  return (
    <>
      <div className={styles.buttonsBlock}>
        <div
          className={styles.buttonsBlockItem}
          onClick={onCopyAction}
          title={t("CopyMessage")}
          data-testid="copy-message-button"
        >
          <CopyIcon />
        </div>

        {/*{isLast ? (*/}
        {/*  <div*/}
        {/*    className={styles.buttonsBlockItem}*/}
        {/*    title={t("RefreshMessage")}*/}
        {/*    onClick={() => {*/}
        {/*      toastr.info(t("WorkInProgress"));*/}
        {/*    }}*/}
        {/*  >*/}
        {/*    <RefreshIcon />*/}
        {/*  </div>*/}
        {/*) : null}*/}

        <div
          className={styles.buttonsBlockItem}
          onClick={() => setShowFolderSelector(true)}
          title={t("SaveToFile")}
          data-testid="save-to-file-button"
        >
          <SaveToFileIcon />
        </div>
      </div>
      {showFolderSelector ? (
        <ExportSelector
          onCloseFolderSelector={onCloseFolderSelector}
          onSubmit={onExportMessage}
          currentFolderId={getResultStorageId?.() || agentId}
          getFileName={getExportedFileName}
          getIcon={getIcon}
          showFolderSelector={showFolderSelector}
        />
      ) : null}
    </>
  );
};

export default observer(Buttons);
