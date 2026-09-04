"use client";

import type React from "react";

import { ThemeProviderComponent } from "../../components/theme-provider";

import useTheme, { type UseThemeProps } from "./useTheme";

export type TThemeProvider = {
  children: React.ReactNode;
  locale?: string;
} & Pick<UseThemeProps, "initialTheme" | "systemTheme" | "colorTheme">;

const ThemeProvider = ({
  children,
  initialTheme,
  systemTheme,
  colorTheme,
  locale,
}: TThemeProvider) => {
  const { theme, currentColorTheme } = useTheme({
    initialTheme,
    systemTheme,
    colorTheme,
    lang: locale,
  });

  return (
    <ThemeProviderComponent
      theme={theme}
      currentColorScheme={currentColorTheme}
    >
      {children}
    </ThemeProviderComponent>
  );
};

export default ThemeProvider;
