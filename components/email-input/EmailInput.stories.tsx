import type React from "react";
import type { CSSProperties, ComponentProps } from "react";
import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { EmailSettings } from "../../utils/email";
import { InputSize } from "../text-input";

import { EmailInput } from ".";
import type { TValidate } from "./EmailInput.types";

const meta = {
  title: "UI/Form controls/EmailInput",
  component: EmailInput,
  parameters: {
    docs: {
      description: {
        component: `Email input field with built-in validation against configurable email format rules.

### Features

- **Email Validation**: Checks what is typed against the kit's address parser on every keystroke and whenever a new \`value\` arrives
- **Configurable Rules**: Accepts or refuses punycode, IP-address domains, display names, spaces and local domain names according to \`emailSettings\`
- **Custom Validation**: Replaces the built-in parser outright with a function that returns the same result shape
- **Validation Feedback**: Reports the result of each keystroke, with the parser's error keys, to \`onValidateInput\`
- **Automatic Error State**: Turns the border red as soon as a non-empty value fails the check, unless \`hasError\` is passed to decide instead
- **Email Autofill**: Asks the browser for saved addresses through \`autocomplete="email"\` by default
- **Three Sizes**: Comes in base, middle and large heights and stretches to the container's width with \`scale\`
- **Disabled And Read-Only**: Greys the field out and takes it out of use, or keeps it focusable while refusing edits

### Accessibility

The field is a native text \`<input>\`, so its keyboard and screen-reader support comes from the platform.

- **Keyboard**: Tab moves focus into the field and typing edits it; \`isDisabled\` renders it \`disabled\`, which takes it out of the tab order
- **Read-only**: \`isReadOnly\` renders it \`readonly\`, so it stays focusable and its value is still read out
- **Purpose hint**: \`autocomplete="email"\` is the only machine-readable sign that the field expects an email address
- **Name and error**: The consumer supplies the name, through \`<label for>\` (FieldContainer, Label) or \`aria-label\`, and an error message tied with \`aria-describedby\`, since the only built-in signal is the border colour

### Usage

\`\`\`tsx
import { EmailInput } from "@onlyoffice/apps-ui-kit/components/email-input";
import { EmailSettings } from "@onlyoffice/apps-ui-kit/utils/email";

const settings = EmailSettings.parse({ allowStrictLocalPart: true });

<EmailInput
  value={value}
  emailSettings={settings}
  onChange={(e) => setValue(e.target.value)}
  onValidateInput={(result) => setIsValid(result.isValid)}
  placeholder="Enter email address"
/>
\`\`\`

\`\`\`tsx
// Show the error only after the field is left
<EmailInput
  value={value}
  hasError={wasVisited && !isValid}
  onBlur={() => setWasVisited(true)}
  onChange={(e) => setValue(e.target.value)}
  onValidateInput={(result) => setIsValid(result.isValid)}
/>
\`\`\``,
      },
    },
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

export const Default: Story = {
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
          errors: value ? ["DomainNotAllowed"] : [],
        })}
      />
    </div>
  );
};

export const WithCustomValidation: Story = {
  render: () => <CustomValidationTemplate />,
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
        story: `CSS Custom Properties for external customization: the \`--text-input-*\` ones come from TextInput, \`--email-input-align\` is this component's own. The first field shows every variable; hover and focus it to see the two border variables. The second holds an address with its error border forced on (\`hasError\`): the theme's error colour replaces all three border variables, while the background, text colour, radius, font size and alignment still apply:

| Variable | Description | Default |
|----------|-------------|---------|
| \`--text-input-bg\` | Background color | theme token |
| \`--text-input-border-color\` | Border color at rest | theme token |
| \`--text-input-border-hover\` | Border color while hovered | theme token |
| \`--text-input-border-focus\` | Border color while focused | theme token |
| \`--text-input-color\` | Text and caret color | theme token |
| \`--text-input-font-size\` | Font size (all sizes) | \`13px\` (base, middle) / \`16px\` (large) |
| \`--text-input-radius\` | Border radius | theme token |
| \`--email-input-align\` | Alignment of the value and the placeholder; ignored under a right-to-left interface, where both align right | \`left\` |`,
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
