import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import SearchReactSvgUrl from "../../assets/button.alert.react.svg?url";
import { ThemeProviderComponent } from "../theme-provider";
import { IconButton } from ".";
import type { IconButtonProps } from "./IconButton.types";

// Mock Base theme for testing
const mockBaseTheme = {
  isBase: true,
  interfaceDirection: "ltr",
  fontFamily: "Open Sans, sans-serif, Arial",
};

const baseProps: IconButtonProps = {
  size: 25,
  isDisabled: false,
  iconName: SearchReactSvgUrl,
  isFill: true,
};

describe("<IconButton />", () => {
  it("renders without error", () => {
    render(<IconButton {...baseProps} />);
    expect(screen.getByTestId("icon-button")).toBeInTheDocument();
    expect(screen.getByTestId("icon-button-svg")).toBeInTheDocument();
  });

  it("puts role and aria-label on the element", () => {
    render(
      <IconButton
        {...baseProps}
        role="button"
        ariaLabel="Export key"
        tabIndex={0}
        onClick={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: "Export key" })).toBe(
      screen.getByTestId("icon-button"),
    );
  });

  it("sets no role or name of its own", () => {
    render(<IconButton {...baseProps} title="Export key" />);

    const element = screen.getByTestId("icon-button");
    expect(element).not.toHaveAttribute("role");
    expect(element).not.toHaveAttribute("aria-label");
  });

  describe("keyboard", () => {
    it("is a focusable button named by title when it has an onClick", async () => {
      const user = userEvent.setup();
      render(<IconButton {...baseProps} title="Close" onClick={vi.fn()} />);

      await user.tab();

      expect(screen.getByRole("button", { name: "Close" })).toHaveFocus();
    });

    it.each(["{Enter}", " "])("calls onClick on %s", async (key) => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(<IconButton {...baseProps} title="Close" onClick={onClick} />);

      await user.tab();
      await user.keyboard(key);

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("hands onClick a click placed at the button for a menu to open at", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(<IconButton {...baseProps} title="Menu" onClick={onClick} />);
      const button = screen.getByRole("button", { name: "Menu" });
      button.getBoundingClientRect = () =>
        DOMRect.fromRect({ x: 40, y: 10, width: 16, height: 16 });

      await user.tab();
      await user.keyboard("{Enter}");

      expect(onClick.mock.calls[0][0]).toMatchObject({
        pageX: 40,
        pageY: 26,
        currentTarget: button,
      });
    });

    it("keeps a handled key from listeners further up", async () => {
      const user = userEvent.setup();
      const onPageKey = vi.fn();
      render(<IconButton {...baseProps} title="Close" onClick={vi.fn()} />);

      await user.tab();
      document.addEventListener("keydown", onPageKey);
      await user.keyboard("{Enter}");
      document.removeEventListener("keydown", onPageKey);

      expect(onPageKey).not.toHaveBeenCalled();
    });

    it("is not a tab stop when disabled", () => {
      render(
        <IconButton
          {...baseProps}
          title="Close"
          onClick={vi.fn()}
          isDisabled
        />,
      );

      const element = screen.getByTestId("icon-button");
      expect(element).not.toHaveAttribute("tabindex");
      expect(element).not.toHaveAttribute("role");
    });

    it("leaves the keyboard to a caller that passes its own onKeyDown", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      const onKeyDown = vi.fn();
      render(
        <IconButton
          {...baseProps}
          onClick={onClick}
          onKeyDown={onKeyDown}
          tabIndex={0}
        />,
      );

      await user.tab();
      await user.keyboard("{Enter}");

      expect(onKeyDown).toHaveBeenCalled();
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  it("accepts and applies id prop", () => {
    const testId = "test-id";
    render(<IconButton {...baseProps} id={testId} />);
    expect(screen.getByTestId("icon-button")).toHaveAttribute("id", testId);
  });

  it("accepts and applies className prop", () => {
    const testClass = "test-class";
    render(<IconButton {...baseProps} className={testClass} />);
    expect(screen.getByTestId("icon-button")).toHaveClass(testClass);
  });

  it("accepts and applies style prop", () => {
    const testStyle = { backgroundColor: "red" };
    render(<IconButton {...baseProps} style={testStyle} />);
    expect(screen.getByTestId("icon-button").style.backgroundColor).toBe("red");
  });

  it("handles click events", async () => {
    const handleClick = vi.fn();
    render(<IconButton {...baseProps} onClick={handleClick} />);

    const button = screen.getByTestId("icon-button");
    await userEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("prevents click events when disabled", async () => {
    const handleClick = vi.fn();
    render(<IconButton {...baseProps} onClick={handleClick} isDisabled />);

    const button = screen.getByTestId("icon-button");
    await userEvent.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it("handles mouse down state correctly", () => {
    const clickIconName = "click-icon.svg";
    const clickColor = "blue";
    const handleMouseDown = vi.fn();

    render(
      <IconButton
        {...baseProps}
        iconClickName={clickIconName}
        clickColor={clickColor}
        onMouseDown={handleMouseDown}
      />,
    );

    const button = screen.getByTestId("icon-button");
    fireEvent.mouseDown(button);

    expect(handleMouseDown).toHaveBeenCalled();
    expect(button).toHaveAttribute("data-iconname");
  });

  it("handles mouse up state with left click", () => {
    const handleMouseUp = vi.fn();
    const hoverIconName = "hover-icon.svg";

    render(
      <IconButton
        {...baseProps}
        iconHoverName={hoverIconName}
        onMouseUp={handleMouseUp}
      />,
    );

    const button = screen.getByTestId("icon-button");
    fireEvent.mouseUp(button, { button: 1 });

    expect(handleMouseUp).toHaveBeenCalled();
    expect(button).toHaveAttribute("data-iconname");
  });

  it("handles right click mouse up", () => {
    const handleMouseUp = vi.fn();

    render(<IconButton {...baseProps} onMouseUp={handleMouseUp} />);

    const button = screen.getByTestId("icon-button");
    fireEvent.mouseUp(button, { button: 2 });

    expect(handleMouseUp).toHaveBeenCalled();
  });

  it("renders custom icon node when provided", () => {
    const CustomIcon = () => <div data-testid="custom-icon">Custom Icon</div>;
    render(<IconButton {...baseProps} iconNode={<CustomIcon />} />);

    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });

  it("updates icon on iconName prop change", () => {
    const { rerender } = render(<IconButton {...baseProps} />);

    const newIconName = "new-icon.svg";
    rerender(
      <ThemeProviderComponent theme={mockBaseTheme}>
        <IconButton {...baseProps} iconName={newIconName} />
      </ThemeProviderComponent>,
    );

    const iconButton = screen.getByTestId("icon-button");
    expect(iconButton).toHaveAttribute("data-iconname", newIconName);
  });

  it("applies correct size", () => {
    const customSize = 40;
    render(<IconButton {...baseProps} size={customSize} />);
    expect(screen.getByTestId("icon-button")).toHaveStyle({
      "--icon-button-size": `${customSize}px`,
    });
  });

  it("displays title when provided", () => {
    const title = "Button Title";
    render(<IconButton {...baseProps} title={title} />);
    expect(screen.getByTitle(title)).toBeInTheDocument();
  });

  it("handles data-tip attribute", () => {
    const dataTip = "tooltip text";
    render(<IconButton {...baseProps} dataTip={dataTip} />);
    expect(screen.getByTestId("icon-button")).toHaveAttribute(
      "data-tip",
      dataTip,
    );
  });

  it("resets to default icon on mouse leave", async () => {
    const hoverIconName = "hover-icon.svg";
    render(<IconButton {...baseProps} iconHoverName={hoverIconName} />);

    const button = screen.getByTestId("icon-button");
    const initialIconName = button.getAttribute("data-iconname");

    fireEvent.mouseEnter(button);
    await screen.findByTestId("icon-button");
    expect(button).toHaveAttribute("data-iconname");

    fireEvent.mouseLeave(button);
    await screen.findByTestId("icon-button");
    expect(button).toHaveAttribute("data-iconname", initialIconName);
  });

  it("Apply color correctly", () => {
    render(<IconButton color="rgb(255, 0, 0)" />);
    const button = screen.getByTestId("icon-button");

    const colorVar = window
      .getComputedStyle(button)
      .getPropertyValue("--icon-button-color");

    expect(colorVar).toBe("rgb(255, 0, 0)");
  });

  it("applies CSS variable color with and without var correctly", () => {
    const { rerender } = render(<IconButton color="--custom-color" />);
    const button = screen.getByTestId("icon-button");

    const colorVar = window
      .getComputedStyle(button)
      .getPropertyValue("--icon-button-color");

    expect(colorVar).toBe("var(--custom-color)");

    rerender(<IconButton color="var(--custom-color-2)" />);

    const colorVar2 = window
      .getComputedStyle(button)
      .getPropertyValue("--icon-button-color");

    expect(colorVar2).toBe("var(--custom-color-2)");
  });

  it("maps accent color correctly", () => {
    render(<IconButton color="accent" />);
    const button = screen.getByTestId("icon-button");

    const colorVar = window
      .getComputedStyle(button)
      .getPropertyValue("--icon-button-color");

    expect(colorVar).toBe("var(--accent-main)");
  });
});
