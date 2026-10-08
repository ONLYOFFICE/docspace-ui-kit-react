import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import { globalColors } from "../../providers/theme";

import VerticalDotsReactSvgUrl from "../../assets/icons/16/vertical-dots.react.svg?url";

import type { ContextMenuModel } from "../context-menu";

import { ContextMenuButton } from "./ContextMenuButton";
import { ContextMenuButtonDisplayType } from "./ContextMenuButton.enums";

const baseData = (): ContextMenuModel[] => [
  {
    key: "key",
    label: "label",
    onClick: vi.fn(),
  },
];

const baseProps = {
  title: "Actions",
  iconName: VerticalDotsReactSvgUrl,
  size: 16,
  color: globalColors.gray,
  getData: baseData,
  isDisabled: false,
  displayType: ContextMenuButtonDisplayType.dropdown,
  data: baseData(),
};

describe("<ContextMenuButton />", () => {
  it("renders without error", () => {
    render(<ContextMenuButton {...baseProps} />);
    expect(screen.getByTestId("context-menu-button")).toBeInTheDocument();
  });

  it("closes the dropdown on an outside mousedown whose click is swallowed", () => {
    const onClose = vi.fn();

    render(<ContextMenuButton {...baseProps} opened onClose={onClose} />);

    const dropDown = screen.getByTestId("dropdown");

    expect(dropDown).toHaveClass("open");

    const outside = document.createElement("div");
    outside.addEventListener("click", (e) => e.stopPropagation());
    document.body.appendChild(outside);

    fireEvent.mouseDown(outside);
    fireEvent.click(outside);

    expect(dropDown).not.toHaveClass("open");
    expect(onClose).toHaveBeenCalledTimes(1);

    outside.remove();
  });

  it("is a named menu button that opens from the keyboard", () => {
    render(<ContextMenuButton {...baseProps} usePortal={false} />);

    const button = screen.getByRole("button", { name: "Actions" });
    expect(button).toHaveAttribute("tabindex", "0");
    expect(button).toHaveAttribute("aria-haspopup", "menu");
    expect(button).toHaveAttribute("aria-expanded", "false");

    fireEvent.keyDown(button, { key: "Enter" });
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("menu")).toHaveAttribute(
      "id",
      button.getAttribute("aria-controls"),
    );
    expect(screen.getByRole("menuitem", { name: "label" })).toBeInTheDocument();

    fireEvent.keyDown(button, { key: "Escape" });
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("calls onClick on the click that opens the menu, not the one closing it", () => {
    const onClick = vi.fn();
    render(<ContextMenuButton {...baseProps} onClick={onClick} />);
    const button = screen.getByRole("button", { name: "Actions" });

    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(button).toHaveAttribute("aria-expanded", "true");

    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  // A caller pairs onClick (opened) with onClose (closed), e.g. to lock and
  // unlock a panel's scroll; every way of closing has to report it.
  it.each([
    ["the button is clicked again", "click"],
    ["Enter is pressed on the button", "Enter"],
    ["an item is chosen", "item"],
  ])("calls onClose when %s", (_, how) => {
    const onClick = vi.fn();
    const onClose = vi.fn();
    render(
      <ContextMenuButton
        {...baseProps}
        usePortal={false}
        onClick={onClick}
        onClose={onClose}
      />,
    );
    const button = screen.getByRole("button", { name: "Actions" });

    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClose).not.toHaveBeenCalled();

    if (how === "click") fireEvent.click(button);
    else if (how === "Enter") fireEvent.keyDown(button, { key: "Enter" });
    else fireEvent.click(screen.getByRole("menuitem", { name: "label" }));

    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("opens with data alone when there is no getData", () => {
    render(
      <ContextMenuButton
        {...baseProps}
        getData={undefined}
        data={[{ key: "only", label: "Only item" }]}
      />,
    );
    const button = screen.getByRole("button", { name: "Actions" });

    expect(() => fireEvent.click(button)).not.toThrow();
    expect(
      screen.getByRole("menuitem", { name: "Only item" }),
    ).toBeInTheDocument();
  });

  it("re-renders for props other than the four it used to compare", () => {
    const { rerender } = render(<ContextMenuButton {...baseProps} />);
    expect(screen.getByRole("button", { name: "Actions" })).toBeInTheDocument();

    rerender(<ContextMenuButton {...baseProps} title="More" />);
    expect(screen.getByRole("button", { name: "More" })).toBeInTheDocument();
  });

  it("calls onMouseOver and onMouseOut on the matching events", () => {
    const onMouseOver = vi.fn();
    const onMouseOut = vi.fn();
    render(
      <ContextMenuButton
        {...baseProps}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
      />,
    );
    const button = screen.getByRole("button", { name: "Actions" });

    fireEvent.mouseDown(button);
    expect(onMouseOver).not.toHaveBeenCalled();
    fireEvent.mouseOver(button);
    expect(onMouseOver).toHaveBeenCalledTimes(1);
    fireEvent.mouseOut(button);
    expect(onMouseOut).toHaveBeenCalledTimes(1);
  });
});
