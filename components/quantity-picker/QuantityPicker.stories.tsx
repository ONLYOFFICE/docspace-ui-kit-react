import type { ComponentProps } from "react";
import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Tooltip } from "../tooltip";

import QuantityPicker from ".";

const meta = {
  title: "UI/Form controls/QuantityPicker",
  component: QuantityPicker,
  parameters: {
    docs: {
      description: {
        component: `Numeric quantity input with minus and plus controls around a typed number, an optional slider and optional quick-add tabs, for choosing a countable amount between a lower and an upper bound.

### Features

- **Bounded Stepping**: Steps the value by \`step\` with the minus and plus controls and stops at \`minValue\` and \`maxValue\`, or at the single \`maxValue+\` overflow state with \`showPlusSign\`; the presets, typing and the slider stop at the same cap
- **Direct Entry**: Accepts a typed whole number, drops any other character, jumps to the maximum when the number is above it, and raises a number below \`minValue\` to it when the field is left or Enter is pressed
- **Optional Slider**: Adds a slider under the controls that moves the same value, with the minimum and the maximum written at its ends
- **Quick-Add Presets**: Renders tabs under the controls that each add their amount to the current value rather than set it
- **Zero Handling**: Accepts zero as a value below \`minValue\` with \`enableZero\` (deprecated alias \`isZeroAllowed\`): the minus control steps down to zero and a typed number under the minimum is kept as it is
- **Note Under the Controls**: Shows a line of text or any node under the number, such as the total the value adds up to
- **Disabled State**: Disables every control and turns the number into static text, optionally replaced by a label such as "Unlimited"
- **Minus-Only Lock**: Disables just the minus control while leaving it focusable, so a tooltip attached to it can still say why

### Accessibility

The minus and plus controls are native buttons and the number is a text field, so the keyboard support comes from the platform.

- **Tab order**: Tab reaches the minus control, the number field and the plus control in that order; the component gives the field \`tabIndex={0}\` against the text input's own default of -1
- **Buttons**: Enter and Space press the minus and plus controls
- **Enter in the field**: Commits a typed number at once instead of waiting for the field to lose focus
- **Names**: The controls hold only an icon marked \`aria-hidden\`; \`decreaseLabel\` and \`increaseLabel\` become their \`aria-label\`, and the number field needs a name from the host's own markup
- **Disabled**: \`isDisabled\` sets \`disabled\` on both controls and removes the field; \`minusDisabled\` sets \`aria-disabled\` on the minus control only, so it stays focusable and its tooltip can still be read

### Usage

\`\`\`tsx
import QuantityPicker from "@onlyoffice/apps-ui-kit/components/quantity-picker";

const [value, setValue] = useState(5);

<QuantityPicker
  title="Copies"
  value={value}
  minValue={1}
  maxValue={100}
  step={1}
  decreaseLabel="Decrease"
  increaseLabel="Increase"
  onChange={setValue}
/>
\`\`\`

With a slider, an overflow step and quick-add presets:

\`\`\`tsx
<QuantityPicker
  value={value}
  minValue={1}
  maxValue={250}
  step={1}
  showSlider
  showPlusSign
  items={[10, 50, { name: "100", value: 100 }]}
  underControlsTitle={\`\${value} copies\`}
  onChange={setValue}
/>
\`\`\`

A read-only amount:

\`\`\`tsx
<QuantityPicker
  value={0}
  minValue={0}
  maxValue={100}
  step={1}
  isDisabled
  disableValue="Unlimited"
  onChange={() => {}}
/>
\`\`\``,
      },
    },
  },
  argTypes: {
    value: {
      control: "number",
      description:
        "Current value; the component is controlled, so the host updates it from `onChange`",
    },
    minValue: {
      control: "number",
      description:
        "Lowest value the minus control, the typed number and the slider can reach",
    },
    maxValue: {
      control: "number",
      description:
        "Highest value the controls, the typed number, the presets and the slider can reach, apart from the one overflow step `showPlusSign` allows",
    },
    step: {
      control: "number",
      description:
        "Amount the minus and plus controls and the slider move by; the last step up is shortened so it stops at the maximum",
    },
    title: {
      control: "text",
      description:
        "Heading above the controls; left empty, no heading is shown",
    },
    subtitle: {
      control: "text",
      description:
        "Smaller line under the heading; left empty, no line is shown",
    },
    showPlusSign: {
      control: "boolean",
      description:
        "Lets the value go exactly one past `maxValue`, shown as the maximum followed by a plus sign",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isDisabled: {
      control: "boolean",
      description:
        "Disables both controls, the slider and the presets, and shows the number as static text that cannot be typed into",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    showSlider: {
      control: "boolean",
      description:
        "Shows a slider under the controls that moves the same value, with the minimum and the maximum written at its ends",
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
        "Preset tabs under the controls, each a number or a `{ name, value }` pair; a tab reads as its amount after a plus sign and adds that amount to the current value",
    },
    isLarge: {
      control: "boolean",
      description:
        "Widens the number field from 101px to 140px, for longer numbers",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withoutControls: {
      control: "boolean",
      description:
        "Hides the minus and plus controls, leaving the number alone",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    disableValue: {
      control: "text",
      description:
        "Text shown in place of the number while `isDisabled` is set; the field then shrinks or grows to fit it",
    },
    underControlsTitle: {
      control: "text",
      description:
        "Text or any node shown under the number; the line keeps its height even when empty",
    },
    isZeroAllowed: {
      control: "boolean",
      description:
        "Deprecated: former name of `enableZero`, still honoured when `enableZero` is not set",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    enableZero: {
      control: "boolean",
      description:
        "Accepts zero as a value below `minValue`: the minus control steps down to zero and a typed number under the minimum is kept",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    minusTooltipId: {
      control: "text",
      description:
        "Id of a tooltip the host renders, attached to the minus control so hovering it opens that tooltip",
    },
    minusDisabled: {
      control: "boolean",
      description:
        "Disables only the minus control; it stays focusable so a tooltip attached to it can still explain why",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    decreaseLabel: {
      control: "text",
      description:
        'Accessible name of the minus control, such as a translated "Decrease"; left out, the control has no name',
    },
    increaseLabel: {
      control: "text",
      description:
        'Accessible name of the plus control, such as a translated "Increase"; left out, the control has no name',
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
  },
  parameters: {
    docs: {
      description: {
        story:
          "The basic picker: press minus or plus, or type a number between the bounds. Change any other prop live in the Controls panel below.",
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
  render: (args) => <QuantityPickerWithState {...args} />,
  args: {
    ...Default.args,
    value: 40,
    showSlider: true,
    title: "Storage",
    subtitle: "GB of additional storage",
  },
  parameters: {
    docs: {
      description: {
        story:
          "A slider under the controls, for covering a wide range quickly: dragging it and pressing the controls move the same number (`showSlider`).",
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
  parameters: {
    docs: {
      description: {
        story:
          "Quick-add tabs for the amounts people pick most: **+10**, **+50** and **+100** each add their amount to the number shown, and stop at the maximum (`items`).",
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
  parameters: {
    docs: {
      description: {
        story:
          "An amount the reader may see but not change: **Unlimited** stands in place of the number as static text that cannot be typed into, and the controls cannot be pressed (`isDisabled`, `disableValue`).",
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
  render: (args) => <QuantityPickerWithState {...args} />,
  args: {
    ...Default.args,
    value: 101,
    showSlider: true,
    showPlusSign: true,
    title: "Copies",
    subtitle: "More than 100 counts as one choice",
  },
  parameters: {
    docs: {
      description: {
        story:
          "For a range whose top is open-ended: the number reads **100+**, one step past the maximum, and the slider's far end carries the same label; press minus to come back to 100 (`showPlusSign`).",
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
  parameters: {
    docs: {
      description: {
        story:
          "For an amount that is either none or at least a minimum: pressing minus at 5 drops straight to 0, and plus from 0 jumps back to 5 (`enableZero`). The line under the number is free text (`underControlsTitle`).",
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
  render: (args) => <MinusLockedTemplate {...args} />,
  args: {
    ...Default.args,
    title: "Copies",
    subtitle: "You can add copies but not remove them",
    minusDisabled: true,
    minusTooltipId: "quantity-picker-minus-tooltip",
  },
  parameters: {
    docs: {
      description: {
        story:
          "When the amount may only grow: pressing minus changes nothing, but the control stays reachable with Tab, and hovering it opens a tooltip that says why (`minusDisabled`, `minusTooltipId`). The tooltip is the host's own.",
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
  render: (args) => <QuantityPickerWithState {...args} />,
  args: {
    ...Default.args,
    value: 40,
    withoutControls: true,
    showSlider: true,
    title: "Copies",
    subtitle: "Drag the slider or type a number",
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
  render: (args) => (
    <div dir="rtl">
      <QuantityPickerWithState {...args} />
    </div>
  ),
  globals: { direction: "rtl" },
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
          'The picker in a right-to-left layout: plus moves to the left of the number and minus to the right, the slider fills from the right, and the minimum sits at its right end. The wrapper carries `dir="rtl"`; the direction also comes from the theme\'s `interfaceDirection` (the Direction toolbar).',
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
