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

  beforeEach(() => {
    rowContainer = document.createElement("div");
    rowContainer.id = "rowContainer";
    document.body.appendChild(rowContainer);
    vi.spyOn(rowContainer, "getBoundingClientRect").mockReturnValue({
      width: 1000,
    } as DOMRect);
  });

  afterEach(() => {
    document.body.removeChild(rowContainer);

    vi.clearAllMocks();
  });

  it("renders children content correctly in row mode", () => {
    render(<ListComponent {...defaultProps} />);
    // react-virtualized renders rows as they appear in viewport
    expect(screen.getByText("Item 0")).toBeInTheDocument();
    expect(screen.getByText("Item 1")).toBeInTheDocument();
  });

  it("draws viewAs table as the row list", () => {
    render(<ListComponent {...defaultProps} viewAs="table" />);

    const item = screen.getByText("Item 0").parentElement;
    expect(item).toHaveClass("row-list-item", "window-item");
    expect(item?.style.gridTemplateColumns).toBe("");
    expect(document.querySelector(".table-list-item")).toBeNull();
  });

  it("applies the row class to the row and table layouts alike", () => {
    const { rerender } = render(
      <ListComponent {...defaultProps} viewAs="row" />,
    );

    // Check by selector since styles are CSS modules
    const listElement = document.querySelector(".ReactVirtualized__List");
    const rowClassName = listElement?.className;
    expect(rowClassName).toContain("row");

    rerender(<ListComponent {...defaultProps} viewAs="table" />);
    expect(listElement?.className).toBe(rowClassName);
    expect(listElement?.className).not.toContain("table");
  });

  it("takes its width from #rowContainer", () => {
    render(<ListComponent {...defaultProps} />);

    const listElement = document.querySelector<HTMLElement>(
      ".ReactVirtualized__List",
    );
    expect(
      listElement?.style.getPropertyValue("--infinite-loader-measured-width"),
    ).toBe("1000px");
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

  it("renders the row skeleton for rows not loaded in the table layout", () => {
    render(
      <ListComponent
        {...defaultProps}
        viewAs="table"
        itemCount={20}
        filesLength={1}
        hasMoreFiles={true}
      />,
    );
    expect(screen.getAllByTestId("rows-skeleton").length).toBeGreaterThan(0);
    expect(screen.getAllByTestId("row-skeleton").length).toBeGreaterThan(0);
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
