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

import { useEffect, useRef } from "react";
import { observer } from "mobx-react";
import classNames from "classnames";

import socket, { SocketCommands, SocketEvents } from "../../../../utils/socket";

import { Loader, LoaderTypes } from "../../../../components/loader";

import { useMessageStore } from "../../store/messageStore";
import { useChatStore } from "../../store/chatStore";

import type { MessageBodyProps } from "../../Chat.types";

import EmptyScreen from "./sub-components/empty-screen";
import Message from "./sub-components/message";

import { useChatScroll } from "./hooks/useChatScroll";
import styles from "./ChatMessageBody.module.scss";
import { useCommonTranslation } from "../../../../utils/i18n";

const ChatMessageBody = observer(
  ({
    userAvatar,
    getIcon,
    isLoading,
    hideAttachments,
    emptyScreenText,
    getResultStorageId,
    setAiPlaylistImages,
    setMediaViewerVisible,
    openFile,
    openLink,
  }: MessageBodyProps) => {
    const { messages, isAnalyzing, fetchNextMessages, addMessageId } =
      useMessageStore();
    const { currentChat } = useChatStore();
    const t = useCommonTranslation();

    const chatBodyRef = useRef<HTMLDivElement>(null);

    const isEmpty = messages.length === 0 || isLoading;

    useEffect(() => {
      if (!currentChat?.id) return;

      socket?.emit(SocketCommands.Subscribe, {
        roomParts: `CHAT-${currentChat?.id}`,
      });

      return () => {
        socket?.emit(SocketCommands.Unsubscribe, {
          roomParts: `CHAT-${currentChat?.id}`,
        });
      };
    }, [currentChat?.id]);

    useEffect(() => {
      socket?.on(SocketEvents.ChatMessageId, (data) => {
        addMessageId(data.messageId);
      });
    }, [addMessageId]);

    useChatScroll({
      chatBodyRef,
      isEmpty,
      fetchNextMessages,
      currentChat,
      messages,
    });

    return (
      <div
        className={classNames(styles.chatMessageBody, "chat-message-body", {
          [styles.empty]: isEmpty,
        })}
        data-testid="chat-message-body"
      >
        {isEmpty ? (
          <EmptyScreen
            isLoading={isLoading}
            emptyScreenText={emptyScreenText}
          />
        ) : (
          <div
            className={classNames(styles.chatMessageContainer)}
            ref={chatBodyRef}
          >
            {messages.map((message, index) => {
              return (
                <Message
                  key={`${currentChat?.id}-${message.createdOn}-${index * 2}`}
                  message={message}
                  idx={index}
                  userAvatar={userAvatar}
                  isLast={index === 0}
                  hideAttachments={hideAttachments}
                  getIcon={getIcon}
                  getResultStorageId={getResultStorageId}
                  setAiPlaylistImages={setAiPlaylistImages}
                  setMediaViewerVisible={setMediaViewerVisible}
                  openFile={openFile}
                  openLink={openLink}
                />
              );
            })}
            {isAnalyzing ? (
              <div
                className={styles.chatLoader}
                data-testid="chat-loader-container"
              >
                <Loader type={LoaderTypes.track} />
                {t("Analyzing")}
              </div>
            ) : null}
          </div>
        )}
      </div>
    );
  },
);

export default ChatMessageBody;
