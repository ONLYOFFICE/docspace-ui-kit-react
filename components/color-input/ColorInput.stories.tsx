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
        "Colour the field starts on, as a hex string; the kit's blue when left out. It is read once, on mount: a starting point, not a controlled value.",
      table: {
        defaultValue: { summary: "#4781D1" },
      },
    },
    size: {
      control: "select",
      options: Object.values(InputSize),
      description:
        "Width, font size and padding of the field; the height does not change.",
      table: {
        defaultValue: { summary: "undefined" },
      },
    },
    scale: {
      control: "boolean",
      description: "Whether the field stretches to fill its container.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isDisabled: {
      control: "boolean",
      description:
        "Whether the field is disabled. The swatch stops opening the picker too.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    hasError: {
      control: "boolean",
      description: "Whether the field is drawn in its error colours.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    hasWarning: {
      control: "boolean",
      description: "Whether the field is drawn in its warning colours.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    handleChange: {
      action: "handleChange",
      description:
        "Called with the new hex colour each time the field holds a complete 3- or 6-digit code, and on every move inside the picker. There is no confirm step and no `onApply`.",
    },
    className: {
      control: "text",
      description: "Applied to the outermost element.",
    },
    id: {
      control: "text",
      description: "Applied to the outermost element.",
    },
    dataTestId: {
      control: "text",
      description: "`data-testid` of the outermost element.",
      table: {
        defaultValue: { summary: "color-input" },
      },
    },
  },
} satisfies Meta<typeof ColorInput>;

type Story = StoryObj<ComponentProps<typeof ColorInput>>;

export default meta;

const statesChange = fn();

// The swatch is a button named after the picker it opens.
const swatchOf = (field: HTMLElement) =>
  within(field).getByRole("button", { name: "Color picker" });

// Whether a hex colour is fully saturated and fully bright: one channel at
// 255 and one at 0.
const isPure = (hex: string) => {
  const channels = [1, 3, 5].map((i) =>
    Number.parseInt(hex.slice(i, i + 2), 16),
  );
  return Math.max(...channels) === 255 && Math.min(...channels) === 0;
};

// The picker stays mounted while the drop-down is closed, so "open" means
// the picker is actually on screen.
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
    <div
      style={{
        height: "410px",
        overflow: "hidden",
        transform: "translateZ(0)",
      }}
    >
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
    const input = within(field).getByRole("textbox", { name: "Color" });
    await expect(input).toHaveValue("#4781D1");

    // A 3-digit prefix is already a complete code, so it is reported on
    // the way to the 6-digit one.
    await userEvent.clear(input);
    await userEvent.type(input, "00FF00");
    await expect(args.handleChange).toHaveBeenCalledWith("#00F");
    await expect(args.handleChange).toHaveBeenLastCalledWith("#00FF00");
    await expect(input).toHaveValue("#00FF00");
    await expect(swatchOf(field).style.getPropertyValue("--block-color")).toBe(
      "#00FF00",
    );

    // The swatch is a button: Enter opens the picker.
    const swatch = swatchOf(field);
    await expect(swatch).toHaveAttribute("aria-expanded", "false");
    swatch.focus();
    await userEvent.keyboard("{Enter}");
    await waitFor(() => expect(pickerShown()).toBe(true));
    await expect(swatch).toHaveAttribute("aria-expanded", "true");
    const picker = shownPicker() as HTMLElement;
    await expect(picker).toHaveAttribute("role", "group");

    // The picker opens on the typed green, not on the colour the field
    // started with.
    const hue = within(picker).getByRole("slider", { name: "Hue" });
    await expect(hue).toHaveAttribute("aria-valuenow", "120");
    await expect(
      within(picker).getByRole("slider", { name: "Color" }),
    ).toHaveAttribute("aria-valuetext", "Saturation 100%, Brightness 100%");

    // A move in the picker reports a colour and repaints the field; it keeps
    // the green's full saturation and brightness.
    const calls = (args.handleChange as ReturnType<typeof fn>).mock.calls;
    const before = calls.length;
    await userEvent.click(hue);
    await expect(calls.length).toBeGreaterThan(before);
    const picked = calls[calls.length - 1][0] as string;
    await expect(picked.toUpperCase()).not.toBe("#00FF00");
    await expect(isPure(picked)).toBe(true);
    await expect(input).toHaveValue(picked.toUpperCase());

    // The cross closes it and hands the focus back to the swatch.
    await userEvent.click(
      within(shownPicker() as HTMLElement).getByLabelText("Close color picker"),
    );
    await waitFor(() => expect(pickerShown()).toBe(false));
    await expect(swatch).toHaveFocus();
    await expect(swatch).toHaveAttribute("aria-expanded", "false");
  },
  parameters: {
    docs: {
      description: {
        story:
          "The field on its own, starting on the kit's blue. The swatch opens the picker on the colour the field holds.",
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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "16px",
        minHeight: "420px",
      }}
    >
      {(Object.values(InputSize) as Array<InputSize>).map((size) => (
        <ColorInput
          key={size}
          defaultColor={globalColors.lightBlueMain}
          size={size}
          handleChange={fn()}
        />
      ))}
    </div>
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
          "The three sizes (`size`), which differ in width; **large** also in text size and padding. All three keep the same height.",
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

    await expect(input(error)).toHaveAttribute("aria-invalid", "true");

    // The disabled field takes no typing and its swatch no clicks.
    await expect(input(disabled)).toBeDisabled();
    await expect(swatchOf(disabled)).toBeDisabled();
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
          "The field in each state: normal, a red border (`hasError`), an orange one (`hasWarning`), and greyed out with a swatch that opens nothing (`isDisabled`).",
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
  name: "Full width",
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
          "A field stretched across its container, with the swatch at its end (`scale`), for a column of full-width inputs.",
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
          "--text-input-color": "light-dark(#004f82, #7cc3ea)",
          "--text-input-border-color": "#0082c9",
          "--text-input-border-hover": "light-dark(#005a8c, #4fb0e6)",
          "--text-input-border-focus": "light-dark(#00324d, #a8d8f2)",
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
  name: "CSS customization",
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
        story: `Every overridable variable but \`--dropdown-bg\`, set on one field, including the hover and focus border colours and the popup's.`,
      },
      source: {
        code: `<div
  style={{
    "--color-input-height": "36px",
    "--color-input-padding": "6px 12px",
    "--color-input-swatch-size": "24px",
    "--color-input-swatch-radius": "6px",
    "--text-input-color": "light-dark(#004f82, #7cc3ea)",
    "--text-input-border-color": "#0082c9",
    "--text-input-border-hover": "light-dark(#005a8c, #4fb0e6)",
    "--text-input-border-focus": "light-dark(#00324d, #a8d8f2)",
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
