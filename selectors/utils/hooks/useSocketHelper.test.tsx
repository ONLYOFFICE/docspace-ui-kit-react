import type { FolderDtoInteger } from "@onlyoffice/docspace-api-sdk";
import { RoomType } from "@onlyoffice/docspace-api-sdk";
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { TSelectorItem } from "../../../components/selector";
import { buildSpecialFolderItems, convertRoomsToItems } from "..";
import useSocketHelper from "./useSocketHelper";

const mocks = vi.hoisted(() => {
  const handlers: ((opt?: unknown) => void)[] = [];
  const getRoomInfo = vi.fn();

  return {
    handlers,
    getRoomInfo,
    socket: {
      on: (_: string, h: (opt?: unknown) => void) => handlers.push(h),
      off: vi.fn(),
      emit: vi.fn(),
      socketSubscribers: new Set<string>(),
    },
    // Stable across renders, as the helper memoizes on the api objects.
    api: { filesApi: {}, foldersApi: {}, roomsApi: { getRoomInfo } },
  };
});

vi.mock("../../../utils/socket", async (importOriginal) => ({
  ...(await importOriginal<object>()),
  default: mocks.socket,
}));

vi.mock("../../../providers/api", () => ({
  useApi: () => mocks.api,
}));

const AGENTS_ROOT = 10;

const agent = (id: number): FolderDtoInteger => ({
  id,
  title: `agent${id}`,
  parentId: AGENTS_ROOT,
  roomType: RoomType.AiRoom,
  security: {},
});

const createItem: TSelectorItem = {
  id: "create-agent-item",
  label: "New agent",
  isCreateNewItem: true,
  onBackClick: () => {},
};

const inputItem: TSelectorItem = {
  id: "new-folder-input",
  label: "",
  isInputItem: true,
  defaultInputValue: "",
  icon: "",
  onAcceptInput: () => {},
  onCancelInput: () => {},
};

// Listed the way the agents helper lists them.
const listed = (id: number) => convertRoomsToItems([agent(id)])[0];

// Runs the socket "create" of agent `id` against `items` and returns the ids
// the list ends with, and the total it ends with from `total`.
const create = async (items: TSelectorItem[], id: number, total = 0) => {
  let list = items;
  let count = total;
  const setItems = vi.fn((update) => {
    list = typeof update === "function" ? update(list) : update;
  });
  const setTotal = vi.fn((update) => {
    count = typeof update === "function" ? update(count) : update;
  });

  const { result } = renderHook(() =>
    useSocketHelper({ setItems, setTotal, disabledItems: [] }),
  );

  act(() => result.current.subscribe(AGENTS_ROOT));

  mocks.getRoomInfo.mockResolvedValue({ data: { response: agent(id) } });

  await act(async () => {
    for (const h of mocks.handlers)
      h({ cmd: "create", type: "folder", data: JSON.stringify(agent(id)) });
  });

  return { ids: list.map((i) => i.id), total: count };
};

const folderDto = (id: number): FolderDtoInteger => ({ id, title: `f${id}` });

// Recent, Favorites and their separator, as the helpers build them.
const specialRows = () =>
  buildSpecialFolderItems({
    section: "agents",
    recentFolder: folderDto(100),
    favoritesFolder: folderDto(101),
    withRecent: true,
    withFavorites: true,
    withSeparator: true,
    t: (key) => key,
  });

describe("useSocketHelper create", () => {
  beforeEach(() => {
    mocks.handlers.length = 0;
    mocks.getRoomInfo.mockReset();
  });

  it("puts a dialog-created agent below the create item, keeping the rest", async () => {
    expect(await create([createItem, listed(1), listed(2)], 3, 3)).toEqual({
      ids: ["create-agent-item", 3, 1, 2],
      total: 4,
    });
  });

  it("fills an empty list with the agent alone", async () => {
    expect((await create([createItem], 3)).ids).toEqual([
      "create-agent-item",
      3,
    ]);
  });

  it("keeps Recent, Favorites and the create item above a new agent", async () => {
    const rows = [...specialRows(), createItem];
    const { ids } = await create([...rows, listed(1)], 3);

    expect(ids).toEqual([...rows.map((r) => r.id), 3, 1]);
  });

  it("never takes the place of an open input row", async () => {
    // The row may be another folder still being typed; its own reconcile
    // drops it once its folder is listed.
    expect((await create([createItem, inputItem, listed(1)], 3)).ids).toEqual([
      "create-agent-item",
      3,
      "new-folder-input",
      1,
    ]);
  });

  it("updates a folder already listed in place rather than twice", async () => {
    expect((await create([createItem, listed(1), listed(3)], 3)).ids).toEqual([
      "create-agent-item",
      1,
      3,
    ]);
  });

  it("ignores a folder created somewhere else", async () => {
    mocks.getRoomInfo.mockResolvedValue({ data: { response: agent(3) } });

    const { result } = renderHook(() =>
      useSocketHelper({
        setItems: vi.fn(),
        setTotal: vi.fn(),
        disabledItems: [],
      }),
    );
    act(() => result.current.subscribe(AGENTS_ROOT));

    await act(async () => {
      for (const h of mocks.handlers)
        h({
          cmd: "create",
          type: "folder",
          data: JSON.stringify({ id: 4, title: "Knowledge", parentId: 3 }),
        });
    });

    expect(mocks.getRoomInfo).not.toHaveBeenCalled();
  });
});
