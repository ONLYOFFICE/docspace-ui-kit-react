import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useMobileViewport } from "./useMobileViewport";
import * as deviceDetect from "react-device-detect";

// Mock react-device-detect
vi.mock("react-device-detect", () => ({
  isMobileOnly: false,
}));

describe("useMobileViewport", () => {
  const originalVisualViewport = window.visualViewport;

  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(window, "visualViewport", {
      value: undefined,
      configurable: true,
      writable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(window, "visualViewport", {
      value: originalVisualViewport,
      configurable: true,
      writable: true,
    });
  });

  const setIsMobileOnly = (value: boolean) => {
    Object.defineProperty(deviceDetect, "isMobileOnly", {
      value,
      configurable: true,
    });
  };

  it("should return default offset of 16", () => {
    const { result } = renderHook(() => useMobileViewport());
    expect(result.current).toBe(16);
  });

  it("should not add event listener if isMobileOnly is false", () => {
    const addEventListenerSpy = vi.spyOn(window, "addEventListener");
    renderHook(() => useMobileViewport());
    expect(addEventListenerSpy).not.toHaveBeenCalledWith(
      "resize",
      expect.any(Function),
    );
  });

  it("should add event listener if isMobileOnly is true", () => {
    setIsMobileOnly(true);
    const addEventListenerSpy = vi.spyOn(window, "addEventListener");

    renderHook(() => useMobileViewport());

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "resize",
      expect.any(Function),
    );

    setIsMobileOnly(false);
  });

  it("should update offset when resized on mobile", () => {
    setIsMobileOnly(true);

    const mockVisualViewport = {
      height: 500,
    };

    Object.defineProperty(window, "visualViewport", {
      value: mockVisualViewport,
      configurable: true,
      writable: true,
    });

    Object.defineProperty(window, "innerHeight", {
      value: 600,
      configurable: true,
      writable: true,
    });

    const { result } = renderHook(() => useMobileViewport());

    expect(result.current).toBe(16);

    act(() => {
      const resizeEvent = new Event("resize");
      Object.defineProperty(resizeEvent, "target", { value: window });
      window.dispatchEvent(resizeEvent);
    });

    expect(result.current).toBe(100);

    setIsMobileOnly(false);
  });

  it("should not update offset if window.visualViewport is missing", () => {
    setIsMobileOnly(true);

    const { result } = renderHook(() => useMobileViewport());

    act(() => {
      window.dispatchEvent(new Event("resize"));
    });

    expect(result.current).toBe(16);

    setIsMobileOnly(false);
  });

  it("should remove event listener on unmount", () => {
    setIsMobileOnly(true);
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

    const { unmount } = renderHook(() => useMobileViewport());
    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "resize",
      expect.any(Function),
    );

    setIsMobileOnly(false);
  });
});
