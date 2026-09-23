import { useState } from "react";

import { Button, ButtonSize } from "../../../components/button";
import { Checkbox } from "../../../components/checkbox";
import { EmailInput } from "../../../components/email-input";
import { FieldContainer } from "../../../components/field-container";
import { FormWrapper } from "../../../components/form-wrapper";
import {
  Heading,
  HeadingLevel,
  HeadingSize,
} from "../../../components/heading";
import { Link, LinkType } from "../../../components/link";
import { PasswordInput } from "../../../components/password-input";
import { Text } from "../../../components/text";
import { InputSize } from "../../../components/text-input";
import { Toast, toastr } from "../../../components/toast";

/** The one password this demo portal accepts. */
const DEMO_PASSWORD = "Docs2026!";

/**
 * A sign-in screen that actually refuses you.
 *
 * `FormWrapper` is the card. `FieldContainer` owns the label, the required
 * asterisk and the error line, so validation is two pieces of state and not a
 * layout problem. `EmailInput` validates the address itself and reports through
 * `onValidateInput` -- the form only has to decide when to listen, which here
 * is on submit, never while the user is still typing.
 *
 * The password is `Docs2026!` — get it wrong once to see where the errors go.
 */
export const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [password, setPassword] = useState("");
  const [keepSignedIn, setKeepSignedIn] = useState(true);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const nextEmailError = !email
      ? "Enter your email address"
      : !isEmailValid
        ? "This does not look like an email address"
        : "";
    const nextPasswordError = password ? "" : "Enter your password";

    setEmailError(nextEmailError);
    setPasswordError(nextPasswordError);

    if (nextEmailError || nextPasswordError) return;

    setIsLoading(true);

    window.setTimeout(() => {
      setIsLoading(false);

      if (password !== DEMO_PASSWORD) {
        setPasswordError("Wrong password. The demo one is Docs2026!");
        toastr.error("We could not sign you in");
        return;
      }

      toastr.success(
        keepSignedIn
          ? `Welcome back, ${email.split("@")[0]}. We will keep you signed in.`
          : `Welcome back, ${email.split("@")[0]}.`,
      );
    }, 900);
  };

  return (
    <div style={{ maxWidth: "420px" }}>
      <Toast />

      <FormWrapper>
        <form onSubmit={onSubmit} noValidate>
          <Heading level={HeadingLevel.h1} size={HeadingSize.large}>
            Sign in
          </Heading>
          <Text
            fontSize="13px"
            lineHeight="20px"
            style={{ marginBottom: "24px", marginTop: "4px" }}
          >
            to continue to the Finance department room.
          </Text>

          <FieldContainer
            isVertical
            labelVisible
            isRequired
            labelText="Email"
            hasError={Boolean(emailError)}
            errorMessage={emailError}
          >
            <EmailInput
              name="sign-in-email"
              value={email}
              scale
              size={InputSize.large}
              placeholder="anna.petrova@example.com"
              hasError={Boolean(emailError)}
              isAutoFocussed
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError("");
              }}
              onValidateInput={({ isValid }) => setIsEmailValid(isValid)}
            />
          </FieldContainer>

          <FieldContainer
            isVertical
            labelVisible
            isRequired
            labelText="Password"
            hasError={Boolean(passwordError)}
            errorMessage={passwordError}
          >
            <PasswordInput
              simpleView
              isDisableTooltip
              inputName="sign-in-password"
              emailInputName="sign-in-email"
              inputValue={password}
              scale
              size={InputSize.large}
              placeholder="Your password"
              hasError={Boolean(passwordError)}
              onChange={(e) => {
                setPassword(e.currentTarget.value);
                setPasswordError("");
              }}
            />
          </FieldContainer>

          <Checkbox
            label="Keep me signed in"
            isChecked={keepSignedIn}
            onChange={(e) => setKeepSignedIn(e.target.checked)}
          />

          <Button
            primary
            scale
            type="submit"
            label={isLoading ? "Signing in..." : "Sign in"}
            size={ButtonSize.medium}
            isLoading={isLoading}
            style={{ marginTop: "24px" }}
          />

          <Text
            fontSize="12px"
            textAlign="center"
            style={{ marginTop: "16px" }}
          >
            <Link
              type={LinkType.action}
              isHovered
              role="button"
              tabIndex={0}
              onClick={() =>
                toastr.info("A reset link would be on its way to your inbox")
              }
            >
              Forgot your password?
            </Link>
          </Text>
        </form>
      </FormWrapper>
    </div>
  );
};
