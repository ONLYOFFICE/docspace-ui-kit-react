// (c) Copyright Ascensio System SIA 2009-2026
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import {
  ThemeContextProvider as ThemeProvider,
  useTheme,
  type TColorScheme,
} from "./index";

// Mock color schemes for testing
const mockColorSchemes = {
  blue: {
    id: 1,
    name: "Blue",
    main: { accent: "#4B72D6", buttons: "#4B72D6" },
    text: { accent: "#FFFFFF", buttons: "#FFFFFF" },
  },
  green: {
    id: 2,
    name: "Green",
    main: { accent: "#22C55E", buttons: "#22C55E" },
    text: { accent: "#000000", buttons: "#000000" },
  },
  red: {
    id: 3,
    name: "Red",
    main: { accent: "#EF4444", buttons: "#EF4444" },
    text: { accent: "#FFFFFF", buttons: "#FFFFFF" },
  },
} satisfies Record<string, TColorScheme>;

// Test component to access the theme context
const TestComponent = ({ testId = "test-component" }: { testId?: string }) => {
  const { theme, isBase, currentColorScheme } = useTheme();

  return (
    <div data-testid={testId}>
      <span data-testid="theme">{theme}</span>
      <span data-testid="is-base">{isBase ? "true" : "false"}</span>
      {currentColorScheme && (
        <>
          <span data-testid="color-scheme-id">{currentColorScheme.id}</span>
          <span data-testid="color-scheme-name">{currentColorScheme.name}</span>
          <span data-testid="main-accent">
            {currentColorScheme.main?.accent}
          </span>
          <span data-testid="main-buttons">
            {currentColorScheme.main?.buttons}
          </span>
          <span data-testid="text-accent">
            {currentColorScheme.text?.accent}
          </span>
          <span data-testid="text-buttons">
            {currentColorScheme.text?.buttons}
          </span>
        </>
      )}
    </div>
  );
};

// Component that conditionally renders based on theme
const ThemeAwareComponent = () => {
  const { theme, isBase } = useTheme();

  return (
    <div data-testid="theme-aware">
      <div data-testid="theme-class" className={isBase ? "light" : "dark"}>
        Theme: {theme}
      </div>
      {isBase ? (
        <div data-testid="light-only">Light Mode Content</div>
      ) : (
        <div data-testid="dark-only">Dark Mode Content</div>
      )}
    </div>
  );
};

// Component that uses color scheme for styling
const ColorSchemeAwareComponent = () => {
  const { currentColorScheme } = useTheme();

  if (!currentColorScheme) {
    return <div data-testid="no-color-scheme">No color scheme</div>;
  }

  return (
    <div
      data-testid="color-scheme-aware"
      style={{
        backgroundColor: currentColorScheme.main?.accent ?? "",
        color: currentColorScheme.text?.accent ?? "",
      }}
    >
      <button
        type="button"
        style={{
          backgroundColor: currentColorScheme.main?.buttons ?? "",
          color: currentColorScheme.text?.buttons ?? "",
        }}
      >
        Styled Button
      </button>
    </div>
  );
};

describe("ThemeProvider", () => {
  describe("Basic Rendering", () => {
    it("renders children without error", () => {
      render(
        <ThemeProvider theme="Base">
          <div data-testid="child">Child Content</div>
        </ThemeProvider>,
      );
      expect(screen.getByTestId("child")).toBeInTheDocument();
      expect(screen.getByText("Child Content")).toBeInTheDocument();
    });

    it("renders multiple children correctly", () => {
      render(
        <ThemeProvider theme="Base">
          <div data-testid="child-1">First</div>
          <div data-testid="child-2">Second</div>
          <div data-testid="child-3">Third</div>
        </ThemeProvider>,
      );

      expect(screen.getByTestId("child-1")).toBeInTheDocument();
      expect(screen.getByTestId("child-2")).toBeInTheDocument();
      expect(screen.getByTestId("child-3")).toBeInTheDocument();
    });

    it("handles null children gracefully", () => {
      render(
        <ThemeProvider theme="Base">
          {null}
          <div data-testid="child">Content</div>
        </ThemeProvider>,
      );
      expect(screen.getByTestId("child")).toBeInTheDocument();
    });
  });

  describe("Theme Provision", () => {
    it("provides Base theme to children", () => {
      render(
        <ThemeProvider theme="Base">
          <TestComponent />
        </ThemeProvider>,
      );

      expect(screen.getByTestId("theme")).toHaveTextContent("Base");
      expect(screen.getByTestId("is-base")).toHaveTextContent("true");
    });

    it("provides Dark theme to children", () => {
      render(
        <ThemeProvider theme="Dark">
          <TestComponent />
        </ThemeProvider>,
      );

      expect(screen.getByTestId("theme")).toHaveTextContent("Dark");
      expect(screen.getByTestId("is-base")).toHaveTextContent("false");
    });

    it("works with conditional rendering based on theme", () => {
      const { rerender } = render(
        <ThemeProvider theme="Base">
          <ThemeAwareComponent />
        </ThemeProvider>,
      );

      expect(screen.getByTestId("theme-class")).toHaveClass("light");
      expect(screen.getByTestId("light-only")).toBeInTheDocument();
      expect(screen.queryByTestId("dark-only")).not.toBeInTheDocument();

      rerender(
        <ThemeProvider theme="Dark">
          <ThemeAwareComponent />
        </ThemeProvider>,
      );

      expect(screen.getByTestId("theme-class")).toHaveClass("dark");
      expect(screen.queryByTestId("light-only")).not.toBeInTheDocument();
      expect(screen.getByTestId("dark-only")).toBeInTheDocument();
    });
  });

  describe("Color Scheme Support", () => {
    it("provides color scheme when specified", () => {
      render(
        <ThemeProvider theme="Base" currentColorScheme={mockColorSchemes.blue}>
          <TestComponent />
        </ThemeProvider>,
      );

      expect(screen.getByTestId("color-scheme-id")).toHaveTextContent("1");
      expect(screen.getByTestId("color-scheme-name")).toHaveTextContent("Blue");
      expect(screen.getByTestId("main-accent")).toHaveTextContent("#4B72D6");
      expect(screen.getByTestId("main-buttons")).toHaveTextContent("#4B72D6");
      expect(screen.getByTestId("text-accent")).toHaveTextContent("#FFFFFF");
      expect(screen.getByTestId("text-buttons")).toHaveTextContent("#FFFFFF");
    });

    it("works without color scheme", () => {
      render(
        <ThemeProvider theme="Base">
          <TestComponent />
        </ThemeProvider>,
      );

      expect(screen.queryByTestId("color-scheme-id")).not.toBeInTheDocument();
      expect(screen.queryByTestId("color-scheme-name")).not.toBeInTheDocument();
    });

    it("applies color scheme to styled components", () => {
      const { container } = render(
        <ThemeProvider theme="Base" currentColorScheme={mockColorSchemes.green}>
          <ColorSchemeAwareComponent />
        </ThemeProvider>,
      );

      const styledDiv = screen.getByTestId("color-scheme-aware");
      expect(styledDiv).toHaveStyle({
        backgroundColor: "#22C55E",
        color: "#000000",
      });

      const button = container.querySelector("button");
      expect(button).toHaveStyle({
        backgroundColor: "#22C55E",
        color: "#000000",
      });
    });

    it("handles missing color scheme gracefully", () => {
      render(
        <ThemeProvider theme="Dark">
          <ColorSchemeAwareComponent />
        </ThemeProvider>,
      );

      expect(screen.getByTestId("no-color-scheme")).toBeInTheDocument();
    });
  });

  describe("Dynamic Updates", () => {
    it("updates theme when prop changes", () => {
      const { rerender } = render(
        <ThemeProvider theme="Base">
          <TestComponent />
        </ThemeProvider>,
      );

      expect(screen.getByTestId("theme")).toHaveTextContent("Base");
      expect(screen.getByTestId("is-base")).toHaveTextContent("true");

      rerender(
        <ThemeProvider theme="Dark">
          <TestComponent />
        </ThemeProvider>,
      );

      expect(screen.getByTestId("theme")).toHaveTextContent("Dark");
      expect(screen.getByTestId("is-base")).toHaveTextContent("false");
    });

    it("updates color scheme when prop changes", () => {
      const { rerender } = render(
        <ThemeProvider theme="Base" currentColorScheme={mockColorSchemes.blue}>
          <TestComponent />
        </ThemeProvider>,
      );

      expect(screen.getByTestId("color-scheme-id")).toHaveTextContent("1");
      expect(screen.getByTestId("color-scheme-name")).toHaveTextContent("Blue");
      expect(screen.getByTestId("main-accent")).toHaveTextContent("#4B72D6");

      rerender(
        <ThemeProvider theme="Base" currentColorScheme={mockColorSchemes.green}>
          <TestComponent />
        </ThemeProvider>,
      );

      expect(screen.getByTestId("color-scheme-id")).toHaveTextContent("2");
      expect(screen.getByTestId("color-scheme-name")).toHaveTextContent(
        "Green",
      );
      expect(screen.getByTestId("main-accent")).toHaveTextContent("#22C55E");
      expect(screen.getByTestId("text-accent")).toHaveTextContent("#000000");
    });

    it("can remove color scheme by setting to undefined", () => {
      const { rerender } = render(
        <ThemeProvider theme="Base" currentColorScheme={mockColorSchemes.red}>
          <TestComponent />
        </ThemeProvider>,
      );

      expect(screen.getByTestId("color-scheme-id")).toBeInTheDocument();
      expect(screen.getByTestId("color-scheme-name")).toHaveTextContent("Red");

      rerender(
        <ThemeProvider theme="Base" currentColorScheme={undefined}>
          <TestComponent />
        </ThemeProvider>,
      );

      expect(screen.queryByTestId("color-scheme-id")).not.toBeInTheDocument();
    });

    it("updates both theme and color scheme simultaneously", () => {
      const { rerender } = render(
        <ThemeProvider theme="Base" currentColorScheme={mockColorSchemes.blue}>
          <TestComponent />
        </ThemeProvider>,
      );

      expect(screen.getByTestId("theme")).toHaveTextContent("Base");
      expect(screen.getByTestId("color-scheme-name")).toHaveTextContent("Blue");

      rerender(
        <ThemeProvider theme="Dark" currentColorScheme={mockColorSchemes.red}>
          <TestComponent />
        </ThemeProvider>,
      );

      expect(screen.getByTestId("theme")).toHaveTextContent("Dark");
      expect(screen.getByTestId("color-scheme-name")).toHaveTextContent("Red");
    });
  });
});

describe("useTheme Hook", () => {
  describe("Return Values", () => {
    it("returns theme context values", () => {
      render(
        <ThemeProvider theme="Base">
          <TestComponent />
        </ThemeProvider>,
      );

      expect(screen.getByTestId("theme")).toHaveTextContent("Base");
      expect(screen.getByTestId("is-base")).toHaveTextContent("true");
    });

    it("returns correct isBase value for Base theme", () => {
      render(
        <ThemeProvider theme="Base">
          <TestComponent />
        </ThemeProvider>,
      );

      expect(screen.getByTestId("is-base")).toHaveTextContent("true");
    });

    it("returns correct isBase value for Dark theme", () => {
      render(
        <ThemeProvider theme="Dark">
          <TestComponent />
        </ThemeProvider>,
      );

      expect(screen.getByTestId("is-base")).toHaveTextContent("false");
    });

    it("returns currentColorScheme when provided", () => {
      const customScheme: TColorScheme = {
        id: 99,
        name: "Custom",
        main: { accent: "#FF0000", buttons: "#00FF00" },
        text: { accent: "#0000FF", buttons: "#FFFF00" },
      };

      render(
        <ThemeProvider theme="Dark" currentColorScheme={customScheme}>
          <TestComponent />
        </ThemeProvider>,
      );

      expect(screen.getByTestId("color-scheme-id")).toHaveTextContent("99");
      expect(screen.getByTestId("color-scheme-name")).toHaveTextContent(
        "Custom",
      );
      expect(screen.getByTestId("main-accent")).toHaveTextContent("#FF0000");
      expect(screen.getByTestId("main-buttons")).toHaveTextContent("#00FF00");
      expect(screen.getByTestId("text-accent")).toHaveTextContent("#0000FF");
      expect(screen.getByTestId("text-buttons")).toHaveTextContent("#FFFF00");
    });

    it("returns undefined for currentColorScheme when not provided", () => {
      render(
        <ThemeProvider theme="Base">
          <TestComponent />
        </ThemeProvider>,
      );

      expect(screen.queryByTestId("color-scheme-id")).not.toBeInTheDocument();
    });
  });

  describe("Hook Behavior", () => {
    it("can be called multiple times in the same component", () => {
      const MultipleHookCallComponent = () => {
        const theme1 = useTheme();
        const theme2 = useTheme();
        const theme3 = useTheme();

        return (
          <div data-testid="multiple-calls">
            <span data-testid="call-1">{theme1.theme}</span>
            <span data-testid="call-2">{theme2.theme}</span>
            <span data-testid="call-3">{theme3.theme}</span>
          </div>
        );
      };

      render(
        <ThemeProvider theme="Dark">
          <MultipleHookCallComponent />
        </ThemeProvider>,
      );

      expect(screen.getByTestId("call-1")).toHaveTextContent("Dark");
      expect(screen.getByTestId("call-2")).toHaveTextContent("Dark");
      expect(screen.getByTestId("call-3")).toHaveTextContent("Dark");
    });

    it("provides consistent values across re-renders", () => {
      const { rerender } = render(
        <ThemeProvider theme="Base" currentColorScheme={mockColorSchemes.blue}>
          <TestComponent />
        </ThemeProvider>,
      );

      const initialTheme = screen.getByTestId("theme").textContent;
      const initialScheme = screen.getByTestId("color-scheme-name").textContent;

      // Re-render with same props
      rerender(
        <ThemeProvider theme="Base" currentColorScheme={mockColorSchemes.blue}>
          <TestComponent />
        </ThemeProvider>,
      );

      expect(screen.getByTestId("theme")).toHaveTextContent(initialTheme);
      expect(screen.getByTestId("color-scheme-name")).toHaveTextContent(
        initialScheme,
      );
    });
  });
});

describe("Nested Providers", () => {
  describe("Theme Override", () => {
    it("inner provider overrides outer provider", () => {
      render(
        <ThemeProvider theme="Base">
          <TestComponent testId="outer" />
          <ThemeProvider theme="Dark">
            <TestComponent testId="inner" />
          </ThemeProvider>
        </ThemeProvider>,
      );

      const outerTheme = screen
        .getByTestId("outer")
        .querySelector('[data-testid="theme"]');
      const innerTheme = screen
        .getByTestId("inner")
        .querySelector('[data-testid="theme"]');

      expect(outerTheme).toHaveTextContent("Base");
      expect(innerTheme).toHaveTextContent("Dark");
    });

    it("deeply nested providers work correctly", () => {
      render(
        <ThemeProvider theme="Base">
          <TestComponent testId="level-1" />
          <ThemeProvider theme="Dark">
            <TestComponent testId="level-2" />
            <ThemeProvider theme="Base">
              <TestComponent testId="level-3" />
            </ThemeProvider>
          </ThemeProvider>
        </ThemeProvider>,
      );

      expect(
        screen.getByTestId("level-1").querySelector('[data-testid="theme"]'),
      ).toHaveTextContent("Base");
      expect(
        screen.getByTestId("level-2").querySelector('[data-testid="theme"]'),
      ).toHaveTextContent("Dark");
      expect(
        screen.getByTestId("level-3").querySelector('[data-testid="theme"]'),
      ).toHaveTextContent("Base");
    });
  });

  describe("Color Scheme Override", () => {
    it("inner provider can have different color scheme", () => {
      render(
        <ThemeProvider theme="Base" currentColorScheme={mockColorSchemes.blue}>
          <TestComponent testId="outer" />
          <ThemeProvider theme="Base" currentColorScheme={mockColorSchemes.red}>
            <TestComponent testId="inner" />
          </ThemeProvider>
        </ThemeProvider>,
      );

      const outerName = screen
        .getByTestId("outer")
        .querySelector('[data-testid="color-scheme-name"]');
      const innerName = screen
        .getByTestId("inner")
        .querySelector('[data-testid="color-scheme-name"]');

      expect(outerName).toHaveTextContent("Blue");
      expect(innerName).toHaveTextContent("Red");
    });

    it("inner provider can remove color scheme", () => {
      render(
        <ThemeProvider theme="Base" currentColorScheme={mockColorSchemes.green}>
          <TestComponent testId="outer" />
          <ThemeProvider theme="Base">
            <TestComponent testId="inner" />
          </ThemeProvider>
        </ThemeProvider>,
      );

      expect(
        screen
          .getByTestId("outer")
          .querySelector('[data-testid="color-scheme-name"]'),
      ).toBeInTheDocument();
      expect(
        screen
          .getByTestId("inner")
          .querySelector('[data-testid="color-scheme-name"]'),
      ).not.toBeInTheDocument();
    });
  });
});

describe("Type Safety", () => {
  it("accepts Base theme type", () => {
    const theme = "Base";
    render(
      <ThemeProvider theme={theme}>
        <TestComponent />
      </ThemeProvider>,
    );

    expect(screen.getByTestId("theme")).toHaveTextContent("Base");
  });

  it("accepts Dark theme type", () => {
    const theme = "Dark";
    render(
      <ThemeProvider theme={theme}>
        <TestComponent />
      </ThemeProvider>,
    );

    expect(screen.getByTestId("theme")).toHaveTextContent("Dark");
  });

  it("color scheme object has correct structure", () => {
    const scheme = mockColorSchemes.blue;

    expect(scheme).toHaveProperty("id");
    expect(scheme).toHaveProperty("name");
    expect(scheme).toHaveProperty("main.accent");
    expect(scheme).toHaveProperty("main.buttons");
    expect(scheme).toHaveProperty("text.accent");
    expect(scheme).toHaveProperty("text.buttons");
  });
});

describe("Multiple Consumers", () => {
  it("all components receive the same theme context", () => {
    render(
      <ThemeProvider theme="Dark">
        <TestComponent testId="component-1" />
        <TestComponent testId="component-2" />
        <TestComponent testId="component-3" />
      </ThemeProvider>,
    );

    const theme1 = screen
      .getByTestId("component-1")
      .querySelector('[data-testid="theme"]');
    const theme2 = screen
      .getByTestId("component-2")
      .querySelector('[data-testid="theme"]');
    const theme3 = screen
      .getByTestId("component-3")
      .querySelector('[data-testid="theme"]');

    expect(theme1).toHaveTextContent("Dark");
    expect(theme2).toHaveTextContent("Dark");
    expect(theme3).toHaveTextContent("Dark");
  });

  it("all components receive the same color scheme", () => {
    render(
      <ThemeProvider theme="Base" currentColorScheme={mockColorSchemes.red}>
        <TestComponent testId="component-1" />
        <TestComponent testId="component-2" />
      </ThemeProvider>,
    );

    const id1 = screen
      .getByTestId("component-1")
      .querySelector('[data-testid="color-scheme-id"]');
    const id2 = screen
      .getByTestId("component-2")
      .querySelector('[data-testid="color-scheme-id"]');

    expect(id1).toHaveTextContent("3");
    expect(id2).toHaveTextContent("3");
  });

  it("updates all consumers when theme changes", () => {
    const { rerender } = render(
      <ThemeProvider theme="Base">
        <TestComponent testId="component-1" />
        <TestComponent testId="component-2" />
      </ThemeProvider>,
    );

    rerender(
      <ThemeProvider theme="Dark">
        <TestComponent testId="component-1" />
        <TestComponent testId="component-2" />
      </ThemeProvider>,
    );

    expect(
      screen.getByTestId("component-1").querySelector('[data-testid="theme"]'),
    ).toHaveTextContent("Dark");
    expect(
      screen.getByTestId("component-2").querySelector('[data-testid="theme"]'),
    ).toHaveTextContent("Dark");
  });
});

describe("Edge Cases", () => {
  it("handles rapid theme switches", () => {
    const { rerender } = render(
      <ThemeProvider theme="Base">
        <TestComponent />
      </ThemeProvider>,
    );

    // Rapidly switch themes
    rerender(
      <ThemeProvider theme="Dark">
        <TestComponent />
      </ThemeProvider>,
    );
    rerender(
      <ThemeProvider theme="Base">
        <TestComponent />
      </ThemeProvider>,
    );
    rerender(
      <ThemeProvider theme="Dark">
        <TestComponent />
      </ThemeProvider>,
    );

    expect(screen.getByTestId("theme")).toHaveTextContent("Dark");
    expect(screen.getByTestId("is-base")).toHaveTextContent("false");
  });

  it("handles rapid color scheme changes", () => {
    const { rerender } = render(
      <ThemeProvider theme="Base" currentColorScheme={mockColorSchemes.blue}>
        <TestComponent />
      </ThemeProvider>,
    );

    rerender(
      <ThemeProvider theme="Base" currentColorScheme={mockColorSchemes.green}>
        <TestComponent />
      </ThemeProvider>,
    );
    rerender(
      <ThemeProvider theme="Base" currentColorScheme={mockColorSchemes.red}>
        <TestComponent />
      </ThemeProvider>,
    );

    expect(screen.getByTestId("color-scheme-name")).toHaveTextContent("Red");
  });

  it("handles theme with empty children", () => {
    render(<ThemeProvider theme="Base">test</ThemeProvider>);
    // Should not throw error
  });

  it("works with fragments as children", () => {
    render(
      <ThemeProvider theme="Dark">
        <>
          <TestComponent testId="frag-1" />
          <TestComponent testId="frag-2" />
        </>
      </ThemeProvider>,
    );

    expect(screen.getByTestId("frag-1")).toBeInTheDocument();
    expect(screen.getByTestId("frag-2")).toBeInTheDocument();
  });
});

describe("Integration Scenarios", () => {
  it("works with conditional rendering", () => {
    const ConditionalComponent = ({ show }: { show: boolean }) => {
      const { theme } = useTheme();
      return show ? <div data-testid="conditional">{theme}</div> : null;
    };

    const { rerender } = render(
      <ThemeProvider theme="Base">
        <ConditionalComponent show={false} />
      </ThemeProvider>,
    );

    expect(screen.queryByTestId("conditional")).not.toBeInTheDocument();

    rerender(
      <ThemeProvider theme="Base">
        <ConditionalComponent show />
      </ThemeProvider>,
    );

    expect(screen.getByTestId("conditional")).toHaveTextContent("Base");
  });

  it("persists theme across component unmount/remount", () => {
    const { unmount } = render(
      <ThemeProvider theme="Dark" currentColorScheme={mockColorSchemes.blue}>
        <TestComponent />
      </ThemeProvider>,
    );

    const initialTheme = screen.getByTestId("theme").textContent;

    unmount();

    render(
      <ThemeProvider theme="Dark" currentColorScheme={mockColorSchemes.blue}>
        <TestComponent />
      </ThemeProvider>,
    );

    expect(screen.getByTestId("theme")).toHaveTextContent(initialTheme);
  });
});
