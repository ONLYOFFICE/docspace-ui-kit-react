import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MobileDetails } from ".";

describe("MobileDetails", () => {
  const defaultProps = {
    icon: "test-icon",
    title: "Test Title",
    isError: false,
    isPreviewFile: false,
    isPublicFile: false,
    onHide: vi.fn(),
    onMaskClick: vi.fn(),
    onContextMenu: vi.fn(),
    contextModel: vi.fn(),
  };

  const setup = (props = {}) => {
    return render(<MobileDetails {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not render back button when isPublicFile is true", () => {
    setup({ isPublicFile: true });

    expect(screen.queryByTestId("mobile-details-back")).not.toBeInTheDocument();
  });

  it("does not render context menu when isPreviewFile is true", () => {
    setup({ isPreviewFile: true });

    expect(
      screen.queryByTestId("mobile-details-context"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("mobile-details-context-menu"),
    ).not.toBeInTheDocument();
  });

  it("does not render context menu when isError is true", () => {
    setup({ isError: true });

    expect(
      screen.queryByTestId("mobile-details-context"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("mobile-details-context-menu"),
    ).not.toBeInTheDocument();
  });
});
