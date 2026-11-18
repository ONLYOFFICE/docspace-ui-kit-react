import { useState } from "react";
import type { ComponentProps, CSSProperties } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen, waitFor } from "storybook/test";

import { globalColors } from "../../providers/theme";

import { ColorPicker } from ".";

const meta = {
  title: "UI/Form controls/ColorPicker",
  component: ColorPicker,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
  },
  argTypes: {
    appliedColor: {
      control: "color",
      description:
        "Colour the picker starts on, as a hex string. It is read once, on mount — changing it afterwards does not move the picker.",
      table: {
        defaultValue: { summary: "globalColors.lightBlueMain" },
      },
    },
    isPickerOnly: {
      control: "boolean",
      description:
        "`true` draws a header with a title and a closing cross, and no hex field or buttons: the drop-down shape. `false` draws the hex field and the apply/cancel pair, and no header.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    applyButtonLabel: {
      control: "text",
      description:
        'Text of the apply button. Left out, the kit\'s own translation of "Apply" (`Common:ApplyButton`) is used.',
      table: {
        defaultValue: { summary: 't("Common:ApplyButton")' },
      },
    },
    cancelButtonLabel: {
      control: "text",
      description:
        'Text of the cancel button. Left out, the kit\'s own translation of "Cancel" (`Common:CancelButton`) is used.',
      table: {
        defaultValue: { summary: 't("Common:CancelButton")' },
      },
    },
    hexCodeLabel: {
      control: "text",
      description:
        "Caption before the hex field, and the field's accessible name. It is not translated for you.",
      table: {
        defaultValue: { summary: "Hex code" },
      },
    },
    ariaLabel: {
      control: "text",
      description:
        "Accessible name of the picker's group. It is not translated for you.",
      table: {
        defaultValue: { summary: "Color picker" },
      },
    },
    closeButtonLabel: {
      control: "text",
      description:
        "Accessible name of the closing cross drawn in `isPickerOnly` mode. It is not translated for you.",
      table: {
        defaultValue: { summary: "Close color picker" },
      },
    },
    onApply: {
      description:
        "Called with the chosen colour when the apply button is clicked.",
    },
    onClose: {
      description:
        "Called by the cancel button, the closing cross and Escape; unmounting the picker is yours. Without it, Escape is left to the page.",
    },
    handleChange: {
      description:
        "Called on every move of the saturation square and on every hex keystroke.",
    },
    className: {
      control: "text",
      description: "Applied to the outermost element.",
    },
    id: {
      control: "text",
      description: "Applied to the outermost element.",
    },
  },
} satisfies Meta<typeof ColorPicker>;

type Story = StoryObj<ComponentProps<typeof ColorPicker>>;

export default meta;

type PlayContext = Parameters<NonNullable<Story["play"]>>[0];

// Replaces the hex field's code; the field reports only a complete one.
const typeHex = async ({ canvas, userEvent }: PlayContext, hex: string) => {
  const input = canvas.getByLabelText("Hex code:");
  await userEvent.clear(input);
  await userEvent.type(input, hex);
  return input;
};

const onPickerOnlyClose = fn().mockName("onClose");

export const Default: Story = {
  render: (args) => <ColorPicker {...args} />,
  args: {
    isPickerOnly: false,
    appliedColor: globalColors.lightBlueMain,
    applyButtonLabel: "Apply",
    cancelButtonLabel: "Cancel",
    hexCodeLabel: "Hex code",
    onClose: fn(),
    onApply: fn(),
    handleChange: fn(),
  },
  play: async (context) => {
    const { args, canvas, userEvent } = context;
    // A named group: it claims no dialog role it would not live up to.
    await expect(
      canvas.getByRole("group", { name: "Color picker" }),
    ).toBeVisible();
    await expect(canvas.queryByRole("dialog")).toBeNull();

    // A complete hex code moves the picker and is reported.
    await typeHex(context, "00ff00");
    await waitFor(() =>
      expect(args.handleChange).toHaveBeenLastCalledWith("#00ff00"),
    );

    // Apply hands over the chosen color; Cancel only reports the close.
    await userEvent.click(canvas.getByRole("button", { name: "Apply" }));
    await expect(args.onApply).toHaveBeenCalledWith("#00ff00");
    await userEvent.click(canvas.getByRole("button", { name: "Cancel" }));
    await expect(args.onClose).toHaveBeenCalledTimes(1);

    // Escape is the keyboard's cancel.
    canvas.getByLabelText("Hex code:").focus();
    await userEvent.keyboard("{Escape}");
    await expect(args.onClose).toHaveBeenCalledTimes(2);
  },
  parameters: {
    docs: {
      description: {
        story:
          "The full picker a settings form shows: the square, the hue strip, the hex field, and the apply and cancel buttons.",
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
      handleChange={fn()}
      onClose={onPickerOnlyClose}
    />
  );
};

export const PickerOnly: Story = {
  name: "Picker only",
  render: () => <PickerOnlyTemplate />,
  play: async ({ canvas, userEvent }) => {
    // A title and a cross; no hex field and no buttons.
    await expect(canvas.getByTestId("color-picker-title")).toBeVisible();
    await expect(canvas.queryByTestId("color-picker-hex-input")).toBeNull();
    await expect(canvas.queryByTestId("color-picker-buttons")).toBeNull();

    await userEvent.click(canvas.getByTestId("color-picker-close"));
    await expect(onPickerOnlyClose).toHaveBeenCalledTimes(1);
  },
  parameters: {
    docs: {
      description: {
        story:
          'The compact shape for a drop-down (`isPickerOnly`): a "Custom" title and a closing cross, with no hex field and no buttons. The caller reads the colour from `handleChange`.',
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
      onApply={fn()}
      onClose={fn()}
    />
  );
};

export const CustomLabels: Story = {
  name: "Custom labels",
  render: () => <CustomLabelsTemplate />,
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("button", { name: "Save Color" }),
    ).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Discard" })).toBeVisible();
    await expect(
      canvas.getByTestId("color-picker-hex-label"),
    ).toHaveTextContent("Color Code:");
    // The caption is the field's name.
    await expect(canvas.getByLabelText("Color Code:")).toBe(
      canvas.getByTestId("color-picker-hex-input"),
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Button texts and a hex caption set by the caller (`applyButtonLabel`, `cancelButtonLabel`, `hexCodeLabel`). Left out, the buttons are translated by the kit, and the caption stays English.",
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
        onClose={fn()}
      />
      <p style={{ margin: 0, fontSize: "12px" }}>
        Current color: <strong>{color}</strong>
      </p>
    </div>
  );
};

export const LiveColorReadout: Story = {
  name: "Live colour readout",
  render: () => <LiveColorReadoutTemplate />,
  play: async (context) => {
    // The caller's copy follows every change before anything is applied.
    await typeHex(context, "123abc");
    await waitFor(() =>
      expect(context.canvas.getByText("#123abc")).toBeVisible(),
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "A line under the picker that shows the colour as it changes (`handleChange`). The caller keeps its own copy, which is how it previews a colour before it is applied.",
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
      onApply={fn()}
      onClose={fn()}
    />
  );
};

export const PresetColor: Story = {
  name: "Starting colour",
  render: () => <PresetColorTemplate />,
  play: async ({ canvas }) => {
    // The hex field opens on the saved color.
    const input = canvas.getByLabelText("Hex code:") as HTMLInputElement;
    await expect(input.value.toLowerCase()).toBe("#ff0000");
  },
  parameters: {
    docs: {
      description: {
        story:
          'A picker that opens on a saved colour (`appliedColor="#FF0000"`), with the hex field showing the same code.',
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
        onApply={fn()}
        onClose={fn()}
      />
    </div>
  );
};

export const RightToLeft: Story = {
  name: "Right to left",
  render: () => <RightToLeftTemplate />,
  globals: { direction: "rtl" },
  play: async () => {
    // Under RTL the apply button sits to the right of cancel.
    const apply = screen.getByTestId("color-picker-apply");
    const cancel = screen.getByTestId("color-picker-cancel");
    await expect(apply.getBoundingClientRect().left).toBeGreaterThan(
      cancel.getBoundingClientRect().left,
    );
  },
  parameters: {
    noPadding: true,
    docs: {
      // Framed: an inline RTL story would flip the whole Docs page
      story: { inline: false, height: "418px" },
      description: {
        story:
          "The picker in a right-to-left layout with Arabic texts. The hex caption and code align right, and apply sits to the right of cancel. The square and the strip keep their left-to-right gradients.",
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
        onApply={fn()}
        onClose={fn()}
        handleChange={fn()}
      />
    </div>
  );
};

export const CssCustomization: Story = {
  name: "CSS variables",
  render: () => <CssCustomizationTemplate />,
  play: async ({ canvas }) => {
    const input = getComputedStyle(canvas.getByLabelText("Hex code:"));
    await expect(input.borderTopColor).toBe("rgb(0, 130, 201)");
    await expect(input.backgroundColor).toBe("rgb(240, 248, 255)");
    await expect(input.height).toBe("36px");
  },
  parameters: {
    docs: {
      description: {
        story: `A picker under a wrapper that sets every overridable variable. The button variables reach the apply and cancel pair through the same wrapper.`,
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
