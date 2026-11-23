import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import { DesktopDetails } from ".";

describe("DesktopDetails", () => {
  const defaultProps = {
    title: "Test Title",
    onMaskClick: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly with required props", () => {
    render(<DesktopDetails {...defaultProps} />);

    const container = screen.getByTestId("desktop-details");
    const title = screen.getByTestId("desktop-details-title");

    expect(container).toBeInTheDocument();
    expect(container).toHaveAttribute("role", "dialog");
    expect(container).toHaveAttribute("aria-labelledby", "media-viewer-title");
    expect(title).toHaveTextContent("Test Title");
  });

  it("renders with custom className", () => {
    const customClass = "custom-class";
    render(<DesktopDetails {...defaultProps} className={customClass} />);

    const container = screen.getByTestId("desktop-details");
    expect(container).toHaveClass(customClass);
  });

  it("does not render close button by default", () => {
    render(<DesktopDetails {...defaultProps} />);

    const closeButton = screen.queryByTestId("desktop-details-close");
    expect(closeButton).not.toBeInTheDocument();
  });

  it("renders close button when showCloseButton is true", () => {
    render(<DesktopDetails {...defaultProps} showCloseButton />);

    const closeButton = screen.getByTestId("desktop-details-close");
    expect(closeButton).toBeInTheDocument();
  });

  it("calls onMaskClick when close button is clicked", () => {
    render(<DesktopDetails {...defaultProps} showCloseButton />);

    const closeButton = screen.getByTestId("desktop-details-close");
    fireEvent.click(closeButton);

    expect(defaultProps.onMaskClick).toHaveBeenCalledTimes(1);
  });

  it("has proper accessibility attributes", () => {
    render(<DesktopDetails {...defaultProps} showCloseButton />);

    const container = screen.getByTestId("desktop-details");
    const title = screen.getByTestId("desktop-details-title");

    expect(container).toHaveAttribute("role", "dialog");
    expect(container).toHaveAttribute("aria-labelledby", "media-viewer-title");
    expect(title).toHaveAttribute("id", "media-viewer-title");
  });
});
