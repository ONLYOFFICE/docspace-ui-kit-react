import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ToggleButton } from ".";

describe("<ToggleButton />", () => {
  const defaultProps = {
    isChecked: false,
    onChange: vi.fn(),
    label: "Toggle me",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders without error", () => {
    render(<ToggleButton {...defaultProps} />);
    expect(screen.getByTestId("toggle-button")).toBeInTheDocument();
  });

  it("renders with label", () => {
    render(<ToggleButton {...defaultProps} />);
    const label = screen.getByTestId("toggle-button-label");
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent("Toggle me");
  });

  it("renders without label when not provided", () => {
    render(<ToggleButton {...defaultProps} label={undefined} />);
    expect(screen.queryByTestId("toggle-button-label")).not.toBeInTheDocument();
  });

  it("handles checked state correctly", () => {
    render(<ToggleButton {...defaultProps} isChecked />);
    const input = screen.getByTestId("toggle-button-input") as HTMLInputElement;
    expect(input.checked).toBe(true);
  });

  it("calls onChange when clicked", async () => {
    const onChange = vi.fn();
    render(<ToggleButton {...defaultProps} onChange={onChange} />);

    const toggle = screen.getByTestId("toggle-button-input");
    await userEvent.click(toggle);

    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("respects disabled state", () => {
    render(<ToggleButton {...defaultProps} isDisabled />);
    const input = screen.getByTestId("toggle-button-input");
    expect(input).toBeDisabled();
  });

  it("prevents interaction when disabled", async () => {
    const onChange = vi.fn();
    render(<ToggleButton {...defaultProps} onChange={onChange} isDisabled />);

    const toggle = screen.getByTestId("toggle-button-input");
    await userEvent.click(toggle);

    expect(onChange).not.toHaveBeenCalled();
  });

  it("applies custom className", () => {
    render(<ToggleButton {...defaultProps} className="custom-class" />);
    const container = screen.getByTestId("toggle-button-container");
    expect(container).toHaveClass("custom-class");
  });

  it("applies custom styles", () => {
    const customStyle = { marginTop: "10px" };
    render(<ToggleButton {...defaultProps} style={customStyle} />);
    const container = screen.getByTestId("toggle-button-container");
    expect(container).toHaveStyle(customStyle);
  });

  it("sets name attribute correctly", () => {
    render(<ToggleButton {...defaultProps} name="toggle-name" />);
    const input = screen.getByTestId("toggle-button-input");
    expect(input).toHaveAttribute("name", "toggle-name");
  });

  it("applies font styling correctly", () => {
    render(<ToggleButton {...defaultProps} fontWeight={600} fontSize="16px" />);
    const label = screen.getByTestId("toggle-button-label");
    expect(label).toHaveStyle({
      fontWeight: "600",
      fontSize: "16px",
    });
  });
});
