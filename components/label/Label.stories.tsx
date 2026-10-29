import type { CSSProperties, ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen, waitFor } from "storybook/test";

import { RootTooltip } from "../tooltip";

import { Label } from ".";

const meta = {
  title: "UI/Form controls/Label",
  component: Label,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
  },
  argTypes: {
    text: {
      control: "text",
      description: "The label's text",
    },
    title: {
      control: "text",
      description:
        "Text of the kit's shared tooltip that opens when the pointer rests on the label; it needs `RootTooltip` mounted",
    },
    htmlFor: {
      control: "text",
      description:
        "The `id` of the field this labels, so clicking the label focuses that field",
    },
    isRequired: {
      control: "boolean",
      description:
        "Appends a red asterisk, hidden from screen readers, to the text; the field itself needs `required`",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    error: {
      control: "boolean",
      description:
        "Turns the text red; the field itself needs `aria-invalid`, and the error message is not part of this component",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    truncate: {
      control: "boolean",
      description:
        "Cuts text that does not fit on one line with an ellipsis; the label is inline by default, so it needs `display: block` and a width to cut against",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isInline: {
      control: "boolean",
      description:
        "Makes the label an inline block, so it keeps its own width and padding on the line beside the field; without it the label is a plain inline element",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    display: {
      control: false,
      description:
        "Written onto the label as an HTML `display` attribute and does not change how it is laid out; set `display` through `style` instead",
    },
    children: {
      control: "text",
      description:
        "Content rendered after the text and the asterisk, inside the same label",
    },
    className: {
      control: false,
      description: "Class name added to the label",
    },
    id: {
      control: "text",
      description: "The label's own `id`",
    },
    style: {
      control: false,
      description: "Inline styles applied to the label",
    },
    tooltipMaxWidth: {
      control: false,
      description: "Ignored: nothing reads this prop",
    },
  },
} satisfies Meta<typeof Label>;

type Story = StoryObj<ComponentProps<typeof Label>>;

export default meta;

const Wrapper = (props: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      {props.children}
    </div>
  );
};

export const Default: Story = {
  render: (args) => (
    <>
      <Label {...args} />
      <RootTooltip />
    </>
  ),
  args: {
    text: "First name",
    title: "Enter your first name",
    htmlFor: "firstName",
  },
  play: async ({ canvas, userEvent }) => {
    const label = canvas.getByTestId("label");
    await expect(label.tagName).toBe("LABEL");
    await expect(label).toHaveAttribute("for", "firstName");
    // title opens in the shared tooltip.
    await userEvent.hover(label);
    await waitFor(() =>
      expect(screen.getByText("Enter your first name")).toBeVisible(),
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "The plain caption for a field, in semibold text; rest the pointer on it to read the tooltip (`title`), and change any other prop live in the Controls panel below.",
      },
      source: {
        code: `<Label text="First name" htmlFor="firstName" title="Enter your first name" />
<RootTooltip />`,
      },
    },
  },
};

const RequiredTemplate = () => {
  return (
    <Wrapper>
      <Label text="Email address" htmlFor="email" isRequired />
      <Label text="Password" htmlFor="password" isRequired />
      <Label text="Username" htmlFor="username" isRequired />
    </Wrapper>
  );
};

const ErrorTemplate = () => {
  return (
    <Wrapper>
      <Label text="Password" htmlFor="password" error />
      <Label text="Email" htmlFor="email" isRequired error />
    </Wrapper>
  );
};

const TruncatedTemplate = () => {
  return (
    <div style={{ width: 150, border: "1px solid #ccc", padding: 8 }}>
      <Label
        text="This is a very long label that will be truncated"
        title="This is a very long label that will be truncated"
        truncate
        style={{ display: "block" }}
      />
      <RootTooltip />
    </div>
  );
};

const InlineTemplate = () => {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <Label text="Username" htmlFor="username" isInline />
      <input type="text" id="username" style={{ padding: 4 }} />
    </div>
  );
};

const WithChildrenTemplate = () => {
  return (
    <Label text="Phone number" htmlFor="phone">
      <span style={{ marginInlineStart: 8, color: "#666" }}>(optional)</span>
    </Label>
  );
};

const FormExampleTemplate = () => {
  return (
    <form
      style={{ display: "flex", flexDirection: "column", gap: 16 }}
      onSubmit={(e) => e.preventDefault()}
    >
      <div>
        <Label text="Username" htmlFor="form-username" isRequired />
        <input
          type="text"
          id="form-username"
          style={{ display: "block", marginTop: 4, padding: 8 }}
        />
      </div>
      <div>
        <Label text="Email" htmlFor="form-email" isRequired error />
        <input
          type="email"
          id="form-email"
          style={{
            display: "block",
            marginTop: 4,
            padding: 8,
            borderColor: "red",
          }}
        />
      </div>
      <div>
        <Label text="Bio" htmlFor="form-bio">
          <span style={{ color: "#666", fontWeight: 400 }}>(optional)</span>
        </Label>
        <textarea
          id="form-bio"
          style={{ display: "block", marginTop: 4, padding: 8 }}
        />
      </div>
    </form>
  );
};

export const RequiredLabels: Story = {
  render: () => <RequiredTemplate />,
  play: async ({ canvas }) => {
    // Each caption ends with an asterisk hidden from screen readers.
    const marks = canvas.getAllByTestId("required-mark");
    await expect(marks).toHaveLength(3);
    await expect(marks[0]).toHaveTextContent("*");
    await expect(marks[0]).toHaveAttribute("aria-hidden", "true");
    // ARIA allows neither state on a <label>; the label states none.
    for (const label of canvas.getAllByTestId("label")) {
      await expect(label).not.toHaveAttribute("aria-required");
      await expect(label).not.toHaveAttribute("aria-invalid");
    }
  },
  parameters: {
    docs: {
      description: {
        story:
          "For fields a form cannot be sent without: each caption ends with a red asterisk (`isRequired`). The asterisk is hidden from screen readers, so the input needs `required` as well.",
      },
      source: {
        code: `<Label text="Email address" htmlFor="email" isRequired />
<Label text="Password" htmlFor="password" isRequired />
<Label text="Username" htmlFor="username" isRequired />`,
      },
    },
  },
};

export const ErrorState: Story = {
  render: () => <ErrorTemplate />,
  play: async ({ canvas }) => {
    // error turns the caption the error colour, with or without the mark.
    const [password, email] = canvas.getAllByTestId("label");
    await expect(getComputedStyle(password).color).toBe(
      getComputedStyle(email).color,
    );
    await expect(password).toHaveAttribute("data-error", "true");
    await expect(
      email.querySelector("[data-testid='required-mark']"),
    ).not.toBeNull();
  },
  parameters: {
    docs: {
      description: {
        story:
          "For a field that failed validation: the caption turns red (`error`), with or without the asterisk. The error message is not part of the label; render it next to the field.",
      },
      source: {
        code: `<Label text="Password" htmlFor="password" error />
<Label text="Email" htmlFor="email" isRequired error />`,
      },
    },
  },
};

export const TruncatedLabel: Story = {
  render: () => <TruncatedTemplate />,
  play: async ({ canvas }) => {
    // One line, cut with an ellipsis inside the 150px box.
    const label = canvas.getByTestId("label");
    await expect(getComputedStyle(label).textOverflow).toBe("ellipsis");
    await expect(label.scrollWidth).toBeGreaterThan(label.clientWidth);
  },
  parameters: {
    docs: {
      description: {
        story:
          "For a caption longer than the space it gets: in a 150px box the text stays on one line and ends with an ellipsis (`truncate`, with `display: block` so the label takes the box's width). Rest the pointer on it to read the full text in the tooltip (`title`), which needs `RootTooltip` mounted, as this story does.",
      },
      source: {
        code: `<div style={{ width: 150 }}>
  <Label
    text="This is a very long label that will be truncated"
    title="This is a very long label that will be truncated"
    truncate
    style={{ display: "block" }}
  />
</div>
<RootTooltip />`,
      },
    },
  },
};

export const InlineLabel: Story = {
  render: () => <InlineTemplate />,
  play: async ({ canvas, userEvent }) => {
    // A flex item is blockified whatever its own display, so the inline
    // flag is checked, and that the caption shares the line with the field.
    const label = canvas.getByTestId("label");
    await expect(label).toHaveAttribute("data-inline", "true");
    const input = canvas.getByRole("textbox");
    await expect(label.getBoundingClientRect().right).toBeLessThanOrEqual(
      input.getBoundingClientRect().left,
    );
    // htmlFor ties the caption to the input beside it.
    await userEvent.click(label);
    await expect(canvas.getByRole("textbox")).toHaveFocus();
  },
  parameters: {
    docs: {
      description: {
        story:
          "For a caption beside its field rather than above it: the label sits on the same line as the input (`isInline`).",
      },
      source: {
        code: `<Label text="Username" htmlFor="username" isInline />
<input type="text" id="username" />`,
      },
    },
  },
};

export const WithChildren: Story = {
  render: () => <WithChildrenTemplate />,
  play: async ({ canvas }) => {
    await expect(canvas.getByTestId("label")).toHaveTextContent(
      "Phone number (optional)",
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'For a note that belongs to the caption, such as "(optional)": content passed as children follows the text inside the same label (`children`).',
      },
      source: {
        code: `<Label text="Phone number" htmlFor="phone">
  <span style={{ marginInlineStart: 8, color: "#666" }}>(optional)</span>
</Label>`,
      },
    },
  },
};

export const FormExample: Story = {
  render: () => <FormExampleTemplate />,
  play: async ({ canvas, userEvent }) => {
    // Every caption names its field and focuses it on click.
    await userEvent.click(canvas.getByText("Email"));
    await expect(canvas.getByLabelText(/Email/)).toHaveFocus();
    await userEvent.click(canvas.getByText("Bio"));
    await expect(canvas.getByLabelText(/Bio/)).toHaveFocus();
  },
  parameters: {
    docs: {
      description: {
        story:
          "How the states read together in a form: a required field, a required field in error and an optional one, each label tied to its input by `htmlFor`, so clicking a caption focuses its field.",
      },
      source: {
        code: `<Label text="Username" htmlFor="username" isRequired />
<input type="text" id="username" />

<Label text="Email" htmlFor="email" isRequired error />
<input type="email" id="email" />

<Label text="Bio" htmlFor="bio">
  <span>(optional)</span>
</Label>
<textarea id="bio" />`,
      },
    },
  },
};

export const CssCustomization: Story = {
  render: () => (
    <div
      style={
        {
          "--label-required-color": "#0082c9",
          "--label-error-color": "#d0021b",
          "--text-size": "14px",
        } as CSSProperties
      }
    >
      <Wrapper>
        <Label text="Display name" htmlFor="displayName" isRequired />
        <Label text="Email address" htmlFor="email" isRequired error />
      </Wrapper>
    </div>
  ),
  play: async ({ canvas }) => {
    const [mark] = canvas.getAllByTestId("required-mark");
    await expect(getComputedStyle(mark).color).toBe("rgb(0, 130, 201)");
    const [, email] = canvas.getAllByTestId("label");
    await expect(getComputedStyle(email).color).toBe("rgb(208, 2, 27)");
  },
  parameters: {
    docs: {
      description: {
        story: `Both colours and the font size set on one wrapper -- the variables are listed under CSS variables on this page.

- **Display name** shows the asterisk colour (\`--label-required-color\`) and the font size.
- **Email address** adds \`error\` to show the text colour in the error state (\`--label-error-color\`).`,
      },
      source: {
        code: `<div
  style={{
    "--label-required-color": "#0082c9",
    "--label-error-color": "#d0021b",
    "--text-size": "14px",
  }}
>
  <Label text="Display name" htmlFor="displayName" isRequired />
  <Label text="Email address" htmlFor="email" isRequired error />
</div>`,
      },
    },
  },
};
