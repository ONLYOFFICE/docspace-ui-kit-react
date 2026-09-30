import type React from "react";
import type { CSSProperties, ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";

import { RadioButtonGroup } from ".";

const meta = {
  title: "UI/Form controls/RadioButtonGroup",
  component: RadioButtonGroup,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
    design: {
      type: "figma",
      url: "https://www.figma.com/file/ZiW5KSwb4t7Tj6Nz5TducC/UI-Kit-DocSpace-1.0.0?type=design&node-id=556-3247&mode=design&t=TBNCKMQKQMxr44IZ-0",
    },
  },
  args: {
    onClick: fn(),
  },
  argTypes: {
    options: {
      control: "object",
      description:
        'The options, in order: each has a `value` and an optional `label`, `disabled`, `autoFocus`, `id` and `dataTestId`; an entry with `type: "text"` is a caption, not a button',
    },
    selected: {
      control: "text",
      description:
        "Value of the chosen option, compared as a string; the group starts from it and moves to it again whenever it changes",
    },
    onClick: {
      description:
        "Called when the choice changes, with the input's change event; the new value is `event.target.value`, always a string",
    },
    name: {
      control: "text",
      description:
        "The `name` shared by every input of the group; without one the arrow keys move focus between the inputs but do not change the choice",
    },
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
      description:
        "Which way the options run: side by side in a row, or stacked in a column only as wide as its longest label",
      table: {
        defaultValue: { summary: "horizontal" },
      },
    },
    isDisabled: {
      control: "boolean",
      description:
        "Disables every button in the group; a single option is disabled through its own `disabled` field",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    width: {
      control: "text",
      description: "Width of the group, as a CSS length",
    },
    fontSize: {
      control: "text",
      description: "Font size of every option's label",
    },
    fontWeight: {
      control: "text",
      description: "Font weight of every option's label",
    },
    spacing: {
      control: "text",
      description:
        "Gap between neighbouring buttons, as a CSS length: before each button after the first in a row, below each button but the last in a column; without it the buttons touch",
    },
    id: {
      control: "text",
      description: "Applied to the group's outer element",
    },
    className: {
      control: "text",
      description: "Applied to the group's outer element",
    },
    style: {
      control: "object",
      description: "Applied to the group's outer element",
    },
    dataTestId: {
      control: "text",
      description: "`data-testid` of the group's outer element",
      table: {
        defaultValue: { summary: "radio-button-group" },
      },
    },
  },
} satisfies Meta<typeof RadioButtonGroup>;

type Story = StoryObj<ComponentProps<typeof RadioButtonGroup>>;

export default meta;

const Wrapper = (props: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gridGap: "24px",
        alignItems: "start",
      }}
    >
      {props.children}
    </div>
  );
};

const baseOptions = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
];

export const Default: Story = {
  args: {
    name: "default",
    options: baseOptions,
    orientation: "horizontal",
    selected: "option1",
    spacing: "15px",
  },
  play: async ({ args, canvas, userEvent }) => {
    const option1 = canvas.getByRole("radio", { name: "Option 1" });
    const option2 = canvas.getByRole("radio", { name: "Option 2" });
    const option3 = canvas.getByRole("radio", { name: "Option 3" });
    await expect(option1).toBeChecked();

    await userEvent.click(canvas.getByText("Option 2"));
    await expect(option2).toBeChecked();
    await expect(option1).not.toBeChecked();
    await expect(args.onClick).toHaveBeenLastCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({ value: "option2" }),
      }),
    );

    // One name, one set: the arrow keys move the choice along the row.
    await userEvent.keyboard("{ArrowRight}");
    await expect(option3).toBeChecked();
    await expect(args.onClick).toHaveBeenCalledTimes(2);
  },
  parameters: {
    docs: {
      description: {
        story:
          "The group as most forms use it: a row of options with one chosen. Click another option to move the choice and watch the Actions panel for the value `onClick` receives; change any other prop live in the Controls panel below.",
      },
      source: {
        code: `<RadioButtonGroup
  name="default"
  options={options}
  selected="option1"
  orientation="horizontal"
  spacing="15px"
  onClick={handleClick}
/>`,
      },
    },
  },
};

export const VerticalLayout: Story = {
  args: {
    name: "vertical",
    options: baseOptions,
    selected: "option1",
    orientation: "vertical",
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.tab();
    await expect(canvas.getByRole("radio", { name: "Option 1" })).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}");
    await expect(canvas.getByRole("radio", { name: "Option 2" })).toBeChecked();
  },
  parameters: {
    docs: {
      description: {
        story:
          "The options stacked in a column only as wide as its longest label (`orientation`). Suits longer lists and labels too long to sit side by side; without `spacing` the buttons sit directly under one another.",
      },
      source: {
        code: `<RadioButtonGroup
  name="vertical"
  options={options}
  selected="option1"
  orientation="vertical"
  onClick={handleClick}
/>`,
      },
    },
  },
};

const DisabledTemplate = (args: ComponentProps<typeof RadioButtonGroup>) => {
  return (
    <Wrapper>
      <RadioButtonGroup
        name="disabled-group"
        options={baseOptions}
        selected="option1"
        isDisabled
        onClick={args.onClick}
      />
      <RadioButtonGroup
        name="disabled-option"
        options={[
          ...baseOptions,
          { value: "option4", label: "Disabled Option", disabled: true },
        ]}
        selected="option1"
        onClick={args.onClick}
      />
    </Wrapper>
  );
};

export const DisabledStates: Story = {
  render: (args) => <DisabledTemplate {...args} />,
  play: async ({ canvas }) => {
    const radios = canvas.getAllByRole("radio");
    const wholeGroup = radios.slice(0, 3);
    const oneOption = radios.slice(3);

    for (const radio of wholeGroup) {
      await expect(radio).toBeDisabled();
    }
    for (const radio of oneOption.slice(0, 3)) {
      await expect(radio).toBeEnabled();
    }
    await expect(
      canvas.getByRole("radio", { name: "Disabled Option" }),
    ).toBeDisabled();
  },
  parameters: {
    docs: {
      description: {
        story: `Shows the two ways to take options out of play:

- **Left** — the whole group greyed out and unclickable at once (\`isDisabled\`), for a setting that does not apply right now
- **Right** — only "Disabled Option" is greyed out (\`disabled\` on the option), while the other three stay selectable`,
      },
      source: {
        code: `// All disabled
<RadioButtonGroup name="size" options={options} selected="option1" isDisabled onClick={handleClick} />

// Individual option disabled
<RadioButtonGroup
  name="size"
  options={[...options, { value: "option4", label: "Disabled Option", disabled: true }]}
  selected="option1"
  onClick={handleClick}
/>`,
      },
    },
  },
};

export const WithTextLabel: Story = {
  args: {
    name: "with-text",
    options: [
      { type: "text", label: "Please select an option:", value: "" },
      ...baseOptions,
    ],
    selected: "option1",
    orientation: "vertical",
  },
  play: async ({ canvas }) => {
    // The caption is text in the group, not a fourth button.
    await expect(canvas.getByText("Please select an option:")).toBeVisible();
    await expect(canvas.getAllByRole("radio")).toHaveLength(3);
  },
  parameters: {
    docs: {
      description: {
        story:
          '"Please select an option:" is a caption placed inside the group, not a button (an option with `type: "text"`). Use it for a heading or an instruction above the options, or between two runs of them.',
      },
      source: {
        code: `<RadioButtonGroup
  name="with-text"
  options={[
    { type: "text", label: "Please select an option:", value: "" },
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ]}
  selected="option1"
  orientation="vertical"
  onClick={handleClick}
/>`,
      },
    },
  },
};

export const CustomStyling: Story = {
  args: {
    name: "custom-styling",
    options: baseOptions,
    selected: "option1",
    fontSize: "16px",
    fontWeight: "600",
    spacing: "20px",
    width: "300px",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Larger, bolder labels (`fontSize`, `fontWeight`), 20px between the buttons (`spacing`) and a group 300px wide (`width`), to match the group to the text and layout around it.",
      },
      source: {
        code: `<RadioButtonGroup
  name="custom-styling"
  options={options}
  selected="option1"
  fontSize="16px"
  fontWeight="600"
  spacing="20px"
  width="300px"
  onClick={handleClick}
/>`,
      },
    },
  },
};

export const CssCustomization: Story = {
  render: (args) => (
    <div
      style={
        {
          "--radio-button-group-subtext-top": "24px",
          "--radio-button-group-subtext-bottom": "12px",
        } as CSSProperties
      }
    >
      <RadioButtonGroup
        name="css-customization"
        options={[
          { type: "text", label: "Choose an option:", value: "" },
          { value: "option1", label: "Option 1" },
          { value: "option2", label: "Option 2" },
          { value: "option3", label: "Option 3" },
        ]}
        selected="option1"
        orientation="vertical"
        onClick={args.onClick}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `Both caption spacings set on a wrapper around a vertical group that opens with the caption "Choose an option:" -- the variables are listed under CSS variables on this page.`,
      },
      source: {
        code: `<div style={{
  "--radio-button-group-subtext-top": "24px",
  "--radio-button-group-subtext-bottom": "12px",
}}>
  <RadioButtonGroup
    name="css-customization"
    options={[
      { type: "text", label: "Choose an option:", value: "" },
      ...options,
    ]}
    selected="option1"
    orientation="vertical"
    onClick={handleClick}
  />
</div>`,
      },
    },
  },
};
