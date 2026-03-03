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

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Toast } from "../../components/toast";
import { toastr } from "../../components/toast/sub-components/Toastr";

import Chat from "./index";
import type { ChatProps } from "./Chat.types";
import type { TFile } from "../../types";

type StoryArgs = {
  // Core
  agentId: string | number;
  userAvatar: string;
  selectedModel: string;
  isLoading?: boolean;
  aiReady: boolean;

  // Layout
  width?: string;
  height?: string;
  useInternalScroll?: boolean;

  // Attachments
  attachmentFile: ChatProps["attachmentFile"];
  clearAttachmentFile: () => void;

  // Validation
  folderFormValidation: RegExp;

  // Permissions
  isAdmin?: boolean;
  standalone?: boolean;

  // Features
  persistDraft?: boolean;
  allowExternalNavigation?: boolean;
  allowAttachFiles?: boolean;
  allowManageTools?: boolean;
  allowSelectChat?: boolean;

  // Internal initialization
  internalInit?: boolean;

  // Callbacks
  getResultStorageId: () => number | null;
  onSendMessage?: (message: string, files: Partial<TFile>[]) => void;
  onStopStream?: () => void;
  onStreamData?: (chunk: string) => void;
  onNewChat?: () => void;
  onSelectChat?: (chatId: string) => void;
};

const meta: Meta<StoryArgs> = {
  title: "Components/AI Agent/Chat",
  parameters: {
    docs: {
      description: {
        component: `Chat is a full-featured AI chat interface component for DocSpace.

### Features

- **AI conversation**: Real-time streaming chat
- **Message history**: Persistent chat history with multiple conversations
- **File attachments**: Support for attaching files to messages (when enabled)
- **Tool integration**: Web search, knowledge base, document generation tools
- **Chat management**: Create, rename, delete, and switch between chats
- **Markdown support**: Rich text rendering with code blocks and syntax highlighting
- **Streaming responses**: Real-time AI response streaming
- **Draft persistence**: Optional draft message persistence

### Usage

\`\`\`tsx
import Chat from "@docspace/ui-kit/ai-agent/chat";

// Basic chat
<Chat
  agentId={123}
  userAvatar="/avatar.jpg"
  selectedModel="gpt-4o"
  getResultStorageId={() => null}
  aiReady={true}
  attachmentFile={null}
  clearAttachmentFile={() => {}}
  folderFormValidation={/^[a-zA-Z0-9 ]+$/}
  onSendMessage={(message, files) => console.log(message)}
/>

// Full-featured chat with all options
<Chat
  agentId={123}
  userAvatar="/avatar.jpg"
  getResultStorageId={() => storageId}
  aiReady={true}
  attachmentFile={file}
  clearAttachmentFile={clearFile}
  folderFormValidation={/^[a-zA-Z0-9 ]+$/}
  isAdmin={true}
  standalone={true}
  persistDraft={true}
  allowExternalNavigation={true}
  allowAttachFiles={true}
  allowManageTools={true}
  allowSelectChat={true}
  onSendMessage={handleSend}
  onStopStream={handleStop}
  onStreamData={handleStream}
  onNewChat={handleNewChat}
  onSelectChat={handleSelectChat}
/>
\`\`\``,
      },
    },
  },
  argTypes: {
    // Core
    agentId: {
      control: "text",
      description: "Unique identifier for the AI agent",
    },
    userAvatar: {
      control: "text",
      description: "URL or path to the user's avatar image",
    },
    selectedModel: {
      control: "text",
      description:
        "Currently selected AI model (e.g., 'gpt-4o', 'gpt-3.5-turbo')",
      table: { defaultValue: { summary: "gpt-4o" } },
    },
    isLoading: {
      control: "boolean",
      description: "Loading state for the chat component",
      table: { defaultValue: { summary: "false" } },
    },
    aiReady: {
      control: "boolean",
      description: "Whether the AI service is ready and available",
      table: { defaultValue: { summary: "true" } },
    },

    // Layout
    width: {
      control: "text",
      description: "Width of the chat container",
      table: { defaultValue: { summary: "100%" } },
    },
    height: {
      control: "text",
      description: "Height of the chat container",
      table: { defaultValue: { summary: "100vh" } },
    },
    useInternalScroll: {
      control: "boolean",
      description: "Use internal scrolling for the message list",
      table: { defaultValue: { summary: "true" } },
    },

    // Validation
    folderFormValidation: {
      control: "object",
      description:
        "Regular expression for validating folder names in generated documents",
    },

    // Permissions
    isAdmin: {
      control: "boolean",
      description: "Whether the current user is an administrator",
      table: { defaultValue: { summary: "false" } },
    },
    standalone: {
      control: "boolean",
      description: "Whether the chat is running in standalone mode",
      table: { defaultValue: { summary: "false" } },
    },

    // Features
    persistDraft: {
      control: "boolean",
      description: "Persist draft messages across sessions",
      table: { defaultValue: { summary: "false" } },
    },
    allowExternalNavigation: {
      control: "boolean",
      description: "Allow navigation to external links and resources",
      table: { defaultValue: { summary: "false" } },
    },
    allowAttachFiles: {
      control: "boolean",
      description: "Enable file attachment functionality",
      table: { defaultValue: { summary: "false" } },
    },
    allowManageTools: {
      control: "boolean",
      description: "Allow users to manage AI tools and settings",
      table: { defaultValue: { summary: "false" } },
    },
    allowSelectChat: {
      control: "boolean",
      description: "Enable chat selection and switching",
      table: { defaultValue: { summary: "false" } },
    },

    // Internal initialization
    internalInit: {
      control: "boolean",
      description: "Use internal initialization for chats, messages, and tools",
      table: { defaultValue: { summary: "false" } },
    },

    // Callbacks
    getResultStorageId: {
      action: "getResultStorageId",
      description: "Function to get the storage ID for results",
    },
    onSendMessage: {
      action: "onSendMessage",
      description:
        "Called when a message is sent with the message text and attached files",
    },
    onStopStream: {
      action: "onStopStream",
      description: "Called when the user stops an ongoing AI response stream",
    },
    onStreamData: {
      action: "onStreamData",
      description: "Called with each chunk of streaming data from the AI",
    },
    onNewChat: {
      action: "onNewChat",
      description: "Called when a new chat is created",
    },
    onSelectChat: {
      action: "onSelectChat",
      description: "Called when a different chat is selected",
    },
  },
};

export default meta;

type Story = StoryObj<StoryArgs>;

const Template = (props: StoryArgs) => (
  <div
    style={{
      width: "100%",
      height: "100vh",
      overflow: "hidden",
      display: "flex",
      justifyContent: "center",
    }}
  >
    <Toast />
    <Chat {...(props as unknown as ChatProps)} />
  </div>
);

export const Default: Story = {
  render: (args: StoryArgs) => <Template {...args} />,
  args: {
    internalInit: true,
    agentId: 229754,
    userAvatar: "",
    selectedModel: "gpt-4o",
    getResultStorageId: () => null,
    aiReady: true,
    attachmentFile: null,
    clearAttachmentFile: () => {},
    folderFormValidation: /^[a-zA-Z0-9 ]+$/,
    isAdmin: false,
    persistDraft: false,
    allowExternalNavigation: false,
    allowAttachFiles: false,
    allowManageTools: false,
    allowSelectChat: false,
    width: "100%",
    height: "100vh",
    useInternalScroll: true,
    onSendMessage: (message, files) => {
      toastr.success(
        `Message sent: ${message.substring(0, 50)}${message.length > 50 ? "..." : ""}`,
      );
    },
    onStopStream: () => {
      toastr.info("Stream stopped");
    },
    onNewChat: () => {
      toastr.success("New chat created");
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Default chat configuration with basic features. AI responses are streamed in real-time.",
      },
      source: {
        code: `<Chat
  internalInit
  agentId={229754}
  userAvatar=""
  selectedModel="gpt-4o"
  getResultStorageId={() => null}
  aiReady={true}
  attachmentFile={null}
  clearAttachmentFile={() => {}}
  folderFormValidation={/^[a-zA-Z0-9 ]+$/}
  onSendMessage={(message, files) => console.log(message)}
/>`,
      },
    },
  },
};
