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

import React, { useState } from "react";
import type { CSSProperties, ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { InputSize, InputType, TextInput } from "../text-input";

import { FieldContainer } from "./FieldContainer";
import type { FieldContainerProps } from "./FieldContainer.types";
import { globalColors } from "../../providers/theme";

const meta = {
  title: "UI/Form controls/FieldContainer",
  component: FieldContainer,
  parameters: {
    docs: {
      description: {
        component: `A responsive form field container component that provides consistent layout and styling for form inputs.

### Features

- **Dual Layout**: Horizontal and vertical alignment options
- **Error Handling**: Built-in error message display with customizable color and width
- **Required Indicator**: Optional asterisk for required fields
- **Label Configuration**: Adjustable label width and visibility
- **Tooltip Support**: Integrated help button with configurable tooltip placement
- **Inline Help**: Option to render the help button inline within the label

### Usage

\`\`\`tsx
import { FieldContainer } from "@docspace/ui-kit/components/field-container";

// Horizontal layout with tooltip
<FieldContainer
  labelText="Name:"
  labelVisible
  tooltipContent="Enter your full name"
  place="top"
>
  <TextInput value={value} onChange={handleChange} />
</FieldContainer>

// Vertical layout with error
<FieldContainer
  isVertical
  labelText="Email:"
  labelVisible
  hasError
  errorMessage="Invalid email"
>
  <TextInput value={value} hasError onChange={handleChange} />
</FieldContainer>
\`\`\``,
      },
    },
  },
  argTypes: {
    isVertical: {
      control: "boolean",
      description:
        "When true, displays label above the input field instead of beside it",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isRequired: {
      control: "boolean",
      description:
        "When true, displays a required field indicator (*) next to the label",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    hasError: {
      control: "boolean",
      description:
        "When true, displays the field in an error state with error styling",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    labelVisible: {
      control: "boolean",
      description: "Controls visibility of the field label",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    removeMargin: {
      control: "boolean",
      description: "When true, removes the default margin around the container",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    inlineHelpButton: {
      control: "boolean",
      description: "When true, displays an inline help button with tooltip",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    labelText: {
      control: "text",
      description: "Text content of the field label",
    },
    tooltipContent: {
      control: "text",
      description:
        "Content to be displayed in the tooltip when hovering over the help icon",
    },
    maxLabelWidth: {
      control: "text",
      description:
        "Maximum width of the label element. Can be any valid CSS width value",
      table: {
        defaultValue: { summary: "110px" },
      },
    },
    errorMessage: {
      control: "text",
      description: "Error message to display when hasError is true",
    },
    errorMessageWidth: {
      control: "text",
      description:
        "Width of the error message container. Can be any valid CSS width value",
      table: {
        defaultValue: { summary: "293px" },
      },
    },
    errorColor: {
      control: "color",
      description:
        "Color used for error messages and indicators. Can be any valid CSS color value.",
    },
    place: {
      control: "select",
      options: ["top", "right", "bottom", "left"],
      description: "Position of the tooltip relative to the help icon",
      table: {
        defaultValue: { summary: "bottom" },
      },
    },
    helpButtonHeaderContent: {
      control: "text",
      description:
        "Custom header content for the help tooltip when using inline help button",
    },
    className: {
      control: "text",
      description: "Additional CSS class names to apply to the container",
    },
    style: {
      control: "object",
      description: "Custom inline styles to apply to the container",
    },
  },
} satisfies Meta<typeof FieldContainer>;

type Story = StoryObj<ComponentProps<typeof FieldContainer>>;

export default meta;

const Template = ({ hasError, ...rest }: FieldContainerProps) => {
  const [value, setValue] = useState("");

  return (
    <FieldContainer hasError={hasError} {...rest}>
      <TextInput
        value={value}
        hasError={hasError}
        className="field-input"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setValue(e.target.value);
        }}
        type={InputType.text}
        size={InputSize.base}
      />
    </FieldContainer>
  );
};

export const Default: Story = {
  render: Template,
  args: {
    labelText: "Name:",
    labelVisible: true,
    maxLabelWidth: "110px",
    tooltipContent: "Enter your full name",
    place: "top",
    errorMessage:
      "Error text. Lorem ipsum dolor sit amet, consectetuer adipiscing elit",
    children: null,
  },
  parameters: {
    docs: {
      description: {
        story: "Default configuration with horizontal layout and tooltip.",
      },
      source: {
        code: `<FieldContainer
  labelText="Name:"
  labelVisible
  maxLabelWidth="110px"
  tooltipContent="Enter your full name"
  place="top"
>
  <TextInput value={value} onChange={handleChange} />
</FieldContainer>`,
      },
    },
  },
};

export const Required: Story = {
  render: Template,
  args: {
    ...Default.args,
    isRequired: true,
    labelText: "Email:",
    tooltipContent: "Enter a valid email address",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Required field with a visual asterisk indicator next to the label.",
      },
      source: {
        code: `<FieldContainer
  labelText="Email:"
  labelVisible
  isRequired
  tooltipContent="Enter a valid email address"
>
  <TextInput value={value} onChange={handleChange} />
</FieldContainer>`,
      },
    },
  },
};

export const WithError: Story = {
  render: Template,
  args: {
    ...Default.args,
    hasError: true,
    errorMessage: "This field is required",
    errorColor: globalColors.lightErrorStatus,
    errorMessageWidth: "293px",
    labelText: "Username:",
  },
  parameters: {
    docs: {
      description: {
        story: "Field in error state with custom error message and color.",
      },
      source: {
        code: `<FieldContainer
  labelText="Username:"
  labelVisible
  hasError
  errorMessage="This field is required"
  errorColor="#F21C0E"
  errorMessageWidth="293px"
>
  <TextInput value={value} hasError onChange={handleChange} />
</FieldContainer>`,
      },
    },
  },
};

export const VerticalLayout: Story = {
  render: Template,
  args: {
    ...Default.args,
    isVertical: true,
    maxLabelWidth: "100%",
    labelText: "Description:",
    tooltipContent: "Provide a brief description",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Vertical layout with label displayed above the input field and full-width label.",
      },
      source: {
        code: `<FieldContainer
  isVertical
  labelText="Description:"
  labelVisible
  maxLabelWidth="100%"
  tooltipContent="Provide a brief description"
>
  <TextInput value={value} onChange={handleChange} />
</FieldContainer>`,
      },
    },
  },
};

export const WithInlineHelp: Story = {
  render: Template,
  args: {
    ...Default.args,
    inlineHelpButton: true,
    tooltipContent: "This is an inline help message",
    helpButtonHeaderContent: "Help Information",
    labelText: "Profile URL:",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Field with an inline help button rendered within the label instead of as a separate element.",
      },
      source: {
        code: `<FieldContainer
  labelText="Profile URL:"
  labelVisible
  inlineHelpButton
  tooltipContent="This is an inline help message"
  helpButtonHeaderContent="Help Information"
>
  <TextInput value={value} onChange={handleChange} />
</FieldContainer>`,
      },
    },
  },
};

export const CustomStyling: Story = {
  render: Template,
  args: {
    ...Default.args,
    className: "custom-field",
    style: {
      backgroundColor: "#f5f5f5",
      padding: "16px",
      borderRadius: "4px",
    },
    labelText: "Custom Field:",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Field container with custom background, padding, and border-radius applied via inline styles.",
      },
      source: {
        code: `<FieldContainer
  labelText="Custom Field:"
  labelVisible
  className="custom-field"
  style={{ backgroundColor: "#f5f5f5", padding: "16px", borderRadius: "4px" }}
>
  <TextInput value={value} onChange={handleChange} />
</FieldContainer>`,
      },
    },
  },
};

const CssCustomizationTemplate = () => {
  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("");

  return (
    <div
      style={
        {
          width: "500px",
          "--field-container-margin": "0 0 32px 0",
          "--field-container-error-top": "8px",
          "--error-color": "#7c3aed",
          "--error-width": "400px",
        } as CSSProperties
      }
    >
      <FieldContainer
        labelText="Full Name:"
        labelVisible
        maxLabelWidth="140px"
        hasError
        errorMessage="Name must be at least 3 characters"
        tooltipContent="Enter your full name"
        place="top"
      >
        <TextInput
          value={value1}
          hasError
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setValue1(e.target.value)
          }
          type={InputType.text}
          size={InputSize.base}
        />
      </FieldContainer>
      <FieldContainer
        labelText="Email:"
        labelVisible
        maxLabelWidth="140px"
        hasError={false}
        tooltipContent="Enter your email address"
        place="top"
      >
        <TextInput
          value={value2}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setValue2(e.target.value)
          }
          type={InputType.text}
          size={InputSize.base}
        />
      </FieldContainer>
    </div>
  );
};

export const CssCustomization: Story = {
  render: () => <CssCustomizationTemplate />,
  parameters: {
    docs: {
      description: {
        story: `CSS Custom Properties for external customization:

| Variable | Description | Default |
|----------|-------------|---------|
| \`--field-container-margin\` | Container margin | \`0 0 16px 0\` |
| \`--field-container-error-top\` | Error message top padding | \`4px\` |
| \`--error-color\` | Error message text color | theme token |
| \`--error-width\` | Error message max width | \`293px\` |
| \`--label-width\` | Label min/max width in horizontal mode | component prop |`,
      },
    },
  },
};
