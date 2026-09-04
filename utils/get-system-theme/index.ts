import { ThemeKeys } from "../../enums";

export const getSystemTheme = () => {
  if (typeof window !== "undefined") {
    const isDesktopClient = window?.AscDesktopEditor !== undefined;
    const desktopClientTheme = window?.RendererProcessVariable?.theme;
    const isDark = desktopClientTheme?.type === "dark";

    return isDesktopClient
      ? isDark
        ? ThemeKeys.DarkStr
        : ThemeKeys.BaseStr
      : window.matchMedia("(prefers-color-scheme: dark)")?.matches
        ? ThemeKeys.DarkStr
        : ThemeKeys.BaseStr;
  }

  return ThemeKeys.BaseStr;
};
