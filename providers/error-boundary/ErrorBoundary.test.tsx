import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import ErrorBoundary from "./ErrorBoundary";

const ThrowingComponent = ({ error }: { error: Error }) => {
  throw error;
};

describe("ErrorBoundary", () => {
  it("renders children when no error occurs", () => {
    render(
      <ErrorBoundary>
        <div data-testid="child">Hello</div>
      </ErrorBoundary>,
    );

    expect(screen.getByTestId("child")).toBeInTheDocument();
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("renders default ErrorContainer fallback on error", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowingComponent error={new Error("Test error")} />
      </ErrorBoundary>,
    );

    expect(screen.getByTestId("ErrorContainer")).toBeInTheDocument();
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByText("Test error")).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it("renders ReactNode fallback on error", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <ErrorBoundary fallback={<div data-testid="fallback">Oops!</div>}>
        <ThrowingComponent error={new Error("Test error")} />
      </ErrorBoundary>,
    );

    expect(screen.getByTestId("fallback")).toBeInTheDocument();
    expect(screen.getByText("Oops!")).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it("renders function fallback with error on error", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <ErrorBoundary
        fallback={(error) => (
          <div data-testid="fallback">Error: {error.message}</div>
        )}
      >
        <ThrowingComponent error={new Error("Custom message")} />
      </ErrorBoundary>,
    );

    expect(screen.getByTestId("fallback")).toBeInTheDocument();
    expect(screen.getByText("Error: Custom message")).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it("calls onError callback when error occurs", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const onError = vi.fn();

    render(
      <ErrorBoundary onError={onError}>
        <ThrowingComponent error={new Error("Callback test")} />
      </ErrorBoundary>,
    );

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Callback test" }),
      expect.objectContaining({ componentStack: expect.any(String) }),
    );

    consoleSpy.mockRestore();
  });
});
