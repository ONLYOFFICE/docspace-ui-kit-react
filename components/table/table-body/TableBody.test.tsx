import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { TableBody } from "./TableBody";
import { TableCell } from "../sub-components/table-cell";

vi.mock("../../infinite-loader", () => ({
  InfiniteLoaderComponent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="infinite-loader">{children}</div>
  ),
}));

describe("<TableBody />", () => {
  const defaultProps = {
    columnStorageName: "test-column-storage",
    columnInfoPanelStorageName: "test-info-panel-storage",
    filesLength: 10,
    itemCount: 20,
    fetchMoreFiles: vi.fn(),
    hasMoreFiles: true,
    useReactWindow: true,
    itemHeight: 50,
    children: [<TableCell key="1">Cell</TableCell>],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders without errors", () => {
    render(<TableBody {...defaultProps} />);
    expect(screen.getByTestId("table-body")).toBeInTheDocument();
  });

  it("renders children in InfiniteLoaderComponent when useReactWindow is true (default)", () => {
    render(<TableBody {...defaultProps} />);

    expect(screen.getByTestId("infinite-loader")).toBeInTheDocument();
    expect(screen.getByText("Cell")).toBeInTheDocument();
  });

  it("renders children without InfiniteLoaderComponent when useReactWindow is false", () => {
    const props = { ...defaultProps, useReactWindow: false };
    const { queryByTestId } = render(<TableBody {...props} />);

    expect(queryByTestId("infinite-loader")).not.toBeInTheDocument();
    expect(screen.getByText("Cell")).toBeInTheDocument();
  });
});
