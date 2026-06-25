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

import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MainButton } from ".";

vi.mock("react-svg", () => ({
  ReactSVG: () => <div className="img" />,
}));

describe("<MainButton />", () => {
  const defaultProps = {
    text: "Test Button",
    model: [],
  };

  it("renders without error", () => {
    render(<MainButton {...defaultProps} />);
    expect(screen.getByTestId("main-button")).toBeInTheDocument();
    expect(screen.getByText("Test Button")).toBeInTheDocument();
  });

  it("accepts id", () => {
    render(<MainButton {...defaultProps} id="test-id" />);
    const button = screen.getByText("Test Button").parentElement;
    expect(button).toHaveAttribute("id", "test-id");
  });

  it("accepts className", () => {
    render(<MainButton {...defaultProps} className="custom-class" />);
    const button = screen.getByText("Test Button").parentElement;
    expect(button?.className).toContain("custom-class");
  });

  it("accepts style", () => {
    const customStyle = { backgroundColor: "red" };
    render(<MainButton {...defaultProps} style={customStyle} />);
    const button = screen.getByText("Test Button").parentElement;
    expect(button?.style.backgroundColor).toBe("red");
  });

  it("renders as disabled", () => {
    render(<MainButton {...defaultProps} isDisabled />);
    const button = screen.getByText("Test Button").parentElement;
    expect(button?.className).toContain("disabled");
  });

  it("prevents click when disabled", () => {
    const onAction = vi.fn();
    render(
      <MainButton
        {...defaultProps}
        isDisabled
        onAction={onAction}
        isDropdown={false}
      />,
    );

    const button = screen.getByText("Test Button").parentElement;
    fireEvent.click(button!);
    expect(onAction).not.toHaveBeenCalled();
  });

  it("calls onAction when not disabled and not dropdown", () => {
    const onAction = vi.fn();
    render(
      <MainButton
        {...defaultProps}
        isDisabled={false}
        onAction={onAction}
        isDropdown={false}
      />,
    );

    const button = screen.getByText("Test Button").parentElement;
    fireEvent.click(button!);
    expect(onAction).toHaveBeenCalled();
  });

  it("renders dropdown arrow when isDropdown is true", () => {
    render(<MainButton {...defaultProps} isDropdown />);
    const button = screen.getByText("Test Button").parentElement;
    expect(button?.className).toContain("dropdown");
  });

  it("does not render dropdown arrow when isDropdown is false", () => {
    render(<MainButton {...defaultProps} isDropdown={false} />);
    const button = screen.getByText("Test Button").parentElement;
    expect(button?.className).not.toContain("dropdown");
  });

  it("uses default text when not provided", () => {
    render(<MainButton model={[]} />);
    expect(screen.getByText("Button")).toBeInTheDocument();
  });

  it("renders with custom text", () => {
    render(<MainButton {...defaultProps} text="Custom Text" />);
    expect(screen.getByText("Custom Text")).toBeInTheDocument();
  });

  it("renders context menu when dropdown", () => {
    const model = [{ key: "item1", label: "Item 1" }];
    render(<MainButton {...defaultProps} model={model} isDropdown />);
    expect(
      screen.getByTestId("main-button").querySelector(".img"),
    ).toBeInTheDocument();
  });
});
