import type React from "react";
import type { ComponentProps, CSSProperties } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen, waitFor, within } from "storybook/test";

import { InputSize } from "../text-input";
import { globalColors } from "../../providers/theme";

import { ColorInput } from ".";

const meta = {
  title: "UI/Form controls/ColorInput",
  component: ColorInput,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
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

const statesChange = fn();

const swatchOf = (field: HTMLElement) =>
  field.querySelector<HTMLElement>('[class*="colorBlock"]') as HTMLElement;

// The picker stays mounted while the drop-down is closed, so "open" means
// the dialog is actually on screen.
const shownPicker = () =>
  screen
    .queryAllByTestId("color-picker")
    .find((picker) => picker.checkVisibility());

const pickerShown = () => shownPicker() !== undefined;

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
    handleChange: fn(),
  },
  play: async ({ args, canvas, userEvent }) => {
    const field = canvas.getByTestId("color-input");
    const input = within(field).getByRole("textbox");
    await expect(input).toHaveValue("#4781D1");

    // A 3-digit prefix is already a complete code, so it is reported on
    // the way to the 6-digit one.
    await userEvent.clear(input);
    await userEvent.type(input, "ff0000");
    await expect(args.handleChange).toHaveBeenCalledWith("#ff0");
    await expect(args.handleChange).toHaveBeenLastCalledWith("#FF0000");
    await expect(input).toHaveValue("#FF0000");
    await expect(swatchOf(field).style.getPropertyValue("--block-color")).toBe(
      "#FF0000",
    );

    // The swatch opens the picker; its cross closes it.
    await userEvent.click(swatchOf(field));
    await waitFor(() => expect(pickerShown()).toBe(true));
    const picker = shownPicker() as HTMLElement;
    await expect(picker).toHaveAttribute("role", "dialog");

    // A move in the picker reports a colour and repaints the field.
    const hue = within(picker).getByRole("slider", { name: "Hue" });
    const calls = (args.handleChange as ReturnType<typeof fn>).mock.calls;
    const before = calls.length;
    await userEvent.click(hue);
    await expect(calls.length).toBeGreaterThan(before);
    const picked = calls[calls.length - 1][0] as string;
    await expect(picked).not.toBe("#FF0000");
    await expect(input).toHaveValue(picked.toUpperCase());

    await userEvent.click(
      within(shownPicker() as HTMLElement).getByLabelText("Close color picker"),
    );
    await waitFor(() => expect(pickerShown()).toBe(false));
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
          handleChange={fn()}
        />
      ))}
    </Wrapper>
  );
};

export const Sizes: Story = {
  render: () => <SizesTemplate />,
  play: async ({ canvas }) => {
    const widths = canvas
      .getAllByRole("textbox")
      .map((input) => input.getBoundingClientRect().width);
    const heights = canvas
      .getAllByRole("textbox")
      .map((input) => input.getBoundingClientRect().height);
    await expect(widths).toHaveLength(Object.values(InputSize).length);
    // Each size is wider than the one before it; the height never changes.
    for (let i = 1; i < widths.length; i += 1) {
      await expect(widths[i]).toBeGreaterThan(widths[i - 1]);
      await expect(heights[i]).toBe(heights[0]);
    }
  },
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
        handleChange={statesChange}
      />
      <ColorInput
        defaultColor={globalColors.lightBlueMain}
        hasError
        handleChange={statesChange}
      />
      <ColorInput
        defaultColor={globalColors.lightBlueMain}
        hasWarning
        handleChange={statesChange}
      />
      <ColorInput
        defaultColor={globalColors.lightBlueMain}
        isDisabled
        handleChange={statesChange}
      />
    </Wrapper>
  );
};

export const States: Story = {
  render: () => <StatesTemplate />,
  play: async ({ canvas, userEvent }) => {
    const [normal, error, warning, disabled] =
      canvas.getAllByTestId("color-input");
    const input = (field: HTMLElement) => within(field).getByRole("textbox");
    await expect(input(normal)).not.toHaveAttribute("data-error");
    await expect(input(error)).toHaveAttribute("data-error", "true");
    await expect(input(warning)).toHaveAttribute("data-warning", "true");

    // The disabled field takes no typing and its swatch no clicks.
    await expect(input(disabled)).toBeDisabled();
    await expect(getComputedStyle(swatchOf(disabled)).pointerEvents).toBe(
      "none",
    );
    await expect(pickerShown()).toBe(false);

    // The error state is only a border: the field still opens the picker.
    await userEvent.click(swatchOf(error));
    await waitFor(() => expect(pickerShown()).toBe(true));
    await userEvent.click(
      within(shownPicker() as HTMLElement).getByLabelText("Close color picker"),
    );
    await waitFor(() => expect(pickerShown()).toBe(false));
  },
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
        handleChange={fn()}
      />
    </div>
  );
};

export const ScaledInput: Story = {
  render: () => <ScaledTemplate />,
  play: async ({ canvas }) => {
    const field = canvas.getByTestId("color-input");
    const input = within(field).getByRole("textbox");
    await expect(input).toHaveAttribute("data-scale", "true");
    // The swatch stays at the end of the stretched field.
    const swatch = swatchOf(field).getBoundingClientRect();
    const box = input.getBoundingClientRect();
    await expect(box.width).toBeGreaterThan(400);
    await expect(swatch.right).toBeGreaterThan(box.right - 40);
  },
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
      <ColorInput defaultColor="#0082c9" handleChange={fn()} />
    </div>
  );
};

export const CssCustomization: Story = {
  render: () => <CssCustomizationTemplate />,
  play: async ({ canvas }) => {
    const field = canvas.getByTestId("color-input");
    const swatch = getComputedStyle(swatchOf(field));
    await expect(swatch.width).toBe("24px");
    await expect(swatch.borderTopLeftRadius).toBe("6px");
    const input = getComputedStyle(within(field).getByRole("textbox"));
    await expect(input.height).toBe("36px");
    await expect(input.borderTopColor).toBe("rgb(0, 130, 201)");
  },
  parameters: {
    docs: {
      description: {
        story: `Every overridable variable but \`--dropdown-bg\` set on one field -- the variables are listed under CSS variables on this page. Hover and focus it to see the border colors, and click its swatch to open the popup.`,
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
