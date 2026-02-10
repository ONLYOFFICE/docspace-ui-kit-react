import React from "react";
import type { Preview } from "@storybook/react";
import { useDarkMode } from "@vueless/storybook-dark-mode";

import { ThemeProviderComponent } from "../components/theme-provider";
import { TranslationProvider } from "../providers/translation";
import type { TTranslations } from "../providers/translation";

import type { TColorScheme } from "../context/ThemeContext";

import { globalColors } from "../providers/theme/themes/globalColors";
import globalTypes from "./globals";
import enCommon from "../locales/en/Common.json";

import "./styles.css";

import lightTheme from "./lightTheme";
import darkTheme from "./darkTheme";

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
      toc: true,
    },
  },

  decorators: [
    (Story, context) => {
      const isDark = useDarkMode();
      const interfaceDirection = context.globals.direction;

      const theme = isDark ? darkThemeConfig : baseTheme;
      const currentColorScheme = isDark ? darkColorScheme : lightColorScheme;

      const translations: TTranslations = new Map([
        ["en", new Map([["Common", enCommon]])],
      ]);

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
                padding: "20px",
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
