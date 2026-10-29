import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import { globalColors } from "../../providers/theme";

import VerticalDotsReactSvgUrl from "../../assets/icons/16/vertical-dots.react.svg?url";

import type { ContextMenuModel } from "../context-menu";
import { InterfaceDirectionProvider } from "../../context/InterfaceDirectionContext";

import { ContextMenuButton } from "./ContextMenuButton";
import { ContextMenuButtonDisplayType } from "./ContextMenuButton.enums";

vi.mock("../../utils/i18n", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../../utils/i18n")>()),
  useCommonTranslation: () => (key: string) => key,
}));

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

  // onClick is typed for a mouse event, and callers hand it to
  // ContextMenu.show(e), which reads the position.
  it.each([
    ["dropdown", ContextMenuButtonDisplayType.dropdown],
    ["toggle", ContextMenuButtonDisplayType.toggle],
  ])(
    "hands onClick a positioned click at the button from the keyboard in %s mode",
    (_mode, displayType) => {
      const onClick = vi.fn();
      render(
        <ContextMenuButton
          {...baseProps}
          displayType={displayType}
          onClick={onClick}
        />,
      );
      const button = screen.getByRole("button", { name: "Actions" });

      fireEvent.keyDown(button, { key: "Enter" });

      expect(onClick).toHaveBeenCalledTimes(1);
      const [event] = onClick.mock.calls[0];
      expect(event).toBeInstanceOf(MouseEvent);
      expect(event.type).toBe("click");
      expect(event.currentTarget).toBe(button);
      expect(event.target).toBe(button);
      expect(typeof event.pageX).toBe("number");
      // The methods a React event has, which a handler may call.
      event.persist();
      event.preventDefault();
      event.stopPropagation();
      expect(event.isDefaultPrevented()).toBe(true);
      expect(event.isPropagationStopped()).toBe(true);
    },
  );

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

  // A dialog closes on an Escape keyup on window, and the portal's file list
  // acts on Enter and the arrows from a document keydown listener: keys the
  // menu button handles must not reach either.
  it("keeps the keys it handles from window and document listeners", () => {
    const onDocumentKeyDown = vi.fn();
    const onWindowKeyUp = vi.fn();
    document.addEventListener("keydown", onDocumentKeyDown);
    window.addEventListener("keyup", onWindowKeyUp);

    render(<ContextMenuButton {...baseProps} usePortal={false} />);
    const button = screen.getByRole("button", { name: "Actions" });

    fireEvent.keyDown(button, { key: "Enter" });
    fireEvent.keyUp(button, { key: "Enter" });
    const item = screen.getByRole("menuitem", { name: "label" });
    fireEvent.keyDown(item, { key: "ArrowDown" });
    fireEvent.keyUp(item, { key: "ArrowDown" });
    fireEvent.keyDown(item, { key: "Escape" });
    fireEvent.keyUp(button, { key: "Escape" });

    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(onDocumentKeyDown).not.toHaveBeenCalled();
    expect(onWindowKeyUp).not.toHaveBeenCalled();

    document.removeEventListener("keydown", onDocumentKeyDown);
    window.removeEventListener("keyup", onWindowKeyUp);
  });

  // The menu is portalled to the end of the body: a Tab from one of its
  // items has to start from the button, or it leaves the page. What is
  // checked is that the focus is on the button and the Tab is not cancelled;
  // the move itself is the browser's, and Chromium, Firefox and WebKit all
  // move on from the element focused during keydown. Neither jsdom nor
  // user-event's tab() can show it: user-event picks the next element from
  // the keydown's target, so a play function would test the simulation.
  it("hands the focus back to the button on Tab and lets the Tab through", () => {
    render(<ContextMenuButton {...baseProps} />);
    const button = screen.getByRole("button", { name: "Actions" });

    fireEvent.click(button);
    const item = screen.getByRole("menuitem", { name: "label" });
    item.focus();
    const notPrevented = fireEvent.keyDown(item, { key: "Tab" });

    expect(notPrevented).toBe(true);
    expect(button).toHaveFocus();
    expect(button).toHaveAttribute("aria-expanded", "false");
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

  // The icon is a Tab stop; without a title it used to have no name at all.
  it("names the button when no title is passed", () => {
    render(<ContextMenuButton {...baseProps} title={undefined} />);
    expect(
      screen.getByRole("button", { name: "MoreOptions" }),
    ).toBeInTheDocument();
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

  // Consumers hand the event to ContextMenu.show(e), which positions the menu
  // at e.pageX / e.pageY: a keyboard press must give it coordinates too.
  it("calls onClick in toggle mode with an event that has coordinates", () => {
    const onClick = vi.fn();
    render(
      <ContextMenuButton
        {...baseProps}
        displayType={ContextMenuButtonDisplayType.toggle}
        onClick={onClick}
      />,
    );
    const button = screen.getByRole("button", { name: "Actions" });

    fireEvent.keyDown(button, { key: "Enter" });

    expect(onClick).toHaveBeenCalledTimes(1);
    const event = onClick.mock.calls[0][0];
    expect(Number.isFinite(event.pageX), `pageX is ${event.pageX}`).toBe(true);
    expect(Number.isFinite(event.pageY), `pageY is ${event.pageY}`).toBe(true);
  });
  const mockButtonRect = (button: HTMLElement) =>
    vi.spyOn(button, "getBoundingClientRect").mockReturnValue({
      left: 100,
      right: 140,
      top: 10,
      bottom: 30,
      width: 40,
      height: 20,
      x: 100,
      y: 10,
      toJSON: () => ({}),
    });

  it("places the keyboard click at the lower left corner in LTR", () => {
    const onClick = vi.fn();
    render(
      <InterfaceDirectionProvider interfaceDirection="ltr">
        <ContextMenuButton
          {...baseProps}
          displayType={ContextMenuButtonDisplayType.toggle}
          onClick={onClick}
        />
      </InterfaceDirectionProvider>,
    );
    const button = screen.getByRole("button", { name: "Actions" });
    mockButtonRect(button);

    fireEvent.keyDown(button, { key: "Enter" });

    const [event] = onClick.mock.calls[0];
    expect(event.clientX).toBe(100);
    expect(event.clientY).toBe(30);
  });

  // ContextMenu.position puts the menu's right edge at pageX in RTL, so the
  // keyboard click has to sit at the button's right edge there.
  it("places the keyboard click at the lower right corner in RTL", () => {
    const onClick = vi.fn();
    render(
      <InterfaceDirectionProvider interfaceDirection="rtl">
        <ContextMenuButton
          {...baseProps}
          displayType={ContextMenuButtonDisplayType.toggle}
          onClick={onClick}
        />
      </InterfaceDirectionProvider>,
    );
    const button = screen.getByRole("button", { name: "Actions" });
    mockButtonRect(button);

    fireEvent.keyDown(button, { key: "Enter" });

    const [event] = onClick.mock.calls[0];
    expect(event.clientX).toBe(140);
    expect(event.pageX).toBe(140 + window.scrollX);
  });

  // The caller's ContextMenu keeps focus on the button and picks its
  // highlighted item on the Enter keyup on window.
  it("leaves Enter to the caller's menu while that menu is on screen", () => {
    const menu = document.createElement("div");
    menu.className = "p-contextmenu";
    // Like a caller: its onClick shows the ContextMenu.
    const onClick = vi.fn(() => document.body.appendChild(menu));
    render(
      <ContextMenuButton
        {...baseProps}
        displayType={ContextMenuButtonDisplayType.toggle}
        onClick={onClick}
      />,
    );
    const button = screen.getByRole("button", { name: "Actions" });

    try {
      fireEvent.keyDown(button, { key: "Enter" });
      fireEvent.keyUp(document.body, { key: "Enter" });
      expect(onClick).toHaveBeenCalledTimes(1);

      const addSpy = vi.spyOn(window, "addEventListener");
      try {
        const keyDown = fireEvent.keyDown(button, { key: "Enter" });

        expect(onClick).toHaveBeenCalledTimes(1);
        expect(keyDown).toBe(true);
        // No keyup swallower is armed, so the menu gets its keyup.
        expect(addSpy).not.toHaveBeenCalledWith(
          "keyup",
          expect.any(Function),
          true,
        );
      } finally {
        addSpy.mockRestore();
      }

      // Once that menu has closed (ContextMenu unmounts), Enter opens it again.
      menu.remove();
      fireEvent.keyDown(button, { key: "Enter" });
      expect(onClick).toHaveBeenCalledTimes(2);
    } finally {
      menu.remove();
    }
  });

  // The guard looked for any ContextMenu on the page, so another menu left
  // open elsewhere made this button ignore Enter and Space.
  it("still opens its menu while an unrelated ContextMenu is open", () => {
    const onClick = vi.fn();
    render(
      <ContextMenuButton
        {...baseProps}
        displayType={ContextMenuButtonDisplayType.toggle}
        onClick={onClick}
      />,
    );
    const other = document.createElement("div");
    other.className = "p-contextmenu";
    document.body.appendChild(other);

    try {
      fireEvent.keyDown(screen.getByRole("button", { name: "Actions" }), {
        key: "Enter",
      });
      expect(onClick).toHaveBeenCalledTimes(1);
    } finally {
      other.remove();
    }
  });
});
