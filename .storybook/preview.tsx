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
import { startDemoPortal } from "./mocks/worker";
import enCommon from "../locales/en/Common.json";
import enPayments from "../locales/en/Payments.json";
import enSettings from "../locales/en/Settings.json";

import "./styles.scss";
import "../css/fonts.css";

import lightTheme from "./lightTheme";
import darkTheme from "./darkTheme";
import { DocsContainer } from "./DocsContainer";
import { DocsPage } from "./blocks/DocsPage";

// The library ships an identity brand lookup on purpose: getBrandName("Foo")
// returns "Foo" until a consuming application calls setBrandLookup(), which is
// what @docspace/shared does at module load. Storybook has no such consumer, so
// without this every brand name rendered as its own key -- the Files selector
// breadcrumb read "ProductName" rather than the product. test/setup.ts does the
// same for Vitest.
//
// `ProductName` is overridden rather than taken from the fixture: the fixture
// mirrors the portal's own brands.json, which still says "DocSpace", and
// test/setup.ts plus the expectations in errors/Errors.test.tsx are pinned to
// that value. Storybook shows the
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
      // No `matchers`: both name-based guesses did more harm than good.
      // `color: /(background|color)$/i` runs on every prop with a docgen type,
      // before a story's own argTypes override it, and warned for each match
      // not typed `string` -- which was all of them: union types
      // (`"accent" | (string & {})`) come out as "other", and
      // `withBackground` / `withoutBackground` are booleans.
      // `date: /Date$/i` gave the callback `setSelectedDate` a date control,
      // which fed a function to <input type="date"> ("0NaN-aN-aN"). Every
      // prop that wants a colour or date picker -- ColorPicker, Calendar,
      // DateTimePicker -- declares `control: "color"` / `"date"` itself.
    },
    darkMode: {
      light: lightTheme,
      dark: darkTheme,
    },
    docs: {
      container: DocsContainer,
      toc: true,
      // The README is the page; see .storybook/blocks/DocsPage.tsx.
      page: DocsPage,
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
          [
            // In the order a newcomer needs them: what the kit is and where
            // things live; the two providers every app mounts before anything
            // renders right; the agent skills, before the first line an agent
            // writes; working against a portal; then the reference pages,
            // read when a question comes up.
            "Welcome",
            "Structure",
            "Themes",
            "Translation",
            "Agent skills",
            "API",
            "Types and roles",
            "Hooks",
            "Utils",
            "Constants",
          ],
          "Components",
          [
            // The portal's three top-level lists, in its sidebar's order.
            "AI Chat",
            "AI Settings",
            "Files",
            "Rooms",
            "Forms",
            "Billing",
            "Uploader",
            "Document Editor",
            "Selectors",
            "Providers",
            "Errors",
          ],
          "UI",
          "Samples",
          [
            // Two samples. "Legal practice" is the main one: a client cabinet
            // for a law firm built against a real portal, one problem held
            // through the whole track, each screen a question and the
            // components that answer it, grouped under "Screens". "Setup"
            // holds the pages that wire a portal in. "A small Files app" is the general-purpose screen:
            // the same portal read through the layout components, with a
            // demo tree behind it when no portal is configured.
            "Legal practice",
            [
              "Overview",
              "The cabinet",
              "Screens",
              [
                "01. My matters",
                "02. Inside a matter",
                "03. Sending a document",
                "04. Reading the firm's draft",
                "05. Opening a matter",
              ],
              "Setup",
              [
                "Connect to a portal",
                "Who is signed in",
                "Demo data on your portal",
              ],
            ],
            "A small Files app",
          ],
        ],
      },
    },
  },

  initialGlobals: {
    apiConfig: "default",
    // "page" paints the story on a white or black page with a 20px margin.
    // "transparent" drops both, for scripts/docs/screenshots.mjs, which
    // photographs stories for the API site and needs the component alone.
    // Set from the URL: iframe.html?id=...&globals=canvas:transparent.
    canvas: "page",
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
      const transparent = context.globals.canvas === "transparent";
      const noPadding = context.parameters?.noPadding || transparent;

      return (
        <TranslationProvider locale="en" translations={translations}>
          <ThemeProviderComponent
            theme={{ ...theme, interfaceDirection }}
            currentColorScheme={currentColorScheme}
          >
            <div
              style={{
                backgroundColor: transparent
                  ? "transparent"
                  : isDark
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

  // The demo portal has to be answering before the first story asks it
  // anything; `startDemoPortal` starts the worker once and resolves at once
  // after that.
  loaders: [
    async () => {
      await startDemoPortal();
      return {};
    },
  ],

  tags: ["autodocs"],
};

export default preview;
