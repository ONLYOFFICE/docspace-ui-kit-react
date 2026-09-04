import React from "react";
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";

import { Scrollbar } from "./Scrollbar";
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
});
