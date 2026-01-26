import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { renderHook } from "@testing-library/react";

import {
  InterfaceDirectionProvider,
  useInterfaceDirection,
  type TInterfaceDirection,
} from ".";

describe("InterfaceDirectionContext", () => {
  const TestChild = ({ testId = "test-child" }: { testId?: string }) => (
    <div data-testid={testId}>Test Child</div>
  );

  describe("InterfaceDirectionProvider", () => {
    it("renders children correctly", () => {
      render(
        <InterfaceDirectionProvider interfaceDirection="ltr">
          <TestChild />
        </InterfaceDirectionProvider>,
      );

      expect(screen.getByTestId("test-child")).toBeInTheDocument();
    });

    it("provides LTR direction correctly", () => {
      const TestComponent = () => {
        const { interfaceDirection, isRTL } = useInterfaceDirection();
        return (
          <div data-testid="direction-test">
            <span data-testid="direction">{interfaceDirection}</span>
            <span data-testid="is-rtl">{isRTL.toString()}</span>
          </div>
        );
      };

      render(
        <InterfaceDirectionProvider interfaceDirection="ltr">
          <TestComponent />
        </InterfaceDirectionProvider>,
      );

      expect(screen.getByTestId("direction")).toHaveTextContent("ltr");
      expect(screen.getByTestId("is-rtl")).toHaveTextContent("false");
    });

    it("provides RTL direction correctly", () => {
      const TestComponent = () => {
        const { interfaceDirection, isRTL } = useInterfaceDirection();
        return (
          <div data-testid="direction-test">
            <span data-testid="direction">{interfaceDirection}</span>
            <span data-testid="is-rtl">{isRTL.toString()}</span>
          </div>
        );
      };

      render(
        <InterfaceDirectionProvider interfaceDirection="rtl">
          <TestComponent />
        </InterfaceDirectionProvider>,
      );

      expect(screen.getByTestId("direction")).toHaveTextContent("rtl");
      expect(screen.getByTestId("is-rtl")).toHaveTextContent("true");
    });

    it("updates direction when props change", () => {
      const TestComponent = () => {
        const { interfaceDirection, isRTL } = useInterfaceDirection();
        return (
          <div data-testid="direction-test">
            <span data-testid="direction">{interfaceDirection}</span>
            <span data-testid="is-rtl">{isRTL.toString()}</span>
          </div>
        );
      };

      const { rerender } = render(
        <InterfaceDirectionProvider interfaceDirection="ltr">
          <TestComponent />
        </InterfaceDirectionProvider>,
      );

      expect(screen.getByTestId("direction")).toHaveTextContent("ltr");
      expect(screen.getByTestId("is-rtl")).toHaveTextContent("false");

      rerender(
        <InterfaceDirectionProvider interfaceDirection="rtl">
          <TestComponent />
        </InterfaceDirectionProvider>,
      );

      expect(screen.getByTestId("direction")).toHaveTextContent("rtl");
      expect(screen.getByTestId("is-rtl")).toHaveTextContent("true");
    });
  });

  describe("useInterfaceDirection hook", () => {
    it("returns default LTR direction when used outside provider", () => {
      const { result } = renderHook(() => useInterfaceDirection());

      expect(result.current.interfaceDirection).toBe("ltr");
      expect(result.current.isRTL).toBe(false);
    });

    it("returns correct values for LTR direction", () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <InterfaceDirectionProvider interfaceDirection="ltr">
          {children}
        </InterfaceDirectionProvider>
      );

      const { result } = renderHook(() => useInterfaceDirection(), {
        wrapper,
      });

      expect(result.current.interfaceDirection).toBe("ltr");
      expect(result.current.isRTL).toBe(false);
    });

    it("returns correct values for RTL direction", () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <InterfaceDirectionProvider interfaceDirection="rtl">
          {children}
        </InterfaceDirectionProvider>
      );

      const { result } = renderHook(() => useInterfaceDirection(), {
        wrapper,
      });

      expect(result.current.interfaceDirection).toBe("rtl");
      expect(result.current.isRTL).toBe(true);
    });

    it("updates when context value changes", () => {
      let direction: TInterfaceDirection = "ltr";

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <InterfaceDirectionProvider interfaceDirection={direction}>
          {children}
        </InterfaceDirectionProvider>
      );

      const { result, rerender } = renderHook(() => useInterfaceDirection(), {
        wrapper,
      });

      expect(result.current.interfaceDirection).toBe("ltr");
      expect(result.current.isRTL).toBe(false);

      direction = "rtl";
      rerender();

      expect(result.current.interfaceDirection).toBe("rtl");
      expect(result.current.isRTL).toBe(true);
    });
  });
});
