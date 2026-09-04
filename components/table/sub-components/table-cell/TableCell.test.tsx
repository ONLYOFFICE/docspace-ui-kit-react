import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import { TableCell } from "./TableCell";

describe("<TableCell />", () => {
  it("renders without errors", () => {
    render(<TableCell>Cell</TableCell>);

    expect(screen.getByTestId("table-cell")).toBeInTheDocument();
  });

  it("pass value for DnD", () => {
    const value = "DnD_Value";
    render(<TableCell value={value}>Cell</TableCell>);

    expect(screen.getByTestId("table-cell")).toHaveAttribute("value", value);
  });
});
