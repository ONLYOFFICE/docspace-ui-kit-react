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


import React, { use } from "react";
import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { LoadersContext, LoadersContextProvider } from "../contexts/Loaders";
import useAgentsHelper from "./useAgentsHelper";

const mocks = vi.hoisted(() => {
  const request = vi.fn();

  // Kept stable across renders: the helper memoizes getAgentList on the api
  // object, and a fresh one every render would refetch in a loop.
  return { request, api: { apiClient: { request } } };
});

vi.mock("../../../providers/api/ApiProvider", () => ({
  useApi: () => mocks.api,
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <LoadersContextProvider>{children}</LoadersContextProvider>
);

const setup = () =>
  renderHook(
    () => ({
      loaders: use(LoadersContext),
      agents: useAgentsHelper({
        isInit: false,
        setIsInit: vi.fn(),
        setHasNextPage: vi.fn(),
        setTotal: vi.fn(),
        setItems: vi.fn(),
        setBreadCrumbs: vi.fn(),
        setIsRoot: vi.fn(),
        subscribe: vi.fn(),
      }),
    }),
    { wrapper },
  );

describe("useAgentsHelper", () => {
  beforeEach(() => {
    mocks.request.mockReset();
  });

  it("ends the full load when the request fails", async () => {
    mocks.request.mockRejectedValue(new Error("request failed"));

    const { result } = setup();

    expect(result.current.loaders.isFullLoadActive).toBe(true);
    expect(result.current.loaders.showBodyLoader).toBe(true);

    await act(async () => {
      await result.current.agents.getAgentList(0);
    });

    // Otherwise the skeleton owns the screen forever, hideSectionLoader stays
    // a no-op and setIsDataReady never fires for the caller.
    expect(result.current.loaders.isFullLoadActive).toBe(false);
    expect(result.current.loaders.isContentLoading).toBe(false);

    await waitFor(() =>
      expect(result.current.loaders.showBodyLoader).toBe(false),
    );
    expect(result.current.loaders.showBreadCrumbsLoader).toBe(false);
  });

  it("releases the request lock so a retry can run", async () => {
    mocks.request.mockRejectedValueOnce(new Error("request failed"));

    const { result } = setup();

    await act(async () => {
      await result.current.agents.getAgentList(0);
    });

    mocks.request.mockResolvedValueOnce({
      folders: [],
      total: 0,
      count: 0,
      current: {},
    });

    await act(async () => {
      await result.current.agents.getAgentList(0);
    });

    expect(mocks.request).toHaveBeenCalledTimes(2);
  });
});
