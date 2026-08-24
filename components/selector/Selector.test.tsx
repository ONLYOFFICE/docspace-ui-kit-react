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

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Selector } from "./Selector";
import type { SelectorProps, TSelectorItem } from "./Selector.types";

const items = [
  { id: "1", label: "First item" },
  { id: "2", label: "Second item" },
] as TSelectorItem[];

const baseProps = {
  items,
  totalItems: items.length,
  hasNextPage: false,
  isNextPageLoading: false,
  isLoading: false,
  loadNextPage: vi.fn(async () => {}),
  disableFirstFetch: true,
  onSelect: vi.fn(),
  onSubmit: vi.fn(),
  submitButtonLabel: "Select",
  emptyScreenImage: <div />,
  emptyScreenHeader: "Empty header",
  emptyScreenDescription: "Empty description",
  searchEmptyScreenImage: <div />,
  searchEmptyScreenHeader: "Search empty header",
  searchEmptyScreenDescription: "Search empty description",
  rowLoader: <div data-testid="row-loader" />,
  // jsdom reports zero body height; the SSR branch renders items directly
  isSSR: true,
};

const makeProps = (override: object = {}): SelectorProps =>
  ({ ...baseProps, ...override }) as unknown as SelectorProps;

const renderSelector = (override: object = {}) =>
  render(<Selector {...makeProps(override)} />);

describe("<Selector /> loading modes", () => {
  it("renders the skeleton loader during the initial load", () => {
    renderSelector({ isLoading: true });

    expect(screen.getByTestId("row-loader")).toBeInTheDocument();
    expect(screen.queryByText("First item")).not.toBeInTheDocument();
  });

  it("renders items when settled", () => {
    renderSelector();

    expect(screen.getByText("First item")).toBeInTheDocument();
    expect(screen.getByText("Second item")).toBeInTheDocument();
    expect(document.querySelector(".bodyContentDimmed")).toBeNull();
  });

  it("renders the empty screen when there are no items", () => {
    renderSelector({ items: [], totalItems: 0 });

    expect(screen.getByText("Empty header")).toBeInTheDocument();
  });

  it("keeps previous items visible and dimmed during a content refresh", () => {
    const { rerender } = renderSelector();

    expect(screen.getByText("First item")).toBeInTheDocument();

    // refresh empties items while the request is running; dimming wins
    // over the skeleton even when isLoading is set alongside
    rerender(
      <Selector
        {...makeProps({
          items: [],
          totalItems: 0,
          isLoading: true,
          isContentLoading: true,
        })}
      />,
    );

    expect(screen.getByText("First item")).toBeInTheDocument();
    expect(document.querySelector(".bodyContentDimmed")).not.toBeNull();
    expect(screen.queryByTestId("row-loader")).not.toBeInTheDocument();
  });

  it("keeps the empty screen dimmed when refreshing from empty results", () => {
    const { rerender } = renderSelector({ items: [], totalItems: 0 });

    expect(screen.getByText("Empty header")).toBeInTheDocument();

    rerender(
      <Selector
        {...makeProps({ items: [], totalItems: 0, isContentLoading: true })}
      />,
    );

    expect(screen.getByText("Empty header")).toBeInTheDocument();
    expect(document.querySelector(".dimmedEmptyScreen")).not.toBeNull();
  });

  it("shows fresh items once the refresh completes", () => {
    const { rerender } = renderSelector();

    rerender(
      <Selector
        {...makeProps({
          items: [],
          totalItems: 0,
          isLoading: true,
          isContentLoading: true,
        })}
      />,
    );

    const freshItems = [{ id: "3", label: "Third item" }] as TSelectorItem[];
    rerender(<Selector {...makeProps({ items: freshItems, totalItems: 1 })} />);

    expect(screen.getByText("Third item")).toBeInTheDocument();
    expect(screen.queryByText("First item")).not.toBeInTheDocument();
    expect(document.querySelector(".bodyContentDimmed")).toBeNull();
  });
});
