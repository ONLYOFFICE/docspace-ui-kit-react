import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { ThemeKeys } from "../../enums";

import ThemeProvider from "./ThemeProvider";

vi.mock("./useTheme", () => ({
  default: vi.fn(({ initialTheme }) => {
    const isBase = initialTheme !== ThemeKeys.DarkStr;
    return {
      theme: {
        isBase,
        interfaceDirection: "ltr",
        fontFamily: "Open Sans, sans-serif, Arial",
      },
      currentColorTheme: undefined,
    };
  }),
}));

vi.mock("../../components/theme-provider", () => ({
  ThemeProviderComponent: ({
    children,
    theme,
  }: {
    children: React.ReactNode;
    theme: { isBase: boolean };
  }) => (
    <div data-testid="theme-provider" data-is-base={String(theme.isBase)}>
      {children}
    </div>
  ),
}));

describe("ThemeProvider", () => {
  it("renders children", () => {
    render(
      <ThemeProvider>
        <div data-testid="child">Hello</div>
      </ThemeProvider>,
    );

    expect(screen.getByTestId("child")).toBeInTheDocument();
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("uses light (Base) theme by default", () => {
    render(
      <ThemeProvider>
        <span>Content</span>
      </ThemeProvider>,
    );

    expect(screen.getByTestId("theme-provider")).toHaveAttribute(
      "data-is-base",
      "true",
    );
  });

  it("uses dark theme when initialTheme is DarkStr", () => {
    render(
      <ThemeProvider initialTheme={ThemeKeys.DarkStr}>
        <span>Content</span>
      </ThemeProvider>,
    );

    expect(screen.getByTestId("theme-provider")).toHaveAttribute(
      "data-is-base",
      "false",
    );
  });

  it("passes theme to ThemeProviderComponent", () => {
    render(
      <ThemeProvider initialTheme={ThemeKeys.BaseStr}>
        <span>Content</span>
      </ThemeProvider>,
    );

    expect(screen.getByTestId("theme-provider")).toHaveAttribute(
      "data-is-base",
      "true",
    );
  });
});
