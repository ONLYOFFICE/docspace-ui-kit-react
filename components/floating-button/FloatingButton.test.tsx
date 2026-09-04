import React from "react";
import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent, render } from "@testing-library/react";
import { FloatingButton } from ".";
import { FloatingButtonIcons } from "./FloatingButton.enums";

describe("FloatingButton", () => {
  const defaultProps = {
    icon: FloatingButtonIcons.upload,
    percent: 5,
  };

  const renderComponent = (ui: React.ReactNode) => {
    return render(ui);
  };

  it("renders without crashing", () => {
    renderComponent(<FloatingButton {...defaultProps} />);
    const button = screen.getByTestId("floating-button");
    expect(button).toBeInTheDocument();
  });

  it("renders with custom className", () => {
    const className = "custom-class";
    renderComponent(<FloatingButton {...defaultProps} className={className} />);
    expect(screen.getByTestId("floating-button")).toHaveClass(className);
  });

  it("renders with custom style", () => {
    const style = { marginTop: "10px" };
    renderComponent(<FloatingButton {...defaultProps} style={style} />);
    const button = screen.getByTestId("floating-button");
    expect(button).toHaveStyle({ marginTop: "10px" });
  });

  it("handles click events", () => {
    const onClick = vi.fn();
    renderComponent(<FloatingButton {...defaultProps} onClick={onClick} />);

    const button = screen.getByTestId("floating-button");
    fireEvent.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("displays alert when alert prop is true", () => {
    renderComponent(<FloatingButton {...defaultProps} alert />);
    const alertIcon = screen.getByTestId("floating-button-alert");
    expect(alertIcon).toBeInTheDocument();
  });

  it("displays the stopped status icon when stopped prop is true", () => {
    renderComponent(<FloatingButton {...defaultProps} stopped />);

    expect(
      screen.getByTestId("floating-button-stopped-icon"),
    ).toBeInTheDocument();
  });

  it("keeps the stopped status icon for a completed stopped operation", () => {
    renderComponent(<FloatingButton {...defaultProps} completed stopped />);

    expect(
      screen.getByTestId("floating-button-stopped-icon"),
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId("floating-button-tick-icon"),
    ).not.toBeInTheDocument();
  });

  it("prefers the stopped status icon over the alert one", () => {
    renderComponent(
      <FloatingButton {...defaultProps} completed stopped alert />,
    );

    expect(
      screen.getByTestId("floating-button-stopped-icon"),
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId("floating-button-alert-icon"),
    ).not.toBeInTheDocument();
  });

  it("hides the stopped status icon when withoutStatus is true", () => {
    renderComponent(
      <FloatingButton {...defaultProps} completed stopped withoutStatus />,
    );

    expect(
      screen.queryByTestId("floating-button-stopped-icon"),
    ).not.toBeInTheDocument();
  });

  it("shows progress indicator when percent > 0", () => {
    renderComponent(<FloatingButton {...defaultProps} />);
    const progress = screen.getByTestId("floating-button-progress");
    expect(progress).toBeInTheDocument();
  });

  it("renders different icons correctly", () => {
    Object.values(FloatingButtonIcons).forEach((icon) => {
      renderComponent(<FloatingButton {...defaultProps} icon={icon} />);

      const iconElement = screen.getByTestId(`icon-${icon}`);
      expect(iconElement).toBeInTheDocument();
    });
  });

  it("calls clearUploadedFilesHistory after close icon click", () => {
    const clearUploadedFilesHistory = vi.fn();
    renderComponent(
      <FloatingButton
        {...defaultProps}
        showCancelButton
        clearUploadedFilesHistory={clearUploadedFilesHistory}
      />,
    );

    const button = screen.getByTestId("floating-button-close-icon");
    fireEvent.click(button);

    expect(clearUploadedFilesHistory).toHaveBeenCalledTimes(1);
  });

  describe("accessibility", () => {
    it("has correct ARIA attributes", () => {
      renderComponent(<FloatingButton {...defaultProps} />);
      const button = screen.getByTestId("floating-button");

      expect(button).toHaveAttribute("data-role", "button");
      expect(button).toHaveAttribute(
        "aria-label",
        `${defaultProps.icon} button`,
      );
    });

    it("is keyboard accessible", () => {
      const onClick = vi.fn();
      renderComponent(<FloatingButton {...defaultProps} onClick={onClick} />);

      const button = screen.getByTestId("floating-button");
      fireEvent.keyPress(button, { key: "Enter", code: 13, charCode: 13 });

      expect(onClick).toHaveBeenCalledTimes(0);
    });
  });
});
