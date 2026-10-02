import React, { use } from "react";
import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { RoomsType } from "../../../enums";
import type { TSelectorItem } from "../../../components/selector";
import { LoadersContext, LoadersContextProvider } from "../contexts/Loaders";
import type { UseRoomsHelperProps } from "../types";
import useRoomsHelper from "./useRoomsHelper";

const mocks = vi.hoisted(() => {
  const getRoomsFolder = vi.fn();

  // Kept stable across renders: the helper memoizes getRoomList on the api
  // object, and a fresh one every render would refetch in a loop.
  return { getRoomsFolder, api: { roomsApi: { getRoomsFolder } } };
});

// useRoomsHelper reads useApi through the barrel, useInputItemHelper through
// the module itself - both have to be stubbed.
vi.mock("../../../providers/api", () => ({ useApi: () => mocks.api }));
vi.mock("../../../providers/api/ApiProvider", () => ({
  useApi: () => mocks.api,
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <LoadersContextProvider>{children}</LoadersContextProvider>
);

const setup = (props: Partial<UseRoomsHelperProps> = {}) =>
  renderHook(
    () => ({
      loaders: use(LoadersContext),
      rooms: useRoomsHelper({
        isRoomsOnly: true,
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

describe("useRoomsHelper", () => {
  beforeEach(() => {
    mocks.getRoomsFolder.mockReset();
  });

  it("ends the full load when the request fails", async () => {
    mocks.getRoomsFolder.mockRejectedValue(new Error("request failed"));

    const { result } = setup();

    expect(result.current.loaders.isFullLoadActive).toBe(true);
    expect(result.current.loaders.showBodyLoader).toBe(true);

    await act(async () => {
      await result.current.rooms.getRoomList(0);
    });

    // Otherwise the skeleton owns the screen forever, hideSectionLoader stays
    // a no-op and FilesSelector's navigatingRef never unlocks navigation.
    expect(result.current.loaders.isFullLoadActive).toBe(false);
    expect(result.current.loaders.isContentLoading).toBe(false);

    await waitFor(() =>
      expect(result.current.loaders.showBodyLoader).toBe(false),
    );
    expect(result.current.loaders.showBreadCrumbsLoader).toBe(false);
  });

  it("releases the request lock so a retry can run", async () => {
    mocks.getRoomsFolder.mockRejectedValueOnce(new Error("request failed"));

    const { result } = setup();

    await act(async () => {
      await result.current.rooms.getRoomList(0);
    });

    mocks.getRoomsFolder.mockResolvedValueOnce({
      data: { response: { folders: [], total: 0, count: 0, current: {} } },
    });

    await act(async () => {
      await result.current.rooms.getRoomList(0);
    });

    expect(mocks.getRoomsFolder).toHaveBeenCalledTimes(2);
  });

  it("omits the form filling room from the create-room type dropdown", async () => {
    mocks.getRoomsFolder.mockResolvedValue({
      data: {
        response: {
          folders: [],
          total: 0,
          count: 0,
          current: { id: 1, title: "Rooms", security: { Create: true } },
        },
      },
    });

    const setItems = vi.fn();

    const { result } = setup({ withCreate: true, setItems });

    await act(async () => {
      await result.current.rooms.getRoomList(0);
    });

    const items = setItems.mock.calls[0][0] as TSelectorItem[];
    const createItem = items.find((item) => item.id === "create-room-item");

    const roomTypeKeys = (
      createItem?.dropDownItems as React.ReactElement[]
    ).map((element) => element.key);

    // Form filling rooms live in the Forms section - the Rooms section must
    // not offer them, so a form restored into a new room cannot land in one.
    expect(roomTypeKeys).not.toContain(String(RoomsType.FormRoom));
    expect(roomTypeKeys).toContain(String(RoomsType.CustomRoom));
  });
});
