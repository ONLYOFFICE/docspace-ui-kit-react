import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act, render, screen } from "@testing-library/react";
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
    render(<ListComponent {...defaultProps} />, { container: rowContainer });
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

  it("renders loading skeletons when items are not loaded", async () => {
    // filesLength = 10, itemCount = 20 means indices 10-19 are "loading"
    render(
      <ListComponent
        {...defaultProps}
        itemCount={20}
        filesLength={1}
        hasMoreFiles={true}
      />,
      { container: rowContainer },
    );
    // Rows that are not loaded make the loader call loadMoreItems and redraw
    // once it resolves; let that happen inside act.
    await act(async () => {});

    // Since ListComponent renders getLoader when !isLoaded (index >= filesLength)
    // and react-virtualized will attempt to render multiple rows,
    // we check for skeleton presence
    expect(screen.getAllByTestId("rows-skeleton").length).toBeGreaterThan(0);
    expect(screen.getAllByTestId("row-skeleton").length).toBeGreaterThan(0);
    expect(screen.getAllByTestId("rectangle-skeleton").length).toBeGreaterThan(
      0,
    );
  });

  it("renders TableSkeleton when items are not loaded in table view", async () => {
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
    // Rows that are not loaded make the loader call loadMoreItems and redraw
    // once it resolves; let that happen inside act.
    await act(async () => {});
    expect(screen.getAllByTestId("table-skeleton").length).toBeGreaterThan(0);
    expect(screen.getAllByTestId("rectangle-skeleton").length).toBeGreaterThan(
      0,
    );
  });

  it("returns null from getLoader for unknown viewAs", async () => {
    render(
      <ListComponent
        {...defaultProps}
        viewAs="tile"
        itemCount={20}
        filesLength={1}
        hasMoreFiles={true}
      />,
    );
    // Rows that are not loaded make the loader call loadMoreItems and redraw
    // once it resolves; let that happen inside act.
    await act(async () => {});
    expect(screen.queryAllByTestId("rows-skeleton").length).toBe(0);
    expect(screen.queryAllByTestId("table-skeleton").length).toBe(0);
  });

  it("takes a row list's width from the element it sits in, whatever its id", () => {
    const lists = [700, 500].map((width, index) => {
      const holder = document.createElement("div");
      holder.id = `files-${index}`;
      document.body.appendChild(holder);
      vi.spyOn(holder, "getBoundingClientRect").mockReturnValue({
        width,
      } as DOMRect);
      render(<ListComponent {...defaultProps} />, { container: holder });
      return holder;
    });

    const widths = lists.map(
      (holder) =>
        holder.querySelector<HTMLElement>(".ReactVirtualized__List")?.style
          .width,
    );
    expect(widths).toEqual(["700px", "500px"]);
    expect(lists[0]).toHaveTextContent("Item 0");

    lists.forEach((holder) => holder.remove());
  });

  it("measures a row list once where there is no ResizeObserver", () => {
    vi.stubGlobal("ResizeObserver", undefined);
    try {
      render(<ListComponent {...defaultProps} />, { container: rowContainer });

      expect(
        rowContainer.querySelector<HTMLElement>(".ReactVirtualized__List")
          ?.style.width,
      ).toBe("1000px");
    } finally {
      vi.unstubAllGlobals();
    }
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
