import { useState } from "react";
import type { CSSProperties, ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, within } from "storybook/test";

import { Button, ButtonSize } from "../button";
import { FieldContainer } from "../field-container";
import { InputSize, InputType, TextInput } from "../text-input";

import { FormWrapper } from "./index";

import styles from "./FormWrapper.stories.module.scss";

const meta = {
  title: "UI/Form controls/FormWrapper",
  component: FormWrapper,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
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
    onSubmit: {
      control: false,
      description:
        "Makes the card a form; called on submit with the navigation prevented",
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
  play: async ({ canvas }) => {
    const card = canvas.getByTestId("form-wrapper");
    await expect(
      within(card).getByRole("heading", { name: "Welcome" }),
    ).toBeVisible();
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
        labelFor="sign-in-email"
        style={fullWidth}
      >
        <TextInput
          id="sign-in-email"
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
        labelFor="sign-in-password"
        style={fullWidth}
      >
        <TextInput
          id="sign-in-password"
          type={InputType.password}
          size={InputSize.base}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          scale
        />
      </FieldContainer>
      <Button
        primary
        scale
        type="submit"
        size={ButtonSize.normal}
        label="Sign in"
      />
    </FormWrapper>
  );
};

export const WithLoginForm: Story = {
  render: (args) => <SignInFormTemplate {...args} />,
  args: {
    children: null,
    onSubmit: fn(),
    "aria-label": "Sign in",
  },
  play: async ({ args, canvas, userEvent }) => {
    // With onSubmit the card is the form, a landmark named by aria-label.
    const form = canvas.getByRole("form", { name: "Sign in" });
    await expect(form).toBe(canvas.getByTestId("form-wrapper"));

    // Each caption names its field.
    const email = canvas.getByLabelText("Email");
    await userEvent.type(email, "user@example.com");
    await expect(email).toHaveValue("user@example.com");

    const password = canvas.getByLabelText("Password");
    await userEvent.type(password, "secret");
    await expect(password).toHaveValue("secret");
    await expect(password).toHaveAttribute("type", "password");

    // scale stretches the controls across the card.
    const card = canvas.getByTestId("form-wrapper");
    const button = canvas.getByRole("button", { name: "Sign in" });
    await expect(button.getBoundingClientRect().width).toBeCloseTo(
      email.getBoundingClientRect().width,
      0,
    );
    await expect(card).toContainElement(button);

    // Enter in a field submits the form, and the page stays where it is.
    await userEvent.type(password, "{Enter}");
    await expect(args.onSubmit).toHaveBeenCalledTimes(1);
    await userEvent.click(button);
    await expect(args.onSubmit).toHaveBeenCalledTimes(2);
  },
  parameters: {
    docs: {
      description: {
        story:
          "A sign-in form as the card is meant to hold it: an email field, a password field and a primary submit button. With `onSubmit` the card is the `<form>`, so Enter in either field submits it. Each caption is tied to its field through `labelFor` and the control's `id`; each field row is given a width of 100% and each control `scale`, so they span the card instead of shrinking to their content.",
      },
      source: {
        code: `<FormWrapper onSubmit={onSignIn} aria-label="Sign in">
  <FieldContainer isVertical labelVisible labelText="Email" labelFor="sign-in-email" style={{ width: "100%" }}>
    <TextInput id="sign-in-email" type={InputType.email} size={InputSize.base} value={email} onChange={onEmailChange} scale />
  </FieldContainer>
  <FieldContainer isVertical labelVisible labelText="Password" labelFor="sign-in-password" style={{ width: "100%" }}>
    <TextInput id="sign-in-password" type={InputType.password} size={InputSize.base} value={password} onChange={onPasswordChange} scale />
  </FieldContainer>
  <Button primary scale type="submit" size={ButtonSize.normal} label="Sign in" />
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
          labelFor={`register-${field.key}`}
          style={fullWidth}
        >
          <TextInput
            id={`register-${field.key}`}
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
  play: async ({ canvas }) => {
    for (const label of [
      "Full name",
      "Email",
      "Password",
      "Confirm password",
    ]) {
      await expect(canvas.getByLabelText(label)).toBeVisible();
    }
    await expect(
      canvas.getByRole("button", { name: "Create account" }),
    ).toBeVisible();
  },
  parameters: {
    docs: {
      description: {
        story:
          "A longer form with four fields, to show that the card keeps its fixed width and only grows taller as fields are added.",
      },
      source: {
        code: `<FormWrapper>
  <FieldContainer isVertical labelVisible labelText="Full name" labelFor="register-name" style={{ width: "100%" }}>
    <TextInput id="register-name" type={InputType.text} size={InputSize.base} value={name} onChange={onNameChange} scale />
  </FieldContainer>
  <FieldContainer isVertical labelVisible labelText="Email" labelFor="register-email" style={{ width: "100%" }}>
    <TextInput id="register-email" type={InputType.email} size={InputSize.base} value={email} onChange={onEmailChange} scale />
  </FieldContainer>
  <FieldContainer isVertical labelVisible labelText="Password" labelFor="register-password" style={{ width: "100%" }}>
    <TextInput id="register-password" type={InputType.password} size={InputSize.base} value={password} onChange={onPasswordChange} scale />
  </FieldContainer>
  <FieldContainer isVertical labelVisible labelText="Confirm password" labelFor="register-confirm" style={{ width: "100%" }}>
    <TextInput id="register-confirm" type={InputType.password} size={InputSize.base} value={confirm} onChange={onConfirmChange} scale />
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
  play: async ({ canvas }) => {
    const card = canvas.getByTestId("form-wrapper");
    const style = getComputedStyle(card);
    await expect(style.backgroundColor).toBe("rgb(30, 27, 75)");
    // The width variables size the content box; the padding is added on top.
    await expect(style.width).toBe("400px");
    await expect(style.paddingLeft).toBe("40px");
    // So the card itself is the width plus the padding on both sides.
    await expect(Math.round(card.getBoundingClientRect().width)).toBe(480);
  },
  parameters: {
    docs: {
      description: {
        story: `Every overridable variable set on a wrapper around one card -- the variables are listed under CSS variables on this page. Set the minimum and the maximum width together: either one alone is clamped by the other.`,
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
