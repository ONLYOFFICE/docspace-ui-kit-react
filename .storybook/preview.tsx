import type { Preview } from "@storybook/react";
import { useDarkMode } from "storybook-dark-mode";

import { ThemeProvider } from "../components/theme-provider";
import type { TColorScheme } from "../context/ThemeContext";

import { globalColors } from "../providers/theme/themes/globalColors";

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
  parameters: {
    backgrounds: { disable: true },
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
  },

  decorators: [
    (Story) => {
      const isDark = useDarkMode();

      const theme = isDark ? darkThemeConfig : baseTheme;
      const currentColorScheme = isDark ? darkColorScheme : lightColorScheme;

      return (
        <ThemeProvider theme={theme} currentColorScheme={currentColorScheme}>
          <div
            style={{
              backgroundColor: isDark ? globalColors.black : globalColors.white,
              color: isDark ? globalColors.white : globalColors.black,
              minHeight: "100vh",
              padding: "20px",
            }}
          >
            <Story />
          </div>
        </ThemeProvider>
      );
    },
  ],

  tags: ["autodocs"],
};

export default preview;
