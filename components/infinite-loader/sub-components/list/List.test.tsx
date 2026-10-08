import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import ListComponent from "./List";

const mockLoadMoreItems = vi.fn(() => Promise.resolve());
const mockOnScroll = vi.fn();

const defaultProps = {
  viewAs: "row" as const,
  hasMoreFiles: false,
  filesLength: 10,
  itemCount: 10,
  loadMoreItems: mockLoadMoreItems,
  onScroll: mockOnScroll,
  itemSize: 50,
  children: Array(10)
    .fill(null)
    .map((_, i) => <div key={i}>Item {i}</div>),
  scroll: window,
  showSkeleton: false,
};

describe("ListComponent", () => {
  let rowContainer: HTMLDivElement;
  let tableContainer: HTMLDivElement;

  beforeEach(() => {
    rowContainer = document.createElement("div");
    rowContainer.id = "rowContainer";
    document.body.appendChild(rowContainer);
    vi.spyOn(rowContainer, "getBoundingClientRect").mockReturnValue({
      width: 1000,
    } as DOMRect);

    tableContainer = document.createElement("div");
    tableContainer.id = "table-container";
    document.body.appendChild(tableContainer);
    vi.spyOn(tableContainer, "getBoundingClientRect").mockReturnValue({
      width: 1200,
    } as DOMRect);
  });

  afterEach(() => {
    document.body.removeChild(rowContainer);
    document.body.removeChild(tableContainer);
    vi.clearAllMocks();
  });

  it("renders children content correctly in row mode", () => {
    render(<ListComponent {...defaultProps} />);
    // react-virtualized renders rows as they appear in viewport
    expect(screen.getByText("Item 0")).toBeInTheDocument();
    expect(screen.getByText("Item 1")).toBeInTheDocument();
  });

  it("applies correct grid styles in table mode from localStorage", () => {
    const columnStorageName = "test-col";
    const storageSize = "100px 200px 300px";
    localStorage.setItem(columnStorageName, storageSize);

    render(
      <ListComponent
        {...defaultProps}
        viewAs="table"
        columnStorageName={columnStorageName}
        columnInfoPanelStorageName="test-info"
      />,
    );

    const tableItem = screen.getByText("Item 0").parentElement;
    expect(tableItem).toHaveStyle(`grid-template-columns: ${storageSize}`);
    expect(tableItem).toHaveClass("table-list-item");
  });

  it("throws error when storage props are missing for table view", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => {
      render(<ListComponent {...defaultProps} viewAs="table" />);
    }).toThrow("columnStorageName is required for a table view");

    consoleSpy.mockRestore();
  });

  it("applies correct CSS classes for different view modes", () => {
    const { rerender } = render(
      <ListComponent {...defaultProps} viewAs="row" />,
    );

    // Check by selector since styles are CSS modules
    const listElement = document.querySelector(".ReactVirtualized__List");
    expect(listElement?.className).toContain("row");

    rerender(
      <ListComponent
        {...defaultProps}
        viewAs="table"
        columnStorageName="a"
        columnInfoPanelStorageName="b"
      />,
    );
    expect(listElement?.className).toContain("table");
  });

  it("renders loading skeletons when items are not loaded", () => {
    // filesLength = 10, itemCount = 20 means indices 10-19 are "loading"
    render(
      <ListComponent
        {...defaultProps}
        itemCount={20}
        filesLength={1}
        hasMoreFiles={true}
      />,
    );

    // Since ListComponent renders getLoader when !isLoaded (index >= filesLength)
    // and react-virtualized will attempt to render multiple rows,
    // we check for skeleton presence
    expect(screen.getAllByTestId("rows-skeleton").length).toBeGreaterThan(0);
    expect(screen.getAllByTestId("row-skeleton").length).toBeGreaterThan(0);
    expect(screen.getAllByTestId("rectangle-skeleton").length).toBeGreaterThan(
      0,
    );
  });

  it("renders TableSkeleton when items are not loaded in table view", () => {
    render(
      <ListComponent
        {...defaultProps}
        viewAs="table"
        columnStorageName="test"
        columnInfoPanelStorageName="test-info"
        itemCount={20}
        filesLength={1}
        hasMoreFiles={true}
      />,
    );
    expect(screen.getAllByTestId("table-skeleton").length).toBeGreaterThan(0);
    expect(screen.getAllByTestId("rectangle-skeleton").length).toBeGreaterThan(
      0,
    );
  });

  it("returns null from getLoader for unknown viewAs", () => {
    render(
      <ListComponent
        {...defaultProps}
        viewAs="tile"
        itemCount={20}
        filesLength={1}
        hasMoreFiles={true}
      />,
    );
    expect(screen.queryAllByTestId("rows-skeleton").length).toBe(0);
    expect(screen.queryAllByTestId("table-skeleton").length).toBe(0);
  });

  it("calculates height from scroll element when WindowScroller height is undefined", () => {
    const customScroll = document.createElement("div");
    const spy = vi
      .spyOn(customScroll, "getBoundingClientRect")
      .mockReturnValue({
        height: 600,
        width: 800,
      } as DOMRect);

    render(<ListComponent {...defaultProps} scroll={customScroll} />);

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
