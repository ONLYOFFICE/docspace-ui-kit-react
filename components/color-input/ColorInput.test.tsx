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
import { screen, render, fireEvent } from "@testing-library/react";
import { ColorInput } from "./ColorInput";
import { globalColors } from "../../providers/theme";
import colorInputStyles from "./ColorInput.module.scss";
import { InputSize } from "../text-input/TextInput.enums";

vi.mock("../drop-down", async () => {
  const actual = await vi.importActual<typeof import("../drop-down")>(
    "../drop-down",
  );

  return {
    ...actual,
    DropDown: ({ open, children }: { open?: boolean; children: React.ReactNode }) => (
      <div data-testid="dropdown" data-open={open ? "true" : "false"}>
        {children}
      </div>
    ),
  };
});

describe("ColorInput component", () => {
  it("renders without error", () => {
    render(<ColorInput />);
    expect(screen.getByTestId("color-input")).toBeInTheDocument();
  });

  it("uses default color when no color is provided", () => {
    render(<ColorInput />);
    const input = screen.getByRole("textbox") as HTMLInputElement;
    expect(input.value).toBe(globalColors.lightBlueMain.toUpperCase());
  });

  it("uses provided default color", () => {
    const testColor = "#FF0000";
    render(<ColorInput defaultColor={testColor} />);
    const input = screen.getByRole("textbox") as HTMLInputElement;
    expect(input.value).toBe(testColor.toUpperCase());
  });

  it("calls handleChange when color is changed", () => {
    const handleChange = vi.fn();
    const newColor = "#00FF00";
    render(<ColorInput handleChange={handleChange} />);
    const input = screen.getByRole("textbox") as HTMLInputElement;

    fireEvent.change(input, { target: { value: newColor } });
    expect(handleChange).toHaveBeenCalledWith(newColor);
  });

  it("disables input when isDisabled is true", () => {
    render(<ColorInput isDisabled />);
    const input = screen.getByRole("textbox") as HTMLInputElement;
    expect(input).toBeDisabled();
  });

  it("applies error styles when hasError is true", () => {
    render(<ColorInput hasError />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("data-error", "true");
  });

  it("applies warning styles when hasWarning is true", () => {
    render(<ColorInput hasWarning />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("data-warning", "true");
  });

  it("applies scale styles when scale prop is true", () => {
    render(<ColorInput scale />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("data-scale", "true");
  });

  it("applies custom className", () => {
    const customClass = "custom-class";
    render(<ColorInput className={customClass} />);
    const wrapper = screen.getByTestId("color-input");
    expect(wrapper).toHaveClass(customClass);
  });

  it("applies custom id", () => {
    const customId = "custom-id";
    render(<ColorInput id={customId} />);
    const wrapper = screen.getByTestId("color-input");
    expect(wrapper).toHaveAttribute("id", customId);
  });

  it("applies custom dataTestId", () => {
    const testId = "custom-color-input-id";
    render(<ColorInput dataTestId={testId} />);

    expect(screen.getByTestId(testId)).toBeInTheDocument();
  });

  it("passes size prop to input as data attribute", () => {
    render(<ColorInput size={InputSize.large} />);
    const input = screen.getByRole("textbox");

    expect(input).toHaveAttribute("data-size", InputSize.large);
  });

  it("applies disabled attributes and styles when isDisabled is true", () => {
    render(<ColorInput isDisabled />);

    const input = screen.getByRole("textbox");
    expect(input).toBeDisabled();
    expect(input).toHaveAttribute("data-disabled", "true");

    const wrapper = screen.getByTestId("color-input");
    const colorBlock = wrapper.querySelector(
      `.${colorInputStyles.colorBlock}`,
    ) as HTMLElement;

    expect(colorBlock).toBeInTheDocument();
    expect(colorBlock).toHaveClass(colorInputStyles.disabled);
  });

  it("updates color block style when color changes", () => {
    const newColor = "#123456";

    render(<ColorInput />);

    const wrapper = screen.getByTestId("color-input");
    const colorBlock = wrapper.querySelector(
      `.${colorInputStyles.colorBlock}`,
    ) as HTMLElement;
    const input = screen.getByRole("textbox") as HTMLInputElement;

    fireEvent.change(input, { target: { value: newColor } });

    expect(colorBlock).toHaveStyle({ "--block-color": newColor });
  });

  it("opens and closes color picker dropdown when clicking color block and close button", () => {
    render(<ColorInput />);

    const wrapper = screen.getByTestId("color-input");
    const colorBlock = wrapper.querySelector(
      `.${colorInputStyles.colorBlock}`,
    ) as HTMLElement;
    const dropdown = screen.getByTestId("dropdown");

    expect(colorBlock).toBeInTheDocument();
    expect(dropdown).toHaveAttribute("data-open", "false");

    fireEvent.click(colorBlock);

    expect(dropdown).toHaveAttribute("data-open", "true");
    expect(screen.getByTestId("color-picker")).toBeInTheDocument();

    const closeButton = screen.getByTestId("color-picker-close");
    fireEvent.click(closeButton);

    expect(dropdown).toHaveAttribute("data-open", "false");
  });
});
