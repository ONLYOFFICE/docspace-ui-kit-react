import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { HeaderButtons } from "./HeaderButtons";

// Mock SCSS
vi.mock("../../Calendar.module.scss", () => ({
  default: {
    buttonsContainer: "buttonsContainer",
    roundButton: "roundButton",
    disabled: "disabled",
    arrowIcon: "arrowIcon",
    prev: "prev",
    next: "next",
  },
}));

describe("HeaderButtons Component", () => {
  const mockOnLeftClick = vi.fn();
  const mockOnRightClick = vi.fn();

  const defaultProps = {
    onLeftClick: mockOnLeftClick,
    onRightClick: mockOnRightClick,
    isLeftDisabled: false,
    isRightDisabled: false,
    isMobile: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render both buttons", () => {
    render(<HeaderButtons {...defaultProps} />);

    const prevButton = screen.getByLabelText("Previous");
    const nextButton = screen.getByLabelText("Next");

    expect(prevButton).toBeDefined();
    expect(nextButton).toBeDefined();
  });

  it("should call onLeftClick when previous button is clicked", () => {
    render(<HeaderButtons {...defaultProps} />);

    const prevButton = screen.getByLabelText("Previous");
    fireEvent.click(prevButton);

    expect(mockOnLeftClick).toHaveBeenCalledTimes(1);
  });

  it("should call onRightClick when next button is clicked", () => {
    render(<HeaderButtons {...defaultProps} />);

    const nextButton = screen.getByLabelText("Next");
    fireEvent.click(nextButton);

    expect(mockOnRightClick).toHaveBeenCalledTimes(1);
  });

  it("should disable previous button when isLeftDisabled is true", () => {
    render(<HeaderButtons {...defaultProps} isLeftDisabled={true} />);

    const prevButton = screen.getByLabelText("Previous");
    expect(prevButton).toBeDisabled();
  });

  it("should disable next button when isRightDisabled is true", () => {
    render(<HeaderButtons {...defaultProps} isRightDisabled={true} />);

    const nextButton = screen.getByLabelText("Next");
    expect(nextButton).toBeDisabled();
  });

  it("should not call onLeftClick when previous button is disabled", () => {
    render(<HeaderButtons {...defaultProps} isLeftDisabled={true} />);

    const prevButton = screen.getByLabelText("Previous");
    fireEvent.click(prevButton);

    expect(mockOnLeftClick).not.toHaveBeenCalled();
  });

  it("should not call onRightClick when next button is disabled", () => {
    render(<HeaderButtons {...defaultProps} isRightDisabled={true} />);

    const nextButton = screen.getByLabelText("Next");
    fireEvent.click(nextButton);

    expect(mockOnRightClick).not.toHaveBeenCalled();
  });

  it("should apply mobile margin when isMobile is true", () => {
    render(<HeaderButtons {...defaultProps} isMobile={true} />);

    const prevButton = screen.getByLabelText("Previous");
    expect(prevButton.style.marginInlineEnd).toBe("12px");
  });

  it("should apply desktop margin when isMobile is false", () => {
    render(<HeaderButtons {...defaultProps} isMobile={false} />);

    const prevButton = screen.getByLabelText("Previous");
    expect(prevButton.style.marginInlineEnd).toBe("8px");
  });

  it("should have correct CSS classes", () => {
    render(<HeaderButtons {...defaultProps} />);

    const prevButton = screen.getByLabelText("Previous");
    const nextButton = screen.getByLabelText("Next");

    expect(prevButton.className).toContain("roundButton");
    expect(prevButton.className).toContain("arrow-previous");
    expect(nextButton.className).toContain("roundButton");
    expect(nextButton.className).toContain("arrow-next");
  });

  it("should add disabled class when buttons are disabled", () => {
    render(
      <HeaderButtons
        {...defaultProps}
        isLeftDisabled={true}
        isRightDisabled={true}
      />,
    );

    const prevButton = screen.getByLabelText("Previous");
    const nextButton = screen.getByLabelText("Next");

    expect(prevButton.className).toContain("disabled");
    expect(nextButton.className).toContain("disabled");
  });
});
