import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useRef } from "react";

import { useCloseOnAnchorCovered } from "./index";

describe("useCloseOnAnchorCovered", () => {
  let anchorElement: HTMLDivElement;
  let rafSpy: ReturnType<typeof vi.spyOn>;
  let cancelRafSpy: ReturnType<typeof vi.spyOn>;
  let rafIdCounter: number;

  beforeEach(() => {
    anchorElement = document.createElement("div");
    document.body.appendChild(anchorElement);


    rafIdCounter = 0;
    rafSpy = vi
      .spyOn(window, "requestAnimationFrame")
      .mockImplementation(() => ++rafIdCounter);
    cancelRafSpy = vi.spyOn(window, "cancelAnimationFrame");

    if (!document.elementFromPoint) {
      document.elementFromPoint = vi.fn(() => null);
    }
  });

  afterEach(() => {
    document.body.removeChild(anchorElement);
    rafSpy.mockRestore();
    cancelRafSpy.mockRestore();
    vi.clearAllMocks();
  });

  it("should start rAF loop on mount when enabled", () => {
    const onClose = vi.fn();

    renderHook(() => {
      const anchorRef = useRef<HTMLDivElement>(anchorElement);
      useCloseOnAnchorCovered({ anchorRef, onClose });
    });

    expect(rafSpy).toHaveBeenCalledTimes(1);
  });

  it("should not start rAF loop when disabled", () => {
    const onClose = vi.fn();

    renderHook(() => {
      const anchorRef = useRef<HTMLDivElement>(anchorElement);
      useCloseOnAnchorCovered({ anchorRef, onClose, enabled: false });
    });

    expect(rafSpy).not.toHaveBeenCalled();
  });

  it("should call onClose and stop loop when anchor is covered", () => {
    const onClose = vi.fn();
    const isElementCovered = vi.fn(() => true);

    rafSpy.mockImplementationOnce((callback: FrameRequestCallback) => {
      callback(0);
      return ++rafIdCounter;
    });

    renderHook(() => {
      const anchorRef = useRef<HTMLDivElement>(anchorElement);
      useCloseOnAnchorCovered({ anchorRef, onClose, isElementCovered });
    });

    expect(isElementCovered).toHaveBeenCalledWith(anchorElement);
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(rafSpy).toHaveBeenCalledTimes(1);
  });

  it("should not call onClose and reschedule when anchor is not covered", () => {
    const onClose = vi.fn();
    const isElementCovered = vi.fn(() => false);

    rafSpy.mockImplementationOnce((callback: FrameRequestCallback) => {
      callback(0);
      return ++rafIdCounter;
    });

    renderHook(() => {
      const anchorRef = useRef<HTMLDivElement>(anchorElement);
      useCloseOnAnchorCovered({ anchorRef, onClose, isElementCovered });
    });

    expect(isElementCovered).toHaveBeenCalledWith(anchorElement);
    expect(onClose).not.toHaveBeenCalled();
    expect(rafSpy).toHaveBeenCalledTimes(2);
  });

  it("should cancel rAF on unmount", () => {
    const onClose = vi.fn();
    const isElementCovered = vi.fn(() => false);

    const { unmount } = renderHook(() => {
      const anchorRef = useRef<HTMLDivElement>(anchorElement);
      useCloseOnAnchorCovered({ anchorRef, onClose, isElementCovered });
    });

    const scheduledId = rafIdCounter;
    unmount();

    expect(cancelRafSpy).toHaveBeenCalledWith(scheduledId);
  });

  it("should not call isElementCovered when anchor is null", () => {
    const onClose = vi.fn();
    const isElementCovered = vi.fn(() => true);

    rafSpy.mockImplementationOnce((callback: FrameRequestCallback) => {
      callback(0);
      return ++rafIdCounter;
    });

    renderHook(() => {
      const anchorRef = useRef<HTMLDivElement>(null);
      useCloseOnAnchorCovered({ anchorRef, onClose, isElementCovered });
    });

    expect(isElementCovered).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
    expect(rafSpy).toHaveBeenCalledTimes(2);
  });

  it("should restart loop when enabled changes from false to true", () => {
    const onClose = vi.fn();

    const { rerender } = renderHook(
      ({ enabled }: { enabled: boolean }) => {
        const anchorRef = useRef<HTMLDivElement>(anchorElement);
        useCloseOnAnchorCovered({ anchorRef, onClose, enabled });
      },
      { initialProps: { enabled: false } },
    );

    expect(rafSpy).not.toHaveBeenCalled();

    rerender({ enabled: true });

    expect(rafSpy).toHaveBeenCalledTimes(1);
  });

  it("should use default isElementCovered when not provided", () => {
    const onClose = vi.fn();

    // elementFromPoint returns body which contains anchorElement → not covered
    const elementFromPointSpy = vi
      .spyOn(document, "elementFromPoint")
      .mockReturnValue(document.body);

    rafSpy.mockImplementationOnce((callback: FrameRequestCallback) => {
      callback(0);
      return ++rafIdCounter;
    });

    renderHook(() => {
      const anchorRef = useRef<HTMLDivElement>(anchorElement);
      useCloseOnAnchorCovered({ anchorRef, onClose });
    });

    expect(onClose).not.toHaveBeenCalled();
    expect(rafSpy).toHaveBeenCalledTimes(2);

    elementFromPointSpy.mockRestore();
  });
});
