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
import { fireEvent, render, screen } from "@testing-library/react";

import { IndexIconButtons } from ".";

describe("<IndexIconButtons />", () => {
  it("renders without error", () => {
    render(<IndexIconButtons />);
    expect(screen.getByTestId("index-icon-buttons")).toBeInTheDocument();
  });

  it("renders with containerClassName prop", () => {
    const className = "custom-class";
    render(<IndexIconButtons containerClassName={className} />);
    expect(screen.getByTestId("index-icon-buttons")).toHaveClass(className);
  });

  it("renders with commonIconClassName prop", () => {
    const className = "custom-class";
    render(<IndexIconButtons commonIconClassName={className} />);
    const upIcon = screen.getByTestId("index-up-icon");
    const downIcon = screen.getByTestId("index-down-icon");

    expect(upIcon).toHaveClass(className);
    expect(downIcon).toHaveClass(className);
  });

  it("applies upIconClassName to the up icon", () => {
    const className = "up-icon-class";

    render(<IndexIconButtons upIconClassName={className} />);

    const upIcon = screen.getByTestId("index-up-icon");
    expect(upIcon).toHaveClass(className);
  });

  it("applies downIconClassName to the down icon", () => {
    const className = "down-icon-class";

    render(<IndexIconButtons downIconClassName={className} />);

    const downIcon = screen.getByTestId("index-down-icon");
    expect(downIcon).toHaveClass(className);
  });

  it("calls onUpIndexClick when up icon is clicked", () => {
    const handleUpClick = vi.fn();

    render(<IndexIconButtons onUpIndexClick={handleUpClick} />);

    const upIcon = screen.getByTestId("index-up-icon");
    fireEvent.click(upIcon);

    expect(handleUpClick).toHaveBeenCalledTimes(1);
  });

  it("calls onDownIndexClick when down icon is clicked", () => {
    const handleDownClick = vi.fn();

    render(<IndexIconButtons onDownIndexClick={handleDownClick} />);

    const downIcon = screen.getByTestId("index-down-icon");
    fireEvent.click(downIcon);

    expect(handleDownClick).toHaveBeenCalledTimes(1);
  });

  it("applies the style prop to the root element", () => {
    const style = {
      backgroundColor: "red",
      padding: "10px",
    };

    render(<IndexIconButtons style={style} />);

    const root = screen.getByTestId("index-icon-buttons");
    expect(root.style.backgroundColor).toBe("red");
    expect(root.style.padding).toBe("10px");
  });
});
