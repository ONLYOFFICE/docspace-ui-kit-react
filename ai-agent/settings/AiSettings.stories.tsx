import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen, waitFor } from "storybook/test";

import { withAiSetup } from "../storybook-helpers/withAiSetup";

import { AiModels, McpServers, ModelAssignment, WebSearch } from ".";
import styles from "./AiSettings.stories.module.scss";

type StoryArgs = {
  /** Language of the settings pages, which also sets their direction. */
  locale: string;
  /** Read by `withAiSetup`; the settings pages render whatever it is. */
  canUseAi: boolean;
  /** Read by `withAiSetup`; the settings pages render whatever it is. */
  isAvailable: boolean;
};

/**
 * The page on the surface a portal's settings section would give it: the
 * pages come with `hideHeader` and `noPadding`, so the host draws both.
 */
const SettingsFrame = ({ children }: { children: React.ReactNode }) => (
  <div className={styles.frame}>{children}</div>
);

const meta: Meta<StoryArgs> = {
  title: "Components/AI Settings",
  parameters: {
    docs: {
      // Each story in an iframe of its own on the docs page, for the reason
      // given in AiChatPanel.stories.tsx: every story mounts
      // AiAgentProviders, whose host-tool state is single-mount. The heights
      // are set per story, from what each page measures plus some room.
      story: { inline: false },
      description: {
        component: `The portal's AI settings screens, from \`ai-agent/settings\`. Each is a page of \`@onlyoffice/ai-chat\` with the kit's layout applied, and reads and writes the same AI service the chat talks to, so it has to sit inside \`AiAgentProviders\`. Without a portal the stories run against the demo portal the mock service worker plays, under a banner that says so: its models, assignments and MCP servers are made up, and a change is saved in memory only, until the page is reloaded.

\`\`\`tsx
import AiAgentProviders from "@onlyoffice/apps-ui-kit/ai-agent/providers";
import { AiModels } from "@onlyoffice/apps-ui-kit/ai-agent/settings";

<AiAgentProviders locale="en" isAvailable>
  <AiModels />
</AiAgentProviders>;
\`\`\``,
      },
    },
  },
  argTypes: {
    locale: {
      control: "select",
      options: ["en", "de", "fr", "ar-SA", "ja-JP"],
      description: "Language of the settings pages; also sets their direction",
      table: { defaultValue: { summary: "en" } },
    },
    canUseAi: { table: { disable: true } },
    isAvailable: { table: { disable: true } },
  },
  args: {
    locale: "en",
    canUseAi: true,
    isAvailable: true,
  },
  // Mounts AiAgentProviders against the portal picked in the API Config
  // toolbar, or against the demo portal when none is configured.
  decorators: [withAiSetup],
};

export default meta;

type Story = StoryObj<StoryArgs>;

// The pages load what the demo portal holds after mounting.
const shown = (text: string) =>
  waitFor(() => expect(screen.getByText(text)).toBeVisible(), {
    timeout: 5000,
  });

export const Models: Story = {
  render: () => (
    <SettingsFrame>
      <AiModels />
    </SettingsFrame>
  ),
  play: async () => {
    await shown("Demo assistant");
    await expect(screen.getByText("Demo writer")).toBeVisible();
    await expect(screen.getByText("Demo illustrator")).toBeVisible();
    await expect(
      screen.getByRole("button", { name: "Add Model" }),
    ).toBeEnabled();
  },
  parameters: {
    docs: {
      story: { height: "460px" },
      description: {
        story:
          "The AI models connected to the portal, one row each with its provider and a menu, and **Add Model** to connect another from a provider's API key or a locally hosted model. On the demo portal the list holds three made-up models, and one added or removed there is gone again after a reload.",
      },
      source: {
        code: `<AiAgentProviders locale="en" isAvailable>
  <AiModels />
</AiAgentProviders>`,
      },
    },
  },
};

export const ModelAssignmentPage: Story = {
  name: "Model Assignment",
  render: () => (
    <SettingsFrame>
      <ModelAssignment />
    </SettingsFrame>
  ),
  play: async () => {
    await shown("Default AI model");
    await expect(screen.getByText("Custom models per task")).toBeVisible();
    await expect(screen.getByText("Summarization")).toBeVisible();
  },
  parameters: {
    docs: {
      story: { height: "940px" },
      description: {
        story:
          "Which model answers by default, and which one each task uses instead of it: chat, code, summarization, translation, OCR, vision and the rest. The **Default AI model** heading and its description come from the kit's translations; the field's own caption is turned off because it would repeat the heading.",
      },
      source: {
        code: `<AiAgentProviders locale="en" isAvailable>
  <ModelAssignment />
</AiAgentProviders>`,
      },
    },
  },
};

export const McpServersList: Story = {
  name: "MCP Servers",
  render: () => (
    <SettingsFrame>
      <McpServers />
    </SettingsFrame>
  ),
  play: async ({ userEvent }) => {
    await shown("Demo CRM");
    await expect(screen.getByText("Demo knowledge base")).toBeVisible();

    // The configuration opens inline and closes again on Cancel.
    await userEvent.click(
      screen.getByRole("button", { name: "Edit configuration" }),
    );
    const cancel = await waitFor(() =>
      screen.getByRole("button", { name: "Cancel" }),
    );
    await expect(screen.getByRole("button", { name: "Save" })).toBeVisible();
    await userEvent.click(cancel);
    await waitFor(() =>
      expect(screen.queryByRole("button", { name: "Cancel" })).toBeNull(),
    );
  },
  parameters: {
    docs: {
      story: { height: "500px" },
      description: {
        story:
          "The MCP servers whose tools the chat may call. **Edit configuration** opens an inline editor for the servers' JSON configuration, with **Save** and **Cancel**. On the demo portal the page lists the portal's own server and two made-up custom ones; with no server connected, that button is all the page shows.",
      },
      source: {
        code: `<AiAgentProviders locale="en" isAvailable>
  <McpServers />
</AiAgentProviders>`,
      },
    },
  },
};

export const WebSearchSettings: Story = {
  name: "Web Search",
  render: () => (
    <SettingsFrame>
      <WebSearch />
    </SettingsFrame>
  ),
  play: async ({ userEvent }) => {
    await shown("Web Search Engine");
    // Save waits for a key.
    const save = screen.getByRole("button", { name: "Save" });
    await expect(save).toBeDisabled();
    // The field has no label of its own, only a placeholder.
    await userEvent.type(
      screen.getByPlaceholderText("Enter API key"),
      "demo-key",
    );
    await expect(save).toBeEnabled();
  },
  parameters: {
    docs: {
      story: { height: "440px" },
      description: {
        story:
          "The search engine the chat uses to look things up on the web, and its API key. The fields are stacked rather than side by side, to fit a settings column. **Save** stays disabled until a key is entered.",
      },
      source: {
        code: `<AiAgentProviders locale="en" isAvailable>
  <WebSearch />
</AiAgentProviders>`,
      },
    },
  },
};
