import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import { InfiniteLoaderComponent } from "./InfiniteLoader";
import { isMobile } from "../../utils/device";

vi.mock("../../utils/device", async () => {
  const actual = await vi.importActual("../../utils/device");
  return {
    ...actual,
    isMobile: vi.fn(() => false),
  };
});

const mockLoadMoreItems = vi.fn(() => Promise.resolve());

const defaultProps = {
  viewAs: "row" as const,
  hasMoreFiles: true,
  filesLength: 100,
  itemCount: 20,
  loadMoreItems: mockLoadMoreItems,
  children: Array(20).fill(<div>Test Item</div>),
  itemSize: 50,
};

describe("InfiniteLoader Component", () => {
  it("renders without crashing", () => {
    const { container } = render(<InfiniteLoaderComponent {...defaultProps} />);
    expect(container).toBeInTheDocument();
  });

  it("shows loading state when isLoading is true", () => {
    render(<InfiniteLoaderComponent {...defaultProps} isLoading />);
    expect(
      screen.queryAllByTestId("infinite-loader-container-list").length,
    ).toBe(0);
    expect(
      screen.queryAllByTestId("infinite-loader-container-grid").length,
    ).toBe(0);
  });

  it("renders list component by default", () => {
    render(<InfiniteLoaderComponent {...defaultProps} />);
    expect(
      screen.getByTestId("infinite-loader-container-list"),
    ).toBeInTheDocument();
  });

  it("renders grid component when viewAs is tile", () => {
    render(<InfiniteLoaderComponent {...defaultProps} viewAs="tile" />);
    expect(
      screen.getByTestId("infinite-loader-container-grid"),
    ).toBeInTheDocument();
  });

  it("renders table component in list view", () => {
    render(
      <InfiniteLoaderComponent
        {...defaultProps}
        viewAs="table"
        columnStorageName="test-storage"
        columnInfoPanelStorageName="test-info-storage"
      />,
    );
    expect(
      screen.getByTestId("infinite-loader-container-list"),
    ).toBeInTheDocument();
  });

  it("chooses correct scroll element based on isMobile (mobile)", () => {
    vi.mocked(isMobile).mockReturnValue(true);

    // Create mobile scroller
    const mobContainer = document.createElement("div");
    mobContainer.id = "customScrollBar";
    const mobWrapper = document.createElement("div");
    mobWrapper.className = "scroll-wrapper";
    const mobScroller = document.createElement("div");
    mobScroller.className = "scroller";
    mobWrapper.appendChild(mobScroller);
    mobContainer.appendChild(mobWrapper);
    document.body.appendChild(mobContainer);

    // Create desktop scroller
    const deskContainer = document.createElement("div");
    deskContainer.id = "sectionScroll";
    const deskWrapper = document.createElement("div");
    deskWrapper.className = "scroll-wrapper";
    const deskScroller = document.createElement("div");
    deskScroller.className = "scroller";
    deskWrapper.appendChild(deskScroller);
    deskContainer.appendChild(deskWrapper);
    document.body.appendChild(deskContainer);

    const mobSpy = vi.spyOn(mobScroller, "addEventListener");
    const deskSpy = vi.spyOn(deskScroller, "addEventListener");

    const { unmount } = render(<InfiniteLoaderComponent {...defaultProps} />);

    expect(mobSpy).toHaveBeenCalledWith("scroll", expect.any(Function));
    expect(deskSpy).not.toHaveBeenCalled();

    unmount();
    document.body.removeChild(mobContainer);
    document.body.removeChild(deskContainer);
  });

  it("chooses correct scroll element based on isMobile (desktop)", () => {
    vi.mocked(isMobile).mockReturnValue(false);

    // Create mobile scroller
    const mobContainer = document.createElement("div");
    mobContainer.id = "customScrollBar";
    const mobWrapper = document.createElement("div");
    mobWrapper.className = "scroll-wrapper";
    const mobScroller = document.createElement("div");
    mobScroller.className = "scroller";
    mobWrapper.appendChild(mobScroller);
    mobContainer.appendChild(mobWrapper);
    document.body.appendChild(mobContainer);

    // Create desktop scroller
    const deskContainer = document.createElement("div");
    deskContainer.id = "sectionScroll";
    const deskWrapper = document.createElement("div");
    deskWrapper.className = "scroll-wrapper";
    const deskScroller = document.createElement("div");
    deskScroller.className = "scroller";
    deskWrapper.appendChild(deskScroller);
    deskContainer.appendChild(deskWrapper);
    document.body.appendChild(deskContainer);

    const mobSpy = vi.spyOn(mobScroller, "addEventListener");
    const deskSpy = vi.spyOn(deskScroller, "addEventListener");

    const { unmount } = render(<InfiniteLoaderComponent {...defaultProps} />);

    expect(deskSpy).toHaveBeenCalledWith("scroll", expect.any(Function));
    expect(mobSpy).not.toHaveBeenCalled();

    unmount();
    document.body.removeChild(mobContainer);
    document.body.removeChild(deskContainer);
  });

  it("shows skeleton when scroll shift is large", async () => {
    vi.mocked(isMobile).mockReturnValue(false);

    // Create a container that ListComponent expects for width calculation
    const rowContainer = document.createElement("div");
    rowContainer.id = "rowContainer";
    document.body.appendChild(rowContainer);
    vi.spyOn(rowContainer, "getBoundingClientRect").mockReturnValue({
      width: 1000,
    } as DOMRect);

    const container = document.createElement("div");
    container.id = "sectionScroll";
    const wrapper = document.createElement("div");
    wrapper.className = "scroll-wrapper";
    const scroller = document.createElement("div");
    scroller.className = "scroller";
    scroller.style.height = "500px";
    wrapper.appendChild(scroller);
    container.appendChild(wrapper);
    document.body.appendChild(container);

    vi.spyOn(scroller, "getBoundingClientRect").mockReturnValue({
      height: 500,
      width: 1000,
    } as DOMRect);

    render(<InfiniteLoaderComponent {...defaultProps} />);

    // Simulate initial scroll
    fireEvent.scroll(scroller, { target: { scrollTop: 0 } });

    // Simulate large sudden scroll shift (> 800)
    fireEvent.scroll(scroller, { target: { scrollTop: 900 } });

    // When showSkeleton is true, ListComponent renders RowsSkeleton (data-testid="rows-skeleton")
    await waitFor(
      () => {
        expect(screen.getAllByTestId("rows-skeleton").length).toBeGreaterThan(
          0,
        );
        expect(screen.getAllByTestId("row-skeleton").length).toBeGreaterThan(0);
        expect(
          screen.getAllByTestId("rectangle-skeleton").length,
        ).toBeGreaterThan(0);
      },
      { timeout: 2000 },
    );

    document.body.removeChild(container);
    if (document.body.contains(rowContainer)) {
      document.body.removeChild(rowContainer);
    }
  });

  it("falls back to window when no scroll element is found", () => {
    vi.mocked(isMobile).mockReturnValue(false);
    // Ensure no scroll element exists
    const el = document.querySelector("#sectionScroll");
    if (el) el.remove();

    const addEventListenerSpy = vi.spyOn(window, "addEventListener");

    render(<InfiniteLoaderComponent {...defaultProps} />);

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function),
    );

    addEventListenerSpy.mockRestore();
  });

  it("removes scroll event listener on unmount", () => {
    vi.mocked(isMobile).mockReturnValue(false);
    const container = document.createElement("div");
    container.id = "sectionScroll";
    const wrapper = document.createElement("div");
    wrapper.className = "scroll-wrapper";
    const scroller = document.createElement("div");
    scroller.className = "scroller";
    wrapper.appendChild(scroller);
    container.appendChild(wrapper);
    document.body.appendChild(container);

    const removeEventListenerSpy = vi.spyOn(scroller, "removeEventListener");

    const { unmount } = render(<InfiniteLoaderComponent {...defaultProps} />);
    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function),
    );

    document.body.removeChild(container);
  });
});
