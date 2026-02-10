import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { ThemeKeys } from "../../enums";

import ThemeProvider from "./ThemeProvider";

const meta: Meta<typeof ThemeProvider> = {
  title: "Providers/ThemeProvider",
  component: ThemeProvider,
  parameters: {
    docs: {
      description: {
        component: `ThemeProvider resolves the active theme (light/dark/system) and provides it to child components via the \`ThemeProviderComponent\`.

### Features

- Resolves theme based on \`initialTheme\`, \`systemTheme\`, and system preference
- Fetches color theme from API if not provided
- Monitors system theme preference changes
- Supports RTL via the \`locale\` prop

### Usage

\`\`\`tsx
import { ThemeProvider } from "@docspace/ui-kit/providers/theme";
import { ThemeKeys } from "@docspace/ui-kit/enums";

<ThemeProvider initialTheme={ThemeKeys.BaseStr}>
  <App />
</ThemeProvider>
\`\`\``,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof ThemeProvider>;

const ThemedContent = () => (
  <div style={{ padding: "16px" }}>
    <h3>Themed Content</h3>
    <p>This content is rendered inside the ThemeProvider.</p>
    <div
      style={{
        marginTop: "12px",
        padding: "12px",
        border: "1px solid #ccc",
        borderRadius: "8px",
      }}
    >
      <p>Theme styling is applied via styled-components context.</p>
    </div>
  </div>
);

export const LightTheme: Story = {
  args: {
    initialTheme: ThemeKeys.BaseStr,
    children: <ThemedContent />,
  },
  parameters: {
    docs: {
      description: {
        story: "Light (Base) theme — the default.",
      },
    },
  },
};

export const DarkTheme: Story = {
  args: {
    initialTheme: ThemeKeys.DarkStr,
    children: <ThemedContent />,
  },
  parameters: {
    docs: {
      description: {
        story: "Dark theme variant.",
      },
    },
  },
};

export const SystemTheme: Story = {
  args: {
    initialTheme: ThemeKeys.SystemStr,
    children: <ThemedContent />,
  },
  parameters: {
    docs: {
      description: {
        story:
          "System theme follows the OS preference via `prefers-color-scheme`.",
      },
    },
  },
};
