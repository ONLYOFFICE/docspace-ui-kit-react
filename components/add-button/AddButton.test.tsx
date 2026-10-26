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

  // role="button" without a tab stop could not be reached at all, and most
  // callers never passed a tabIndex.
  it("is a tab stop that Enter and Space activate, and refuses both while disabled", () => {
    const onClick = vi.fn();
    const { rerender } = render(<AddButton {...baseProps} onClick={onClick} />);
    const wrapper = screen.getByRole("button");
    expect(wrapper).toHaveAttribute("tabindex", "0");

    fireEvent.keyDown(wrapper, { key: "Enter" });
    fireEvent.keyDown(wrapper, { key: " " });
    expect(onClick).toHaveBeenCalledTimes(2);

    rerender(<AddButton {...baseProps} isDisabled onClick={onClick} />);
    expect(wrapper).toHaveAttribute("tabindex", "-1");
    expect(wrapper).toHaveAttribute("aria-disabled", "true");
    fireEvent.keyDown(wrapper, { key: "Enter" });
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  // Loading dropped Enter and Space silently while the button was announced
  // as an ordinary, enabled one.
  it("announces a loading button as disabled and busy, and keeps its tab stop", () => {
    const onClick = vi.fn();
    render(<AddButton {...baseProps} isLoading onClick={onClick} />);
    const wrapper = screen.getByRole("button");

    expect(wrapper).toHaveAttribute("aria-disabled", "true");
    expect(wrapper).toHaveAttribute("aria-busy", "true");
    expect(wrapper).toHaveAttribute("tabindex", "0");
    fireEvent.keyDown(wrapper, { key: "Enter" });
    expect(onClick).not.toHaveBeenCalled();
  });

  it("keeps a tabIndex the caller passes", () => {
    render(<AddButton {...baseProps} tabIndex={-1} />);
    expect(screen.getByRole("button")).toHaveAttribute("tabindex", "-1");
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
