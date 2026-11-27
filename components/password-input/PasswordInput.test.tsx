import React from "react";
import { describe, it, expect, vi } from "vitest";
import {
  act,
  screen,
  render,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { InputSize, InputType } from "../text-input";
import { PasswordInput } from ".";

// Mock ResizeObserver
class ResizeObserverMock {
  observe() {}

  unobserve() {}

  disconnect() {}
}

global.ResizeObserver = ResizeObserverMock;

const basePasswordSettings = {
  minLength: 6,
  upperCase: false,
  digits: false,
  specSymbols: false,
  digitsRegexStr: "(?=.*\\d)",
  upperCaseRegexStr: "(?=.*[A-Z])",
  specSymbolsRegexStr: "(?=.*[\\x21-\\x2F\\x3A-\\x40\\x5B-\\x60\\x7B-\\x7E])",
};

const baseProps = {
  inputName: "demoPasswordInput",
  emailInputName: "demoEmailInput",
  inputValue: "",
  size: InputSize.base,
  tooltipPasswordTitle: "Password must contain:",
  tooltipPasswordLength: "from 6 to 30 characters",
  tooltipPasswordDigits: "digits",
  tooltipPasswordCapital: "capital letters",
  tooltipPasswordSpecial: "special characters (!@#$%^&*)",
  generatorSpecial: "!@#$%^&*",
  passwordSettings: basePasswordSettings,
  isDisabled: false,
  placeholder: "password",
  onChange: vi.fn(),
  onValidateInput: vi.fn(),
};

describe("<PasswordInput />", () => {
  it("forwards a passed aria-* to the <input>, not the wrapper", () => {
    render(
      <PasswordInput
        {...baseProps}
        aria-label="New password"
        aria-describedby="password-rules"
      />,
    );

    const input = screen.getByLabelText("New password");
    expect(input.tagName).toBe("INPUT");
    expect(input).toHaveAttribute("name", baseProps.inputName);
    expect(input).toHaveAttribute("aria-describedby", "password-rules");
    expect(screen.getByTestId("password-input")).not.toHaveAttribute(
      "aria-label",
    );
  });

  it("renders without error", () => {
    render(
      <PasswordInput inputType={InputType.password} size={InputSize.base} />,
    );

    expect(screen.getByTestId("password-input")).toBeInTheDocument();
  });

  it("renders with correct input type and name", () => {
    render(<PasswordInput {...baseProps} />);

    const input = screen.getByTestId("password-input").querySelector("input");
    expect(input).toHaveAttribute("type", "password");
    expect(input).toHaveAttribute("name", "demoPasswordInput");
  });

  it("handles input value changes", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<PasswordInput {...baseProps} onChange={onChange} />);

    const input = screen.getByTestId("password-input").querySelector("input");
    await user.type(input!, "testpassword");

    expect(onChange).toHaveBeenCalled();
  });

  it("toggles password visibility", async () => {
    const user = userEvent.setup();
    render(<PasswordInput {...baseProps} />);

    const input = screen.getByTestId("password-input").querySelector("input");
    const toggleButton = screen.getByTestId("icon-button");

    expect(input).toHaveAttribute("type", "password");

    await user.click(toggleButton);
    expect(input).toHaveAttribute("type", "text");

    await user.click(toggleButton);
    expect(input).toHaveAttribute("type", "password");
  });

  it("makes the visibility toggle a named button the keyboard presses", async () => {
    const user = userEvent.setup();
    render(<PasswordInput {...baseProps} />);

    const input = screen.getByTestId("password-input").querySelector("input");
    const show = screen.getByRole("button", { name: "Show" });
    expect(show).toHaveAttribute("tabindex", "0");

    show.focus();
    await user.keyboard("{Enter}");
    expect(input).toHaveAttribute("type", "text");

    const hide = screen.getByRole("button", { name: "Hide" });
    hide.focus();
    await user.keyboard(" ");
    expect(input).toHaveAttribute("type", "password");
  });

  it("shows tooltip with password requirements", async () => {
    const user = userEvent.setup();
    render(
      <PasswordInput
        {...baseProps}
        passwordSettings={{
          ...basePasswordSettings,
          minLength: 8,
          upperCase: true,
          digits: true,
          specSymbols: true,
        }}
      />,
    );

    const input = screen.getByTestId("password-input").querySelector("input");
    await user.type(input!, "testpassword");

    expect(screen.getByText("Password must contain:")).toBeInTheDocument();
    expect(screen.getByText("from 6 to 30 characters")).toBeInTheDocument();
    expect(screen.getByText("digits")).toBeInTheDocument();
    expect(screen.getByText("capital letters")).toBeInTheDocument();
    expect(
      screen.getByText("special characters (!@#$%^&*)"),
    ).toBeInTheDocument();
  });

  it("handles disabled state correctly", () => {
    render(<PasswordInput {...baseProps} isDisabled />);

    const input = screen.getByTestId("password-input").querySelector("input");
    expect(input).toBeDisabled();
  });

  it("validates password requirements", async () => {
    const onValidateInput = vi.fn();
    const user = userEvent.setup();
    render(
      <PasswordInput
        {...baseProps}
        passwordSettings={{
          ...basePasswordSettings,
          minLength: 8,
          upperCase: true,
          digits: true,
          specSymbols: true,
        }}
        onValidateInput={onValidateInput}
      />,
    );

    const input = screen.getByTestId("password-input").querySelector("input");
    await user.type(input!, "Test123!@#");

    expect(onValidateInput).toHaveBeenCalled();
  });

  it("handles blur event correctly", async () => {
    const onBlur = vi.fn();
    const user = userEvent.setup();
    render(<PasswordInput {...baseProps} onBlur={onBlur} />);

    const input = screen.getByTestId("password-input").querySelector("input");
    await user.click(input!);
    await user.tab();

    expect(onBlur).toHaveBeenCalled();
  });

  it("simulates password typing when isSimulateType is true", async () => {
    const user = userEvent.setup();
    render(<PasswordInput {...baseProps} isSimulateType simulateSymbol="*" />);

    const input = screen.getByTestId("password-input").querySelector("input");
    await user.type(input!, "test");

    expect(input).toHaveValue("****");
  });

  it("applies custom style and className", () => {
    const customStyle = { width: "300px" };
    const customClass = "custom-password-input";

    render(
      <PasswordInput
        {...baseProps}
        style={customStyle}
        className={customClass}
      />,
    );

    const wrapper = screen.getByTestId("password-input");
    expect(wrapper).toHaveClass(customClass);
    expect(wrapper).toHaveStyle(customStyle);
  });

  // Additional test coverage
  it("handles keyDown events", async () => {
    const onKeyDown = vi.fn();
    const user = userEvent.setup();
    render(<PasswordInput {...baseProps} onKeyDown={onKeyDown} />);

    const input = screen.getByTestId("password-input").querySelector("input");
    await user.type(input!, "{enter}");

    expect(onKeyDown).toHaveBeenCalled();
  });

  it("displays error state correctly", () => {
    render(<PasswordInput {...baseProps} hasError />);

    const input = screen.getByTestId("password-input");
    expect(input).toHaveAttribute("data-error", "true");
  });

  it("displays warning state correctly", () => {
    render(<PasswordInput {...baseProps} hasWarning />);

    const input = screen.getByTestId("password-input");
    expect(input).toHaveAttribute("data-warning", "true");
  });

  it("handles auto-focus", () => {
    render(<PasswordInput {...baseProps} isAutoFocussed />);

    const input = screen.getByTestId("password-input").querySelector("input");
    expect(input).toHaveFocus();
  });

  it("renders in simple view mode", () => {
    render(<PasswordInput {...baseProps} simpleView />);

    // In simple view, certain elements should not be present
    expect(screen.queryByTestId("password-progress")).not.toBeInTheDocument();
    expect(screen.queryByTestId("copy-button")).not.toBeInTheDocument();
    expect(screen.queryByTestId("generate-password")).not.toBeInTheDocument();
  });

  it("applies full width when isFullWidth is true", () => {
    render(<PasswordInput {...baseProps} isFullWidth />);

    const wrapper = screen.getByTestId("password-input");
    expect(wrapper).toHaveStyle({ display: "block" });
  });

  it("handles different input sizes", () => {
    render(<PasswordInput {...baseProps} size={InputSize.large} />);

    const input = screen.getByTestId("password-input").querySelector("input");
    expect(input).toHaveAttribute("data-size", "large");
  });

  it("disables tooltip when isDisableTooltip is true", async () => {
    const user = userEvent.setup();
    render(
      <PasswordInput
        {...baseProps}
        isDisableTooltip
        passwordSettings={{
          ...basePasswordSettings,
          minLength: 8,
          upperCase: true,
          digits: true,
          specSymbols: true,
        }}
      />,
    );

    const input = screen.getByTestId("password-input").querySelector("input");
    await user.click(input!);

    expect(
      screen.queryByText("Password must contain:"),
    ).not.toBeInTheDocument();
  });

  describe("tooltipPasswordPlace", () => {
    const openRulesTooltip = async (
      props: Partial<React.ComponentProps<typeof PasswordInput>> = {},
    ) => {
      const user = userEvent.setup();
      render(<PasswordInput {...baseProps} id="placed-password" {...props} />);

      const input = screen.getByTestId("password-input").querySelector("input");
      await user.type(input!, "abc");

      const title = await screen.findByText("Password must contain:");
      return title.closest(".react-tooltip") as HTMLElement;
    };

    it("opens the rules tooltip above the field by default", async () => {
      const tooltip = await openRulesTooltip();

      await waitFor(() =>
        expect(tooltip).toHaveClass("react-tooltip__place-top"),
      );
    });

    it("opens the rules tooltip on the side it is given", async () => {
      const tooltip = await openRulesTooltip({ tooltipPasswordPlace: "right" });

      await waitFor(() =>
        expect(tooltip).toHaveClass("react-tooltip__place-right"),
      );
    });

    it("anchors the rules tooltip to the whole field, reveal button included", async () => {
      // jsdom lays nothing out: in a 1024 x 768 page the field is 300px wide,
      // its text input the first 260px of it, the reveal button the rest.
      const rect = (width: number, height: number) =>
        ({
          x: 0,
          y: 0,
          top: 0,
          left: 0,
          right: width,
          bottom: height,
          width,
          height,
          toJSON: () => ({}),
        }) as DOMRect;
      // floating-ui watches a laid-out anchor with an IntersectionObserver,
      // which jsdom does not provide.
      vi.stubGlobal(
        "IntersectionObserver",
        class {
          observe() {}

          unobserve() {}

          disconnect() {}

          takeRecords() {
            return [];
          }
        },
      );
      const root = document.documentElement;
      const page = { clientWidth: 1024, clientHeight: 768 };
      for (const [key, value] of Object.entries(page))
        Object.defineProperty(root, key, { configurable: true, value });
      const original = Element.prototype.getBoundingClientRect;
      Element.prototype.getBoundingClientRect = function getRect(
        this: Element,
      ) {
        if (this === root || this === document.body) return rect(1024, 768);
        if (this.getAttribute("data-testid") === "tooltipContent")
          return rect(300, 32);
        if (this.tagName === "INPUT") return rect(260, 32);
        return rect(100, 50);
      };

      try {
        const tooltip = await openRulesTooltip({
          tooltipPasswordPlace: "right",
        });

        await waitFor(() =>
          expect(parseFloat(tooltip.style.left)).toBeGreaterThanOrEqual(300),
        );
      } finally {
        Element.prototype.getBoundingClientRect = original;
        for (const key of Object.keys(page))
          delete (root as unknown as Record<string, unknown>)[key];
        vi.unstubAllGlobals();
      }
    });
  });

  it("handles custom autocomplete attribute", () => {
    render(<PasswordInput {...baseProps} autoComplete="current-password" />);

    const input = screen.getByTestId("password-input").querySelector("input");
    expect(input).toHaveAttribute("autocomplete", "current-password");
  });

  describe("Password Validation", () => {
    it("validates minimum length requirement", async () => {
      const onValidateInput = vi.fn();
      const user = userEvent.setup();
      render(
        <PasswordInput
          {...baseProps}
          passwordSettings={{
            ...basePasswordSettings,
            minLength: 8,
          }}
          onValidateInput={onValidateInput}
        />,
      );

      const input = screen.getByTestId("password-input").querySelector("input");
      await user.type(input!, "short");

      expect(onValidateInput).toHaveBeenCalledWith(
        false,
        expect.objectContaining({ length: false }),
      );

      await user.type(input!, "longenough");
      expect(onValidateInput).toHaveBeenCalledWith(
        true,
        expect.objectContaining({ length: true }),
      );
    });

    it("validates special characters requirement", async () => {
      const onValidateInput = vi.fn();
      render(
        <PasswordInput
          {...baseProps}
          passwordSettings={{
            ...basePasswordSettings,
            specSymbols: true,
          }}
          onValidateInput={onValidateInput}
        />,
      );

      const input = screen
        .getByTestId("password-input")
        .querySelector("input")!;
      fireEvent.change(input, { target: { value: "nospecial" } });

      expect(onValidateInput).toHaveBeenCalledWith(
        false,
        expect.objectContaining({ special: false }),
      );

      fireEvent.change(input, { target: { value: "with!@#special" } });
      expect(onValidateInput).toHaveBeenCalledWith(
        true,
        expect.objectContaining({ special: true }),
      );
    });
  });

  describe("Input Behavior", () => {
    it("handles paste event correctly", async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();
      render(<PasswordInput {...baseProps} onChange={onChange} />);

      const input = screen.getByTestId("password-input").querySelector("input");
      await user.click(input!);
      await user.paste("pasted-password");

      expect(onChange).toHaveBeenCalled();
    });

    it("handles input with maxLength and simulated typing", async () => {
      const user = userEvent.setup();
      render(
        <PasswordInput
          {...baseProps}
          maxLength={5}
          isSimulateType
          simulateSymbol="*"
        />,
      );

      const input = screen.getByTestId("password-input").querySelector("input");
      await user.type(input!, "123456");

      expect(input).toHaveValue("*****");
    });
  });

  describe("Accessibility", () => {
    it("handles tab navigation correctly", async () => {
      const user = userEvent.setup();
      render(<PasswordInput {...baseProps} tabIndex={1} />);

      const input = screen.getByTestId("password-input").querySelector("input");
      expect(input).toHaveAttribute("tabindex", "1");

      await user.tab();
      expect(input).toHaveFocus();
    });
  });

  describe("Style and Layout", () => {
    it("applies custom width", () => {
      render(
        <PasswordInput {...baseProps} simpleView={false} inputWidth="300px" />,
      );

      const wrapper = screen.getByTestId("tooltipContent");
      expect(wrapper).toHaveStyle({ width: "300px" });
    });

    it("applies scale property correctly", () => {
      render(<PasswordInput {...baseProps} scale />);

      const wrapper = screen.getByTestId("password-input");
      expect(wrapper).toHaveAttribute("data-scale", "true");
    });
  });
});

describe("<PasswordInput /> generator settings", () => {
  type Handle = { onGeneratePassword: (e: React.MouseEvent) => void };

  const generate = (props: object) => {
    const ref = React.createRef<Handle>();
    render(
      <PasswordInput
        {...baseProps}
        {...props}
        ref={ref as unknown as React.RefObject<never>}
      />,
    );
    act(() => {
      ref.current?.onGeneratePassword({
        preventDefault: () => {},
      } as unknown as React.MouseEvent);
    });
    return (
      screen
        .getByTestId("password-input")
        .querySelector("input") as HTMLInputElement
    ).value;
  };

  const strict = {
    ...basePasswordSettings,
    minLength: 12,
    upperCase: true,
    digits: true,
    specSymbols: true,
  };

  it("draws by generatorSettings when they are given", () => {
    const value = generate({
      passwordSettings: { ...basePasswordSettings, minLength: 12 },
      generatorSettings: strict,
    });

    expect(value).toHaveLength(12);
    expect(value).toMatch(/[A-Z]/);
    expect(value).toMatch(/\d/);
    expect(value).toMatch(/[!@#$%^&*]/);
  });

  it("draws by passwordSettings otherwise", () => {
    const value = generate({
      passwordSettings: { ...basePasswordSettings, minLength: 10 },
    });

    expect(value).toMatch(/^[a-z]{10}$/);
  });
});
