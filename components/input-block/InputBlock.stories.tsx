import type React from "react";
import type { CSSProperties, ComponentProps } from "react";
import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, within } from "storybook/test";

import SearchReactSvgUrl from "../../assets/search.react.svg?url";

import { InputSize, InputType } from "../text-input";

import { InputBlock } from ".";
import type { InputBlockProps } from "./InputBlock.types";

const meta = {
  title: "UI/Form controls/InputBlock",
  component: InputBlock,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
  },
  argTypes: {
    size: {
      control: "select",
      options: Object.values(InputSize),
      description: "Text size, padding and icon box height of the field",
      table: {
        defaultValue: { summary: "base" },
      },
    },
    type: {
      control: "select",
      options: Object.values(InputType),
      description:
        "Type of the inner `<input>`; required, so there is no default",
    },
    value: {
      control: "text",
      description: "Text in the field; the field shows only what this holds",
      table: {
        defaultValue: { summary: '""' },
      },
    },
    placeholder: {
      control: "text",
      description: "Placeholder text",
      table: {
        defaultValue: { summary: '" "' },
      },
    },
    maxLength: {
      control: "number",
      description:
        "Maximum number of characters the field accepts; further typing is silently dropped",
      table: {
        defaultValue: { summary: "255" },
      },
    },
    isDisabled: {
      control: "boolean",
      description:
        "Greys the field out, stops typing and removes the icon at the end",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isReadOnly: {
      control: "boolean",
      description: "Stops typing but keeps the look of the field and its icon",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    hasError: {
      control: "boolean",
      description: "Recolours the border of the group to the error colour",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    hasWarning: {
      control: "boolean",
      description: "Recolours the border of the group to the warning colour",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    scale: {
      control: "boolean",
      description:
        "Passed to the inner input, which already fills the group; the group is always as wide as its container, so nothing visible changes",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    iconName: {
      control: "text",
      description: "URL of the icon at the end of the field",
    },
    iconNode: {
      control: false,
      description: "The icon as an element, instead of `iconName`",
    },
    iconSize: {
      control: "number",
      description:
        "Size of the icon in pixels; left out, the icon follows the field's size",
    },
    iconColor: {
      control: "color",
      description: "Colour of the icon at the end of the field",
    },
    hoverColor: {
      control: "color",
      description: "Colour of that icon while the pointer is over it",
    },
    isIconFill: {
      control: "boolean",
      description:
        "Recolours the icon's paths to the icon color; leave it off for a multi-coloured icon",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    noIcon: {
      control: "boolean",
      description:
        "Leaves the icon box out entirely; without it an empty box still takes space at the end of the field",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    onIconClick: {
      control: false,
      description:
        "Called when the icon is clicked; without it the icon is drawn greyed out and ignores clicks",
    },
    children: {
      control: "text",
      description:
        "Content rendered before the input, inside the same border, such as a currency sign or a country code",
    },
    tabIndex: {
      control: "number",
      description:
        "Place of the inner `<input>` in the keyboard tab order; at the default the Tab key skips the field",
      table: {
        defaultValue: { summary: "-1" },
      },
    },
    isAutoFocussed: {
      control: "boolean",
      description: "Focuses the inner `<input>` when the field first renders",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    autoComplete: {
      control: "text",
      description: "HTML `autocomplete` of the inner `<input>`",
      table: {
        defaultValue: { summary: '"off"' },
      },
    },
    name: {
      control: "text",
      description: "HTML `name` of the inner `<input>`",
    },
    id: {
      control: "text",
      description: "Applied to the inner `<input>`, not to the group around it",
    },
    mask: {
      control: false,
      description:
        "Input mask: an array of characters and patterns, or a function returning one from the value",
    },
    keepCharPositions: {
      control: "boolean",
      description:
        "With a mask, adding or deleting a character leaves the other characters where they are",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    onChange: {
      control: false,
      description: "Called with the change event of the inner `<input>`",
    },
    onFocus: {
      action: "onFocus",
      description: "Called when the inner `<input>` gets focus",
    },
    onBlur: {
      action: "onBlur",
      description: "Called when the inner `<input>` loses focus",
    },
    onKeyDown: {
      action: "onKeyDown",
      description: "Called when a key is pressed in the inner `<input>`",
    },
    onClick: {
      action: "onClick",
      description: "Called when the inner `<input>` is clicked",
    },
    iconButtonClassName: {
      control: "text",
      description: "Class name applied to the box around the icon",
      table: {
        defaultValue: { summary: '""' },
      },
    },
    className: {
      control: "text",
      description: "Class name applied to the group",
    },
    style: {
      control: "object",
      description: "Inline style applied to the group",
    },
    dataTestId: {
      control: "text",
      description: "`data-testid` of the group",
      table: {
        defaultValue: { summary: '"input-block"' },
      },
    },
    testId: {
      control: "text",
      description: "`data-testid` of the inner `<input>`",
    },
    forwardedRef: {
      control: false,
      description: "Ref to the inner `<input>` element",
    },
  },
} satisfies Meta<typeof InputBlock>;

type Story = StoryObj<ComponentProps<typeof InputBlock>>;

export default meta;

const onSearchIconClick = fn();

// The icon box at the end of the field, absent when there is no icon.
const iconOf = (block: HTMLElement) =>
  block.querySelector<HTMLElement>(".append .input-block-icon");

const Wrapper = (props: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        gridGap: "16px",
        alignItems: "center",
      }}
    >
      {props.children}
    </div>
  );
};

const ControlledInputBlock = (props: InputBlockProps) => {
  const [value, setValue] = useState(props.value || "");

  return (
    <InputBlock
      {...props}
      value={value}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        setValue(e.target.value)
      }
    />
  );
};

const defaultProps: InputBlockProps = {
  placeholder: "Enter text here",
  maxLength: 255,
  size: InputSize.base,
  type: InputType.text,
  isDisabled: false,
  isReadOnly: false,
  hasError: false,
  hasWarning: false,
  scale: false,
  iconName: SearchReactSvgUrl,
  isIconFill: false,
  value: "",
};

export const Default: Story = {
  render: (args) => <ControlledInputBlock {...args} />,
  args: defaultProps,
  play: async ({ canvas, userEvent }) => {
    const block = canvas.getByTestId("input-block");
    const input = within(block).getByPlaceholderText("Enter text here");
    await userEvent.type(input, "hello");
    await expect(input).toHaveValue("hello");
    // Out of the tab order unless tabIndex is passed.
    await expect(input).toHaveAttribute("tabindex", "-1");
    // Without onIconClick the icon is drawn disabled.
    await expect(within(block).getByTestId("icon-button")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "A text field with a search icon at its end, inside one border. Type in it, and change any other prop live in the Controls panel below.",
      },
      source: {
        code: `<InputBlock
  type={InputType.text}
  size={InputSize.base}
  iconName={SearchIcon}
  placeholder="Enter text here"
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>`,
      },
    },
  },
};

const SizesTemplate = () => {
  return (
    <Wrapper>
      <ControlledInputBlock
        {...defaultProps}
        size={InputSize.base}
        placeholder="Base size"
      />
      <ControlledInputBlock
        {...defaultProps}
        size={InputSize.middle}
        placeholder="Middle size"
      />
      <ControlledInputBlock
        {...defaultProps}
        size={InputSize.large}
        placeholder="Large size"
      />
    </Wrapper>
  );
};

export const Sizes: Story = {
  render: () => <SizesTemplate />,
  play: async ({ canvas }) => {
    const size = (placeholder: string) =>
      Number.parseFloat(
        getComputedStyle(canvas.getByPlaceholderText(placeholder)).fontSize,
      );
    await expect(size("Large size")).toBeGreaterThan(size("Base size"));
  },
  parameters: {
    docs: {
      description: {
        story:
          "Match the field to the controls around it: **Base size**, **Middle size** and **Large size** differ in text size, padding and the height of the icon box (`size`).",
      },
      source: {
        code: `<InputBlock size={InputSize.base} placeholder="Base size" iconName={SearchIcon} />
<InputBlock size={InputSize.middle} placeholder="Middle size" iconName={SearchIcon} />
<InputBlock size={InputSize.large} placeholder="Large size" iconName={SearchIcon} />`,
      },
    },
  },
};

const StatesTemplate = () => {
  return (
    <Wrapper>
      <ControlledInputBlock {...defaultProps} placeholder="Normal" />
      <ControlledInputBlock
        {...defaultProps}
        hasError
        placeholder="Error state"
      />
      <ControlledInputBlock
        {...defaultProps}
        hasWarning
        placeholder="Warning state"
      />
      <ControlledInputBlock
        {...defaultProps}
        isDisabled
        placeholder="Disabled"
      />
      <ControlledInputBlock
        {...defaultProps}
        isReadOnly
        value="Read-only content"
      />
    </Wrapper>
  );
};

export const States: Story = {
  render: () => <StatesTemplate />,
  play: async ({ canvas }) => {
    const [normal, error, warning, disabled, readOnly] =
      canvas.getAllByTestId("input-block");
    await expect(normal).toHaveAttribute("data-error", "false");
    await expect(error).toHaveAttribute("data-error", "true");
    await expect(warning).toHaveAttribute("data-warning", "true");
    // Disabled drops the icon; read-only keeps it.
    await expect(within(disabled).getByRole("textbox")).toBeDisabled();
    await expect(iconOf(disabled)).toBeNull();
    const readOnlyInput =
      within(readOnly).getByDisplayValue("Read-only content");
    await expect(readOnlyInput).toHaveAttribute("readonly");
    await expect(iconOf(readOnly)).not.toBeNull();
  },
  parameters: {
    docs: {
      description: {
        story:
          "How the field reads in each state: **Error state** and **Warning state** recolour the border of the whole group (`hasError`, `hasWarning`); **Disabled** greys the field out and drops the icon (`isDisabled`); **Read-only content** keeps the look and the icon and only stops typing (`isReadOnly`).",
      },
      source: {
        code: `<InputBlock placeholder="Normal" iconName={SearchIcon} />
<InputBlock placeholder="Error state" hasError iconName={SearchIcon} />
<InputBlock placeholder="Warning state" hasWarning iconName={SearchIcon} />
<InputBlock placeholder="Disabled" isDisabled iconName={SearchIcon} />
<InputBlock value="Read-only content" isReadOnly iconName={SearchIcon} />`,
      },
    },
  },
};

const PasswordTemplate = () => {
  return (
    <div style={{ width: "300px" }}>
      <ControlledInputBlock
        {...defaultProps}
        type={InputType.password}
        placeholder="Enter password"
      />
    </div>
  );
};

export const PasswordType: Story = {
  render: () => <PasswordTemplate />,
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByPlaceholderText("Enter password");
    await expect(input).toHaveAttribute("type", "password");
    await userEvent.type(input, "secret");
    await expect(input).toHaveValue("secret");
  },
  parameters: {
    docs: {
      description: {
        story:
          "For a secret that must not be read off the screen, the typed characters are masked (`type={InputType.password}`). For a reveal toggle and strength rules, use `PasswordInput` instead.",
      },
      source: {
        code: `<InputBlock
  type={InputType.password}
  placeholder="Enter password"
  iconName={SearchIcon}
/>`,
      },
    },
  },
};

const WithIconClickTemplate = () => {
  return (
    <div style={{ width: "300px" }}>
      <ControlledInputBlock
        {...defaultProps}
        placeholder="Click the icon"
        onIconClick={onSearchIconClick}
      />
    </div>
  );
};

export const WithIconClick: Story = {
  render: () => <WithIconClickTemplate />,
  beforeEach: () => {
    onSearchIconClick.mockClear();
  },
  play: async ({ canvas, userEvent }) => {
    const icon = within(canvas.getByTestId("input-block")).getByTestId(
      "icon-button",
    );
    await expect(icon).toHaveAttribute("aria-disabled", "false");
    await userEvent.click(icon);
    await expect(onSearchIconClick).toHaveBeenCalledTimes(1);
  },
  parameters: {
    docs: {
      description: {
        story:
          "An icon that does something, such as clearing the field or opening a picker, needs a click handler (`onIconClick`); without it the icon is drawn greyed out and ignores clicks, as in the other stories. Click the search icon to see the action.",
      },
      source: {
        code: `<InputBlock
  placeholder="Click the icon"
  iconName={SearchIcon}
  onIconClick={() => alert("Icon clicked!")}
/>`,
      },
    },
  },
};

const WithPrefixTemplate = () => {
  return (
    <Wrapper>
      <ControlledInputBlock {...defaultProps} placeholder="Amount" noIcon>
        <span>$</span>
      </ControlledInputBlock>
      <ControlledInputBlock {...defaultProps} placeholder="Phone number">
        <span>+1</span>
      </ControlledInputBlock>
    </Wrapper>
  );
};

export const WithPrefix: Story = {
  render: () => <WithPrefixTemplate />,
  play: async ({ canvas }) => {
    const [amount, phone] = canvas.getAllByTestId("input-block");
    // The prefix sits before the input, inside the same border.
    const dollar = within(amount).getByText("$").getBoundingClientRect();
    await expect(dollar.right).toBeLessThanOrEqual(
      within(amount).getByRole("textbox").getBoundingClientRect().left + 1,
    );
    await expect(iconOf(amount)).toBeNull();
    await expect(within(phone).getByText("+1")).toBeVisible();
    await expect(iconOf(phone)).not.toBeNull();
  },
  parameters: {
    docs: {
      description: {
        story:
          "A fixed part of the value that the user does not type sits in front of the input, inside the same border (`children`). **Amount** has a currency sign and no icon at its end (`noIcon`); **Phone number** has a country code and keeps its icon.",
      },
      source: {
        code: `<InputBlock type={InputType.text} placeholder="Amount" value={amount} onChange={handleAmount} noIcon>
  <span>$</span>
</InputBlock>
<InputBlock type={InputType.text} placeholder="Phone number" iconName={SearchIcon} value={phone} onChange={handlePhone}>
  <span>+1</span>
</InputBlock>`,
      },
    },
  },
};

// "Search" in Arabic, escaped so the source stays ASCII.
const RTL_PLACEHOLDER = "\u0628\u062d\u062b";

const RightToLeftTemplate = () => {
  return (
    <div dir="rtl" style={{ display: "grid", gap: "16px", width: "300px" }}>
      <ControlledInputBlock {...defaultProps} placeholder={RTL_PLACEHOLDER} />
      <ControlledInputBlock {...defaultProps} placeholder={RTL_PLACEHOLDER}>
        <span>$</span>
      </ControlledInputBlock>
    </div>
  );
};

// Framed on Docs: the theme provider stamps data-dir on <html>, which would flip the whole page.
export const RightToLeft: Story = {
  render: () => <RightToLeftTemplate />,
  play: async ({ canvas }) => {
    const [plain, prefixed] = canvas.getAllByTestId("input-block");
    // The icon at the left end, the prefix at the right end.
    const input = within(plain).getByRole("textbox").getBoundingClientRect();
    const icon = (iconOf(plain) as HTMLElement).getBoundingClientRect();
    await expect(icon.right).toBeLessThanOrEqual(input.left + 1);
    const prefixInput = within(prefixed)
      .getByRole("textbox")
      .getBoundingClientRect();
    await expect(
      within(prefixed).getByText("$").getBoundingClientRect().left,
    ).toBeGreaterThanOrEqual(prefixInput.right - 1);
  },
  globals: { direction: "rtl" },
  parameters: {
    noPadding: true,
    docs: {
      story: { inline: false, height: "106px" },
      description: {
        story:
          'The same field under a right-to-left interface: the icon moves to the left end, the prefix to the right end, and the placeholder sits at the right edge. The direction comes from the theme\'s `interfaceDirection` (the Direction toolbar); the wrapper also carries `dir="rtl"` for the rules that read the DOM direction.',
      },
      source: {
        code: `<div dir="rtl">
  <InputBlock type={InputType.text} iconName={SearchIcon} placeholder="..." value={value} onChange={handleChange} />
  <InputBlock type={InputType.text} iconName={SearchIcon} placeholder="..." value={amount} onChange={handleAmount}>
    <span>$</span>
  </InputBlock>
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
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          width: "300px",
          "--text-input-bg": "#f5f3ff",
          "--text-input-border-color": "#c4b5fd",
          "--text-input-border-hover": "#7c3aed",
          "--text-input-border-focus": "#3b0764",
          "--text-input-color": "#4c1d95",
          "--text-input-font-size": "14px",
          "--text-input-radius": "8px",
          "--input-block-icon-padding": "16px",
          "--input-block-icon-padding-lg": "24px",
          "--input-block-icon-start": "8px",
          "--input-block-children-padding": "0 4px 0 12px",
        } as CSSProperties
      }
    >
      <InputBlock
        type={InputType.text}
        iconName={SearchReactSvgUrl}
        placeholder="Amount"
        value="120"
        onChange={fn()}
      >
        <span>$</span>
      </InputBlock>
      <InputBlock
        type={InputType.text}
        size={InputSize.large}
        iconName={SearchReactSvgUrl}
        placeholder="Large size"
        value=""
        onChange={fn()}
      />
    </div>
  ),
  play: async ({ canvas }) => {
    const [amount] = canvas.getAllByTestId("input-block");
    const box = getComputedStyle(amount);
    await expect(box.borderTopColor).toBe("rgb(196, 181, 253)");
    await expect(box.borderTopLeftRadius).toBe("8px");
    await expect(
      getComputedStyle(within(amount).getByDisplayValue("120")).color,
    ).toBe("rgb(76, 29, 149)");
  },
  parameters: {
    docs: {
      description: {
        story: `Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page.

**Amount** carries a prefix, for the prefix padding, and shows every other variable except the large icon padding; **Large size** is there for \`--input-block-icon-padding-lg\`, which only the large size reads. Hover and focus a field to see the hover and focus border colours.`,
      },
      source: {
        code: `<div style={{ "--text-input-bg": "#f5f3ff", "--text-input-border-color": "#c4b5fd", "--input-block-icon-padding": "16px" }}>
  <InputBlock type={InputType.text} iconName={SearchIcon} value="120" onChange={handleChange}>
    <span>$</span>
  </InputBlock>
  <InputBlock type={InputType.text} size={InputSize.large} iconName={SearchIcon} value="" onChange={handleChange} />
</div>`,
      },
    },
  },
};
