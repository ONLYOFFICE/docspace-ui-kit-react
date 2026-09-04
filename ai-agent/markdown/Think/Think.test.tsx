import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Think from "./index";

// Mock child components
vi.mock("../../../components/loader", () => ({
  Loader: ({ "data-testid": testId }: { "data-testid"?: string }) => (
    <div data-testid={testId || "loader"} />
  ),
  LoaderTypes: { track: "track" },
}));
vi.mock("../../../components/text", () => ({
  Text: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock utils
vi.mock("../../../utils/i18n", () => ({
  useCommonTranslation: () => vi.fn((key) => key),
}));

describe("<Think />", () => {
  it("renders loader by default when not finished", () => {
    render(
      <Think isFinished={false}>
        <div data-testid="child-content">Think content</div>
      </Think>,
    );

    expect(screen.getByTestId("think-loader")).toBeInTheDocument();
    expect(screen.queryByTestId("think-finished-icon")).not.toBeInTheDocument();
    expect(screen.queryByTestId("child-content")).not.toBeInTheDocument();
  });

  it("renders finished icon when isFinished is true", () => {
    render(
      <Think isFinished={true}>
        <div data-testid="child-content">Think content</div>
      </Think>,
    );

    expect(screen.getByTestId("think-finished-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("think-loader")).not.toBeInTheDocument();
  });

  it("toggles content visibility on click", () => {
    render(
      <Think>
        <div data-testid="child-content">Think content</div>
      </Think>,
    );

    const title = screen.getByTestId("think-title");

    // Initial state: hidden
    expect(screen.queryByTestId("child-content")).not.toBeInTheDocument();

    // Toggle: open
    fireEvent.click(title);
    expect(screen.getByTestId("child-content")).toBeInTheDocument();

    // Toggle: close
    fireEvent.click(title);
    expect(screen.queryByTestId("child-content")).not.toBeInTheDocument();
  });

  it("applies correct styles based on isFirst prop", () => {
    const { rerender } = render(<Think isFirst={true}>Content</Think>);
    const think = screen.getByTestId("think");

    // When isFirst is true, it shouldn't have withMarginTop
    expect(think.className).not.toContain("withMarginTop");

    rerender(<Think isFirst={false}>Content</Think>);
    expect(think.className).toContain("withMarginTop");
  });
});
