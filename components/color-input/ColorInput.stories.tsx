import type React from "react";
import type { ComponentProps, CSSProperties } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { InputSize } from "../text-input";
import { globalColors } from "../../providers/theme";

import { ColorInput } from ".";

const meta = {
  title: "UI/Form controls/ColorInput",
  component: ColorInput,
  parameters: {
    docs: {
      description: {
        component: `Color input component that allows users to enter and select colors using a hex value or integrated color picker.

### Features

- **Hex Input**: Enter color values directly as hex codes
- **Validation While Typing**: Drops any character that is not a hex digit, reports a new color only once the field holds a complete 3- or 6-digit code, and puts the last valid color back when the field loses focus with an incomplete one
- **Color Picker**: Built-in color picker for visual selection, opened by clicking the swatch at the end of the field and closed by its own close button or a click outside
- **Live Updates**: Every accepted edit in the field and every move in the picker recolors the swatch and calls \`handleChange\` at once, with no confirm step
- **Starting Color**: Starts on \`defaultColor\`, or on the kit's blue when it is left out, and keeps its own value from then on
- **Three Sizes**: Base, middle and large widen the field and, at large, enlarge its text, while the height stays the same
- **Validation States**: Error and warning visual indicators
- **Full Width**: Scale to 100% width when needed

### Usage

\`\`\`tsx
import { ColorInput } from "@onlyoffice/apps-ui-kit/components/color-input";
import { InputSize } from "@onlyoffice/apps-ui-kit/components/text-input";

// Starting color and a change handler
<ColorInput
  defaultColor="#4781D1"
  handleChange={(color) => console.log(color)}
/>

// Wider field that fills its container
<ColorInput size={InputSize.middle} scale handleChange={setColor} />

// Rejected value
<ColorInput defaultColor="#4781D1" hasError />
\`\`\``,
      },
    },
  },
  argTypes: {
    defaultColor: {
      control: "color",
      description:
        "Hex color the field starts on; read once on mount, after which the field keeps its own value",
      table: {
        defaultValue: { summary: "#4781D1" },
      },
    },
    size: {
      control: "select",
      options: Object.values(InputSize),
      description:
        "Width, font size and padding of the field; the height is the same at every size",
      table: {
        defaultValue: { summary: "undefined" },
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
      description:
        "Disable the input field; the swatch stops opening the picker too",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    hasError: {
      control: "boolean",
      description: "Draws the field's border in the error color",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    hasWarning: {
      control: "boolean",
      description: "Draws the field's border in the warning color",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    handleChange: {
      action: "handleChange",
      description:
        "Called with the new hex color each time the field holds a complete 3- or 6-digit code and on every move in the picker",
    },
    className: {
      control: "text",
      description: "Class applied to the outermost element",
    },
    id: {
      control: "text",
      description: "HTML id of the outermost element",
    },
    dataTestId: {
      control: "text",
      description: "Value of the outermost element's `data-testid` attribute",
      table: {
        defaultValue: { summary: "color-input" },
      },
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

export const Default: Story = {
  render: (args) => (
    <div style={{ height: "410px" }}>
      <ColorInput {...args} />
    </div>
  ),
  args: {
    defaultColor: globalColors.lightBlueMain,
    size: InputSize.base,
    scale: false,
    isDisabled: false,
    hasError: false,
    hasWarning: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "The field on its own, starting on the kit's blue. Type a hex code or click the swatch to pick one, and change any other prop live in the Controls panel below.",
      },
      source: {
        code: `<ColorInput
  defaultColor="#4781D1"
  size={InputSize.base}
  handleChange={(color) => console.log(color)}
/>`,
      },
    },
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
          handleChange={(color) => console.log(`${size} color changed:`, color)}
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
          "Pick the size that matches the other fields in the same form: **base**, **middle** and **large** differ in width, and **large** also in text size and padding, while all three keep the same height (`size`).",
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
          "Show whether the entered color is accepted: the first field is in its normal state, the second has a red border (`hasError`), the third an orange one (`hasWarning`), and the fourth is greyed out and its swatch no longer opens the picker (`isDisabled`).",
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
          "Use it where the field shares a column with full-width inputs: the field stretches across its container and the swatch stays at its end (`scale`).",
      },
      source: {
        code: `<ColorInput defaultColor="#4781D1" scale />`,
      },
    },
  },
};

const CssCustomizationTemplate = () => {
  return (
    <div
      style={
        {
          "--color-input-height": "36px",
          "--color-input-padding": "6px 12px",
          "--color-input-swatch-size": "24px",
          "--color-input-swatch-radius": "6px",
          "--text-input-color": "#004f82",
          "--text-input-border-color": "#0082c9",
          "--text-input-border-hover": "#005a8c",
          "--text-input-border-focus": "#00324d",
          "--text-input-radius": "8px",
          "--dropdown-border-style": "1px solid #0082c9",
          "--dropdown-shadow": "0 4px 16px rgba(0, 130, 201, 0.25)",
          "--dropdown-radius": "12px",
          height: "410px",
        } as CSSProperties
      }
    >
      <ColorInput defaultColor="#0082c9" handleChange={() => {}} />
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
| \`--color-input-padding\` | Input field padding; only while \`size\` is left out, since every size sets its own padding | \`6px 8px\` |
| \`--color-input-swatch-size\` | Color swatch width and height | \`20px\` |
| \`--color-input-swatch-radius\` | Color swatch border radius | \`2px\` |

**TextInput (hex text field)**

| Variable | Description | Default |
|----------|-------------|---------|
| \`--text-input-color\` | Input text color | theme-based |
| \`--text-input-border-color\` | Input border color | theme-based |
| \`--text-input-border-hover\` | Input border color on hover | theme-based |
| \`--text-input-border-focus\` | Input border color while focused | theme-based |
| \`--text-input-radius\` | Input border radius | theme-based |

**DropDown (color picker popup)**

| Variable | Description | Default |
|----------|-------------|---------|
| \`--dropdown-bg\` | Popup background; shows only in the 8px strips above and below the picker, whose own panel stays white (black in the dark theme) | theme-based |
| \`--dropdown-border-style\` | Popup border | theme-based |
| \`--dropdown-shadow\` | Popup shadow | theme-based |
| \`--dropdown-radius\` | Popup border radius | \`6px\` |

The example sets every variable but \`--dropdown-bg\` on one field: hover and focus it to see the border colors, and click its swatch to open the popup.`,
      },
      source: {
        code: `<div
  style={{
    "--color-input-height": "36px",
    "--color-input-padding": "6px 12px",
    "--color-input-swatch-size": "24px",
    "--color-input-swatch-radius": "6px",
    "--text-input-color": "#004f82",
    "--text-input-border-color": "#0082c9",
    "--text-input-border-hover": "#005a8c",
    "--text-input-border-focus": "#00324d",
    "--text-input-radius": "8px",
    "--dropdown-border-style": "1px solid #0082c9",
    "--dropdown-shadow": "0 4px 16px rgba(0, 130, 201, 0.25)",
    "--dropdown-radius": "12px",
  }}
>
  <ColorInput defaultColor="#0082c9" />
</div>`,
      },
    },
  },
};
