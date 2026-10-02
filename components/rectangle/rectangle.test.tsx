import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("react-content-loader", () => ({
  default: ({
    children,
    title,
    width,
    height,
    className,
    style,
    ...rest
  }: {
    children?: React.ReactNode;
    title?: string;
    width?: string;
    height?: string;
    className?: string;
    style?: React.CSSProperties;
    [key: string]: unknown;
  }) => (
    <svg
      data-testid="rectangle-skeleton"
      width={width}
      height={height}
      className={className}
      style={style}
      {...rest}
    >
      {title && <title>{title}</title>}
      {children}
    </svg>
  ),
}));

import { RectangleSkeleton } from ".";

describe("<RectangleSkeleton />", () => {
  it("renders with default props", () => {
    render(<RectangleSkeleton />);
    const skeleton = screen.getByTestId("rectangle-skeleton");
    expect(skeleton).toBeInTheDocument();
  });

  it("renders with custom dimensions", () => {
    render(<RectangleSkeleton width="200px" height="50px" />);
    const skeleton = screen.getByTestId("rectangle-skeleton");
    expect(skeleton).toHaveAttribute("width", "200px");
    expect(skeleton).toHaveAttribute("height", "50px");
  });

  it("renders rect element with correct attributes", () => {
    render(
      <RectangleSkeleton
        x="10"
        y="20"
        width="150px"
        height="40px"
        borderRadius="8"
      />,
    );
    const skeleton = screen.getByTestId("rectangle-skeleton");
    const rect = skeleton.querySelector("rect");
    expect(rect).toBeInTheDocument();
    expect(rect).toHaveAttribute("x", "10");
    expect(rect).toHaveAttribute("y", "20");
    expect(rect).toHaveAttribute("rx", "8");
    expect(rect).toHaveAttribute("ry", "8");
    expect(rect).toHaveAttribute("width", "150px");
    expect(rect).toHaveAttribute("height", "40px");
  });

  it("renders with custom title", () => {
    render(<RectangleSkeleton title="Loading content..." />);
    const skeleton = screen.getByTestId("rectangle-skeleton");
    const title = skeleton.querySelector("title");
    expect(title).toHaveTextContent("Loading content...");
  });

  it("renders with empty title by default", () => {
    render(<RectangleSkeleton />);
    const skeleton = screen.getByTestId("rectangle-skeleton");
    const title = skeleton.querySelector("title");
    expect(title).toBeNull();
  });

  it("renders with custom className", () => {
    render(<RectangleSkeleton className="custom-skeleton" />);
    const skeleton = screen.getByTestId("rectangle-skeleton");
    expect(skeleton).toHaveClass("custom-skeleton");
  });

  it("renders with custom style", () => {
    render(<RectangleSkeleton style={{ margin: "10px" }} />);
    const skeleton = screen.getByTestId("rectangle-skeleton");
    expect(skeleton).toHaveStyle({ margin: "10px" });
  });

  it("renders with default x and y values", () => {
    render(<RectangleSkeleton />);
    const skeleton = screen.getByTestId("rectangle-skeleton");
    const rect = skeleton.querySelector("rect");
    expect(rect).toHaveAttribute("x", "0");
    expect(rect).toHaveAttribute("y", "0");
  });

  it("passes additional props to ContentLoader", () => {
    render(<RectangleSkeleton data-custom="test-value" />);
    const skeleton = screen.getByTestId("rectangle-skeleton");
    expect(skeleton).toHaveAttribute("data-custom", "test-value");
  });

  it("renders with default width and height", () => {
    render(<RectangleSkeleton />);
    const skeleton = screen.getByTestId("rectangle-skeleton");
    expect(skeleton).toHaveAttribute("width", "100%");
    expect(skeleton).toHaveAttribute("height", "32px");
  });

  it("renders rect with default border radius", () => {
    render(<RectangleSkeleton />);
    const skeleton = screen.getByTestId("rectangle-skeleton");
    const rect = skeleton.querySelector("rect");
    expect(rect).toHaveAttribute("rx", "3");
    expect(rect).toHaveAttribute("ry", "3");
  });
});
