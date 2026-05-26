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
import type { ComponentProps, CSSProperties } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { InputSize } from "../text-input";
import { globalColors } from "../../providers/theme";

import { ColorInput } from ".";

const meta = {
  title: "UI/Interactive elements/ColorInput",
  component: ColorInput,
  parameters: {
    docs: {
      description: {
        component: `Color input component that allows users to enter and select colors using a hex value or integrated color picker.

### Features

- **Hex Input**: Enter color values directly as hex codes
- **Color Picker**: Built-in color picker for visual selection
- **Three Sizes**: base, middle, and large
- **Validation States**: Error and warning visual indicators
- **Full Width**: Scale to 100% width when needed

### Usage

\`\`\`tsx
import { ColorInput } from "@docspace/ui-kit/components/color-input";

<ColorInput
  defaultColor="#4781D1"
  handleChange={(color) => console.log(color)}
/>
\`\`\``,
      },
    },
  },
  argTypes: {
    defaultColor: {
      control: "color",
      description: "Initial color value in hex format",
    },
    size: {
      control: "select",
      options: Object.values(InputSize),
      description: "Size of the input field",
      table: {
        defaultValue: { summary: "base" },
      },
    },
    scale: {
      control: "boolean",
      description: "Scale input to 100% width",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isDisabled: {
      control: "boolean",
      description: "Disable the input field",
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
    handleChange: {
      description: "Callback when the color value changes",
    },
  },
} satisfies Meta<typeof ColorInput>;

type Story = StoryObj<ComponentProps<typeof ColorInput>>;

export default meta;

const Wrapper = (props: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gridGap: "16px",
        alignItems: "start",
        minHeight: "420px",
      }}
    >
      {props.children}
    </div>
  );
};

const CssCustomizationTemplate = () => {
  return (
    <div
      style={
        {
          // === ColorInput — input field ===
          "--color-input-height": "36px",
          "--color-input-padding": "6px 12px",
          "--color-input-swatch-size": "24px",
          "--color-input-swatch-radius": "6px",
          // === TextInput (hex text field) ===
          "--text-input-bg": "#f0f8ff",
          "--text-input-color": "#004f82",
          "--text-input-border-color": "#0082c9",
          "--text-input-radius": "8px",
          // === DropDown (color picker popup) ===
          "--dropdown-bg": "#e6f3fb",
          "--dropdown-border-style": "1px solid #0082c9",
          "--dropdown-shadow": "0 4px 16px rgba(0, 130, 201, 0.25)",
          "--dropdown-radius": "12px",
        } as CSSProperties
      }
    >
      <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
        <ColorInput
          defaultColor="#0082c9"
          handleChange={() => {}}
        />
        <ColorInput
          defaultColor="#4CAF50"
          handleChange={() => {}}
        />
      </div>
    </div>
  );
};

export const CssCustomization: Story = {
  render: () => <CssCustomizationTemplate />,
  parameters: {
    docs: {
      description: {
        story: `CSS Custom Properties for external customization:

**ColorInput — input and swatch**

| Variable | Description | Default |
|----------|-------------|---------|
| \`--color-input-height\` | Input field height | \`32px\` |
| \`--color-input-padding\` | Input field padding | \`6px 8px\` |
| \`--color-input-swatch-size\` | Color swatch width and height | \`20px\` |
| \`--color-input-swatch-radius\` | Color swatch border radius | \`2px\` |

**TextInput (hex text field)**

| Variable | Description | Default |
|----------|-------------|---------|
| \`--text-input-bg\` | Input background color | theme-based |
| \`--text-input-color\` | Input text color | theme-based |
| \`--text-input-border-color\` | Input border color | theme-based |
| \`--text-input-radius\` | Input border radius | theme-based |

**DropDown (color picker popup)**

| Variable | Description | Default |
|----------|-------------|---------|
| \`--dropdown-bg\` | Popup background | theme-based |
| \`--dropdown-border-style\` | Popup border | theme-based |
| \`--dropdown-shadow\` | Popup shadow | theme-based |
| \`--dropdown-radius\` | Popup border radius | \`6px\` |`,
      },
    },
  },
};

export const Default: Story = {
  render: (args) => (
    <div style={{ height: "410px" }}>
      <ColorInput {...args} />
    </div>
  ),
  args: {
    defaultColor: globalColors.lightBlueMain,
    handleChange: (color) => console.log("Color changed:", color),
    size: InputSize.base,
    scale: false,
    isDisabled: false,
    hasError: false,
    hasWarning: false,
  },
};

const SizesTemplate = () => {
  return (
    <Wrapper>
      {(Object.values(InputSize) as Array<InputSize>).map((size) => (
        <ColorInput
          key={size}
          defaultColor={globalColors.lightBlueMain}
          size={size}
          handleChange={(color) =>
            console.log(`${size} color changed:`, color)
          }
        />
      ))}
    </Wrapper>
  );
};

export const Sizes: Story = {
  render: () => <SizesTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "ColorInput supports three sizes: base, middle, and large for different UI contexts.",
      },
      source: {
        code: `<ColorInput size={InputSize.base} defaultColor="#4781D1" />
<ColorInput size={InputSize.middle} defaultColor="#4781D1" />
<ColorInput size={InputSize.large} defaultColor="#4781D1" />`,
      },
    },
  },
};

const StatesTemplate = () => {
  return (
    <Wrapper>
      <ColorInput
        defaultColor={globalColors.lightBlueMain}
        handleChange={() => {}}
      />
      <ColorInput
        defaultColor={globalColors.lightBlueMain}
        hasError
        handleChange={() => {}}
      />
      <ColorInput
        defaultColor={globalColors.lightBlueMain}
        hasWarning
        handleChange={() => {}}
      />
      <ColorInput
        defaultColor={globalColors.lightBlueMain}
        isDisabled
        handleChange={() => {}}
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
          "ColorInput supports normal, error, warning, and disabled states.",
      },
      source: {
        code: `<ColorInput defaultColor="#4781D1" />
<ColorInput defaultColor="#4781D1" hasError />
<ColorInput defaultColor="#4781D1" hasWarning />
<ColorInput defaultColor="#4781D1" isDisabled />`,
      },
    },
  },
};

const ScaledTemplate = () => {
  return (
    <div style={{ height: "410px" }}>
      <ColorInput
        defaultColor={globalColors.lightBlueMain}
        scale
        handleChange={(color) => console.log("Color changed:", color)}
      />
    </div>
  );
};

export const ScaledInput: Story = {
  render: () => <ScaledTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Scale prop makes the color input expand to 100% of its container width.",
      },
      source: {
        code: `<ColorInput defaultColor="#4781D1" scale />`,
      },
    },
  },
};
