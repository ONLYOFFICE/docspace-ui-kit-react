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

import { TextInput } from ".";
import { InputSize, InputType } from "./TextInput.enums";

const meta = {
  title: "UI/Interactive elements/TextInput",
  component: TextInput,
  parameters: {
    docs: {
      description: {
        component: `Single-line text input field with support for various types, sizes, states, and input masking.

### Features

- **Multiple Types**: text, password, email, tel, search, and number
- **Three Sizes**: base, middle, and large
- **Input Masking**: Format input with custom masks (e.g., date, phone)
- **Validation States**: Error and warning visual indicators
- **Full Width**: Scale to 100% width when needed
- **Bold Text**: Option for bold font weight

### Usage

\`\`\`tsx
import { TextInput, InputSize, InputType } from "@docspace/ui-kit/components/text-input";

// Basic text input
<TextInput value={value} onChange={handleChange} placeholder="Enter text" />

// With input mask
<TextInput
  mask={[/\\d/, /\\d/, "/", /\\d/, /\\d/, "/", /\\d/, /\\d/, /\\d/, /\\d/]}
  placeholder="DD/MM/YYYY"
  guide
/>

// Error state
<TextInput hasError value="Invalid" />
\`\`\``,
      },
    },
    design: {
      type: "figma",
      url: "https://www.figma.com/file/ZiW5KSwb4t7Tj6Nz5TducC/UI-Kit-DocSpace-1.0.0?type=design&node-id=633-3686&mode=dev",
    },
  },
  argTypes: {
    size: {
      control: "select",
      options: Object.values(InputSize),
      description: "Size variant of the input",
      table: {
        defaultValue: { summary: "base" },
      },
    },
    type: {
      control: "select",
      options: Object.values(InputType),
      description: "HTML input type",
      table: {
        defaultValue: { summary: "text" },
      },
    },
    value: {
      control: "text",
      description: "Input value",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text",
    },
    isDisabled: {
      control: "boolean",
      description: "Disable the input field",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isReadOnly: {
      control: "boolean",
      description: "Make the input read-only",
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
    hasWarning: {
      control: "boolean",
      description: "Show warning state",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    scale: {
      control: "boolean",
      description: "Scale input to 100% width",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withBorder: {
      control: "boolean",
      description: "Show border around the input",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    isBold: {
      control: "boolean",
      description: "Set font weight to 600",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    maxLength: {
      control: "number",
      description: "Maximum character length",
    },
  },
} satisfies Meta<typeof TextInput>;

type Story = StoryObj<ComponentProps<typeof TextInput>>;

export default meta;

const Wrapper = (props: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gridGap: "16px",
        alignItems: "center",
      }}
    >
      {props.children}
    </div>
  );
};

const ControlledInput = (
  props: Partial<ComponentProps<typeof TextInput>> & { initialValue?: string },
) => {
  const { initialValue, type = InputType.text, ...rest } = props;
  const [val, setValue] = useState(initialValue || rest.value || "");

  return (
    <TextInput
      {...rest}
      type={type}
      value={val}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        setValue(e.target.value)
      }
    />
  );
};

export const Default: Story = {
  render: (args) => <ControlledInput {...args} />,
  args: {
    placeholder: "Enter text here",
    maxLength: 255,
    size: InputSize.base,
    type: InputType.text,
    isDisabled: false,
    isReadOnly: false,
    hasError: false,
    hasWarning: false,
    scale: false,
    withBorder: true,
    value: "",
  },
};

const SizesTemplate = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", alignItems: "flex-start" }}>
      {(Object.keys(InputSize) as Array<InputSize>).map((size) => (
        <ControlledInput
          key={size}
          size={size}
          initialValue={`${size[0].toUpperCase()}${size.slice(1)} size`}
          placeholder={`${size} input`}
        />
      ))}
    </div>
  );
};

export const Sizes: Story = {
  render: () => <SizesTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "TextInput supports three sizes: base, middle, and large for different UI contexts.",
      },
      source: {
        code: `<TextInput size={InputSize.base} value="Base size" />
<TextInput size={InputSize.middle} value="Middle size" />
<TextInput size={InputSize.large} value="Large size" />`,
      },
    },
  },
};

const TypesTemplate = () => {
  return (
    <Wrapper>
      <ControlledInput type={InputType.text} placeholder="Text" />
      <ControlledInput type={InputType.password} placeholder="Password" />
      <ControlledInput type={InputType.email} placeholder="Email" />
      <ControlledInput type={InputType.tel} placeholder="Telephone" />
      <ControlledInput type={InputType.search} placeholder="Search" />
      <ControlledInput type={InputType.number} placeholder="Number" />
    </Wrapper>
  );
};

export const Types: Story = {
  render: () => <TypesTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "TextInput supports text, password, email, tel, search, and number types.",
      },
      source: {
        code: `<TextInput type={InputType.text} placeholder="Text" />
<TextInput type={InputType.password} placeholder="Password" />
<TextInput type={InputType.email} placeholder="Email" />
<TextInput type={InputType.tel} placeholder="Telephone" />
<TextInput type={InputType.search} placeholder="Search" />
<TextInput type={InputType.number} placeholder="Number" />`,
      },
    },
  },
};

const StatesTemplate = () => {
  return (
    <Wrapper>
      <ControlledInput initialValue="Normal" placeholder="Normal" />
      <ControlledInput
        initialValue="Error state"
        hasError
        placeholder="Error"
      />
      <ControlledInput
        initialValue="Warning state"
        hasWarning
        placeholder="Warning"
      />
      <ControlledInput
        initialValue="Disabled"
        isDisabled
        placeholder="Disabled"
      />
      <ControlledInput
        initialValue="Read only"
        isReadOnly
        placeholder="Read only"
      />
      <ControlledInput
        initialValue="No border"
        withBorder={false}
        placeholder="No border"
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
          "TextInput supports multiple states: normal, error, warning, disabled, read-only, and borderless.",
      },
      source: {
        code: `<TextInput value="Normal" />
<TextInput value="Error state" hasError />
<TextInput value="Warning state" hasWarning />
<TextInput value="Disabled" isDisabled />
<TextInput value="Read only" isReadOnly />
<TextInput value="No border" withBorder={false} />`,
      },
    },
  },
};

const WithMaskTemplate = () => {
  return (
    <Wrapper>
      <ControlledInput
        mask={[/\d/, /\d/, "/", /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/]}
        placeholder="DD/MM/YYYY"
        guide
        keepCharPositions
      />
      <ControlledInput
        mask={[
          "+",
          /\d/,
          " ",
          "(",
          /\d/,
          /\d/,
          /\d/,
          ")",
          " ",
          /\d/,
          /\d/,
          /\d/,
          "-",
          /\d/,
          /\d/,
          /\d/,
          /\d/,
        ]}
        placeholder="+1 (___) ___-____"
        guide
      />
    </Wrapper>
  );
};

export const WithMask: Story = {
  render: () => <WithMaskTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Input masking formats user input into predefined patterns like dates and phone numbers.",
      },
      source: {
        code: `// Date mask
<TextInput
  mask={[/\\d/, /\\d/, "/", /\\d/, /\\d/, "/", /\\d/, /\\d/, /\\d/, /\\d/]}
  placeholder="DD/MM/YYYY"
  guide
  keepCharPositions
/>

// Phone mask
<TextInput
  mask={["+", /\\d/, " ", "(", /\\d/, /\\d/, /\\d/, ")", " ", /\\d/, /\\d/, /\\d/, "-", /\\d/, /\\d/, /\\d/, /\\d/]}
  placeholder="+1 (___) ___-____"
  guide
/>`,
      },
    },
  },
};

const ScaledTemplate = () => {
  return (
    <div style={{ display: "grid", gridGap: "16px" }}>
      <ControlledInput
        scale
        initialValue="Scaled base"
        size={InputSize.base}
      />
      <ControlledInput
        scale
        initialValue="Scaled middle"
        size={InputSize.middle}
      />
      <ControlledInput
        scale
        initialValue="Scaled large"
        size={InputSize.large}
      />
    </div>
  );
};

export const ScaledInputs: Story = {
  render: () => <ScaledTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Scale prop makes inputs expand to 100% of their container width.",
      },
      source: {
        code: `<TextInput scale size={InputSize.base} value="Scaled base" />
<TextInput scale size={InputSize.middle} value="Scaled middle" />
<TextInput scale size={InputSize.large} value="Scaled large" />`,
      },
    },
  },
};

const BoldTemplate = () => {
  return (
    <Wrapper>
      <ControlledInput initialValue="Normal weight" />
      <ControlledInput initialValue="Bold weight" isBold />
    </Wrapper>
  );
};

export const CssCustomization: Story = {
  render: () => (
    <div
      style={
        {
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          width: "300px",
          "--text-input-bg": "#f5f3ff",
          "--text-input-border-color": "#7c3aed",
          "--text-input-font-size": "14px",
          "--text-input-radius": "8px",
          "--text-input-color": "#4c1d95",
        } as CSSProperties
      }
    >
      <TextInput type={InputType.text} value="Custom styled input" onChange={() => {}} />
      <TextInput type={InputType.text} value="" placeholder="Placeholder text" onChange={() => {}} />
      <TextInput type={InputType.text} value="Disabled" isDisabled onChange={() => {}} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `CSS Custom Properties for external customization:

| Variable | Description | Default |
|----------|-------------|---------|
| \`--text-input-bg\` | Background color | theme token |
| \`--text-input-border-color\` | Border color | theme token |
| \`--text-input-color\` | Text color | theme token |
| \`--text-input-font-size\` | Font size (all sizes) | \`13px\` / \`16px\` |
| \`--text-input-radius\` | Border radius | theme token |
| \`--text-input-placeholder-color\` | Placeholder text color | theme token |`,
      },
    },
  },
};

export const BoldText: Story = {
  render: () => <BoldTemplate />,
  parameters: {
    docs: {
      description: {
        story: "The isBold prop sets font-weight to 600 for emphasized text.",
      },
      source: {
        code: `<TextInput value="Normal weight" />
<TextInput value="Bold weight" isBold />`,
      },
    },
  },
};
