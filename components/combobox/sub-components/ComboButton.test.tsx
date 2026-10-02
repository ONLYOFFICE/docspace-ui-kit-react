import { describe, it, expect, afterEach, vi } from "vitest";
import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ComboButton } from "./ComboButton";
import { ComboBoxSize } from "../ComboBox.enums";
import type { TCombobox, TOption } from "../ComboBox.types";

import styles from "./ComboButton.module.scss";

describe("ComboButton", () => {
  const baseProps = {
    selectedOption: {
      key: 1,
      label: "Test Option",
    } as TOption,
    onClick: vi.fn(),
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders without error with minimal props", () => {
    render(<ComboButton {...baseProps} />);
    expect(screen.getByText("Test Option")).toBeInTheDocument();
  });

  it("handles click events", async () => {
    const user = userEvent.setup();
    render(<ComboButton {...baseProps} />);
    const button = screen.getByText("Test Option").closest(".combo-button");
    if (!button) throw new Error("Button not found");
    await user.click(button);
    expect(baseProps.onClick).toHaveBeenCalledTimes(1);
  });

  it("renders disabled state correctly", () => {
    render(<ComboButton {...baseProps} isDisabled />);
    const button = screen.getByText("Test Option").closest(".combo-button");
    expect(button).toHaveAttribute("aria-disabled", "true");
  });

  it("renders with different sizes", () => {
    const { rerender } = render(
      <ComboButton {...baseProps} size={ComboBoxSize.base} />,
    );
    expect(screen.getByText("Test Option")).toBeInTheDocument();

    rerender(<ComboButton {...baseProps} size={ComboBoxSize.middle} />);
    expect(screen.getByText("Test Option")).toBeInTheDocument();

    rerender(<ComboButton {...baseProps} size={ComboBoxSize.content} />);
    expect(screen.getByText("Test Option")).toBeInTheDocument();
  });

  it("renders with loading state", () => {
    render(<ComboButton {...baseProps} isLoading />);
    const button = screen.getByText("Test Option").closest(".combo-button");
    expect(button).toBeInTheDocument();
  });

  it("renders with modern view", () => {
    render(<ComboButton {...baseProps} modernView />);
    const button = screen.getByText("Test Option").closest(".combo-button");
    expect(button).toHaveClass(styles.modernView);
  });

  it("renders with open state", () => {
    render(<ComboButton {...baseProps} isOpen />);
    const button = screen.getByText("Test Option").closest(".combo-button");
    expect(button).toHaveAttribute("aria-expanded", "true");
  });

  it("renders with plus badge", () => {
    render(<ComboButton {...baseProps} plusBadgeValue={5} />);
    expect(screen.getByText("+5")).toBeInTheDocument();
  });

  it("renders without border", () => {
    render(<ComboButton {...baseProps} noBorder />);
    const button = screen.getByText("Test Option").closest(".combo-button");
    expect(button).toHaveClass(styles.noBorder);
  });

  it("renders with custom tab index", () => {
    render(<ComboButton {...baseProps} tabIndex={-1} />);
    const button = screen.getByText("Test Option").closest(".combo-button");
    expect(button).toHaveAttribute("tabindex", "-1");
  });

  it("renders badge type correctly", () => {
    const props = {
      ...baseProps,
      type: "badge" as TCombobox,
      selectedOption: {
        key: 1,
        label: "Test Option",
        color: "#000",
        backgroundColor: "#fff",
        border: "#ccc",
      } as TOption,
    };
    render(<ComboButton {...props} />);
    expect(screen.getByText("Test Option")).toBeInTheDocument();
  });

  it("renders descriptive type correctly", () => {
    const props = {
      ...baseProps,
      type: "descriptive" as TCombobox,
      selectedOption: {
        key: 1,
        label: "Test Option",
        description: "Test Description",
      } as TOption,
    };
    render(<ComboButton {...props} />);
    expect(screen.getByText("Test Option")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
  });

  it("renders with advanced options", () => {
    render(<ComboButton {...baseProps} withAdvancedOptions />);
    const button = screen.getByText("Test Option").closest(".combo-button");
    if (!button) throw new Error("Button not found");
    const arrowIcon = button.querySelector(".combo-buttons_arrow-icon");
    expect(arrowIcon).toBeInTheDocument();
  });

  it("renders with custom icon", () => {
    const mockIcon = "test-icon.svg";
    render(<ComboButton {...baseProps} comboIcon={mockIcon} />);
    const button = screen.getByText("Test Option").closest(".combo-button");
    if (!button) throw new Error("Button not found");
    const expanderIcon = button.querySelector(".combo-buttons_expander-icon");
    expect(expanderIcon).toBeInTheDocument();
  });

  it("renders with scaled option", () => {
    render(<ComboButton {...baseProps} scaled />);
    expect(screen.getByText("Test Option")).toBeInTheDocument();
  });
});
