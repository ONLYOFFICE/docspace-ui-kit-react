import React, { useState } from "react";
import type { CSSProperties, ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen, waitFor } from "storybook/test";

import { InputSize, InputType, TextInput } from "../text-input";
import { RootTooltip } from "../tooltip";

import { FieldContainer } from "./FieldContainer";
import type { FieldContainerProps } from "./FieldContainer.types";
import { globalColors } from "../../providers/theme";

const meta = {
  title: "UI/Form controls/FieldContainer",
  component: FieldContainer,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
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
    <>
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
      {/* A string tooltipContent opens in the shared tooltip, which renders
          only where RootTooltip is mounted. */}
      <RootTooltip />
    </>
  );
};

export const Default: Story = {
  render: Template,
  play: async ({ canvas, userEvent }) => {
    // labelFor ties the caption to the input: it names it and focuses it.
    const input = canvas.getByLabelText("Name:");
    await userEvent.click(canvas.getByText("Name:"));
    await expect(input).toHaveFocus();

    // The help icon opens its tooltip on click.
    const help = canvas
      .getByTestId("help-button")
      .querySelector("[data-tooltip-id]");
    await userEvent.click(help as HTMLElement);
    await waitFor(() =>
      expect(screen.getByText("Enter your full name")).toBeVisible(),
    );
  },
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
  play: async ({ canvas }) => {
    // The asterisk after the caption, hidden from screen readers; the input
    // itself is what is announced as required.
    await expect(canvas.getByTestId("required-mark")).toHaveTextContent("*");
    const input = canvas.getByLabelText(/Email:/);
    await expect(input).toHaveAttribute("aria-required", "true");
    await expect(canvas.getByTestId("label")).not.toHaveAttribute(
      "aria-required",
    );
  },
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
          "Marks a field the form cannot be sent without: an asterisk follows the caption, and the input gets `aria-required`, so it is announced as required (`isRequired`).",
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
  play: async ({ canvas }) => {
    await expect(canvas.getByText("This field is required")).toBeVisible();
    // The input is the invalid one, and the message describes it.
    const input = canvas.getByLabelText(/Username:/);
    await expect(input).toHaveAttribute("aria-invalid", "true");
    await expect(input).toHaveAccessibleDescription("This field is required");
  },
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
  play: async ({ canvas }) => {
    await expect(canvas.getByTestId("field-container")).toHaveAttribute(
      "data-vertical",
      "true",
    );
  },
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
  play: async ({ canvas }) => {
    // inlineHelpButton puts the help icon inside the label itself.
    const help = canvas.getByTestId("help-button");
    await expect(help.closest("label")).not.toBeNull();
  },
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
  play: async ({ canvasElement, canvas }) => {
    // The class and the inline style reach the container.
    const container = canvasElement.querySelector(
      ".custom-field",
    ) as HTMLElement;
    await expect(container).toHaveStyle({
      backgroundColor: "rgb(245, 245, 245)",
      padding: "16px",
      borderRadius: "4px",
    });
    await expect(container).toContainElement(canvas.getByText("Custom Field:"));
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
  play: async ({ canvas }) => {
    const error = canvas.getByText("Name must be at least 3 characters");
    // --field-container-error-top is the message's top padding.
    await expect(error).toHaveStyle({
      color: "rgb(124, 58, 237)",
      paddingTop: "8px",
    });
    const container = (label: string) =>
      canvas
        .getByText(label)
        .closest("[data-testid='field-container']") as HTMLElement;
    await expect(container("Full Name:")).toHaveStyle({ marginBottom: "32px" });
  },
  parameters: {
    docs: {
      description: {
        story: `Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page.

- **Full Name** — the error message shows the custom colour and top padding
- **Email** — the gap between the two fields is the custom container margin`,
      },
    },
  },
};
