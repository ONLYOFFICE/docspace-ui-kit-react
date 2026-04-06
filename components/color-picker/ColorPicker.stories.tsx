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

import { useState } from "react";
import type { ComponentProps, CSSProperties } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { globalColors } from "../../providers/theme";

import { ColorPicker } from ".";

const meta = {
  title: "UI/Interactive elements/ColorPicker",
  component: ColorPicker,
  parameters: {
    docs: {
      description: {
        component: `Visual color picker component for selecting colors using a gradient area, hue slider, or hex code input. Supports both standalone picker mode and a full interface with apply/cancel actions.

### Features

- **Visual Picker**: Gradient-based color selection area
- **Hue Slider**: Slider control for hue selection
- **Hex Input**: Direct hex code entry with label
- **Action Buttons**: Apply and cancel buttons with customizable labels
- **Picker-Only Mode**: Minimal mode showing just the color picker area
- **Controlled Component**: Supports external state management

### Usage

\`\`\`tsx
import { ColorPicker } from "@docspace/ui-kit/components/color-picker";

// Full picker with buttons
<ColorPicker
  appliedColor="#4781D1"
  onApply={(color) => console.log("Applied:", color)}
  onClose={() => console.log("Cancelled")}
  isPickerOnly={false}
/>

// Picker only (no buttons or hex input)
<ColorPicker appliedColor="#FF0000" isPickerOnly />
\`\`\``,
      },
    },
  },
  argTypes: {
    appliedColor: {
      control: "color",
      description: "Currently selected color in hex format",
    },
    isPickerOnly: {
      control: "boolean",
      description:
        "Show only the color picker without hex input and buttons",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    applyButtonLabel: {
      control: "text",
      description: "Label for the apply button",
      table: {
        defaultValue: { summary: "Apply" },
      },
    },
    cancelButtonLabel: {
      control: "text",
      description: "Label for the cancel button",
      table: {
        defaultValue: { summary: "Cancel" },
      },
    },
    hexCodeLabel: {
      control: "text",
      description: "Label for the hex code input field",
      table: {
        defaultValue: { summary: "Hex code" },
      },
    },
    onApply: {
      description: "Callback when the apply button is clicked",
    },
    onClose: {
      description: "Callback when the cancel button is clicked",
    },
    handleChange: {
      description: "Callback on every color change",
    },
  },
} satisfies Meta<typeof ColorPicker>;

type Story = StoryObj<ComponentProps<typeof ColorPicker>>;

export default meta;

const CssCustomizationTemplate = () => {
  return (
    <div
      style={
        {
          // === ColorPicker — hex input field ===
          "--color-picker-border-style": "1px solid #0082c9",
          "--color-picker-bg": "#f0f8ff",
          "--color-picker-text-color": "#004f82",
          "--color-picker-input-radius": "8px",
          "--color-picker-input-height": "36px",
          // === ColorPicker — hue slider ===
          "--color-picker-hue-height": "16px",
          "--color-picker-hue-radius": "8px",
          // === Button (Apply/Cancel buttons) ===
          "--button-root-bg": "#0082c9",
          "--button-root-border": "1px solid #0082c9",
          "--button-root-hover-bg": "#006ba6",
          "--button-root-border-radius": "8px",
        } as CSSProperties
      }
    >
      <ColorPicker
        isPickerOnly={false}
        appliedColor={globalColors.lightBlueMain}
        applyButtonLabel="Apply"
        cancelButtonLabel="Cancel"
        hexCodeLabel="Hex code"
        onApply={() => {}}
        onClose={() => {}}
        handleChange={() => {}}
      />
    </div>
  );
};

export const CssCustomization: Story = {
  render: () => <CssCustomizationTemplate />,
  parameters: {
    docs: {
      description: {
        story: `CSS Custom Properties for external customization:

**ColorPicker — hex input**

| Variable | Description | Default |
|----------|-------------|---------|
| \`--color-picker-border-style\` | Hex input border | theme-based |
| \`--color-picker-bg\` | Hex input background | theme-based |
| \`--color-picker-text-color\` | Hex input text color | theme-based |
| \`--color-picker-input-height\` | Hex input height | \`32px\` |
| \`--color-picker-input-padding\` | Hex input padding | \`6px 8px\` |
| \`--color-picker-input-radius\` | Hex input border radius | \`3px\` |
| \`--color-picker-width\` | Picker container width | \`195px\` |

**ColorPicker — hue slider**

| Variable | Description | Default |
|----------|-------------|---------|
| \`--color-picker-hue-height\` | Hue slider height | \`12px\` |
| \`--color-picker-hue-radius\` | Hue slider border radius | \`6px\` |

**Button (Apply/Cancel)**

| Variable | Description | Default |
|----------|-------------|---------|
| \`--button-root-bg\` | Primary button background | theme accent |
| \`--button-root-border\` | Primary button border | theme accent |
| \`--button-root-hover-bg\` | Primary button hover background | theme accent |
| \`--button-root-border-radius\` | Button border radius | \`3px\` |`,
      },
    },
  },
};

export const Default: Story = {
  render: (args) => <ColorPicker {...args} />,
  args: {
    isPickerOnly: false,
    appliedColor: globalColors.lightBlueMain,
    applyButtonLabel: "Apply",
    cancelButtonLabel: "Cancel",
    hexCodeLabel: "Hex code",
    onClose: () => console.log("Close clicked"),
    onApply: (color) => console.log("Apply clicked with color:", color),
    handleChange: (color) => console.log("Color changed to:", color),
  },
};

const PickerOnlyTemplate = () => {
  return (
    <ColorPicker
      isPickerOnly
      appliedColor={globalColors.lightBlueMain}
      handleChange={(color) => console.log("Color changed:", color)}
    />
  );
};

export const PickerOnly: Story = {
  render: () => <PickerOnlyTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Picker-only mode shows just the color gradient area and hue slider, without hex input or action buttons.",
      },
      source: {
        code: `<ColorPicker isPickerOnly appliedColor="#4781D1" />`,
      },
    },
  },
};

const CustomLabelsTemplate = () => {
  return (
    <ColorPicker
      isPickerOnly={false}
      appliedColor={globalColors.lightBlueMain}
      applyButtonLabel="Save Color"
      cancelButtonLabel="Discard"
      hexCodeLabel="Color Code"
      onApply={(color) => console.log("Saved:", color)}
      onClose={() => console.log("Discarded")}
    />
  );
};

export const CustomLabels: Story = {
  render: () => <CustomLabelsTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Button and input labels can be customized for different locales or UI contexts.",
      },
      source: {
        code: `<ColorPicker
  isPickerOnly={false}
  appliedColor="#4781D1"
  applyButtonLabel="Save Color"
  cancelButtonLabel="Discard"
  hexCodeLabel="Color Code"
/>`,
      },
    },
  },
};

const ControlledTemplate = () => {
  const [color, setColor] = useState(globalColors.lightBlueMain);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <ColorPicker
        isPickerOnly={false}
        appliedColor={color}
        handleChange={(newColor) => setColor(newColor)}
        onApply={(newColor) => {
          setColor(newColor);
          console.log("Applied color:", newColor);
        }}
        onClose={() => console.log("Closed")}
      />
      <p style={{ margin: 0, fontSize: "12px" }}>
        Current color: <strong>{color}</strong>
      </p>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Controlled component using React state to track the selected color in real time.",
      },
      source: {
        code: `const [color, setColor] = useState("#4781D1");

<ColorPicker
  isPickerOnly={false}
  appliedColor={color}
  handleChange={(newColor) => setColor(newColor)}
  onApply={(newColor) => setColor(newColor)}
  onClose={() => console.log("Closed")}
/>`,
      },
    },
  },
};

const PresetColorTemplate = () => {
  return (
    <ColorPicker
      isPickerOnly={false}
      appliedColor="#FF0000"
      onApply={(color) => console.log("Applied:", color)}
      onClose={() => console.log("Closed")}
    />
  );
};

export const PresetColor: Story = {
  render: () => <PresetColorTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Color picker initialized with a preset color value (#FF0000 red).",
      },
      source: {
        code: `<ColorPicker
  isPickerOnly={false}
  appliedColor="#FF0000"
  onApply={(color) => console.log("Applied:", color)}
  onClose={() => console.log("Closed")}
/>`,
      },
    },
  },
};
