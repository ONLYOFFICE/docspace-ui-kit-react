import React from "react";
import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
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

  it("puts a passed aria-* on the info icon", () => {
    render(
      <HelpButton
        tooltipContent={tooltipContent}
        aria-label="About storage"
        aria-describedby="storage-hint"
      />,
    );
    const icon = screen.getByTestId("icon-button");
    expect(icon).toHaveAttribute("aria-label", "About storage");
    expect(icon).toHaveAttribute("aria-describedby", "storage-hint");
    expect(screen.getByTestId("help-button")).not.toHaveAttribute("aria-label");
  });

  it("puts a passed aria-* on the anchor around children", () => {
    render(
      <HelpButton tooltipContent={tooltipContent} aria-label="About storage">
        <span>Storage</span>
      </HelpButton>,
    );
    expect(screen.getByText("Storage").parentElement).toHaveAttribute(
      "aria-label",
      "About storage",
    );
  });

  it("renders with openOnClick set to false", () => {
    render(<HelpButton tooltipContent={tooltipContent} openOnClick={false} />);
    expect(screen.getByTestId("help-button")).toBeInTheDocument();
  });

  it("opens the shared tooltip from the keyboard", () => {
    render(<HelpButton tooltipContent={tooltipContent} />);
    const icon = screen.getByRole("button", { name: "Info" });
    const onClick = vi.fn();
    icon.addEventListener("click", onClick);

    expect(icon).toHaveAttribute("tabindex", "0");
    fireEvent.keyDown(icon, { key: "Enter" });

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("clicks the SVG its own tooltip is anchored to", () => {
    render(<HelpButton tooltipContent={<b>Rich content</b>} />);
    const icon = screen.getByRole("button", { name: "Info" });
    const svg = icon.querySelector("svg") as SVGElement;
    const onClick = vi.fn();
    svg.addEventListener("click", onClick);

    fireEvent.keyDown(icon, { key: " " });

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("stays out of the tab order when the tooltip opens on hover", () => {
    render(
      <HelpButton tooltipContent={<b>Rich content</b>} openOnClick={false} />,
    );

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("lets a passed aria-label name the button", () => {
    render(
      <HelpButton tooltipContent={tooltipContent} aria-label="About storage" />,
    );

    expect(
      screen.getByRole("button", { name: "About storage" }),
    ).toBeInTheDocument();
  });
});
