/*
 * Copyright (C) Ascensio System SIA, 2009-2026
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation, together with the
 * additional terms provided in the LICENSE file.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For
 * details, see the GNU AGPL at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA by email at info@onlyoffice.com
 * or by postal mail at 20A-6 Ernesta Birznieka-Upisha Street, Riga,
 * LV-1050, Latvia, European Union.
 *
 * The interactive user interfaces in modified versions of the Program
 * are required to display Appropriate Legal Notices in accordance with
 * Section 5 of the GNU AGPL version 3.
 *
 * No trademark rights are granted under this License.
 *
 * All non-code elements of the Product, including illustrations,
 * icon sets, and technical writing content, are licensed under the
 * Creative Commons Attribution-ShareAlike 4.0 International License:
 * https://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 * This license applies only to such non-code elements and does not
 * modify or replace the licensing terms applicable to the Program's
 * source code, which remains licensed under the GNU Affero General
 * Public License v3.
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

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
