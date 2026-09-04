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

import type { CSSProperties, ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

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
import type {
  QuickActionItem,
  QuickActionsProps,
} from "./QuickActions.types";

const meta = {
  title: "UI/Data display/QuickActions",
  component: QuickActions,
  parameters: {
    docs: {
      description: {
        component: `QuickActions renders a horizontal carousel of tile cards. Each tile shows an icon and a label, and can trigger a click handler or navigate via an href. The number of rendered tiles matches the length of the \`items\` array.

### Features

- **Icon + label**: Each tile accepts a custom icon (any \`ReactNode\`) and a string label.
- **Action or link**: Pass \`onClick\` to render a \`<button>\`, or \`href\` to render an \`<a>\`. When \`target="_blank"\` is set, \`rel="noopener noreferrer"\` is added automatically.
- **Carousel**: Tiles keep their design width and the strip scrolls horizontally once they no longer fit. Native overflow drives wheel, trackpad and touch-swipe; the arrows page the same scroll port.
- **Floating controls**: The arrows and the close control are layered over the strip and are out of flow entirely, so nothing shifts when they appear. Each arrow is dropped at its own end of the scroll range.
- **Arrows are a pointer affordance**: they exist only where hover and a fine pointer do, fading in with the banner. A touch device drags the strip directly, so it gets no arrows at all — only the close control, which has no gesture of its own and therefore stays visible there.
- **Optional dismissal**: Pass \`onClose\` to render the close control; without it no close affordance appears. Persisting and reversing the choice belongs to the host.

### Accessibility

- Each tile exposes its label via \`aria-label\`.
- Icons are marked \`aria-hidden\` to avoid duplicate announcement.
- Buttons receive \`type="button"\` to avoid accidental form submission.
- \`prevLabel\` and \`nextLabel\` name the arrows and are required; \`closeLabel\` names the close control and is required whenever \`onClose\` is passed. The consumer supplies them localized — there are no built-in English fallbacks, so a missing translation fails at the type level instead of shipping.

### Usage

\`\`\`tsx
import { QuickActions } from "@docspace/ui-kit/components/quick-actions";

<QuickActions
  items={[
    { icon: <CreateDocumentIcon />, label: "Document", onClick: handleNew },
    { icon: <CreateSpreadsheetIcon />, label: "Spreadsheet", href: "/new/xlsx" },
  ]}
/>
\`\`\``,
      },
    },
  },
  argTypes: {
    items: {
      control: false,
      description:
        "Array of tile descriptors. Each item requires an icon and a label, and may include onClick, href, target and dataTestId.",
    },
    className: {
      control: "text",
      description: "Optional class name applied to the grid wrapper.",
    },
    dataTestId: {
      control: "text",
      description: "Test id forwarded to the grid wrapper.",
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
    onClick: () => console.log("New document"),
  },
  {
    id: "spreadsheet",
    icon: <CreateSpreadsheetIcon />,
    label: "Spreadsheet",
    onClick: () => console.log("New spreadsheet"),
  },
  {
    id: "presentation",
    icon: <CreatePresentationIcon />,
    label: "Presentation",
    onClick: () => console.log("New presentation"),
  },
  {
    id: "pdf",
    icon: <CreateFormIcon />,
    label: "PDF",
    onClick: () => console.log("New PDF"),
  },
];

const aiFormsItems: QuickActionItem[] = [
  {
    id: "blank-pdf",
    icon: <BlankPdfIcon />,
    label: "Blank PDF form",
    onClick: () => console.log("Blank PDF"),
  },
  {
    id: "generate-ai",
    icon: <GeneratePdfAiIcon />,
    label: "Generate with AI",
    onClick: () => console.log("Generate PDF with AI"),
  },
  {
    id: "from-text",
    icon: <CreateFromTextIcon />,
    label: "From text file",
    onClick: () => console.log("From text"),
  },
  {
    id: "use-template",
    icon: <CreateFromTemplateIcon />,
    label: "Use template",
    onClick: () => console.log("From template"),
  },
];

// Five room-type tiles — more than fit a narrow strip, so the carousel has
// somewhere to scroll. Mirrors the Rooms banner in the client.
const roomItems: QuickActionItem[] = [
  {
    id: "vdr-room",
    icon: <QuickVdrRoomIcon />,
    label: "VDR room",
    onClick: () => console.log("Create VDR room"),
  },
  {
    id: "public-room",
    icon: <QuickPublicRoomIcon />,
    label: "Public room",
    onClick: () => console.log("Create public room"),
  },
  {
    id: "collaboration-room",
    icon: <QuickCollaborationRoomIcon />,
    label: "Collaboration room",
    onClick: () => console.log("Create collaboration room"),
  },
  {
    id: "custom-room",
    icon: <QuickCustomRoomIcon />,
    label: "Custom room",
    onClick: () => console.log("Create custom room"),
  },
  {
    id: "room-template",
    icon: <UseRoomTemplateIllustrationIcon />,
    label: "Room template",
    onClick: () => console.log("Use room template"),
  },
];

const aiChatItems: QuickActionItem[] = [
  {
    id: "create-agent",
    icon: <CreateAgentIcon />,
    label: "Create agent",
    onClick: () => console.log("Create AI agent"),
  },
  {
    id: "generate-ai",
    icon: <GenerateWithAiIcon />,
    label: "Generate with AI",
    onClick: () => console.log("Generate with AI"),
  },
  {
    id: "use-template",
    icon: <UseTemplateIcon />,
    label: "Use template",
    onClick: () => console.log("Use template"),
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
          "Default grid with four tiles, each triggering an onClick callback.",
      },
      source: {
        code: `<QuickActions
  items={[
    { icon: <CreateDocumentIcon />, label: "Document", onClick: () => {} },
    { icon: <CreateSpreadsheetIcon />, label: "Spreadsheet", onClick: () => {} },
    { icon: <CreatePresentationIcon />, label: "Presentation", onClick: () => {} },
    { icon: <CreateFormIcon />, label: "Form", onClick: () => {} },
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
        story: "Grid with PDF form creation tiles in AI Forms context.",
      },
      source: {
        code: `<QuickActions
  items={[
    { icon: <BlankPdfIcon />, label: "Blank PDF form", onClick: () => {} },
    { icon: <GeneratePdfAiIcon />, label: "Generate with AI", onClick: () => {} },
    { icon: <CreateFromTextIcon />, label: "From text file", onClick: () => {} },
    { icon: <CreateFromTemplateIcon />, label: "Use template", onClick: () => {} },
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
        story: "Grid with AI-powered action tiles in AI Chat context.",
      },
      source: {
        code: `<QuickActions
  items={[
    { icon: <CreateAgentIcon />, label: "Create agent", onClick: () => {} },
    { icon: <GenerateWithAiIcon />, label: "Generate with AI", onClick: () => {} },
    { icon: <UseTemplateIcon />, label: "Use template", onClick: () => {} },
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
        story: `The Rooms banner. The tiles hold their width and the strip scrolls horizontally once they no longer fit; wheel, trackpad and touch-swipe all drive the same scroll port.

The arrows float over the strip and never take part in layout, so nothing moves when they appear. Each one is dropped at its own end of the range, so the first tile shows only a forward arrow. They fade in with the banner on a device with hover, and are withheld entirely on touch, where the strip is dragged directly instead.

Narrow the canvas (or use the Viewport toolbar) to see the strip start scrolling.`,
      },
      source: {
        code: `<QuickActions
  prevLabel={t("Common:Previous")}
  nextLabel={t("Common:Next")}
  items={[
    { icon: <QuickVdrRoomIcon />, label: "VDR room", onClick: () => {} },
    { icon: <QuickCollaborationRoomIcon />, label: "Collaboration room", onClick: () => {} },
    { icon: <QuickPublicRoomIcon />, label: "Public room", onClick: () => {} },
    { icon: <QuickCustomRoomIcon />, label: "Custom room", onClick: () => {} },
    { icon: <UseRoomTemplateIllustrationIcon />, label: "Room template", onClick: () => {} },
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
    closeLabel: "Disable Quick Actions on all pages",
    onClose: () => console.log("close"),
  },
  parameters: {
    docs: {
      description: {
        story: `Passing \`onClose\` adds the close control in the top corner, with \`closeLabel\` as both its tooltip and its accessible name.

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

export const CssCustomization: Story = {
  render: () => (
    <div
      style={
        {
          maxWidth: 752,
          "--quick-actions-tile-bg": "#1e1b4b",
          "--quick-actions-tile-bg-hover": "#2d2a6e",
          "--quick-actions-tile-color": "#e0e7ff",
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

| Variable | Description | Default (light) |
|----------|-------------|-----------------|
| \`--quick-actions-tile-bg\` | Tile background color | \`colors.$gray-light\` |
| \`--quick-actions-tile-bg-hover\` | Tile background on hover / focus | \`colors.$gray-light-mid\` |
| \`--quick-actions-tile-color\` | Tile text and icon color | \`colors.$black\` |
| \`--quick-actions-tile-max-width\` | Cap on one tile's width; set to \`none\` to let the tiles fill the banner width | \`184px\` |

Set the variables on any ancestor element — they cascade down to all tiles:

\`\`\`tsx
<div
  style={{
    "--quick-actions-tile-bg": "#1e1b4b",
    "--quick-actions-tile-bg-hover": "#2d2a6e",
    "--quick-actions-tile-color": "#e0e7ff",
  } as CSSProperties}
>
  <QuickActions items={items} />
</div>
\`\`\``,
      },
    },
  },
};

