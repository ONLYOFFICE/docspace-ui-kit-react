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
import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Textarea } from ".";

const meta = {
  title: "UI/Interactive elements/Textarea",
  component: Textarea,
  parameters: {
    docs: {
      description: {
        component: `Multi-line text input field with support for copy functionality, line numeration, JSON formatting, and various sizing options.

### Features

- **Copy Support**: Built-in copy button with customizable toast text
- **Line Numeration**: Optional line numbers alongside content
- **JSON Mode**: Auto-format and prettify JSON content
- **Height Options**: Fixed height, full height, or height-scale modes
- **Validation States**: Error and read-only visual indicators

### Usage

\`\`\`tsx
import { Textarea } from "@docspace/ui-kit/components/textarea";

// Basic textarea
<Textarea value={value} onChange={handleChange} placeholder="Enter text" />

// With copy button
<Textarea value={value} enableCopy copyInfoText="Copied!" />

// JSON mode with numeration
<Textarea value={jsonString} isJSONField hasNumeration />
\`\`\``,
      },
    },
  },
  argTypes: {
    value: {
      control: "text",
      description: "Textarea value",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text",
    },
    isDisabled: {
      control: "boolean",
      description: "Disable the textarea",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isReadOnly: {
      control: "boolean",
      description: "Make the textarea read-only",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    hasError: {
      control: "boolean",
      description: "Show error state",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    maxLength: {
      control: "number",
      description: "Maximum character length",
    },
    heightTextArea: {
      control: "text",
      description: "Custom height of the textarea",
    },
    fontSize: {
      control: "number",
      description: "Font size in pixels",
    },
    color: {
      control: "color",
      description: "Text color",
    },
    enableCopy: {
      control: "boolean",
      description: "Show copy icon",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    hasNumeration: {
      control: "boolean",
      description: "Show line numbers",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isJSONField: {
      control: "boolean",
      description: "Prettify JSON and add line numeration",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    heightScale: {
      control: "boolean",
      description: "Scale height to container",
      table: {
        defaultValue: { summary: "false" },
      },
    },
  },
} satisfies Meta<typeof Textarea>;

type Story = StoryObj<ComponentProps<typeof Textarea>>;

export default meta;

const Wrapper = (props: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gridGap: "16px",
        alignItems: "start",
      }}
    >
      {props.children}
    </div>
  );
};

const ControlledTextarea = (
  props: Partial<ComponentProps<typeof Textarea>> & { initialValue?: string },
) => {
  const { initialValue, ...rest } = props;
  const [val, setValue] = useState(initialValue || rest.value || "");

  return (
    <Textarea
      {...rest}
      value={val}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

export const Default: Story = {
  render: (args) => <ControlledTextarea {...args} />,
  args: {
    placeholder: "Enter text here",
    isDisabled: false,
    isReadOnly: false,
    hasError: false,
    heightTextArea: "150px",
    value: "",
  },
};

const StatesTemplate = () => {
  return (
    <Wrapper>
      <ControlledTextarea
        initialValue="Normal textarea"
        placeholder="Normal"
        heightTextArea="100px"
      />
      <ControlledTextarea
        initialValue="Error state"
        hasError
        heightTextArea="100px"
      />
      <ControlledTextarea
        initialValue="Disabled textarea"
        isDisabled
        heightTextArea="100px"
      />
      <ControlledTextarea
        initialValue="Read-only textarea"
        isReadOnly
        heightTextArea="100px"
      />
    </Wrapper>
  );
};

export const States: Story = {
  render: () => <StatesTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Textarea supports normal, error, disabled, and read-only states.",
      },
      source: {
        code: `<Textarea value="Normal textarea" />
<Textarea value="Error state" hasError />
<Textarea value="Disabled textarea" isDisabled />
<Textarea value="Read-only textarea" isReadOnly />`,
      },
    },
  },
};

const WithCopyTemplate = () => {
  return (
    <div style={{ width: "400px" }}>
      <ControlledTextarea
        initialValue="This text can be copied using the copy button."
        enableCopy
        copyInfoText="Text copied to clipboard!"
        heightTextArea="100px"
      />
    </div>
  );
};

export const WithCopy: Story = {
  render: () => <WithCopyTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Enable a copy button that copies textarea content to the clipboard with a customizable toast message.",
      },
      source: {
        code: `<Textarea
  value="This text can be copied"
  enableCopy
  copyInfoText="Text copied to clipboard!"
/>`,
      },
    },
  },
};

const WithNumerationTemplate = () => {
  return (
    <div style={{ width: "400px" }}>
      <ControlledTextarea
        initialValue={`Line 1: First line of text\nLine 2: Second line of text\nLine 3: Third line of text\nLine 4: Fourth line of text\nLine 5: Fifth line of text`}
        hasNumeration
        heightTextArea="150px"
      />
    </div>
  );
};

export const WithNumeration: Story = {
  render: () => <WithNumerationTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Display line numbers alongside the textarea content.",
      },
      source: {
        code: `<Textarea
  value="Line 1\\nLine 2\\nLine 3"
  hasNumeration
/>`,
      },
    },
  },
};

const sampleJSON = JSON.stringify(
  {
    name: "DocSpace",
    version: "1.0.0",
    features: ["collaboration", "sharing", "editing"],
  },
  null,
  2,
);

const JSONFieldTemplate = () => {
  return (
    <div style={{ width: "400px" }}>
      <ControlledTextarea
        initialValue={sampleJSON}
        isJSONField
        hasNumeration
        heightTextArea="200px"
      />
    </div>
  );
};

export const JSONField: Story = {
  render: () => <JSONFieldTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "JSON mode auto-formats and prettifies JSON content with line numeration.",
      },
      source: {
        code: `<Textarea
  value='{"name": "DocSpace", "version": "1.0.0"}'
  isJSONField
  hasNumeration
/>`,
      },
    },
  },
};

const CustomHeightTemplate = () => {
  return (
    <Wrapper>
      <ControlledTextarea
        initialValue="Small textarea"
        heightTextArea="80px"
        placeholder="80px height"
      />
      <ControlledTextarea
        initialValue="Medium textarea"
        heightTextArea="150px"
        placeholder="150px height"
      />
      <ControlledTextarea
        initialValue="Large textarea"
        heightTextArea="250px"
        placeholder="250px height"
      />
    </Wrapper>
  );
};

export const CssCustomization: Story = {
  render: () => (
    <div
      style={
        {
          width: "300px",
          "--textarea-bg": "#f5f3ff",
          "--textarea-border-color": "#7c3aed",
          "--textarea-text-color": "#4c1d95",
          "--textarea-font-size": "14px",
          "--textarea-radius": "8px",
          "--textarea-numeration-text-color": "#a78bfa",
          "--textarea-padding": "8px 12px 4px",
          "--textarea-height-custom": "120px",
        } as CSSProperties
      }
    >
      <Textarea
        value="Custom styled textarea with CSS variables"
        onChange={() => {}}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `CSS Custom Properties for external customization:

| Variable | Description | Default |
|----------|-------------|---------|
| \`--textarea-bg\` | Background color | theme token |
| \`--textarea-border-color\` | Border color | theme token |
| \`--textarea-text-color\` | Text color | theme token |
| \`--textarea-font-size\` | Font size | \`13px\` |
| \`--textarea-radius\` | Border radius | theme token |
| \`--textarea-padding\` | Textarea padding | \`5px 8px 2px\` |
| \`--textarea-numeration-text-color\` | Line number color | theme token |
| \`--textarea-width\` | Max width | \`1200px\` |
| \`--textarea-height\` | Fixed height | \`89px\` |
| \`--textarea-height-scale\` | Height when heightScale is true | \`65vh\` |
| \`--textarea-height-full\` | Height when isFullHeight is true | \`--full-height\` |
| \`--textarea-height-custom\` | Height when heightTextArea prop is set | prop value |`,
      },
    },
  },
};

export const CustomHeights: Story = {
  render: () => <CustomHeightTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "The heightTextArea prop allows setting a custom height for the textarea.",
      },
      source: {
        code: `<Textarea value="Small" heightTextArea="80px" />
<Textarea value="Medium" heightTextArea="150px" />
<Textarea value="Large" heightTextArea="250px" />`,
      },
    },
  },
};
