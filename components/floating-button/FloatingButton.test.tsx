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

    it("is a keyboard-operable button when it has onClick", () => {
      const onClick = vi.fn();
      renderComponent(<FloatingButton {...defaultProps} onClick={onClick} />);

      const button = screen.getByRole("button", { name: "upload button" });
      expect(button).toHaveAttribute("tabindex", "0");

      fireEvent.keyDown(button, { key: "Enter" });
      fireEvent.keyDown(button, { key: " " });

      expect(onClick).toHaveBeenCalledTimes(2);
    });

    it("is not a button without onClick", () => {
      renderComponent(<FloatingButton {...defaultProps} />);
      expect(screen.queryByRole("button")).toBeNull();
    });

    it("takes its name from label", () => {
      renderComponent(
        <FloatingButton {...defaultProps} onClick={vi.fn()} label="Uploads" />,
      );
      expect(
        screen.getByRole("button", { name: "Uploads" }),
      ).toBeInTheDocument();
    });

    it("reports the percent through a progress bar", () => {
      const { rerender } = renderComponent(
        <FloatingButton {...defaultProps} percent={45} />,
      );
      const bar = screen.getByRole("progressbar", { name: "upload button" });
      expect(bar).toHaveAttribute("aria-valuenow", "45");

      rerender(<FloatingButton {...defaultProps} percent={undefined} />);
      expect(bar).not.toHaveAttribute("aria-valuenow");

      rerender(<FloatingButton {...defaultProps} completed />);
      expect(bar).toHaveAttribute("aria-valuenow", "100");
    });

    // The portal starts every operation at percent 0 and many never report
    // a value in between: 0 has to keep the spinner, or they look stalled.
    it("spins the ring at percent 0, as for an unknown progress", () => {
      renderComponent(<FloatingButton {...defaultProps} percent={0} />);
      const ring = screen.getByTestId("floating-button-progress")
        .firstElementChild as HTMLElement;
      expect(ring.style.getPropertyValue("--percent-percentage")).toBe("");
      expect(screen.getByRole("progressbar")).not.toHaveAttribute(
        "aria-valuenow",
      );
    });

    it("draws an arc for the first percent above 0", () => {
      renderComponent(<FloatingButton {...defaultProps} percent={1} />);
      const ring = screen.getByTestId("floating-button-progress")
        .firstElementChild as HTMLElement;
      expect(ring.style.getPropertyValue("--percent-percentage")).toBe("1%");
    });

    it("gives the cancel cross a name and a real button", () => {
      const clear = vi.fn();
      renderComponent(
        <FloatingButton
          {...defaultProps}
          showCancelButton
          clearUploadedFilesHistory={clear}
        />,
      );
      const cancel = screen.getByRole("button", { name: "Cancel" });
      expect(cancel).toHaveAttribute("type", "button");
      fireEvent.click(cancel);
      expect(clear).toHaveBeenCalledTimes(1);
    });

    it("treats an iconUrl image as decorative", () => {
      renderComponent(<FloatingButton iconUrl="/icon.svg" />);
      expect(document.querySelector("img")).toHaveAttribute("alt", "");
    });
  });
});
