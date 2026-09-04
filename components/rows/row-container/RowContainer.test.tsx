import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { RowContainer } from ".";

const baseProps = {
  manualHeight: "500px",
  useReactWindow: true,
  onScroll: vi.fn(),
  fetchMoreFiles: vi.fn().mockResolvedValue(undefined),
  hasMoreFiles: true,
  itemCount: 2,
  filesLength: 2,
  itemHeight: 50,
};

describe("<RowContainer />", () => {
  it("renders without error", () => {
    render(
      <RowContainer {...baseProps}>
        <span>Demo1</span>
        <span>Demo2</span>
      </RowContainer>,
    );

    expect(screen.getByTestId("row-container")).toBeInTheDocument();
    expect(
      screen.getByTestId("row-container").querySelector(".List"),
    ).toBeInTheDocument();
  });

  it("renders without react-window", () => {
    render(
      <RowContainer {...baseProps} useReactWindow={false}>
        <span>Demo1</span>
        <span>Demo2</span>
      </RowContainer>,
    );

    const container = screen.getByTestId("row-container");
    expect(container).not.toHaveClass("useReactWindow");
    expect(screen.getByText("Demo1")).toBeInTheDocument();
    expect(screen.getByText("Demo2")).toBeInTheDocument();
  });

  it("renders with manual height", () => {
    render(
      <RowContainer {...baseProps}>
        <span>Demo1</span>
        <span>Demo2</span>
      </RowContainer>,
    );

    const container = screen.getByTestId("row-container");
    expect(container).toHaveStyle({ "--manual-height": "500px" });
  });

  it("applies custom className", () => {
    const customClass = "custom-class";
    render(
      <RowContainer {...baseProps} className={customClass}>
        <span>Demo1</span>
        <span>Demo2</span>
      </RowContainer>,
    );

    const container = screen.getByTestId("row-container");
    expect(container).toHaveClass(customClass);
  });

  it("applies custom id", () => {
    const customId = "custom-id";
    render(
      <RowContainer {...baseProps} id={customId}>
        <span>Demo1</span>
        <span>Demo2</span>
      </RowContainer>,
    );

    const container = screen.getByTestId("row-container");
    expect(container).toHaveAttribute("id", customId);
  });

  it("applies custom style", () => {
    const customStyle = { backgroundColor: "red" };
    render(
      <RowContainer {...baseProps} style={customStyle}>
        <span>Demo1</span>
        <span>Demo2</span>
      </RowContainer>,
    );

    const container = screen.getByTestId("row-container");
    expect(container.style.backgroundColor).toBe("red");
  });

  it("renders InfiniteLoaderComponent when useReactWindow is true", () => {
    render(
      <RowContainer {...baseProps}>
        <span>Demo1</span>
        <span>Demo2</span>
      </RowContainer>,
    );

    expect(
      screen.getByTestId("row-container").querySelector(".List"),
    ).toBeInTheDocument();
  });

  it("renders children directly when useReactWindow is false", () => {
    render(
      <RowContainer {...baseProps} useReactWindow={false}>
        <span>Demo1</span>
        <span>Demo2</span>
      </RowContainer>,
    );

    expect(
      screen.getByTestId("row-container").querySelector(".List"),
    ).not.toBeInTheDocument();
    expect(screen.getByText("Demo1")).toBeInTheDocument();
    expect(screen.getByText("Demo2")).toBeInTheDocument();
  });
});
