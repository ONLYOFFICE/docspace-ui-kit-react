import type { ComponentProps } from "react";
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import QuantityPicker from ".";

const meta = {
  title: "UI/Form controls/QuantityPicker",
  component: QuantityPicker,
  parameters: {
    docs: {
      description: {
        component: `Numeric quantity input with increment and decrement controls, an optional slider, and optional preset tabs. Used for choosing seats, storage and similar countable amounts.

### Features

- **Bounded stepping**: increments and decrements by \`step\`, clamped to \`minValue\` and \`maxValue\` (or the single \`maxValue+\` overflow state with \`showPlusSign\`); plus, presets, typing and the slider share that cap
- **Direct entry**: the value can be typed; out-of-range input surfaces an error state
- **Optional slider**: \`showSlider\` adds a slider bound to the same value
- **Presets**: \`items\` renders selectable tabs for common amounts
- **Zero handling**: \`enableZero\` (deprecated alias \`isZeroAllowed\`) makes zero a valid value below \`minValue\`

### Accessibility

The minus and plus controls are native buttons, reachable with Tab and operated with Enter or Space. They contain only an icon: pass \`decreaseLabel\` and \`increaseLabel\` to name them. \`isDisabled\` disables them; \`minusDisabled\` uses \`aria-disabled\` so the minus control stays focusable for its tooltip.

### Usage

Controlled: pass \`value\` and update it from \`onChange\`. The stories below wrap it in local state.`,
      },
    },
  },
  argTypes: {
    value: { control: "number", description: "Current value" },
    minValue: { control: "number", description: "Lower bound" },
    maxValue: { control: "number", description: "Upper bound" },
    step: {
      control: "number",
      description: "Increment applied by the controls",
    },
    isDisabled: {
      control: "boolean",
      description: "Disables the whole control",
    },
    showSlider: {
      control: "boolean",
      description: "Renders a slider bound to the value",
    },
    showPlusSign: {
      control: "boolean",
      description: "Allows one overflow step past maxValue, shown as maxValue+",
    },
  },
} satisfies Meta<typeof QuantityPicker>;

type Story = StoryObj<ComponentProps<typeof QuantityPicker>>;

export default meta;

type QuantityPickerProps = ComponentProps<typeof QuantityPicker>;

const QuantityPickerWithState = (props: QuantityPickerProps) => {
  const { value: initialValue, onChange } = props;
  const [value, setValue] = useState<number>(initialValue);

  const handleChange = (newValue: number) => {
    setValue(newValue);
    onChange?.(newValue);
  };

  return <QuantityPicker {...props} value={value} onChange={handleChange} />;
};

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
    onChange: () => {},
  },
};

export const WithSlider: Story = {
  render: (args) => <QuantityPickerWithState {...args} />,
  args: {
    ...Default.args,
    value: 40,
    showSlider: true,
    title: "Storage",
    subtitle: "GB of additional storage",
  },
};

export const WithPresets: Story = {
  render: (args) => <QuantityPickerWithState {...args} />,
  args: {
    ...Default.args,
    value: 10,
    items: [
      { name: "10", value: 10 },
      { name: "50", value: 50 },
      { name: "100", value: 100 },
    ],
    title: "Seats",
    subtitle: "Pick a preset or enter a number",
  },
};

export const Disabled: Story = {
  render: (args) => <QuantityPickerWithState {...args} />,
  args: {
    ...Default.args,
    isDisabled: true,
    disableValue: "Unlimited",
    title: "Managers",
    subtitle: "Included in your plan",
  },
};
