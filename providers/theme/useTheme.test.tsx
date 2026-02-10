import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { ThemeKeys } from "../../enums";
import { DEFAULT_FONT_FAMILY, SYSTEM_FONT_FAMILY, SYSTEM_THEME_KEY } from "./themes/constants";

import useTheme from "./useTheme";

const mockGetPortalColorTheme = vi.fn();
const mockGetSystemTheme = vi.fn();
const mockSetCookie = vi.fn();

vi.mock("../../utils/get-system-theme", () => ({
  getSystemTheme: () => mockGetSystemTheme(),
}));

vi.mock("../../utils/cookie", () => ({
  setCookie: (...args: unknown[]) => mockSetCookie(...args),
}));

vi.mock("@onlyoffice/docspace-api-sdk", () => ({
  CommonSettingsApiAxiosParamCreator: () => ({
    getPortalColorTheme: (...args: unknown[]) => mockGetPortalColorTheme(...args),
  }),
}));

const createMatchMedia = () => {
  const listeners: Array<(event: MediaQueryListEvent) => void> = [];
  return {
    matchMedia: vi.fn().mockImplementation(() => ({
      matches: false,
      media: "(prefers-color-scheme: dark)",
      addEventListener: vi.fn((event: string, cb: (e: MediaQueryListEvent) => void) => {
        if (event === "change") listeners.push(cb);
      }),
      removeEventListener: vi.fn((event: string, cb: (e: MediaQueryListEvent) => void) => {
        if (event === "change") {
          const index = listeners.indexOf(cb);
          if (index > -1) listeners.splice(index, 1);
        }
      }),
      dispatch: (event: MediaQueryListEvent) => listeners.forEach((cb) => cb(event)),
    })),
  };
};

describe("useTheme", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockGetPortalColorTheme.mockReset();
    mockGetSystemTheme.mockReset();
    mockSetCookie.mockReset();

    mockGetPortalColorTheme.mockResolvedValue({ selected: undefined, themes: [] });

    const { matchMedia } = createMatchMedia();
    vi.stubGlobal("matchMedia", matchMedia);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("returns Base theme by default with LTR and default font", () => {
    mockGetSystemTheme.mockReturnValue(ThemeKeys.BaseStr);

    const { result } = renderHook(() => useTheme({ initialTheme: ThemeKeys.BaseStr }));

    expect(result.current.theme.isBase).toBe(true);
    expect(result.current.theme.interfaceDirection).toBe("ltr");
    expect(result.current.theme.fontFamily).toBe(DEFAULT_FONT_FAMILY);
  });

  it("returns Dark theme when initialTheme is DarkStr", () => {
    mockGetSystemTheme.mockReturnValue(ThemeKeys.DarkStr);

    const { result } = renderHook(() => useTheme({ initialTheme: ThemeKeys.DarkStr }));

    expect(result.current.theme.isBase).toBe(false);
  });

  it("derives rtl direction and system font for arabic locale", () => {
    mockGetSystemTheme.mockReturnValue(ThemeKeys.BaseStr);

    const { result } = renderHook(() => useTheme({ lang: "ar-SA" }));

    expect(result.current.theme.interfaceDirection).toBe("rtl");
    expect(result.current.theme.fontFamily).toBe(SYSTEM_FONT_FAMILY);
  });

  it("uses provided color theme when selected id matches", () => {
    mockGetSystemTheme.mockReturnValue(ThemeKeys.BaseStr);
    const colorTheme = {
      selected: "2",
      themes: [
        { id: "1", name: "One" },
        { id: "2", name: "Two" },
      ],
    } as unknown as Parameters<typeof useTheme>[0]["colorTheme"];

    const { result } = renderHook(() => useTheme({ colorTheme }));

    expect(result.current.currentColorTheme?.id).toBe("2");
  });

  it("fetches current color theme when not provided", async () => {
    vi.useRealTimers();
    mockGetSystemTheme.mockReturnValue(ThemeKeys.BaseStr);
    mockGetPortalColorTheme.mockResolvedValue({
      selected: "10",
      themes: [
        { id: "10", name: "Fetched" },
      ],
    });

    const { result } = renderHook(() => useTheme({}));

    await waitFor(() => {
      expect(result.current.currentColorTheme?.name).toBe("Fetched");
    });

    expect(mockGetPortalColorTheme).toHaveBeenCalledTimes(1);

    vi.useFakeTimers();
  });

  it("sets cookie with system theme on initialization", () => {
    mockGetSystemTheme.mockReturnValue(ThemeKeys.DarkStr);

    renderHook(() => useTheme({ initialTheme: ThemeKeys.SystemStr }));

    expect(mockSetCookie).toHaveBeenCalledWith(SYSTEM_THEME_KEY, ThemeKeys.DarkStr);
  });
});
