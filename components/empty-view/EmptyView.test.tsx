import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import type { EmptyViewProps } from "./EmptyView.types";
import type { LinkRouterProps, To } from "../../types";
import styles from "./EmptyView.module.scss";

import { EmptyView } from ".";

const MockIcon = () => <svg data-testid="mock-icon" />;

const toHref = (to: To): string => {
  if (typeof to === "string") return to;
  const { pathname = "", search = "", hash = "" } = to;
  return `${pathname}${search}${hash}`;
};

const MockLinkRouter = ({ children, to, ...props }: LinkRouterProps) => (
  <a href={toHref(to)} {...props}>
    {children}
  </a>
);

const mockProps: EmptyViewProps = {
  icon: <MockIcon />,
  title: "Test Title",
  description: "Test Description",
  options: null,
};

const mockOptionsProps = {
  ...mockProps,
  options: [
    {
      key: "test-action",
      icon: <MockIcon />,
      to: "/test",
      description: "Test Action",
      onClick: vi.fn(),
    },
  ],
};

describe("EmptyView", () => {
  const renderComponent = (props: EmptyViewProps) =>
    render(<EmptyView {...props} LinkRouter={MockLinkRouter} />);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders without options", () => {
    renderComponent({ ...mockProps, options: null });

    expect(screen.getByTestId("empty-view")).toBeInTheDocument();
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
      "Test Title",
    );
  });

  it("renders with options", () => {
    renderComponent(mockOptionsProps);

    expect(screen.getByTestId("empty-view")).toBeInTheDocument();
    expect(screen.getByText("Test Action")).toBeInTheDocument();
  });

  it("calls onClick when option is clicked", () => {
    renderComponent(mockOptionsProps);

    const option = screen.getByText("Test Action");
    fireEvent.click(option);

    expect(mockOptionsProps.options[0].onClick).toHaveBeenCalledTimes(1);
  });

  it("renders with correct styles", () => {
    renderComponent(mockProps);

    const wrapper = screen.getByTestId("empty-view");
    const title = screen.getByText("Test Title");
    const description = screen.getByText("Test Description");

    expect(wrapper).toHaveClass(styles.wrapper);
    expect(title).toHaveClass(styles.headerTitle);
    expect(description).toHaveClass(styles.subheading);
  });

  it("renders icon when provided", () => {
    const { container } = renderComponent(mockProps);

    // Check that an SVG element exists in the header
    const header = container.querySelector(`.${styles.header}`);
    const svg = header?.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("renders options in body section when provided", () => {
    renderComponent(mockOptionsProps);

    const body = screen.getByTestId("empty-view-body");
    expect(body).toBeInTheDocument();
    expect(body).toHaveClass(styles.body);
    expect(body?.children.length).toBe(1);
  });

  it("does not render body section when no options provided", () => {
    renderComponent(mockProps);

    const body = screen.queryByTestId("empty-view-body");
    expect(body).not.toBeInTheDocument();
  });
});
