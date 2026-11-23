import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ViewerLoader } from "./index";
import styles from "./ViewerLoader.module.scss";

describe("ViewerLoader", () => {
  const defaultProps = {
    isLoading: true,
    isError: false,
    withBackground: false,
    onClick: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loader when isLoading is true", () => {
    render(<ViewerLoader {...defaultProps} />);

    const loader = screen.getByTestId("viewer-loader");
    expect(loader).toBeInTheDocument();
    expect(loader).toHaveAttribute("role", "progressbar");
    expect(loader).toHaveAttribute("aria-label", "Loading content");
  });

  it("does not render when isLoading is false", () => {
    render(<ViewerLoader {...defaultProps} isLoading={false} />);
    expect(screen.queryByTestId("viewer-loader")).not.toBeInTheDocument();
  });

  it("does not render when isError is true", () => {
    render(<ViewerLoader {...defaultProps} isError />);
    expect(screen.queryByTestId("viewer-loader")).not.toBeInTheDocument();
  });

  it("adds background class when withBackground is true", () => {
    render(<ViewerLoader {...defaultProps} withBackground />);
    const wrapper = screen.getByTestId("viewer-loader-wrapper");
    expect(wrapper).toHaveClass(styles.withBackground);
  });

  it("handles click events", () => {
    render(<ViewerLoader {...defaultProps} />);
    const wrapper = screen.getByTestId("viewer-loader-wrapper");
    fireEvent.click(wrapper);
    expect(defaultProps.onClick).toHaveBeenCalled();
  });
});
