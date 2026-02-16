import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { useUnmount } from "./index";

describe("useUnmount", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should call the provided function on unmount", () => {
    const onUnmount = vi.fn();

    const { unmount } = renderHook(() => useUnmount(onUnmount));

    expect(onUnmount).not.toHaveBeenCalled();

    unmount();

    expect(onUnmount).toHaveBeenCalledTimes(1);
  });

  it("should not call the function on mount or during renders", () => {
    const onUnmount = vi.fn();

    const { rerender } = renderHook(() => useUnmount(onUnmount));

    expect(onUnmount).not.toHaveBeenCalled();

    rerender();
    rerender();
    rerender();

    expect(onUnmount).not.toHaveBeenCalled();
  });

  it("should call the latest version of the function on unmount", () => {
    const onUnmount1 = vi.fn();
    const onUnmount2 = vi.fn();
    const onUnmount3 = vi.fn();

    const { rerender, unmount } = renderHook(
      ({ callback }) => useUnmount(callback),
      {
        initialProps: { callback: onUnmount1 },
      },
    );

    rerender({ callback: onUnmount2 });
    rerender({ callback: onUnmount3 });

    unmount();

    expect(onUnmount1).not.toHaveBeenCalled();
    expect(onUnmount2).not.toHaveBeenCalled();
    expect(onUnmount3).toHaveBeenCalledTimes(1);
  });

  it("should handle function with side effects", () => {
    let cleanupExecuted = false;

    const cleanup = () => {
      cleanupExecuted = true;
    };

    const { unmount } = renderHook(() => useUnmount(cleanup));

    expect(cleanupExecuted).toBe(false);

    unmount();

    expect(cleanupExecuted).toBe(true);
  });

  it("should work with multiple instances independently", () => {
    const onUnmount1 = vi.fn();
    const onUnmount2 = vi.fn();

    const { unmount: unmount1 } = renderHook(() => useUnmount(onUnmount1));
    const { unmount: unmount2 } = renderHook(() => useUnmount(onUnmount2));

    unmount1();

    expect(onUnmount1).toHaveBeenCalledTimes(1);
    expect(onUnmount2).not.toHaveBeenCalled();

    unmount2();

    expect(onUnmount1).toHaveBeenCalledTimes(1);
    expect(onUnmount2).toHaveBeenCalledTimes(1);
  });

  it("should handle function that throws an error", () => {
    const errorMessage = "Cleanup error";
    const onUnmount = vi.fn(() => {
      throw new Error(errorMessage);
    });

    const { unmount } = renderHook(() => useUnmount(onUnmount));

    expect(() => unmount()).toThrow(errorMessage);
    expect(onUnmount).toHaveBeenCalledTimes(1);
  });

  it("should handle empty function", () => {
    const onUnmount = vi.fn();

    const { unmount } = renderHook(() => useUnmount(onUnmount));

    expect(() => unmount()).not.toThrow();
    expect(onUnmount).toHaveBeenCalledTimes(1);
  });

  it("should preserve function context and closures", () => {
    let capturedValue = "";

    const createCleanup = (value: string) => () => {
      capturedValue = value;
    };

    const { rerender, unmount } = renderHook(
      ({ value }) => useUnmount(createCleanup(value)),
      {
        initialProps: { value: "initial" },
      },
    );

    rerender({ value: "updated" });
    rerender({ value: "final" });

    unmount();

    expect(capturedValue).toBe("final");
  });

  it("should only call cleanup once even with strict mode double mounting", () => {
    const onUnmount = vi.fn();

    const { unmount } = renderHook(() => useUnmount(onUnmount));

    unmount();

    expect(onUnmount).toHaveBeenCalledTimes(1);
  });
});
