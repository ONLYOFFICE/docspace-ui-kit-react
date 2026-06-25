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
import { screen, render, fireEvent } from "@testing-library/react";

import { Slider } from "./index";

const defaultProps = {
  min: 0,
  max: 100,
  value: 50,
  onChange: vi.fn(),
};

describe("<Slider />", () => {
  it("renders without error", () => {
    render(<Slider {...defaultProps} />);
    expect(screen.getByTestId("slider")).toBeInTheDocument();
  });

  it("accepts and applies custom props", () => {
    const props = {
      id: "testId",
      className: "test-class",
      step: 5,
      withPouring: true,
      isDisabled: false,
      ...defaultProps,
    };

    render(<Slider {...props} />);
    const slider = screen.getByTestId("slider");

    expect(slider).toHaveAttribute("id", "testId");
    expect(slider).toHaveAttribute("class");
    expect(slider.className).toContain("test-class");
    expect(slider).toHaveAttribute("min", "0");
    expect(slider).toHaveAttribute("max", "100");
    expect(slider).toHaveAttribute("value", "50");
    expect(slider).toHaveAttribute("step", "5");
  });

  it("handles value changes correctly", () => {
    render(<Slider {...defaultProps} />);

    const slider = screen.getByTestId("slider");
    fireEvent.change(slider, { target: { value: "75" } });

    expect(defaultProps.onChange).toHaveBeenCalled();
  });

  it("respects disabled state", () => {
    render(<Slider {...defaultProps} isDisabled />);

    const slider = screen.getByTestId("slider");
    expect(slider).toBeDisabled();
  });

  it("applies custom dimensions", () => {
    render(
      <Slider
        {...defaultProps}
        thumbHeight="20px"
        thumbWidth="20px"
        thumbBorderWidth="2px"
        runnableTrackHeight="4px"
      />,
    );

    const slider = screen.getByTestId("slider");
    expect(slider).toBeInTheDocument();
  });
});
