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

import type { CSSProperties, ComponentProps } from "react";
import { useEffect, useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { RadioButton } from ".";

import type { RadioButtonProps } from "./RadioButton.types";

const meta = {
  title: "UI/Form controls/RadioButton",
  component: RadioButton,
  parameters: {
    docs: {
      description: {
        component: `RadioButton is a form control that allows users to select a single option from a set.

### Features

- **Checked/Unchecked States**: Visual indication of selection
- **Disabled State**: Prevents user interaction
- **Custom Label**: Text or ReactNode label with configurable font size and weight
- **Keyboard Accessibility**: Supports focus and keyboard interaction
- **Orientation**: Horizontal and vertical layout options
- **Custom Spacing**: Configurable margin between radio buttons

### Accessibility

The RadioButton component uses a native \`<input type="radio">\` element for screen reader support and keyboard navigation.

### Usage

\`\`\`tsx
import { RadioButton } from "@docspace/ui-kit/components/radio-button";

// Basic radio button
<RadioButton name="group" value="option1" label="Option 1" />

// Checked radio button
<RadioButton name="group" value="option2" label="Option 2" isChecked />

// Disabled radio button
<RadioButton name="group" value="option3" label="Option 3" isDisabled />
\`\`\``,
      },
    },
    design: {
      type: "figma",
      url: "https://www.figma.com/file/ZiW5KSwb4t7Tj6Nz5TducC/UI-Kit-DocSpace-1.0.0?type=design&node-id=556-3247&mode=design&t=TBNCKMQKQMxr44IZ-0",
    },
  },
  argTypes: {
    isChecked: {
      control: "boolean",
      description: "Controls the checked state of the radio button",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isDisabled: {
      control: "boolean",
      description: "Disables the radio button when set to true",
    },
    label: {
      control: "text",
      description: "Text label displayed next to the radio button",
    },
    name: {
      control: "text",
      description: "Name attribute for the radio button input",
    },
    value: {
      control: "text",
      description: "Value attribute for the radio button input",
    },
    fontSize: {
      control: "text",
      description: "Font size of the label text",
      table: {
        defaultValue: { summary: "13px" },
      },
    },
    fontWeight: {
      control: "number",
      description: "Font weight of the label text",
      table: {
        defaultValue: { summary: "400" },
      },
    },
    spacing: {
      control: "text",
      description: "Margin between radio buttons",
      table: {
        defaultValue: { summary: "15px" },
      },
    },
  },
} satisfies Meta<typeof RadioButton>;

type Story = StoryObj<ComponentProps<typeof RadioButton>>;

export default meta;

const Wrapper = (props: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gridGap: "16px",
        alignItems: "center",
      }}
    >
      {props.children}
    </div>
  );
};

const Template = ({ isChecked, ...args }: RadioButtonProps) => {
  const [checked, setIsChecked] = useState(isChecked);

  useEffect(() => {
    setIsChecked(isChecked);
  }, [isChecked]);

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setIsChecked(target.checked);
  };

  return (
    <RadioButton {...args} isChecked={checked} onChange={onChangeHandler} />
  );
};

export const Default: Story = {
  render: (args) => <Template {...args} />,
  args: {
    value: "value",
    name: "name",
    label: "Default radio button",
    fontSize: "13px",
    fontWeight: 400,
    isDisabled: false,
    isChecked: false,
  },
};

const StatesTemplate = () => {
  return (
    <Wrapper>
      <RadioButton
        name="states"
        value="unchecked"
        label="Unchecked"
        isChecked={false}
      />
      <RadioButton
        name="states-checked"
        value="checked"
        label="Checked"
        isChecked
      />
    </Wrapper>
  );
};

export const CheckedStates: Story = {
  render: () => <StatesTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Comparison of checked and unchecked radio button states.",
      },
      source: {
        code: `<RadioButton name="group" value="unchecked" label="Unchecked" />
<RadioButton name="group" value="checked" label="Checked" isChecked />`,
      },
    },
  },
};

const DisabledTemplate = () => {
  return (
    <Wrapper>
      <RadioButton
        name="disabled"
        value="disabled"
        label="Disabled unchecked"
        isDisabled
      />
      <RadioButton
        name="disabled-checked"
        value="disabled-checked"
        label="Disabled checked"
        isDisabled
        isChecked
      />
    </Wrapper>
  );
};

export const DisabledStates: Story = {
  render: () => <DisabledTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Disabled radio buttons cannot be interacted with and have reduced opacity.",
      },
      source: {
        code: `<RadioButton name="group" value="1" label="Disabled unchecked" isDisabled />
<RadioButton name="group" value="2" label="Disabled checked" isDisabled isChecked />`,
      },
    },
  },
};

const CustomStylingTemplate = () => {
  return (
    <Wrapper>
      <RadioButton
        name="custom"
        value="custom"
        label="Custom styled"
        fontSize="16px"
        fontWeight={600}
      />
      <RadioButton
        name="custom-small"
        value="small"
        label="Small text"
        fontSize="11px"
        fontWeight={300}
      />
    </Wrapper>
  );
};

export const CssCustomization: Story = {
  render: () => (
    <div
      style={
        {
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          "--radio-button-dot-color": "#7c3aed",
          "--radio-button-circle-color": "#7c3aed",
          "--radio-button-circle-hover-color": "#6d28d9",
          "--radio-button-gap": "16px",
        } as CSSProperties
      }
    >
      <RadioButton name="custom" value="1" label="Custom option 1" isChecked />
      <RadioButton name="custom" value="2" label="Custom option 2" />
      <RadioButton name="custom" value="3" label="Custom option 3" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `CSS Custom Properties for external customization:

| Variable | Description | Default |
|----------|-------------|---------|
| \`--radio-button-dot-color\` | Fill color of the selected dot | theme token |
| \`--radio-button-circle-color\` | Stroke color of the radio circle | theme token |
| \`--radio-button-circle-hover-color\` | Circle stroke color on hover | theme token |
| \`--radio-button-background\` | Background fill of the radio circle | theme token |
| \`--radio-button-label-color\` | Label text color | theme token |
| \`--radio-button-gap\` | Gap between icon and label | \`8px\` |`,
      },
    },
  },
};

export const CustomStyling: Story = {
  render: () => <CustomStylingTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Radio buttons support custom font size and weight for label styling.",
      },
      source: {
        code: `<RadioButton name="group" value="1" label="Custom styled" fontSize="16px" fontWeight={600} />
<RadioButton name="group" value="2" label="Small text" fontSize="11px" fontWeight={300} />`,
      },
    },
  },
};
