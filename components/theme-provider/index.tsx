"use client";

import { useEffect } from "react";

import { InterfaceDirectionProvider } from "../../context/InterfaceDirectionContext";
import { ThemeContextProvider as CustomThemeProvider } from "../../context/ThemeContext";

import type { ThemeProviderProps } from "./ThemeProvider.types";
import {
  createPageLayers,
  writeAttribute,
  writeProperty,
} from "./ThemeProvider.layers";
import "./ThemeProvider.scss";

export type { ThemeProviderProps };

const THEME_CLASSES = ["light", "dark", "ltr", "rtl"];

type TPageTheme = {
  theme: string | null;
  dir: string | null;
  interfaceDirection: string;
  classes: string[];
  fontFamily: string;
};

const themeLayers = createPageLayers<TPageTheme>(
  (value) => {
    const root = document.documentElement;
    const body = document.body;

    writeAttribute(root, "data-theme", value.theme);
    writeAttribute(root, "data-dir", value.dir);
    writeProperty(
      root.style,
      "--interface-direction",
      value.interfaceDirection,
    );

    body.classList.remove(...THEME_CLASSES);
    body.classList.add(...value.classes);
    writeProperty(body.style, "--font-family", value.fontFamily);
  },
  () => {
    const root = document.documentElement;
    const body = document.body;

    return {
      theme: root.getAttribute("data-theme"),
      dir: root.getAttribute("data-dir"),
      interfaceDirection: root.style.getPropertyValue("--interface-direction"),
      classes: THEME_CLASSES.filter((name) => body.classList.contains(name)),
      fontFamily: body.style.getPropertyValue("--font-family"),
    };
  },
);

const COLOR_SCHEME_PROPERTIES = [
  "--color-scheme-main-accent",
  "--color-scheme-text-accent",
  "--color-scheme-main-buttons",
  "--color-scheme-text-buttons",
];

// The same four properties go on <html> and on <body>, so a component can
// read them from either.
type TPageColorScheme = { root: string[]; body: string[] };

const colorSchemeLayers = createPageLayers<TPageColorScheme>(
  (value) => {
    COLOR_SCHEME_PROPERTIES.forEach((name, i) => {
      writeProperty(document.documentElement.style, name, value.root[i]);
      writeProperty(document.body.style, name, value.body[i]);
    });
  },
  () => ({
    root: COLOR_SCHEME_PROPERTIES.map((name) =>
      document.documentElement.style.getPropertyValue(name),
    ),
    body: COLOR_SCHEME_PROPERTIES.map((name) =>
      document.body.style.getPropertyValue(name),
    ),
  }),
);

export const ThemeProviderComponent = ({
  theme,
  currentColorScheme,
  children,
}: ThemeProviderProps) => {
  // A theme without `isBase` is light, for the CSS and the context alike.
  const isLight = "isBase" in theme ? !!theme.isBase : true;

  // Each provider writes a layer and takes it off again, so an unmounted one
  // leaves the page to the provider around it, or as it found it.
  useEffect(() => {
    const themeStr = isLight ? "light" : "dark";
    const dir =
      "interfaceDirection" in theme
        ? (theme.interfaceDirection as "ltr" | "rtl")
        : "ltr";

    const layer = themeLayers.add({
      theme: themeStr,
      dir,
      interfaceDirection: dir,
      classes: [themeStr, dir],
      fontFamily:
        "fontFamily" in theme
          ? (theme.fontFamily as string)
          : "Open Sans, sans-serif, Arial",
    });

    return () => themeLayers.remove(layer);
  }, [theme, isLight]);

  // A scheme without `main` adds no layer, so the colours of the one before it
  // come off the page.
  useEffect(() => {
    const main = currentColorScheme?.main;
    if (!main) return undefined;

    const values = [
      main.accent,
      currentColorScheme.text?.accent,
      main.buttons,
      currentColorScheme.text?.buttons,
    ].map((value) => value ?? "");
    const layer = colorSchemeLayers.add({ root: values, body: values });

    return () => colorSchemeLayers.remove(layer);
  }, [currentColorScheme]);

  return (
    <InterfaceDirectionProvider
      interfaceDirection={theme.interfaceDirection as "ltr" | "rtl"}
    >
      <CustomThemeProvider
        theme={isLight ? "Base" : "Dark"}
        currentColorScheme={currentColorScheme}
      >
        {children}
      </CustomThemeProvider>
    </InterfaceDirectionProvider>
  );
};
