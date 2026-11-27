import type { ComponentProps } from "react";
import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fireEvent, fn } from "storybook/test";

import { Tooltip } from "../tooltip";

import QuantityPicker from ".";

const meta = {
  title: "UI/Form controls/QuantityPicker",
  component: QuantityPicker,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
  },
  argTypes: {
    value: {
      control: "number",
      description:
        "The number shown. The component is controlled: pass back what `onChange` reports",
    },
    minValue: {
      control: "number",
      description: "Lower bound for the controls, typed input and slider",
    },
    maxValue: {
      control: "number",
      description:
        "Upper bound; nothing the component does goes past it, except the one overflow step `showPlusSign` allows",
    },
    step: {
      control: "number",
      description:
        "Amount the plus and minus controls and the slider move by; the last step up is shortened so it stops at the bound",
    },
    title: {
      control: "text",
      description: "Heading above the controls; omitted when empty",
    },
    subtitle: {
      control: "text",
      description: "Secondary line under the title; omitted when empty",
    },
    showPlusSign: {
      control: "boolean",
      description:
        "Lets the value go exactly one past `maxValue` (to `maxValue + 1`), shown as `maxValue+`",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isDisabled: {
      control: "boolean",
      description:
        "Disables every control and replaces the input with static text",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    showSlider: {
      control: "boolean",
      description:
        "Renders a slider bound to the value, from `minValue` to `maxValue` (`maxValue + 1` with `showPlusSign`)",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    onChange: {
      action: "onChange",
      description: "Called with the new value",
    },
    className: {
      control: "text",
      description: "Class name on the root element",
    },
    items: {
      control: "object",
      description:
        "Preset tabs; selecting one adds its amount to the current value, capped like the plus control",
    },
    isLarge: {
      control: "boolean",
      description: "Widens the value field from 101px to 140px",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withoutControls: {
      control: "boolean",
      description: "Hides the plus and minus controls",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    disableValue: {
      control: "text",
      description:
        "Text shown in place of the value while `isDisabled` is set; the field then sizes to its content",
    },
    underControlsTitle: {
      control: "text",
      description:
        "Text under the controls; turns to the warning colour while an invalid value is entered with `enableZero`",
    },
    isZeroAllowed: {
      control: "boolean",
      description:
        "Former name of `enableZero`, kept as an alias; `enableZero` wins when both are set.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    enableZero: {
      control: "boolean",
      description:
        "Allows zero as a value below `minValue`; other values below it are flagged",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    minusTooltipId: {
      control: "text",
      description:
        "Id of a `Tooltip` you render, anchored to the minus control through `data-tooltip-id`",
    },
    minusDisabled: {
      control: "boolean",
      description:
        "Disables only the minus control; it stays focusable (`aria-disabled`) so `minusTooltipId` can still explain why",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    decreaseLabel: {
      control: "text",
      description:
        'Accessible name of the minus control, e.g. a translated "Decrease"; no `aria-label` is rendered without it',
    },
    increaseLabel: {
      control: "text",
      description:
        'Accessible name of the plus control, e.g. a translated "Increase"; no `aria-label` is rendered without it',
    },
  },
} satisfies Meta<typeof QuantityPicker>;

type Story = StoryObj<ComponentProps<typeof QuantityPicker>>;

export default meta;

type QuantityPickerProps = ComponentProps<typeof QuantityPicker>;

const QuantityPickerWithState = (props: QuantityPickerProps) => {
  const { value: initialValue, onChange } = props;
  const [value, setValue] = useState<number>(initialValue);

  useEffect(() => setValue(initialValue), [initialValue]);

  const handleChange = (newValue: number) => {
    setValue(newValue);
    onChange?.(newValue);
  };

  return <QuantityPicker {...props} value={value} onChange={handleChange} />;
};

type Canvas = {
  getByTestId: (id: string) => HTMLElement;
  getByRole: (role: string, options: { name: string }) => HTMLElement;
};

// The number shown in the field, and the two controls by their names.
const field = (canvas: Canvas) => canvas.getByTestId("quantity_picker_input");
const minus = (canvas: Canvas) =>
  canvas.getByRole("button", { name: "Decrease" });
const plus = (canvas: Canvas) =>
  canvas.getByRole("button", { name: "Increase" });

export const Default: Story = {
  render: (args) => <QuantityPickerWithState {...args} />,
  args: {
    value: 5,
    minValue: 1,
    maxValue: 100,
    step: 1,
    title: "Managers",
    subtitle: "Choose how many managers to add",
    decreaseLabel: "Decrease",
    increaseLabel: "Increase",
    onChange: fn(),
  },
  play: async ({ args, canvas, userEvent }) => {
    await expect(field(canvas)).toHaveValue("5");

    await userEvent.click(plus(canvas));
    await expect(field(canvas)).toHaveValue("6");
    await expect(args.onChange).toHaveBeenLastCalledWith(6);

    await userEvent.click(minus(canvas));
    await userEvent.click(minus(canvas));
    await expect(field(canvas)).toHaveValue("4");

    // A typed number past the maximum is held at the maximum.
    await userEvent.clear(field(canvas));
    await userEvent.type(field(canvas), "150{Enter}");
    await expect(field(canvas)).toHaveValue("100");
    await expect(args.onChange).toHaveBeenLastCalledWith(100);
  },
  parameters: {
    docs: {
      description: {
        story:
          "The basic picker: minus, the number, plus. The number changes by the buttons or by typing a value between the bounds.",
      },
      source: {
        code: `const [value, setValue] = useState(5);

<QuantityPicker
  title="Managers"
  subtitle="Choose how many managers to add"
  value={value}
  minValue={1}
  maxValue={100}
  step={1}
  decreaseLabel="Decrease"
  increaseLabel="Increase"
  onChange={setValue}
/>`,
      },
    },
  },
};

export const WithSlider: Story = {
  name: "With slider",
  render: (args) => <QuantityPickerWithState {...args} />,
  args: {
    ...Default.args,
    value: 40,
    showSlider: true,
    title: "Storage",
    subtitle: "GB of additional storage",
  },
  play: async ({ args, canvas, userEvent }) => {
    // The slider and the field stay in step both ways.
    const slider = canvas.getByRole("slider");
    await expect(slider).toHaveValue("40");
    fireEvent.change(slider, { target: { value: "70" } });
    await expect(field(canvas)).toHaveValue("70");
    await expect(args.onChange).toHaveBeenLastCalledWith(70);
    await userEvent.click(plus(canvas));
    await expect(slider).toHaveValue("71");
  },
  parameters: {
    docs: {
      description: {
        story:
          "A slider under the controls, for covering a wide range quickly (`showSlider`). The slider and the controls move the same number.",
      },
      source: {
        code: `<QuantityPicker
  title="Storage"
  subtitle="GB of additional storage"
  value={value}
  minValue={1}
  maxValue={100}
  step={1}
  showSlider
  onChange={setValue}
/>`,
      },
    },
  },
};

export const WithPresets: Story = {
  name: "Quick-add tabs",
  render: (args) => <QuantityPickerWithState {...args} />,
  args: {
    ...Default.args,
    value: 10,
    items: [
      { name: "10", value: 10 },
      { name: "50", value: 50 },
      { name: "100", value: 100 },
    ],
    title: "Copies",
    subtitle: "Pick a preset or enter a number",
  },
  play: async ({ canvas, userEvent }) => {
    // A preset adds its amount to the current value.
    await userEvent.click(canvas.getByText("+50"));
    await expect(field(canvas)).toHaveValue("60");
  },
  parameters: {
    docs: {
      description: {
        story:
          "Quick-add tabs **+10**, **+50** and **+100** for the amounts people pick most (`items`). Each adds its amount to the number shown, stopping at the maximum.",
      },
      source: {
        code: `<QuantityPicker
  title="Copies"
  subtitle="Pick a preset or enter a number"
  value={value}
  minValue={1}
  maxValue={100}
  step={1}
  items={[
    { name: "10", value: 10 },
    { name: "50", value: 50 },
    { name: "100", value: 100 },
  ]}
  onChange={setValue}
/>`,
      },
    },
  },
};

export const Disabled: Story = {
  render: (args) => <QuantityPickerWithState {...args} />,
  args: {
    ...Default.args,
    isDisabled: true,
    disableValue: "Unlimited",
    title: "Managers",
    subtitle: "This amount cannot be changed",
  },
  play: async ({ canvas }) => {
    // Static text in place of the field, and both controls disabled.
    await expect(canvas.getByText("Unlimited")).toBeVisible();
    await expect(minus(canvas)).toBeDisabled();
    await expect(plus(canvas)).toBeDisabled();
  },
  parameters: {
    docs: {
      description: {
        story:
          "An amount the reader may see but not change (`isDisabled`, `disableValue`). **Unlimited** stands in place of the number as static text, and the controls cannot be pressed.",
      },
      source: {
        code: `<QuantityPicker
  title="Managers"
  subtitle="This amount cannot be changed"
  value={5}
  minValue={1}
  maxValue={100}
  step={1}
  isDisabled
  disableValue="Unlimited"
  onChange={() => {}}
/>`,
      },
    },
  },
};

export const WithPlusSign: Story = {
  name: "Open-ended maximum",
  render: (args) => <QuantityPickerWithState {...args} />,
  args: {
    ...Default.args,
    value: 101,
    showSlider: true,
    showPlusSign: true,
    title: "Copies",
    subtitle: "More than 100 counts as one choice",
  },
  play: async ({ canvas, userEvent }) => {
    // One step past the maximum reads as the maximum with a plus sign.
    await expect(field(canvas)).toHaveValue("100+");
    await userEvent.click(minus(canvas));
    await expect(field(canvas)).toHaveValue("100");
  },
  parameters: {
    docs: {
      description: {
        story:
          "A range open at the top (`showPlusSign`). The number reads **100+**, one step past the maximum, and so does the slider's far end. Minus comes back to 100.",
      },
      source: {
        code: `<QuantityPicker
  title="Copies"
  subtitle="More than 100 counts as one choice"
  value={value}
  minValue={1}
  maxValue={100}
  step={1}
  showSlider
  showPlusSign
  onChange={setValue}
/>`,
      },
    },
  },
};

export const WithZeroAllowed: Story = {
  name: "Zero allowed",
  render: (args) => <QuantityPickerWithState {...args} />,
  args: {
    ...Default.args,
    value: 5,
    minValue: 5,
    enableZero: true,
    title: "Copies",
    subtitle: "At least 5, or none at all",
    underControlsTitle: "Press minus to drop to zero",
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(minus(canvas));
    await expect(field(canvas)).toHaveValue("0");
    await userEvent.click(plus(canvas));
    await expect(field(canvas)).toHaveValue("5");
  },
  parameters: {
    docs: {
      description: {
        story:
          "An amount that is either none or at least 5 (`enableZero`). Minus at 5 drops straight to 0, and plus from 0 jumps back to 5. The line under the number is free text (`underControlsTitle`).",
      },
      source: {
        code: `<QuantityPicker
  title="Copies"
  subtitle="At least 5, or none at all"
  value={value}
  minValue={5}
  maxValue={100}
  step={1}
  enableZero
  underControlsTitle="Press minus to drop to zero"
  onChange={setValue}
/>`,
      },
    },
  },
};

const MinusLockedTemplate = (args: QuantityPickerProps) => (
  <>
    <QuantityPickerWithState {...args} />
    <Tooltip id="quantity-picker-minus-tooltip" place="bottom">
      The amount cannot go below the current one
    </Tooltip>
  </>
);

export const MinusLockedWithTooltip: Story = {
  name: "Minus locked, with tooltip",
  render: (args) => <MinusLockedTemplate {...args} />,
  args: {
    ...Default.args,
    title: "Copies",
    subtitle: "You can add copies but not remove them",
    minusDisabled: true,
    minusTooltipId: "quantity-picker-minus-tooltip",
  },
  play: async ({ canvas, userEvent }) => {
    // Locked, yet focusable, so the tooltip can still explain why.
    await expect(minus(canvas)).toHaveAttribute("aria-disabled", "true");
    await expect(minus(canvas)).toBeEnabled();
    await userEvent.tab();
    await expect(minus(canvas)).toHaveFocus();

    await userEvent.click(minus(canvas));
    await expect(field(canvas)).toHaveValue("5");
    await userEvent.click(plus(canvas));
    await expect(field(canvas)).toHaveValue("6");
  },
  parameters: {
    docs: {
      description: {
        story:
          "An amount that may only grow (`minusDisabled`). Minus changes nothing but stays reachable with Tab, and its tooltip says why (`minusTooltipId`). The tooltip is the host's own.",
      },
      source: {
        code: `<QuantityPicker
  title="Copies"
  value={value}
  minValue={1}
  maxValue={100}
  step={1}
  minusDisabled
  minusTooltipId="minus-tooltip"
  onChange={setValue}
/>
<Tooltip id="minus-tooltip" place="bottom">
  The amount cannot go below the current one
</Tooltip>`,
      },
    },
  },
};

export const WithoutControls: Story = {
  name: "Without controls",
  render: (args) => <QuantityPickerWithState {...args} />,
  args: {
    ...Default.args,
    value: 40,
    withoutControls: true,
    showSlider: true,
    title: "Copies",
    subtitle: "Drag the slider or type a number",
  },
  play: async ({ args, canvas, userEvent }) => {
    // No minus or plus; the slider and the field remain.
    await expect(canvas.queryByRole("button", { name: "Decrease" })).toBeNull();
    await expect(canvas.queryByRole("button", { name: "Increase" })).toBeNull();
    await userEvent.clear(field(canvas));
    await userEvent.type(field(canvas), "12{Enter}");
    await expect(canvas.getByRole("slider")).toHaveValue("12");
    await expect(args.onChange).toHaveBeenLastCalledWith(12);
  },
  parameters: {
    docs: {
      description: {
        story:
          "The number alone, without the minus and plus controls, for when a slider or typing is the way to change it (`withoutControls`).",
      },
      source: {
        code: `<QuantityPicker
  title="Copies"
  value={value}
  minValue={1}
  maxValue={100}
  step={1}
  withoutControls
  showSlider
  onChange={setValue}
/>`,
      },
    },
  },
};

export const RightToLeft: Story = {
  name: "Right to left",
  render: (args) => (
    <div dir="rtl">
      <QuantityPickerWithState {...args} />
    </div>
  ),
  globals: { direction: "rtl" },
  play: async ({ canvas }) => {
    // Minus and plus swap sides: plus at the left end.
    await expect(plus(canvas).getBoundingClientRect().left).toBeLessThan(
      minus(canvas).getBoundingClientRect().left,
    );
  },
  args: {
    ...Default.args,
    value: 40,
    showSlider: true,
    title: "عدد النسخ",
    subtitle: "اختر عدد النسخ",
  },
  parameters: {
    noPadding: true,
    docs: {
      // Framed: an inline RTL story would flip the whole Docs page.
      story: { inline: false, height: "200px" },
      description: {
        story:
          "The picker in a right-to-left layout: plus to the left of the number, minus to the right, the slider filling from the right. The direction comes from the wrapper's `dir=\"rtl\"` and the theme's `interfaceDirection`.",
      },
      source: {
        code: `<div dir="rtl">
  <QuantityPicker
    title="عدد النسخ"
    value={value}
    minValue={1}
    maxValue={100}
    step={1}
    showSlider
    onChange={setValue}
  />
</div>`,
      },
    },
  },
};
