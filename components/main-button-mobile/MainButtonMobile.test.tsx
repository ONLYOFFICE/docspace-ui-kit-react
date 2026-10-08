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

  it("reports opening through onOpen and closing through onClose only", () => {
    const onOpen = vi.fn();
    const onClose = vi.fn();
    render(
      <MainButtonMobile
        buttonOptions={buttonOptions}
        onOpen={onOpen}
        onClose={onClose}
      />,
    );
    const button = screen.getByTestId("floating-button");
    expect(button).toHaveAttribute("aria-haspopup", "menu");
    expect(button).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(button);
    expect(onOpen).toHaveBeenCalledTimes(1);
    expect(onClose).not.toHaveBeenCalled();
    expect(button).toHaveAttribute("aria-expanded", "true");

    fireEvent.click(button);
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("closes on Escape, reporting it", () => {
    const onClose = vi.fn();
    render(
      <MainButtonMobile
        buttonOptions={buttonOptions}
        opened
        onClose={onClose}
      />,
    );
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("floating-button")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("marks the sheet as a menu of menu items", () => {
    render(<MainButtonMobile buttonOptions={buttonOptions} opened />);
    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(screen.getAllByRole("menuitem")).toHaveLength(2);
  });

  it("chooses the focused item with Enter", () => {
    render(<MainButtonMobile buttonOptions={buttonOptions} opened />);
    const [first] = screen.getAllByRole("menuitem");
    first.focus();
    fireEvent.keyDown(first, { key: "Enter" });
    expect(buttonOptions[0].onClick).toHaveBeenCalledTimes(1);
  });

  it("makes the alert badge a named button only with withAlertClick", () => {
    const onAlertClick = vi.fn();
    const { rerender } = render(
      <MainButtonMobile alert withAlertClick onAlertClick={onAlertClick} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Alert" }));
    expect(onAlertClick).toHaveBeenCalledTimes(1);

    rerender(<MainButtonMobile alert onAlertClick={onAlertClick} />);
    expect(screen.queryByRole("button", { name: "Alert" })).toBeNull();
    expect(screen.getByRole("img", { name: "Alert" })).toBeInTheDocument();
  });
});
