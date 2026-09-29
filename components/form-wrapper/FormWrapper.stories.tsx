import { useState } from "react";
import type { CSSProperties, ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button, ButtonSize } from "../button";
import { FieldContainer } from "../field-container";
import { InputSize, InputType, TextInput } from "../text-input";

import { FormWrapper } from "./index";

import styles from "./FormWrapper.stories.module.scss";

const meta = {
  title: "UI/Form controls/FormWrapper",
  component: FormWrapper,
  parameters: {
    docs: {
      description: {
        component: `A fixed-width card for a short standalone form, such as sign in or registration, that is the only content of its page.

### Features

- **Consistent Styling**: Draws a rounded, shadowed card whose background and shadow follow the light or dark theme
- **Flexible Content**: Accepts any React children as form content
- **Customizable**: Passes a class, an id, inline styles and any other DOM attribute through to the card
- **Fixed Width**: Holds the card at 320px on a desktop and 416px on a tablet, whatever the width of its container
- **Centred Children**: Lays the children out in a column centred horizontally, so a child without a width of its own shrinks to its content
- **Built-in Padding**: Adds 32px of padding inside the card, on top of any margin the children carry
- **Flush on Phones**: Drops the padding, corners, shadow and background under the mobile breakpoint, so the form sits directly on the page

### Usage

\`\`\`tsx
import { Button, ButtonSize } from "@onlyoffice/apps-ui-kit/components/button";
import { FieldContainer } from "@onlyoffice/apps-ui-kit/components/field-container";
import { FormWrapper } from "@onlyoffice/apps-ui-kit/components/form-wrapper";
import { InputSize, InputType, TextInput } from "@onlyoffice/apps-ui-kit/components/text-input";

// A sign-in form; a full-width field row and scale make each control span the card
<FormWrapper>
  <FieldContainer isVertical labelVisible labelText="Email" style={{ width: "100%" }}>
    <TextInput type={InputType.email} size={InputSize.base} value={email} onChange={onEmailChange} scale />
  </FieldContainer>
  <Button primary scale size={ButtonSize.normal} label="Sign in" onClick={onSubmit} />
</FormWrapper>

// A wider card: move the minimum and the maximum together
<FormWrapper style={{ "--form-wrapper-min-width": "480px", "--form-wrapper-max-width": "480px" } as React.CSSProperties}>
  {children}
</FormWrapper>
\`\`\``,
      },
    },
  },
  argTypes: {
    children: {
      control: false,
      description:
        "The form content; every child is centred horizontally in the card",
    },
    className: {
      control: "text",
      description: "Additional class names applied to the card",
    },
    id: {
      control: "text",
      description: "HTML id applied to the card",
    },
    style: {
      control: "object",
      description: "Inline styles applied to the card",
    },
  },
} satisfies Meta<typeof FormWrapper>;

type Story = StoryObj<ComponentProps<typeof FormWrapper>>;

export default meta;

export const Default: Story = {
  render: (args) => <FormWrapper {...args} />,
  args: {
    children: (
      <div className={styles.demoContent}>
        <h3>Welcome</h3>
        <p>This is a basic form wrapper example</p>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          "The card on its own around a heading and a line of text, to judge its width, padding, corners and shadow before a form goes in. Change the class, id or inline styles live in the Controls panel below.",
      },
      source: {
        code: `<FormWrapper>
  <h3>Welcome</h3>
  <p>This is a basic form wrapper example</p>
</FormWrapper>`,
      },
    },
  },
};

// A field row shrinks to its content in the centred card unless given a width
const fullWidth: CSSProperties = { width: "100%" };

const SignInFormTemplate = (args: ComponentProps<typeof FormWrapper>) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <FormWrapper {...args}>
      <FieldContainer
        isVertical
        labelVisible
        labelText="Email"
        style={fullWidth}
      >
        <TextInput
          type={InputType.email}
          size={InputSize.base}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          scale
        />
      </FieldContainer>
      <FieldContainer
        isVertical
        labelVisible
        labelText="Password"
        style={fullWidth}
      >
        <TextInput
          type={InputType.password}
          size={InputSize.base}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          scale
        />
      </FieldContainer>
      <Button primary scale size={ButtonSize.normal} label="Sign in" />
    </FormWrapper>
  );
};

export const WithLoginForm: Story = {
  render: (args) => <SignInFormTemplate {...args} />,
  args: {
    children: null,
  },
  parameters: {
    docs: {
      description: {
        story:
          "A sign-in form as the card is meant to hold it: an email field, a password field and a primary button. Each field row is given a width of 100% and each control `scale`, so they span the card instead of shrinking to their content.",
      },
      source: {
        code: `<FormWrapper>
  <FieldContainer isVertical labelVisible labelText="Email" style={{ width: "100%" }}>
    <TextInput type={InputType.email} size={InputSize.base} value={email} onChange={onEmailChange} scale />
  </FieldContainer>
  <FieldContainer isVertical labelVisible labelText="Password" style={{ width: "100%" }}>
    <TextInput type={InputType.password} size={InputSize.base} value={password} onChange={onPasswordChange} scale />
  </FieldContainer>
  <Button primary scale size={ButtonSize.normal} label="Sign in" />
</FormWrapper>`,
      },
    },
  },
};

const RegistrationFormTemplate = (args: ComponentProps<typeof FormWrapper>) => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const fields = [
    { key: "name", label: "Full name", type: InputType.text },
    { key: "email", label: "Email", type: InputType.email },
    { key: "password", label: "Password", type: InputType.password },
    { key: "confirm", label: "Confirm password", type: InputType.password },
  ] as const;

  return (
    <FormWrapper {...args}>
      {fields.map((field) => (
        <FieldContainer
          key={field.key}
          isVertical
          labelVisible
          labelText={field.label}
          style={fullWidth}
        >
          <TextInput
            type={field.type}
            size={InputSize.base}
            value={values[field.key]}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, [field.key]: e.target.value }))
            }
            scale
          />
        </FieldContainer>
      ))}
      <Button primary scale size={ButtonSize.normal} label="Create account" />
    </FormWrapper>
  );
};

export const WithRegistrationForm: Story = {
  render: (args) => <RegistrationFormTemplate {...args} />,
  args: {
    children: null,
  },
  parameters: {
    docs: {
      description: {
        story:
          "A longer form with four fields, to show that the card keeps its fixed width and only grows taller as fields are added.",
      },
      source: {
        code: `<FormWrapper>
  <FieldContainer isVertical labelVisible labelText="Full name" style={{ width: "100%" }}>
    <TextInput type={InputType.text} size={InputSize.base} value={name} onChange={onNameChange} scale />
  </FieldContainer>
  <FieldContainer isVertical labelVisible labelText="Email" style={{ width: "100%" }}>
    <TextInput type={InputType.email} size={InputSize.base} value={email} onChange={onEmailChange} scale />
  </FieldContainer>
  <FieldContainer isVertical labelVisible labelText="Password" style={{ width: "100%" }}>
    <TextInput type={InputType.password} size={InputSize.base} value={password} onChange={onPasswordChange} scale />
  </FieldContainer>
  <FieldContainer isVertical labelVisible labelText="Confirm password" style={{ width: "100%" }}>
    <TextInput type={InputType.password} size={InputSize.base} value={confirm} onChange={onConfirmChange} scale />
  </FieldContainer>
  <Button primary scale size={ButtonSize.normal} label="Create account" />
</FormWrapper>`,
      },
    },
  },
};

export const CssCustomization: Story = {
  render: () => (
    <div
      style={
        {
          "--form-wrapper-bg": "#1e1b4b",
          "--form-wrapper-shadow": "0 8px 32px rgba(124,58,237,0.4)",
          "--form-wrapper-radius": "24px",
          "--form-wrapper-padding": "40px",
          "--form-wrapper-max-width": "400px",
          "--form-wrapper-min-width": "400px",
        } as CSSProperties
      }
    >
      <FormWrapper>
        <div className={styles.demoContent}>
          <h3 style={{ color: "#e0e7ff", margin: 0 }}>Custom Styled Form</h3>
          <p style={{ color: "#a78bfa", margin: "8px 0 0" }}>
            Customized with CSS variables
          </p>
        </div>
      </FormWrapper>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `CSS Custom Properties for external customization:

| Variable | Description | Default |
|----------|-------------|---------|
| \`--form-wrapper-bg\` | Background color; ignored on a phone | theme-based |
| \`--form-wrapper-shadow\` | Box shadow; ignored on a phone | theme-based |
| \`--form-wrapper-radius\` | Border radius; ignored on a phone | \`12px\` |
| \`--form-wrapper-padding\` | Inner padding; ignored on a phone | \`32px\` |
| \`--form-wrapper-max-width\` | Maximum width; ignored on a tablet and a phone, where the width is fixed | \`320px\` |
| \`--form-wrapper-min-width\` | Minimum width; ignored on a tablet and a phone, where the width is fixed | \`320px\` |

The example sets every variable on a wrapper around one card. Set the minimum and the maximum width together: either one alone is clamped by the other.`,
      },
      source: {
        code: `<div
  style={{
    "--form-wrapper-bg": "#1e1b4b",
    "--form-wrapper-shadow": "0 8px 32px rgba(124,58,237,0.4)",
    "--form-wrapper-radius": "24px",
    "--form-wrapper-padding": "40px",
    "--form-wrapper-max-width": "400px",
    "--form-wrapper-min-width": "400px",
  }}
>
  <FormWrapper>
    <h3>Custom Styled Form</h3>
    <p>Customized with CSS variables</p>
  </FormWrapper>
</div>`,
      },
    },
  },
};
