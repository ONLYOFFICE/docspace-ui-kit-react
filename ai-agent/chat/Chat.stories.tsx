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
import React from "react";

import { withAgentIdSetup } from "./storybook-helpers/decorators/withAgentIdSetup";
import { Toast } from "../../components/toast";

import Chat from "./index";
import type { ChatProps } from "./Chat.types";
import type { TFile } from "../../types";

import styles from "./Chat.stories.module.scss";

import { CallbackLogger } from "./storybook-helpers/components/CallbackLogger";

export type StoryArgs = Partial<ChatProps>;

const meta: Meta<typeof Chat> = {
  title: "Components/AI Agent/Chat",
  component: Chat,
  decorators: [
    (Story) => (
      <div className={styles.storyWrapper}>
        <Story />
      </div>
    ),
    withAgentIdSetup,
  ],
  tags: ["!autodocs"],
  parameters: {
    layout: "fullscreen",
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
  height="100vh"
  persistDraft={true}
  allowAttachFiles={true}
  allowManageTools={true}
  allowSelectChat={true}
  openFile={(fileId) => console.log(fileId)}
  openLink={(url) => console.log(url)}
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
    openFile: {
      action: "openFile",
      description:
        "Custom handler for opening files (e.g., generated documents)",
    },
    openLink: {
      action: "openLink",
      description:
        "Custom handler for opening external links in messages and tool results",
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
    withSamples: {
      control: "boolean",
      description: "Show sample prompt suggestions above the input",
      table: { defaultValue: { summary: "false" } },
    },
    samples: {
      control: "object",
      description:
        "Array of sample prompt strings (up to 4) displayed above the input when withSamples is enabled",
    },
    useExternalScroll: {
      control: "boolean",
      description: "Whether to use an external scroll container",
      table: { defaultValue: { summary: "false" } },
    },
    externalScrollRef: {
      control: false,
      description: "Ref to the external scroll container",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Chat>;

const Template = (props: Partial<ChatProps>) => (
  <div
    style={{
      width: "100%",
      height: "auto",
      overflow: "hidden",
      display: "flex",
      border: "4px dashed rgb(208, 213, 221)",
    }}
  >
    <Toast />
    <Chat {...(props as ChatProps)} />
  </div>
);



export const Default: Story = {
  render: (args) => <Template {...args} />,
  args: {
    userAvatar: "",
    persistDraft: false,
    allowAttachFiles: false,
    allowManageTools: false,
    allowSelectChat: false,
    width: "100%",
    height: "700px",
    onSendMessage: (message, files) => {
      console.log("Message sent:", message, files);
    },
    onStopStream: () => {
      console.log("Stream stopped");
    },
    onNewChat: () => {
      console.log("New chat created");
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
  onSendMessage={(message, files) => console.log(message, files)}
/>`,
      },
    },
  },
};

export const AllFeaturesEnabled: Story = {
  render: (args) => <Template {...args} />,
  args: {
    persistDraft: true,
    allowAttachFiles: true,
    allowManageTools: true,
    allowSelectChat: true,
    width: "100%",
    height: "700px",
    onSendMessage: (message, files) => {
      console.log("Message sent:", message, files);
    },
    onStopStream: () => {
      console.log("Stream stopped");
    },
    onStreamData: (chunk) => {
      console.log("Stream chunk:", chunk);
    },
    onNewChat: () => {
      console.log("New chat created");
    },
    onSelectChat: (chatId) => {
      console.log("Chat selected:", chatId);
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Full-featured chat with all capabilities enabled: file attachments, chat management, tool settings, draft persistence. This configuration showcases the complete functionality of the Chat component.",
      },
      source: {
        code: `<Chat
  agentId={validatedAgentId}
  persistDraft={true}
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

export const WithListeners: Story = {
  render: (args) => <CallbackLogger {...args} />,
  args: {
    userAvatar: "",
    persistDraft: true,
    allowAttachFiles: true,
    allowManageTools: true,
    allowSelectChat: true,
    width: "100%",
    height: "100%",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Interactive demonstration of all callback functions. The chat is displayed on the left, while the right panel shows real-time logs of callback events with their parameters. Use the dropdown to filter specific event types.",
      },
      source: {
        code: `<Chat
  agentId={validatedAgentId}
  persistDraft={true}
  allowAttachFiles={true}
  allowManageTools={true}
  allowSelectChat={true}
  onSendMessage={(message, files) => {
    console.log("Message:", message, "Files:", files);
  }}
  onStopStream={() => {
    console.log("Stream stopped");
  }}
  onStreamData={(chunk) => {
    console.log("Stream data:", chunk);
  }}
  onNewChat={() => {
    console.log("New chat created");
  }}
  onSelectChat={(chatId) => {
    console.log("Chat selected:", chatId);
  }}
/>`,
      },
    },
  },
};
export const WithSamples: Story = {
  render: (args) => <Template {...args} />,
  args: {
    width: "100%",
    height: "700px",
    withSamples: true,
    samples: [
      {
        title: "Write an email",
        prompt:
          "Write a professional email to a client updating them on the current project status and next steps",
      },
      {
        title: "Brainstorm ideas",
        prompt:
          "Help me brainstorm 10 creative ideas for improving team productivity and collaboration",
      },
      {
        title: "Explain a concept",
        prompt:
          "Explain the concept of microservices architecture in simple terms with pros and cons",
      },
      {
        title: "Create a to-do list",
        prompt:
          "Create a structured to-do list for planning and launching a new product feature from scratch",
      },
    ],
    onSendMessage: (message, files) => {
      console.log("Message sent:", message, files);
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Chat with sample prompts displayed above the input. Clicking a sample fills the input with the prompt text. Each sample has a `title` (displayed as button label) and a `prompt` (inserted into input on click).",
      },
      source: {
        code: `<Chat
  agentId={validatedAgentId}
  withSamples={true}
  samples={[
    { title: "Write an email", prompt: "Write a professional email to a client..." },
    { title: "Brainstorm ideas", prompt: "Help me brainstorm 10 creative ideas..." },
    { title: "Explain a concept", prompt: "Explain the concept of microservices..." },
    { title: "Create a to-do list", prompt: "Create a structured to-do list..." },
  ]}
  onSendMessage={(message, files) => console.log(message, files)}
/>`,
      },
    },
  },
};

export const ExternalScroll: Story = {
  render: (args: StoryArgs) => {
    const scrollRef = React.useRef<HTMLDivElement>(null);

    return (
      <div
        ref={scrollRef}
        style={{
          width: "100%",
          height: "600px",
          overflowY: "scroll",
          position: "relative",
          border: "4px dashed rgb(208, 213, 221)",
        }}
      >
        <Chat
          {...(args as unknown as ChatProps)}
          useExternalScroll={true}
          externalScrollRef={scrollRef}
          height="auto"
        />
      </div>
    );
  },
  args: {
    width: "100%",
    allowSelectChat: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates integration with an external scroll container. This is useful when the Chat is part of a larger scrollable page or a custom layout where a single scrollbar is desired for multiple sections. Note that `height` should be set to `auto` or not specified to allow the chat to grow within the container.",
      },
    },
  },
};
