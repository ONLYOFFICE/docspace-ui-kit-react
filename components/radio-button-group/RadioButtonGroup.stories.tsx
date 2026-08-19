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

import type React from "react";
import type { CSSProperties, ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { RadioButtonGroup } from ".";

const meta = {
  title: "UI/Form controls/RadioButtonGroup",
  component: RadioButtonGroup,
  parameters: {
    docs: {
      description: {
        component: `RadioButtonGroup renders a group of radio buttons with shared state management.

### Features

- **Two Orientations**: Horizontal and vertical layouts
- **Disabled State**: Disable all or individual radio buttons
- **Text Labels**: Insert text items between radio buttons
- **Custom Styling**: Configurable font size, weight, spacing, and width
- **Controlled Selection**: Managed selected state with callback

### Usage

\`\`\`tsx
import { RadioButtonGroup } from "@docspace/ui-kit/components/radio-button-group";

const options = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
];

<RadioButtonGroup
  options={options}
  selected="option1"
  onClick={(e) => console.log(e.target.value)}
  orientation="horizontal"
/>
\`\`\``,
      },
    },
    design: {
      type: "figma",
      url: "https://www.figma.com/file/ZiW5KSwb4t7Tj6Nz5TducC/UI-Kit-DocSpace-1.0.0?type=design&node-id=556-3247&mode=design&t=TBNCKMQKQMxr44IZ-0",
    },
  },
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
      description: "Layout orientation of the radio buttons",
      table: {
        defaultValue: { summary: "horizontal" },
      },
    },
    isDisabled: {
      control: "boolean",
      description: "Disable all radio buttons in the group",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    width: {
      control: "text",
      description: "Width of the radio button group container",
    },
    fontSize: {
      control: "text",
      description: "Font size for radio button labels",
    },
    fontWeight: {
      control: "text",
      description: "Font weight for radio button labels",
    },
    spacing: {
      control: "text",
      description: "Spacing between radio buttons",
      table: {
        defaultValue: { summary: "15px" },
      },
    },
  },
} satisfies Meta<typeof RadioButtonGroup>;

type Story = StoryObj<ComponentProps<typeof RadioButtonGroup>>;

export default meta;

const Wrapper = (props: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gridGap: "24px",
        alignItems: "start",
      }}
    >
      {props.children}
    </div>
  );
};

const baseOptions = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
];

export const Default: Story = {
  args: {
    options: baseOptions,
    orientation: "horizontal",
    selected: "option1",
    onClick: (e: React.ChangeEvent<HTMLInputElement>) =>
      console.log("Selected:", e.target.value),
    spacing: "15px",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Default horizontal radio button group. Click any option to select it.",
      },
      source: {
        code: `<RadioButtonGroup
  options={options}
  selected="option1"
  orientation="horizontal"
  onClick={handleClick}
/>`,
      },
    },
  },
};

const VerticalTemplate = () => {
  return (
    <RadioButtonGroup
      options={baseOptions}
      selected="option1"
      orientation="vertical"
      onClick={() => {}}
    />
  );
};

export const VerticalLayout: Story = {
  render: () => <VerticalTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Vertical layout stacks radio buttons on top of each other. Useful for longer option lists or forms.",
      },
      source: {
        code: `<RadioButtonGroup
  options={options}
  selected="option1"
  orientation="vertical"
  onClick={handleClick}
/>`,
      },
    },
  },
};

const DisabledTemplate = () => {
  return (
    <Wrapper>
      <RadioButtonGroup
        options={baseOptions}
        selected="option1"
        isDisabled
        onClick={() => {}}
      />
      <RadioButtonGroup
        options={[
          ...baseOptions,
          { value: "option4", label: "Disabled Option", disabled: true },
        ]}
        selected="option1"
        onClick={() => {}}
      />
    </Wrapper>
  );
};

export const DisabledStates: Story = {
  render: () => <DisabledTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Left: entire group disabled. Right: individual option disabled while others remain interactive.",
      },
      source: {
        code: `// All disabled
<RadioButtonGroup options={options} selected="option1" isDisabled onClick={handleClick} />

// Individual option disabled
<RadioButtonGroup
  options={[...options, { value: "opt4", label: "Disabled", disabled: true }]}
  selected="option1"
  onClick={handleClick}
/>`,
      },
    },
  },
};

const WithTextLabelTemplate = () => {
  return (
    <RadioButtonGroup
      options={[
        { type: "text", label: "Please select an option:", value: "" },
        ...baseOptions,
      ]}
      selected="option1"
      orientation="vertical"
      onClick={() => {}}
    />
  );
};

export const WithTextLabel: Story = {
  render: () => <WithTextLabelTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          'Options with `type: "text"` render as plain text labels instead of radio buttons. Useful for adding headings or instructions within the group.',
      },
      source: {
        code: `<RadioButtonGroup
  options={[
    { type: "text", label: "Please select an option:", value: "" },
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
  ]}
  selected="option1"
  orientation="vertical"
  onClick={handleClick}
/>`,
      },
    },
  },
};

const CustomStylingTemplate = () => {
  return (
    <RadioButtonGroup
      options={baseOptions}
      selected="option1"
      fontSize="16px"
      fontWeight="600"
      spacing="20px"
      width="300px"
      onClick={() => {}}
    />
  );
};

export const CustomStyling: Story = {
  render: () => <CustomStylingTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Custom font size, weight, spacing, and container width for radio button labels.",
      },
      source: {
        code: `<RadioButtonGroup
  options={options}
  selected="option1"
  fontSize="16px"
  fontWeight="600"
  spacing="20px"
  width="300px"
  onClick={handleClick}
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
          "--radio-button-group-subtext-top": "24px",
          "--radio-button-group-subtext-bottom": "12px",
        } as CSSProperties
      }
    >
      <RadioButtonGroup
        options={[
          { type: "text", label: "Choose an option:", value: "" },
          { value: "option1", label: "Option 1" },
          { value: "option2", label: "Option 2" },
          { value: "option3", label: "Option 3" },
        ]}
        selected="option1"
        orientation="vertical"
        onClick={() => {}}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `CSS Custom Properties for external customization:

| Variable | Description | Default |
|----------|-------------|---------|
| \`--radio-button-group-subtext-top\` | Subtext top margin | \`16px\` |
| \`--radio-button-group-subtext-bottom\` | Subtext bottom margin | \`8px\` |`,
      },
    },
  },
};
