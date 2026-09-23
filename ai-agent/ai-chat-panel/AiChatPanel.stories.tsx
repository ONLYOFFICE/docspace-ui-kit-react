import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { observer } from "mobx-react";

import { Text } from "../../components/text";

import AiAgentProviders, { useIsAiChatAvailable } from "../providers";

import type { ChatNoAccessScreenProps } from "../new-chat/components/chat-no-access-screen";

import { useAiChatPanel, useOpenAiChat } from ".";

// The panel is not a component a host renders directly: `useAiChatPanel`
// returns the pieces (a header button and the panel content) and the host
// decides where each one goes. So the story supplies the smallest host that
// makes that arrangement visible -- a content column with a header strip, and
// the panel docked beside it at the width the store carries.
//
// The chrome is the host's too. In the DocSpace client the panel content is
// rendered inside `Section`'s info panel, which draws the surface it sits on:
// a background and an inline-start border against the content column. Without
// them the chat floats on the page with no edge, which is not what a product
// screen looks like -- so the story draws the same two, on the same tokens
// `Section` reads (`--info-panel-background` / `--info-panel-border-color`,
// both overridable by a host).
const panelChrome: React.CSSProperties = {
  background: "var(--info-panel-background)",
  borderInlineStart: "1px solid var(--info-panel-border-color)",
};

// The content column is drawn as a real section -- a header strip with a rule
// under it, content below -- and not because a story needs decoration. Two of
// these stories are about something the host does *not* render, and on a blank
// page a missing trigger is indistinguishable from a story that failed to
// load. Framed, the same emptiness reads as what it is: a section header whose
// action slot is empty.
const sectionHeader: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "16px",
  minHeight: "40px",
  paddingBottom: "12px",
  borderBottom: "1px solid var(--info-panel-border-color)",
};

const AiChatHost: React.FC<{
  aiReady?: boolean;
  noAccessProps?: ChatNoAccessScreenProps;
  storyId: string;
  inDocs?: boolean;
}> = observer(({ aiReady, noAccessProps, storyId, inDocs }) => {
  const {
    chatButton,
    chatPanelContent,
    isChatPanelVisible,
    isChatPanelFullscreen,
    chatPanelWidth,
  } = useAiChatPanel(true, { aiReady, noAccessProps });

  // The trigger does not consult availability -- it only hides itself once
  // the panel is open. Deciding whether AI is offered at all is the host's
  // job, and this is how a host does it: `useIsAiChatAvailable()` is
  // `canUseAi && isAvailable`, so turning either control off takes the button
  // away. No story ships in that state (one did, and a blank section taught
  // nobody anything), but a host that skipped this check would offer AI to
  // sessions the server bars from it.
  const isAiAvailable = useIsAiChatAvailable();

  // On the docs page the reader is scrolling past four blocks and will not
  // click into each one, so the blocks open themselves -- a docs block showing
  // only the trigger says nothing the sentence above it did not. The canvas
  // stays closed: there the click is the thing being demonstrated.
  //
  // Through the package's own opener rather than the store, because that is
  // what a host has: `useOpenAiChat` is the exported way to open the panel
  // from anywhere (an "Ask AI" action, a deep link), and it starts a fresh
  // thread when the panel was closed.
  const openChat = useOpenAiChat();

  useEffect(() => {
    if (inDocs && isAiAvailable) openChat();
  }, [inDocs, isAiAvailable, openChat]);

  return (
    <div
      style={{
        display: "flex",
        // A docs block is one item in a scrolling page; a viewport-tall one
        // pushes the next heading off the screen. A definite height is only
        // needed once the panel is in it -- the chat sizes itself to the host
        // -- so a docs block with no panel hugs its two lines of text instead
        // of leaving 500px of nothing before the next heading.
        height: inDocs ? undefined : "100vh",
        ...(inDocs && isChatPanelVisible ? { height: "520px" } : null),
        alignItems: "stretch",
      }}
      data-testid={`ai-chat-host-${storyId}`}
    >
      {!isChatPanelFullscreen ? (
        <div
          style={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            padding: "16px",
          }}
        >
          {/* Where a product section puts it: in its own header, next to the
                section's other actions. It hides itself once the panel opens. */}
          <div style={sectionHeader} data-testid="host-header">
            <Text fontSize="16px" fontWeight={700}>
              Section header
            </Text>
            {isAiAvailable ? chatButton : null}
          </div>

          <Text fontSize="13px">
            Section content. The AI chat panel docks to the right of it;
            dragging the panel's edge past the widest docked width switches the
            panel to fullscreen, which takes this column away.
          </Text>
        </div>
      ) : null}

      {isChatPanelVisible ? (
        <aside
          style={{
            width: isChatPanelFullscreen ? "100%" : `${chatPanelWidth}px`,
            flex: isChatPanelFullscreen ? 1 : "0 0 auto",
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            ...panelChrome,
            // Fullscreen takes the content column away, so there is nothing
            // left to border against.
            borderInlineStart: isChatPanelFullscreen
              ? undefined
              : panelChrome.borderInlineStart,
          }}
          data-testid="ai-chat-panel"
        >
          {chatPanelContent}
        </aside>
      ) : null}
    </div>
  );
});

AiChatHost.displayName = "AiChatHost";

type StoryArgs = {
  /** Language for the chat widget; also decides its interface direction. */
  locale: string;
  /**
   * Whether the session may reach the AI API at all. `false` is the anonymous
   * or AI-barred session: the providers still mount, but no request fires and
   * no chat is offered.
   */
  canUseAi: boolean;
  /** Whether AI is offered on this view. Read by `useIsAiChatAvailable()`. */
  isAvailable: boolean;
  /**
   * Whether the portal has a usable AI profile. The branded "not available"
   * screen needs `aiReady: false` **and** `noAccessProps`: the panel shows it
   * only when it has somewhere to send the user.
   */
  aiReady: boolean;
  /**
   * Wiring for that screen. Omit it and the panel falls back to the chat
   * widget's own setup screen, which configures a profile in place -- what the
   * embedded sdk layouts do, having no portal settings page to link to.
   */
  noAccessProps?: ChatNoAccessScreenProps;
  storyId: string;
  /**
   * Set by the decorator from `viewMode`, not by a control: the docs blocks
   * open themselves, the canvas does not.
   */
  inDocs?: boolean;
};

const meta: Meta<StoryArgs> = {
  title: "Components/AI Chat",
  component: AiChatHost,
  tags: ["!autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `The AI chat panel: a header button that opens it and a docked panel carrying the chat.

### Features

- **Host-composed** — \`useAiChatPanel\` returns \`chatButton\` and \`chatPanelContent\` plus the reactive visibility/fullscreen state; the host places each piece and owns the layout
- **Section-agnostic** — reads only the shared \`AiChatStore\`, so every product surface mounts the same panel
- **Docked or fullscreen** — \`chatPanelWidth\` is session state that resets on every open; \`setChatPanelFullscreen\`/\`unsetChatPanelFullscreen\` are explicit rather than a toggle, for the edge resizer
- **Opt-out without a conditional hook** — \`useAiChatPanel(false)\` returns \`undefined\`, for sections that do not offer AI (private rooms)

### Requirements

Consumers must be \`observer\`s, or the visibility and fullscreen flags stop being reactive. The whole tree has to sit inside \`AiAgentProviders\`, which mounts the \`AiChatStoreProvider\` the hook needs — without it the hook throws.

### What renders here

The chat widget talks to \`/api/2.0/ai\` **on the page's own origin**, not through the \`apiConfig\` portal switcher the selectors use. Served from a portal (\`STORYBOOK_PROXY=1\` behind nginx) it reaches the real AI service. In local Storybook that origin is the dev server, which answers those routes from \`.storybook/ai-chat-mock.ts\` — a mock profile, in-memory threads and a streamed reply that echoes the prompt. Nothing reaches a model; \`STORYBOOK_AI_MOCK=0\` turns it off, and without an answer the panel renders empty. \`aiReady\`, \`canUseAi\` and \`isAvailable\` are exposed as args, so the not-configured panel and a session with no AI at all can both be reached from the controls.`,
      },
    },
  },
  argTypes: {
    locale: { control: "text" },
    canUseAi: { control: "boolean" },
    isAvailable: { control: "boolean" },
    aiReady: { control: "boolean" },
    noAccessProps: { control: "object" },
    storyId: { table: { disable: true } },
    inDocs: { table: { disable: true } },
  },
  args: {
    locale: "en",
    canUseAi: true,
    isAvailable: true,
    aiReady: true,
    storyId: "default",
  },
  // Keyed on the provider props: AiAgentProviders hydrates its stores on mount,
  // so a changed arg has to remount the tree rather than be re-rendered into it.
  decorators: [
    (Story, context) => {
      const { locale, canUseAi, isAvailable } = context.args;

      return (
        <AiAgentProviders
          key={`${locale}-${canUseAi}-${isAvailable}`}
          locale={locale}
          canUseAi={canUseAi}
          isAvailable={isAvailable}
        >
          {/* The only difference between the docs and canvas renderings of
              the same story: see `inDocs` on the host. `args` here replaces
              the story's own set rather than merging into it, so the rest has
              to be spread back in -- dropping it silently un-configures
              NotConfigured. */}
          <Story
            args={{ ...context.args, inDocs: context.viewMode === "docs" }}
          />
        </AiAgentProviders>
      );
    },
  ],
};

export default meta;

type Story = StoryObj<StoryArgs>;

export const Default: Story = {
  args: { storyId: "default" },
};

/**
 * The portal has no usable AI profile: the panel opens on the branded
 * "not available" screen instead of the composer. Both halves are required --
 * `aiReady: false` alone leaves the body empty.
 */
export const NotConfigured: Story = {
  args: {
    aiReady: false,
    noAccessProps: { standalone: false, isPortalAdmin: true },
    storyId: "not-configured",
  },
};

/**
 * `useAiChatPanel(false)` for a section that opts out, next to a section that
 * does not. The disabled one gets `undefined` back and renders no chat at all.
 */
export const OptedOut: Story = {
  render: function OptedOutStory() {
    const [enabled, setEnabled] = useState(false);

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <label style={{ display: "flex", gap: "8px", padding: "16px 16px 0" }}>
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
          />
          <Text fontSize="13px" as="span">
            AI enabled for this section
          </Text>
        </label>

        {enabled ? (
          <AiChatHost storyId="opted-out" aiReady />
        ) : (
          <OptedOutSection />
        )}
      </div>
    );
  },
};

// Kept out of the render function so the hook call is unconditional: `enabled`
// is false for this component's whole lifetime, which is the invariant
// useAiChatPanel documents.
const OptedOutSection: React.FC = observer(() => {
  const bindings = useAiChatPanel(false);

  return (
    <Text fontSize="13px" style={{ padding: "0 16px 16px" }}>
      {bindings === undefined
        ? "useAiChatPanel(false) returned undefined — no trigger, no panel."
        : "unexpected: bindings were returned for a disabled section"}
    </Text>
  );
});

OptedOutSection.displayName = "OptedOutSection";
