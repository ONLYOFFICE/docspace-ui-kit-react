import React from "react";
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";

import { Scrollbar } from "./Scrollbar";
import { Scrollbar as CustomScrollbar } from "./custom-scrollbar";
import styles from "./Scrollbar.module.scss";

vi.useFakeTimers();

describe("<Scrollbar />", () => {
  afterEach(() => {
    vi.clearAllTimers();
  });

  it("renders without error", () => {
    render(<Scrollbar>Some content</Scrollbar>);
    expect(screen.getByTestId("scrollbar")).toBeInTheDocument();
  });

  it("accepts and applies className", () => {
    render(<Scrollbar className="test-class">Content</Scrollbar>);
    expect(screen.getByTestId("scrollbar")).toHaveClass("test-class");
  });

  it("handles scroll events", () => {
    const onScroll = vi.fn();
    render(
      <Scrollbar onScroll={onScroll}>
        <div style={{ height: "200px" }}>Scrollable content</div>
      </Scrollbar>,
    );

    const scroller = screen.getByTestId("scroller");
    fireEvent.scroll(scroller);
    expect(onScroll).toHaveBeenCalled();
  });

  it("handles autoHide prop correctly", () => {
    render(
      <Scrollbar autoHide>
        <div>Content</div>
      </Scrollbar>,
    );

    const scrollbar = screen.getByTestId("scrollbar");

    expect(scrollbar).toHaveClass(styles.autoHide);

    // Initially scrollVisible should not be present
    expect(scrollbar).not.toHaveClass(styles.scrollVisible);
  });

  it("applies correct tabIndex", () => {
    render(<Scrollbar tabIndex={0}>Content</Scrollbar>);
    const content = screen.getByTestId("scroll-body");
    expect(content).toHaveAttribute("tabIndex", "0");
  });

  it("handles autoFocus prop", () => {
    const focusSpy = vi.spyOn(HTMLElement.prototype, "focus");
    render(<Scrollbar autoFocus>Content</Scrollbar>);

    expect(focusSpy).toHaveBeenCalled();
    focusSpy.mockRestore();
  });

  it("applies paddingAfterLastItem prop", () => {
    render(<Scrollbar paddingAfterLastItem="50px">Content</Scrollbar>);

    const scrollbar = screen.getByTestId("scrollbar");

    expect(scrollbar).toHaveClass(styles.paddingAfterLastItem);
  });

  it("handles fixedSize prop", () => {
    render(
      <Scrollbar fixedSize style={{ width: "200px", height: "200px" }}>
        <div style={{ width: "300px", height: "300px" }}>Content</div>
      </Scrollbar>,
    );

    const scrollbar = screen.getByTestId("scrollbar");

    expect(scrollbar).toHaveClass(styles.fixedSize);
  });

  describe("mouse wheel over the track", () => {
    const makeScrollable = (el: HTMLElement) => {
      let top = 0;
      Object.defineProperty(el, "scrollTop", {
        configurable: true,
        get: () => top,
        set: (v: number) => {
          top = v;
        },
      });
    };

    it("scrolls the content when the wheel is used over the vertical track", () => {
      const { container } = render(
        <Scrollbar>
          <div style={{ height: "2000px" }}>Content</div>
        </Scrollbar>,
      );

      const scroller = screen.getByTestId("scroller");
      makeScrollable(scroller);

      const trackY = container.querySelector(".ScrollbarsCustom-TrackY");
      fireEvent.wheel(trackY as Element, { deltaY: 120 });

      expect(scroller.scrollTop).toBe(120);
    });

    it("does not scroll when track wheel scrolling is disabled", () => {
      const { container } = render(
        <CustomScrollbar
          disableTrackYMousewheelScrolling
          scrollerProps={{
            renderer: ({ elementRef, ...rest }) => (
              <div {...rest} ref={elementRef} data-testid="scroller" />
            ),
          }}
        >
          <div style={{ height: "2000px" }}>Content</div>
        </CustomScrollbar>,
      );

      const scroller = screen.getByTestId("scroller");
      makeScrollable(scroller);

      const trackY = container.querySelector(".ScrollbarsCustom-TrackY");
      fireEvent.wheel(trackY as Element, { deltaY: 120 });

      expect(scroller.scrollTop).toBe(0);
    });
  });
});
