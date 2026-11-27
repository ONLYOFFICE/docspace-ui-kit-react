import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { TableContainer } from "./TableContainer";

describe("<TableContainer />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("puts a passed aria-* on the container", () => {
    render(
      <TableContainer
        useReactWindow
        forwardedRef={{ current: null }}
        aria-label="Files"
      />,
    );
    expect(screen.getByTestId("table-container")).toHaveAttribute(
      "aria-label",
      "Files",
    );
  });

  it("renders without errors", () => {
    render(<TableContainer useReactWindow forwardedRef={{ current: null }} />);
    expect(screen.getByTestId("table-container")).toBeInTheDocument();
  });

  it("pass className", () => {
    const className = "custom-class";
    render(
      <TableContainer
        useReactWindow
        forwardedRef={{ current: null }}
        className={className}
      />,
    );
    expect(screen.getByTestId("table-container")).toHaveClass(className);
  });
});
