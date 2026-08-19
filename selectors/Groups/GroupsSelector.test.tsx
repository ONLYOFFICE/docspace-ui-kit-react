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
import { act, render, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { TSelectorItem } from "../../components/selector";

/** The subset of the Selector contract these tests observe. */
type CapturedProps = {
  items: TSelectorItem[];
  totalItems: number;
  hasNextPage: boolean;
  isLoading: boolean;
  isContentLoading?: boolean;
  disableFirstFetch?: boolean;
  loadNextPage: (startIndex: number) => void;
  onSearch: (value: string, callback?: () => void) => void;
  onClearSearch: (callback?: () => void) => void;
};

const mocks = vi.hoisted(() => {
  const getGroups = vi.fn();

  return {
    getGroups,
    // Kept stable across renders: GroupsSelector memoizes its page loader on
    // the api object, and a fresh one every render would refetch in a loop.
    api: { groupApi: { getGroups } },
    lastProps: null as unknown as CapturedProps,
  };
});

vi.mock("../../providers/api/ApiProvider", () => ({
  useApi: () => mocks.api,
}));

vi.mock("../../context/ThemeContext", () => ({
  useTheme: () => ({ isBase: true }),
}));

// The real Selector is virtualized and measures the DOM, which jsdom reports
// as zero-height, so the rendered rows cannot be asserted on. It is replaced
// with a stub that records the props it receives and reproduces the only
// Selector behaviour these tests depend on: the first page is requested from
// an effect keyed on `loadNextPage`, so a search - which rebuilds that
// callback - re-runs it with startIndex 0 (see Selector.tsx).
vi.mock("../../components/selector", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("../../components/selector")>();

  const SelectorStub = (props: CapturedProps) => {
    mocks.lastProps = props;

    const { loadNextPage, disableFirstFetch } = props;

    React.useEffect(() => {
      if (disableFirstFetch) return;
      loadNextPage(0);
    }, [loadNextPage, disableFirstFetch]);

    return null;
  };

  return { ...actual, Selector: SelectorStub };
});

const { default: GroupsSelector } = await import("./index");

const groupsPage = (names: string[], total = names.length) => ({
  data: {
    response: names.map((name) => ({ id: name, name })),
    count: total,
  },
});

const labels = () => mocks.lastProps.items.map((item) => item.label);

const renderSelector = () => render(<GroupsSelector onSubmit={vi.fn()} />);

describe("<GroupsSelector />", () => {
  beforeEach(() => {
    mocks.getGroups.mockReset();
    // Any request beyond the ones a test queues explicitly is a bug in the
    // component, so make it observable instead of throwing on `res.data`.
    mocks.getGroups.mockResolvedValue(groupsPage([]));
  });

  it("replaces the list when a search runs instead of appending to it", async () => {
    mocks.getGroups.mockResolvedValueOnce(groupsPage(["Alpha", "Beta"]));

    renderSelector();
    await waitFor(() => expect(labels()).toEqual(["Alpha", "Beta"]));

    mocks.getGroups.mockResolvedValueOnce(groupsPage(["Beta"]));
    act(() => mocks.lastProps.onSearch("Beta"));

    await waitFor(() => expect(mocks.getGroups).toHaveBeenCalledTimes(2));
    await waitFor(() => expect(labels()).toEqual(["Beta"]));
  });

  it("replaces the list when the search is cleared", async () => {
    mocks.getGroups.mockResolvedValueOnce(groupsPage(["Alpha", "Beta"]));

    renderSelector();
    await waitFor(() => expect(labels()).toEqual(["Alpha", "Beta"]));

    mocks.getGroups.mockResolvedValueOnce(groupsPage(["Beta"]));
    act(() => mocks.lastProps.onSearch("Beta"));
    await waitFor(() => expect(labels()).toEqual(["Beta"]));

    mocks.getGroups.mockResolvedValueOnce(groupsPage(["Alpha", "Beta"]));
    act(() => mocks.lastProps.onClearSearch());

    await waitFor(() => expect(mocks.getGroups).toHaveBeenCalledTimes(3));
    await waitFor(() => expect(labels()).toEqual(["Alpha", "Beta"]));
  });

  it("recomputes hasNextPage from the searched page, not the merged list", async () => {
    mocks.getGroups.mockResolvedValueOnce(groupsPage(["Alpha", "Beta"], 50));

    renderSelector();
    await waitFor(() => expect(mocks.lastProps.hasNextPage).toBe(true));

    mocks.getGroups.mockResolvedValueOnce(groupsPage(["Beta"], 1));
    act(() => mocks.lastProps.onSearch("Beta"));

    await waitFor(() => expect(labels()).toEqual(["Beta"]));
    expect(mocks.lastProps.hasNextPage).toBe(false);
  });

  it("dims the current list during a search instead of showing the skeleton", async () => {
    mocks.getGroups.mockResolvedValueOnce(groupsPage(["Alpha", "Beta"]));

    renderSelector();
    await waitFor(() => expect(labels()).toEqual(["Alpha", "Beta"]));

    let resolveSearch: (value: unknown) => void = () => {};
    mocks.getGroups.mockReturnValueOnce(
      new Promise((resolve) => {
        resolveSearch = resolve;
      }),
    );

    act(() => mocks.lastProps.onSearch("Beta"));

    await waitFor(() => expect(mocks.lastProps.isContentLoading).toBe(true));
    expect(mocks.lastProps.isLoading).toBe(false);

    resolveSearch(groupsPage(["Beta"]));

    await waitFor(() => expect(mocks.lastProps.isContentLoading).toBe(false));
    expect(labels()).toEqual(["Beta"]);
  });
});
