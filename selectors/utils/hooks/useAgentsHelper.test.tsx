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

const setup = (props: Partial<Parameters<typeof useAgentsHelper>[0]> = {}) =>
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
        ...props,
      }),
    }),
    { wrapper },
  );

const agent = (id: number, security: Record<string, boolean>) => ({
  id,
  title: `agent${id}`,
  security,
});

const loadAgents = async (disableBySecurity: string) => {
  mocks.request.mockResolvedValueOnce({
    response: {
      folders: [
        agent(1, { Read: true, UseChat: true }),
        agent(2, { Read: true, UseChat: false }),
      ],
      total: 2,
      count: 2,
      current: {},
      pathParts: [],
    },
  });

  const setItems = vi.fn();
  const { result } = setup({ setItems, disableBySecurity });

  await act(async () => {
    await result.current.agents.getAgentList(0);
  });

  const items = setItems.mock.calls[0][0] as {
    id: number;
    isDisabled?: boolean;
  }[];
  return Object.fromEntries(items.map((i) => [i.id, !!i.isDisabled]));
};

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

  it("keeps agents open for a file-only right such as AskAi", async () => {
    // The chat attach picker gates files by AskAi; folders never carry it.
    expect(await loadAgents("AskAi")).toEqual({ 1: false, 2: false });
  });

  it("disables agents that are denied an agent-level right", async () => {
    expect(await loadAgents("UseChat")).toEqual({ 1: false, 2: true });
  });

  describe("New agent item", () => {
    const loadPage = async (
      sIndex: number,
      props: Partial<Parameters<typeof useAgentsHelper>[0]>,
      canCreate = true,
    ) => {
      mocks.request.mockResolvedValue({
        response: {
          folders: [agent(1, { Read: true })],
          total: 1,
          count: 1,
          current: { security: { Create: canCreate } },
          pathParts: [],
        },
      });

      const setItems = vi.fn();
      const setTotal = vi.fn();
      const { result } = setup({ setItems, setTotal, ...props });

      await act(async () => {
        await result.current.agents.getAgentList(0);
      });
      if (sIndex > 0) {
        await act(async () => {
          await result.current.agents.getAgentList(sIndex);
        });
      }

      return { setItems, setTotal };
    };

    it("leads the list and opens the host's create dialog", async () => {
      const onCreateAIAgent = vi.fn();
      const { setItems, setTotal } = await loadPage(0, { onCreateAIAgent });

      const [first, second] = setItems.mock.calls[0][0];
      expect(first).toMatchObject({
        isCreateNewItem: true,
        label: "New agent",
      });
      expect(second).toMatchObject({ id: 1 });
      expect(setTotal).toHaveBeenLastCalledWith(2);

      first.onCreateClick();
      expect(onCreateAIAgent).toHaveBeenCalledOnce();
    });

    it("is absent without a create callback", async () => {
      const { setItems } = await loadPage(0, {});

      expect(setItems.mock.calls[0][0][0]).toMatchObject({ id: 1 });
    });

    it("is absent when the user may not create agents", async () => {
      const { setItems } = await loadPage(
        0,
        { onCreateAIAgent: vi.fn() },
        false,
      );

      expect(setItems.mock.calls[0][0][0]).toMatchObject({ id: 1 });
    });

    it("sits below Recent and Favorites, all of them left out of the offset", async () => {
      const folder = (id: number) => ({ id, title: `f${id}` });
      const props = {
        onCreateAIAgent: vi.fn(),
        withRecentTreeFolder: true,
        withFavoritesTreeFolder: true,
        recentFolder: folder(100),
        favoritesFolder: folder(101),
      };
      const { setItems, setTotal } = await loadPage(0, props);

      expect(
        setItems.mock.calls[0][0].map((i: { id: unknown }) => i.id),
      ).toEqual([
        "special-recent",
        "special-favorites",
        expect.anything(),
        "create-agent-item",
        1,
      ]);
      // 1 agent + Recent, Favorites, separator and "New agent".
      expect(setTotal).toHaveBeenLastCalledWith(5);

      mocks.request.mockClear();
      await loadPage(104, props);

      // Row 104 on screen is server row 100, the first of page 1.
      expect(mocks.request.mock.calls[1][0]).toContain("page=1&");
    });

    it("is left out of the next page's offset", async () => {
      await loadPage(101, { onCreateAIAgent: vi.fn() });

      // Row 101 on screen is server row 100, the first of page 1.
      expect(mocks.request.mock.calls[1][0]).toContain("page=1&");
    });
  });
});
