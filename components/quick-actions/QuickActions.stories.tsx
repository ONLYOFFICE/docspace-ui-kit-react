import type { CSSProperties, ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen, waitFor } from "storybook/test";

import {
  BlankPdfIcon,
  CreateAgentIcon,
  CreateDocumentIcon,
  CreateFormIcon,
  CreateFromTemplateIcon,
  CreateFromTextIcon,
  CreatePresentationIcon,
  CreateSpreadsheetIcon,
  GeneratePdfAiIcon,
  GenerateWithAiIcon,
  UseTemplateIcon,
  QuickVdrRoomIcon,
  QuickCollaborationRoomIcon,
  QuickPublicRoomIcon,
  QuickCustomRoomIcon,
  UseRoomTemplateIllustrationIcon,
} from "./icons";

import { QuickActions } from "./index";
import type { QuickActionItem, QuickActionsProps } from "./QuickActions.types";

const meta = {
  title: "UI/Data display/QuickActions",
  component: QuickActions,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
  },
  argTypes: {
    items: {
      control: false,
      description:
        "The tiles, in the order they are drawn. An empty array renders nothing at all.",
    },
    prevLabel: {
      control: "text",
      description:
        "Accessible name of the arrow that scrolls back. Required, and localized by you, unless `isLoading` is pinned to `true`.",
    },
    nextLabel: {
      control: "text",
      description:
        "Accessible name of the arrow that scrolls on. Required, and localized by you, unless `isLoading` is pinned to `true`.",
    },
    onClose: {
      control: false,
      description:
        "Called when the close control is clicked; the banner stays until you remove it. Without it no close control is drawn.",
    },
    closeLabel: {
      control: "text",
      description: "Tooltip and accessible name for the close control.",
    },
    isLoading: {
      control: "boolean",
      description: "Whether skeleton tiles are drawn instead of the real ones.",
      table: { defaultValue: { summary: "false" } },
    },
    className: {
      control: "text",
      description: "Applied to the banner, after the component's own class.",
    },
    dataTestId: {
      control: "text",
      description:
        "`data-testid` of the banner. The track and the controls carry ids of their own.",
    },
  },
} satisfies Meta<typeof QuickActions>;

type Story = StoryObj<ComponentProps<typeof QuickActions>>;

export default meta;

const Wrapper = (props: { children: React.ReactNode }) => (
  <div style={{ maxWidth: 752 }}>{props.children}</div>
);

// The stories' typed `render` leaves `play` without a contextual type.
type PlayContext = Parameters<NonNullable<Story["play"]>>[0];

// The arrows follow the track: shown only where there is somewhere to go.
const expectArrowsMatchTrack = async (track: HTMLElement) => {
  const scrollable = track.scrollWidth - track.clientWidth > 1;
  await waitFor(() =>
    expect(!!screen.queryByTestId("quick-actions-next")).toBe(scrollable),
  );
  // At the start there is never a way back.
  await expect(screen.queryByTestId("quick-actions-prev")).toBeNull();
};

const documentItems: QuickActionItem[] = [
  {
    id: "document",
    icon: <CreateDocumentIcon />,
    label: "Document",
    onClick: fn().mockName("New document"),
  },
  {
    id: "spreadsheet",
    icon: <CreateSpreadsheetIcon />,
    label: "Spreadsheet",
    onClick: fn().mockName("New spreadsheet"),
  },
  {
    id: "presentation",
    icon: <CreatePresentationIcon />,
    label: "Presentation",
    onClick: fn().mockName("New presentation"),
  },
  {
    id: "pdf",
    icon: <CreateFormIcon />,
    label: "PDF",
    onClick: fn().mockName("New PDF"),
  },
];

const aiFormsItems: QuickActionItem[] = [
  {
    id: "blank-pdf",
    icon: <BlankPdfIcon />,
    label: "Blank PDF form",
    onClick: fn().mockName("Blank PDF"),
  },
  {
    id: "generate-ai",
    icon: <GeneratePdfAiIcon />,
    label: "Generate with AI",
    onClick: fn().mockName("Generate PDF with AI"),
  },
  {
    id: "from-text",
    icon: <CreateFromTextIcon />,
    label: "From text file",
    onClick: fn().mockName("From text"),
  },
  {
    id: "use-template",
    icon: <CreateFromTemplateIcon />,
    label: "Use template",
    onClick: fn().mockName("From template"),
  },
];

// Five tiles, more than the banner holds, so the strip has somewhere to scroll.
const roomItems: QuickActionItem[] = [
  {
    id: "vdr-room",
    icon: <QuickVdrRoomIcon />,
    label: "VDR room",
    onClick: fn().mockName("Create VDR room"),
  },
  {
    id: "public-room",
    icon: <QuickPublicRoomIcon />,
    label: "Public room",
    onClick: fn().mockName("Create public room"),
  },
  {
    id: "collaboration-room",
    icon: <QuickCollaborationRoomIcon />,
    label: "Collaboration room",
    onClick: fn().mockName("Create collaboration room"),
  },
  {
    id: "custom-room",
    icon: <QuickCustomRoomIcon />,
    label: "Custom room",
    onClick: fn().mockName("Create custom room"),
  },
  {
    id: "room-template",
    icon: <UseRoomTemplateIllustrationIcon />,
    label: "Room template",
    onClick: fn().mockName("Use room template"),
  },
];

const aiChatItems: QuickActionItem[] = [
  {
    id: "create-agent",
    icon: <CreateAgentIcon />,
    label: "Create agent",
    onClick: fn().mockName("Create AI agent"),
  },
  {
    id: "generate-ai",
    icon: <GenerateWithAiIcon />,
    label: "Generate with AI",
    onClick: fn().mockName("Generate with AI"),
  },
  {
    id: "use-template",
    icon: <UseTemplateIcon />,
    label: "Use template",
    onClick: fn().mockName("Use template"),
  },
];

export const Default: Story = {
  name: "Document tiles",
  render: (args: QuickActionsProps) => (
    <Wrapper>
      <QuickActions {...args} />
    </Wrapper>
  ),
  args: {
    items: documentItems,
    prevLabel: "Previous",
    nextLabel: "Next",
  },
  play: async ({ canvas, userEvent }: PlayContext) => {
    // Every tile is a native button named by its label.
    await userEvent.click(canvas.getByRole("button", { name: "Document" }));
    await expect(documentItems[0].onClick).toHaveBeenCalledTimes(1);

    const spreadsheet = canvas.getByRole("button", { name: "Spreadsheet" });
    spreadsheet.focus();
    await userEvent.keyboard("{Enter}");
    await expect(documentItems[1].onClick).toHaveBeenCalledTimes(1);

    await expectArrowsMatchTrack(canvas.getByTestId("quick-actions-track"));
  },
  parameters: {
    docs: {
      description: {
        story:
          "Four tiles in a banner 752px wide, the width a content column usually gives it. A tile calls its own `onClick`.",
      },
      source: {
        code: `<QuickActions
  prevLabel="Previous"
  nextLabel="Next"
  items={[
    { id: "document", icon: <CreateDocumentIcon />, label: "Document", onClick: () => {} },
    { id: "spreadsheet", icon: <CreateSpreadsheetIcon />, label: "Spreadsheet", onClick: () => {} },
    { id: "presentation", icon: <CreatePresentationIcon />, label: "Presentation", onClick: () => {} },
    { id: "pdf", icon: <CreateFormIcon />, label: "PDF", onClick: () => {} },
  ]}
/>`,
      },
    },
  },
};

export const InAIForms: Story = {
  name: "Illustrations of different shapes",
  render: (args: QuickActionsProps) => (
    <Wrapper>
      <QuickActions {...args} />
    </Wrapper>
  ),
  args: {
    items: aiFormsItems,
    prevLabel: "Previous",
    nextLabel: "Next",
  },
  play: async ({ canvas }: PlayContext) => {
    const names = canvas
      .getAllByRole("button")
      .filter((button) => !button.dataset.testid?.startsWith("quick-actions"))
      .map((button) => button.getAttribute("aria-label"));
    await expect(names).toEqual([
      "Blank PDF form",
      "Generate with AI",
      "From text file",
      "Use template",
    ]);
  },
  parameters: {
    docs: {
      description: {
        story:
          "Four ways to start the same kind of file, each with an illustration this folder exports. The icons differ in proportions; each fits the same box unstretched.",
      },
      source: {
        code: `<QuickActions
  prevLabel="Previous"
  nextLabel="Next"
  items={[
    { id: "blank-pdf", icon: <BlankPdfIcon />, label: "Blank PDF form", onClick: () => {} },
    { id: "generate-ai", icon: <GeneratePdfAiIcon />, label: "Generate with AI", onClick: () => {} },
    { id: "from-text", icon: <CreateFromTextIcon />, label: "From text file", onClick: () => {} },
    { id: "use-template", icon: <CreateFromTemplateIcon />, label: "Use template", onClick: () => {} },
  ]}
/>`,
      },
    },
  },
};

export const InAIChat: Story = {
  name: "Fewer tiles than fit",
  render: (args: QuickActionsProps) => (
    <Wrapper>
      <QuickActions {...args} />
    </Wrapper>
  ),
  args: {
    items: aiChatItems,
    prevLabel: "Previous",
    nextLabel: "Next",
  },
  play: async ({ canvas, userEvent }: PlayContext) => {
    await userEvent.click(canvas.getByRole("button", { name: "Create agent" }));
    await expect(aiChatItems[0].onClick).toHaveBeenCalledTimes(1);
    await expectArrowsMatchTrack(canvas.getByTestId("quick-actions-track"));
  },
  parameters: {
    docs: {
      description: {
        story:
          "Three tiles, fewer than the banner has room for. The row stays centred, and no arrow appears because there is nothing to scroll.",
      },
      source: {
        code: `<QuickActions
  prevLabel="Previous"
  nextLabel="Next"
  items={[
    { id: "create-agent", icon: <CreateAgentIcon />, label: "Create agent", onClick: () => {} },
    { id: "generate-ai", icon: <GenerateWithAiIcon />, label: "Generate with AI", onClick: () => {} },
    { id: "use-template", icon: <UseTemplateIcon />, label: "Use template", onClick: () => {} },
  ]}
/>`,
      },
    },
  },
};

export const Carousel: Story = {
  name: "More tiles than fit",
  render: (args: QuickActionsProps) => (
    <Wrapper>
      <QuickActions {...args} />
    </Wrapper>
  ),
  args: {
    items: roomItems,
    prevLabel: "Previous",
    nextLabel: "Next",
  },
  play: async ({ canvas, userEvent }: PlayContext) => {
    const track = canvas.getByTestId("quick-actions-track");
    // Five tiles overflow: only the forward arrow at the start.
    await expectArrowsMatchTrack(track);

    await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    await waitFor(() => expect(track.scrollLeft).toBeGreaterThan(0));
    // Once moved, the back arrow appears.
    await expect(
      await canvas.findByRole("button", { name: "Previous" }),
    ).toBeInTheDocument();

    // The strip is a toolbar the keyboard walks: End reaches the last tile,
    // Home brings the first one back into view. The Next arrow's smooth
    // scroll is usually still running here, on purpose: a key pressed during
    // it must still land the tile in view (Chromium on Linux used to leave
    // the strip where the interrupted animation stopped).
    await expect(track).toBe(canvas.getByRole("toolbar"));
    const tiles = Array.from(track.querySelectorAll("button"));
    tiles[0].focus();
    await userEvent.keyboard("{End}");
    await expect(tiles[tiles.length - 1]).toHaveFocus();
    await userEvent.keyboard("{Home}");
    await expect(tiles[0]).toHaveFocus();
    await waitFor(() => expect(track.scrollLeft).toBe(0));
    await userEvent.keyboard("{ArrowRight}");
    await expect(tiles[1]).toHaveFocus();
  },
  parameters: {
    docs: {
      description: {
        story: `Five tiles, more than the banner holds: the strip scrolls, starting with only the forward arrow.

- The back arrow appears once the strip has moved; the forward one goes at the far end.
- The arrow keys, Home and End move focus between the tiles and scroll each into view.`,
      },
      source: {
        code: `<QuickActions
  prevLabel={t("Common:Previous")}
  nextLabel={t("Common:Next")}
  items={[
    { id: "vdr-room", icon: <QuickVdrRoomIcon />, label: "VDR room", onClick: () => {} },
    { id: "public-room", icon: <QuickPublicRoomIcon />, label: "Public room", onClick: () => {} },
    { id: "collaboration-room", icon: <QuickCollaborationRoomIcon />, label: "Collaboration room", onClick: () => {} },
    { id: "custom-room", icon: <QuickCustomRoomIcon />, label: "Custom room", onClick: () => {} },
    { id: "room-template", icon: <UseRoomTemplateIllustrationIcon />, label: "Room template", onClick: () => {} },
  ]}
/>`,
      },
    },
  },
};

export const Dismissible: Story = {
  name: "With a close cross",
  render: (args: QuickActionsProps) => (
    <Wrapper>
      <QuickActions {...args} />
    </Wrapper>
  ),
  args: {
    items: roomItems,
    prevLabel: "Previous",
    nextLabel: "Next",
    closeLabel: "Hide quick actions on all pages",
    onClose: fn(),
  },
  play: async ({ args, canvas, userEvent }: PlayContext) => {
    // closeLabel names the cross; a click only reports it.
    await userEvent.click(
      canvas.getByRole("button", { name: "Hide quick actions on all pages" }),
    );
    await expect(args.onClose).toHaveBeenCalledTimes(1);
    await expect(canvas.getByTestId("quick-actions-track")).toBeVisible();
  },
  parameters: {
    docs: {
      description: {
        story: `A close cross in the top corner (\`onClose\`), drawn only when the handler is passed. Its tooltip and accessible name are \`closeLabel\`.

A click only calls \`onClose\`; the banner stays. Hiding it, and remembering that, is the host's job.`,
      },
      source: {
        code: `<QuickActions
  onClose={hideQuickActions}
  closeLabel={t("Common:DisableQuickActionsOnAllPages")}
  prevLabel={t("Common:Previous")}
  nextLabel={t("Common:Next")}
  items={roomItems}
/>`,
      },
    },
  },
};

const linkItems: QuickActionItem[] = [
  {
    id: "templates",
    icon: <CreateFromTemplateIcon />,
    label: "Browse templates",
    href: "#templates",
  },
  {
    id: "guide",
    icon: <CreateDocumentIcon />,
    label: "Open the guide",
    href: "#guide",
    target: "_blank",
  },
];

export const LinkTiles: Story = {
  name: "Link tiles",
  render: (args: QuickActionsProps) => (
    <Wrapper>
      <QuickActions {...args} />
    </Wrapper>
  ),
  args: {
    items: linkItems,
    prevLabel: "Previous",
    nextLabel: "Next",
  },
  play: async ({ canvas }: PlayContext) => {
    // href makes a tile a real link.
    const templates = canvas.getByRole("link", { name: "Browse templates" });
    await expect(templates).toHaveAttribute("href", "#templates");
    await expect(templates).not.toHaveAttribute("rel");

    // target="_blank" adds rel="noopener noreferrer" by itself.
    const guide = canvas.getByRole("link", { name: "Open the guide" });
    await expect(guide).toHaveAttribute("target", "_blank");
    await expect(guide).toHaveAttribute("rel", "noopener noreferrer");
  },
  parameters: {
    docs: {
      description: {
        story:
          'Tiles that go somewhere instead of doing something. Each is a real link (`href`), so the browser offers to open it in a new tab. **Open the guide** opens a new tab (`target="_blank"`) and gets `rel="noopener noreferrer"` by itself.',
      },
      source: {
        code: `<QuickActions
  prevLabel="Previous"
  nextLabel="Next"
  items={[
    { id: "templates", icon: <CreateFromTemplateIcon />, label: "Browse templates", href: "/templates" },
    { id: "guide", icon: <CreateDocumentIcon />, label: "Open the guide", href: "/guide", target: "_blank" },
  ]}
/>`,
      },
    },
  },
};

const disabledItems: QuickActionItem[] = [
  documentItems[0],
  documentItems[1],
  {
    ...documentItems[2],
    disabled: true,
    tooltipContent: "Not available in this folder",
  },
];

export const DisabledState: Story = {
  name: "Disabled tile with a tooltip",
  render: (args: QuickActionsProps) => (
    <Wrapper>
      <QuickActions {...args} />
    </Wrapper>
  ),
  args: {
    items: disabledItems,
    prevLabel: "Previous",
    nextLabel: "Next",
  },
  play: async ({ canvas, userEvent }: PlayContext) => {
    const presentation = canvas.getByRole("button", { name: "Presentation" });
    await expect(presentation).toBeDisabled();

    // The tooltip opens from the wrapper, since a disabled button takes no
    // pointer events of its own.
    await userEvent.hover(presentation.parentElement as HTMLElement);
    await waitFor(() =>
      expect(screen.getByText("Not available in this folder")).toBeVisible(),
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "**Presentation** is faded and ignores clicks (`disabled`), and its tooltip says why (`tooltipContent`). The action keeps its place, so the row does not shift.",
      },
      source: {
        code: `<QuickActions
  prevLabel="Previous"
  nextLabel="Next"
  items={[
    { id: "document", icon: <CreateDocumentIcon />, label: "Document", onClick: () => {} },
    { id: "spreadsheet", icon: <CreateSpreadsheetIcon />, label: "Spreadsheet", onClick: () => {} },
    {
      id: "presentation",
      icon: <CreatePresentationIcon />,
      label: "Presentation",
      disabled: true,
      tooltipContent: "Not available in this folder",
    },
  ]}
/>`,
      },
    },
  },
};

export const LoadingState: Story = {
  name: "Loading",
  render: () => (
    <Wrapper>
      <QuickActions items={documentItems} isLoading />
    </Wrapper>
  ),
  play: async ({ canvas }: PlayContext) => {
    // Skeletons only: no tiles, no controls.
    await expect(canvas.queryAllByRole("button")).toHaveLength(0);
    await expect(canvas.queryByTestId("quick-actions-track")).toBeNull();
  },
  parameters: {
    docs: {
      description: {
        story:
          "Skeleton tiles of the real tiles' size, one per item, while the actions load (`isLoading`). The banner keeps its height, so the content below does not jump. An empty `items` draws four.",
      },
      source: {
        code: `<QuickActions items={items} isLoading />`,
      },
    },
  },
};

export const RightToLeft: Story = {
  name: "Right to left",
  render: () => (
    <div dir="rtl" style={{ maxWidth: 752 }}>
      <QuickActions items={roomItems} prevLabel="Previous" nextLabel="Next" />
    </div>
  ),
  play: async ({ canvas, userEvent }: PlayContext) => {
    // Under RTL the strip scrolls toward negative offsets.
    const track = canvas.getByTestId("quick-actions-track");
    await userEvent.click(await canvas.findByRole("button", { name: "Next" }));
    await waitFor(() => expect(track.scrollLeft).toBeLessThan(0));
  },
  globals: { direction: "rtl" },
  parameters: {
    noPadding: true,
    docs: {
      // Framed: an inline RTL story would flip the whole Docs page.
      story: { inline: false, height: "173px" },
      description: {
        story:
          'The strip in a right-to-left layout: the first tile at the right edge, and the fade and forward arrow on the left. The strip reads the direction from its computed style, here the wrapper\'s `dir="rtl"`.',
      },
      source: {
        code: `<div dir="rtl">
  <QuickActions
    items={items}
    prevLabel={t("Common:Previous")}
    nextLabel={t("Common:Next")}
  />
</div>`,
      },
    },
  },
};

export const CssCustomization: Story = {
  name: "CSS variables",
  render: () => (
    <div
      style={
        {
          maxWidth: 752,
          "--quick-actions-tile-bg": "#1e1b4b",
          "--quick-actions-tile-bg-hover": "#4338ca",
          "--quick-actions-tile-color": "#e0e7ff",
          "--quick-actions-tile-max-width": "176px",
          "--quick-actions-edge-inset": "24px",
        } as CSSProperties
      }
    >
      <QuickActions
        items={documentItems}
        prevLabel="Previous"
        nextLabel="Next"
      />
    </div>
  ),
  play: async ({ canvas }: PlayContext) => {
    const tile = canvas.getByRole("button", { name: "Document" });
    await expect(getComputedStyle(tile).backgroundColor).toBe(
      "rgb(30, 27, 75)",
    );
    await expect(tile.getBoundingClientRect().width).toBeLessThanOrEqual(176);
  },
  parameters: {
    docs: {
      description: {
        story: `Every variable but the row cap, set on one wrapper: dark tiles 176px wide, the first one 24px off the banner's edge. The fourth tile still scrolls.

Set the variables on any ancestor of the banner:

\`\`\`tsx
<div
  style={{
    "--quick-actions-tile-bg": "#1e1b4b",
    "--quick-actions-tile-bg-hover": "#4338ca",
    "--quick-actions-tile-color": "#e0e7ff",
    "--quick-actions-tile-max-width": "176px",
    "--quick-actions-edge-inset": "24px",
  } as CSSProperties}
>
  <QuickActions items={items} prevLabel="Previous" nextLabel="Next" />
</div>
\`\`\``,
      },
    },
  },
};
