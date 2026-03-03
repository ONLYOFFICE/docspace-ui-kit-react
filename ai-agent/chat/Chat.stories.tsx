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

import { withAgentIdSetup } from "./storybook-helpers/decorators/withAgentIdSetup";
import { Toast } from "../../components/toast";
import { toastr } from "../../components/toast/sub-components/Toastr";

import Chat from "./index";
import type { ChatProps } from "./Chat.types";
import type { TFile } from "../../types";

type StoryArgs = {
  userAvatar?: string;
  folderFormValidation?: RegExp;
  width?: string;
  height?: string;
  persistDraft?: boolean;
  allowExternalNavigation?: boolean;
  allowAttachFiles?: boolean;
  allowManageTools?: boolean;
  allowSelectChat?: boolean;
  onSendMessage?: (message: string, files: Partial<TFile>[]) => void;
  onStopStream?: () => void;
  onStreamData?: (chunk: string) => void;
  onNewChat?: () => void;
  onSelectChat?: (chatId: string) => void;
};

const meta: Meta<StoryArgs> = {
  title: "Components/AI Agent/Chat",
  decorators: [withAgentIdSetup],
  parameters: {
    layout: "fullscreen",
    noPadding: true,
    requireAgentId: true,
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
<Chat agentId={123} />

// Full-featured chat with all options
<Chat
  agentId={123}
  width="100%"
  height="100vh
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
    userAvatar: {
      control: "text",
      description: "URL or path to the user's avatar image",
    },
    folderFormValidation: {
      control: "object",
      description:
        "Regular expression for validating folder names in generated documents",
    },
    width: {
      control: "text",
      description: "Width of the chat container",
      table: { defaultValue: { summary: "100%" } },
    },
    height: {
      control: "text",
      description: "Height of the chat container",
      table: { defaultValue: { summary: "100%" } },
    },
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
      height: "auto",
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
    userAvatar: "",
    folderFormValidation: /^[a-zA-Z0-9 ]+$/,
    persistDraft: false,
    allowExternalNavigation: false,
    allowAttachFiles: false,
    allowManageTools: false,
    allowSelectChat: false,
    width: "100%",
    height: "700px",
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
          "Default chat configuration with basic features. AI responses are streamed in real-time. Agent ID is configured via the setup screen.",
      },
      source: {
        code: `<Chat
  agentId={validatedAgentId}
  userAvatar=""
  folderFormValidation={/^[a-zA-Z0-9 ]+$/}
  onSendMessage={(message, files) => console.log(message, files)}
/>`,
      },
    },
  },
};

export const AllFeaturesEnabled: Story = {
  render: (args: StoryArgs) => <Template {...args} />,
  args: {
    persistDraft: true,
    allowExternalNavigation: true,
    allowAttachFiles: true,
    allowManageTools: true,
    allowSelectChat: true,
    width: "100%",
    height: "700px",
    onSendMessage: (message, files) => {
      toastr.success(
        `Message sent: ${message.substring(0, 50)}${message.length > 50 ? "..." : ""}${files.length > 0 ? ` with ${files.length} file(s)` : ""}`,
      );
    },
    onStopStream: () => {
      toastr.info("Stream stopped");
    },
    onStreamData: (chunk) => {
      console.log("Stream chunk:", chunk);
    },
    onNewChat: () => {
      toastr.success("New chat created");
    },
    onSelectChat: (chatId) => {
      toastr.info(`Chat selected: ${chatId}`);
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Full-featured chat with all capabilities enabled: file attachments, chat management, tool settings, draft persistence, external navigation, and admin features. This configuration showcases the complete functionality of the Chat component.",
      },
      source: {
        code: `<Chat
  agentId={validatedAgentId}
  persistDraft={true}
  allowExternalNavigation={true}
  allowAttachFiles={true}
  allowManageTools={true}
  allowSelectChat={true}
  onSendMessage={(message, files) => console.log(message, files)}
  onStopStream={() => console.log("Stream stopped")}
  onStreamData={(chunk) => console.log(chunk)}
  onNewChat={() => console.log("New chat")}
  onSelectChat={(chatId) => console.log(chatId)}
/>`,
      },
    },
  },
};
