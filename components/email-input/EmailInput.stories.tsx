import type React from "react";
import type { CSSProperties, ComponentProps } from "react";
import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";

import { EmailSettings } from "../../utils/email";
import { InputSize } from "../text-input";

import { EmailInput } from ".";
import type { TValidate } from "./EmailInput.types";

const meta = {
  title: "UI/Form controls/EmailInput",
  component: EmailInput,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
  },
  argTypes: {
    size: {
      control: "select",
      options: Object.values(InputSize),
      description:
        "Height, padding and font size of the field: base and middle are 13px text, large is 16px",
      table: {
        defaultValue: { summary: "base" },
      },
    },
    isDisabled: {
      control: "boolean",
      description:
        "Greys the field out and makes it unusable: no typing, no focus from the keyboard",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isReadOnly: {
      control: "boolean",
      description: "Keeps the value visible and focusable but refuses edits",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    hasError: {
      control: "boolean",
      description:
        "Decides the red error border itself. Left out, the border turns red as soon as a non-empty value fails the check; passed at all, even as false, only this value counts",
      table: {
        defaultValue: { summary: "undefined (automatic)" },
      },
    },
    scale: {
      control: "boolean",
      description: "Stretches the field to the full width of its container",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    placeholder: {
      control: "text",
      description: "Hint shown in the empty field",
    },
    value: {
      control: "text",
      description:
        "Address shown in the field; a new value is validated as soon as it arrives",
    },
    emailSettings: {
      control: false,
      description:
        "Options for the built-in parser: which forms of address to accept, such as a display name, punycode or an IP-address domain",
    },
    customValidate: {
      control: false,
      description:
        "Function that replaces the built-in parser and `emailSettings` outright; it returns `{ value, isValid, errors }` and `isValid` decides the error border",
    },
    onValidateInput: {
      action: "onValidateInput",
      description:
        "Called after every keystroke with the result of the check, whichever parser ran",
    },
    onChange: {
      action: "onChange",
      description: "Called with the change event on every keystroke",
    },
    onBlur: {
      action: "onBlur",
      description: "Called when the field loses focus",
    },
    handleAnimationStart: {
      action: "handleAnimationStart",
      description:
        "Called on the field's native animationstart, which is how a page notices the browser autofilling it, since autofill fires no change event",
    },
    autoComplete: {
      control: "text",
      description:
        "HTML autocomplete value; the default asks the browser to offer saved email addresses",
      table: {
        defaultValue: { summary: "email" },
      },
    },
    isAutoFocussed: {
      control: "boolean",
      description:
        "Focuses the field when it first renders; ignored on iOS phones and tablets, where the on-screen keyboard would cover the form",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    hasWarning: {
      control: "boolean",
      description:
        "Gives the field the warning border instead of the normal one",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    dataTestId: {
      control: "text",
      description: "`data-testid` of the field",
      table: {
        defaultValue: { summary: "email-input" },
      },
    },
  },
} satisfies Meta<typeof EmailInput>;

type Story = StoryObj<ComponentProps<typeof EmailInput>>;

export default meta;

const Wrapper = (props: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gridGap: "16px",
        alignItems: "start",
      }}
    >
      {props.children}
    </div>
  );
};

const defaultSettings = EmailSettings.parse({
  allowDomainPunycode: false,
  allowLocalPartPunycode: false,
  allowDomainIp: false,
  allowStrictLocalPart: true,
  allowSpaces: false,
  allowName: false,
  allowLocalDomainName: false,
});

const EmailInputWithValidation = (props: {
  initialValue?: string;
  size?: InputSize;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  hasError?: boolean;
  scale?: boolean;
  placeholder?: string;
  customValidate?: (value: string) => TValidate;
}) => {
  const {
    initialValue = "",
    size = InputSize.base,
    placeholder = "Enter email address",
    ...rest
  } = props;
  const [value, setValue] = useState(initialValue);
  const [validationState, setValidationState] = useState<TValidate>();

  return (
    <div>
      <EmailInput
        placeholder={placeholder}
        value={value}
        emailSettings={defaultSettings}
        onChange={(e) => setValue(e.target.value)}
        onValidateInput={(data) => setValidationState(data)}
        size={size}
        {...rest}
      />
      {validationState ? (
        <div style={{ marginTop: "8px", fontSize: "12px" }}>
          <div>Valid: {validationState.isValid ? "Yes" : "No"}</div>
          {(validationState.errors ?? []).length > 0 ? (
            <div>Errors: {validationState.errors?.join(", ")}</div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

// The field carries data-error="true" while it shows the red border.
const hasRedBorder = (field: HTMLElement) =>
  field.getAttribute("data-error") === "true";

export const Default: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const field = canvas.getByPlaceholderText("Enter email address");
    await userEvent.type(field, "user@");
    await expect(hasRedBorder(field)).toBe(true);
    await userEvent.type(field, "example.com");
    await expect(hasRedBorder(field)).toBe(false);
    await expect(args.onChange).toHaveBeenCalled();
  },
  render: (args) => {
    const [value, setValue] = useState(args.value || "");

    return (
      <div style={{ width: "320px" }}>
        <EmailInput
          {...args}
          value={value}
          emailSettings={defaultSettings}
          onChange={(e) => {
            setValue(e.target.value);
            args.onChange?.(e);
          }}
        />
      </div>
    );
  },
  args: {
    placeholder: "Enter email address",
    size: InputSize.base,
    isDisabled: false,
    isReadOnly: false,
    scale: false,
    value: "",
    onChange: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          "An empty field that checks the address as you type: an incomplete one turns the border red, a complete one clears it (`hasError` left out). Change any other prop live in the Controls panel below.",
      },
      source: {
        code: `<EmailInput
  value={value}
  emailSettings={settings}
  onChange={(e) => setValue(e.target.value)}
  placeholder="Enter email address"
/>`,
      },
    },
  },
};

const SizesTemplate = () => {
  return (
    <Wrapper>
      <EmailInputWithValidation size={InputSize.base} placeholder="Base size" />
      <EmailInputWithValidation
        size={InputSize.middle}
        placeholder="Middle size"
      />
      <EmailInputWithValidation
        size={InputSize.large}
        placeholder="Large size"
      />
    </Wrapper>
  );
};

export const Sizes: Story = {
  render: () => <SizesTemplate />,
  play: async ({ canvas }) => {
    const [base, middle, large] = [
      "Base size",
      "Middle size",
      "Large size",
    ].map((placeholder) => canvas.getByPlaceholderText(placeholder));
    await expect(
      [base, middle, large].map((input) =>
        Math.round(input.getBoundingClientRect().width),
      ),
    ).toEqual([173, 300, 550]);
    await expect(large).toHaveStyle({ fontSize: "16px" });
  },
  parameters: {
    docs: {
      description: {
        story:
          "Pick the height that matches the rest of the form: base and middle share 13px text, large grows to 16px (`size`). Type into any of them to see the result of the check under the field.",
      },
      source: {
        code: `<EmailInput size={InputSize.base} placeholder="Base size" />
<EmailInput size={InputSize.middle} placeholder="Middle size" />
<EmailInput size={InputSize.large} placeholder="Large size" />`,
      },
    },
  },
};

const StatesTemplate = () => {
  return (
    <Wrapper>
      <EmailInputWithValidation
        initialValue="user@example.com"
        placeholder="Normal"
      />
      <EmailInputWithValidation
        initialValue="disabled@example.com"
        isDisabled
      />
      <EmailInputWithValidation
        initialValue="readonly@example.com"
        isReadOnly
      />
      <EmailInputWithValidation initialValue="invalid-email" hasError />
    </Wrapper>
  );
};

export const States: Story = {
  render: () => <StatesTemplate />,
  play: async ({ canvas, userEvent }) => {
    await expect(
      canvas.getByDisplayValue("disabled@example.com"),
    ).toBeDisabled();

    const readOnly = canvas.getByDisplayValue("readonly@example.com");
    await userEvent.type(readOnly, "x");
    await expect(readOnly).toHaveValue("readonly@example.com");

    await expect(hasRedBorder(canvas.getByDisplayValue("invalid-email"))).toBe(
      true,
    );
    await expect(
      hasRedBorder(canvas.getByDisplayValue("user@example.com")),
    ).toBe(false);
  },
  parameters: {
    docs: {
      description: {
        story:
          "The field in each state a form puts it in: **user@example.com** is valid and plain; **disabled@example.com** is greyed out and cannot be focused (`isDisabled`); **readonly@example.com** can be focused and selected but not edited (`isReadOnly`); **invalid-email** has its red border forced on (`hasError`), which the check would also have done on its own.",
      },
      source: {
        code: `<EmailInput value="user@example.com" />
<EmailInput value="disabled@example.com" isDisabled />
<EmailInput value="readonly@example.com" isReadOnly />
<EmailInput value="invalid-email" hasError />`,
      },
    },
  },
};

const CustomValidationTemplate = () => {
  return (
    <div style={{ width: "320px" }}>
      <EmailInputWithValidation
        scale
        placeholder="Enter @custom-domain.com email"
        customValidate={(value) => ({
          value,
          isValid: value.endsWith("@custom-domain.com"),
          // An error key only for an address the rule rejects.
          errors:
            value && !value.endsWith("@custom-domain.com")
              ? ["DomainNotAllowed"]
              : [],
        })}
      />
    </div>
  );
};

export const WithCustomValidation: Story = {
  render: () => <CustomValidationTemplate />,
  play: async ({ canvas, userEvent }) => {
    const field = canvas.getByPlaceholderText("Enter @custom-domain.com email");

    await userEvent.type(field, "a@custom-domain.com");
    await expect(canvas.getByText("Valid: Yes")).toBeVisible();
    await expect(canvas.queryByText(/Errors:/)).toBeNull();
    await expect(hasRedBorder(field)).toBe(false);

    await userEvent.clear(field);
    await userEvent.type(field, "a@other.com");
    await expect(canvas.getByText("Valid: No")).toBeVisible();
    await expect(canvas.getByText("Errors: DomainNotAllowed")).toBeVisible();
    await expect(hasRedBorder(field)).toBe(true);
  },
  parameters: {
    docs: {
      description: {
        story:
          "Enforce a rule the parser does not know, such as a single allowed domain: the function replaces the parser outright and its `isValid` decides the red border (`customValidate`). Type an address that does not end with @custom-domain.com to see the field turn red and the returned error key appear under it.",
      },
      source: {
        code: `<EmailInput
  scale
  placeholder="Enter @custom-domain.com email"
  customValidate={(value) => ({
    value,
    isValid: value.endsWith("@custom-domain.com"),
    errors: value ? ["DomainNotAllowed"] : [],
  })}
/>`,
      },
    },
  },
};

const AutomaticErrorTemplate = () => {
  return (
    <Wrapper>
      <EmailInputWithValidation initialValue="name@example.com" />
      <EmailInputWithValidation initialValue="name@example" />
    </Wrapper>
  );
};

export const AutomaticErrorState: Story = {
  render: () => <AutomaticErrorTemplate />,
  play: async ({ canvas }) => {
    // With hasError left out, the check alone draws the border.
    await expect(
      hasRedBorder(canvas.getByDisplayValue("name@example.com")),
    ).toBe(false);
    await expect(hasRedBorder(canvas.getByDisplayValue("name@example"))).toBe(
      true,
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Without `hasError` the field decides for itself: **name@example.com** parses and stays plain, **name@example** has no top-level domain and is red from the start. Edit either one to watch the border follow the check.",
      },
      source: {
        code: `<EmailInput value="name@example.com" onChange={handleChange} />
<EmailInput value="name@example" onChange={handleChange} />`,
      },
    },
  },
};

const nameSettings = EmailSettings.parse({
  allowDomainPunycode: false,
  allowLocalPartPunycode: false,
  allowDomainIp: false,
  allowStrictLocalPart: true,
  allowSpaces: false,
  allowName: true,
  allowLocalDomainName: false,
});

const AcceptedAddressFormsTemplate = () => {
  const [strictValue, setStrictValue] = useState("Jane Doe <jane@example.com>");
  const [namedValue, setNamedValue] = useState("Jane Doe <jane@example.com>");

  return (
    <Wrapper>
      <EmailInput
        scale
        value={strictValue}
        emailSettings={defaultSettings}
        onChange={(e) => setStrictValue(e.target.value)}
      />
      <EmailInput
        scale
        value={namedValue}
        emailSettings={nameSettings}
        onChange={(e) => setNamedValue(e.target.value)}
      />
    </Wrapper>
  );
};

export const AcceptedAddressForms: Story = {
  render: () => <AcceptedAddressFormsTemplate />,
  play: async ({ canvas }) => {
    // The same "Name <address>" form: rejected by default, accepted with
    // allowName.
    const [strict, named] = canvas.getAllByDisplayValue(
      "Jane Doe <jane@example.com>",
    );
    await expect(hasRedBorder(strict)).toBe(true);
    await expect(hasRedBorder(named)).toBe(false);
  },
  parameters: {
    docs: {
      description: {
        story:
          "Decide which forms of address count as valid: the same address with a display name is refused by the first field and accepted by the second, which allows names (`emailSettings` with `allowName`). Punycode, IP-address domains, spaces and local domain names are switched the same way.",
      },
      source: {
        code: `const settings = EmailSettings.parse({ allowName: true });

<EmailInput
  value="Jane Doe <jane@example.com>"
  emailSettings={settings}
  onChange={handleChange}
/>`,
      },
    },
  },
};

const RightToLeftTemplate = () => {
  return (
    <div dir="rtl" style={{ display: "grid", gap: "16px", width: "300px" }}>
      <EmailInputWithValidation placeholder="name@example.com" />
      <EmailInputWithValidation initialValue="name@example.com" />
    </div>
  );
};

// Framed on Docs: the theme provider stamps data-dir on <html>, which would flip the whole page.
export const RightToLeft: Story = {
  render: () => <RightToLeftTemplate />,
  globals: { direction: "rtl" },
  play: async ({ canvas }) => {
    // Both fields align right; the address itself still reads left to right.
    const empty = canvas.getByPlaceholderText("name@example.com");
    const filled = canvas.getByDisplayValue("name@example.com");
    await expect(empty).toHaveStyle({ textAlign: "right" });
    await expect(filled).toHaveStyle({ textAlign: "right" });
    await expect(filled).toHaveAttribute("dir", "auto");
    await expect(getComputedStyle(filled).direction).toBe("ltr");
  },
  parameters: {
    noPadding: true,
    docs: {
      story: { inline: false, height: "106px" },
      description: {
        story:
          'Under a right-to-left interface both fields align to the right edge: the placeholder of the empty field and the address in the second one, which still reads left to right because an address is Latin text (`dir="auto"`). The direction comes from the theme\'s `interfaceDirection` (the Direction toolbar); the wrapper also carries `dir="rtl"` for the rules that read the DOM direction.',
      },
      source: {
        code: `<div dir="rtl">
  <EmailInput value={value} onChange={handleChange} placeholder="name@example.com" />
  <EmailInput value="name@example.com" onChange={handleChange} />
</div>`,
      },
    },
  },
};

export const CssCustomization: Story = {
  play: async ({ canvas }) => {
    const empty = canvas.getByPlaceholderText("Custom styled email");
    await expect(empty).toHaveStyle({
      backgroundColor: "rgb(245, 243, 255)",
      borderTopColor: "rgb(196, 181, 253)",
      borderRadius: "8px",
      fontSize: "14px",
      textAlign: "center",
    });
    // hasError takes the theme's red over the custom border.
    const withValue = canvas.getByDisplayValue("user@example.com");
    await expect(withValue).toHaveStyle({ color: "rgb(76, 29, 149)" });
    await expect(getComputedStyle(withValue).borderTopColor).not.toBe(
      "rgb(196, 181, 253)",
    );
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
          "--text-input-color": "#4c1d95",
          "--text-input-radius": "8px",
          "--text-input-font-size": "14px",
          "--email-input-align": "center",
        } as CSSProperties
      }
    >
      <EmailInput
        scale
        placeholder="Custom styled email"
        value=""
        onChange={() => {}}
      />
      <EmailInput
        scale
        placeholder="With value"
        value="user@example.com"
        hasError
        onChange={() => {}}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page. The first field shows them all; hover and focus it to see the two border variables. The second holds an address with its error border forced on (\`hasError\`), where the theme's error colour replaces the border variables and the rest still apply.`,
      },
      source: {
        code: `<div
  style={
    {
      "--text-input-bg": "#f5f3ff",
      "--text-input-border-color": "#c4b5fd",
      "--text-input-border-hover": "#7c3aed",
      "--text-input-border-focus": "#4c1d95",
      "--text-input-color": "#4c1d95",
      "--text-input-radius": "8px",
      "--text-input-font-size": "14px",
      "--email-input-align": "center",
    } as CSSProperties
  }
>
  <EmailInput scale placeholder="Custom styled email" value="" onChange={() => {}} />
  <EmailInput scale value="user@example.com" hasError onChange={() => {}} />
</div>`,
      },
    },
  },
};
