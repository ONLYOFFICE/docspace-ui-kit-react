import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useViewTab } from "./useViewTab";
import { RefObject } from "react";
import { ScrollbarType } from "../../../scrollbar";

describe("useViewTab", () => {
  let mockObserve: ReturnType<typeof vi.fn>;
  let mockUnobserve: ReturnType<typeof vi.fn>;
  let mockDisconnect: ReturnType<typeof vi.fn>;
  let intersectionObserverCallback: IntersectionObserverCallback;
  beforeEach(() => {
    mockObserve = vi.fn();
    mockUnobserve = vi.fn();
    mockDisconnect = vi.fn();

    // Mock IntersectionObserver
    vi.stubGlobal(
      "IntersectionObserver",
      vi.fn(function (
        this: IntersectionObserver,
        callback: IntersectionObserverCallback,
      ) {
        intersectionObserverCallback = callback;
        return {
          observe: mockObserve,
          unobserve: mockUnobserve,
          disconnect: mockDisconnect,
          root: null,
          rootMargin: "",
          thresholds: [],
          takeRecords: () => [],
        };
      }),
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const createMockContainerRef = () =>
    ({
      current: {
        scrollerElement: document.createElement("div"),
      },
    }) as unknown as RefObject<ScrollbarType>;

  const createMockTabRef = () => {
    const el = document.createElement("div");
    const child = document.createElement("div");
    el.appendChild(child);
    return { current: el } as RefObject<HTMLDivElement>;
  };

  it("should return true by default", () => {
    const mockContainerRef = createMockContainerRef();
    const mockTabRef = createMockTabRef();

    const { result } = renderHook(() =>
      useViewTab(mockContainerRef, mockTabRef, 0),
    );

    expect(result.current).toBe(true);
  });

  it("should create IntersectionObserver with correct options", () => {
    const mockContainerRef = createMockContainerRef();
    const mockTabRef = createMockTabRef();

    renderHook(() => useViewTab(mockContainerRef, mockTabRef, 0));

    expect(global.IntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      {
        root: mockContainerRef.current.scrollerElement,
        rootMargin: "4px",
        threshold: 1,
      },
    );
  });

  it("should observe the correct child element", () => {
    const mockContainerRef = createMockContainerRef();
    const el = document.createElement("div");
    const child0 = document.createElement("div");
    const child1 = document.createElement("div");
    el.appendChild(child0);
    el.appendChild(child1);
    const mockTabRef = { current: el } as RefObject<HTMLDivElement>;

    renderHook(() => useViewTab(mockContainerRef, mockTabRef, 1));

    expect(mockObserve).toHaveBeenCalledWith(child1);
  });

  it("should update isViewTab when intersection changes", () => {
    const mockContainerRef = createMockContainerRef();
    const mockTabRef = createMockTabRef();
    const childElement = mockTabRef.current!.children[0];

    const { result } = renderHook(() =>
      useViewTab(mockContainerRef, mockTabRef, 0),
    );

    // Initially true
    expect(result.current).toBe(true);

    // Simulate not intersecting
    act(() => {
      intersectionObserverCallback(
        [
          {
            isIntersecting: false,
            target: childElement,
          } as Partial<IntersectionObserverEntry> as IntersectionObserverEntry,
        ],
        {} as IntersectionObserver,
      );
    });

    expect(result.current).toBe(false);

    // Simulate intersecting
    act(() => {
      intersectionObserverCallback(
        [
          {
            isIntersecting: true,
            target: childElement,
          } as Partial<IntersectionObserverEntry> as IntersectionObserverEntry,
        ],
        {} as IntersectionObserver,
      );
    });

    expect(result.current).toBe(true);
  });

  it("should not create observer if container is null", () => {
    const mockContainerRef = {
      current: null,
    } as unknown as RefObject<ScrollbarType>;
    const mockTabRef = createMockTabRef();

    renderHook(() => useViewTab(mockContainerRef, mockTabRef, 0));

    expect(global.IntersectionObserver).not.toHaveBeenCalled();
  });

  it("should not create observer if tabRef is null", () => {
    const mockContainerRef = createMockContainerRef();
    const mockTabRef = {
      current: null,
    } as unknown as RefObject<HTMLDivElement>;

    renderHook(() => useViewTab(mockContainerRef, mockTabRef, 0));

    expect(global.IntersectionObserver).not.toHaveBeenCalled();
  });

  it("should not create observer if child element does not exist", () => {
    const mockContainerRef = createMockContainerRef();
    const mockTabRef = {
      current: document.createElement("div"),
    } as unknown as RefObject<HTMLDivElement>;

    renderHook(() => useViewTab(mockContainerRef, mockTabRef, 0));

    expect(global.IntersectionObserver).not.toHaveBeenCalled();
  });

  it("should unobserve element on unmount", () => {
    const mockContainerRef = createMockContainerRef();
    const mockTabRef = createMockTabRef();
    const childElement = mockTabRef.current!.children[0];

    const { unmount } = renderHook(() =>
      useViewTab(mockContainerRef, mockTabRef, 0),
    );

    unmount();

    expect(mockUnobserve).toHaveBeenCalledWith(childElement);
  });

  it("should recreate observer when index changes", () => {
    const mockContainerRef = createMockContainerRef();
    const el = document.createElement("div");
    const child0 = document.createElement("div");
    const child1 = document.createElement("div");
    el.appendChild(child0);
    el.appendChild(child1);
    const mockTabRef = { current: el } as RefObject<HTMLDivElement>;

    const { rerender } = renderHook(
      ({ index }) => useViewTab(mockContainerRef, mockTabRef, index),
      { initialProps: { index: 0 } },
    );

    expect(mockObserve).toHaveBeenCalledWith(child0);

    // Change index
    rerender({ index: 1 });

    expect(mockUnobserve).toHaveBeenCalledWith(child0);
    expect(mockObserve).toHaveBeenCalledWith(child1);
  });
});
