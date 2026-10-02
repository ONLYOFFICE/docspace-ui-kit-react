import { describe, it, expect, afterEach, vi } from "vitest";
import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ButtonSize } from "./Button.enums";

import { Button } from ".";

const baseProps = {
  size: ButtonSize.extraSmall,
  isDisabled: false,
  label: "OK",
  onClick: vi.fn(),
};

describe("<Button />", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders without error", () => {
    render(<Button {...baseProps} />);
    expect(screen.getByTestId("button")).toBeInTheDocument();
    expect(screen.getByText("OK")).toBeInTheDocument();
  });

  it("handles click events", async () => {
    const user = userEvent.setup();
    render(<Button {...baseProps} aria-label="Click me" />);

    await user.click(screen.getByRole("button", { name: "OK" }));
    expect(baseProps.onClick).toHaveBeenCalledTimes(1);
  });

  it("disables button when isDisabled is true", () => {
    render(<Button {...baseProps} isDisabled aria-disabled="true" />);

    const button = screen.getByRole("button", { name: "OK" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("disabled");
    expect(button).toHaveAttribute("aria-disabled", "true");
  });

  it("shows loading state", () => {
    render(<Button {...baseProps} isLoading aria-busy="true" />);

    const button = screen.getByRole("button", { name: "OK" });
    expect(button.className).toContain("isLoading");
    expect(button).toHaveAttribute("aria-busy", "true");
  });

  it("renders with custom className", () => {
    render(<Button {...baseProps} className="custom-class" />);
    expect(screen.getByTestId("button").className).toContain("custom-class");
  });

  it("renders with custom style", () => {
    render(<Button {...baseProps} style={{ backgroundColor: "red" }} />);
    expect(screen.getByTestId("button").style.backgroundColor).toBe("red");
  });

  it("renders with icon", () => {
    const icon = <span data-testid="test-icon">Icon</span>;
    render(<Button {...baseProps} icon={icon} />);

    expect(screen.getByTestId("test-icon")).toBeInTheDocument();
    expect(screen.getByText("OK")).toBeInTheDocument();
  });

  it.each(Object.values(ButtonSize))("renders with size %s", (size) => {
    render(<Button {...baseProps} size={size} />);
    expect(screen.getByTestId("button")).toHaveAttribute("data-size", size);
  });

  it("renders primary button", () => {
    render(<Button {...baseProps} primary />);
    expect(screen.getByTestId("button").className).toContain("primary");
  });

  it("renders with hover state", () => {
    render(<Button {...baseProps} isHovered />);
    expect(screen.getByTestId("button").className).toContain("isHovered");
  });

  it("renders with clicked state", () => {
    render(<Button {...baseProps} isClicked />);
    expect(screen.getByTestId("button").className).toContain("isClicked");
  });

  it("renders with scale", () => {
    render(<Button {...baseProps} scale />);
    expect(screen.getByTestId("button").className).toContain("scale");
  });

  it("handles keyboard interaction", async () => {
    const user = userEvent.setup();
    render(<Button {...baseProps} />);

    const button = screen.getByTestId("button");
    await user.tab();
    expect(button).toHaveFocus();

    await user.keyboard("{enter}");
    expect(baseProps.onClick).toHaveBeenCalledTimes(1);

    await user.keyboard(" ");
    expect(baseProps.onClick).toHaveBeenCalledTimes(2);
  });
});
