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

import { describe, expect, it, afterEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { Aside } from ".";

describe("Aside Component", () => {
  const mockOnClose = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders without error when visible", () => {
    render(
      <Aside visible onClose={mockOnClose}>
        test content
      </Aside>,
    );

    expect(screen.getByTestId("aside")).toBeInTheDocument();
    expect(screen.getByText("test content")).toBeInTheDocument();
  });

  it("renders with custom styling props", () => {
    render(
      <Aside
        visible
        onClose={mockOnClose}
        scale
        zIndex={500}
        className="custom-class"
      >
        test content
      </Aside>,
    );

    const aside = screen.getByTestId("aside");
    expect(aside).toHaveClass("custom-class");
    expect(aside).toHaveStyle({ zIndex: 500 });
  });

  it("renders without header when withoutHeader is true", () => {
    render(
      <Aside visible onClose={mockOnClose} withoutHeader>
        test content
      </Aside>,
    );

    expect(screen.queryByTestId("aside-header")).not.toBeInTheDocument();
  });

  it("renders with scrollbar when content overflows", () => {
    const longContent = "a".repeat(1000);
    render(
      <Aside visible onClose={mockOnClose}>
        {longContent}
      </Aside>,
    );

    expect(screen.getByTestId("scrollbar")).toBeInTheDocument();
  });

  it("renders with withoutBodyScroll prop", () => {
    render(
      <Aside visible onClose={mockOnClose} withoutBodyScroll>
        test content
      </Aside>,
    );

    const aside = screen.getByTestId("aside");
    expect(aside).toBeInTheDocument();
  });
});
