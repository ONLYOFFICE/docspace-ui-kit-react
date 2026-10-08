import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import PublicRoomBar from "./index";

describe("PublicRoomBar", () => {
  const defaultProps = {
    headerText: "Test Header",
    bodyText: "Test Body",
    onClose: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders with default props", () => {
    render(<PublicRoomBar {...defaultProps} />);

    expect(screen.getByText("Test Header")).toBeInTheDocument();
    expect(screen.getByText("Test Body")).toBeInTheDocument();
  });

  it("renders with custom icon", () => {
    const customIcon = "custom-icon-path.svg";
    render(<PublicRoomBar {...defaultProps} iconName={customIcon} />);

    expect(screen.getByText("Test Header")).toBeInTheDocument();
  });

  it("renders the close control as a named native button", () => {
    render(<PublicRoomBar {...defaultProps} />);

    const close = screen.getByRole("button", { name: "Close" });
    expect(close.tagName).toBe("BUTTON");
    expect(close).toHaveAttribute("type", "button");
    expect(close).toBe(screen.getByTestId("icon-button"));
  });

  it("takes a translated close label", () => {
    render(<PublicRoomBar {...defaultProps} closeLabel="Schliessen" />);

    expect(
      screen.getByRole("button", { name: "Schliessen" }),
    ).toBeInTheDocument();
  });

  it("puts the text, not the close button, in a status region", () => {
    render(<PublicRoomBar {...defaultProps} />);

    const status = screen.getByRole("status");
    expect(status).toHaveTextContent("Test Header");
    expect(status).toHaveTextContent("Test Body");
    expect(status).not.toContainElement(screen.getByRole("button"));
  });

  it("calls onClose when close button is clicked", () => {
    render(<PublicRoomBar {...defaultProps} />);

    const closeButton = screen.getByTestId("icon-button");
    fireEvent.click(closeButton);

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it("does not render close button when onClose is not provided", () => {
    const { onClose: _, ...propsWithoutClose } = defaultProps;
    render(<PublicRoomBar {...propsWithoutClose} />);

    const closeButton = screen.queryByRole("button");
    expect(closeButton).not.toBeInTheDocument();
  });

  it("applies barVisible class when barIsVisible prop is true", () => {
    render(<PublicRoomBar {...defaultProps} barIsVisible />);

    const container = screen
      .getByText("Test Header")
      .closest("div[class*='container']");
    expect(container?.className).toContain("barVisible");
  });

  it("renders header as div when headerText is not a string", () => {
    const customHeader = <span>Custom Header</span>;
    render(<PublicRoomBar {...defaultProps} headerText={customHeader} />);

    const headerContainer = screen.getByText("Custom Header").closest("div");
    expect(headerContainer).toBeInTheDocument();
  });

  it("renders body as div when bodyText is not a string", () => {
    const customBody = <span>Custom Body</span>;
    render(<PublicRoomBar {...defaultProps} bodyText={customBody} />);

    const bodyContainer = screen.getByText("Custom Body").closest("div");
    expect(bodyContainer).toBeInTheDocument();
  });
});
