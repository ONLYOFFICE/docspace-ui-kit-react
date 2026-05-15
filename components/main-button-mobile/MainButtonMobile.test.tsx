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
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { screen, fireEvent, render } from "@testing-library/react";

import { MainButtonMobile } from ".";
import { ButtonOption } from "./MainButtonMobile.types";

vi.mock("PUBLIC_DIR/images/button.alert.react.svg", () => ({
  __esModule: true,
  default: () => <div className="alertIcon" data-testid="alert-icon" />,
}));

describe("<MainButtonMobile />", () => {
  const mockOnClick = vi.fn();

  const buttonOptions: ButtonOption[] = [
    {
      key: "option1",
      label: "Option 1",
      onClick: vi.fn(),
    },
    {
      key: "option2",
      label: "Option 2",
      onClick: vi.fn(),
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders without error", () => {
    render(<MainButtonMobile />);
    expect(screen.getByTestId("main-button-mobile")).toBeInTheDocument();
  });

  it("renders with button options", () => {
    render(<MainButtonMobile buttonOptions={buttonOptions} opened />);
    expect(screen.getByTestId("dropdown")).toBeInTheDocument();
    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
  });

  it("handles main button click", () => {
    render(<MainButtonMobile onClick={mockOnClick} withMenu={false} />);
    const button = screen.getByTestId("floating-button");
    fireEvent.click(button);
    expect(mockOnClick).toHaveBeenCalled();
  });
});
