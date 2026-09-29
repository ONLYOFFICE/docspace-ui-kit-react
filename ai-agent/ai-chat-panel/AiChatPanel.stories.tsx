import { useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { observer } from "mobx-react";

import { Button, ButtonSize } from "../../components/button";
import { Text } from "../../components/text";

import { useIsAiChatAvailable, type SuggestionSet } from "../providers";
import {
  type AiChatStoryProviderProps,
  withAiSetup,
} from "../storybook-helpers/withAiSetup";

import type { ChatNoAccessScreenProps } from "../new-chat/components/chat-no-access-screen";

import { useAiChatPanel, useOpenAiChat } from ".";
import styles from "./AiChatPanel.stories.module.scss";

type ChatFrameProps = {
  aiReady?: boolean;
  noAccessProps?: ChatNoAccessScreenProps;
};

/**
 * The chat and nothing around it. `useAiChatPanel` hands a host the panel
 * content and the state to place it by; here it goes straight into a frame
 * that draws the surface the client's info panel would, and is opened on
 * mount with the package's own opener -- the same call an "Ask AI" action
 * makes -- so every story starts on the chat rather than on a button.
 */
const ChatFrame = observer(({ aiReady, noAccessProps }: ChatFrameProps) => {
  const { chatPanelContent, isChatPanelVisible, isChatPanelFullscreen } =
    useAiChatPanel(true, { aiReady, noAccessProps });

  // `canUseAi && isAvailable`: what a host checks before offering AI at all.
  const isAiAvailable = useIsAiChatAvailable();
  const openChat = useOpenAiChat();

  useEffect(() => {
    if (isAiAvailable) openChat();
  }, [isAiAvailable, openChat]);

  let body: React.ReactNode = chatPanelContent;

  if (!isAiAvailable) {
    body = (
      <div className={styles.closed}>
        <Text fontSize="13px">
          AI is not offered to this session, so a host renders no chat here.
          Turn on <b>canUseAi</b> and <b>isAvailable</b> in the controls.
        </Text>
      </div>
    );
  } else if (!isChatPanelVisible) {
    // The panel's own close button was pressed.
    body = (
      <div className={styles.closed}>
        <Text fontSize="13px">The chat is closed.</Text>
        <Button
          label="Open chat"
          size={ButtonSize.small}
          primary
          onClick={openChat}
        />
      </div>
    );
  }

  return (
    <div
      className={styles.frame}
      data-fullscreen={isChatPanelFullscreen ? "true" : "false"}
      data-testid="ai-chat-frame"
    >
      {body}
    </div>
  );
});

type StoryArgs = ChatFrameProps & {
  /** Language of the chat widget, which also sets its direction: `ar-SA`, `he` and `ur` read right to left. */
  locale: string;
  /** Whether the session may reach the AI API at all. `false` is an anonymous or AI-barred session. */
  canUseAi: boolean;
  /** Whether this view offers AI. With `canUseAi`, it is what `useIsAiChatAvailable()` returns. */
  isAvailable: boolean;
};

const meta: Meta<StoryArgs> = {
  title: "Components/AI Chat",
  component: ChatFrame,
  tags: ["!autodocs"],
  parameters: {
    docs: {
      description: {
        component: `The AI chat of ONLYOFFICE Apps: a conversation with the portal's AI models, about the files and rooms the user is working in.

### Features

- **One panel for every section** — \`useAiChatPanel\` returns the panel content and its state; the host decides where it goes
- **Suggestions** — chips on the empty chat, chosen by what the composer holds
- **Model picker** — interactive by default, or hidden when the host fixes the model
- **Read-only sessions** — the composer can be disabled with a note above it
- **Not-configured screen** — a portal with no AI profile gets a branded screen with the way to set one up
- **Right to left** — the widget follows its locale's direction

### Usage

\`\`\`tsx
import { observer } from "mobx-react";

import AiAgentProviders from "@onlyoffice/apps-ui-kit/ai-agent/providers";
import { useAiChatPanel } from "@onlyoffice/apps-ui-kit/ai-agent/ai-chat-panel";

const ChatPanel = observer(() => {
  const { chatPanelContent, isChatPanelVisible } = useAiChatPanel();
  return isChatPanelVisible ? <aside>{chatPanelContent}</aside> : null;
});

<AiAgentProviders locale="en" isAvailable>
  <ChatPanel />
</AiAgentProviders>;
\`\`\``,
      },
    },
  },
  argTypes: {
    locale: {
      control: "select",
      options: ["en", "de", "fr", "ar-SA", "ja-JP"],
      description: "Language of the chat widget; also sets its direction",
      table: { defaultValue: { summary: "en" } },
    },
    canUseAi: {
      control: "boolean",
      description: "Whether the session may reach the AI API at all",
      table: { defaultValue: { summary: "true" } },
    },
    isAvailable: {
      control: "boolean",
      description: "Whether this view offers AI",
      table: { defaultValue: { summary: "false" } },
    },
    aiReady: {
      control: "boolean",
      description:
        "Whether the portal has a usable AI profile; `false` with `noAccessProps` shows the not-configured screen",
    },
    noAccessProps: {
      control: "object",
      description:
        "Wiring for the not-configured screen: who the user is and where its buttons lead",
    },
  },
  args: {
    locale: "en",
    canUseAi: true,
    isAvailable: true,
    aiReady: true,
  },
  // Mounts AiAgentProviders against the portal picked in the API Config
  // toolbar, or against the demo portal when none is configured;
  // `parameters.aiChat` adds each story's scenario props.
  decorators: [withAiSetup],
};

export default meta;

type Story = StoryObj<StoryArgs>;

const withChat = (aiChat: AiChatStoryProviderProps) => ({ aiChat });

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "A chat ready to use: the welcome screen, the composer, and the model picker in the composer's footer. Type a message to see a reply stream in.",
      },
      source: {
        code: `<AiAgentProviders locale="en" isAvailable>
  <ChatPanel />
</AiAgentProviders>`,
      },
    },
  },
};

const FILES_SUGGESTIONS: SuggestionSet = {
  default: [
    {
      name: "Summarize my recent files",
      prompt: "Summarize the documents I changed this week.",
    },
    {
      name: "Draft a document",
      prompt: "Draft a one-page project brief for a new client.",
    },
    {
      name: "Find a file",
      prompt: "Find the latest version of the quarterly report.",
    },
  ],
  singleFile: [
    { name: "Summarize this file", prompt: "Summarize the attached file." },
    {
      name: "List the action items",
      prompt: "List the action items in the attached file.",
    },
  ],
};

export const WithSuggestions: Story = {
  parameters: {
    ...withChat({ suggestions: FILES_SUGGESTIONS }),
    docs: {
      description: {
        story:
          "Chips on the empty chat, which put their prompt into the composer. The host passes a `SuggestionSet`: `default` for an empty composer, `singleFile` once one file is attached, `multipleFiles` for more — the provider switches between them itself, since only it sees the attachments.",
      },
      source: {
        code: `const suggestions: SuggestionSet = {
  default: [
    { name: "Summarize my recent files", prompt: "Summarize the documents I changed this week." },
    { name: "Draft a document", prompt: "Draft a one-page project brief for a new client." },
  ],
  singleFile: [
    { name: "Summarize this file", prompt: "Summarize the attached file." },
  ],
};

<AiAgentProviders locale="en" isAvailable suggestions={suggestions}>
  <ChatPanel />
</AiAgentProviders>`,
      },
    },
  },
};

export const WithoutModelPicker: Story = {
  parameters: {
    ...withChat({ hideProfilePicker: true }),
    docs: {
      description: {
        story:
          "The host fixes the model and shows nothing about it: `hideProfilePicker` removes the picker entirely, label included. For an embedded chat that always talks to one assistant.",
      },
      source: {
        code: `<AiAgentProviders locale="en" isAvailable hideProfilePicker>
  <ChatPanel />
</AiAgentProviders>`,
      },
    },
  },
};

export const ReadOnly: Story = {
  parameters: {
    ...withChat({
      composerDisabled: true,
      composerHeader: (
        <Text fontSize="12px" style={{ padding: "0 4px 8px" }}>
          You have view-only access to this room, so you can read the chat but
          not send messages.
        </Text>
      ),
    }),
    docs: {
      description: {
        story:
          "The history can be read but nothing sent: `composerDisabled` locks the composer, and `composerHeader` puts the reason above it.",
      },
      source: {
        code: `<AiAgentProviders
  locale="en"
  isAvailable
  composerDisabled
  composerHeader={<Text fontSize="12px">You have view-only access to this room.</Text>}
>
  <ChatPanel />
</AiAgentProviders>`,
      },
    },
  },
};

export const NotConfigured: Story = {
  args: {
    aiReady: false,
    noAccessProps: {
      standalone: false,
      isPortalAdmin: true,
      isCardLinkedToPortal: true,
      onActivateAI: fn(),
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "A cloud portal with AI not active yet, seen by its admin: **Activate** turns it on. The button is there only because the host passes `onActivateAI` (with a linked card; without one it passes `onTopUpAndActivateAI` and the button reads **Top up and activate**). It takes both `aiReady: false` and `noAccessProps` — with the first alone the body stays empty.",
      },
      source: {
        code: `const { chatPanelContent } = useAiChatPanel(true, {
  aiReady: false,
  noAccessProps: {
    standalone: false,
    isPortalAdmin: true,
    isCardLinkedToPortal: true,
    onActivateAI: () => activateAi(),
  },
});`,
      },
    },
  },
};

export const NotConfiguredOnServer: Story = {
  args: {
    aiReady: false,
    noAccessProps: {
      standalone: true,
      isPortalAdmin: true,
      goToAISettings: fn(),
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "A server installation with no AI provider connected, seen by its admin: **Go to settings** leads to where one is added. Without `goToAISettings` the screen has no button.",
      },
      source: {
        code: `const { chatPanelContent } = useAiChatPanel(true, {
  aiReady: false,
  noAccessProps: {
    standalone: true,
    isPortalAdmin: true,
    goToAISettings: () => navigate("/portal-settings/ai"),
  },
});`,
      },
    },
  },
};

export const NotConfiguredForUser: Story = {
  args: {
    aiReady: false,
    noAccessProps: { standalone: false, isPortalAdmin: false },
  },
  parameters: {
    docs: {
      description: {
        story:
          "The same portal, seen by someone who is not an admin: nothing to set up, so the screen tells them to ask their administrator.",
      },
      source: {
        code: `const { chatPanelContent } = useAiChatPanel(true, {
  aiReady: false,
  noAccessProps: { standalone: false, isPortalAdmin: false },
});`,
      },
    },
  },
};

export const RightToLeft: Story = {
  args: { locale: "ar-SA" },
  globals: { direction: "rtl" },
  parameters: {
    docs: {
      description: {
        story:
          "An Arabic chat: `locale` sets the widget's own strings, such as the note under the composer, and the page's direction (`globals.direction`) mirrors the layout. The texts the kit passes in — the welcome line, the placeholder — come from the host's translations, and this Storybook loads English only, so they stay in English here. Kept off the docs page: the kit sets the direction on the whole document.",
      },
      source: {
        code: `<AiAgentProviders locale="ar-SA" isAvailable>
  <ChatPanel />
</AiAgentProviders>`,
      },
    },
  },
};
