import React from "react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { screen, fireEvent, render } from "@testing-library/react";

import { MainButtonMobile } from ".";
import { ButtonOption } from "./MainButtonMobile.types";

describe("<MainButtonMobile />", () => {
  const mockOnClick = vi.fn();

  const buttonOptions: ButtonOption[] = [
    {
      key: "option1",
      label: "Option 1",
      onClick: vi.fn(),
    },
    {
      key: "option2",
      label: "Option 2",
      onClick: vi.fn(),
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders without error", () => {
    render(<MainButtonMobile />);
    expect(screen.getByTestId("main-button-mobile")).toBeInTheDocument();
  });

  it("renders with button options", () => {
    render(<MainButtonMobile buttonOptions={buttonOptions} opened />);
    expect(screen.getByTestId("dropdown")).toBeInTheDocument();
    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
  });

  it("handles main button click", () => {
    render(<MainButtonMobile onClick={mockOnClick} withMenu={false} />);
    const button = screen.getByTestId("floating-button");
    fireEvent.click(button);
    expect(mockOnClick).toHaveBeenCalled();
  });
});
