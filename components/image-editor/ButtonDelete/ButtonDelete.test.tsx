import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import ButtonDelete from "./index";

vi.mock("../../../assets/icons/16/trash.react.svg", () => ({
  __esModule: true,
  default: () => <svg data-testid="trash-icon" />,
}));

const mockT = vi.fn((key: string) => key);

describe("ButtonDelete", () => {
  it("renders tooltip title with translation", () => {
    render(<ButtonDelete t={mockT} onClick={vi.fn()} />);

    const button = screen.getByTestId("cropper_delete_button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("title", "Common:Delete");
    expect(mockT).toHaveBeenCalledWith("Common:Delete");
  });

  it("renders delete text and icon", () => {
    render(<ButtonDelete t={mockT} onClick={vi.fn()} />);

    expect(screen.getByText("Common:Delete")).toBeInTheDocument();
    expect(screen.getByTestId("trash-icon")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<ButtonDelete t={mockT} onClick={vi.fn()} className="custom" />);

    const button = screen.getByTestId("cropper_delete_button");
    expect(button).toHaveClass("custom");
  });

  it("calls onClick handler", () => {
    const handleClick = vi.fn();

    render(<ButtonDelete t={mockT} onClick={handleClick} />);

    fireEvent.click(screen.getByTestId("cropper_delete_button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
