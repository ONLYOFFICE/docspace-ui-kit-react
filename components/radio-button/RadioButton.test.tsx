import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { RadioButton } from ".";

const baseProps = {
  name: "fruits",
  value: "apple",
  label: "Sweet apple",
};

const renderComponent = (props = {}) => {
  return render(<RadioButton {...baseProps} {...props} />);
};

describe("<RadioButton />", () => {
  it("renders without error", () => {
    renderComponent();
    expect(screen.getByTestId("radio-button")).toBeInTheDocument();
    expect(screen.getByText("Sweet apple")).toBeInTheDocument();
  });

  it("handles checked state correctly", () => {
    renderComponent({ isChecked: true });

    const radio = screen.getByRole("radio") as HTMLInputElement;
    expect(radio.checked).toBe(true);
  });

  it("calls onClick handler when clicked and onChange is not provided", () => {
    const onClick = vi.fn();
    renderComponent({ onClick, isChecked: false });

    const radio = screen.getByRole("radio");
    fireEvent.click(radio);
    expect(onClick).toHaveBeenCalled();
  });

  it("applies disabled state correctly", () => {
    renderComponent({ isDisabled: true });

    const radio = screen.getByRole("radio") as HTMLInputElement;
    const label = screen.getByTestId("radio-button");

    expect(radio).toBeDisabled();
    expect(label.className).toContain("disabled");
  });

  it("accepts and applies custom className", () => {
    const className = "custom-radio";
    renderComponent({ className });

    const label = screen.getByTestId("radio-button");
    expect(label).toHaveClass(className);
  });

  it("accepts and applies custom styles", () => {
    const customStyle = { marginTop: "10px" };
    renderComponent({ style: customStyle });

    const label = screen.getByTestId("radio-button");
    expect(label.style.marginTop).toBe("10px");
  });

  it("handles orientation prop", () => {
    renderComponent({ orientation: "vertical" });
    const label = screen.getByTestId("radio-button");
    expect(label).toBeInTheDocument();
  });

  it("updates when isChecked prop changes", () => {
    const { rerender } = renderComponent({ isChecked: false });
    const radio = screen.getByRole("radio") as HTMLInputElement;
    expect(radio.checked).toBe(false);

    rerender(<RadioButton {...baseProps} isChecked />);
    expect(radio.checked).toBe(true);
  });

  it("has proper accessibility attributes", () => {
    const id = "test-radio";
    renderComponent({ id });

    const radio = screen.getByRole("radio");
    const label = screen.getByTestId("radio-button");

    expect(radio).toHaveAttribute("type", "radio");
    expect(label).toHaveAttribute("id", id);
  });

  it("calls onChange when provided", () => {
    const onChange = vi.fn();
    renderComponent({ onChange });

    const radio = screen.getByRole("radio");
    fireEvent.click(radio);
    expect(onChange).toHaveBeenCalled();
  });

  it("works without handlers", () => {
    renderComponent();
    const radio = screen.getByRole("radio");

    // Should not throw error when changed without handlers
    expect(() => {
      fireEvent.change(radio);
    }).not.toThrow();
  });

  it("updates internal state when changed", () => {
    const isChecked = false;
    renderComponent({ isChecked });
    const radio = screen.getByRole("radio") as HTMLInputElement;
    expect(radio.checked).toBe(isChecked);

    fireEvent.click(radio);
    expect(radio.checked).toBe(!isChecked);
  });
});
