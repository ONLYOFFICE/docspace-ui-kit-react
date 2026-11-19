import type React from "react";
import type { CSSProperties, ComponentProps } from "react";
import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, waitFor } from "storybook/test";

import { WhenVisible } from "../../.storybook/utils/WhenVisible";

import { TextInput } from ".";
import { InputSize, InputType } from "./TextInput.enums";

const meta = {
  title: "UI/Form controls/TextInput",
  component: TextInput,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
    design: {
      type: "figma",
      url: "https://www.figma.com/file/ZiW5KSwb4t7Tj6Nz5TducC/UI-Kit-DocSpace-1.0.0?type=design&node-id=633-3686&mode=dev",
    },
  },
  argTypes: {
    size: {
      control: "select",
      options: Object.values(InputSize),
      description:
        "Width and type size of the field, from 173px to 550px wide.",
      table: {
        defaultValue: { summary: "base" },
      },
    },
    type: {
      control: "select",
      options: Object.values(InputType),
      description:
        "Kind of value the field takes. It sets the input's `type`, and with it the mobile keyboard and the browser's own validation.",
      table: {
        defaultValue: { summary: "text" },
      },
    },
    value: {
      control: "text",
      description:
        "Text the field shows. The field is controlled: it shows only what you pass, so update it from `onChange`.",
    },
    placeholder: {
      control: "text",
      description:
        "Placeholder text. The default is a single space, not an empty string, so `:placeholder-shown` matches even when no placeholder was asked for.",
      table: {
        defaultValue: { summary: '" "' },
      },
    },
    isDisabled: {
      control: "boolean",
      description:
        "Greys the field and stops editing. A disabled field is skipped by the tab order and left out of a submitted form.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isReadOnly: {
      control: "boolean",
      description:
        "Keeps the value legible and selectable but stops editing. The field stays in the tab order.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    hasError: {
      control: "boolean",
      description:
        "Draws the border in the error colour. It sets no `aria-invalid`.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    hasWarning: {
      control: "boolean",
      description:
        "Draws the border in the warning colour, which wins over `hasError`.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    scale: {
      control: "boolean",
      description:
        "Stretches the field to the width of its container instead of the fixed `size` width.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withBorder: {
      control: "boolean",
      description:
        "Draws the border. Without it the field shows no hover, focus, error or warning colour, since all of them are border colours.",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    isBold: {
      control: "boolean",
      description: "Sets the typed text's weight to 600, over `fontWeight`.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    maxLength: {
      control: "number",
      description:
        "Most characters the field accepts; typing past it is dropped silently.",
      table: {
        defaultValue: { summary: "255" },
      },
    },
    fontWeight: {
      control: "number",
      description:
        "Weight of the typed text, as a CSS `font-weight`. `isBold` wins over it.",
    },
    tabIndex: {
      control: "number",
      description:
        "Place of the field in the tab order. Left out, the field takes its natural place; pass `-1` only for a field the keyboard should skip.",
    },
    isAutoFocussed: {
      control: "boolean",
      description: "Puts the caret in the field on its first render.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    dir: {
      control: "select",
      options: ["auto", "ltr", "rtl"],
      description:
        "Text direction of the field. `auto` lets each value pick its own, so mixed-script text reads correctly.",
      table: {
        defaultValue: { summary: '"auto"' },
      },
    },
    inputMode: {
      control: "select",
      options: [
        "none",
        "text",
        "decimal",
        "numeric",
        "tel",
        "search",
        "email",
        "url",
      ],
      description:
        "Which virtual keyboard a touch device shows, independent of `type`.",
    },
    mask: {
      control: false,
      description:
        "Pattern the typed text is fitted to: an array of literal characters and RegExps, or a function of the value that returns one.",
    },
    guide: {
      control: "boolean",
      description:
        "Shows the mask's placeholder and literal characters before they are typed. Without it they appear as the text reaches them.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    keepCharPositions: {
      control: "boolean",
      description:
        "Keeps every character in its slot: typing into a filled slot is refused, and a deletion leaves the slot empty instead of shifting the rest. Read only with `mask`.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    onChange: {
      description:
        "Called with the change event on every edit. Pass it unless the field is read-only, since the field shows `value` and nothing else.",
    },
    onBlur: {
      action: "onBlur",
      description: "Called when the field loses focus.",
    },
    onFocus: {
      action: "onFocus",
      description: "Called when the field receives focus.",
    },
    onKeyDown: {
      action: "onKeyDown",
      description: "Called on every key press while the field has focus.",
    },
    onClick: {
      action: "onClick",
      description:
        "Called with the mouse event when the pointer clicks the field.",
    },
    onContextMenu: {
      action: "onContextMenu",
      description:
        "Called when the browser's context menu is opened on the field.",
    },
    id: {
      control: "text",
      description: "Id of the `<input>`.",
    },
    name: {
      control: "text",
      description: "Name under which the value is submitted with a form.",
    },
    autoComplete: {
      control: "text",
      description:
        "What the browser may autofill here, as an HTML `autocomplete` token such as `email` or `new-password`.",
      table: {
        defaultValue: { summary: '"off"' },
      },
    },
    spellCheck: {
      control: "boolean",
      description:
        "Turns the browser's spelling check on or off; unset, the browser decides.",
    },
    className: {
      control: "text",
      description: "Class added to the `<input>`.",
    },
    style: {
      control: "object",
      description:
        "Inline style of the `<input>`, the only place its own CSS variables can be overridden.",
    },
    forwardedRef: {
      control: false,
      description:
        "Ref to the `<input>`. Dropped when `mask` is set, which renders the masked input instead.",
    },
    testId: {
      control: "text",
      description: "Value of `data-testid` on the `<input>`.",
      table: {
        defaultValue: { summary: '"text-input"' },
      },
    },
  },
} satisfies Meta<typeof TextInput>;

type Story = StoryObj<ComponentProps<typeof TextInput>>;

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

const ControlledInput = (
  props: Partial<ComponentProps<typeof TextInput>> & { initialValue?: string },
) => {
  const { initialValue, type = InputType.text, onChange, ...rest } = props;
  const [val, setValue] = useState(initialValue || rest.value || "");

  return (
    <TextInput
      {...rest}
      type={type}
      value={val}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        onChange?.(e);
      }}
    />
  );
};

export const Default: Story = {
  render: (args) => <ControlledInput {...args} />,
  args: {
    placeholder: "Enter text here",
    maxLength: 255,
    size: InputSize.base,
    type: InputType.text,
    isDisabled: false,
    isReadOnly: false,
    hasError: false,
    hasWarning: false,
    scale: false,
    withBorder: true,
    value: "",
    onChange: fn(),
  },
  play: async ({ args, canvas, userEvent }) => {
    const input = canvas.getByPlaceholderText("Enter text here");
    await userEvent.type(input, "Hello");
    await expect(input).toHaveValue("Hello");
    await expect(args.onChange).toHaveBeenCalledTimes(5);
  },
  parameters: {
    docs: {
      description: {
        story:
          "An empty field with a placeholder, the shape most forms start from (`placeholder`).",
      },
      source: {
        code: `<TextInput
  type={InputType.text}
  value={value}
  onChange={(e) => setValue(e.target.value)}
  placeholder="Enter text here"
/>`,
      },
    },
  },
};

const rect = (element: Element) => element.getBoundingClientRect();

const SizesTemplate = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        alignItems: "flex-start",
      }}
    >
      {(Object.keys(InputSize) as Array<InputSize>).map((size) => (
        <ControlledInput
          key={size}
          size={size}
          initialValue={`${size[0].toUpperCase()}${size.slice(1)} size`}
          placeholder={`${size} input`}
        />
      ))}
    </div>
  );
};

export const Sizes: Story = {
  render: () => <SizesTemplate />,
  play: async ({ canvas }) => {
    // Each size has its own fixed width; large also has the bigger text.
    const [base, middle, large] = [
      "Base size",
      "Middle size",
      "Large size",
    ].map((value) => canvas.getByDisplayValue(value));
    await expect(
      [base, middle, large].map((input) => Math.round(rect(input).width)),
    ).toEqual([173, 300, 550]);
    await expect(base).toHaveStyle({ fontSize: "13px" });
    await expect(large).toHaveStyle({ fontSize: "16px" });
  },
  parameters: {
    docs: {
      description: {
        story:
          "The three widths (`size`): 173px for a short value, 300px for most text, 550px for a long one. The middle size is also semibold; the large one uses a 16px font.",
      },
      source: {
        code: `<TextInput size={InputSize.base} value="Base size" />
<TextInput size={InputSize.middle} value="Middle size" />
<TextInput size={InputSize.large} value="Large size" />`,
      },
    },
  },
};

const TypesTemplate = () => {
  return (
    <Wrapper>
      <ControlledInput type={InputType.text} placeholder="Text" />
      <ControlledInput type={InputType.password} placeholder="Password" />
      <ControlledInput type={InputType.email} placeholder="Email" />
      <ControlledInput type={InputType.tel} placeholder="Telephone" />
      <ControlledInput type={InputType.search} placeholder="Search" />
      <ControlledInput type={InputType.number} placeholder="Number" />
    </Wrapper>
  );
};

export const Types: Story = {
  render: () => <TypesTemplate />,
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByPlaceholderText("Password")).toHaveAttribute(
      "type",
      "password",
    );

    // The browser keeps letters out of a number field.
    const number = canvas.getByPlaceholderText("Number");
    await userEvent.type(number, "a1b2");
    await expect(number).toHaveValue(12);
  },
  parameters: {
    docs: {
      description: {
        story:
          "One field per `type`, so the browser supplies the right keyboard and value rules. Password hides the characters, number rejects letters, email and tel bring their own touch keyboards.",
      },
      source: {
        code: `<TextInput type={InputType.text} placeholder="Text" />
<TextInput type={InputType.password} placeholder="Password" />
<TextInput type={InputType.email} placeholder="Email" />
<TextInput type={InputType.tel} placeholder="Telephone" />
<TextInput type={InputType.search} placeholder="Search" />
<TextInput type={InputType.number} placeholder="Number" />`,
      },
    },
  },
};

const StatesTemplate = () => {
  return (
    <Wrapper>
      <ControlledInput initialValue="Normal" placeholder="Normal" />
      <ControlledInput
        initialValue="Error state"
        hasError
        placeholder="Error"
      />
      <ControlledInput
        initialValue="Warning state"
        hasWarning
        placeholder="Warning"
      />
      <ControlledInput
        initialValue="Disabled"
        isDisabled
        placeholder="Disabled"
      />
      <ControlledInput
        initialValue="Read only"
        isReadOnly
        placeholder="Read only"
      />
      <ControlledInput
        initialValue="No border"
        withBorder={false}
        placeholder="No border"
      />
    </Wrapper>
  );
};

export const States: Story = {
  render: () => <StatesTemplate />,
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByPlaceholderText("Disabled")).toBeDisabled();

    const readOnly = canvas.getByPlaceholderText("Read only");
    await userEvent.type(readOnly, "!");
    await expect(readOnly).toHaveValue("Read only");
  },
  parameters: {
    docs: {
      description: {
        story:
          "Every state of the field, side by side:\n\n- `hasError` — a red border\n- `hasWarning` — an orange border\n- `isDisabled` — a grey box that ignores input\n- `isReadOnly` — blocks typing without changing the look\n- `withBorder={false}` — the bare text, for inline use",
      },
      source: {
        code: `<TextInput value="Normal" />
<TextInput value="Error state" hasError />
<TextInput value="Warning state" hasWarning />
<TextInput value="Disabled" isDisabled />
<TextInput value="Read only" isReadOnly />
<TextInput value="No border" withBorder={false} />`,
      },
    },
  },
};

const fullNumberMask = [
  "+",
  /\d/,
  " ",
  "(",
  /\d/,
  /\d/,
  /\d/,
  ")",
  " ",
  /\d/,
  /\d/,
  /\d/,
  "-",
  /\d/,
  /\d/,
  /\d/,
  /\d/,
];

const phoneOrExtensionMask = (value: string) =>
  value.startsWith("+") ? fullNumberMask : [/\d/, /\d/, /\d/, /\d/];

const WithMaskTemplate = () => {
  return (
    <Wrapper>
      <ControlledInput
        mask={[/\d/, /\d/, "/", /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/]}
        placeholder="DD/MM/YYYY"
        guide
        keepCharPositions
      />
      <ControlledInput
        mask={[
          "+",
          /\d/,
          " ",
          "(",
          /\d/,
          /\d/,
          /\d/,
          ")",
          " ",
          /\d/,
          /\d/,
          /\d/,
          "-",
          /\d/,
          /\d/,
          /\d/,
          /\d/,
        ]}
        placeholder="+1 (___) ___-____"
        guide
      />
      <ControlledInput
        mask={phoneOrExtensionMask}
        placeholder="Extension, or + for a full number"
      />
    </Wrapper>
  );
};

export const WithMask: Story = {
  name: "Masks",
  render: () => <WithMaskTemplate />,
  play: async ({ canvas, userEvent }) => {
    // The mask inserts the separators itself.
    const date = canvas.getByPlaceholderText("DD/MM/YYYY");
    await userEvent.type(date, "25122024");
    await expect(date).toHaveValue("25/12/2024");

    // keepCharPositions: a digit typed into a filled slot is refused rather
    // than shifting the rest, and a deleted one leaves its slot empty.
    await userEvent.type(date, "1", {
      initialSelectionStart: 0,
      initialSelectionEnd: 0,
    });
    await expect(date).toHaveValue("25/12/2024");
    await userEvent.type(date, "{Backspace}", {
      initialSelectionStart: 1,
      initialSelectionEnd: 1,
    });
    await expect(date).toHaveValue("_5/12/2024");

    const phone = canvas.getByPlaceholderText("+1 (___) ___-____");
    await userEvent.type(phone, "15551234567");
    await expect(phone).toHaveValue("+1 (555) 123-4567");

    // A mask function picks the pattern from the value as it is typed.
    const flexible = canvas.getByPlaceholderText(
      "Extension, or + for a full number",
    );
    await userEvent.type(flexible, "12345");
    await expect(flexible).toHaveValue("1234");
    await userEvent.clear(flexible);
    await userEvent.type(flexible, "+15551234567");
    await expect(flexible).toHaveValue("+1 (555) 123-4567");
  },
  parameters: {
    docs: {
      description: {
        story:
          "Fields for values of one fixed shape (`mask`), which insert the separators and refuse what does not fit.\n\n- **Date** and **phone** show the whole pattern up front (`guide`)\n- **Extension or number** picks its pattern from the value: a digit starts an extension, a `+` the full number",
      },
      source: {
        code: `// Date mask
<TextInput
  mask={[/\\d/, /\\d/, "/", /\\d/, /\\d/, "/", /\\d/, /\\d/, /\\d/, /\\d/]}
  placeholder="DD/MM/YYYY"
  guide
  keepCharPositions
/>

// Phone mask
<TextInput
  mask={["+", /\\d/, " ", "(", /\\d/, /\\d/, /\\d/, ")", " ", /\\d/, /\\d/, /\\d/, "-", /\\d/, /\\d/, /\\d/, /\\d/]}
  placeholder="+1 (___) ___-____"
  guide
/>

// Mask chosen from the value
const phoneOrExtensionMask = (value: string) =>
  value.startsWith("+")
    ? ["+", /\\d/, " ", "(", /\\d/, /\\d/, /\\d/, ")", " ", /\\d/, /\\d/, /\\d/, "-", /\\d/, /\\d/, /\\d/, /\\d/]
    : [/\\d/, /\\d/, /\\d/, /\\d/];

<TextInput mask={phoneOrExtensionMask} placeholder="Extension, or + for a full number" />`,
      },
    },
  },
};

const ScaledTemplate = () => {
  return (
    <div style={{ display: "grid", gridGap: "16px" }}>
      <ControlledInput scale initialValue="Scaled base" size={InputSize.base} />
      <ControlledInput
        scale
        initialValue="Scaled middle"
        size={InputSize.middle}
      />
      <ControlledInput
        scale
        initialValue="Scaled large"
        size={InputSize.large}
      />
    </div>
  );
};

export const ScaledInputs: Story = {
  name: "Full width",
  render: () => <ScaledTemplate />,
  play: async ({ canvas }) => {
    for (const value of ["Scaled base", "Scaled middle", "Scaled large"]) {
      const input = canvas.getByDisplayValue(value);
      const column = input.closest("div[style]") as HTMLElement;
      await expect(Math.round(rect(input).width)).toBe(
        Math.round(rect(column).width),
      );
    }
  },
  parameters: {
    docs: {
      description: {
        story:
          "Fields that fill their column instead of a fixed width, for form grids and side panels (`scale`). Font size and padding still follow `size`.",
      },
      source: {
        code: `<TextInput scale size={InputSize.base} value="Scaled base" />
<TextInput scale size={InputSize.middle} value="Scaled middle" />
<TextInput scale size={InputSize.large} value="Scaled large" />`,
      },
    },
  },
};

const BoldTemplate = () => {
  return (
    <Wrapper>
      <ControlledInput initialValue="Normal weight" />
      <ControlledInput initialValue="Bold weight" isBold />
      <ControlledInput initialValue="Weight 700" fontWeight={700} />
    </Wrapper>
  );
};

export const BoldText: Story = {
  name: "Bold text",
  render: () => <BoldTemplate />,
  play: async ({ canvas }) => {
    const weight = (value: string) =>
      Number(getComputedStyle(canvas.getByDisplayValue(value)).fontWeight);
    await expect(weight("Bold weight")).toBeGreaterThan(
      weight("Normal weight"),
    );
    await expect(weight("Weight 700")).toBe(700);
  },
  parameters: {
    docs: {
      description: {
        story:
          "Emphasize a value with `isBold` (600) or pass any `fontWeight`; the middle size is already 600, so `isBold` changes nothing there.",
      },
      source: {
        code: `<TextInput value="Normal weight" />
<TextInput value="Bold weight" isBold />
<TextInput value="Weight 700" fontWeight={700} />`,
      },
    },
  },
};

export const AutoFocused: Story = {
  name: "Focused on mount",
  render: () => (
    <WhenVisible>
      <ControlledInput
        isAutoFocussed
        placeholder="Focused as soon as it mounts"
      />
    </WhenVisible>
  ),
  play: async ({ canvas }) => {
    await waitFor(() =>
      expect(
        canvas.getByPlaceholderText("Focused as soon as it mounts"),
      ).toHaveFocus(),
    );
  },
  parameters: {
    noPadding: true,
    docs: {
      // Framed on Docs: an inline autofocus would pull the page's focus to this field on load.
      story: { inline: false, height: "58px" },
      description: {
        story:
          "A field with the caret in it from the moment it appears (`isAutoFocussed`), for a dialog or a panel whose first action is typing.",
      },
      source: {
        code: `<TextInput
  type={InputType.text}
  value={value}
  onChange={(e) => setValue(e.target.value)}
  isAutoFocussed
  placeholder="Focused as soon as it mounts"
/>`,
      },
    },
  },
};

const RightToLeftTemplate = () => {
  return (
    <div dir="rtl" style={{ display: "grid", gap: "16px", width: "300px" }}>
      <ControlledInput placeholder="أدخل النص" />
      <ControlledInput type={InputType.tel} placeholder="+1 (___) ___-____" />
    </div>
  );
};

// Framed on Docs: the theme provider stamps data-dir on <html>, which would flip the whole page.
export const RightToLeft: Story = {
  name: "Right to left",
  render: () => <RightToLeftTemplate />,
  globals: { direction: "rtl" },
  play: async ({ canvas }) => {
    // The text field follows its content; the phone field stays
    // left-to-right so a number reads the same.
    const [text, tel] = canvas.getAllByRole("textbox");
    await expect(text).toHaveAttribute("dir", "auto");
    await expect(getComputedStyle(text).direction).toBe("rtl");
    await expect(tel).toHaveAttribute("type", "tel");
    await expect(getComputedStyle(tel, "::placeholder").direction).toBe("ltr");
  },
  parameters: {
    noPadding: true,
    docs: {
      story: { inline: false, height: "106px" },
      description: {
        story:
          'Two fields in a right-to-left interface, with the placeholder at the right edge. Text in a right-to-left script runs right to left, Latin text left to right (`dir="auto"`). The tel field keeps its placeholder left-to-right, so a phone number reads as usual.',
      },
      source: {
        code: `<div dir="rtl">
  <TextInput type={InputType.text} value={value} onChange={handleChange} placeholder="أدخل النص" />
  <TextInput type={InputType.tel} value={phone} onChange={handlePhone} placeholder="+1 (___) ___-____" />
</div>`,
      },
    },
  },
};

export const CssCustomization: Story = {
  name: "CSS customization",
  play: async ({ canvas }) => {
    await expect(canvas.getByDisplayValue("Custom styled input")).toHaveStyle({
      backgroundColor: "rgb(245, 243, 255)",
      borderTopColor: "rgb(196, 181, 253)",
      borderRadius: "8px",
      fontSize: "14px",
      color: "rgb(76, 29, 149)",
    });
    await expect(
      getComputedStyle(
        canvas.getByPlaceholderText("Placeholder text"),
        "::placeholder",
      ).color,
    ).toBe("rgb(139, 92, 246)");
    // The disabled fill is an inset shadow, not the background.
    await expect(
      getComputedStyle(canvas.getByDisplayValue("Disabled")).boxShadow,
    ).toContain("rgb(221, 214, 254)");
  },
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
          "--text-input-border-focus": "#4c1d95",
          "--text-input-font-size": "14px",
          "--text-input-radius": "8px",
          "--text-input-color": "#4c1d95",
          "--text-input-disabled-bg": "#ddd6fe",
        } as CSSProperties
      }
    >
      <TextInput
        type={InputType.text}
        value="Custom styled input"
        onChange={() => {}}
      />
      <TextInput
        type={InputType.text}
        value=""
        placeholder="Placeholder text"
        style={{ "--text-input-placeholder-color": "#8b5cf6" } as CSSProperties}
        onChange={() => {}}
      />
      <TextInput
        type={InputType.text}
        value="Disabled"
        isDisabled
        onChange={() => {}}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `Three fields restyled through CSS variables:

- **First** — the shared \`--text-input-*\` variables, set on a wrapper
- **Second** — \`--text-input-placeholder-color\` in its own \`style\`, the only place it works
- **Third** — disabled: only the radius, the font size and \`--text-input-disabled-bg\` still apply`,
      },
      source: {
        code: `<div
  style={
    {
      "--text-input-bg": "#f5f3ff",
      "--text-input-border-color": "#c4b5fd",
      "--text-input-border-hover": "#7c3aed",
      "--text-input-border-focus": "#4c1d95",
      "--text-input-font-size": "14px",
      "--text-input-radius": "8px",
      "--text-input-color": "#4c1d95",
      "--text-input-disabled-bg": "#ddd6fe",
    } as CSSProperties
  }
>
  <TextInput type={InputType.text} value="Custom styled input" onChange={() => {}} />
  <TextInput
    type={InputType.text}
    value=""
    placeholder="Placeholder text"
    style={{ "--text-input-placeholder-color": "#8b5cf6" } as CSSProperties}
    onChange={() => {}}
  />
  <TextInput type={InputType.text} value="Disabled" isDisabled onChange={() => {}} />
</div>`,
      },
    },
  },
};
