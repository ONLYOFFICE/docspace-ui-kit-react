import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent, render } from "@testing-library/react";

import styles from "./AddButton.module.scss";

import { AddButton } from ".";

const baseProps = {
  title: "Add item",
  isDisabled: false,
};

describe("<AddButton />", () => {
  it("renders without error", () => {
    render(<AddButton {...baseProps} />);

    expect(screen.getByTestId("selector-add-button")).toBeInTheDocument();
  });

  it("renders with title", () => {
    render(<AddButton {...baseProps} />);

    expect(screen.getByTestId("selector-add-button")).toHaveAttribute(
      "title",
      "Add item",
    );
  });

  it("accepts id", () => {
    render(<AddButton {...baseProps} id="testId" />);

    expect(screen.getByTestId("selector-add-button")).toHaveAttribute(
      "id",
      "testId",
    );
  });

  it("accepts className", () => {
    render(<AddButton {...baseProps} className="test-class" />);

    expect(screen.getByTestId("selector-add-button-container")).toHaveClass(
      "test-class",
    );
  });

  it("accepts style", () => {
    render(<AddButton {...baseProps} style={{ color: "red" }} />);

    expect(screen.getByTestId("selector-add-button").style.color).toBe("red");
  });

  it("handles click when not disabled", () => {
    const onClick = vi.fn();
    render(<AddButton {...baseProps} onClick={onClick} />);

    fireEvent.click(screen.getByTestId("selector-add-button"));
    expect(onClick).toHaveBeenCalled();
  });

  it("doesn't handle click when disabled", () => {
    const onClick = vi.fn();
    render(<AddButton {...baseProps} isDisabled onClick={onClick} />);

    fireEvent.click(screen.getByTestId("selector-add-button"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("applies isDisabled class when disabled", () => {
    render(<AddButton {...baseProps} isDisabled />);

    const button = screen.getByTestId("selector-add-button");
    expect(button).toHaveClass(styles.isDisabled);
  });

  it("applies isAction class when isAction prop is true", () => {
    render(<AddButton {...baseProps} isAction />);

    const button = screen.getByTestId("selector-add-button");
    expect(button).toHaveClass(styles.isAction);
  });

  it("renders IconButton with correct props", () => {
    const iconSize = 16;
    render(<AddButton {...baseProps} iconSize={iconSize} isDisabled />);

    const iconButton = screen.getByTestId("icon-button");
    expect(iconButton).toBeInTheDocument();
  });
});
