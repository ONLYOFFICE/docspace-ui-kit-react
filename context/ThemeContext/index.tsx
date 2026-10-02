"use client";

import { createContext, use, type ReactNode } from "react";

import type { CustomColorThemesSettingsItem } from "@onlyoffice/docspace-api-sdk";

type TTheme = "Base" | "Dark";

type TThemeContextValue = {
  theme: TTheme;
  currentColorScheme?: TColorScheme;
};

type ThemeProviderProps = TThemeContextValue & {
  children: ReactNode;
};

export type TColorScheme = CustomColorThemesSettingsItem;

export const ThemeContext = createContext<TThemeContextValue>({
  theme: "Base",
});

export const ThemeContextProvider = ({
  theme,
  currentColorScheme,
  children,
}: ThemeProviderProps) => {
  return (
    <ThemeContext value={{ theme, currentColorScheme }}>
      {children}
    </ThemeContext>
  );
};

export const useTheme = () => {
  const { theme, currentColorScheme } = use(ThemeContext);

  return { theme, isBase: theme === "Base", currentColorScheme };
};
