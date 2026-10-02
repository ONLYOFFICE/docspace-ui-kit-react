import type { CSSProperties, ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { HelpButton } from "../help-button";
import { RootTooltip } from "../tooltip";

import { Checkbox } from ".";

const meta = {
  title: "UI/Form controls/Checkbox",
  component: Checkbox,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
  },
  argTypes: {
    isChecked: {
      control: "boolean",
      description:
        "The state the box starts in, and the one it returns to whenever this prop changes; a click flips it regardless of the parent",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isIndeterminate: {
      control: "boolean",
      description:
        "Draws a filled square instead of a tick and marks the input as mixed, for a parent whose children are partly selected",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isDisabled: {
      control: "boolean",
      description:
        "Disables the input, greys out the box and the label, and ignores clicks",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    hasError: {
      control: "boolean",
      description:
        "Draws the box border and the label in the error colour; it renders no message",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    label: {
      control: "text",
      description: "Text label displayed next to the checkbox",
    },
    title: {
      control: "text",
      description:
        "Text of the shared tooltip that opens when the pointer rests on the control; it needs `RootTooltip` mounted",
    },
    truncate: {
      control: "boolean",
      description:
        "Holds the label on one line and ends it with an ellipsis when the parent is narrower than the text",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    tabIndex: {
      control: "number",
      description:
        "Tab order of the box icon, which is the element that takes focus; -1 takes the checkbox out of the tab order",
      table: {
        defaultValue: { summary: "0" },
      },
    },
    helpButton: {
      control: false,
      description:
        "Node rendered after the label, usually a `HelpButton`; clicking it does not toggle the checkbox",
    },
    onChange: {
      action: "onChange",
      description:
        "Called with the input's change event when the box is clicked; the new state is `event.target.checked`",
    },
    name: {
      control: "text",
      description: "Name of the underlying checkbox input",
    },
    value: {
      control: "text",
      description:
        "Value of the underlying checkbox input, sent with the form under `name`",
    },
    id: {
      control: "text",
      description: "Id of the `<label>` that wraps the whole control",
    },
    className: {
      control: "text",
      description:
        "Class name added to the `<label>` that wraps the whole control",
    },
    style: {
      control: "object",
      description: "Inline style of the `<label>` that wraps the whole control",
    },
    dataTestId: {
      control: "text",
      description: "Value of `data-testid` on the `<label>`",
      table: {
        defaultValue: { summary: "checkbox" },
      },
    },
  },
} satisfies Meta<typeof Checkbox>;

type Story = StoryObj<ComponentProps<typeof Checkbox>>;

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

export const Default: Story = {
  render: (args) => <Checkbox {...args} />,
  args: {
    label: "Checkbox",
  },
  parameters: {
    docs: {
      description: {
        story:
          "A single checkbox with a label, the starting point for any form choice; click it to tick it, and change any other prop live in the Controls panel below.",
      },
      source: {
        code: `<Checkbox label="Checkbox" onChange={handleChange} />`,
      },
    },
  },
};

const CheckedTemplate = () => {
  return (
    <Wrapper>
      <Checkbox isChecked label="Checked" />
      <Checkbox label="Unchecked" />
    </Wrapper>
  );
};

export const CheckedStates: Story = {
  render: () => <CheckedTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "The two states a user switches between: **Checked** starts ticked (`isChecked`) and **Unchecked** starts empty; clicking either flips it.",
      },
      source: {
        code: `<Checkbox isChecked label="Checked" />
<Checkbox label="Unchecked" />`,
      },
    },
  },
};

const IndeterminateTemplate = () => {
  return (
    <Wrapper>
      <Checkbox isIndeterminate label="Indeterminate" />
      <Checkbox isIndeterminate isDisabled label="Disabled Indeterminate" />
    </Wrapper>
  );
};

export const IndeterminateStates: Story = {
  render: () => <IndeterminateTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "For a select-all whose children are only partly selected: **Indeterminate** shows a filled square instead of a tick (`isIndeterminate`), and **Disabled Indeterminate** is the same square greyed out (`isDisabled`).",
      },
      source: {
        code: `<Checkbox isIndeterminate label="Indeterminate" />
<Checkbox isIndeterminate isDisabled label="Disabled Indeterminate" />`,
      },
    },
  },
};

const DisabledTemplate = () => {
  return (
    <Wrapper>
      <Checkbox isDisabled label="Disabled Unchecked" />
      <Checkbox isDisabled isChecked label="Disabled Checked" />
      <Checkbox isDisabled isIndeterminate label="Disabled Indeterminate" />
    </Wrapper>
  );
};

export const DisabledStates: Story = {
  render: () => <DisabledTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "For a choice the user cannot change right now: each state keeps its mark but the box and the label turn grey and clicks are ignored (`isDisabled`).",
      },
      source: {
        code: `<Checkbox isDisabled label="Disabled Unchecked" />
<Checkbox isDisabled isChecked label="Disabled Checked" />
<Checkbox isDisabled isIndeterminate label="Disabled Indeterminate" />`,
      },
    },
  },
};

const ErrorTemplate = () => {
  return (
    <Wrapper>
      <Checkbox hasError label="Unchecked with Error" />
      <Checkbox hasError isChecked label="Checked with Error" />
    </Wrapper>
  );
};

export const ErrorStates: Story = {
  render: () => <ErrorTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "For a required choice the form rejected: the box border and the label turn the error colour, checked or not (`hasError`); the message itself comes from a wrapping `FieldContainer`.",
      },
      source: {
        code: `<Checkbox hasError label="Unchecked with Error" />
<Checkbox hasError isChecked label="Checked with Error" />`,
      },
    },
  },
};

const TruncatedTemplate = () => {
  return (
    <div style={{ width: "200px" }}>
      <Checkbox
        truncate
        label="This is a very long label that might need to be truncated if the container is too small"
      />
    </div>
  );
};

export const WithTruncation: Story = {
  render: () => <TruncatedTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "For a label longer than the space it gets: in a 200px container the text stays on one line and ends with an ellipsis (`truncate`) instead of wrapping.",
      },
      source: {
        code: `<Checkbox truncate label="This is a very long label that might need to be truncated" />`,
      },
    },
  },
};

export const WithTitle: Story = {
  render: (args) => (
    <>
      <Checkbox {...args} />
      <RootTooltip />
    </>
  ),
  args: {
    label: "Hover me",
    title: "This is a tooltip that appears on hover",
  },
  parameters: {
    docs: {
      description: {
        story:
          "For a short explanation the label has no room for: rest the pointer on the checkbox to open the tooltip (`title`). The tooltip is the kit's shared one, so the app must mount `RootTooltip` once, as this story does.",
      },
      source: {
        code: `<Checkbox label="Hover me" title="This is a tooltip that appears on hover" />
<RootTooltip />`,
      },
    },
  },
};

const HelpButtonTemplate = () => {
  return (
    <>
      <Checkbox
        label="Remember me"
        helpButton={
          <HelpButton tooltipContent="Keeps you signed in on this device" />
        }
      />
      <RootTooltip />
    </>
  );
};

export const WithHelpButton: Story = {
  render: () => <HelpButtonTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "For a choice that needs more explanation than its label: an info icon follows the label (`helpButton`); click it to read the hint, and the checkbox stays as it was. A `HelpButton` with a text hint uses the shared tooltip, so `RootTooltip` is mounted here too.",
      },
      source: {
        code: `<Checkbox
  label="Remember me"
  helpButton={<HelpButton tooltipContent="Keeps you signed in on this device" />}
/>
<RootTooltip />`,
      },
    },
  },
};

export const CssCustomization: Story = {
  render: () => (
    <div
      style={
        {
          "--checkbox-gap": "20px",
          "--checkbox-lh": "20px",
          "--checkbox-fill-color": "#E3EEFB",
          "--checkbox-border-color": "#2D6ECF",
          "--checkbox-arrow-color": "#2D6ECF",
        } as CSSProperties
      }
    >
      <Checkbox label="Increased spacing" isChecked />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `The variables are listed under CSS variables on this page. The example is one checked box on a wrapper that sets every overridable one, so it shows them all at once: the wider gap, the taller row, the light fill, the blue border and the blue tick.`,
      },
      source: {
        code: `<div
  style={{
    "--checkbox-gap": "20px",
    "--checkbox-lh": "20px",
    "--checkbox-fill-color": "#E3EEFB",
    "--checkbox-border-color": "#2D6ECF",
    "--checkbox-arrow-color": "#2D6ECF",
  }}
>
  <Checkbox label="Increased spacing" isChecked />
</div>`,
      },
    },
  },
};
