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

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { RadioButton } from ".";

const baseProps = {
  name: "fruits",
  value: "apple",
  label: "Sweet apple",
};

const renderComponent = (props = {}) => {
  return render(<RadioButton {...baseProps} {...props} />);
};

describe("<RadioButton />", () => {
  it("renders without error", () => {
    renderComponent();
    expect(screen.getByTestId("radio-button")).toBeInTheDocument();
    expect(screen.getByText("Sweet apple")).toBeInTheDocument();
  });

  it("handles checked state correctly", () => {
    renderComponent({ isChecked: true });

    const radio = screen.getByRole("radio") as HTMLInputElement;
    expect(radio.checked).toBe(true);
  });

  it("calls onClick handler when clicked and onChange is not provided", () => {
    const onClick = vi.fn();
    renderComponent({ onClick, isChecked: false });

    const radio = screen.getByRole("radio");
    fireEvent.click(radio);
    expect(onClick).toHaveBeenCalled();
  });

  it("applies disabled state correctly", () => {
    renderComponent({ isDisabled: true });

    const radio = screen.getByRole("radio") as HTMLInputElement;
    const label = screen.getByTestId("radio-button");

    expect(radio).toBeDisabled();
    expect(label.className).toContain("disabled");
  });

  it("accepts and applies custom className", () => {
    const className = "custom-radio";
    renderComponent({ className });

    const label = screen.getByTestId("radio-button");
    expect(label).toHaveClass(className);
  });

  it("accepts and applies custom styles", () => {
    const customStyle = { marginTop: "10px" };
    renderComponent({ style: customStyle });

    const label = screen.getByTestId("radio-button");
    expect(label.style.marginTop).toBe("10px");
  });

  it("handles orientation prop", () => {
    renderComponent({ orientation: "vertical" });
    const label = screen.getByTestId("radio-button");
    expect(label).toBeInTheDocument();
  });

  it("updates when isChecked prop changes", () => {
    const { rerender } = renderComponent({ isChecked: false });
    const radio = screen.getByRole("radio") as HTMLInputElement;
    expect(radio.checked).toBe(false);

    rerender(<RadioButton {...baseProps} isChecked />);
    expect(radio.checked).toBe(true);
  });

  it("has proper accessibility attributes", () => {
    const id = "test-radio";
    renderComponent({ id });

    const radio = screen.getByRole("radio");
    const label = screen.getByTestId("radio-button");

    expect(radio).toHaveAttribute("type", "radio");
    expect(label).toHaveAttribute("id", id);
  });

  it("calls onChange when provided", () => {
    const onChange = vi.fn();
    renderComponent({ onChange });

    const radio = screen.getByRole("radio");
    fireEvent.click(radio);
    expect(onChange).toHaveBeenCalled();
  });

  it("works without handlers", () => {
    renderComponent();
    const radio = screen.getByRole("radio");

    // Should not throw error when changed without handlers
    expect(() => {
      fireEvent.change(radio);
    }).not.toThrow();
  });

  it("updates internal state when changed", () => {
    const isChecked = false;
    renderComponent({ isChecked });
    const radio = screen.getByRole("radio") as HTMLInputElement;
    expect(radio.checked).toBe(isChecked);

    fireEvent.click(radio);
    expect(radio.checked).toBe(!isChecked);
  });
});
