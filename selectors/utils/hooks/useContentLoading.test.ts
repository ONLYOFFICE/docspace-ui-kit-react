import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import useContentLoading from "./useContentLoading";

describe("useContentLoading", () => {
  it("ignores startContentLoading until the initial load settles", () => {
    const { result } = renderHook(() => useContentLoading());

    act(() => result.current.startContentLoading());

    expect(result.current.isContentLoading).toBe(false);
  });

  it("dims and undims once the initial load has finished", () => {
    const { result } = renderHook(() => useContentLoading());

    act(() => result.current.finishContentLoading());
    act(() => result.current.startContentLoading());
    expect(result.current.isContentLoading).toBe(true);

    act(() => result.current.finishContentLoading());
    expect(result.current.isContentLoading).toBe(false);
  });

  it("allows dimming immediately when mounted with preloaded data", () => {
    const { result } = renderHook(() =>
      useContentLoading({ initiallyLoaded: true }),
    );

    act(() => result.current.startContentLoading());

    expect(result.current.isContentLoading).toBe(true);
  });
});
