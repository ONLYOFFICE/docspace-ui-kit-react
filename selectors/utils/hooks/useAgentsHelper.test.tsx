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
