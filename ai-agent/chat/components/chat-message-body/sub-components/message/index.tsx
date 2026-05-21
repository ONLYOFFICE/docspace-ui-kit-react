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
import classNames from "classnames";
import { observer } from "mobx-react";
import Linkify from "linkify-react";
import copy from "copy-to-clipboard";

import CopyIcon from "../../../../../../assets/icons/16/copy.react.svg";

import { ContentType, RoleType } from "../../../../../../enums";
import type { TContent } from "../../../../../../types/ai";

import { Link, LinkTarget } from "../../../../../../components/link";
import {
  Avatar,
  AvatarRole,
  AvatarSize,
} from "../../../../../../components/avatar";
import { Text } from "../../../../../../components/text";

import type { MessageProps } from "../../../../Chat.types";
import { useChatStore } from "../../../../store/chatStore";
import { useMessageStore } from "../../../../store/messageStore";

import styles from "../../ChatMessageBody.module.scss";

import Markdown from "./Markdown";
import ToolCallMessage from "./ToolCallMessage";
import Error from "./error";
import Files from "./files";
import Images from "./images";
import Buttons from "./buttons";
import { useCommonTranslation } from "../../../../../../utils/i18n";
import { useApi } from "../../../../../../providers";

const renderLink = (
  {
    attributes,
    content,
  }: {
    attributes: { href?: string };
    content: string;
  },
  openLink?: (url: string) => void,
) => {
  const handleClick = (e: React.MouseEvent) => {
    if (openLink && attributes.href) {
      e.preventDefault();
      openLink(attributes.href);
    }
  };

  return (
    <Link
      href={attributes.href}
      className={styles.link}
      target={LinkTarget.blank}
      fontSize="15px"
      lineHeight="22px"
      color="accent"
      onClick={handleClick}
    >
      {content}
    </Link>
  );
};

const Message = ({
  message,
  idx,
  userAvatar,
  isLast,
  hideAttachments,
  getIcon,
  getResultStorageId,
  setAiPlaylistImages,
  setMediaViewerVisible,
  openFile,
  openLink,
}: MessageProps) => {
  const t = useCommonTranslation();
  const { currentChat } = useChatStore();
  const {
    generateDocxToolName,
    generateFormToolName,
    generatePresentationToolName,
  } = useMessageStore();
  const { baseUrl } = useApi();

  const isUser = message.role === RoleType.UserMessage;
  const isError = message.role === RoleType.Error;

  if (isUser) {
    const files = message.contents.filter((c) => c.type === ContentType.Files);
    const images = message.contents.filter(
      (c) => c.type === ContentType.Images,
    );

    return (
      <div className={styles.userMessageContainer} data-testid="user-message">
        <div
          key={`${currentChat?.id}-${message.createdOn}-${idx * 2}`}
          className={classNames(styles.userMessage)}
        >
          <Avatar
            size={AvatarSize.min}
            source={
              currentChat?.createdBy.avatarOriginal
                ? `${baseUrl}${currentChat?.createdBy.avatarOriginal}`
                : userAvatar
            }
            role={AvatarRole.user}
            noClick
            isNotIcon
          />

          <div className={classNames(styles.chatMessageContent)}>
            {images.length > 0 && !hideAttachments ? (
              <Images
                images={images}
                setMediaViewerVisible={setMediaViewerVisible}
                setAiPlaylistImages={setAiPlaylistImages}
              />
            ) : null}

            {files.length > 0 && !hideAttachments ? (
              <Files
                files={files}
                getIcon={getIcon}
                openFile={openFile}
              />
            ) : null}

            {message.contents.map((c) => {
              if (c.type === ContentType.Text)
                return (
                  <div
                    key={`${currentChat?.id}-${c.text}-${idx * 2}`}
                    className={classNames(styles.chatMessageUser)}
                  >
                    <Text
                      fontSize="15px"
                      lineHeight="22px"
                      fontWeight={400}
                      className={classNames(styles.paragraph)}
                    >
                      <Linkify
                        options={{
                          validate: {
                            url: (value) => /^https?:\/\//.test(value),
                          },
                          render: renderLink,
                        }}
                      >
                        {c.text}
                      </Linkify>
                    </Text>
                  </div>
                );

              return null;
            })}
          </div>
        </div>
        <div className={styles.userMessageBtns}>
          <div
            className={styles.buttonsBlockItem}
            onClick={() => {
              const fullText = message.contents
                .map((c) => {
                  if (c.type === ContentType.Text) return c.text;

                  return "";
                })
                .join("");

              copy(fullText);
            }}
            title={t("CopyMessage")}
          >
            <CopyIcon />
          </div>
        </div>
      </div>
    );
  }

  if (isError)
    return (
      <div
        key={`error-${currentChat?.id}-${message.createdOn}-${idx * 2}`}
        data-testid="error-message"
      >
        <Error content={message.contents[0]} />
      </div>
    );

  const fullText = message.contents
    .map((c) => {
      if (c.type === ContentType.Text) return c.text;

      return "";
    })
    .join("");

  const files = message.contents
    .map((c) => {
      if (!message.id) return false;

      if (c.type !== ContentType.Tool) return false;

      if (
        c.name !== generateDocxToolName &&
        c.name !== generateFormToolName &&
        c.name !== generatePresentationToolName
      )
        return false;

      if (!c.result) return false;

      const { data } = c.result;

      if (!data) return false;

      return { type: ContentType.Files, ...data } as TContent;
    })
    .filter((t) => !!t);

  return (
    <div
      key={`${currentChat?.id}-${message.createdOn}-${idx * 2}`}
      data-testid="ai-message"
    >
      {message.contents.map((c, mId) => {
        if (c.type === ContentType.Text)
          return (
            <Markdown
              key={`${idx}_${c.type}_${mId}`}
              chatMessage={c.text}
              isFirst={mId === 0}
              openLink={openLink}
              openFile={openFile}
            />
          );

        if (c.type === ContentType.Tool)
          return (
            <ToolCallMessage
              key={`${c.name}_${mId * 2}`}
              content={c}
              openLink={openLink}
              openFile={openFile}
            />
          );

        return null;
      })}
      {files.length ? (
        <Files
          files={files}
          getIcon={getIcon}
          reverse
          openFile={openFile}
        />
      ) : null}
      {message.id ? (
        <Buttons
          text={fullText}
          chatName={currentChat?.title}
          isLast={isLast}
          messageId={message.id}
          messageIndex={idx}
          getIcon={getIcon}
          getResultStorageId={getResultStorageId}
          openFile={openFile}
        />
      ) : null}
    </div>
  );
};

export default observer(Message);
