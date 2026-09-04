import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { HelpButton } from ".";

describe("<HelpButton />", () => {
  const tooltipContent = "Your tooltip content";

  it("renders without error", () => {
    render(<HelpButton tooltipContent={tooltipContent} />);
    expect(screen.getByTestId("help-button")).toBeInTheDocument();
  });

  it("renders with custom className", () => {
    render(
      <HelpButton tooltipContent={tooltipContent} className="custom-class" />,
    );
    expect(screen.getByTestId("icon-button")).toHaveClass("custom-class");
  });

  it("renders with custom id", () => {
    render(<HelpButton tooltipContent={tooltipContent} id="custom-id" />);
    expect(screen.getByTestId("icon-button")).toHaveAttribute(
      "id",
      "custom-id",
    );
  });

  it("renders with custom style", () => {
    const customStyle = { backgroundColor: "red" };
    render(<HelpButton tooltipContent={tooltipContent} style={customStyle} />);
    expect(screen.getByTestId("help-button").style.backgroundColor).toBe("red");
  });

  it("renders with custom size", () => {
    render(<HelpButton tooltipContent={tooltipContent} size={24} />);
    const button = screen.getByTestId("icon-button");
    expect(button).toHaveStyle({ "--icon-button-size": "24px" });
  });

  it("renders with custom color", () => {
    render(<HelpButton tooltipContent={tooltipContent} color="#ff0000" />);
    const button = screen.getByTestId("icon-button");
    expect(button).toHaveStyle({ "--icon-button-color": "#ff0000" });
  });

  it("renders with getContent function", () => {
    const getContent = () => "Dynamic content";
    render(<HelpButton getContent={getContent} />);
    expect(screen.getByTestId("help-button")).toBeInTheDocument();
  });

  it("renders with custom place", () => {
    render(<HelpButton tooltipContent={tooltipContent} place="bottom" />);
    expect(screen.getByTestId("help-button")).toBeInTheDocument();
  });

  it("renders with custom offset", () => {
    render(<HelpButton tooltipContent={tooltipContent} offset={10} />);
    expect(screen.getByTestId("help-button")).toBeInTheDocument();
  });

  it("renders with afterShow callback", () => {
    const afterShow = vi.fn();
    render(
      <HelpButton tooltipContent={tooltipContent} afterShow={afterShow} />,
    );
    expect(screen.getByTestId("help-button")).toBeInTheDocument();
  });

  it("renders with afterHide callback", () => {
    const afterHide = vi.fn();
    render(
      <HelpButton tooltipContent={tooltipContent} afterHide={afterHide} />,
    );
    expect(screen.getByTestId("help-button")).toBeInTheDocument();
  });

  it("renders with custom tooltipMaxWidth", () => {
    render(
      <HelpButton tooltipContent={tooltipContent} tooltipMaxWidth="300px" />,
    );
    expect(screen.getByTestId("help-button")).toBeInTheDocument();
  });

  it("renders with openOnClick set to false", () => {
    render(<HelpButton tooltipContent={tooltipContent} openOnClick={false} />);
    expect(screen.getByTestId("help-button")).toBeInTheDocument();
  });
});
