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
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { HeaderButtons } from "./HeaderButtons";

// Mock SCSS
vi.mock("../../Calendar.module.scss", () => ({
  default: {
    buttonsContainer: "buttonsContainer",
    roundButton: "roundButton",
    disabled: "disabled",
    arrowIcon: "arrowIcon",
    prev: "prev",
    next: "next",
  },
}));

describe("HeaderButtons Component", () => {
  const mockOnLeftClick = vi.fn();
  const mockOnRightClick = vi.fn();

  const defaultProps = {
    onLeftClick: mockOnLeftClick,
    onRightClick: mockOnRightClick,
    isLeftDisabled: false,
    isRightDisabled: false,
    isMobile: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render both buttons", () => {
    render(<HeaderButtons {...defaultProps} />);

    const prevButton = screen.getByLabelText("Previous");
    const nextButton = screen.getByLabelText("Next");

    expect(prevButton).toBeDefined();
    expect(nextButton).toBeDefined();
  });

  it("should call onLeftClick when previous button is clicked", () => {
    render(<HeaderButtons {...defaultProps} />);

    const prevButton = screen.getByLabelText("Previous");
    fireEvent.click(prevButton);

    expect(mockOnLeftClick).toHaveBeenCalledTimes(1);
  });

  it("should call onRightClick when next button is clicked", () => {
    render(<HeaderButtons {...defaultProps} />);

    const nextButton = screen.getByLabelText("Next");
    fireEvent.click(nextButton);

    expect(mockOnRightClick).toHaveBeenCalledTimes(1);
  });

  it("should disable previous button when isLeftDisabled is true", () => {
    render(<HeaderButtons {...defaultProps} isLeftDisabled={true} />);

    const prevButton = screen.getByLabelText("Previous");
    expect(prevButton).toBeDisabled();
  });

  it("should disable next button when isRightDisabled is true", () => {
    render(<HeaderButtons {...defaultProps} isRightDisabled={true} />);

    const nextButton = screen.getByLabelText("Next");
    expect(nextButton).toBeDisabled();
  });

  it("should not call onLeftClick when previous button is disabled", () => {
    render(<HeaderButtons {...defaultProps} isLeftDisabled={true} />);

    const prevButton = screen.getByLabelText("Previous");
    fireEvent.click(prevButton);

    expect(mockOnLeftClick).not.toHaveBeenCalled();
  });

  it("should not call onRightClick when next button is disabled", () => {
    render(<HeaderButtons {...defaultProps} isRightDisabled={true} />);

    const nextButton = screen.getByLabelText("Next");
    fireEvent.click(nextButton);

    expect(mockOnRightClick).not.toHaveBeenCalled();
  });

  it("should apply mobile margin when isMobile is true", () => {
    render(<HeaderButtons {...defaultProps} isMobile={true} />);

    const prevButton = screen.getByLabelText("Previous");
    expect(prevButton.style.marginInlineEnd).toBe("12px");
  });

  it("should apply desktop margin when isMobile is false", () => {
    render(<HeaderButtons {...defaultProps} isMobile={false} />);

    const prevButton = screen.getByLabelText("Previous");
    expect(prevButton.style.marginInlineEnd).toBe("8px");
  });

  it("should have correct CSS classes", () => {
    render(<HeaderButtons {...defaultProps} />);

    const prevButton = screen.getByLabelText("Previous");
    const nextButton = screen.getByLabelText("Next");

    expect(prevButton.className).toContain("roundButton");
    expect(prevButton.className).toContain("arrow-previous");
    expect(nextButton.className).toContain("roundButton");
    expect(nextButton.className).toContain("arrow-next");
  });

  it("should add disabled class when buttons are disabled", () => {
    render(
      <HeaderButtons
        {...defaultProps}
        isLeftDisabled={true}
        isRightDisabled={true}
      />,
    );

    const prevButton = screen.getByLabelText("Previous");
    const nextButton = screen.getByLabelText("Next");

    expect(prevButton.className).toContain("disabled");
    expect(nextButton.className).toContain("disabled");
  });
});
