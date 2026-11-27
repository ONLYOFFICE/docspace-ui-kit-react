import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

import { useTheme } from "../../context";

import { ThemeProviderComponent } from ".";

const mockColorScheme = {
  id: 1,
  name: "Mock Theme",
  main: {
    accent: "#333333",
    buttons: "#0F4071",
  },
  text: {
    accent: "#333333",
    buttons: "#FFFFFF",
  },
};

// Mock types
type TInterfaceDirection = "ltr" | "rtl";

// Mock theme objects
const Base = {
  isBase: true,
  interfaceDirection: "ltr",
  fontFamily: "Open Sans, sans-serif, Arial",
} as Record<string, unknown>;

const Dark = {
  isBase: false,
  interfaceDirection: "ltr",
  fontFamily: "Open Sans, sans-serif, Arial",
} as Record<string, unknown>;

describe("ThemeProvider", () => {
  const TestChild = () => <div data-testid="test-child">Test Child</div>;

  beforeEach(() => {
    // Reset root element attributes and styles before each test
    document.documentElement.removeAttribute("data-theme");
    const styles = document.documentElement.style;
    styles.removeProperty("--color-scheme-main-accent");
    styles.removeProperty("--color-scheme-text-accent");
    styles.removeProperty("--color-scheme-main-buttons");
    styles.removeProperty("--color-scheme-text-buttons");
    styles.removeProperty("--interface-direction");
  });

  it("renders children correctly", () => {
    render(
      <ThemeProviderComponent theme={Base}>
        <TestChild />
      </ThemeProviderComponent>,
    );

    expect(screen.getByTestId("test-child")).toBeInTheDocument();
  });

  it("sets light theme correctly", () => {
    render(
      <ThemeProviderComponent theme={Base}>
        <TestChild />
      </ThemeProviderComponent>,
    );

    expect(document.documentElement).toHaveAttribute("data-theme", "light");
  });

  it("sets dark theme correctly", () => {
    render(
      <ThemeProviderComponent theme={Dark}>
        <TestChild />
      </ThemeProviderComponent>,
    );

    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
  });

  it("sets interface direction correctly", () => {
    const rtlTheme = {
      ...Base,
      interfaceDirection: "rtl" as TInterfaceDirection,
    };
    render(
      <ThemeProviderComponent theme={rtlTheme}>
        <TestChild />
      </ThemeProviderComponent>,
    );

    expect(
      document.documentElement.style.getPropertyValue("--interface-direction"),
    ).toBe("rtl");
  });

  it("sets color scheme correctly", () => {
    render(
      <ThemeProviderComponent theme={Base} currentColorScheme={mockColorScheme}>
        <TestChild />
      </ThemeProviderComponent>,
    );

    const rootStyles = document.documentElement.style;
    expect(rootStyles.getPropertyValue("--color-scheme-main-accent")).toBe(
      mockColorScheme.main.accent,
    );
    expect(rootStyles.getPropertyValue("--color-scheme-text-accent")).toBe(
      mockColorScheme.text.accent,
    );
    expect(rootStyles.getPropertyValue("--color-scheme-main-buttons")).toBe(
      mockColorScheme.main.buttons,
    );
    expect(rootStyles.getPropertyValue("--color-scheme-text-buttons")).toBe(
      mockColorScheme.text.buttons,
    );
  });

  it("updates theme when props change", () => {
    const { rerender } = render(
      <ThemeProviderComponent theme={Base}>
        <TestChild />
      </ThemeProviderComponent>,
    );

    expect(document.documentElement).toHaveAttribute("data-theme", "light");

    rerender(
      <ThemeProviderComponent theme={Dark}>
        <TestChild />
      </ThemeProviderComponent>,
    );

    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
  });

  it("updates color scheme when props change", () => {
    const { rerender } = render(
      <ThemeProviderComponent theme={Base} currentColorScheme={mockColorScheme}>
        <TestChild />
      </ThemeProviderComponent>,
    );

    const newColorScheme = {
      id: 2,
      name: "New Theme",
      main: {
        accent: "#444444",
        buttons: "#1F5081",
      },
      text: {
        accent: "#444444",
        buttons: "#EEEEEE",
      },
    };

    rerender(
      <ThemeProviderComponent theme={Base} currentColorScheme={newColorScheme}>
        <TestChild />
      </ThemeProviderComponent>,
    );

    const rootStyles = document.documentElement.style;
    expect(rootStyles.getPropertyValue("--color-scheme-main-accent")).toBe(
      newColorScheme.main.accent,
    );
    expect(rootStyles.getPropertyValue("--color-scheme-text-accent")).toBe(
      newColorScheme.text.accent,
    );
    expect(rootStyles.getPropertyValue("--color-scheme-main-buttons")).toBe(
      newColorScheme.main.buttons,
    );
    expect(rootStyles.getPropertyValue("--color-scheme-text-buttons")).toBe(
      newColorScheme.text.buttons,
    );
  });

  it("handles theme change with color scheme", () => {
    const { rerender } = render(
      <ThemeProviderComponent theme={Base} currentColorScheme={mockColorScheme}>
        <TestChild />
      </ThemeProviderComponent>,
    );

    expect(document.documentElement).toHaveAttribute("data-theme", "light");

    rerender(
      <ThemeProviderComponent theme={Dark} currentColorScheme={mockColorScheme}>
        <TestChild />
      </ThemeProviderComponent>,
    );

    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    const rootStyles = document.documentElement.style;
    expect(rootStyles.getPropertyValue("--color-scheme-main-accent")).toBe(
      mockColorScheme.main.accent,
    );
  });

  it("treats a theme without isBase as light in the context too", () => {
    const ThemeName = () => <div data-testid="theme">{useTheme().theme}</div>;
    render(
      <ThemeProviderComponent theme={{ interfaceDirection: "ltr" }}>
        <ThemeName />
      </ThemeProviderComponent>,
    );

    expect(document.body).toHaveClass("light");
    expect(screen.getByTestId("theme")).toHaveTextContent("Base");
  });

  it("leaves the page as it found it when unmounted", () => {
    const { unmount } = render(
      <ThemeProviderComponent
        theme={{ ...Dark, interfaceDirection: "rtl", fontFamily: "Lato" }}
        currentColorScheme={mockColorScheme}
      >
        <TestChild />
      </ThemeProviderComponent>,
    );

    unmount();

    const root = document.documentElement;
    expect(root).not.toHaveAttribute("data-theme");
    expect(root).not.toHaveAttribute("data-dir");
    expect(root.style.getPropertyValue("--interface-direction")).toBe("");
    expect(root.style.getPropertyValue("--color-scheme-main-accent")).toBe("");
    expect(document.body).not.toHaveClass("dark");
    expect(document.body).not.toHaveClass("rtl");
    expect(document.body.style.getPropertyValue("--font-family")).toBe("");
  });

  it("leaves the outer theme when a nested provider mounts with it", () => {
    const { unmount } = render(
      <ThemeProviderComponent theme={Dark}>
        <ThemeProviderComponent theme={Base}>
          <TestChild />
        </ThemeProviderComponent>
      </ThemeProviderComponent>,
    );
    // The nested effect runs first, so the outer provider's write is last.
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");

    unmount();
    expect(document.documentElement).not.toHaveAttribute("data-theme");
  });

  it("hands the page back to the provider around it", () => {
    const Page = ({ inner }: { inner: boolean }) => (
      <ThemeProviderComponent theme={Dark} currentColorScheme={mockColorScheme}>
        {inner ? (
          <ThemeProviderComponent
            theme={Base}
            currentColorScheme={{
              ...mockColorScheme,
              main: { accent: "#444444", buttons: "#444444" },
            }}
          >
            <TestChild />
          </ThemeProviderComponent>
        ) : null}
      </ThemeProviderComponent>
    );
    const { rerender } = render(<Page inner={false} />);
    rerender(<Page inner />);
    expect(document.documentElement).toHaveAttribute("data-theme", "light");

    rerender(<Page inner={false} />);

    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    expect(document.body).toHaveClass("dark");
    expect(
      document.body.style.getPropertyValue("--color-scheme-main-accent"),
    ).toBe(mockColorScheme.main.accent);
  });

  it("takes the accent off when the scheme goes", () => {
    const { rerender } = render(
      <ThemeProviderComponent theme={Base} currentColorScheme={mockColorScheme}>
        <TestChild />
      </ThemeProviderComponent>,
    );

    rerender(
      <ThemeProviderComponent theme={Base}>
        <TestChild />
      </ThemeProviderComponent>,
    );

    expect(
      document.documentElement.style.getPropertyValue(
        "--color-scheme-main-accent",
      ),
    ).toBe("");
    expect(
      document.body.style.getPropertyValue("--color-scheme-main-accent"),
    ).toBe("");
  });

  it("applies SCSS styles correctly", () => {
    render(
      <ThemeProviderComponent theme={Base}>
        <div className="accent-main" data-testid="accent-main">
          Accent Main
        </div>
        <div className="accent-text" data-testid="accent-text">
          Accent Text
        </div>
        <div className="accent-button" data-testid="accent-button">
          Accent Button
        </div>
      </ThemeProviderComponent>,
    );

    const accentMain = screen.getByTestId("accent-main");
    const accentText = screen.getByTestId("accent-text");
    const accentButton = screen.getByTestId("accent-button");

    expect(window.getComputedStyle(accentMain).color).toBeDefined();
    expect(window.getComputedStyle(accentText).color).toBeDefined();
    expect(window.getComputedStyle(accentButton).backgroundColor).toBeDefined();
  });
});
