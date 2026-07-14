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
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ToggleButton } from ".";

describe("<ToggleButton />", () => {
  const defaultProps = {
    isChecked: false,
    onChange: vi.fn(),
    label: "Toggle me",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders without error", () => {
    render(<ToggleButton {...defaultProps} />);
    expect(screen.getByTestId("toggle-button")).toBeInTheDocument();
  });

  it("renders with label", () => {
    render(<ToggleButton {...defaultProps} />);
    const label = screen.getByTestId("toggle-button-label");
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent("Toggle me");
  });

  it("renders without label when not provided", () => {
    render(<ToggleButton {...defaultProps} label={undefined} />);
    expect(screen.queryByTestId("toggle-button-label")).not.toBeInTheDocument();
  });

  it("handles checked state correctly", () => {
    render(<ToggleButton {...defaultProps} isChecked />);
    const input = screen.getByTestId("toggle-button-input") as HTMLInputElement;
    expect(input.checked).toBe(true);
  });

  it("calls onChange when clicked", async () => {
    const onChange = vi.fn();
    render(<ToggleButton {...defaultProps} onChange={onChange} />);

    const toggle = screen.getByTestId("toggle-button-input");
    await userEvent.click(toggle);

    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("respects disabled state", () => {
    render(<ToggleButton {...defaultProps} isDisabled />);
    const input = screen.getByTestId("toggle-button-input");
    expect(input).toBeDisabled();
  });

  it("prevents interaction when disabled", async () => {
    const onChange = vi.fn();
    render(<ToggleButton {...defaultProps} onChange={onChange} isDisabled />);

    const toggle = screen.getByTestId("toggle-button-input");
    await userEvent.click(toggle);

    expect(onChange).not.toHaveBeenCalled();
  });

  it("applies custom className", () => {
    render(<ToggleButton {...defaultProps} className="custom-class" />);
    const container = screen.getByTestId("toggle-button-container");
    expect(container).toHaveClass("custom-class");
  });

  it("applies custom styles", () => {
    const customStyle = { marginTop: "10px" };
    render(<ToggleButton {...defaultProps} style={customStyle} />);
    const container = screen.getByTestId("toggle-button-container");
    expect(container).toHaveStyle(customStyle);
  });

  it("sets name attribute correctly", () => {
    render(<ToggleButton {...defaultProps} name="toggle-name" />);
    const input = screen.getByTestId("toggle-button-input");
    expect(input).toHaveAttribute("name", "toggle-name");
  });

  it("applies font styling correctly", () => {
    render(<ToggleButton {...defaultProps} fontWeight={600} fontSize="16px" />);
    const label = screen.getByTestId("toggle-button-label");
    expect(label).toHaveStyle({
      fontWeight: "600",
      fontSize: "16px",
    });
  });
});
