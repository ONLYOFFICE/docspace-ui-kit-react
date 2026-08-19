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

import { GroupMenuItem } from "./GroupMenuItem";

const mockItem = {
  label: "Menu Item",
  disabled: false,
  onClick: vi.fn(),
  iconUrl: "",
  title: "Menu Item Title",
  id: "group-menu-item",
};

const mockItemWithDropDown = {
  ...mockItem,
  withDropDown: true,
  options: [
    {
      key: "option-1",
      label: "Option 1",
      onClick: () => {},
    },
    {
      key: "option-2",
      label: "Option 2",
      onClick: () => {},
    },
  ],
};

vi.mock("@docspace/ui-kit/components/drop-down", () => ({
  __esModule: true,
  DropDown: () => <div data-testid="dropdown" />,
}));

describe("<GroupMenuItem />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders without errors", () => {
    render(<GroupMenuItem item={mockItem} />);

    expect(screen.getByTestId("group-menu-item")).toBeInTheDocument();
  });

  it("renders nothing if item is disabled", () => {
    render(<GroupMenuItem item={{ ...mockItem, disabled: true }} />);

    expect(screen.queryByTestId("group-menu-item")).not.toBeInTheDocument();
  });

  it("renders dropdown if item has withDropDown: true", () => {
    render(<GroupMenuItem item={mockItemWithDropDown} />);

    expect(screen.getByTestId("dropdown")).toBeInTheDocument();
  });

  it("calls item's onClick when button is clicked", async () => {
    render(<GroupMenuItem item={mockItem} />);

    const button = screen.getByTestId("group-menu-item-button");

    await userEvent.click(button);

    expect(mockItem.onClick).toHaveBeenCalled();
  });

  it("doesn't call item's onClick when button is clicked and isBlocked passed", async () => {
    render(<GroupMenuItem item={mockItem} isBlocked />);

    const button = screen.getByTestId("group-menu-item-button");

    await userEvent.click(button);

    expect(mockItem.onClick).not.toHaveBeenCalled();
  });
});
