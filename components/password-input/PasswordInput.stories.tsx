import type React from "react";
import type { CSSProperties, ComponentProps } from "react";
import { useState, useEffect } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen, waitFor, within } from "storybook/test";

import { InputSize } from "../text-input";

import { PasswordInput } from ".";
import type { PasswordInputProps } from "./PasswordInput.types";

const meta = {
  title: "UI/Form controls/PasswordInput",
  component: PasswordInput,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
  },
  argTypes: {
    size: {
      control: "select",
      options: Object.values(InputSize),
      description: "Height and font size of the field",
      table: {
        defaultValue: { summary: "middle" },
      },
    },
    simpleView: {
      control: "boolean",
      description:
        "Strips the component down to the field and the eye button: no tooltip, no generator link and no rule checking",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isDisabled: {
      control: "boolean",
      description:
        "Greys the field out, blocks typing and generation, drops the tooltip and hides the characters again",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isDisableTooltip: {
      control: "boolean",
      description: "Never shows the rules tooltip",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    maxLength: {
      control: "number",
      description: "Maximum number of characters the field accepts",
    },
    inputWidth: {
      control: "text",
      description:
        "Width of the field as a CSS length; left out, the field fills its container",
    },
    scale: {
      control: "boolean",
      description: "Stretches the field to the full width of its container",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    inputValue: {
      control: "text",
      description:
        "Value the field starts with; the component keeps its own value from then on and only follows a later change to an empty string",
    },
    inputName: {
      control: "text",
      description:
        "`name` of the field, also used to find the field for the tooltip when no `id` is given, so two fields on one page need distinct names or ids",
      table: {
        defaultValue: { summary: "passwordInput" },
      },
    },
    id: {
      control: "text",
      description:
        "`id` of the field's wrapper, used to find the field for the tooltip",
    },
    placeholder: {
      control: "text",
      description: "Hint shown in the empty field",
    },
    inputType: {
      control: "radio",
      options: ["password", "text"],
      description:
        "Whether the field starts with its characters shown (`text`) or hidden (`password`); the eye button toggles it from then on",
      table: {
        defaultValue: { summary: "password" },
      },
    },
    passwordSettings: {
      control: "object",
      description:
        "The rules the checker and the generator use: minimum length, and whether capitals, digits and special characters are required",
      table: {
        defaultValue: { summary: "{ minLength: 8 }" },
      },
    },
    hasError: {
      control: "boolean",
      description:
        "Draws the field with a red error border, and the rules tooltip opens on every change",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    hasWarning: {
      control: "boolean",
      description:
        "Draws the field with a warning border, and the rules tooltip opens on every change",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    tooltipPasswordTitle: {
      control: "text",
      description: "Heading of the rules tooltip",
    },
    tooltipPasswordLength: {
      control: "text",
      description:
        "Tooltip line for the minimum length rule, including the number",
    },
    tooltipPasswordDigits: {
      control: "text",
      description:
        "Tooltip line for the digits rule, shown when digits are required",
    },
    tooltipPasswordCapital: {
      control: "text",
      description:
        "Tooltip line for the capital letters rule, shown when capitals are required",
    },
    tooltipPasswordSpecial: {
      control: "text",
      description:
        "Tooltip line for the special characters rule, shown when they are required",
    },
    tooltipAllowedCharacters: {
      control: "text",
      description: "Extra text shown in the tooltip after the rules",
    },
    generatePasswordTitle: {
      control: "text",
      description:
        "Text of a link at the bottom of the tooltip that fills the field with a random password meeting the rules; left out, no link is shown",
    },
    generatorSpecial: {
      control: "text",
      description: "Characters the generator may pick special characters from",
      table: {
        defaultValue: { summary: "!@#$%^&*" },
      },
    },
    isFullWidth: {
      control: "boolean",
      description:
        "Makes the component a full-width block instead of a row that shrinks to the field",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isSimulateType: {
      control: false,
      description:
        "Draws each character as `simulateSymbol` in a plain text field while keeping the real value; the field's `id` must be `conversion-password`",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    simulateSymbol: {
      control: "text",
      description: "Character drawn for each real one under `isSimulateType`",
      table: {
        defaultValue: { summary: "•" },
      },
    },
    autoComplete: {
      control: "text",
      description: "`autocomplete` attribute of the field",
      table: {
        defaultValue: { summary: "new-password" },
      },
    },
    tabIndex: {
      control: "number",
      description: "Position of the field in the Tab order",
    },
    isAutoFocussed: {
      control: "boolean",
      description: "Focuses the field when it mounts",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    onChange: {
      action: "onChange",
      description:
        "Called on every change with the DOM event and the stored value; read the second argument, since a generated password arrives without a real event",
    },
    onValidateInput: {
      action: "onValidateInput",
      description:
        "Called after every change with whether all rules pass and with each rule's own result; never called in `simpleView`",
    },
    sanitizeValue: {
      control: false,
      description:
        "Function run on every change before the value is stored, such as one that strips spaces",
    },
    onBlur: {
      action: "onBlur",
      description: "Called when the field loses focus",
    },
    onKeyDown: {
      action: "onKeyDown",
      description: "Called on every key press in the field",
    },
    emailInputName: {
      control: false,
      description: "Ignored: it feeds a copy button that is not rendered",
    },
    clipActionResource: {
      control: false,
      description: "Ignored: it feeds a copy button that is not rendered",
    },
    clipCopiedResource: {
      control: false,
      description: "Ignored: it feeds a copy button that is not rendered",
    },
  },
} satisfies Meta<typeof PasswordInput>;

type Story = StoryObj<ComponentProps<typeof PasswordInput>>;

export default meta;

const Wrapper = (props: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gridGap: "24px",
        alignItems: "start",
      }}
    >
      {props.children}
    </div>
  );
};

const basePasswordSettings = {
  minLength: 6,
  upperCase: true,
  digits: true,
  specSymbols: true,
  digitsRegexStr: "(?=.*\\d)",
  upperCaseRegexStr: "(?=.*[A-Z])",
  specSymbolsRegexStr: "(?=.*[\\x21-\\x2F\\x3A-\\x40\\x5B-\\x60\\x7B-\\x7E])",
};

const baseTooltipProps = {
  tooltipPasswordTitle: "Password must contain:",
  tooltipPasswordLength: "minimum length: ",
  tooltipPasswordDigits: "digits",
  tooltipPasswordCapital: "capital letters",
  tooltipPasswordSpecial: "special characters (!@#$%^&*)",
  generatorSpecial: "!@#$%^&*",
};

// The eye's block is marked password_eye--close while the value is hidden and
// password_eye--open while it shows.
const toggleEye = async (
  field: HTMLElement,
  userEvent: { click: (element: Element) => Promise<void> },
) => {
  const block = field
    .closest("[data-testid='input-block']")
    ?.querySelector("[class*='password_eye--']") as HTMLElement;
  await userEvent.click(within(block).getByTestId("icon-button"));
};

const PasswordInputTemplate = ({
  passwordSettings,
  onChange,
  onValidateInput,
  ...args
}: PasswordInputProps) => {
  const [value, setValue] = useState("");
  const [settings, setSettings] = useState(passwordSettings);

  useEffect(() => {
    setSettings(passwordSettings);
    setValue("");
  }, [passwordSettings]);

  return (
    <div style={{ height: "110px", width: "320px" }}>
      <PasswordInput
        size={InputSize.base}
        {...args}
        scale
        inputValue={value}
        onChange={(e, v) => {
          setValue(v ?? "");
          onChange?.(e, v);
        }}
        tooltipPasswordLength={`${args.tooltipPasswordLength}${passwordSettings?.minLength}`}
        passwordSettings={settings}
        onValidateInput={onValidateInput}
      />
    </div>
  );
};

export const Default: Story = {
  render: (args) => <PasswordInputTemplate {...args} />,
  args: {
    isDisabled: false,
    passwordSettings: basePasswordSettings,
    simpleView: false,
    inputName: "demoPasswordInput-default",
    isDisableTooltip: false,
    ...baseTooltipProps,
    placeholder: "password",
    maxLength: 30,
    size: InputSize.base,
    onChange: fn(),
    onValidateInput: fn(),
  },
  play: async ({ args, canvas, userEvent }) => {
    const field = canvas.getByPlaceholderText("password");
    await expect(field).toHaveAttribute("type", "password");

    // Each change reports whether every rule passes, and each rule's result.
    await userEvent.type(field, "abc");
    await expect(args.onValidateInput).toHaveBeenLastCalledWith(
      false,
      expect.objectContaining({ length: false }),
    );
    await userEvent.clear(field);
    await userEvent.type(field, "Abc12!");
    await expect(args.onValidateInput).toHaveBeenLastCalledWith(
      true,
      expect.objectContaining({
        length: true,
        digits: true,
        capital: true,
        special: true,
      }),
    );
    await expect(field).toHaveValue("Abc12!");

    // The eye shows the value and hides it again.
    await toggleEye(field, userEvent);
    await expect(field).toHaveAttribute("type", "text");
    await toggleEye(field, userEvent);
    await expect(field).toHaveAttribute("type", "password");
  },
  parameters: {
    docs: {
      description: {
        story:
          "The field as a sign-up form uses it: type a character to open the rules tooltip and watch each rule turn green as the value meets it; change any other prop live in the Controls panel below.",
      },
      source: {
        code: `<PasswordInput
  inputValue={value}
  onChange={(e, value) => setValue(value ?? "")}
  onValidateInput={(isValid, rules) => setCanSubmit(isValid)}
  passwordSettings={{
    minLength: 6,
    upperCase: true,
    digits: true,
    specSymbols: true,
  }}
  tooltipPasswordTitle="Password must contain:"
  tooltipPasswordLength="minimum length: 6"
  tooltipPasswordDigits="digits"
  tooltipPasswordCapital="capital letters"
  tooltipPasswordSpecial="special characters (!@#$%^&*)"
  placeholder="password"
  maxLength={30}
  size={InputSize.base}
/>`,
      },
    },
  },
};

const SimpleViewTemplate = () => {
  const [value, setValue] = useState("");

  return (
    <div style={{ width: "320px" }}>
      <PasswordInput
        simpleView
        inputValue={value}
        onChange={(e) => setValue(e.currentTarget?.value)}
        inputName="simple-view-demo"
        placeholder="Enter password"
        passwordSettings={basePasswordSettings}
        scale
      />
    </div>
  );
};

export const SimpleView: Story = {
  render: () => <SimpleViewTemplate />,
  play: async ({ canvas, userEvent }) => {
    const field = canvas.getByPlaceholderText("Enter password");
    await userEvent.type(field, "x");
    await toggleEye(field, userEvent);
    await expect(field).toHaveAttribute("type", "text");
  },
  parameters: {
    docs: {
      description: {
        story:
          "A sign-in form only needs the field and the eye button: the simple view drops the rules tooltip and skips rule checking, so the field accepts any value (`simpleView`).",
      },
      source: {
        code: `<PasswordInput
  simpleView
  inputValue={value}
  onChange={handleChange}
  placeholder="Enter password"
/>`,
      },
    },
  },
};

const StatesTemplate = () => {
  return (
    <Wrapper>
      <PasswordInputTemplate
        passwordSettings={basePasswordSettings}
        inputName="state-normal"
        placeholder="Normal"
        {...baseTooltipProps}
      />
      <PasswordInputTemplate
        passwordSettings={basePasswordSettings}
        inputName="state-disabled"
        isDisabled
        placeholder="Disabled"
        {...baseTooltipProps}
      />
      <PasswordInputTemplate
        passwordSettings={basePasswordSettings}
        inputName="state-error"
        hasError
        placeholder="With error"
        {...baseTooltipProps}
      />
    </Wrapper>
  );
};

export const States: Story = {
  render: () => <StatesTemplate />,
  play: async ({ canvas }) => {
    await expect(canvas.getByPlaceholderText("Disabled")).toBeDisabled();
    await expect(canvas.getByPlaceholderText("Normal")).toBeEnabled();
  },
  parameters: {
    docs: {
      description: {
        story:
          "Three fields a form may need side by side: **Normal**, ready for input; **Disabled**, greyed out with typing blocked and no tooltip (`isDisabled`); **With error**, drawn with a red border to flag a value the form rejected (`hasError`).",
      },
      source: {
        code: `<PasswordInput placeholder="Normal" passwordSettings={settings} />
<PasswordInput placeholder="Disabled" isDisabled passwordSettings={settings} />
<PasswordInput placeholder="With error" hasError passwordSettings={settings} />`,
      },
    },
  },
};

const CustomRulesTemplate = () => {
  const [value, setValue] = useState("");

  return (
    <div style={{ height: "110px", width: "320px" }}>
      <PasswordInput
        inputValue={value}
        onChange={(e) => setValue(e.currentTarget?.value)}
        inputName="custom-rules-demo"
        placeholder="Min 8 chars, uppercase & digits"
        passwordSettings={{
          ...basePasswordSettings,
          minLength: 8,
          specSymbols: false,
        }}
        tooltipPasswordTitle="Password must contain:"
        tooltipPasswordLength="minimum length: 8"
        tooltipPasswordDigits="digits"
        tooltipPasswordCapital="capital letters"
        scale
      />
    </div>
  );
};

export const CustomValidation: Story = {
  render: () => <CustomRulesTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "A policy that asks for less: type into the field and the tooltip lists only a minimum length of 8, capital letters and digits, because special characters are switched off (`passwordSettings`).",
      },
      source: {
        code: `<PasswordInput
  passwordSettings={{
    minLength: 8,
    upperCase: true,
    digits: true,
    specSymbols: false,
  }}
  tooltipPasswordTitle="Password must contain:"
  tooltipPasswordLength="minimum length: 8"
  tooltipPasswordDigits="digits"
  tooltipPasswordCapital="capital letters"
/>`,
      },
    },
  },
};

const SizesTemplate = () => {
  return (
    <Wrapper>
      <PasswordInputTemplate
        passwordSettings={basePasswordSettings}
        inputName="size-base"
        size={InputSize.base}
        placeholder="Base size"
        simpleView
        {...baseTooltipProps}
      />
      <PasswordInputTemplate
        passwordSettings={basePasswordSettings}
        inputName="size-middle"
        size={InputSize.middle}
        placeholder="Middle size"
        simpleView
        {...baseTooltipProps}
      />
      <PasswordInputTemplate
        passwordSettings={basePasswordSettings}
        inputName="size-large"
        size={InputSize.large}
        placeholder="Large size"
        simpleView
        {...baseTooltipProps}
      />
    </Wrapper>
  );
};

export const Sizes: Story = {
  render: () => <SizesTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Pick the height that matches the other fields of the form: base, middle and large (`size`).",
      },
      source: {
        code: `<PasswordInput size={InputSize.base} placeholder="Base size" simpleView />
<PasswordInput size={InputSize.middle} placeholder="Middle size" simpleView />
<PasswordInput size={InputSize.large} placeholder="Large size" simpleView />`,
      },
    },
  },
};

const GeneratorTemplate = () => {
  const [value, setValue] = useState("");

  return (
    <div style={{ height: "110px", width: "320px" }}>
      <PasswordInput
        inputValue={value}
        onChange={(e, v) => setValue(v ?? "")}
        inputName="generator-demo"
        placeholder="Type a character"
        passwordSettings={basePasswordSettings}
        {...baseTooltipProps}
        tooltipPasswordLength="minimum length: 6"
        generatePasswordTitle="Generate password"
        scale
      />
    </div>
  );
};

export const WithPasswordGenerator: Story = {
  render: () => <GeneratorTemplate />,
  play: async ({ canvas, userEvent }) => {
    const field = canvas.getByPlaceholderText("Type a character");
    // A character opens the rules tooltip, where the generator link sits.
    await userEvent.type(field, "a");
    const generate = await screen.findByTestId("generate_password_link");
    await userEvent.click(generate);

    // A password that passes every rule, shown rather than masked.
    await waitFor(() => expect(field).toHaveAttribute("type", "text"));
    const value = (field as HTMLInputElement).value;
    await expect(value.length).toBeGreaterThanOrEqual(6);
    await expect(value).toMatch(/[A-Z]/);
    await expect(value).toMatch(/\d/);
    await expect(value).toMatch(/[!@#$%^&*]/);
  },
  parameters: {
    docs: {
      description: {
        story:
          "Saves the user from inventing a password that meets every rule: type a character to open the tooltip, then click **Generate password** at its bottom; the field fills with a random password that passes all rules and shows its characters (`generatePasswordTitle`, symbols picked from `generatorSpecial`).",
      },
      source: {
        code: `<PasswordInput
  inputValue={value}
  onChange={(e, value) => setValue(value ?? "")}
  passwordSettings={settings}
  tooltipPasswordTitle="Password must contain:"
  tooltipPasswordLength="minimum length: 6"
  tooltipPasswordDigits="digits"
  tooltipPasswordCapital="capital letters"
  tooltipPasswordSpecial="special characters (!@#$%^&*)"
  generatorSpecial="!@#$%^&*"
  generatePasswordTitle="Generate password"
/>`,
      },
    },
  },
};

const RightToLeftTemplate = () => {
  const [value, setValue] = useState("Passw0rd!");

  return (
    <div dir="rtl" style={{ width: "320px" }}>
      <PasswordInput
        simpleView
        inputValue={value}
        onChange={(e, v) => setValue(v ?? "")}
        inputName="rtl-demo"
        placeholder="كلمة المرور"
        scale
      />
    </div>
  );
};

export const RightToLeft: Story = {
  render: () => <RightToLeftTemplate />,
  globals: { direction: "rtl" },
  parameters: {
    noPadding: true,
    docs: {
      // Framed: an inline RTL story would flip the whole Docs page.
      story: { inline: false, height: "58px" },
      description: {
        story:
          'The field in a right-to-left layout: the hidden characters line up from the right edge and the eye button moves to the left end. The wrapper carries `dir="rtl"`; the direction also comes from the theme\'s `interfaceDirection` (the Direction toolbar).',
      },
      source: {
        code: `<div dir="rtl">
  <PasswordInput
    simpleView
    inputValue={value}
    onChange={(e, value) => setValue(value ?? "")}
    placeholder="كلمة المرور"
  />
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
          width: "320px",
          "--text-input-bg": "#f5f3ff",
          "--text-input-border-color": "#7c3aed",
          "--text-input-color": "#4c1d95",
          "--text-input-radius": "8px",
          "--text-input-border-hover": "#a78bfa",
          "--text-input-border-focus": "#2e1065",
        } as CSSProperties
      }
    >
      <PasswordInput
        inputValue="Passw0rd!"
        onChange={() => {}}
        inputName="css-custom-demo"
        placeholder="Custom styled password"
        passwordSettings={basePasswordSettings}
        {...baseTooltipProps}
        scale
        size={InputSize.base}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `The input variables set on one wrapper -- the variables are listed under CSS variables on this page. The example sets every variable but the tooltip width, which a wrapper cannot reach; hover and focus the field to see the border colors.`,
      },
    },
  },
};
