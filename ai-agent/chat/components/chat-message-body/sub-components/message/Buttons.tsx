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

import React from "react";
import { ReactSVG } from "react-svg";
import copy from "copy-to-clipboard";
import { observer } from "mobx-react";

import CopyIcon from "../../../.././../../assets/icons/16/copy.react.svg";
// import RefreshIcon from "../../../.././../../assets/16/refresh.react.svg";
import SaveToFileIcon from "../../../.././../../assets/message.save.svg";

import { SocketCommands, SocketEvents } from "../../../../../../utils/socket";

import { TBreadCrumb } from "../../../../../../components/selector";
import { toastr } from "../../../../../../components/toast";
import { Link, LinkTarget, LinkType } from "../../../../../../components/link";

import { useMessageStore } from "../../../../store/messageStore";
import { useChatStore } from "../../../../store/chatStore";

import { openFile } from "../../../../utils";

import ExportSelector from "../../../../components/export-selector";

import styles from "../../ChatMessageBody.module.scss";

import { MessageButtonsProps } from "../../../../Chat.types";
import { FOLDER_FORM_VALIDATION } from "../../../../../../constants";
import { ContentType } from "../../../../../../enums";
import { getCommonTranslation } from "../../../../../../utils";
import { useApi } from "../../../../../../providers/api";
import { useSocket } from "../../../../../../providers/socket";
import { CommonTrans } from "../../../../../../utils/i18n/CommonTrans";

const Buttons = ({
  text,
  chatName,
  messageId,
  // isLast,
  getIcon,
  messageIndex,
  getResultStorageId,
  folderFormValidation,
  allowExternalNavigation,
}: MessageButtonsProps) => {
  const { agentId, findPreviousUserMessage } = useMessageStore();
  const { currentChat } = useChatStore();
  const { aiApi } = useApi();
  const socket = useSocket();

  const [showFolderSelector, setShowFolderSelector] = React.useState(false);

  const onCloseFolderSelector = () => setShowFolderSelector(false);

  const onCopyAction = () => {
    copy(text, { format: "text/plain" });
    toastr.success(getCommonTranslation("MessageCopiedSuccess"));
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

    console.log(socket?.socketSubscribers);

    socket?.on(SocketEvents.ExportChat, (data) => {
      const { resultFile } = data;

      if (resultFile) {
        if (isChecked) {
          openFile(resultFile.id!.toString(), allowExternalNavigation);
        }

        const toastMsg = (
          <CommonTrans
            i18nKey="MessageExported"
            values={{ fileName }}
            components={{
              1: allowExternalNavigation ? (
                <Link
                  type={LinkType.action}
                  onClick={() => openFile(resultFile.id!.toString(), allowExternalNavigation)}
                />
              ) : (
                <span />
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
          title={getCommonTranslation("CopyMessage")}
        >
          <CopyIcon />
        </div>

        {/*{isLast ? (*/}
        {/*  <div*/}
        {/*    className={styles.buttonsBlockItem}*/}
        {/*    title={getCommonTranslation("RefreshMessage")}*/}
        {/*    onClick={() => {*/}
        {/*      toastr.info(getCommonTranslation("WorkInProgress"));*/}
        {/*    }}*/}
        {/*  >*/}
        {/*    <RefreshIcon />*/}
        {/*  </div>*/}
        {/*) : null}*/}

        <div
          className={styles.buttonsBlockItem}
          onClick={() => setShowFolderSelector(true)}
          title={getCommonTranslation("SaveToFile")}
        >
          <SaveToFileIcon />
        </div>
      </div>
      {showFolderSelector ? (
        <ExportSelector
          onCloseFolderSelector={onCloseFolderSelector}
          onSubmit={onExportMessage}
          currentFolderId={getResultStorageId() || agentId}
          getFileName={getExportedFileName}
          getIcon={getIcon}
          showFolderSelector={showFolderSelector}
          folderFormValidation={folderFormValidation}
        />
      ) : null}
    </>
  );
};

export default observer(Buttons);
