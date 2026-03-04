/*
 * (c) Copyright Ascensio System SIA 2009-2026
 *
 * This program is a free software product.
 * You can redistribute it and/or modify it under the terms
 * of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
 * Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
 * to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
 * any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
 * of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
 * the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
 *
 * The  interactive user interfaces in modified source and object code versions of the Program must
 * display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product logo when
 * distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
 * trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
 * content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
 * International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 */

import React from "react";

import {
  ModalDialog,
  ModalDialogType,
} from "../../../../../../components/modal-dialog";
import { Button, ButtonSize } from "../../../../../../components/button";
import { Text } from "../../../../../../components/text";

import { useChatStore } from "../../../../store/chatStore";
import { useMessageStore } from "../../../../store/messageStore";

import { DeleteChatProps } from "../../../../Chat.types";
import { getCommonTranslation } from "../../../../../../utils";
import { toastr } from "../../../../../../components/toast";
import { CommonTrans } from "../../../../../../utils/i18n/CommonTrans";
import styles from "./DeleteChat.module.scss";

const DeleteChat = ({ chatId, chatTitle, onDeleteToggle }: DeleteChatProps) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const { deleteChat, currentChat, updateUrlChatId } = useChatStore();
  const { startNewChat } = useMessageStore();

  const onDeleteClose = React.useCallback(() => {
    if (isLoading) return;
    onDeleteToggle();
  }, [onDeleteToggle, isLoading]);

  const onDeleteAction = React.useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      await deleteChat(chatId);

      if (chatId === currentChat?.id) {
        startNewChat();
        updateUrlChatId("");
      }

      toastr.success(getCommonTranslation("ChatSuccessDeleted"));
      onDeleteToggle();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [
    chatId,
    currentChat?.id,
    deleteChat,
    startNewChat,
    updateUrlChatId,
    onDeleteToggle,
    isLoading,
  ]);

  React.useEffect(() => {
    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        onDeleteAction();
      }
      if (e.key === "Escape") {
        onDeleteClose();
      }
    };

    window.addEventListener("keydown", onKeydown);

    return () => {
      window.removeEventListener("keydown", onKeydown);
    };
  }, [onDeleteAction, onDeleteClose]);

  return (
    <ModalDialog
      visible
      onClose={onDeleteClose}
      displayType={ModalDialogType.modal}
    >
      <ModalDialog.Header>
        {getCommonTranslation("DeleteAIAgentChatTitle")}
      </ModalDialog.Header>
      <ModalDialog.Body className={styles.modalWrapper}>
        <CommonTrans
          i18nKey="DeleteAIChatDescription"
          values={{ chatName: chatTitle }}
          components={{
            1: <Text key="chat-title" fontWeight={400} as="span" />,
          }}
        />{" "}
        {getCommonTranslation("WantToContinue")}
      </ModalDialog.Body>
      <ModalDialog.Footer>
        <Button
          size={ButtonSize.normal}
          label={getCommonTranslation("DeleteForeverButton")}
          onClick={onDeleteAction}
          scale
          primary
          isLoading={isLoading}
          testId="delete-chat-confirm-button"
        />
        <Button
          size={ButtonSize.normal}
          label={getCommonTranslation("CancelButton")}
          onClick={onDeleteClose}
          scale
          isDisabled={isLoading}
          testId="delete-chat-cancel-button"
        />
      </ModalDialog.Footer>
    </ModalDialog>
  );
};

export default DeleteChat;
