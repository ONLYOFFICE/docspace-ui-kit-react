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

import React from "react";
import { observer } from "mobx-react";

import { MessageStoreContextProvider } from "./store/messageStore";
import { ChatStoreContextProvider, useChatStore } from "./store/chatStore";

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
    toolsSettings,
    isAdmin = false,
    standalone = false,
    aiReady = false,
    getResultStorageId,
    folderFormValidation,
    multimodal,
    goToAISettings,
    goToWebSearchSettings,
    setAiPlaylistImages,
    setMediaViewerVisible,
    useInternalScroll = false,
    persistDraft = false,
    allowExternalNavigation,
    allowAttachFiles,
    allowManageTools,
    allowSelectChat,
    onSendMessage,
    onStopStream,
    onNewChat,
  }: ChatCoreProps) => {
    const { currentChat } = useChatStore();

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
          folderFormValidation={folderFormValidation}
          allowExternalNavigation={allowExternalNavigation}
          allowSelectChat={allowSelectChat}
          onNewChat={onNewChat}
        />
        {showEmptyScreen ? (
          <ChatNoAccessScreen
            aiReady={aiReady}
            standalone={standalone}
            isPortalAdmin={isAdmin}
            goToAISettings={goToAISettings}
            allowExternalNavigation={allowExternalNavigation}
          />
        ) : (
          <>
            <ChatMessageBody
              userAvatar={userAvatar}
              isLoading={isLoadingChat}
              getIcon={getIcon}
              getResultStorageId={getResultStorageId}
              folderFormValidation={folderFormValidation}
              setAiPlaylistImages={setAiPlaylistImages}
              setMediaViewerVisible={setMediaViewerVisible}
              useInternalScroll={useInternalScroll}
              allowExternalNavigation={allowExternalNavigation}
            />
            <ChatFooter
              attachmentFile={attachmentFile}
              clearAttachmentFile={clearAttachmentFile}
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
              allowExternalNavigation={allowExternalNavigation}
              allowAttachFiles={allowAttachFiles}
              allowManageTools={allowManageTools}
              onSendMessage={onSendMessage}
              onStopStream={onStopStream}
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
    useInternalScroll = false,
    width,
    height,
    style,
    aiReady = false,
    standalone = false,
    isAdmin = false,
    goToAISettings,
    allowExternalNavigation,
    toolsSettings,
  } = props;

  const hasChats = initChats?.chats?.length > 0;

  if (!isLoadingChat && !aiReady && !hasChats) {
    return (
      <ChatContainer
        isLoadingChat={isLoadingChat}
        useInternalScroll={useInternalScroll}
        width={width}
        height={height}
        style={style}
      >
        <ChatNoAccessScreen
          aiReady={aiReady}
          standalone={standalone}
          isPortalAdmin={isAdmin}
          goToAISettings={goToAISettings}
          allowExternalNavigation={allowExternalNavigation}
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
        generatePresentationToolName={toolsSettings.generatePresentationToolName}
        onStreamData={props.onStreamData}
      >
        <ChatContainer
          isLoadingChat={isLoadingChat}
          useInternalScroll={useInternalScroll}
          width={width}
          height={height}
          style={style}
        >
          <ChatUI {...props} />
        </ChatContainer>
      </MessageStoreContextProvider>
    </ChatStoreContextProvider>
  );
};

const ChatInternalInit = (props: ChatInternalInitProps) => {
  const {
    agentId,
    multimodal,
    isLoading,
    getIcon: getIconProp,
  } = props;

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

  React.useEffect(() => {
    if (!agentId) return;

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
  }, [agentId]);

  React.useEffect(() => {
    const onSelectChat = async () => {
      await initMessages();
    };

    window.addEventListener("select-chat", onSelectChat);
    return () => window.removeEventListener("select-chat", onSelectChat);
  }, []);

  return (
    <ChatCore
      {...props}
      getIcon={getIcon}
      initChats={initChats}
      messagesSettings={messagesSettings}
      toolsSettings={toolsSettings}
      multimodal={multimodal}
      isLoadingChat={isLoading || !isInitialized || isLoadingGetIcon}
      aiReady={!!aiConfig?.aiReady}
      selectedModel={chatSettings?.modelId ?? ""}
    />
  );
};

const ChatExternalInit = (props: ChatExternalInitProps) => {
  const { isLoading, agentId, getIcon: getIconProp } = props;
  const { getIcon, isLoading: isLoadingGetIcon } = useGetIcon(getIconProp);
  const isLoadingChat = isLoading || !agentId || isLoadingGetIcon;

  return <ChatCore {...props} getIcon={getIcon} isLoadingChat={isLoadingChat} />;
};

const Chat = (props: ChatProps) => {
  const { internalInit, ...rest } = props;

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
