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

import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import BlankPdfIcon from "../../assets/blank.pdf.react.svg";
import CreateAgentIcon from "../../assets/create.agent.react.svg";
import CreateDocumentIcon from "../../assets/create.document.react.svg";
import CreateFormIcon from "../../assets/create.form.react.svg";
import CreateFromTemplateIcon from "../../assets/create.from.template.react.svg";
import CreateFromTextIcon from "../../assets/create.from.text.react.svg";
import CreatePresentationIcon from "../../assets/create.presentation.react.svg";
import CreateSpreadsheetIcon from "../../assets/create.spreadsheet.react.svg";
import GeneratePdfAiIcon from "../../assets/generate.pdf.ai.react.svg";
import GenerateWithAiIcon from "../../assets/generate.with.ai.react.svg";
import UseTemplateIcon from "../../assets/use.template.react.svg";

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
- **Responsive layout**: Tiles are laid out on an auto-fit grid with a minimum tile width of 160px and a 16px gap.
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

