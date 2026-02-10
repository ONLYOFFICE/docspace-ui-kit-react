import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { ThemeKeys } from "../../enums";

import { getSystemTheme } from ".";

describe("getSystemTheme", () => {
  const originalWindow = globalThis.window;

  beforeEach(() => {
    vi.unstubAllGlobals();
    globalThis.window = originalWindow;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    globalThis.window = originalWindow;
  });

  it("returns Dark when desktop client theme type is dark", () => {
    vi.stubGlobal("window", {
      ...originalWindow,
      AscDesktopEditor: {},
      RendererProcessVariable: { theme: { type: "dark" } },
      matchMedia: vi.fn(),
    } as unknown as Window);

    expect(getSystemTheme()).toBe(ThemeKeys.DarkStr);
  });

  it("returns Base when desktop client theme is not dark", () => {
    vi.stubGlobal("window", {
      ...originalWindow,
      AscDesktopEditor: {},
      RendererProcessVariable: { theme: { type: "light" } },
      matchMedia: vi.fn(),
    } as unknown as Window);

    expect(getSystemTheme()).toBe(ThemeKeys.BaseStr);
  });

  it("uses matchMedia preference when not desktop and prefers dark", () => {
    vi.stubGlobal("window", {
      ...originalWindow,
      matchMedia: vi.fn().mockReturnValue({ matches: true }),
    } as unknown as Window);

    expect(getSystemTheme()).toBe(ThemeKeys.DarkStr);
  });

  it("falls back to Base when prefers-color-scheme is not dark", () => {
    vi.stubGlobal("window", {
      ...originalWindow,
      matchMedia: vi.fn().mockReturnValue({ matches: false }),
    } as unknown as Window);

    expect(getSystemTheme()).toBe(ThemeKeys.BaseStr);
  });

  it("returns Base when window is not available", () => {
    vi.stubGlobal("window", undefined);

    expect(getSystemTheme()).toBe(ThemeKeys.BaseStr);
  });
});
