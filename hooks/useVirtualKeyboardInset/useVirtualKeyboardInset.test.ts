import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { useVirtualKeyboardInset } from ".";

vi.mock("../../utils/device", () => ({ isTouchDevice: true }));

const INNER_HEIGHT = 1000;
const KEYBOARD_HEIGHT = 400;

describe("useVirtualKeyboardInset", () => {
  const originalVisualViewport = window.visualViewport;
  const originalInnerHeight = window.innerHeight;

  let viewport: EventTarget & { height: number; offsetTop: number };
  let scrollY: number;

  const openKeyboardWithPagePushedUp = () => {
    // What iOS Safari does on focus: the keyboard shrinks the visual viewport
    // and the document is scrolled by the keyboard height to reveal the input.
    viewport.height = INNER_HEIGHT - KEYBOARD_HEIGHT;
    scrollY = KEYBOARD_HEIGHT;
    viewport.dispatchEvent(new Event("resize"));
    window.dispatchEvent(new Event("scroll"));
  };

  beforeEach(() => {
    vi.useFakeTimers();
    viewport = Object.assign(new EventTarget(), {
      height: INNER_HEIGHT,
      offsetTop: 0,
    });
    scrollY = 0;

    Object.defineProperty(window, "visualViewport", {
      value: viewport,
      configurable: true,
    });
    Object.defineProperty(window, "innerHeight", {
      value: INNER_HEIGHT,
      configurable: true,
    });
    Object.defineProperty(window, "scrollY", {
      get: () => scrollY,
      configurable: true,
    });
    vi.spyOn(window, "scrollTo").mockImplementation(((x: number, y: number) => {
      scrollY = y;
    }) as typeof window.scrollTo);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    document.documentElement.style.overflowY = "";
    Object.defineProperty(window, "visualViewport", {
      value: originalVisualViewport,
      configurable: true,
    });
    Object.defineProperty(window, "innerHeight", {
      value: originalInnerHeight,
      configurable: true,
    });
    Object.defineProperty(window, "scrollY", {
      value: 0,
      configurable: true,
    });
  });

  it("returns 0 while no keyboard is shown", () => {
    const { result } = renderHook(() => useVirtualKeyboardInset());
    act(() => vi.runAllTimers());

    expect(result.current).toBe(0);
  });

  it("returns 0 when disabled", () => {
    const { result } = renderHook(() => useVirtualKeyboardInset(false));
    act(() => {
      openKeyboardWithPagePushedUp();
      vi.runAllTimers();
    });

    expect(result.current).toBe(0);
  });

  it("undoes the keyboard scroll of a pinned page and reserves the keyboard height", () => {
    // The host sets the `overflow` shorthand; jsdom does not expand it into
    // the computed longhand the way browsers do.
    document.documentElement.style.overflowY = "hidden";
    const { result } = renderHook(() => useVirtualKeyboardInset());

    act(() => {
      openKeyboardWithPagePushedUp();
      vi.runAllTimers();
    });

    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
    expect(scrollY).toBe(0);
    expect(result.current).toBe(KEYBOARD_HEIGHT);
  });

  it("leaves the scroll of a scrollable page alone", () => {
    const { result } = renderHook(() => useVirtualKeyboardInset());

    act(() => {
      openKeyboardWithPagePushedUp();
      vi.runAllTimers();
    });

    expect(window.scrollTo).not.toHaveBeenCalled();
    expect(scrollY).toBe(KEYBOARD_HEIGHT);
    expect(result.current).toBe(KEYBOARD_HEIGHT);
  });
});
