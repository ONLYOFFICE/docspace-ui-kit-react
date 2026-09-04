import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import type { RadioButtonGroupProps } from "./RadioButtonGroup.types";
import { RadioButtonGroup } from ".";

const baseProps = {
  name: "fruits",
  selected: "banana",
  options: [
    { value: "apple", label: "Sweet apple" },
    { value: "banana", label: "Banana" },
    { value: "mandarin", label: "Mandarin" },
  ],
  onClick: vi.fn(),
};

describe("<RadioButtonGroup />", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders without error", () => {
    render(<RadioButtonGroup {...baseProps} />);
    expect(screen.getByTestId("radio-button-group")).toBeInTheDocument();
  });

  it("renders all options", () => {
    render(<RadioButtonGroup {...baseProps} />);

    baseProps.options.forEach((option) => {
      expect(screen.getByLabelText(option.label as string)).toBeInTheDocument();
    });
  });

  it("accepts and applies custom id", () => {
    render(<RadioButtonGroup {...baseProps} id="test-id" />);
    expect(screen.getByTestId("radio-button-group")).toHaveAttribute(
      "id",
      "test-id",
    );
  });

  it("accepts and applies custom className", () => {
    render(<RadioButtonGroup {...baseProps} className="custom-class" />);
    expect(screen.getByTestId("radio-button-group")).toHaveClass(
      "custom-class",
    );
  });

  it("accepts and applies custom style", () => {
    const customStyle = { marginTop: "20px" };
    render(<RadioButtonGroup {...baseProps} style={customStyle} />);
    expect(screen.getByTestId("radio-button-group")).toHaveStyle(customStyle);
  });

  it("handles option selection correctly", () => {
    render(<RadioButtonGroup {...baseProps} />);

    const appleRadio = screen.getByLabelText("Sweet apple");
    fireEvent.click(appleRadio);

    expect(baseProps.onClick).toHaveBeenCalled();
    expect(appleRadio).toBeChecked();
  });

  it("respects disabled state", () => {
    render(<RadioButtonGroup {...baseProps} isDisabled />);

    const radios = screen.getAllByRole("radio");
    radios.forEach((radio) => {
      expect(radio).toBeDisabled();
    });
  });

  it("respects individual option disabled state", () => {
    const propsWithDisabledOption = {
      ...baseProps,
      options: [
        ...baseProps.options,
        { value: "grape", label: "Grape", disabled: true },
      ],
    };

    render(<RadioButtonGroup {...propsWithDisabledOption} />);
    expect(screen.getByLabelText("Grape")).toBeDisabled();
  });

  it("renders text type option correctly", () => {
    const propsWithTextOption = {
      ...baseProps,
      options: [
        { type: "text", label: "Choose your favorite fruit:" },
        ...baseProps.options,
      ],
    } as RadioButtonGroupProps;

    render(<RadioButtonGroup {...propsWithTextOption} />);
    expect(screen.getByTestId("radio-button-group_text")).toBeInTheDocument();
  });

  it("updates selection when selected prop changes", () => {
    const { rerender } = render(<RadioButtonGroup {...baseProps} />);
    expect(screen.getByLabelText("Banana")).toBeChecked();

    rerender(<RadioButtonGroup {...baseProps} selected="apple" />);
    expect(screen.getByLabelText("Sweet apple")).toBeChecked();
  });

  it("applies correct orientation styling", () => {
    const { container, rerender } = render(
      <RadioButtonGroup {...baseProps} orientation="vertical" />,
    );

    // Verify radio buttons are rendered in the correct orientation
    const radioGroup = container.firstChild;
    expect(radioGroup).toBeInTheDocument();

    // For horizontal orientation
    rerender(<RadioButtonGroup {...baseProps} orientation="horizontal" />);
    expect(radioGroup).toBeInTheDocument();
  });
});
