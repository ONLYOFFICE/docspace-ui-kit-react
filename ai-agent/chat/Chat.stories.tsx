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
import type { Meta, StoryObj } from "@storybook/react";

import Chat from "./index";
import type { ChatProps } from "./Chat.types";
import ApiProvider from "../../providers/api/ApiProvider";
import { SocketProvider } from "../../providers/socket/SocketProvider";

const meta: Meta<typeof Chat> = {
  title: "AI-Agent/Chat",
  component: Chat,
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => {
      return (
        <ApiProvider
          url={import.meta.env.STORYBOOK_AI_API_URL}
          apiKey={import.meta.env.STORYBOOK_AI_API_KEY}
        >
          <SocketProvider
            // url={import.meta.env.STORYBOOK_AI_SOCKET_URL}
            // token={import.meta.env.STORYBOOK_AI_API_KEY}
          >
            <Story />
          </SocketProvider>
        </ApiProvider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof Chat>;

const defaultProps: ChatProps = {
  roomId: 229754,
  userAvatar: "",
  selectedModel: "gpt-4o",
  getIcon: () => "",
  getResultStorageId: () => null,
  aiReady: true,
  attachmentFile: null,
  clearAttachmentFile: () => {},
  toolsSettings: {
    servers: [],
    MCPTools: new Map(),
    webSearchAvailable: true,
    webSearchEnabled: false,
    isFetched: true,
    knowledgeSearchToolName: "knowledge_search",
    webSearchToolName: "web_search",
    webCrawlingToolName: "web_crawling",
    generateDocxToolName: "generate_doc",
    generatePresentationToolName: "generate_doc",
    generateFormToolName: "generate_doc",
    setServers: () => {},
    setMCPTools: () => {},
    setWebSearchEnabled: () => {},
    setIsFetched: () => {},
    fetchTools: async () => {},
    initTools: async () => {},
  },
  initChats: {
    isLoading: false,
    isRequestRunning: false,
    chats: [],
    totalChats: 0,
    fetchChats: async () => {},
  },
  messagesSettings: {
    messages: [],
    chatId: "",
    total: 0,
  },
  folderFormValidation: /^[a-zA-Z0-9 ]+$/,
  isAdmin: true,
};

export const Default: Story = {
  args: defaultProps,
};

export const WithInternalScroll: Story = {
  args: {
    ...defaultProps,
    useInternalScroll: true,
    width: "600px",
    height: "500px",
  },
};

export const WithCustomStyles: Story = {
  args: {
    ...defaultProps,
    useInternalScroll: true,
    width: "600px",
    height: "500px",
    style: {
      border: "2px solid #4A90E2",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    },
  },
};
