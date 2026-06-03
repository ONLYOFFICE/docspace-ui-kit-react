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
import { observer } from "mobx-react";

import {
  MessageStoreContextProvider,
  useMessageStore,
} from "./store/messageStore";
import { ChatStoreContextProvider, useChatStore } from "./store/chatStore";

import { RecomendedModel } from "../recomended-model";

import styles from "./Chat.module.scss";

import type {
  ChatProps,
  ChatCoreProps,
  ChatInternalInitProps,
  ChatExternalInitProps,
} from "./Chat.types";

import ChatContainer from "./components/chat-container";
import ChatHeader from "./components/chat-header";
import ChatMessageBody from "./components/chat-message-body";
import { ChatNoAccessScreen } from "./components/chat-no-access-screen";
import ChatFooter from "./components/chat-footer";

import { CHAT_SUPPORTED_FORMATS } from "./Chat.constants";
import useInitChats from "./hooks/useInitChats";
import useInitMessages from "./hooks/useInitMessages";
import useToolsSettings from "./hooks/useToolsSettings";
import useAiConfig from "./hooks/useAiConfig";
import useChatSettings from "./hooks/useChatSettings";
import useGetIcon from "./hooks/useGetIcon";

export { CHAT_SUPPORTED_FORMATS };

const ChatUI = observer(
  ({
    isLoadingChat,
    selectedModel,
    getIcon,
    agentId,
    userAvatar,
    attachmentFile,
    clearAttachmentFile,
    hideAttachments,
    toolsSettings,
    isAdmin = false,
    standalone = false,
    aiReady = false,
    getResultStorageId,
    multimodal,
    goToAISettings,
    goToWebSearchSettings,
    emptyScreenText,
    setAiPlaylistImages,
    setMediaViewerVisible,
    persistDraft = false,
    openFile,
    openLink,
    allowAttachFiles,
    allowManageTools,
    allowSelectChat,
    onSendMessage,
    onStopStream,
    onNewChat,
    onSelectChat,
    modelAliases,
    withSamples,
    samples,
    onOpenEdit,
    canEditAgent,
    recomendedModelForForms,
    chatRecomendedModelVisible,
    onCloseRecomendation,
  }: ChatCoreProps) => {
    const { currentChat } = useChatStore();
    const { hasFormAttached } = useMessageStore();

    const showEmptyScreen = !isLoadingChat && !aiReady && !currentChat;

    React.useEffect(() => {
      window.dispatchEvent(
        new CustomEvent("select-chat", {
          detail: {
            chatId: currentChat?.id,
          },
        }),
      );
    }, [currentChat?.id]);

    return (
      <>
        <ChatHeader
          selectedModel={selectedModel}
          isLoading={isLoadingChat}
          getIcon={getIcon}
          getResultStorageId={getResultStorageId}
          agentId={agentId}
          aiReady={aiReady}
          openFile={openFile}
          allowSelectChat={allowSelectChat}
          onNewChat={onNewChat}
          onSelectChat={onSelectChat}
          modelAliases={modelAliases}
        />
        {chatRecomendedModelVisible !== false && hasFormAttached ? (
          <div className={styles.recomendedModelWrapper}>
            <RecomendedModel
              isChat
              isAdmin={!!canEditAgent}
              selectedModel={selectedModel ?? ""}
              recomendedModel={recomendedModelForForms ?? ""}
              onClose={onCloseRecomendation}
              onOpenEdit={onOpenEdit}
            />
          </div>
        ) : null}
        {showEmptyScreen ? (
          <ChatNoAccessScreen
            aiReady={aiReady}
            standalone={standalone}
            isPortalAdmin={isAdmin}
            goToAISettings={goToAISettings}
          />
        ) : (
          <>
            <ChatMessageBody
              userAvatar={userAvatar}
              isLoading={isLoadingChat}
              hideAttachments={hideAttachments}
              emptyScreenText={emptyScreenText}
              getIcon={getIcon}
              getResultStorageId={getResultStorageId}
              setAiPlaylistImages={setAiPlaylistImages}
              setMediaViewerVisible={setMediaViewerVisible}
              openFile={openFile}
              openLink={openLink}
            />
            <ChatFooter
              attachmentFile={attachmentFile}
              clearAttachmentFile={clearAttachmentFile}
              hideAttachments={hideAttachments}
              isLoading={isLoadingChat}
              getIcon={getIcon}
              selectedModel={selectedModel}
              toolsSettings={toolsSettings}
              isPortalAdmin={isAdmin}
              aiReady={aiReady}
              standalone={standalone}
              multimodal={multimodal}
              goToWebSearchSettings={goToWebSearchSettings}
              persistDraft={persistDraft}
              openFile={openFile}
              allowAttachFiles={allowAttachFiles}
              allowManageTools={allowManageTools}
              onSendMessage={onSendMessage}
              onStopStream={onStopStream}
              withSamples={withSamples}
              samples={samples}
            />
          </>
        )}
      </>
    );
  },
);

const ChatCore = (props: ChatCoreProps) => {
  const {
    agentId,
    initChats,
    messagesSettings,
    multimodal,
    isLoadingChat,
    useExternalScroll = false,
    externalScrollRef,
    width,
    height,
    style,
    className,
    aiReady = false,
    standalone = false,
    isAdmin = false,
    goToAISettings,
    toolsSettings,
  } = props;

  const hasChats = initChats?.chats?.length > 0;

  if (!isLoadingChat && !aiReady && !hasChats) {
    return (
      <ChatContainer
        isLoadingChat={isLoadingChat}
        useExternalScroll={useExternalScroll}
        externalScrollRef={externalScrollRef}
        width={width}
        height={height}
        style={style}
        className={className}
      >
        <ChatNoAccessScreen
          aiReady={aiReady}
          standalone={standalone}
          isPortalAdmin={isAdmin}
          goToAISettings={goToAISettings}
        />
      </ChatContainer>
    );
  }

  return (
    <ChatStoreContextProvider agentId={agentId} {...initChats}>
      <MessageStoreContextProvider
        agentId={agentId}
        {...messagesSettings}
        multimodal={multimodal}
        knowledgeSearchToolName={toolsSettings.knowledgeSearchToolName}
        webSearchToolName={toolsSettings.webSearchToolName}
        webCrawlingToolName={toolsSettings.webCrawlingToolName}
        generateDocxToolName={toolsSettings.generateDocxToolName}
        generateFormToolName={toolsSettings.generateFormToolName}
        generatePresentationToolName={
          toolsSettings.generatePresentationToolName
        }
        onStreamData={props.onStreamData}
      >
        <ChatContainer
          isLoadingChat={isLoadingChat}
          useExternalScroll={useExternalScroll}
          externalScrollRef={externalScrollRef}
          width={width}
          height={height}
          style={style}
          className={className}
        >
          <ChatUI {...props} />
        </ChatContainer>
      </MessageStoreContextProvider>
    </ChatStoreContextProvider>
  );
};

const ChatInternalInit = (props: ChatInternalInitProps) => {
  const { agentId, isLoading, getIcon: getIconProp } = props;

  const { aiConfig, fetchAiConfig } = useAiConfig();
  const { chatSettings, fetchChatSettings } = useChatSettings({
    agentId: agentId ?? "",
  });

  const initChats = useInitChats({ agentId: agentId ?? "" });
  const { initMessages, ...messagesSettings } = useInitMessages(agentId ?? "");
  const toolsSettings = useToolsSettings({
    agentId: agentId ?? "",
    aiConfig,
    chatSettings,
  });
  const { getIcon, isLoading: isLoadingGetIcon } = useGetIcon(getIconProp);

  const [isInitialized, setIsInitialized] = React.useState(false);
  const prevAgentIdRef = React.useRef<string | number | null>(null);

  React.useEffect(() => {
    if (!agentId) return;
    if (prevAgentIdRef.current === agentId) return;

    prevAgentIdRef.current = agentId;

    const init = async () => {
      await Promise.all([
        initChats.fetchChats(),
        initMessages(),
        fetchAiConfig(),
        fetchChatSettings(),
        toolsSettings.initTools(),
      ]);
      setIsInitialized(true);
    };

    init();
  }, [
    agentId,
    initChats.fetchChats,
    initMessages,
    fetchAiConfig,
    fetchChatSettings,
    toolsSettings.initTools,
  ]);

  React.useEffect(() => {
    setIsInitialized(false);
  }, [agentId]);

  React.useEffect(() => {
    const onSelectChat = async () => {
      await initMessages();
    };

    window.addEventListener("select-chat", onSelectChat);
    return () => window.removeEventListener("select-chat", onSelectChat);
  }, [initMessages]);

  return (
    <ChatCore
      {...props}
      getIcon={getIcon}
      initChats={initChats}
      messagesSettings={messagesSettings}
      toolsSettings={toolsSettings}
      multimodal={
        chatSettings?.capabilities?.vision !== false
          ? chatSettings?.multimodal
          : undefined
      }
      isLoadingChat={isLoading || !isInitialized || isLoadingGetIcon}
      aiReady={!!aiConfig?.aiReady}
      modelAliases={aiConfig?.modelAliases}
      selectedModel={chatSettings?.modelId ?? ""}
    />
  );
};

const ChatExternalInit = (props: ChatExternalInitProps) => {
  const { isLoading, agentId, getIcon: getIconProp } = props;
  const { getIcon, isLoading: isLoadingGetIcon } = useGetIcon(getIconProp);
  const isLoadingChat = isLoading || !agentId || isLoadingGetIcon;

  return (
    <ChatCore {...props} getIcon={getIcon} isLoadingChat={isLoadingChat} />
  );
};

const Chat = (props: ChatProps) => {
  const { internalInit = true, ...rest } = props;

  if (internalInit) {
    return <ChatInternalInit {...rest} />;
  }

  // For external init, initChats, messagesSettings, and toolsSettings are required
  const { initChats, messagesSettings, toolsSettings } = props;

  if (!initChats || !messagesSettings || !toolsSettings) {
    console.error(
      "Chat: initChats, messagesSettings, and toolsSettings are required when internalInit is false",
    );
    return null;
  }

  return (
    <ChatExternalInit
      {...rest}
      initChats={initChats}
      messagesSettings={messagesSettings}
      toolsSettings={toolsSettings}
    />
  );
};

export default Chat;

