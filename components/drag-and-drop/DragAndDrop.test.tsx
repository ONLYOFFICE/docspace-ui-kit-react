import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import DragAndDrop from "./DragAndDrop";

describe("DragAndDrop", () => {
  const mockOnDrop = vi.fn();
  const defaultProps = {
    onDrop: mockOnDrop,
    children: <div>Drop files here</div>,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders children correctly", () => {
    render(<DragAndDrop {...defaultProps} />);
    expect(screen.getByText("Drop files here")).toBeInTheDocument();
  });

  // The wrapper spans whole sections and rows and opens nothing, so it must
  // not be a Tab stop announced as a button. The portal still focuses the
  // section body from script, so it keeps tabIndex -1.
  it("is neither a Tab stop nor a button, but can take focus from script", () => {
    render(<DragAndDrop {...defaultProps} />);
    const root = screen.getByText("Drop files here").parentElement;

    expect(root).toHaveAttribute("tabindex", "-1");
    root?.focus();
    expect(root).toHaveFocus();
    expect(root).toHaveAttribute("role", "presentation");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
