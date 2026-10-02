import React from "react";
import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import { IndexIconButtons } from ".";

describe("<IndexIconButtons />", () => {
  it("renders without error", () => {
    render(<IndexIconButtons />);
    expect(screen.getByTestId("index-icon-buttons")).toBeInTheDocument();
  });

  it("renders with containerClassName prop", () => {
    const className = "custom-class";
    render(<IndexIconButtons containerClassName={className} />);
    expect(screen.getByTestId("index-icon-buttons")).toHaveClass(className);
  });

  it("renders with commonIconClassName prop", () => {
    const className = "custom-class";
    render(<IndexIconButtons commonIconClassName={className} />);
    const upIcon = screen.getByTestId("index-up-icon");
    const downIcon = screen.getByTestId("index-down-icon");

    expect(upIcon).toHaveClass(className);
    expect(downIcon).toHaveClass(className);
  });

  it("applies upIconClassName to the up icon", () => {
    const className = "up-icon-class";

    render(<IndexIconButtons upIconClassName={className} />);

    const upIcon = screen.getByTestId("index-up-icon");
    expect(upIcon).toHaveClass(className);
  });

  it("applies downIconClassName to the down icon", () => {
    const className = "down-icon-class";

    render(<IndexIconButtons downIconClassName={className} />);

    const downIcon = screen.getByTestId("index-down-icon");
    expect(downIcon).toHaveClass(className);
  });

  it("calls onUpIndexClick when up icon is clicked", () => {
    const handleUpClick = vi.fn();

    render(<IndexIconButtons onUpIndexClick={handleUpClick} />);

    const upIcon = screen.getByTestId("index-up-icon");
    fireEvent.click(upIcon);

    expect(handleUpClick).toHaveBeenCalledTimes(1);
  });

  it("calls onDownIndexClick when down icon is clicked", () => {
    const handleDownClick = vi.fn();

    render(<IndexIconButtons onDownIndexClick={handleDownClick} />);

    const downIcon = screen.getByTestId("index-down-icon");
    fireEvent.click(downIcon);

    expect(handleDownClick).toHaveBeenCalledTimes(1);
  });

  it("applies the style prop to the root element", () => {
    const style = {
      backgroundColor: "red",
      padding: "10px",
    };

    render(<IndexIconButtons style={style} />);

    const root = screen.getByTestId("index-icon-buttons");
    expect(root.style.backgroundColor).toBe("red");
    expect(root.style.padding).toBe("10px");
  });
});
