import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as deviceDetect from "react-device-detect";
import { useTableHeaderPosition } from "./index";

vi.mock("react-device-detect", () => ({
  isSafari: false,
}));

describe("useTableHeaderPosition", () => {
  let headerRef: { current: HTMLDivElement | null };
  let mutationCallback: MutationCallback | undefined;
  const observeMock = vi.fn();
  const disconnectMock = vi.fn();

  class MockMutationObserver {
    constructor(callback: MutationCallback) {
      mutationCallback = callback;
    }
    observe = observeMock;
    disconnect = disconnectMock;
    takeRecords = vi.fn();
  }

  beforeEach(() => {
    headerRef = {
      current: document.createElement("div"),
    };
    
    global.MutationObserver = MockMutationObserver as unknown as typeof MutationObserver;

    vi.clearAllMocks();
  });

  afterEach(() => {
    document.body.innerHTML = "";
    vi.restoreAllMocks();
  });

  const setIsSafari = (value: boolean) => {
    Object.defineProperty(deviceDetect, "isSafari", {
      value,
      configurable: true,
    });
  };

  it("should do nothing if not Safari", () => {
    setIsSafari(false);
    renderHook(() => useTableHeaderPosition(headerRef));
    expect(observeMock).not.toHaveBeenCalled();
  });

  it("should observe body if Safari", () => {
    setIsSafari(true);
    renderHook(() => useTableHeaderPosition(headerRef));
    expect(observeMock).toHaveBeenCalledWith(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class"],
    });
  });

  it("should set top to unset if .filter-input_selected-row is not present", () => {
    setIsSafari(true);
    renderHook(() => useTableHeaderPosition(headerRef));
    expect(headerRef.current?.style.top).toBe("unset");
  });

  it("should set top based on .filter-input_selected-row bottom if present", () => {
    setIsSafari(true);
    const filterRow = document.createElement("div");
    filterRow.className = "filter-input_selected-row";
    filterRow.getBoundingClientRect = vi.fn(() => ({
      bottom: 50,
      top: 0,
      left: 0,
      right: 0,
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      toJSON: () => {},
    }));
    document.body.appendChild(filterRow);

    renderHook(() => useTableHeaderPosition(headerRef));
    expect(headerRef.current?.style.top).toBe("52px");
  });

  it("should set top with rounded value", () => {
    setIsSafari(true);
    const filterRow = document.createElement("div");
    filterRow.className = "filter-input_selected-row";
    filterRow.getBoundingClientRect = vi.fn(() => ({
      bottom: 50.6,
      top: 0,
      left: 0,
      right: 0,
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      toJSON: () => {},
    }));
    document.body.appendChild(filterRow);

    renderHook(() => useTableHeaderPosition(headerRef));
    expect(headerRef.current?.style.top).toBe("53px"); // round(50.6) = 51, 51+2=53
  });

  it("should update top on window resize", () => {
    setIsSafari(true);
    renderHook(() => useTableHeaderPosition(headerRef));
    expect(headerRef.current?.style.top).toBe("unset");

    const filterRow = document.createElement("div");
    filterRow.className = "filter-input_selected-row";
    filterRow.getBoundingClientRect = vi.fn(() => ({
      bottom: 60,
      top: 0,
      left: 0,
      right: 0,
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      toJSON: () => {},
    }));
    document.body.appendChild(filterRow);

    window.dispatchEvent(new Event("resize"));
    expect(headerRef.current?.style.top).toBe("62px");
  });

  it("should update top on mutation", () => {
    setIsSafari(true);
    renderHook(() => useTableHeaderPosition(headerRef));
    
    const filterRow = document.createElement("div");
    filterRow.className = "filter-input_selected-row";
    filterRow.getBoundingClientRect = vi.fn(() => ({
      bottom: 70,
      top: 0,
      left: 0,
      right: 0,
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      toJSON: () => {},
    }));
    document.body.appendChild(filterRow);

    if (mutationCallback) {
      mutationCallback([], {} as MutationObserver);
    }
    expect(headerRef.current?.style.top).toBe("72px");
  });

  it("should disconnect and remove listener on unmount", () => {
    setIsSafari(true);
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");
    const { unmount } = renderHook(() => useTableHeaderPosition(headerRef));
    
    unmount();
    
    expect(disconnectMock).toHaveBeenCalled();
    expect(removeEventListenerSpy).toHaveBeenCalledWith("resize", expect.any(Function));
  });

  it("should not crash if headerRef.current is null during update", () => {
    setIsSafari(true);
    const nullRef = { current: null };
    renderHook(() => useTableHeaderPosition(nullRef));
    
    expect(() => {
      window.dispatchEvent(new Event("resize"));
      if (mutationCallback) {
        mutationCallback([], {} as MutationObserver);
      }
    }).not.toThrow();
  });
});
