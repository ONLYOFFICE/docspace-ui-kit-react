import { useState } from "react";
import type { ComponentProps, CSSProperties } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { globalColors } from "../../providers/theme";

import { ColorPicker } from ".";

const meta = {
  title: "UI/Form controls/ColorPicker",
  component: ColorPicker,
  parameters: {
    docs: {
      description: {
        component: `Visual color picker component for selecting colors using a gradient area, hue slider, or hex code input. Supports both standalone picker mode and a full interface with apply/cancel actions.

### Features

- **Visual Picker**: Picks saturation and brightness by dragging a pointer across a gradient square
- **Hue Slider**: Changes the base hue by dragging a pointer along a rainbow strip under the square
- **Hex Input**: Accepts a typed hex code behind a caption and follows every move of either pointer
- **Action Buttons**: Hands the chosen color to the caller on apply and asks the caller to close on cancel, both with caller-supplied texts
- **Picker-Only Mode**: Replaces the hex field and both buttons with a "Custom" title and a closing cross, the shape used inside a drop-down
- **Live Changes**: Reports the color on every pointer move and every valid hex code typed, so the caller can preview it before applying
- **Initial Color**: Starts on the given hex color, read once on mount, so changing it later does not move the pointers
- **Phone Width**: Stretches to the window width less 16px on each side on screens up to 600px wide

### Accessibility

The picker gives keyboard and screen-reader users the following:

- **Dialog**: The root has \`role="dialog"\` with the accessible name "Color picker"
- **Sliders**: The square and the strip are sliders named "Color" and "Hue"; the square announces its saturation and brightness in percent, the strip its hue in degrees
- **Keyboard**: Arrow keys move the pointer of the focused slider by a twentieth of its range per press
- **Named Controls**: The hex field is named "Hex color value", the closing cross "Close color picker", and each button by its own label

### Usage

\`\`\`tsx
import { ColorPicker } from "@onlyoffice/apps-ui-kit/components/color-picker";

// Full picker with buttons
<ColorPicker
  appliedColor="#4781D1"
  onApply={(color) => console.log("Applied:", color)}
  onClose={() => console.log("Cancelled")}
  isPickerOnly={false}
/>

// Picker only: a title and a closing cross, no hex field or buttons
<ColorPicker appliedColor="#FF0000" isPickerOnly />
\`\`\``,
      },
    },
  },
  argTypes: {
    appliedColor: {
      control: "color",
      description:
        "Hex color the picker starts on. It is read once, on mount, so a later change does not move the pointers",
      table: {
        defaultValue: { summary: "globalColors.lightBlueMain" },
      },
    },
    isPickerOnly: {
      control: "boolean",
      description:
        'Draws a "Custom" title and a closing cross above the picker and drops the hex field and both buttons',
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
      description:
        "Called with the chosen hex color when the apply button is clicked",
    },
    onClose: {
      description:
        "Called by the cancel button, and by the closing cross in picker-only mode; the picker does not hide itself",
    },
    handleChange: {
      description:
        "Called with the hex color on every pointer move and every valid hex code typed",
    },
    className: {
      control: "text",
      description: "Class name added to the outermost element",
    },
    id: {
      control: "text",
      description: "Id of the outermost element",
    },
  },
} satisfies Meta<typeof ColorPicker>;

type Story = StoryObj<ComponentProps<typeof ColorPicker>>;

export default meta;

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
  parameters: {
    docs: {
      description: {
        story:
          "The full picker a settings form shows: drag either pointer or type a hex code, then apply or cancel. Change any other prop live in the Controls panel below.",
      },
      source: {
        code: `<ColorPicker
  isPickerOnly={false}
  appliedColor="#4781D1"
  onApply={(color) => console.log("Applied:", color)}
  onClose={() => console.log("Cancelled")}
/>`,
      },
    },
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
          'The compact shape for a drop-down: a "Custom" title and a closing cross above the square and the strip, with no hex field and no buttons (`isPickerOnly`). The caller reads the color from `handleChange` and hides the picker from `onClose`.',
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
          "The component translates none of its texts, so a caller passes its own for the buttons and the hex caption (`applyButtonLabel`, `cancelButtonLabel`, `hexCodeLabel`).",
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

const LiveColorReadoutTemplate = () => {
  const [color, setColor] = useState(globalColors.lightBlueMain);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <ColorPicker
        isPickerOnly={false}
        appliedColor={globalColors.lightBlueMain}
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

export const LiveColorReadout: Story = {
  render: () => <LiveColorReadoutTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Drag a pointer or type a hex code and watch the line under the picker follow: the caller keeps its own copy of the color from every change (`handleChange`), which is how it previews a color before it is applied. The picker keeps its own state, so the caller cannot move the pointers by changing `appliedColor` afterwards.",
      },
      source: {
        code: `const [color, setColor] = useState("#4781D1");

<ColorPicker
  isPickerOnly={false}
  appliedColor="#4781D1"
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
          'A picker that opens on a color the user saved earlier starts from it: here red (`appliedColor="#FF0000"`), with the hex field showing the same code.',
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

const RightToLeftTemplate = () => {
  return (
    <div dir="rtl">
      <ColorPicker
        isPickerOnly={false}
        appliedColor={globalColors.lightBlueMain}
        applyButtonLabel={"\u062a\u0637\u0628\u064a\u0642"}
        cancelButtonLabel={"\u0625\u0644\u063a\u0627\u0621"}
        hexCodeLabel={"\u0631\u0645\u0632 \u0627\u0644\u0644\u0648\u0646"}
        onApply={(color) => console.log("Applied:", color)}
        onClose={() => console.log("Closed")}
      />
    </div>
  );
};

export const RightToLeft: Story = {
  render: () => <RightToLeftTemplate />,
  globals: { direction: "rtl" },
  parameters: {
    noPadding: true,
    docs: {
      // Framed: an inline RTL story would flip the whole Docs page
      story: { inline: false, height: "418px" },
      description: {
        story:
          'The picker in a right-to-left layout with Arabic texts: the picker moves to the right edge, the hex caption and code align right and the apply button sits to the right of cancel, while the square and the strip keep their left-to-right gradients. The wrapper carries `dir="rtl"`; the direction also comes from the theme\'s `interfaceDirection` (the Direction toolbar).',
      },
      source: {
        code: `<div dir="rtl">
  <ColorPicker
    isPickerOnly={false}
    appliedColor="#4781D1"
    applyButtonLabel="..."
    cancelButtonLabel="..."
    hexCodeLabel="..."
  />
</div>`,
      },
    },
  },
};

const CssCustomizationTemplate = () => {
  return (
    <div
      style={
        {
          // === ColorPicker — picker and hue slider ===
          "--color-picker-width": "240px",
          "--color-picker-hue-height": "16px",
          "--color-picker-hue-radius": "8px",
          // === ColorPicker — hex input field ===
          "--color-picker-border-style": "1px solid #0082c9",
          "--color-picker-bg": "#f0f8ff",
          "--color-picker-text-color": "#004f82",
          "--color-picker-input-height": "36px",
          "--color-picker-input-padding": "6px 12px",
          "--color-picker-input-radius": "8px",
          // === Button — apply (primary) ===
          "--button-primary-bg": "#0082c9",
          "--button-primary-border": "1px solid #0082c9",
          "--button-primary-color": "#fff",
          "--button-primary-bg-hover": "#006ba6",
          // === Button — cancel (secondary) ===
          "--button-root-bg": "#f0f8ff",
          "--button-root-border": "1px solid #0082c9",
          "--button-root-color": "#004f82",
          "--button-root-bg-hover": "#d6ecf8",
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
        story: `CSS Custom Properties for external customization. Hover either button to see its hover background:

**ColorPicker — picker and hue slider**

| Variable | Description | Default |
|----------|-------------|---------|
| \`--color-picker-width\` | Width of the picker; ignored on screens up to 600px wide, where the picker takes the window width less 32px | \`195px\` |
| \`--color-picker-hue-height\` | Hue slider height | \`12px\` |
| \`--color-picker-hue-radius\` | Hue slider corner radius | \`6px\` |

**ColorPicker — hex input**

| Variable | Description | Default |
|----------|-------------|---------|
| \`--color-picker-border-style\` | Hex input border, as a full \`border\` value | \`1px solid #d0d5da\` |
| \`--color-picker-bg\` | Hex input background | \`#ffffff\` |
| \`--color-picker-text-color\` | Hex input text color | \`#555f65\` |
| \`--color-picker-input-height\` | Hex input height | \`32px\` |
| \`--color-picker-input-padding\` | Hex input padding | \`6px 8px\` |
| \`--color-picker-input-radius\` | Hex input corner radius | \`3px\` |

**Button — apply (primary)**

| Variable | Description | Default |
|----------|-------------|---------|
| \`--button-primary-bg\` | Apply button background | theme-based |
| \`--button-primary-border\` | Apply button border | theme-based |
| \`--button-primary-color\` | Apply button text color | theme-based |
| \`--button-primary-bg-hover\` | Apply button background on hover | theme-based |

**Button — cancel (secondary)**

| Variable | Description | Default |
|----------|-------------|---------|
| \`--button-root-bg\` | Cancel button background | theme-based |
| \`--button-root-border\` | Cancel button border | theme-based |
| \`--button-root-color\` | Cancel button text color | theme-based |
| \`--button-root-bg-hover\` | Cancel button background on hover | theme-based |
| \`--button-root-border-radius\` | Corner radius of both buttons | \`3px\` |`,
      },
      source: {
        code: `<div
  style={{
    "--color-picker-width": "240px",
    "--color-picker-border-style": "1px solid #0082c9",
    "--button-primary-bg": "#0082c9",
    "--button-root-border-radius": "8px",
  }}
>
  <ColorPicker isPickerOnly={false} appliedColor="#4781D1" />
</div>`,
      },
    },
  },
};
