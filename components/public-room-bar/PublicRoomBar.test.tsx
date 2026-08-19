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

import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import PublicRoomBar from "./index";

describe("PublicRoomBar", () => {
  const defaultProps = {
    headerText: "Test Header",
    bodyText: "Test Body",
    onClose: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders with default props", () => {
    render(<PublicRoomBar {...defaultProps} />);

    expect(screen.getByText("Test Header")).toBeInTheDocument();
    expect(screen.getByText("Test Body")).toBeInTheDocument();
  });

  it("renders with custom icon", () => {
    const customIcon = "custom-icon-path.svg";
    render(<PublicRoomBar {...defaultProps} iconName={customIcon} />);

    const iconElement = screen.getByTestId("icon-button");
    expect(iconElement).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    render(<PublicRoomBar {...defaultProps} />);

    const closeButton = screen.getByTestId("icon-button");
    fireEvent.click(closeButton);

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it("does not render close button when onClose is not provided", () => {
    const { onClose: _, ...propsWithoutClose } = defaultProps;
    render(<PublicRoomBar {...propsWithoutClose} />);

    const closeButton = screen.queryByRole("button");
    expect(closeButton).not.toBeInTheDocument();
  });

  it("applies barVisible class when barIsVisible prop is true", () => {
    render(<PublicRoomBar {...defaultProps} barIsVisible />);

    const container = screen
      .getByText("Test Header")
      .closest("div[class*='container']");
    expect(container?.className).toContain("barVisible");
  });

  it("renders header as div when headerText is not a string", () => {
    const customHeader = <span>Custom Header</span>;
    render(<PublicRoomBar {...defaultProps} headerText={customHeader} />);

    const headerContainer = screen.getByText("Custom Header").closest("div");
    expect(headerContainer).toBeInTheDocument();
  });

  it("renders body as div when bodyText is not a string", () => {
    const customBody = <span>Custom Body</span>;
    render(<PublicRoomBar {...defaultProps} bodyText={customBody} />);

    const bodyContainer = screen.getByText("Custom Body").closest("div");
    expect(bodyContainer).toBeInTheDocument();
  });
});
