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
import { SnackBar } from "./Snackbar";

describe("SnackBar", () => {
  const defaultProps = {
    text: "Test message",
    headerText: "Test header",
    btnText: "Action",
    countDownTime: 5000,
    sectionWidth: 400,
  };

  it("renders with required props", () => {
    render(<SnackBar {...defaultProps} />);
    expect(screen.getByTestId("snackbar-message")).toHaveTextContent(
      "Test message",
    );
    expect(screen.getByTestId("snackbar-header")).toHaveTextContent(
      "Test header",
    );
  });

  it("renders HTML content when provided", () => {
    const htmlContent = "<p>HTML content</p>";
    render(
      <SnackBar {...defaultProps} htmlContent={htmlContent} text={undefined} />,
    );
    expect(screen.getByTestId("snackbar-html-content")).toBeInTheDocument();
    expect(screen.getByTestId("snackbar-html-content")).toContainHTML(
      htmlContent,
    );
  });

  it("shows icon when showIcon is true", () => {
    render(<SnackBar {...defaultProps} showIcon />);
    expect(screen.getByTestId("snackbar-icon")).toBeInTheDocument();
  });

  it("renders close button when btnText is not provided", () => {
    render(<SnackBar {...defaultProps} btnText={undefined} />);
    const button = screen.getByRole("button");
    expect(button.className).toContain("action");
  });

  it("handles click events", () => {
    const onAction = vi.fn();
    render(<SnackBar {...defaultProps} onAction={onAction} />);

    const button = screen.getByText(defaultProps.btnText);
    fireEvent.click(button);

    expect(onAction).toHaveBeenCalled();
  });

  it("renders campaigns iframe when isCampaigns is true", () => {
    const htmlContent = "https://example.com";
    render(
      <SnackBar {...defaultProps} isCampaigns htmlContent={htmlContent} />,
    );

    const iframe = screen.getByTestId("snackbar-iframe");
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute("src", htmlContent);
  });

  it("applies correct styles based on props", () => {
    const textAlign = "center";

    render(<SnackBar {...defaultProps} textAlign={textAlign} />);

    const container = screen.getByTestId("snackbar-container");
    const textContainer = container.querySelector("[class*='textContainer']");
    if (textContainer) {
      expect(textContainer).toHaveStyle({
        "--text-align": textAlign,
      });
    }
  });
});
