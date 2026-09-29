import type { CSSProperties, ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

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
    docs: {
      description: {
        component: `QuickActions is a banner of large icon tiles for offering a few equally weighted ways to start something, scrolling sideways when the tiles do not fit.

### Features

- **Icon and Label**: Each tile shows any icon above its label, fitted into a fixed box without distortion, with the label clamped to two lines
- **Action or Link**: A tile is a button that calls its \`onClick\`, or a link when it has an \`href\`; a link opening in a new tab gets \`rel="noopener noreferrer"\` automatically
- **Carousel**: Tiles keep their design width and the strip scrolls sideways once they no longer fit, by wheel, trackpad, touch swipe or the arrows
- **Floating Controls**: The arrows and the close control are layered over the strip, so nothing shifts when they appear, and each arrow is dropped at its own end of the scroll range
- **Hover Reveal**: With a mouse the controls fade in while the banner is hovered or holds keyboard focus; on a touch screen they stay visible
- **Optional Dismissal**: Passing \`onClose\` adds a close control with a tooltip in the top corner; storing and reversing the choice is left to the host
- **Disabled and Tooltipped Tiles**: A tile can be disabled, fading to half opacity and ignoring clicks, and any tile can carry a tooltip shown under it on hover
- **Loading Placeholder**: While \`isLoading\` is set, skeleton tiles of the same size stand in for the real ones, so the layout does not jump when they arrive

### Accessibility

Tiles and controls are native \`<button>\` and \`<a>\` elements, so Tab, Enter and Space work as on any button or link; the component adds names and hides decoration:

- \`aria-label\` on each tile equals its \`label\`, so the tile is announced by its visible text
- \`aria-hidden\` on the tile icons and the loading skeleton keeps a screen reader from announcing them
- \`aria-label\` on the arrows comes from \`prevLabel\` and \`nextLabel\`, and on the close control from \`closeLabel\`, which is also its tooltip; the types require all three, so an unnamed control does not compile
- Tab moves through the tiles and then the controls, and focus inside the banner reveals the controls where they otherwise wait for hover
- A disabled tile sets the native \`disabled\`, which takes it out of the tab order; a disabled tile with an \`href\` stays a button

### Usage

\`\`\`tsx
import {
  QuickActions,
  CreateDocumentIcon,
  CreateSpreadsheetIcon,
} from "@onlyoffice/apps-ui-kit/components/quick-actions";

<QuickActions
  prevLabel={t("Common:Previous")}
  nextLabel={t("Common:Next")}
  items={[
    { id: "document", icon: <CreateDocumentIcon />, label: "Document", onClick: handleNew },
    { id: "spreadsheet", icon: <CreateSpreadsheetIcon />, label: "Spreadsheet", href: "/new/xlsx" },
  ]}
/>

// Dismissible: the host hides the banner and remembers the choice
<QuickActions
  items={items}
  prevLabel={t("Common:Previous")}
  nextLabel={t("Common:Next")}
  onClose={hideBanner}
  closeLabel="Hide quick actions"
/>

// Skeleton tiles while the items load
<QuickActions items={[]} isLoading />
\`\`\``,
      },
    },
  },
  argTypes: {
    items: {
      control: false,
      description:
        "The tiles, in the order they are drawn. Each has an `id`, an `icon` and a `label`, and may add `onClick`, `href` with `target`, `disabled`, `tooltipContent` and `dataTestId`. An empty array renders nothing.",
    },
    prevLabel: {
      control: "text",
      description:
        "Accessible name of the arrow that scrolls back. Required, with no built-in default, unless `isLoading` is always `true`.",
    },
    nextLabel: {
      control: "text",
      description:
        "Accessible name of the arrow that scrolls on. Required, with no built-in default, unless `isLoading` is always `true`.",
    },
    onClose: {
      control: false,
      description:
        "Called when the close control is clicked. Without it no close control is drawn.",
    },
    closeLabel: {
      control: "text",
      description:
        "Tooltip and accessible name of the close control. Required together with `onClose`.",
    },
    isLoading: {
      control: "boolean",
      description:
        "Draws skeleton tiles of the same size instead of the real ones, one per item, or four when `items` is empty, and no controls.",
      table: { defaultValue: { summary: "false" } },
    },
    className: {
      control: "text",
      description:
        "Class added to the banner's root element, after the component's own.",
    },
    dataTestId: {
      control: "text",
      description:
        "`data-testid` of the banner's root element. The track and the controls carry fixed test ids of their own.",
    },
  },
} satisfies Meta<typeof QuickActions>;

type Story = StoryObj<ComponentProps<typeof QuickActions>>;

export default meta;

const Wrapper = (props: { children: React.ReactNode }) => (
  <div style={{ maxWidth: 752 }}>{props.children}</div>
);

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
  parameters: {
    docs: {
      description: {
        story:
          "Four tiles in a banner 752px wide, the width a content column usually gives it. Click a tile to see its `onClick` in the Actions panel, and change any other prop live in the Controls panel below.",
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
  parameters: {
    docs: {
      description: {
        story:
          "Four ways to start the same kind of file, each drawn with a different illustration from the set this folder exports: the icons differ in proportions, and each is fitted into the same box without being stretched.",
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
  parameters: {
    docs: {
      description: {
        story:
          "Three tiles, fewer than the banner has room for: the row stays centred in the banner and no arrow appears, because there is nothing to scroll.",
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
  parameters: {
    docs: {
      description: {
        story: `Five tiles, more than the banner holds. The tiles keep their width and the strip scrolls sideways; wheel, trackpad, touch swipe and the arrows all move the same strip.

At the start only the forward arrow is shown; scroll and the back arrow appears, and at the far end the forward one goes. The arrows float over the strip, so nothing moves when they appear. With a mouse they fade in while the banner is hovered or focused; on a touch screen they stay visible.`,
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
  parameters: {
    docs: {
      description: {
        story: `The close control in the top corner (\`onClose\`); hover the banner, then hover the control to read its tooltip, which is also its accessible name (\`closeLabel\`). A click shows up in the Actions panel.

The control is only rendered when \`onClose\` is given: a consumer with nowhere to persist the choice would otherwise offer a button that undoes itself on the next load. Hiding the banner is the host's decision to store and to reverse — the component only reports the click.`,
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
  parameters: {
    docs: {
      description: {
        story:
          'Tiles that go somewhere instead of doing something: each is a real link (`href`), so it can be opened in a new tab from the context menu and shows its address in the status bar. **Open the guide** opens a new tab (`target="_blank"`) and gets `rel="noopener noreferrer"` without asking.',
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
  parameters: {
    docs: {
      description: {
        story:
          "**Presentation** is faded and ignores clicks (`disabled`); hover it to read why (`tooltipContent`). Use it to keep an action in its usual place while it cannot be taken, rather than making the row shift by dropping it. A tooltip works the same on an enabled tile.",
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
  render: () => (
    <Wrapper>
      <QuickActions items={documentItems} isLoading />
    </Wrapper>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Skeleton tiles of the real tiles' size, one per item, while the set of actions is still being worked out (`isLoading`). The banner keeps its height, so the content below does not jump when the tiles arrive. With an empty `items` four skeletons are drawn.",
      },
      source: {
        code: `<QuickActions items={items} isLoading />`,
      },
    },
  },
};

export const RightToLeft: Story = {
  render: () => (
    <div dir="rtl" style={{ maxWidth: 752 }}>
      <QuickActions items={roomItems} prevLabel="Previous" nextLabel="Next" />
    </div>
  ),
  globals: { direction: "rtl" },
  parameters: {
    noPadding: true,
    docs: {
      // Framed: an inline RTL story would flip the whole Docs page.
      story: { inline: false, height: "173px" },
      description: {
        story:
          'The strip in a right-to-left layout: the first tile sits at the right edge, the strip scrolls toward the left, and the fade and the forward arrow move to the left edge with the arrow pointing left. The wrapper carries `dir="rtl"`; the direction also comes from the theme\'s `interfaceDirection` (the Direction toolbar).',
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
  parameters: {
    docs: {
      description: {
        story: `CSS Custom Properties for external customization:

| Variable | Description | Default |
|----------|-------------|---------|
| \`--quick-actions-tile-bg\` | Tile background | theme-based |
| \`--quick-actions-tile-bg-hover\` | Tile background on hover and keyboard focus | theme-based |
| \`--quick-actions-tile-color\` | Tile label colour and the keyboard focus outline; the bundled illustrations keep their own colours | theme-based |
| \`--quick-actions-tile-max-width\` | Cap on one tile's width; \`none\` lets the tiles grow to fill the banner | \`184px\` |
| \`--quick-actions-row-max-width\` | Cap on the width of the tile row, which is centred in the banner; below the width of the tiles the strip is cut hard at the cap, since the edge fade stays at the banner's edge, so it is not shown in the example | \`100%\` |
| \`--quick-actions-edge-inset\` | Space between the banner's edge and the first tile at rest; scrolled tiles still run out to the edge | \`0px\` |

The example narrows the tiles to 176px and holds the first one 24px off the banner's edge, which still leaves the fourth tile scrolling; hover a tile for the hover background and Tab into the strip for the focus outline.

Set the variables on any ancestor element — they cascade down to all tiles:

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
