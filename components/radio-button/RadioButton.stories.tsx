import type { CSSProperties, ComponentProps } from "react";
import { useEffect, useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

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
        "Whether the circle is filled in; the button starts in this state and returns to it whenever the prop changes",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isDisabled: {
      control: "boolean",
      description:
        "Disables the input and greys out the circle and the label, so clicks no longer select it",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    label: {
      control: "text",
      description:
        "Text or any React node written beside the circle; `value` is shown when it is left out",
    },
    name: {
      control: "text",
      description:
        "`name` of the input; buttons sharing one form a single choice the arrow keys move through",
    },
    value: {
      control: "text",
      description:
        "`value` of the input, read back from the change event, and the text beside the circle when `label` is left out",
    },
    fontSize: {
      control: "text",
      description: "Font size of the text beside the circle, as a CSS length",
      table: {
        defaultValue: { summary: "13px" },
      },
    },
    fontWeight: {
      control: "number",
      description: "Font weight of the text beside the circle",
      table: {
        defaultValue: { summary: "400" },
      },
    },
    spacing: {
      control: "text",
      description:
        "Gap to the neighbouring button, as a CSS length; without it the buttons touch",
    },
    orientation: {
      control: "select",
      options: ["vertical", "horizontal"],
      description:
        "Which side `spacing` goes on: below the button when vertical, before it when horizontal; it does not arrange the buttons itself",
      table: {
        defaultValue: { summary: "vertical" },
      },
    },
    onChange: {
      action: "onChange",
      description:
        "Called on every change of the input; once given, the button stops tracking its own state, follows `isChecked` alone and no longer calls `onClick`",
    },
    onClick: {
      action: "onClick",
      description:
        "Called when the button is clicked, but only while `onChange` is not given",
    },
    autoFocus: {
      control: "boolean",
      description:
        "Whether the input takes keyboard focus as soon as it mounts",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    id: {
      control: "text",
      description:
        "`id` of the label that wraps the button, not of the input inside it",
    },
    className: {
      control: "text",
      description: "Class added to the label that wraps the button",
    },
    style: {
      control: "object",
      description: "Inline style of the label that wraps the button",
    },
    classNameInput: {
      control: "text",
      description: "Class added to the visually hidden input",
    },
    testId: {
      control: "text",
      description: "`data-testid` of the label that wraps the button",
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
  args: {
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
          "A single labelled button, the starting point for any single-choice option; click it to fill in the circle, and change any other prop live in the Controls panel below.",
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
  render: () => <StatesTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "The two looks a button can take side by side, so the filled-in choice is easy to tell from the rest: an empty circle and a circle with a dot (`isChecked`).",
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
          "A disabled button, empty or filled in, shows an option the user can see but not change: the circle and the label turn grey and clicks are ignored (`isDisabled`).",
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
  render: () => <CustomStylingTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Larger or smaller label text for a button placed in a heading or a dense list: **Custom styled** at 16px semibold, **Small text** at 11px light (`fontSize`, `fontWeight`).",
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
  render: () => <WithSpacingTemplate />,
  parameters: {
    docs: {
      description: {
        story: `A set of buttons needs room between them, because without a gap they touch:

- **Vertical** — a column with 12px below every button but the last (\`spacing\`, the default \`orientation\`)
- **Horizontal** — a row with 24px before every button but the first (\`spacing\`, \`orientation="horizontal"\`)

The container still lays the buttons out; \`orientation\` only decides which side the gap goes on. Pick an option in each set with a click or the arrow keys.`,
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
  render: () => (
    <div
      style={
        {
          "--radio-button-dot-color": "#7c3aed",
          "--radio-button-circle-color": "#7c3aed",
          "--radio-button-circle-hover-color": "#3b0764",
          "--radio-button-background": "#f3e8ff",
          "--radio-button-label-color": "#4c1d95",
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
        story: `The variables are listed under CSS variables on this page. The example is one checked button, so it shows every variable at once: the violet dot and outline, the light violet fill, the dark violet text and the wider gap. Hover it to see the darker outline.`,
      },
      source: {
        code: `<div
  style={{
    "--radio-button-dot-color": "#7c3aed",
    "--radio-button-circle-color": "#7c3aed",
    "--radio-button-circle-hover-color": "#3b0764",
    "--radio-button-background": "#f3e8ff",
    "--radio-button-label-color": "#4c1d95",
    "--radio-button-gap": "16px",
  }}
>
  <RadioButton name="custom" value="1" label="Custom option" isChecked />
</div>`,
      },
    },
  },
};
