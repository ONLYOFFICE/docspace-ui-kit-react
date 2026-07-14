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

import {
  ModalDialog,
  ModalDialogType,
} from "../../../../../../components/modal-dialog";
import { Button, ButtonSize } from "../../../../../../components/button";
import { Text } from "../../../../../../components/text";

import { useChatStore } from "../../../../store/chatStore";
import { useMessageStore } from "../../../../store/messageStore";

import { DeleteChatProps } from "../../../../Chat.types";
import { useCommonTranslation } from "../../../../../../utils/i18n";
import { toastr } from "../../../../../../components/toast";
import { CommonTrans } from "../../../../../../utils/i18n/CommonTrans";
import styles from "./DeleteChat.module.scss";

const DeleteChat = ({ chatId, chatTitle, onDeleteToggle }: DeleteChatProps) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const { deleteChat, currentChat, updateUrlChatId } = useChatStore();
  const { startNewChat } = useMessageStore();
  const t = useCommonTranslation();

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

      toastr.success(t("ChatSuccessDeleted"));
      onDeleteToggle();
    } catch (error) {
      toastr.error(error as string);
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
        {t("DeleteAIAgentChatTitle")}
      </ModalDialog.Header>
      <ModalDialog.Body className={styles.modalWrapper}>
        <CommonTrans
          i18nKey="DeleteAIChatDescription"
          values={{ chatName: chatTitle }}
          components={{
            1: <Text key="chat-title" fontWeight={400} as="span" />,
          }}
        />{" "}
        {t("WantToContinue")}
      </ModalDialog.Body>
      <ModalDialog.Footer>
        <Button
          size={ButtonSize.normal}
          label={t("DeleteForeverButton")}
          onClick={onDeleteAction}
          scale
          primary
          isLoading={isLoading}
          testId="delete-chat-confirm-button"
        />
        <Button
          size={ButtonSize.normal}
          label={t("CancelButton")}
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
