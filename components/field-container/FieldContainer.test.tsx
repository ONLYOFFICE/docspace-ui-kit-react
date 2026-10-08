import React from "react";
import { describe, it, expect } from "vitest";
import { screen, render } from "@testing-library/react";

import { FieldContainer } from "./FieldContainer";
import { InputSize, InputType, TextInput } from "../text-input";

describe("<FieldContainer />", () => {
  const defaultProps = {
    labelText: "Test Label:",
    labelVisible: true,
    isRequired: false,
    children: (
      <TextInput
        value=""
        onChange={() => {}}
        type={InputType.text}
        size={InputSize.base}
      />
    ),
  };

  it("renders without error", () => {
    render(<FieldContainer {...defaultProps} />);
    expect(screen.getByTestId("field-container")).toBeInTheDocument();
  });

  it("renders with correct label", () => {
    render(<FieldContainer {...defaultProps} />);
    expect(screen.getByText("Test Label:")).toBeInTheDocument();
  });

  it("marks the control, not the label, as required and invalid", () => {
    const { rerender } = render(
      <FieldContainer
        {...defaultProps}
        labelFor="field"
        isRequired
        hasError
        errorMessage="Fill this in"
      >
        <input id="field" />
      </FieldContainer>,
    );
    const label = screen.getByText("Test Label:");
    const input = screen.getByRole("textbox");
    expect(label).not.toHaveAttribute("aria-required");
    expect(input).toHaveAttribute("aria-required", "true");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Fill this in");

    rerender(
      <FieldContainer {...defaultProps} labelFor="field">
        <input id="field" />
      </FieldContainer>,
    );
    expect(input).not.toHaveAttribute("aria-required");
    expect(input).not.toHaveAttribute("aria-invalid");
    expect(input).not.toHaveAttribute("aria-describedby");
  });

  it("leaves a state the control already sets alone", () => {
    render(
      <FieldContainer {...defaultProps} isRequired hasError>
        <input aria-invalid="false" required />
      </FieldContainer>,
    );
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("aria-invalid", "false");
    expect(input).toHaveAttribute("aria-required", "true");
  });

  it("applies custom className", () => {
    const className = "custom-class";
    render(<FieldContainer {...defaultProps} className={className} />);
    expect(screen.getByTestId("field-container")).toHaveClass(className);
  });

  it("renders with custom id", () => {
    const id = "custom-id";
    render(<FieldContainer {...defaultProps} id={id} />);
    expect(screen.getByTestId("field-container")).toHaveAttribute("id", id);
  });

  it("renders tooltip when tooltipContent is provided", () => {
    const tooltipContent = "Help text";
    render(
      <FieldContainer tooltipContent={tooltipContent} {...defaultProps} />,
    );
    expect(screen.getByTestId("help-button")).toBeInTheDocument();
  });

  it("renders error message when hasError is true", () => {
    const errorMessage = "This field is required";
    render(
      <FieldContainer hasError errorMessage={errorMessage} {...defaultProps} />,
    );
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it("applies vertical layout when isVertical is true", () => {
    render(<FieldContainer isVertical {...defaultProps} />);
    expect(screen.getByTestId("field-container")).toHaveAttribute(
      "data-vertical",
      "true",
    );
  });

  it("hides label when labelVisible is false", () => {
    render(<FieldContainer {...defaultProps} labelVisible={false} />);
    expect(screen.queryByText("Test Label:")).not.toBeInTheDocument();
  });

  it("renders with custom maxLabelWidth", () => {
    const maxLabelWidth = "150px";
    render(<FieldContainer {...defaultProps} maxLabelWidth={maxLabelWidth} />);
    expect(screen.getByTestId("field-container")).toHaveAttribute(
      "data-label-width",
      maxLabelWidth,
    );
  });
});
