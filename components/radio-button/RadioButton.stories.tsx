import type { CSSProperties, ComponentProps } from "react";
import { useEffect, useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";

import { RadioButton } from ".";

import type { RadioButtonProps } from "./RadioButton.types";

const meta = {
  title: "UI/Form controls/RadioButton",
  component: RadioButton,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
    design: {
      type: "figma",
      url: "https://www.figma.com/file/ZiW5KSwb4t7Tj6Nz5TducC/UI-Kit-DocSpace-1.0.0?type=design&node-id=556-3247&mode=design&t=TBNCKMQKQMxr44IZ-0",
    },
  },
  argTypes: {
    isChecked: {
      control: "boolean",
      description:
        "Whether the circle shows a dot. It seeds the component's own state and is re-applied whenever it changes.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isDisabled: {
      control: "boolean",
      description: "Disables the input and greys the circle and the label.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    label: {
      control: "text",
      description:
        "What is written beside the button. `value` is used when this is left out.",
    },
    name: {
      control: "text",
      description:
        "`name` of the input. Buttons sharing one behave as a single choice.",
    },
    value: {
      control: "text",
      description:
        "`value` of the input, and the label when `label` is left out. It is what a group's `onClick` reads back off the event.",
    },
    fontSize: {
      control: "text",
      description: "Font size of the text beside the circle, as a CSS length.",
      table: {
        defaultValue: { summary: "13px" },
      },
    },
    fontWeight: {
      control: "number",
      description:
        "Weight of the text beside the circle, such as `600` for semibold.",
      table: {
        defaultValue: { summary: "400" },
      },
    },
    spacing: {
      control: "text",
      description:
        "Gap to the neighbouring button, as a CSS length: `margin-inline-start` when horizontal, `margin-block-end` when vertical. There is no gap at all without it — the buttons touch.",
    },
    orientation: {
      control: "select",
      options: ["vertical", "horizontal"],
      description:
        "Which side the gap is put on. It only moves `spacing`; it does not lay anything out on its own.",
      table: {
        defaultValue: { summary: "vertical" },
      },
    },
    onChange: {
      action: "onChange",
      description:
        "Called on every change of the input. It replaces the internal handler: only `isChecked` moves the dot, and `onClick` no longer fires.",
    },
    onClick: {
      action: "onClick",
      description:
        "Called when the button is clicked — but only while `onChange` is not given. Passing `onChange` replaces the internal handler and this never fires.",
    },
    autoFocus: {
      control: "boolean",
      description: "Whether the input takes focus on mount.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    id: {
      control: "text",
      description: "Applied to the label, not to the input.",
    },
    className: {
      control: "text",
      description: "Applied to the label.",
    },
    style: {
      control: "object",
      description: "Applied to the label.",
    },
    classNameInput: {
      control: "text",
      description: "Applied to the visually hidden `<input>`.",
    },
    testId: {
      control: "text",
      description: "`data-testid` of the label.",
      table: {
        defaultValue: { summary: "radio-button" },
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
    args.onChange?.(e);
  };

  return (
    <RadioButton {...args} isChecked={checked} onChange={onChangeHandler} />
  );
};

export const Default: Story = {
  render: (args) => <Template {...args} />,
  play: async ({ args, canvas, userEvent }) => {
    const radio = canvas.getByRole("radio", { name: "Default radio button" });

    // The visually hidden input is the tab stop; Space selects it.
    await userEvent.tab();
    await expect(radio).toHaveFocus();
    await userEvent.keyboard(" ");
    await expect(radio).toBeChecked();
    await expect(args.onChange).toHaveBeenCalledTimes(1);

    // A radio cannot be cleared by clicking it again.
    await userEvent.click(canvas.getByText("Default radio button"));
    await expect(radio).toBeChecked();
  },
  args: {
    onChange: fn(),
    value: "value",
    name: "name",
    label: "Default radio button",
    fontSize: "13px",
    fontWeight: 400,
    isDisabled: false,
    isChecked: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "A single labelled button, the starting point for any single-choice option. A click or Space fills the circle, and a second click does not clear it.",
      },
      source: {
        code: `<RadioButton
  name="name"
  value="value"
  label="Default radio button"
  isChecked={checked}
  onChange={(e) => setChecked(e.target.checked)}
/>`,
      },
    },
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
  name: "Checked and unchecked",
  render: () => <StatesTemplate />,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("radio", { name: "Checked" })).toBeChecked();
    await expect(
      canvas.getByRole("radio", { name: "Unchecked" }),
    ).not.toBeChecked();
  },
  parameters: {
    docs: {
      description: {
        story:
          "The two looks a button takes: an empty circle, and a circle with a dot (`isChecked`).",
      },
      source: {
        code: `<RadioButton name="group" value="unchecked" label="Unchecked" />
<RadioButton name="group" value="checked" label="Checked" isChecked />`,
      },
    },
  },
};

const SharedNameTemplate = () => (
  <Wrapper>
    <RadioButton name="fruit" value="apple" label="Apple" isChecked />
    <RadioButton name="fruit" value="pear" label="Pear" />
  </Wrapper>
);

export const SharedName: Story = {
  name: "Shared name",
  render: () => <SharedNameTemplate />,
  play: async ({ canvas, userEvent }) => {
    const apple = canvas.getByRole("radio", { name: "Apple" });
    const pear = canvas.getByRole("radio", { name: "Pear" });

    await userEvent.click(pear);
    await expect(pear).toBeChecked();
    await expect(apple).not.toBeChecked();
  },
  parameters: {
    docs: {
      description: {
        story:
          "Two buttons sharing a `name`, without `onChange`. Checking one clears the dot of the other.",
      },
      source: {
        code: `<RadioButton name="fruit" value="apple" label="Apple" isChecked />
<RadioButton name="fruit" value="pear" label="Pear" />`,
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
  name: "Disabled",
  render: () => <DisabledTemplate />,
  play: async ({ canvas, userEvent }) => {
    for (const radio of canvas.getAllByRole("radio")) {
      await expect(radio).toBeDisabled();
    }
    // A disabled input is no tab stop.
    await userEvent.tab();
    await expect(document.activeElement).toBe(document.body);
  },
  parameters: {
    docs: {
      description: {
        story:
          "Two disabled buttons, empty and filled in (`isDisabled`). The circle and the label turn grey, and a click does nothing.",
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

export const CustomStyling: Story = {
  name: "Label text size",
  render: () => <CustomStylingTemplate />,
  play: async ({ canvas, userEvent }) => {
    // No onChange here: the button keeps its own state and still selects.
    await userEvent.click(canvas.getByText("Custom styled"));
    await expect(
      canvas.getByRole("radio", { name: "Custom styled" }),
    ).toBeChecked();
  },
  parameters: {
    docs: {
      description: {
        story:
          "Label text at two sizes (`fontSize`, `fontWeight`): **Custom styled** at 16px semibold, **Small text** at 11px light.",
      },
      source: {
        code: `<RadioButton name="group" value="1" label="Custom styled" fontSize="16px" fontWeight={600} />
<RadioButton name="group" value="2" label="Small text" fontSize="11px" fontWeight={300} />`,
      },
    },
  },
};

const WithSpacingTemplate = () => {
  const [vertical, setVertical] = useState("small");
  const [horizontal, setHorizontal] = useState("small");
  const options = ["small", "medium", "large"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {options.map((option) => (
          <RadioButton
            key={option}
            name="vertical-size"
            value={option}
            label={`Vertical: ${option}`}
            isChecked={vertical === option}
            spacing="12px"
            onChange={(e) => setVertical(e.target.value)}
          />
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        {options.map((option) => (
          <RadioButton
            key={option}
            name="horizontal-size"
            value={option}
            label={`Horizontal: ${option}`}
            isChecked={horizontal === option}
            orientation="horizontal"
            spacing="24px"
            onChange={(e) => setHorizontal(e.target.value)}
          />
        ))}
      </div>
    </div>
  );
};

export const WithSpacing: Story = {
  name: "Spacing in a set",
  render: () => <WithSpacingTemplate />,
  play: async ({ canvas, userEvent }) => {
    const small = canvas.getByRole("radio", { name: "Vertical: small" });
    const medium = canvas.getByRole("radio", { name: "Vertical: medium" });
    const large = canvas.getByRole("radio", { name: "Vertical: large" });
    await expect(small).toBeChecked();

    await userEvent.click(canvas.getByText("Vertical: medium"));
    await expect(medium).toBeChecked();
    await expect(small).not.toBeChecked();

    // Buttons sharing a name form one set: an arrow key moves the choice.
    await userEvent.keyboard("{ArrowDown}");
    await expect(large).toBeChecked();
    await expect(medium).not.toBeChecked();
  },
  parameters: {
    docs: {
      description: {
        story: `Two sets with a gap between their buttons (\`spacing\`); without it they touch:

- **Vertical** — 12px below every button but the last
- **Horizontal** — 24px before every button but the first (\`orientation="horizontal"\`)

The container lays the buttons out; \`orientation\` only picks the side of the gap.`,
      },
      source: {
        code: `<div style={{ display: "flex", flexDirection: "column" }}>
  {options.map((option) => (
    <RadioButton
      key={option}
      name="vertical-size"
      value={option}
      isChecked={vertical === option}
      spacing="12px"
      onChange={(e) => setVertical(e.target.value)}
    />
  ))}
</div>

<div style={{ display: "flex", flexDirection: "row" }}>
  {options.map((option) => (
    <RadioButton
      key={option}
      name="horizontal-size"
      value={option}
      isChecked={horizontal === option}
      orientation="horizontal"
      spacing="24px"
      onChange={(e) => setHorizontal(e.target.value)}
    />
  ))}
</div>`,
      },
    },
  },
};

export const CssCustomization: Story = {
  name: "CSS variables",
  play: async ({ canvas }) => {
    const radio = canvas.getByRole("radio", { name: "Custom option" });
    await expect(radio).toBeChecked();
    const label = canvas.getByText("Custom option");
    await expect(label).toHaveStyle({ color: "rgb(76, 29, 149)" });
    // --radio-button-gap: the room between the circle and the label.
    const circle = (label.closest("label") as HTMLElement).querySelector(
      "svg",
    ) as SVGElement;
    await expect(
      Math.round(
        label.getBoundingClientRect().left -
          circle.getBoundingClientRect().right,
      ),
    ).toBe(16);
  },
  render: () => (
    <div
      style={
        {
          "--radio-button-dot-color": "#7c3aed",
          "--radio-button-circle-color": "#7c3aed",
          "--radio-button-circle-hover-color": "light-dark(#3b0764, #d8b4fe)",
          "--radio-button-background": "light-dark(#f3e8ff, #2d1f45)",
          "--radio-button-label-color": "light-dark(#4c1d95, #c4b5fd)",
          "--radio-button-gap": "16px",
        } as CSSProperties
      }
    >
      <RadioButton name="custom" value="1" label="Custom option" isChecked />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `One checked button under a wrapper that sets every variable. It shows the violet dot and outline, the light violet fill, the dark violet text and the wider gap.`,
      },
      source: {
        code: `<div
  style={{
    "--radio-button-dot-color": "#7c3aed",
    "--radio-button-circle-color": "#7c3aed",
    "--radio-button-circle-hover-color": "light-dark(#3b0764, #d8b4fe)",
    "--radio-button-background": "light-dark(#f3e8ff, #2d1f45)",
    "--radio-button-label-color": "light-dark(#4c1d95, #c4b5fd)",
    "--radio-button-gap": "16px",
  }}
>
  <RadioButton name="custom" value="1" label="Custom option" isChecked />
</div>`,
      },
    },
  },
};
