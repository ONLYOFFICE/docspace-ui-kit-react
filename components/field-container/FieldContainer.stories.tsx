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
        "Stacks the label above the control. Off, the label sits beside it, down to tablet width",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isRequired: {
      control: "boolean",
      description:
        "Indicates that the field is required: an asterisk after the caption, and `aria-required` on the control in the field body",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    hasError: {
      control: "boolean",
      description:
        "Indicates that the field has an error state: `aria-invalid` on the control in the field body, and the error message when `errorMessage` is set",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    labelVisible: {
      control: "boolean",
      description:
        "Shows the label block: the caption, the required marker and the help button. Without it `labelText` renders nothing",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    removeMargin: {
      control: "boolean",
      description:
        "Drops the container's own 16px bottom margin, for a parent that spaces the fields itself",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    inlineHelpButton: {
      control: "boolean",
      description:
        "Draws the help button inside the label, after its text, instead of beside it",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    labelText: {
      control: "text",
      description:
        "Caption of the field, as text or an element; shown only with `labelVisible`",
    },
    tooltipContent: {
      control: "text",
      description:
        "Text or element of the help button's tooltip. Without it there is no help button",
    },
    maxLabelWidth: {
      control: "text",
      description:
        "Width of the label column, as a CSS length; only the horizontal arrangement reads it",
      table: {
        defaultValue: { summary: "110px" },
      },
    },
    errorMessage: {
      control: "text",
      description:
        "Message under the control, shown only while `hasError` is set",
    },
    errorMessageWidth: {
      control: "text",
      description:
        "Width of the box the error message wraps inside, as a CSS length",
      table: {
        defaultValue: { summary: "293px" },
      },
    },
    errorColor: {
      control: "color",
      description:
        "CSS colour of the error message, over the theme's error colour",
    },
    place: {
      control: "select",
      options: ["top", "right", "bottom", "left"],
      description: "Side of the help button its tooltip prefers",
      table: {
        defaultValue: { summary: "bottom" },
      },
    },
    className: {
      control: "text",
      description: "Class added to the container",
    },
    style: {
      control: "object",
      description:
        "Inline style of the container, applied to the error message as well",
    },
    labelFor: {
      control: "text",
      description:
        "`id` of the control this labels, which becomes the label's `for`. Give the control that same `id` and the caption becomes clickable and is announced with the field; without it the label captions nothing.",
    },
    id: {
      control: "text",
      description: "Id of the container",
    },
    tooltipClass: {
      control: "text",
      description: "Class added to the help button",
    },
    dataTestId: {
      control: "text",
      description:
        "`data-testid` of the container. The help button, when there is one, gets `<dataTestId>_help_button`.",
      table: {
        defaultValue: { summary: "field-container" },
      },
    },
    children: {
      control: false,
      description: "The control the container labels, with anything around it",
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
          "A label in a fixed-width column beside the control, with a help icon that opens a tooltip on click. The caption focuses the input when clicked (`labelFor`).",
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
          "A field the form cannot be sent without (`isRequired`). An asterisk follows the caption, and the input gets `aria-required`, so it is announced as required.",
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
  name: "With error",
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
  name: "Vertical",
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
  name: "Help inside the label",
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
          "A help icon inside the label, after its text (`inlineHelpButton`). It follows the caption's own layout instead of standing beside it.",
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
  name: "Custom style",
  // The story paints its own light page, so the dark picture for the API
  // site is unreadable; the story stays, its picture does not.
  tags: ["no-picture"],
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
  name: "CSS customization",
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
        story: `Every overridable variable, set on one wrapper.

- **Full Name** — the error message shows the custom colour and top padding
- **Email** — the gap between the two fields is the custom container margin`,
      },
    },
  },
};
