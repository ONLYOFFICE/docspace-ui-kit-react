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
import { screen, fireEvent, render } from "@testing-library/react";
import { FloatingButton } from ".";
import { FloatingButtonIcons } from "./FloatingButton.enums";

describe("FloatingButton", () => {
  const defaultProps = {
    icon: FloatingButtonIcons.upload,
    percent: 5,
  };

  const renderComponent = (ui: React.ReactNode) => {
    return render(ui);
  };

  it("renders without crashing", () => {
    renderComponent(<FloatingButton {...defaultProps} />);
    const button = screen.getByTestId("floating-button");
    expect(button).toBeInTheDocument();
  });

  it("renders with custom className", () => {
    const className = "custom-class";
    renderComponent(<FloatingButton {...defaultProps} className={className} />);
    expect(screen.getByTestId("floating-button")).toHaveClass(className);
  });

  it("renders with custom style", () => {
    const style = { marginTop: "10px" };
    renderComponent(<FloatingButton {...defaultProps} style={style} />);
    const button = screen.getByTestId("floating-button");
    expect(button).toHaveStyle({ marginTop: "10px" });
  });

  it("handles click events", () => {
    const onClick = vi.fn();
    renderComponent(<FloatingButton {...defaultProps} onClick={onClick} />);

    const button = screen.getByTestId("floating-button");
    fireEvent.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("displays alert when alert prop is true", () => {
    renderComponent(<FloatingButton {...defaultProps} alert />);
    const alertIcon = screen.getByTestId("floating-button-alert");
    expect(alertIcon).toBeInTheDocument();
  });

  it("shows progress indicator when percent > 0", () => {
    renderComponent(<FloatingButton {...defaultProps} />);
    const progress = screen.getByTestId("floating-button-progress");
    expect(progress).toBeInTheDocument();
  });

  it("renders different icons correctly", () => {
    Object.values(FloatingButtonIcons).forEach((icon) => {
      renderComponent(<FloatingButton {...defaultProps} icon={icon} />);

      const iconElement = screen.getByTestId(`icon-${icon}`);
      expect(iconElement).toBeInTheDocument();
    });
  });

  it("calls clearUploadedFilesHistory after close icon click", () => {
    const clearUploadedFilesHistory = vi.fn();
    renderComponent(
      <FloatingButton
        {...defaultProps}
        showCancelButton
        clearUploadedFilesHistory={clearUploadedFilesHistory}
      />,
    );

    const button = screen.getByTestId("floating-button-close-icon");
    fireEvent.click(button);

    expect(clearUploadedFilesHistory).toHaveBeenCalledTimes(1);
  });

  describe("accessibility", () => {
    it("has correct ARIA attributes", () => {
      renderComponent(<FloatingButton {...defaultProps} />);
      const button = screen.getByTestId("floating-button");

      expect(button).toHaveAttribute("data-role", "button");
      expect(button).toHaveAttribute(
        "aria-label",
        `${defaultProps.icon} button`,
      );
    });

    it("is keyboard accessible", () => {
      const onClick = vi.fn();
      renderComponent(<FloatingButton {...defaultProps} onClick={onClick} />);

      const button = screen.getByTestId("floating-button");
      fireEvent.keyPress(button, { key: "Enter", code: 13, charCode: 13 });

      expect(onClick).toHaveBeenCalledTimes(0);
    });
  });
});
