import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent, act } from "@testing-library/react";

import { InfiniteLoaderComponent } from "./InfiniteLoader";

// The list and grid are replaced by probes that record the props the loader
// hands them, so the props it computes can be checked directly.
const received: { scroll?: unknown; showSkeleton?: boolean }[] = [];

vi.mock("./sub-components/list/List", () => ({
  default: (props: { scroll: unknown; showSkeleton?: boolean }) => {
    received.push({ scroll: props.scroll, showSkeleton: props.showSkeleton });
    return <div data-testid="list-probe" />;
  },
}));

vi.mock("./sub-components/grid/Grid", () => ({
  default: (props: { scroll: unknown; showSkeleton?: boolean }) => {
    received.push({ scroll: props.scroll, showSkeleton: props.showSkeleton });
    return <div data-testid="grid-probe" />;
  },
}));

const defaultProps = {
  viewAs: "row" as const,
  hasMoreFiles: false,
  filesLength: 2,
  itemCount: 2,
  loadMoreItems: () => Promise.resolve(),
  children: [<div key="a">A</div>, <div key="b">B</div>],
  itemSize: 50,
};

const last = () => received[received.length - 1];

describe("InfiniteLoader props it computes", () => {
  beforeEach(() => {
    received.length = 0;
  });

  it("does not let a showSkeleton prop override its own flag", () => {
    render(<InfiniteLoaderComponent {...defaultProps} showSkeleton />);
    expect(last().showSkeleton).toBe(false);
  });

  it("does not let a showSkeleton prop override its own flag in the grid", () => {
    render(
      <InfiniteLoaderComponent {...defaultProps} viewAs="tile" showSkeleton />,
    );
    expect(last().showSkeleton).toBe(false);
  });

  it("scrolls the element passed as scrollElement", () => {
    const scroller = document.createElement("div");
    document.body.appendChild(scroller);

    render(
      <InfiniteLoaderComponent {...defaultProps} scrollElement={scroller} />,
    );
    expect(last().scroll).toBe(scroller);

    scroller.remove();
  });

  it("shows skeletons after a long jump of a scrollElement", () => {
    vi.useFakeTimers();
    const scroller = document.createElement("div");
    document.body.appendChild(scroller);

    render(
      <InfiniteLoaderComponent {...defaultProps} scrollElement={scroller} />,
    );

    act(() => {
      fireEvent.scroll(scroller, { target: { scrollTop: 900 } });
    });
    expect(last().showSkeleton).toBe(true);

    act(() => {
      vi.advanceTimersByTime(250);
    });
    expect(last().showSkeleton).toBe(false);

    vi.useRealTimers();
    scroller.remove();
  });

  it("watches the window for a long jump when there is no scroll element", () => {
    render(<InfiniteLoaderComponent {...defaultProps} />);
    expect(last().scroll).toBe(window);

    act(() => {
      Object.defineProperty(window, "scrollY", {
        value: 900,
        configurable: true,
      });
      fireEvent.scroll(window);
    });
    expect(last().showSkeleton).toBe(true);

    Object.defineProperty(window, "scrollY", { value: 0, configurable: true });
  });
});
