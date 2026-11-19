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
        "The form. Every child is centred horizontally by the wrapper's own flex column.",
    },
    className: {
      control: "text",
      description: "Applied to the card.",
    },
    id: {
      control: "text",
      description: "Applied to the card.",
    },
    style: {
      control: "object",
      description: "Applied to the card.",
    },
    onSubmit: {
      control: false,
      description:
        'Makes the card itself the `<form>` and calls this on submit, with the browser\'s navigation already prevented. Give the main button `type="submit"` so that it, and Enter in a field, submit. Without it the card is a `<div>`.',
    },
    "aria-label": {
      control: "text",
      description:
        "Names the card. With `onSubmit` set this turns the `<form>` into a form landmark.",
    },
    "aria-labelledby": {
      control: "text",
      description:
        "Names the card by the id of an element inside it, usually the heading. With `onSubmit` set this turns the `<form>` into a form landmark.",
    },
  },
} satisfies Meta<typeof FormWrapper>;

type Story = StoryObj<ComponentProps<typeof FormWrapper>>;

export default meta;

export const Default: Story = {
  name: "Default",
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
          "The card on its own around a heading and a line of text, showing its width, padding, corners and shadow.",
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
  name: "Sign-in form",
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
          "A sign-in form: an email field, a password field and a primary submit button. With `onSubmit` the card is the `<form>`, so Enter in either field submits it. Each field row has a 100% width and each control `scale`, so they span the card.",
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
  name: "Registration form",
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
          "A registration form with four fields. The card keeps its fixed width and only grows taller as fields are added.",
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
  name: "CSS customization",
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

    // The canvas is desktop-wide, so read the card's own rules inside its
    // media queries: the width variables hold on a tablet too, and nothing
    // on a phone is !important.
    const mediaRules = [...document.styleSheets]
      .flatMap((sheet) => {
        try {
          return [...sheet.cssRules];
        } catch {
          return [];
        }
      })
      .filter((rule): rule is CSSMediaRule => rule instanceof CSSMediaRule)
      .flatMap((media) => [...media.cssRules])
      .filter(
        (rule): rule is CSSStyleRule =>
          rule instanceof CSSStyleRule &&
          [...card.classList].some((name) => rule.selectorText === `.${name}`),
      );
    await expect(mediaRules.length).toBeGreaterThan(0);
    for (const rule of mediaRules) {
      for (const name of [...rule.style]) {
        await expect(rule.style.getPropertyPriority(name)).toBe("");
      }
    }
    await expect(
      mediaRules.some((rule) =>
        rule.style.maxWidth.includes("--form-wrapper-max-width"),
      ),
    ).toBe(true);
  },
  parameters: {
    docs: {
      description: {
        story: `Every overridable variable set on a wrapper around one card. The minimum and maximum width are set together, since either one alone is clamped by the other.`,
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
