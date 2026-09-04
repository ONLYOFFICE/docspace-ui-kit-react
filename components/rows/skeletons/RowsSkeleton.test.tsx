import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import { RowsSkeleton } from "./RowsSkeleton";
import { RowSkeleton } from "./RowSkeleton";
import styles from "./RowsSkeleton.module.scss";

describe("RowsSkeleton", () => {
  it("renders with default count", () => {
    render(<RowsSkeleton count={3} />);

    const container = screen.getByTestId("rows-skeleton");
    const rows = container.querySelectorAll(`.${styles.row}`);
    expect(rows).toHaveLength(3);
  });

  it("passes props to row components", () => {
    const props = {
      count: 1,
      isRectangle: true,
      title: "Test Row",
    };

    render(<RowsSkeleton {...props} />);

    const row = screen.getByTestId("row-skeleton");
    expect(row).toHaveClass(styles.row);
  });
});

describe("RowSkeleton", () => {
  it("renders rectangle by default", () => {
    render(<RowSkeleton />);

    const row = screen.getByTestId("row-skeleton");
    const rectangle = row.querySelector(".rectangle-content");
    expect(rectangle).toBeInTheDocument();
  });
});
