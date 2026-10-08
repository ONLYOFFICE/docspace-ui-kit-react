import { describe, it, expect, vi, beforeEach } from "vitest";
import type React from "react";
import { renderHook } from "@testing-library/react";
import useTabsHotkeys from "./useTabsHotkeys";

describe("useTabsHotkeys", () => {
  const focusTab = vi.fn();
  const selectTab = vi.fn();

  const items = [
    { id: "tab1", name: "Tab 1", content: "Content 1" },
    { id: "tab2", name: "Tab 2", content: "Content 2" },
    { id: "tab3", name: "Tab 3", content: "Content 3" },
  ];

  const press = (
    key: string,
    focusedTabIndex = 0,
    init: Partial<React.KeyboardEvent<HTMLElement>> = {},
  ) => {
    const { result } = renderHook(() =>
      useTabsHotkeys({ items, focusedTabIndex, focusTab, selectTab }),
    );
    const event = {
      key,
      altKey: false,
      ctrlKey: false,
      metaKey: false,
      shiftKey: false,
      currentTarget: document.createElement("div"),
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
      ...init,
    } as unknown as React.KeyboardEvent<HTMLElement>;
    result.current.onKeyDown(event);
    return event;
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("registers nothing on window", () => {
    const addEventListenerSpy = vi.spyOn(window, "addEventListener");
    renderHook(() =>
      useTabsHotkeys({ items, focusedTabIndex: 0, focusTab, selectTab }),
    );
    expect(addEventListenerSpy).not.toHaveBeenCalledWith(
      "keydown",
      expect.any(Function),
    );
    addEventListenerSpy.mockRestore();
  });

  it("leaves Tab alone, so focus can leave the bar", () => {
    const event = press("Tab");
    expect(event.preventDefault).not.toHaveBeenCalled();
    expect(focusTab).not.toHaveBeenCalled();
    expect(selectTab).not.toHaveBeenCalled();
  });

  it("moves the focus with ArrowRight and wraps at the end", () => {
    const event = press("ArrowRight", 0);
    expect(focusTab).toHaveBeenCalledWith(1);
    expect(event.preventDefault).toHaveBeenCalled();

    press("ArrowRight", 2);
    expect(focusTab).toHaveBeenLastCalledWith(0);
  });

  it("moves the focus with ArrowLeft and wraps at the start", () => {
    press("ArrowLeft", 0);
    expect(focusTab).toHaveBeenCalledWith(2);
  });

  it("swaps the arrows in a right-to-left layout", () => {
    const rtl = document.createElement("div");
    rtl.style.direction = "rtl";
    press("ArrowRight", 1, { currentTarget: rtl });
    expect(focusTab).toHaveBeenCalledWith(0);
  });

  it("jumps to the ends with Home and End", () => {
    press("Home", 1);
    expect(focusTab).toHaveBeenCalledWith(0);
    press("End", 1);
    expect(focusTab).toHaveBeenLastCalledWith(2);
  });

  it("selects the focused tab with Enter and Space", () => {
    press("Enter", 1);
    expect(selectTab).toHaveBeenCalledWith(1);
    press(" ", 2);
    expect(selectTab).toHaveBeenLastCalledWith(2);
  });

  it("ignores keys pressed with a modifier", () => {
    press("ArrowRight", 0, { shiftKey: true });
    press("ArrowRight", 0, { ctrlKey: true });
    expect(focusTab).not.toHaveBeenCalled();
  });
});
