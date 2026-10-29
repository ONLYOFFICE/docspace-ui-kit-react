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
    uniqueKey,
    ...rest
  }: {
    children?: React.ReactNode;
    title?: string;
    width?: string;
    height?: string;
    className?: string;
    style?: React.CSSProperties;
    uniqueKey?: string;
    [key: string]: unknown;
  }) => (
    <svg
      data-testid="circle-skeleton"
      data-unique-key={uniqueKey}
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

import { CircleSkeleton } from ".";

describe("<CircleSkeleton />", () => {
  it("renders with default props", () => {
    render(<CircleSkeleton />);
    const skeleton = screen.getByTestId("circle-skeleton");
    expect(skeleton).toBeInTheDocument();
  });

  it("renders with custom dimensions", () => {
    render(<CircleSkeleton width="200px" height="200px" />);
    const skeleton = screen.getByTestId("circle-skeleton");
    expect(skeleton).toHaveAttribute("width", "200px");
    expect(skeleton).toHaveAttribute("height", "200px");
  });

  it("renders circle element with correct attributes", () => {
    render(<CircleSkeleton x="50" y="50" radius="25" />);
    const skeleton = screen.getByTestId("circle-skeleton");
    const circle = skeleton.querySelector("circle");
    expect(circle).toBeInTheDocument();
    expect(circle).toHaveAttribute("cx", "50");
    expect(circle).toHaveAttribute("cy", "50");
    expect(circle).toHaveAttribute("r", "25");
  });

  it("renders with default position values", () => {
    render(<CircleSkeleton />);
    const skeleton = screen.getByTestId("circle-skeleton");
    const circle = skeleton.querySelector("circle");
    // cx equals the radius, so the default circle is not cut off.
    expect(circle).toHaveAttribute("cx", "12");
    expect(circle).toHaveAttribute("cy", "12");
    expect(circle).toHaveAttribute("r", "12");
  });

  it("renders with custom title", () => {
    render(<CircleSkeleton title="Loading avatar..." />);
    const skeleton = screen.getByTestId("circle-skeleton");
    const title = skeleton.querySelector("title");
    expect(title).toHaveTextContent("Loading avatar...");
  });

  it("renders with empty title by default", () => {
    render(<CircleSkeleton />);
    const skeleton = screen.getByTestId("circle-skeleton");
    const title = skeleton.querySelector("title");
    expect(title).toBeNull();
  });

  it("hides an untitled skeleton from assistive technology", () => {
    render(<CircleSkeleton />);
    expect(screen.getByTestId("circle-skeleton")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("keeps a titled skeleton exposed", () => {
    render(<CircleSkeleton title="Loading avatar" />);
    expect(screen.getByTestId("circle-skeleton")).not.toHaveAttribute(
      "aria-hidden",
    );
  });

  it("passes a stable uniqueKey, the same on every render", () => {
    const { rerender } = render(<CircleSkeleton />);
    const first = screen
      .getByTestId("circle-skeleton")
      .getAttribute("data-unique-key");
    expect(first).toBeTruthy();

    rerender(<CircleSkeleton radius="20" />);
    expect(
      screen.getByTestId("circle-skeleton").getAttribute("data-unique-key"),
    ).toBe(first);
  });

  it("uses the uniqueKey it is given", () => {
    render(<CircleSkeleton uniqueKey="avatar" />);
    expect(screen.getByTestId("circle-skeleton")).toHaveAttribute(
      "data-unique-key",
      "avatar",
    );
  });

  it("renders with custom className", () => {
    render(<CircleSkeleton className="custom-skeleton" />);
    const skeleton = screen.getByTestId("circle-skeleton");
    expect(skeleton).toHaveClass("custom-skeleton");
  });

  it("renders with custom style", () => {
    render(<CircleSkeleton style={{ margin: "10px" }} />);
    const skeleton = screen.getByTestId("circle-skeleton");
    expect(skeleton).toHaveStyle({ margin: "10px" });
  });

  it("renders with different radius sizes", () => {
    const { rerender } = render(<CircleSkeleton radius="10" />);
    let skeleton = screen.getByTestId("circle-skeleton");
    let circle = skeleton.querySelector("circle");
    expect(circle).toHaveAttribute("r", "10");

    rerender(<CircleSkeleton radius="50" />);
    skeleton = screen.getByTestId("circle-skeleton");
    circle = skeleton.querySelector("circle");
    expect(circle).toHaveAttribute("r", "50");
  });

  it("passes additional props to ContentLoader", () => {
    render(<CircleSkeleton data-custom="test-value" />);
    const skeleton = screen.getByTestId("circle-skeleton");
    expect(skeleton).toHaveAttribute("data-custom", "test-value");
  });

  it("renders with default width and height", () => {
    render(<CircleSkeleton />);
    const skeleton = screen.getByTestId("circle-skeleton");
    expect(skeleton).toHaveAttribute("width", "100%");
    expect(skeleton).toHaveAttribute("height", "100%");
  });
});
