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
import { LinkWithDropdown } from "./LinkWithDropdown";
import styles from "./LinkWithDropdown.module.scss";

const mockData = [
  {
    key: "key1",
    label: "Button 1",
    onClick: vi.fn(),
  },
  {
    key: "key2",
    label: "Button 2",
    onClick: vi.fn(),
  },
  {
    key: "key3",
    isSeparator: true,
  },
  {
    key: "key4",
    label: "Button 3",
    onClick: vi.fn(),
  },
];

describe("LinkWithDropdown", () => {
  it("renders without error", () => {
    render(
      <LinkWithDropdown isBold data={[]}>
        Link with dropdown
      </LinkWithDropdown>,
    );

    const button = screen.getByRole("button", { name: "Link with dropdown" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-haspopup", "true");
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("renders with dropdown items", () => {
    render(
      <LinkWithDropdown isBold data={mockData} id="test-dropdown">
        Link with dropdown
      </LinkWithDropdown>,
    );

    const trigger = screen.getByRole("button", { name: "Link with dropdown" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    // Open dropdown
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    // Check dropdown container
    const dropdown = screen.getByTestId("dropdown");
    expect(dropdown).toBeInTheDocument();
    expect(dropdown).toHaveAttribute("role", "listbox");

    // Check if dropdown items are rendered
    const items = screen.getAllByTestId((testId) =>
      testId.startsWith("link_with_drop_down_"),
    );
    expect(items).toHaveLength(4); // Including separator

    // Verify menu items text content (excluding separator)
    expect(items[0]).toHaveTextContent("Button 1");
    expect(items[1]).toHaveTextContent("Button 2");
    expect(items[3]).toHaveTextContent("Button 3");

    // Verify menu item structure
    items.forEach((item) => {
      expect(item).toHaveClass(styles.dropDownItem);
    });

    // Verify separator - check that the separator is present in the DOM
    const separator = screen.getByRole("separator");
    expect(separator).toBeInTheDocument();
  });

  it("handles click events on dropdown items", () => {
    render(
      <LinkWithDropdown isBold data={mockData}>
        Link with dropdown
      </LinkWithDropdown>,
    );

    // Open dropdown
    const trigger = screen.getByRole("button", { name: "Link with dropdown" });
    fireEvent.click(trigger);

    // Click first button
    const firstMenuItem = screen.getByText("Button 1");
    fireEvent.click(firstMenuItem);

    // Check that the onClick handler was called
    expect(mockData[0].onClick).toHaveBeenCalled();

    // Check that the dropdown closes after clicking
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("renders with custom styles", () => {
    render(
      <LinkWithDropdown
        isBold
        data={mockData}
        color="red"
        fontSize="16px"
        isSemitransparent
      >
        Link with dropdown
      </LinkWithDropdown>,
    );

    const button = screen.getByRole("button", { name: "Link with dropdown" });
    expect(button.style.color).toBe("red");
  });

  it("handles disabled state", () => {
    render(
      <LinkWithDropdown isBold data={mockData} isDisabled>
        Link with dropdown
      </LinkWithDropdown>,
    );

    const button = screen.getByRole("button", { name: "Link with dropdown" });
    expect(button).toHaveAttribute("aria-disabled", "true");
  });

  it("handles text overflow", () => {
    const title = "Full text of the dropdown";
    render(
      <LinkWithDropdown isBold data={mockData} isTextOverflow title={title}>
        Link with dropdown
      </LinkWithDropdown>,
    );

    const textElement = screen.getByText("Link with dropdown");
    expect(textElement).toHaveClass(styles.textOverflow);
    expect(textElement).toHaveAttribute("title", title);
  });
});
