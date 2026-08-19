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
import type { QuickActionItem } from "./QuickActions.types";

const meta = {
  title: "UI/Data display/QuickActions",
  component: QuickActions,
  parameters: {
    docs: {
      description: {
        component: `QuickActions renders a responsive grid of tile cards. Each tile shows an icon and a label, and can trigger a click handler or navigate via an href. The number of rendered tiles matches the length of the \`items\` array.

### Features

- **Icon + label**: Each tile accepts a custom icon (any \`ReactNode\`) and a string label.
- **Action or link**: Pass \`onClick\` to render a \`<button>\`, or \`href\` to render an \`<a>\`. When \`target="_blank"\` is set, \`rel="noopener noreferrer"\` is added automatically.
- **Responsive layout**: Tiles are laid out using flex (no wrapping) with a 16px gap — they shrink proportionally and always stay in a single row.
- **Overflow collapse**: When there are **more than 4** tiles, the grid collapses on smaller screens — it clips to the first row, the next row peeks through behind a blurred fade, and a centered "Show more" reveals the rest. Expanding is one-way (there is no "Show less"). Desktop always shows every tile in a single row. The label is consumer-provided via \`showMoreLabel\` (default "Show more") so the host app can localize it.
- **16px padding**: Each tile has 16px padding on all sides.

### Accessibility

- Each tile exposes its label via \`aria-label\`.
- Icons are marked \`aria-hidden\` to avoid duplicate announcement.
- Buttons receive \`type="button"\` to avoid accidental form submission.

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

// Five room-type tiles — one past the collapse threshold, so the grid collapses
// on tablet/mobile. Mirrors the Rooms banner in the client.
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
  render: (args) => (
    <Wrapper>
      <QuickActions {...args} />
    </Wrapper>
  ),
  args: {
    items: documentItems,
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
  render: (args) => (
    <Wrapper>
      <QuickActions {...args} />
    </Wrapper>
  ),
  args: {
    items: aiFormsItems,
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
  render: (args) => (
    <Wrapper>
      <QuickActions {...args} />
    </Wrapper>
  ),
  args: {
    items: aiChatItems,
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

export const Collapsible: Story = {
  render: (args) => (
    <Wrapper>
      <QuickActions {...args} />
    </Wrapper>
  ),
  args: {
    items: roomItems,
    showMoreLabel: "Show more",
  },
  parameters: {
    docs: {
      description: {
        story: `The Rooms banner with more than 4 tiles. On smaller viewports the grid collapses to its first row, the next row peeks through behind a blurred fade, and a centered "Show more" reveals the rest. Expanding is one-way (no "Show less"). Desktop shows every tile in a single row with no overlay.

Resize the canvas (or use the Viewport toolbar) below 1024px (tablet) and below 600px (mobile) to see the collapsed peek. \`showMoreLabel\` is supplied by the consumer for localization.`,
      },
      source: {
        code: `<QuickActions
  showMoreLabel={t("Common:ShowMore")}
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
      <QuickActions items={documentItems} />
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

