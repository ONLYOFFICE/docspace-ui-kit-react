import type { FolderDtoInteger } from "@onlyoffice/docspace-api-sdk";
import { RoomType } from "@onlyoffice/docspace-api-sdk";
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { TSelectorItem } from "../../../components/selector";
import { convertRoomsToItems } from "..";
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
// the list ends with.
const create = async (
  items: TSelectorItem[],
  id: number,
  withCreate: boolean,
) => {
  let list = items;
  const setItems = vi.fn((update) => {
    list = typeof update === "function" ? update(list) : update;
  });

  const { result } = renderHook(() =>
    useSocketHelper({
      setItems,
      setTotal: vi.fn(),
      disabledItems: [],
      withCreate,
    }),
  );

  act(() => result.current.subscribe(AGENTS_ROOT));

  mocks.getRoomInfo.mockResolvedValue({ data: { response: agent(id) } });

  await act(async () => {
    for (const h of mocks.handlers)
      h({ cmd: "create", type: "folder", data: JSON.stringify(agent(id)) });
  });

  return list.map((i) => i.id);
};

describe("useSocketHelper create", () => {
  beforeEach(() => {
    mocks.handlers.length = 0;
    mocks.getRoomInfo.mockReset();
  });

  it.each([true, false])(
    "puts a dialog-created agent below the create item, keeping the rest (withCreate %s)",
    async (withCreate) => {
      expect(
        await create([createItem, listed(1), listed(2)], 3, withCreate),
      ).toEqual(["create-agent-item", 3, 1, 2]);
    },
  );

  it("fills an empty list with the agent alone", async () => {
    expect(await create([createItem], 3, true)).toEqual([
      "create-agent-item",
      3,
    ]);
  });

  it("puts the folder typed into the input row in that row's place", async () => {
    expect(await create([createItem, inputItem, listed(1)], 3, true)).toEqual([
      "create-agent-item",
      3,
      1,
    ]);
  });

  it("does not list a folder twice", async () => {
    expect(await create([createItem, listed(3), listed(1)], 3, true)).toEqual([
      "create-agent-item",
      3,
      1,
    ]);
  });

  it("ignores a folder created somewhere else", async () => {
    mocks.getRoomInfo.mockResolvedValue({ data: { response: agent(3) } });

    const { result } = renderHook(() =>
      useSocketHelper({
        setItems: vi.fn(),
        setTotal: vi.fn(),
        disabledItems: [],
        withCreate: true,
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
