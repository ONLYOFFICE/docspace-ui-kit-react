import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { useTheme } from "../../context/ThemeContext";

import { ThemeKeys } from "../../enums";

import ThemeProvider from "./ThemeProvider";

const meta: Meta<typeof ThemeProvider> = {
  title: "Components/Providers/ThemeProvider",
  component: ThemeProvider,
  // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
  // there is no second description to keep in step with it.
};

export default meta;

type Story = StoryObj<typeof ThemeProvider>;

// The content reads the theme back from ThemeContext.
const currentTheme = (canvas: { getByText: (text: string) => HTMLElement }) =>
  (canvas.getByText("Current theme:").parentElement as HTMLElement).textContent;

const ThemedContent = () => {
  const { isBase } = useTheme();
  const isDark = !isBase;

  return (
    <div
      style={{
        padding: "16px",
        backgroundColor: isDark ? "#333" : "#fff",
        color: isDark ? "#fff" : "#333",
        borderRadius: "8px",
        transition: "all 0.3s ease",
      }}
    >
      <h3>Themed Content</h3>
      <p>This content is rendered inside the ThemeProvider.</p>
      <p>
        <strong>Current theme:</strong> {isDark ? "Dark" : "Light"}
      </p>
      <div
        style={{
          marginTop: "12px",
          padding: "12px",
          border: `1px solid ${isDark ? "#555" : "#ccc"}`,
          borderRadius: "8px",
          backgroundColor: isDark ? "#444" : "#f5f5f5",
        }}
      >
        <p>Theme styling is applied via ThemeContext.</p>
        <p>Background color changes based on isBase property.</p>
      </div>
    </div>
  );
};

export const LightTheme: Story = {
  args: {
    initialTheme: ThemeKeys.BaseStr,
    children: <ThemedContent />,
  },
  play: async ({ canvas }) => {
    await expect(currentTheme(canvas)).toBe("Current theme: Light");
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
  play: async ({ canvas }) => {
    await expect(currentTheme(canvas)).toBe("Current theme: Dark");
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
  play: async ({ canvas }) => {
    // Whatever the browser reports as the system preference.
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    await expect(currentTheme(canvas)).toBe(
      `Current theme: ${prefersDark ? "Dark" : "Light"}`,
    );
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
