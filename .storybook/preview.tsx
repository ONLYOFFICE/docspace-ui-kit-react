import React from "react";
import type { Preview } from "@storybook/react-vite";
import { useDarkMode } from "@vueless/storybook-dark-mode";

import { ThemeProviderComponent } from "../components/theme-provider";
import { TranslationProvider } from "../providers/translation";
import type { TTranslations } from "../providers/translation";

import type { TColorScheme } from "../context/ThemeContext";

import { globalColors } from "../providers/theme/themes/globalColors";
import { setBrandLookup } from "../constants/brands";
import { parseLocaleConstants } from "../utils/parse-locale-constants";
import brandsData from "../test/fixtures/brands.json";
import globalTypes from "./globals";
import withApiProvider from "./decorators/withApiProvider";
import enCommon from "../locales/en/Common.json";
import enPayments from "../locales/en/Payments.json";
import enSettings from "../locales/en/Settings.json";

import "./styles.css";
import "../css/fonts.css";

import lightTheme from "./lightTheme";
import darkTheme from "./darkTheme";
import { DocsContainer } from "./DocsContainer";

// The library ships an identity brand lookup on purpose: getBrandName("Foo")
// returns "Foo" until a consuming application calls setBrandLookup(), which is
// what @docspace/shared does at module load. Storybook has no such consumer, so
// without this every brand name rendered as its own key -- the Files selector
// breadcrumb read "ProductName" rather than the product. test/setup.ts does the
// same for Vitest.
//
// `ProductName` is overridden rather than taken from the fixture: the fixture
// mirrors the portal's own brands.json, which still says "DocSpace", and
// test/setup.ts plus the expectations in utils/common, errors/Errors.test.tsx
// and errors/stories.utils.ts are pinned to that value. Storybook shows the
// product under its current name; everything else still comes from the fixture.
const { get: getBrand } = parseLocaleConstants({
  ...(brandsData as Record<string, string>),
  ProductName: "ONLYOFFICE",
});
setBrandLookup(getBrand);

const lightColorScheme: TColorScheme = {
  id: 1,
  name: "Light",
  main: {
    accent: globalColors.lightBlueMain,
    buttons: globalColors.lightBlueMain,
  },
  text: {
    accent: globalColors.white,
    buttons: globalColors.white,
  },
};

const darkColorScheme: TColorScheme = {
  id: 2,
  name: "Dark",
  main: {
    accent: globalColors.lightSecondMain,
    buttons: globalColors.lightSecondMain,
  },
  text: {
    accent: globalColors.white,
    buttons: globalColors.white,
  },
};

document.cookie = "asc_language=en";

const baseTheme = {
  isBase: true,
  interfaceDirection: "ltr" as const,
  fontFamily: "Open Sans, sans-serif, Arial",
};

const darkThemeConfig = {
  isBase: false,
  interfaceDirection: "ltr" as const,
  fontFamily: "Open Sans, sans-serif, Arial",
};

const preview: Preview = {
  globalTypes,
  parameters: {
    backgrounds: { disabled: true },
    controls: {
      expanded: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    darkMode: {
      light: lightTheme,
      dark: darkTheme,
    },
    docs: {
      container: DocsContainer,
      toc: true,
    },
    options: {
      storySort: {
        // A nested array orders the children of the entry before it. Two of
        // the names below used to be wrong: "AI Agent" and "Payments" are not
        // sections that exist, while "Billing" -- which does -- was missing.
        // "UI" was absent from the order entirely, leaving the largest section
        // (112 of the 138 stories, across 13 groups) unpositioned. It is
        // placed before "Components" because it is the published core, while
        // "Components" holds the portal-coupled composites.
        order: [
          "Getting started",
          ["Welcome", "Structure", "Translation", "Themes", "API"],
          "Components",
          [
            "Selectors",
            "Uploader",
            "Document Editor",
            "Billing",
            "Providers",
            "Errors",
          ],
          "UI",
          "Samples",
        ],
      },
    },
  },

  initialGlobals: {
    apiConfig: "default",
  },

  decorators: [
    withApiProvider,
    (Story, context) => {
      const isDark = useDarkMode();
      const interfaceDirection = context.globals.direction;

      const theme = isDark ? darkThemeConfig : baseTheme;
      const currentColorScheme = isDark ? darkColorScheme : lightColorScheme;

      const translations: TTranslations = new Map([
        [
          "en",
          new Map([
            ["Common", enCommon],
            ["Payments", enPayments],
            ["Settings", enSettings],
          ]),
        ],
      ]);

      const isDocs = context.viewMode === "docs";
      const noPadding = context.parameters?.noPadding;

      return (
        <TranslationProvider locale="en" translations={translations}>
          <ThemeProviderComponent
            theme={{ ...theme, interfaceDirection }}
            currentColorScheme={currentColorScheme}
          >
            <div
              style={{
                backgroundColor: isDark
                  ? globalColors.black
                  : globalColors.white,
                color: isDark ? globalColors.white : globalColors.black,
                padding: isDocs || noPadding ? "0" : "20px",
              }}
            >
              <Story />
            </div>
          </ThemeProviderComponent>
        </TranslationProvider>
      );
    },
  ],

  tags: ["autodocs"],
};

export default preview;
