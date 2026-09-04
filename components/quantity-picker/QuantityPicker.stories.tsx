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

- **Bounded stepping**: increments and decrements by \`step\`, clamped to \`minValue\` and \`maxValue\`
- **Direct entry**: the value can be typed; out-of-range input surfaces an error state
- **Optional slider**: \`showSlider\` adds a slider bound to the same value
- **Presets**: \`items\` renders selectable tabs for common amounts
- **Zero handling**: \`isZeroAllowed\` and \`enableZero\` govern whether zero is a valid value below \`minValue\`

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
      description: "Prefixes the value with a plus sign",
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
