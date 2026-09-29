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

- **Dual Layout**: Places the label beside the control or stacks it above
- **Error Handling**: Built-in error message display with customizable color and width
- **Required Indicator**: Optional asterisk for required fields
- **Label Configuration**: Adjustable label width and visibility
- **Tooltip Support**: Integrated help button with configurable tooltip placement
- **Inline Help**: Option to render the help button inline within the label
- **Responsive Layout**: Switches the side-by-side layout to stacked on tablet-width screens and below
- **Label Association**: Ties the caption to the control by \`id\`, so clicking the caption focuses the control

### Accessibility

The caption is a native \`<label>\`, so the field's name reaches assistive technology only when the consumer pairs it with the control:

- **Label**: \`labelFor\` is the \`id\` of the control the label belongs to. Give the control the same \`id\` and the caption becomes clickable and is announced with the field; without the pair the label captions nothing
- **Required**: With \`isRequired\` the label carries \`aria-required="true"\` and the asterisk is hidden from screen readers

### Usage

\`\`\`tsx
import { FieldContainer } from "@onlyoffice/apps-ui-kit/components/field-container";

// Horizontal layout with tooltip
<FieldContainer
  labelText="Name:"
  labelVisible
  labelFor="name"
  tooltipContent="Enter your full name"
  place="top"
>
  <TextInput id="name" type={InputType.text} value={value} onChange={handleChange} />
</FieldContainer>

// Vertical layout with error
<FieldContainer
  isVertical
  labelText="Email:"
  labelVisible
  labelFor="email"
  hasError
  errorMessage="Invalid email"
>
  <TextInput id="email" type={InputType.email} value={value} hasError onChange={handleChange} />
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
        "When true, shows `errorMessage` under the field. The child control is not restyled; give it its own error flag",
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
      description:
        "When true, the help button is rendered inside the label element, after its text, instead of as a separate element next to the label",
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
        "Content of the tooltip that opens when the help icon is clicked. Without it no help icon is rendered",
    },
    maxLabelWidth: {
      control: "text",
      description:
        "Width of the label column in the side-by-side layout: the label takes exactly this width, so the controls of stacked fields line up. Has no effect in the vertical layout",
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
        "Colour of the error message text. The theme's error colour when not given",
    },
    place: {
      control: "select",
      options: ["top", "right", "bottom", "left"],
      description: "Position of the tooltip relative to the help icon",
      table: {
        defaultValue: { summary: "bottom" },
      },
    },
    className: {
      control: "text",
      description: "Additional CSS class names to apply to the container",
    },
    style: {
      control: "object",
      description: "Custom inline styles to apply to the container",
    },
    labelFor: {
      control: "text",
      description:
        "`id` of the control this labels, which becomes the label's `for`. Give the control the same `id` and clicking the caption focuses it",
    },
    id: {
      control: "text",
      description: "HTML `id` of the container",
    },
    tooltipClass: {
      control: "text",
      description: "Additional CSS class names for the help button",
    },
    tooltipMaxWidth: {
      control: "text",
      description:
        "Maximum width of the tooltip. Currently has no effect: the label it is passed to does not read it",
    },
    dataTestId: {
      control: "text",
      description:
        "`data-testid` of the container. The help button, when there is one, gets `<dataTestId>_help_button`",
      table: {
        defaultValue: { summary: "field-container" },
      },
    },
    children: {
      control: false,
      description:
        "The form control the container lays out, rendered in the field body above the error message",
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
        id={rest.labelFor}
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
    labelFor: "field-name",
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
        story:
          "The label sits in a fixed-width column beside the control, with a help icon that opens a tooltip on click. Click the caption to focus the input (`labelFor`); change any other prop live in the Controls panel below.",
      },
      source: {
        code: `<FieldContainer
  labelText="Name:"
  labelVisible
  labelFor="name"
  maxLabelWidth="110px"
  tooltipContent="Enter your full name"
  place="top"
>
  <TextInput id="name" value={value} onChange={handleChange} />
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
    labelFor: "field-email",
    tooltipContent: "Enter a valid email address",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Marks a field the form cannot be sent without: an asterisk follows the caption, and the label is announced as required (`isRequired`).",
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
    labelFor: "field-username",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Tells the user what to correct right under the field: the message appears only while `hasError` is set, in `errorColor`, wrapped at `errorMessageWidth`. The red border belongs to the input, which gets its own `hasError`.",
      },
      source: {
        code: `<FieldContainer
  labelText="Username:"
  labelVisible
  hasError
  errorMessage="This field is required"
  errorColor="#F24724"
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
    labelFor: "field-description",
    tooltipContent: "Provide a brief description",
  },
  parameters: {
    docs: {
      description: {
        story:
          "For narrow forms and long captions: the label stacks above the control, and both span the full width of the container (`isVertical`). The label column width does not apply here.",
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
    labelText: "Profile URL:",
    labelFor: "field-profile-url",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Makes the help icon part of the caption: it is rendered inside the label, after its text, so it follows the caption's own layout instead of standing as a separate element beside it (`inlineHelpButton`).",
      },
      source: {
        code: `<FieldContainer
  labelText="Profile URL:"
  labelVisible
  inlineHelpButton
  tooltipContent="This is an inline help message"
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
    labelFor: "field-custom",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Sets the container apart from the page, here with a background, padding and rounded corners, through `style` and `className`.",
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
| \`--error-color\` | Error message text color when \`errorColor\` is not given | theme-based |

\`--label-width\` and \`--error-width\` are written inline on the component from \`maxLabelWidth\` and \`errorMessageWidth\`, so a wrapper value never arrives; set those props instead.

- **Full Name** — the error message shows the custom colour and top padding
- **Email** — the gap between the two fields is the custom container margin`,
      },
    },
  },
};
