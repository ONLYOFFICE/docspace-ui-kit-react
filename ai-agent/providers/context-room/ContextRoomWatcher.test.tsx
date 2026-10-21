"use client";

import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act, render } from "@testing-library/react";

import { ContextRoomProvider } from "./index";

type Selected = null | { cloud: string; room: { id: string; name: string } };

// vi.mock factories are hoisted above every import, so the state they close
// over has to be hoisted with them.
const {
  clouds,
  useCloudsStore,
  getRoomSkillsFolder,
  subscribers,
  listeners,
  socket,
} = vi.hoisted(() => {
  const clouds = {
    selectedContextFolder: null as Selected,
    contextFolders: [] as {
      cloud: string;
      rooms: { id: string; name: string }[];
    }[],
    roomSkills: [] as { id: string }[],
    selectContextFolder: vi.fn(),
    clearContextFolder: vi.fn(),
    fetchRoomSkills: vi.fn(async () => {}),
    fetchContextFolders: vi.fn(async () => {}),
  };
  const useCloudsStore = Object.assign(
    (selector: (s: typeof clouds) => unknown) => selector(clouds),
    { getState: () => clouds },
  );
  const getRoomSkillsFolder = vi.fn();
  const subscribers = new Set<string>();
  const listeners = new Set<(opt?: unknown) => void>();
  const socket = {
    socketSubscribers: subscribers,
    emit: vi.fn((command: string, data: { roomParts: string[] }) => {
      for (const part of data.roomParts) {
        if (command === "subscribe") subscribers.add(part);
        else subscribers.delete(part);
      }
    }),
    on: vi.fn((_event: string, cb: (opt?: unknown) => void) => {
      listeners.add(cb);
    }),
    off: vi.fn((_event: string, cb: (opt?: unknown) => void) => {
      listeners.delete(cb);
    }),
  };
  return {
    clouds,
    useCloudsStore,
    getRoomSkillsFolder,
    subscribers,
    listeners,
    socket,
  };
});

vi.mock("@onlyoffice/ai-chat", () => ({
  useStores: () => ({ useCloudsStore }),
}));

vi.mock("../../../providers/api", () => ({
  useApi: () => ({ aiApi: { getRoomSkillsFolder } }),
}));

vi.mock("../../../utils/socket", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../../utils/socket")>();
  return { ...actual, default: socket };
});

import ContextRoomWatcher from "./ContextRoomWatcher";
import { CONTEXT_ROOM_CLOUD } from "./ContextRoomSync";

const flush = () => act(async () => {});

const emitEvent = (opt: {
  cmd: "create" | "update" | "delete";
  type: "file" | "folder";
  id: number | string;
  data?: Record<string, unknown>;
}) =>
  act(() => {
    for (const cb of listeners) {
      cb({ ...opt, data: opt.data ? JSON.stringify(opt.data) : undefined });
    }
  });

const renderWatcher = (room: { id: string; name: string } | null) =>
  render(
    <ContextRoomProvider room={room}>
      <ContextRoomWatcher />
    </ContextRoomProvider>,
  );

const sales = { id: "12", name: "Sales" };
// An Instructions room is its own skills folder.
const skillsFolder = {
  id: "12",
  roomId: "12",
  roomsRootId: "7",
  hasSkills: true,
};

describe("ContextRoomWatcher", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    clouds.selectedContextFolder = null;
    clouds.contextFolders = [];
    clouds.roomSkills = [{ id: "s1" }];
    subscribers.clear();
    listeners.clear();
    getRoomSkillsFolder.mockResolvedValue(skillsFolder);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("with the current room connected", () => {
    beforeEach(() => {
      clouds.selectedContextFolder = { cloud: CONTEXT_ROOM_CLOUD, room: sales };
    });

    it("listens to the rooms root and the room", async () => {
      renderWatcher(sales);
      await flush();

      expect(getRoomSkillsFolder).toHaveBeenCalledWith("12");
      expect(socket.emit).toHaveBeenCalledWith("subscribe", {
        roomParts: ["DIR-7", "DIR-12"],
        individual: true,
      });
      expect(socket.on).toHaveBeenCalledTimes(1);
    });

    it("re-reads the skills once for a burst of file changes in the room", async () => {
      renderWatcher(sales);
      await flush();

      emitEvent({
        cmd: "create",
        type: "file",
        id: 1,
        data: { folderId: 12, title: "a.md" },
      });
      emitEvent({
        cmd: "update",
        type: "file",
        id: 1,
        data: { folderId: 12, title: "a.md" },
      });
      emitEvent({
        cmd: "delete",
        type: "file",
        id: 2,
        data: { folderId: 12 },
      });
      expect(clouds.fetchRoomSkills).not.toHaveBeenCalled();
      await act(async () => {
        vi.advanceTimersByTime(300);
      });
      expect(clouds.fetchRoomSkills).toHaveBeenCalledTimes(1);
      // The picker lists only rooms with a skill file, so it is re-read too.
      expect(clouds.fetchContextFolders).toHaveBeenCalledTimes(1);
      expect(clouds.clearContextFolder).not.toHaveBeenCalled();
    });

    it("disconnects when the last skill file is gone", async () => {
      renderWatcher(sales);
      await flush();

      clouds.fetchRoomSkills.mockImplementationOnce(async () => {
        clouds.roomSkills = [];
      });
      emitEvent({
        cmd: "delete",
        type: "file",
        id: 1,
        data: { folderId: 12 },
      });
      await act(async () => {
        vi.advanceTimersByTime(300);
      });
      expect(clouds.clearContextFolder).toHaveBeenCalledTimes(1);
    });

    it("ignores files in the room's subfolders", async () => {
      renderWatcher(sales);
      await flush();

      emitEvent({
        cmd: "create",
        type: "file",
        id: 3,
        data: { folderId: 40, title: "plan.md" },
      });
      act(() => {
        vi.advanceTimersByTime(300);
      });
      expect(clouds.fetchRoomSkills).not.toHaveBeenCalled();
    });

    it("takes over the room's new name", async () => {
      renderWatcher(sales);
      await flush();

      emitEvent({
        cmd: "update",
        type: "folder",
        id: 12,
        data: { id: 12, title: "Sales EMEA" },
      });
      expect(clouds.selectContextFolder).toHaveBeenCalledWith(
        CONTEXT_ROOM_CLOUD,
        {
          id: "12",
          name: "Sales EMEA",
        },
      );
    });

    it("disconnects when the room is removed or leaves the user", async () => {
      renderWatcher(sales);
      await flush();

      emitEvent({ cmd: "delete", type: "folder", id: 12 });
      expect(clouds.clearContextFolder).toHaveBeenCalledTimes(1);
    });

    it("disconnects at once when the room is no skills room any more", async () => {
      getRoomSkillsFolder.mockResolvedValue(null);
      renderWatcher(sales);
      await flush();

      expect(clouds.clearContextFolder).toHaveBeenCalledTimes(1);
      expect(socket.emit).not.toHaveBeenCalled();
    });

    it("disconnects at once when the room holds no skill any more", async () => {
      getRoomSkillsFolder.mockResolvedValue({
        ...skillsFolder,
        hasSkills: false,
      });
      renderWatcher(sales);
      await flush();

      expect(clouds.clearContextFolder).toHaveBeenCalledTimes(1);
    });

    it.each([401, 403])(
      "disconnects when the lookup answers %s: the room is gone for this user",
      async (status) => {
        getRoomSkillsFolder.mockRejectedValue(
          Object.assign(new Error(String(status)), { status }),
        );
        renderWatcher(sales);
        await flush();

        expect(clouds.clearContextFolder).toHaveBeenCalledTimes(1);
        expect(socket.emit).not.toHaveBeenCalled();
      },
    );

    it("keeps the connection when the skills lookup fails", async () => {
      getRoomSkillsFolder.mockRejectedValue(
        Object.assign(new Error("503"), { status: 503 }),
      );
      renderWatcher(sales);
      await flush();

      expect(clouds.clearContextFolder).not.toHaveBeenCalled();
      expect(socket.emit).not.toHaveBeenCalled();
    });

    it("leaves the file list's own subscription alone", async () => {
      subscribers.add("DIR-12"); // the file list shows the room
      const view = renderWatcher(sales);
      await flush();

      expect(socket.emit).toHaveBeenCalledWith("subscribe", {
        roomParts: ["DIR-7"],
        individual: true,
      });
      view.unmount();
      expect(socket.emit).toHaveBeenLastCalledWith("unsubscribe", {
        roomParts: ["DIR-7"],
        individual: true,
      });
      expect(subscribers.has("DIR-12")).toBe(true);
    });
  });

  describe("with the current room not connected", () => {
    it("watches the room", async () => {
      getRoomSkillsFolder.mockResolvedValue({
        ...skillsFolder,
        hasSkills: false,
      });
      renderWatcher(sales);
      await flush();

      expect(getRoomSkillsFolder).toHaveBeenCalledWith("12");
      expect(socket.emit).toHaveBeenCalledTimes(1);
      expect(socket.emit).toHaveBeenCalledWith("subscribe", {
        roomParts: ["DIR-12"],
        individual: true,
      });
    });

    it("connects the room when its first skill file lands", async () => {
      getRoomSkillsFolder.mockResolvedValue({
        ...skillsFolder,
        hasSkills: false,
      });
      renderWatcher(sales);
      await flush();

      emitEvent({
        cmd: "create",
        type: "file",
        id: 1,
        data: { folderId: 12, title: "notes.txt", fileExst: ".txt" },
      });
      expect(clouds.selectContextFolder).not.toHaveBeenCalled();

      emitEvent({
        cmd: "create",
        type: "file",
        id: 2,
        data: { folderId: 12, title: "pdf.md", fileExst: ".md" },
      });
      expect(clouds.selectContextFolder).toHaveBeenCalledWith(
        CONTEXT_ROOM_CLOUD,
        sales,
      );
      // The picker gains the room: its list is re-read, debounced.
      await act(async () => {
        vi.advanceTimersByTime(300);
      });
      expect(clouds.fetchContextFolders).toHaveBeenCalledTimes(1);
    });

    it("does not connect a room that is no skills room", async () => {
      getRoomSkillsFolder.mockResolvedValue(null);
      renderWatcher(sales);
      await flush();

      emitEvent({
        cmd: "create",
        type: "file",
        id: 3,
        data: { folderId: 12, title: "skill.md" },
      });
      expect(clouds.selectContextFolder).not.toHaveBeenCalled();
    });
  });

  it("leaves a room the user picked alone when the current room gains a skill", async () => {
    const legal = { id: "30", name: "Legal" };
    clouds.selectedContextFolder = { cloud: CONTEXT_ROOM_CLOUD, room: legal };
    getRoomSkillsFolder.mockImplementation(async (roomId: string) =>
      roomId === "30"
        ? { id: "30", roomId: "30", roomsRootId: "7", hasSkills: true }
        : { ...skillsFolder, hasSkills: false },
    );
    renderWatcher(sales);
    await flush();

    expect(getRoomSkillsFolder).not.toHaveBeenCalledWith("12");
    emitEvent({
      cmd: "create",
      type: "file",
      id: 4,
      data: { folderId: 12, title: "skill.md" },
    });
    expect(clouds.selectContextFolder).not.toHaveBeenCalled();
    expect(clouds.clearContextFolder).not.toHaveBeenCalled();
  });

  it("leaves a room the user let go alone when another skill lands there", async () => {
    // Nothing connected, the room already holds skills: a Disconnect.
    renderWatcher(sales);
    await flush();

    expect(socket.emit).toHaveBeenCalledTimes(1);
    expect(socket.emit).toHaveBeenCalledWith("subscribe", {
      roomParts: ["DIR-12"],
      individual: true,
    });
    emitEvent({
      cmd: "create",
      type: "file",
      id: 5,
      data: { folderId: 12, title: "more.md" },
    });
    expect(clouds.selectContextFolder).not.toHaveBeenCalled();
  });

  it("ignores folders appearing in the current room", async () => {
    getRoomSkillsFolder.mockResolvedValue({
      ...skillsFolder,
      hasSkills: false,
    });
    renderWatcher(sales);
    await flush();

    emitEvent({
      cmd: "create",
      type: "folder",
      id: 502,
      data: { id: 502, title: "Reports", parentId: 12 },
    });
    expect(clouds.selectContextFolder).not.toHaveBeenCalled();
  });

  describe("with rooms offered by the picker", () => {
    const legal = { id: "77", name: "Legal" };
    const hr = { id: "78", name: "HR" };

    beforeEach(() => {
      clouds.contextFolders = [
        { cloud: CONTEXT_ROOM_CLOUD, rooms: [legal, hr] },
        { cloud: "elsewhere", rooms: [{ id: "77", name: "Not ours" }] },
      ];
      getRoomSkillsFolder.mockImplementation(async (roomId: string) =>
        roomId === "77"
          ? { id: "77", roomId: "77", roomsRootId: "7", hasSkills: true }
          : { id: "78", roomId: "78", roomsRootId: "7", hasSkills: true },
      );
    });

    const tick = () =>
      act(async () => {
        vi.advanceTimersByTime(300);
      });

    it("listens to each offered room and the rooms root", async () => {
      renderWatcher(null);
      await flush();

      expect(getRoomSkillsFolder).toHaveBeenCalledWith("77");
      expect(getRoomSkillsFolder).toHaveBeenCalledWith("78");
      expect(subscribers).toEqual(new Set(["DIR-77", "DIR-78", "DIR-7"]));
    });

    it("re-reads the list when an offered room is renamed or removed", async () => {
      renderWatcher(null);
      await flush();

      emitEvent({
        cmd: "update",
        type: "folder",
        id: 77,
        data: { id: 77, title: "Legal EMEA" },
      });
      emitEvent({ cmd: "delete", type: "folder", id: 78 });
      expect(clouds.fetchContextFolders).not.toHaveBeenCalled();
      await tick();
      // Two events inside the window, one re-read.
      expect(clouds.fetchContextFolders).toHaveBeenCalledTimes(1);
    });

    it("re-reads the list when an offered room's skill file goes", async () => {
      renderWatcher(null);
      await flush();

      emitEvent({
        cmd: "delete",
        type: "file",
        id: 5,
        data: { folderId: 78, title: "skill.md" },
      });
      await tick();
      expect(clouds.fetchContextFolders).toHaveBeenCalledTimes(1);
    });

    it("ignores events for rooms the picker does not offer", async () => {
      renderWatcher(null);
      await flush();

      emitEvent({ cmd: "delete", type: "folder", id: 99 });
      emitEvent({
        cmd: "create",
        type: "file",
        id: 6,
        data: { folderId: 990, title: "x.md" },
      });
      emitEvent({
        cmd: "create",
        type: "folder",
        id: 991,
        data: { id: 991, title: "Reports", parentId: 77 },
      });
      await tick();
      expect(clouds.fetchContextFolders).not.toHaveBeenCalled();
    });

    it("lets its parts go when the list changes", async () => {
      const view = renderWatcher(null);
      await flush();
      expect(subscribers.has("DIR-78")).toBe(true);

      clouds.contextFolders = [{ cloud: CONTEXT_ROOM_CLOUD, rooms: [legal] }];
      view.rerender(
        <ContextRoomProvider room={null}>
          <ContextRoomWatcher />
        </ContextRoomProvider>,
      );
      await flush();
      expect(subscribers.has("DIR-78")).toBe(false);
      expect(subscribers.has("DIR-77")).toBe(true);
    });
  });

  it("does nothing outside rooms with nothing connected", async () => {
    renderWatcher(null);
    await flush();

    expect(socket.on).not.toHaveBeenCalled();
    expect(socket.emit).not.toHaveBeenCalled();
  });

  it("stops listening and lets its parts go on unmount", async () => {
    clouds.selectedContextFolder = { cloud: CONTEXT_ROOM_CLOUD, room: sales };
    const view = renderWatcher(sales);
    await flush();

    view.unmount();
    expect(socket.off).toHaveBeenCalledTimes(1);
    expect(listeners.size).toBe(0);
    expect(subscribers.size).toBe(0);
  });
});
