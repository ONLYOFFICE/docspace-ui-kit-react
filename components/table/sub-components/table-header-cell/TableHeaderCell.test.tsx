import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { TableHeaderCell } from "./TableHeaderCell";
import { SortByFieldName } from "../../../../enums";

const mockColumn = {
  key: "name",
  title: "Name",
  enable: true,
  sortBy: SortByFieldName.Name,
  minWidth: 200,
  resizable: false,
  onClick: vi.fn(),
};

const defaultProps = {
  column: mockColumn,
  index: 0,
  onMouseDown: vi.fn(),
  resizable: false,
  sortBy: SortByFieldName.Author,
  sorted: true,
  sortingVisible: true,
};

describe("<TableHeaderCell />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders without errors", () => {
    render(<TableHeaderCell {...defaultProps} />);

    expect(screen.getByTestId("table-header-cell")).toBeInTheDocument();
  });

  it("renders checkbox if column has checkbox and its value is true", () => {
    render(
      <TableHeaderCell
        {...defaultProps}
        column={{
          ...mockColumn,
          checkbox: {
            value: true,
            isIndeterminate: false,
            onChange: () => {},
          },
        }}
      />,
    );

    expect(screen.getByTestId("checkbox")).toBeInTheDocument();
  });

  it("renders with resize handle", () => {
    render(<TableHeaderCell {...defaultProps} resizable />);

    expect(screen.getByTestId("resize-handle")).toBeInTheDocument();
  });

  it("calls onMouseDown when resize handle is clicked", async () => {
    render(<TableHeaderCell {...defaultProps} resizable />);

    const resizeHandle = screen.getByTestId("resize-handle");
    await userEvent.click(resizeHandle);

    expect(defaultProps.onMouseDown).toHaveBeenCalled();
  });

  it("show sort icon if sortingVisible is true ", async () => {
    render(<TableHeaderCell {...defaultProps} sortingVisible />);

    expect(screen.getByTestId("sort-icon")).toBeInTheDocument();
  });

  it("doesn't show sort icon if sortingVisible is false", async () => {
    render(<TableHeaderCell {...defaultProps} sortingVisible={false} />);

    const tableHeaderCell = screen.getByTestId("table-header-cell");
    await userEvent.hover(tableHeaderCell);

    expect(screen.queryByTestId("sort-icon")).not.toBeInTheDocument();
  });

  it("pass defaultSize to data-default-size attribute", async () => {
    const defaultSize = 100;
    render(<TableHeaderCell {...defaultProps} defaultSize={defaultSize} />);

    expect(screen.getByTestId("table-header-cell")).toHaveAttribute(
      "data-default-size",
      String(defaultSize),
    );
  });

  it("generate correct id from index prop", async () => {
    const index = 3;
    render(<TableHeaderCell {...defaultProps} index={index} />);

    expect(screen.getByTestId("table-header-cell")).toHaveAttribute(
      "id",
      `column_${index}`,
    );
  });
});