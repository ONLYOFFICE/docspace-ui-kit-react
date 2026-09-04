import { describe, expect, it, afterEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { Aside } from ".";

describe("Aside Component", () => {
  const mockOnClose = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders without error when visible", () => {
    render(
      <Aside visible onClose={mockOnClose}>
        test content
      </Aside>,
    );

    expect(screen.getByTestId("aside")).toBeInTheDocument();
    expect(screen.getByText("test content")).toBeInTheDocument();
  });

  it("renders with custom styling props", () => {
    render(
      <Aside
        visible
        onClose={mockOnClose}
        scale
        zIndex={500}
        className="custom-class"
      >
        test content
      </Aside>,
    );

    const aside = screen.getByTestId("aside");
    expect(aside).toHaveClass("custom-class");
    expect(aside).toHaveStyle({ zIndex: 500 });
  });

  it("renders without header when withoutHeader is true", () => {
    render(
      <Aside visible onClose={mockOnClose} withoutHeader>
        test content
      </Aside>,
    );

    expect(screen.queryByTestId("aside-header")).not.toBeInTheDocument();
  });

  it("renders with scrollbar when content overflows", () => {
    const longContent = "a".repeat(1000);
    render(
      <Aside visible onClose={mockOnClose}>
        {longContent}
      </Aside>,
    );

    expect(screen.getByTestId("scrollbar")).toBeInTheDocument();
  });

  it("renders with withoutBodyScroll prop", () => {
    render(
      <Aside visible onClose={mockOnClose} withoutBodyScroll>
        test content
      </Aside>,
    );

    const aside = screen.getByTestId("aside");
    expect(aside).toBeInTheDocument();
  });
});
