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

import React, { type KeyboardEvent } from "react";
import classNames from "classnames";
import { observer } from "mobx-react";

import type { TFile } from "../../../..//types";
import { RectangleSkeleton } from "../../../../components/rectangle";

import { Textarea } from "../../../../components/textarea";
import { Text } from "../../../../components/text";

import { useMessageStore } from "../../store/messageStore";
import { useChatStore } from "../../store/chatStore";

import type { ChatInputProps } from "../../Chat.types";

import Attachment from "./attachment";
import FilesList from "./files-list";
import Buttons from "./buttons";
import ChatSamples from "./samples";

import styles from "./ChatInput.module.scss";
import { useCommonTranslation } from "../../../../utils/i18n";

const ChatInput = ({
  getIcon,
  isLoading,
  attachmentFile,
  clearAttachmentFile,
  hideAttachments,
  selectedModel,
  toolsSettings,
  isPortalAdmin,
  aiReady,
  multimodal,
  goToWebSearchSettings,
  persistDraft = false,
  openFile,
  allowAttachFiles,
  allowManageTools,
  onSendMessage,
  onStopStream,
  withSamples,
  samples,
}: ChatInputProps) => {
  const t = useCommonTranslation();
  const {
    startChat,
    sendMessage,
    currentChatId,
    isRequestRunning,
    agentId,
    messages,
  } = useMessageStore();
  const { fetchChat, currentChat } = useChatStore();

  const [value, setValue] = React.useState("");
  const [selectedFiles, setSelectedFiles] = React.useState<Partial<TFile>[]>(
    [],
  );
  const [isFilesSelectorVisible, setIsFilesSelectorVisible] =
    React.useState(false);

  const prevSession = React.useRef<string>(null);

  const saveChangesToStorage = React.useCallback(
    (value: string | null, selectedFiles: Partial<TFile>[]) => {
      if (!agentId || !persistDraft) return;

      const localStorageId = `chat-${agentId}`;

      const saved = localStorage.getItem(localStorageId);

      const parsedSaved = saved ? JSON.parse(saved) : {};

      const currentChat = currentChatId || "empty";

      const obj: Record<string, Record<string, unknown>> = {
        ...parsedSaved,
      };

      obj[currentChat] = {
        value: value === null ? obj[currentChat]?.value || "" : value || "",
        selectedFiles: selectedFiles.length
          ? selectedFiles
          : obj[currentChat]?.selectedFiles || [],
        time: Date.now(),
      };

      if (!value && !selectedFiles.length) {
        delete obj[currentChat];
      }

      localStorage.setItem(localStorageId, JSON.stringify(obj));
    },
    [currentChatId, agentId, persistDraft],
  );

  const handleSelectFile = React.useCallback(
    (file: Partial<TFile>[]) => {
      saveChangesToStorage(null, file);
      setSelectedFiles(file);
    },
    [saveChangesToStorage],
  );

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;

    if (val === "\n") {
      return;
    }

    setValue(val);

    saveChangesToStorage(val, selectedFiles);
  };

  const handleRemoveFile = (file: Partial<TFile>) => {
    handleSelectFile(selectedFiles.filter((f) => f.id !== file.id));
  };

  const sendMessageAction = React.useCallback(async () => {
    if (!value.trim()) return;

    try {
      if (!currentChatId) {
        startChat(value, selectedFiles);
      } else {
        sendMessage(value, selectedFiles);
      }

      onSendMessage?.(value, selectedFiles);

      setValue("");
      if (!hideAttachments) {
        setSelectedFiles([]);
        saveChangesToStorage("", []);
      } else {
        saveChangesToStorage("", selectedFiles);
      }
    } catch (e) {
      console.error(e);
    }
  }, [
    currentChatId,
    startChat,
    sendMessage,
    saveChangesToStorage,
    value,
    selectedFiles,
    onSendMessage,
    hideAttachments,
  ]);

  const onKeyEnter = React.useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();

        if (!isRequestRunning) {
          sendMessageAction();
        }
      }
    },
    [sendMessageAction, isRequestRunning],
  );

  const showFilesSelector = () => {
    setIsFilesSelectorVisible(true);
  };
  const hideFilesSelector = () => setIsFilesSelectorVisible(false);

  const toggleFilesSelector = () => {
    if (isFilesSelectorVisible) {
      hideFilesSelector();
    } else {
      showFilesSelector();
    }
  };

  React.useEffect(() => {
    if (!persistDraft) return;

    if (currentChatId && !currentChat) {
      fetchChat(currentChatId);
    }

    if (!agentId) return;

    if (prevSession.current === currentChatId) {
      return;
    }

    prevSession.current = currentChatId;

    const localStorageId = `chat-${agentId}`;

    const saved = localStorage.getItem(localStorageId);

    const currentChatName = currentChatId || "empty";

    const parsedSaved: Record<string, Record<string, unknown>> = saved
      ? JSON.parse(saved)
      : {};

    if (Object.keys(parsedSaved).length === 0) {
      setValue("");
      setSelectedFiles([]);

      return;
    }

    // Validate and remove items older than 5 minutes
    const FIVE_MINUTES = 5 * 60 * 1000;
    const now = Date.now();
    const validatedSaved: Record<string, Record<string, unknown>> = {};

    for (const [key, item] of Object.entries(parsedSaved)) {
      const time = (item.time as number) || 0;
      if (now - time < FIVE_MINUTES) {
        validatedSaved[key] = item;
      }
    }

    // Update localStorage with validated items
    if (
      Object.keys(validatedSaved).length !== Object.keys(parsedSaved).length
    ) {
      localStorage.setItem(localStorageId, JSON.stringify(validatedSaved));
    }

    if (validatedSaved[currentChatName]) {
      setValue(validatedSaved[currentChatName].value as string);

      setSelectedFiles(
        validatedSaved[currentChatName].selectedFiles as Partial<TFile>[],
      );
    } else {
      setValue("");
      setSelectedFiles([]);
    }
  }, [agentId, currentChatId, currentChat, fetchChat, persistDraft]);

  React.useEffect(() => {
    if (attachmentFile) {
      setTimeout(() => {
        const file = [
          {
            id: Number(attachmentFile.id),
            title: attachmentFile.title,
            fileExst: attachmentFile.fileExst,
            viewUrl: attachmentFile.viewUrl,
          },
        ];
        handleSelectFile(file);
        if (!hideAttachments) {
          clearAttachmentFile?.();
        }
      }, 0);
    }
  }, [attachmentFile, handleSelectFile, clearAttachmentFile, hideAttachments]);

  const handleSampleSelect = (sample: string) => {
    setValue(sample);
  };

  return (
    <>
      {withSamples && samples && samples.length > 0 && messages.length === 0 ? (
        <ChatSamples samples={samples} onSelect={handleSampleSelect} />
      ) : null}
      <div className={classNames(styles.chatInput, "chat-input")}>
        {isLoading ? (
          <RectangleSkeleton width="100%" height="116px" borderRadius="3px" />
        ) : (
          <>
            <Textarea
              onChange={handleChange}
              value={value}
              isFullHeight
              className={classNames(styles.chatInputTextArea, {
                [styles.disabled]: !aiReady,
              })}
              wrapperClassName={classNames({
                [styles.chatInputTextAreaWrapper]: true,
                [styles.chatInputTextAreaWrapperFiles]:
                  selectedFiles.length > 0 && !hideAttachments,
              })}
              placeholder={t("AskAnyQuestion")}
              isChatMode
              fontSize={15}
              isDisabled={!aiReady}
              onKeyDown={onKeyEnter}
              dataTestId="chat-input-textarea"
            />

            {!hideAttachments ? (
              <FilesList
                files={selectedFiles}
                getIcon={getIcon}
                onRemove={handleRemoveFile}
                multimodal={multimodal}
              />
            ) : null}

            <Buttons
              isFilesSelectorVisible={isFilesSelectorVisible}
              toggleFilesSelector={toggleFilesSelector}
              sendMessageAction={sendMessageAction}
              value={value}
              selectedModel={selectedModel}
              toolsSettings={toolsSettings}
              isAdmin={isPortalAdmin}
              aiReady={aiReady}
              goToWebSearchSettings={goToWebSearchSettings}
              openFile={openFile}
              allowAttachFiles={allowAttachFiles}
              allowManageTools={allowManageTools}
              onStopStream={onStopStream}
            />
          </>
        )}
      </div>
      <Attachment
        isVisible={isFilesSelectorVisible}
        toggleAttachment={toggleFilesSelector}
        getIcon={getIcon}
        setSelectedFiles={handleSelectFile}
        multimodal={multimodal}
      />
      {!isLoading ? (
        <Text
          fontSize="10px"
          fontWeight={400}
          className={styles.chatInputText}
          noSelect
        >
          {t("AICanMakeMistakes")}
        </Text>
      ) : null}
    </>
  );
};

export default observer(ChatInput);

