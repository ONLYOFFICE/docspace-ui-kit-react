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
import { render, screen, fireEvent } from "@testing-library/react";

import type { TOption } from "../combobox";

import { Paging } from "./Paging";

const mockPageItems: TOption[] = [
  { label: "1", key: 1 },
  { label: "2", key: 2 },
];

const mockCountItems: TOption[] = [
  { label: "10", key: 10 },
  { label: "20", key: 20 },
];

describe("Paging", () => {
  it("renders with basic props", () => {
    render(
      <Paging
        previousLabel="Previous"
        nextLabel="Next"
        previousAction={vi.fn()}
        nextAction={vi.fn()}
        pageItems={mockPageItems}
        countItems={mockCountItems}
        selectedPageItem={mockPageItems[0]}
        selectedCountItem={mockCountItems[0]}
        onSelectPage={vi.fn()}
        onSelectCount={vi.fn()}
      />,
    );

    expect(screen.getByText("Previous")).toBeInTheDocument();
    expect(screen.getByText("Next")).toBeInTheDocument();
    expect(screen.getByTestId("paging")).toBeInTheDocument();
  });

  it("calls previousAction and nextAction when buttons clicked", () => {
    const prev = vi.fn();
    const next = vi.fn();

    render(
      <Paging
        previousLabel="Prev"
        nextLabel="Next"
        previousAction={prev}
        nextAction={next}
        pageItems={mockPageItems}
        countItems={mockCountItems}
        selectedPageItem={mockPageItems[0]}
        selectedCountItem={mockCountItems[0]}
      />,
    );

    fireEvent.click(screen.getByText("Prev"));
    fireEvent.click(screen.getByText("Next"));

    expect(prev).toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it("disables buttons based on props", () => {
    render(
      <Paging
        previousLabel="Prev"
        nextLabel="Next"
        previousAction={vi.fn()}
        nextAction={vi.fn()}
        disablePrevious
        disableNext
        pageItems={mockPageItems}
        countItems={mockCountItems}
        selectedPageItem={mockPageItems[0]}
        selectedCountItem={mockCountItems[0]}
      />,
    );

    const prevButton = screen.getByRole("button", { name: "Prev" });
    const nextButton = screen.getByRole("button", { name: "Next" });

    expect(prevButton).toBeDisabled();
    expect(nextButton).toBeDisabled();
  });

  it("does not render count selector if showCountItem is false", () => {
    render(
      <Paging
        previousLabel="Prev"
        nextLabel="Next"
        previousAction={vi.fn()}
        nextAction={vi.fn()}
        pageItems={mockPageItems}
        countItems={mockCountItems}
        showCountItem={false}
        selectedPageItem={mockPageItems[0]}
        selectedCountItem={mockCountItems[0]}
      />,
    );

    expect(screen.queryByText("10")).not.toBeInTheDocument();
    expect(screen.queryByText("20")).not.toBeInTheDocument();
  });

  it("calls onSelectPage and onSelectCount", () => {
    const onSelectPage = vi.fn();
    const onSelectCount = vi.fn();

    render(
      <Paging
        previousLabel="Prev"
        nextLabel="Next"
        previousAction={vi.fn()}
        nextAction={vi.fn()}
        pageItems={mockPageItems}
        countItems={mockCountItems}
        onSelectPage={onSelectPage}
        onSelectCount={onSelectCount}
        selectedPageItem={mockPageItems[0]}
        selectedCountItem={mockCountItems[0]}
      />,
    );

    expect(onSelectPage).not.toHaveBeenCalled();
    expect(onSelectCount).not.toHaveBeenCalled();
  });
});
