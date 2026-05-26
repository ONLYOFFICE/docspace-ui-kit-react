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
    hideAttachments: {
      control: "boolean",
      description:
        "Hide file and image attachments in chat messages and the input area",
      table: { defaultValue: { summary: "false" } },
    },
    emptyScreenText: {
      control: "text",
      description:
        "Custom text for the empty chat screen. Falls back to the default translation if not provided.",
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

const card: React.CSSProperties = {
  padding: "20px",
  borderRadius: "12px",
  border: "1px solid #e5e7eb",
  background: "#fff",
};

const darkCard: React.CSSProperties = {
  ...card,
  background: "#111118",
  border: "1px solid #27272a",
};

const title: React.CSSProperties = {
  margin: "0 0 4px",
  fontSize: "14px",
  fontWeight: 600,
  color: "#111827",
};

const darkTitle: React.CSSProperties = {
  ...title,
  color: "#e5e7eb",
};

const subtitle: React.CSSProperties = {
  margin: "0 0 16px",
  fontSize: "12px",
  color: "#9ca3af",
  fontWeight: 400,
};

const frame: React.CSSProperties = {
  width: "100%",
  height: "420px",
  overflow: "hidden",
  display: "flex",
  borderRadius: "8px",
  border: "1px solid #e5e7eb",
};

const CssCustomizationTemplate = (props: Partial<ChatProps>) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "20px",
      padding: "20px",
      background: "#f4f4f5",
      minHeight: "100%",
    }}
  >
    {/* 1. Default — no overrides */}
    <div style={card}>
      <h4 style={title}>Default</h4>
      <p style={subtitle}>No CSS variables set</p>
      <div style={frame}>
        <Toast />
        <Chat {...(props as ChatProps)} />
      </div>
    </div>

    {/* 2. Accent only — minimal override */}
    <div style={card}>
      <h4 style={title}>Accent only</h4>
      <p style={subtitle}>
        2 variables: --chat-accent-color, --chat-send-button-background
      </p>
      <div
        style={
          {
            ...frame,
            "--chat-accent-color": "#7c3aed",
            "--chat-send-button-background": "#7c3aed",
          } as React.CSSProperties
        }
      >
        <Chat {...(props as ChatProps)} />
      </div>
    </div>

    {/* 3. Dark theme — full color override */}
    <div style={darkCard}>
      <h4 style={darkTitle}>Dark custom theme</h4>
      <p style={subtitle}>Colors + code blocks + input</p>
      <div
        style={
          {
            ...frame,
            border: "1px solid #27272a",
            "--chat-background": "#18181b",
            "--chat-text-color": "#e4e4e7",
            "--chat-accent-color": "#a78bfa",
            "--chat-message-text-color": "#a1a1aa",
            "--chat-icon-color": "#71717a",
            "--chat-input-background": "#27272a",
            "--chat-input-border-style": "1px solid #3f3f46",
            "--chat-send-button-background": "#a78bfa",
            "--chat-send-button-color": "#18181b",
            "--chat-code-background": "#27272a",
            "--chat-code-border": "1px solid #3f3f46",
            "--chat-header-button-color": "#a1a1aa",
            "--chat-header-button-hover-background-color": "#27272a",
            "--chat-tool-block-background": "#27272a",
            "--chat-divider-color": "#3f3f46",
          } as React.CSSProperties
        }
      >
        <Chat {...(props as ChatProps)} />
      </div>
    </div>

    {/* 4. Shape + spacing — layout override */}
    <div style={card}>
      <h4 style={title}>Rounded & spacious</h4>
      <p style={subtitle}>
        Shape, typography, spacing — no color changes
      </p>
      <div
        style={
          {
            ...frame,
            "--chat-border-radius-base": "20px",
            "--chat-border-radius-small": "14px",
            "--chat-bubble-border-radius": "28px",
            "--chat-bubble-padding": "4px 18px",
            "--chat-font-size": "16px",
            "--chat-line-height": "26px",
            "--chat-message-spacing": "40px",
            "--chat-padding": "28px",
            "--chat-max-width": "560px",
            "--chat-samples-item-padding": "14px 20px",
            "--chat-samples-spacing": "12px",
          } as React.CSSProperties
        }
      >
        <Chat {...(props as ChatProps)} />
      </div>
    </div>

    {/* 5. Full rebrand — every category */}
    <div
      style={{
        ...darkCard,
        gridColumn: "1 / -1",
        background: "#0c0a09",
        border: "1px solid #292524",
      }}
    >
      <h4 style={darkTitle}>Full rebrand — all categories</h4>
      <p style={subtitle}>
        Colors + shape + typography + layout + spacing + sizes
      </p>
      <div
        style={
          {
            ...frame,
            height: "500px",
            border: "1px solid #292524",

            // ── Colors ──
            "--chat-background": "#1c1917",
            "--chat-text-color": "#fafaf9",
            "--chat-accent-color": "#f97316",
            "--chat-icon-color": "#78716c",
            "--chat-message-text-color": "#d6d3d1",
            "--chat-user-message-background": "#f97316",
            "--chat-error-background": "#451a03",
            "--chat-input-background": "#292524",
            "--chat-input-border-style": "1px solid #44403c",
            "--chat-send-button-background": "#f97316",
            "--chat-send-button-color": "#1c1917",
            "--chat-code-background": "#292524",
            "--chat-code-border": "1px solid #44403c",
            "--chat-code-separator-color": "#44403c",
            "--chat-tool-block-background": "#292524",
            "--chat-divider-color": "#44403c",
            "--chat-table-border-color": "#44403c",
            "--chat-blockquote-background": "#f97316",
            "--chat-blockquote-text-color": "#d6d3d1",
            "--chat-source-url-color": "#a8a29e",
            "--chat-source-hover-background": "#292524",
            "--chat-source-pressed-background": "#1c1917",
            "--chat-link-icon-color": "#78716c",
            "--chat-file-border-color": "#44403c",
            "--chat-file-background": "#292524",
            "--chat-file-extension-color": "#78716c",
            "--chat-header-model-text-color": "#78716c",
            "--chat-header-button-color": "#d6d3d1",
            "--chat-header-button-hover-background-color": "#292524",
            "--chat-header-button-active-background-color": "#44403c",
            "--chat-header-button-disabled-text-color": "#57534e",
            "--chat-toolbar-button-color": "#a8a29e",
            "--chat-toolbar-button-disabled-color": "#57534e",
            "--chat-toolbar-button-hover-background": "#292524",
            "--chat-toolbar-button-active-color": "#fafaf9",
            "--chat-toolbar-button-active-background": "#44403c",
            "--chat-placeholder-disabled-color": "#57534e",

            // ── Shape ──
            "--chat-border-radius-base": "16px",
            "--chat-border-radius-small": "10px",
            "--chat-bubble-border-radius": "24px",

            // ── Typography ──
            "--chat-font-size": "14px",
            "--chat-line-height": "22px",

            // ── Layout ──
            "--chat-max-width": "800px",
            "--chat-padding": "24px",
            "--chat-message-spacing": "28px",
            "--chat-bubble-padding": "2px 14px",
            "--chat-header-padding-value": "12px 0",
            "--chat-header-height": "44px",
            "--chat-header-spacing": "12px",
            "--chat-input-height": "36px",
            "--chat-samples-spacing": "10px",
            "--chat-samples-item-padding": "12px 16px",
            "--chat-samples-bottom-margin": "16px",

            // ── Spacing scale ──
            "--chat-spacing-extra-small": "3px",
            "--chat-spacing-small": "5px",
            "--chat-spacing-base-value": "7px",
            "--chat-spacing-medium": "10px",
            "--chat-spacing-large": "14px",

            // ── Element sizes ──
            "--chat-button-height": "28px",
            "--chat-icon-extra-small": "10px",
            "--chat-icon-small": "14px",
            "--chat-icon-medium": "28px",
            "--chat-image-thumbnail-size": "72px",
            "--chat-file-item-width": "260px",

            // ── Component-specific ──
            "--chat-content-block-margin": "6px 0",
            "--chat-code-block-max-height": "360px",
            "--chat-table-cell-inner-padding": "6px 10px",
            "--chat-table-column-width": "150px",
            "--chat-error-inner-padding": "6px",
            "--chat-blockquote-inner-padding": "4px 10px",
            "--chat-info-block-inner-padding": "10px 14px",
          } as React.CSSProperties
        }
      >
        <Chat {...(props as ChatProps)} />
      </div>
    </div>
  </div>
);

export const CssCustomization: Story = {
  render: (args) => <CssCustomizationTemplate {...args} />,
  args: {
    width: "100%",
    height: "100%",
  },
  parameters: {
    docs: {
      description: {
        story: `Chat can be customized via CSS Custom Properties on a parent element.

**Available variables:**

**Colors:**

| Variable | Default | Description |
|----------|---------|-------------|
| \`--chat-background\` | white / black | Container background |
| \`--chat-text-color\` | black / white | Main text color |
| \`--chat-accent-color\` | blue | Accent (links, user bubble, send button) |
| \`--chat-icon-color\` | gray | Icon button color |
| \`--chat-message-text-color\` | gray | Message body text |
| \`--chat-user-message-background\` | accent | User message bubble background |
| \`--chat-error-background\` | red-tint | Error message background |
| \`--chat-input-background\` | light-gray | Input area background |
| \`--chat-input-border-style\` | unset | Input area border |
| \`--chat-send-button-background\` | accent | Send button background |
| \`--chat-send-button-color\` | white | Send button icon color |
| \`--chat-code-background\` | white | Code block background |
| \`--chat-code-border\` | 1px solid | Code block border |
| \`--chat-tool-block-background\` | light-gray | Tool call block background |
| \`--chat-divider-color\` | gray | Horizontal rule color |
| \`--chat-header-button-color\` | text-color | Header button icon |
| \`--chat-header-button-hover-background-color\` | light-gray | Header button hover |

**Shape:**

| Variable | Default | Description |
|----------|---------|-------------|
| \`--chat-border-radius-base\` | 6px | Default border-radius |
| \`--chat-border-radius-small\` | 3px | Small border-radius |
| \`--chat-bubble-border-radius\` | 16px | User message bubble radius |

**Typography:**

| Variable | Default | Description |
|----------|---------|-------------|
| \`--chat-font-size\` | 15px | Message font size |
| \`--chat-line-height\` | 22px | Message line height |

**Layout:**

| Variable | Default | Description |
|----------|---------|-------------|
| \`--chat-max-width\` | 700px | Content max-width |
| \`--chat-padding\` | 20px | Content padding |
| \`--chat-message-spacing\` | 32px | Gap between messages |
| \`--chat-bubble-padding\` | 0 12px | User bubble inner padding |
| \`--chat-header-height\` | 48px | Header min-height |
| \`--chat-header-spacing\` | 16px | Header elements gap |
| \`--chat-input-height\` | 40px | Input field min-height |
| \`--chat-samples-spacing\` | 8px | Samples grid gap |
| \`--chat-samples-item-padding\` | 10px 12px | Sample button padding |

**Spacing scale:**

| Variable | Default | Description |
|----------|---------|-------------|
| \`--chat-spacing-extra-small\` | 4px | Micro spacing |
| \`--chat-spacing-small\` | 6px | Small spacing |
| \`--chat-spacing-base\` | 8px | Base spacing unit |
| \`--chat-spacing-medium\` | 12px | Medium spacing |
| \`--chat-spacing-large\` | 16px | Large spacing |

**Element sizes:**

| Variable | Default | Description |
|----------|---------|-------------|
| \`--chat-button-height\` | 32px | Standard button height |
| \`--chat-icon-extra-small\` | 12px | Tiny icon size |
| \`--chat-icon-small\` | 16px | Small icon size |
| \`--chat-icon-medium\` | 32px | Default icon size |
| \`--chat-image-thumbnail-size\` | 80px | Image preview size |
| \`--chat-file-item-width\` | 300px | File item max-width |`,
      },
      source: {
        code: `// Minimal: just change accent color
<div style={{ "--chat-accent-color": "#7c3aed", "--chat-send-button-background": "#7c3aed" }}>
  <Chat agentId={123} />
</div>

// Full dark theme
<div style={{
  "--chat-background": "#18181b",
  "--chat-text-color": "#e4e4e7",
  "--chat-accent-color": "#a78bfa",
  "--chat-input-background": "#27272a",
  "--chat-input-border-style": "1px solid #3f3f46",
  "--chat-send-button-background": "#a78bfa",
  "--chat-send-button-color": "#18181b",
  "--chat-code-background": "#27272a",
  "--chat-code-border": "1px solid #3f3f46",
}}>
  <Chat agentId={123} />
</div>

// Shape + spacing only (no color changes)
<div style={{
  "--chat-border-radius-base": "14px",
  "--chat-bubble-border-radius": "22px",
  "--chat-font-size": "16px",
  "--chat-message-spacing": "40px",
}}>
  <Chat agentId={123} />
</div>`,
      },
    },
  },
};
