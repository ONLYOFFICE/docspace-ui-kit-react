import { renderHook } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useIsServer } from "./useIsServer";

describe("useIsServer", () => {
  it("should return false after mounting", () => {
    const { result } = renderHook(() => useIsServer());

    // In JSDOM (default for vitest), useEffect runs immediately after render
    expect(result.current).toBe(false);
  });
});
