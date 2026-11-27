import type { CSSProperties, ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen, waitFor } from "storybook/test";

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
        "The state the checkbox starts in, and is reset to whenever this prop changes. It is **not** a controlled value: a click flips the box whether or not the parent agrees.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isIndeterminate: {
      control: "boolean",
      description:
        "Draws a filled square inside the box in place of the tick, and sets the input's `indeterminate` property. For a parent whose children are partly selected.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isDisabled: {
      control: "boolean",
      description:
        "Disables the input and greys the box and the label; a click does nothing.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    hasError: {
      control: "boolean",
      description:
        "Draws the box and the label in the error colour. It renders no message — pair it with `FieldContainer` for that.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    label: {
      control: "text",
      description:
        "Text beside the box, and the control's accessible name. A long one wraps unless `truncate` is set.",
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
        "Applied to the input, which is the focusable element. Pass `-1` for a checkbox the keyboard should skip.",
      table: {
        defaultValue: { summary: "0" },
      },
    },
    helpButton: {
      control: false,
      description:
        "Node rendered after the label, usually a `HelpButton`. Clicking it does not toggle the checkbox.",
    },
    onChange: {
      action: "onChange",
      description:
        "Called with the input's change event; the new state is `event.target.checked`. The component stops the event's propagation.",
    },
    name: {
      control: "text",
      description:
        "Name of the input, under which a form submits `value` while it is checked.",
    },
    inputId: {
      control: "text",
      description:
        "Id of the underlying checkbox input, for a `<label htmlFor>` caption laid out apart from the box",
    },
    value: {
      control: "text",
      description:
        "Value the form submits under `name` while the box is checked.",
    },
    id: {
      control: "text",
      description: "Applied to the `<label>` that wraps the whole control.",
    },
    className: {
      control: "text",
      description: "Applied to the `<label>` that wraps the whole control.",
    },
    style: {
      control: "object",
      description: "Applied to the `<label>` that wraps the whole control.",
    },
    dataTestId: {
      control: "text",
      description: "Value of `data-testid` on the `<label>`.",
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
    onChange: fn(),
  },
  play: async ({ args, canvas, userEvent }) => {
    const checkbox = canvas.getByRole("checkbox", { name: "Checkbox" });

    // The input takes the focus and keeps it when Space toggles the box.
    await userEvent.tab();
    await expect(checkbox).toHaveFocus();
    await userEvent.keyboard(" ");
    await expect(checkbox).toBeChecked();
    await expect(checkbox).toHaveFocus();

    await userEvent.click(canvas.getByText("Checkbox"));
    await expect(checkbox).not.toBeChecked();
    await userEvent.click(canvas.getByText("Checkbox"));
    await expect(checkbox).toBeChecked();
    await expect(args.onChange).toHaveBeenCalledTimes(3);
  },
  parameters: {
    docs: {
      description: {
        story:
          "A single checkbox with a label, the starting point for any form choice. A click on the box or the label ticks it.",
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
  name: "Checked and unchecked",
  render: () => <CheckedTemplate />,
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("checkbox", { name: "Checked" }),
    ).toBeChecked();
    await expect(
      canvas.getByRole("checkbox", { name: "Unchecked" }),
    ).not.toBeChecked();
  },
  parameters: {
    docs: {
      description: {
        story:
          "Two checkboxes side by side: **Checked** starts ticked through `isChecked`, and **Unchecked** starts empty. A click flips either.",
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
  name: "Indeterminate",
  render: () => <IndeterminateTemplate />,
  play: async ({ canvas }) => {
    // The mixed state is set on the input, so it is announced, not only drawn.
    for (const checkbox of canvas.getAllByRole("checkbox")) {
      await expect(checkbox).toBePartiallyChecked();
    }
  },
  parameters: {
    docs: {
      description: {
        story:
          "A filled square inside the box in place of the tick (`isIndeterminate`), enabled and disabled. It marks a select-all whose items are only partly selected.",
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
  name: "Disabled",
  render: () => <DisabledTemplate />,
  play: async ({ canvas, userEvent }) => {
    for (const checkbox of canvas.getAllByRole("checkbox")) {
      await expect(checkbox).toBeDisabled();
    }

    const unchecked = canvas.getByRole("checkbox", {
      name: "Disabled Unchecked",
    });
    await userEvent.click(canvas.getByText("Disabled Unchecked"));
    await expect(unchecked).not.toBeChecked();

    // A disabled checkbox is no tab stop.
    await userEvent.tab();
    await expect(document.activeElement).toBe(document.body);
  },
  parameters: {
    docs: {
      description: {
        story:
          "Three disabled checkboxes: unchecked, checked and indeterminate (`isDisabled`). Each keeps its mark, the box and the label turn grey, and a click does nothing.",
      },
      source: {
        code: `<Checkbox isDisabled label="Disabled Unchecked" />
<Checkbox isDisabled isChecked label="Disabled Checked" />
<Checkbox isDisabled isIndeterminate label="Disabled Indeterminate" />`,
      },
    },
  },
};

// The box is drawn by an SVG inside the label.
const boxOf = (
  canvas: { getByText: (text: string) => HTMLElement },
  label: string,
) =>
  canvas.getByText(label).closest("label")?.querySelector("svg") as SVGElement;

const style = (element: Element) => getComputedStyle(element);

const ErrorTemplate = () => {
  return (
    <Wrapper>
      <Checkbox hasError label="Unchecked with Error" />
      <Checkbox hasError isChecked label="Checked with Error" />
    </Wrapper>
  );
};

export const ErrorStates: Story = {
  name: "Error",
  render: () => <ErrorTemplate />,
  play: async ({ canvas }) => {
    // The frame turns red, checked or not.
    for (const label of ["Unchecked with Error", "Checked with Error"]) {
      const rect = boxOf(canvas, label).querySelector("rect") as Element;
      await expect(style(rect).stroke).toBe("rgb(242, 71, 36)");
    }
    await expect(
      canvas.getByRole("checkbox", {
        name: "Checked with Error",
        hidden: true,
      }),
    ).toBeChecked();
  },
  parameters: {
    docs: {
      description: {
        story:
          "A red box border and a red label, on an unchecked and a checked box (`hasError`). The message itself comes from a wrapping `FieldContainer`.",
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
  name: "Truncated label",
  render: () => <TruncatedTemplate />,
  play: async ({ canvas }) => {
    // The label is held on one line.
    const text = canvas.getByText(/^This is a very long label/);
    await expect(text).toHaveStyle({ whiteSpace: "nowrap" });
    await expect(text.getClientRects()).toHaveLength(1);
    // ...and cut at the container's edge with an ellipsis, rather than
    // running out of it: the text box is narrower than its content, and the
    // checkbox as a whole does not overflow its 200px parent.
    await expect(getComputedStyle(text).textOverflow).toBe("ellipsis");
    await expect(text.scrollWidth).toBeGreaterThan(text.clientWidth);
    const checkbox = canvas.getByTestId("checkbox");
    await expect(checkbox.scrollWidth).toBeLessThanOrEqual(
      checkbox.clientWidth,
    );
    await expect(text.getBoundingClientRect().right).toBeLessThanOrEqual(
      (checkbox.parentElement as HTMLElement).getBoundingClientRect().right,
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "A long label held on one line and cut with an ellipsis in a 200px container (`truncate`). Without it the label wraps.",
      },
      source: {
        code: `<Checkbox truncate label="This is a very long label that might need to be truncated" />`,
      },
    },
  },
};

export const WithTitle: Story = {
  name: "With tooltip",
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
  play: async ({ canvas, userEvent }) => {
    await userEvent.hover(canvas.getByText("Hover me"));
    await waitFor(() =>
      expect(screen.getByRole("tooltip")).toHaveTextContent(
        "This is a tooltip that appears on hover",
      ),
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "A checkbox whose tooltip opens when the pointer rests on it (`title`). The tooltip is the kit's shared one, so the app mounts `RootTooltip` once, as this story does.",
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
  name: "With help button",
  render: () => <HelpButtonTemplate />,
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByTestId("checkbox-help-button"));
    await expect(
      canvas.getByRole("checkbox", { name: "Remember me" }),
    ).not.toBeChecked();
  },
  parameters: {
    docs: {
      description: {
        story:
          "An info icon after the label, for a choice that needs more than its label (`helpButton`). A click on it opens the hint and leaves the box as it was. The hint is a shared tooltip, so `RootTooltip` is mounted too.",
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

export const ExternalCaption: Story = {
  render: (args) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <Checkbox {...args} inputId="invite-contacts-checkbox" />
      <label htmlFor="invite-contacts-checkbox" style={{ cursor: "pointer" }}>
        Invite via Contacts
      </label>
    </div>
  ),
  args: {
    onChange: fn(),
  },
  play: async ({ args, canvas, userEvent }) => {
    const box = canvas.getByRole("checkbox", { name: "Invite via Contacts" });

    await userEvent.click(canvas.getByText("Invite via Contacts"));
    await expect(box).toBeChecked();
    await expect(args.onChange).toHaveBeenCalledTimes(1);
  },
  parameters: {
    docs: {
      description: {
        story:
          "A caption laid out apart from the box, tied to it with `inputId` and a `<label htmlFor>`: clicking the caption toggles the box, and the caption is the box's accessible name.",
      },
      source: {
        code: `<Checkbox inputId="invite-contacts-checkbox" onChange={handleChange} />
<label htmlFor="invite-contacts-checkbox">Invite via Contacts</label>`,
      },
    },
  },
};

export const CssCustomization: Story = {
  name: "CSS variables",
  play: async ({ canvas }) => {
    const box = boxOf(canvas, "Increased spacing");
    const rect = box.querySelector("rect") as Element;
    await expect(style(rect).fill).toBe("rgb(227, 238, 251)");
    await expect(style(rect).stroke).toBe("rgb(45, 110, 207)");
    await expect(style(box.querySelector("path") as Element).fill).toBe(
      "rgb(45, 110, 207)",
    );
    // --checkbox-gap: the room between the box and the label.
    await expect(
      Math.round(
        canvas.getByText("Increased spacing").getBoundingClientRect().left -
          box.getBoundingClientRect().right,
      ),
    ).toBe(20);
  },
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
        story: `One checked box under a wrapper that sets every overridable variable. It shows the wider gap, the taller row, the light fill, the blue border and the blue tick.`,
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
