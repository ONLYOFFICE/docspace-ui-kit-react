// (c) Copyright Ascensio System SIA 2009-2026
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

"use client";

import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act, render } from "@testing-library/react";

import { ContextRoomProvider } from "./index";

type Selected = null | { cloud: string; room: { id: string; name: string } };

// vi.mock factories are hoisted above every import, so the state they close
// over has to be hoisted with them.
const { clouds, useCloudsStore, getRoomAiFolder, subscribers, listeners, socket } =
  vi.hoisted(() => {
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
    const getRoomAiFolder = vi.fn();
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
    return { clouds, useCloudsStore, getRoomAiFolder, subscribers, listeners, socket };
  });

vi.mock("@onlyoffice/ai-chat", () => ({
  useStores: () => ({ useCloudsStore }),
}));

vi.mock("../../../providers/api", () => ({
  useApi: () => ({ aiApi: { getRoomAiFolder } }),
}));

vi.mock("../../../utils/socket", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("../../../utils/socket")>();
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
const aiFolder = { id: "500", roomId: "12", roomsRootId: "7", hasSkills: true };

describe("ContextRoomWatcher", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    clouds.selectedContextFolder = null;
    clouds.contextFolders = [];
    clouds.roomSkills = [{ id: "s1" }];
    subscribers.clear();
    listeners.clear();
    getRoomAiFolder.mockResolvedValue(aiFolder);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("with the current room connected", () => {
    beforeEach(() => {
      clouds.selectedContextFolder = { cloud: CONTEXT_ROOM_CLOUD, room: sales };
    });

    it("listens to the rooms root, the room and its .ai folder", async () => {
      renderWatcher(sales);
      await flush();

      expect(getRoomAiFolder).toHaveBeenCalledWith("12");
      expect(socket.emit).toHaveBeenCalledWith("subscribe", {
        roomParts: ["DIR-7", "DIR-12", "DIR-500"],
        individual: true,
      });
      expect(socket.on).toHaveBeenCalledTimes(1);
    });

    it("re-reads the skills once for a burst of file changes in .ai", async () => {
      renderWatcher(sales);
      await flush();

      emitEvent({ cmd: "create", type: "file", id: 1, data: { folderId: 500, title: "a.md" } });
      emitEvent({ cmd: "update", type: "file", id: 1, data: { folderId: 500, title: "a.md" } });
      emitEvent({ cmd: "delete", type: "file", id: 2, data: { folderId: 500 } });
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
      emitEvent({ cmd: "delete", type: "file", id: 1, data: { folderId: 500 } });
      await act(async () => {
        vi.advanceTimersByTime(300);
      });
      expect(clouds.clearContextFolder).toHaveBeenCalledTimes(1);
    });

    it("ignores files elsewhere in the room", async () => {
      renderWatcher(sales);
      await flush();

      emitEvent({ cmd: "create", type: "file", id: 3, data: { folderId: 12, title: "plan.docx" } });
      act(() => {
        vi.advanceTimersByTime(300);
      });
      expect(clouds.fetchRoomSkills).not.toHaveBeenCalled();
    });

    it("disconnects when the .ai folder is removed", async () => {
      renderWatcher(sales);
      await flush();

      emitEvent({ cmd: "delete", type: "folder", id: 500 });
      expect(clouds.clearContextFolder).toHaveBeenCalledTimes(1);
    });

    it("disconnects when the .ai folder is renamed away", async () => {
      renderWatcher(sales);
      await flush();

      emitEvent({ cmd: "update", type: "folder", id: 500, data: { id: 500, title: "old-ai", parentId: 12, type: 0 } });
      expect(clouds.clearContextFolder).toHaveBeenCalledTimes(1);
    });

    it("keeps the connection when the .ai folder is touched but stays itself", async () => {
      renderWatcher(sales);
      await flush();

      emitEvent({ cmd: "update", type: "folder", id: 500, data: { id: 500, title: ".ai", parentId: 12, type: 37 } });
      expect(clouds.clearContextFolder).not.toHaveBeenCalled();
    });

    it("takes over the room's new name", async () => {
      renderWatcher(sales);
      await flush();

      emitEvent({ cmd: "update", type: "folder", id: 12, data: { id: 12, title: "Sales EMEA" } });
      expect(clouds.selectContextFolder).toHaveBeenCalledWith(CONTEXT_ROOM_CLOUD, {
        id: "12",
        name: "Sales EMEA",
      });
    });

    it("disconnects when the room is removed or leaves the user", async () => {
      renderWatcher(sales);
      await flush();

      emitEvent({ cmd: "delete", type: "folder", id: 12 });
      expect(clouds.clearContextFolder).toHaveBeenCalledTimes(1);
    });

    it("disconnects at once when the .ai folder is already gone", async () => {
      getRoomAiFolder.mockResolvedValue(null);
      renderWatcher(sales);
      await flush();

      expect(clouds.clearContextFolder).toHaveBeenCalledTimes(1);
      expect(socket.emit).not.toHaveBeenCalled();
    });

    it("disconnects at once when the .ai folder holds no skill any more", async () => {
      getRoomAiFolder.mockResolvedValue({ ...aiFolder, hasSkills: false });
      renderWatcher(sales);
      await flush();

      expect(clouds.clearContextFolder).toHaveBeenCalledTimes(1);
    });

    it.each([401, 403])(
      "disconnects when the lookup answers %s: the room is gone for this user",
      async (status) => {
        getRoomAiFolder.mockRejectedValue(
          Object.assign(new Error(String(status)), { status }),
        );
        renderWatcher(sales);
        await flush();

        expect(clouds.clearContextFolder).toHaveBeenCalledTimes(1);
        expect(socket.emit).not.toHaveBeenCalled();
      },
    );

    it("keeps the connection when the .ai folder lookup fails", async () => {
      getRoomAiFolder.mockRejectedValue(Object.assign(new Error("503"), { status: 503 }));
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
        roomParts: ["DIR-7", "DIR-500"],
        individual: true,
      });
      view.unmount();
      expect(socket.emit).toHaveBeenLastCalledWith("unsubscribe", {
        roomParts: ["DIR-7", "DIR-500"],
        individual: true,
      });
      expect(subscribers.has("DIR-12")).toBe(true);
    });
  });

  describe("with the current room not connected", () => {
    it("watches the room and, when it has one, its .ai folder", async () => {
      getRoomAiFolder.mockResolvedValue({ ...aiFolder, hasSkills: false });
      renderWatcher(sales);
      await flush();

      expect(getRoomAiFolder).toHaveBeenCalledWith("12");
      expect(socket.emit).toHaveBeenNthCalledWith(1, "subscribe", {
        roomParts: ["DIR-12"],
        individual: true,
      });
      expect(socket.emit).toHaveBeenNthCalledWith(2, "subscribe", {
        roomParts: ["DIR-500"],
        individual: true,
      });
    });

    it("connects the room when its first skill file lands in the empty .ai folder", async () => {
      getRoomAiFolder.mockResolvedValue({ ...aiFolder, hasSkills: false });
      renderWatcher(sales);
      await flush();

      emitEvent({ cmd: "create", type: "file", id: 1, data: { folderId: 500, title: "notes.txt", fileExst: ".txt" } });
      expect(clouds.selectContextFolder).not.toHaveBeenCalled();

      emitEvent({ cmd: "create", type: "file", id: 2, data: { folderId: 500, title: "pdf.md", fileExst: ".md" } });
      expect(clouds.selectContextFolder).toHaveBeenCalledWith(CONTEXT_ROOM_CLOUD, sales);
      // The picker gains the room: its list is re-read, debounced.
      await act(async () => {
        vi.advanceTimersByTime(300);
      });
      expect(clouds.fetchContextFolders).toHaveBeenCalledTimes(1);
    });

    it("does not connect on a .ai folder appearing, only on its first skill", async () => {
      getRoomAiFolder.mockResolvedValue(null);
      renderWatcher(sales);
      await flush();

      emitEvent({ cmd: "create", type: "folder", id: 501, data: { id: 501, title: ".ai", parentId: 12 } });
      expect(clouds.selectContextFolder).not.toHaveBeenCalled();
      expect(socket.emit).toHaveBeenLastCalledWith("subscribe", {
        roomParts: ["DIR-501"],
        individual: true,
      });

      emitEvent({ cmd: "create", type: "file", id: 3, data: { folderId: 501, title: "skill.md" } });
      expect(clouds.selectContextFolder).toHaveBeenCalledWith(CONTEXT_ROOM_CLOUD, sales);
    });
  });

  it("leaves a room the user picked alone when the current room gains a skill", async () => {
    const legal = { id: "30", name: "Legal" };
    clouds.selectedContextFolder = { cloud: CONTEXT_ROOM_CLOUD, room: legal };
    getRoomAiFolder.mockImplementation(async (roomId: string) =>
      roomId === "30"
        ? { id: "600", roomId: "30", roomsRootId: "7", hasSkills: true }
        : { ...aiFolder, hasSkills: false },
    );
    renderWatcher(sales);
    await flush();

    expect(getRoomAiFolder).not.toHaveBeenCalledWith("12");
    emitEvent({ cmd: "create", type: "file", id: 4, data: { folderId: 500, title: "skill.md" } });
    expect(clouds.selectContextFolder).not.toHaveBeenCalled();
    expect(clouds.clearContextFolder).not.toHaveBeenCalled();
  });

  it("leaves a room the user let go alone when another skill lands there", async () => {
    // Nothing connected, the folder already holds skills: a Disconnect.
    renderWatcher(sales);
    await flush();

    expect(socket.emit).toHaveBeenCalledTimes(1);
    expect(socket.emit).toHaveBeenCalledWith("subscribe", {
      roomParts: ["DIR-12"],
      individual: true,
    });
    emitEvent({ cmd: "create", type: "file", id: 5, data: { folderId: 500, title: "more.md" } });
    expect(clouds.selectContextFolder).not.toHaveBeenCalled();
  });

  it("ignores other folders appearing in the current room", async () => {
    getRoomAiFolder.mockResolvedValue(null);
    renderWatcher(sales);
    await flush();

    emitEvent({ cmd: "create", type: "folder", id: 502, data: { id: 502, title: "Reports", parentId: 12 } });
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
      getRoomAiFolder.mockImplementation(async (roomId: string) =>
        roomId === "77"
          ? { id: "770", roomId: "77", roomsRootId: "7", hasSkills: true }
          : { id: "780", roomId: "78", roomsRootId: "7", hasSkills: true },
      );
    });

    const tick = () =>
      act(async () => {
        vi.advanceTimersByTime(300);
      });

    it("listens to each offered room, its .ai folder and the rooms root", async () => {
      renderWatcher(null);
      await flush();

      expect(getRoomAiFolder).toHaveBeenCalledWith("77");
      expect(getRoomAiFolder).toHaveBeenCalledWith("78");
      expect(subscribers).toEqual(
        new Set(["DIR-77", "DIR-78", "DIR-7", "DIR-770", "DIR-780"]),
      );
    });

    it("re-reads the list when an offered room is renamed or removed", async () => {
      renderWatcher(null);
      await flush();

      emitEvent({ cmd: "update", type: "folder", id: 77, data: { id: 77, title: "Legal EMEA" } });
      emitEvent({ cmd: "delete", type: "folder", id: 78 });
      expect(clouds.fetchContextFolders).not.toHaveBeenCalled();
      await tick();
      // Two events inside the window, one re-read.
      expect(clouds.fetchContextFolders).toHaveBeenCalledTimes(1);
    });

    it("re-reads the list when an offered room's .ai folder goes or empties", async () => {
      renderWatcher(null);
      await flush();

      emitEvent({ cmd: "delete", type: "folder", id: 770 });
      await tick();
      emitEvent({ cmd: "delete", type: "file", id: 5, data: { folderId: 780, title: "skill.md" } });
      await tick();
      expect(clouds.fetchContextFolders).toHaveBeenCalledTimes(2);
    });

    it("ignores events for rooms the picker does not offer", async () => {
      renderWatcher(null);
      await flush();

      emitEvent({ cmd: "delete", type: "folder", id: 99 });
      emitEvent({ cmd: "create", type: "file", id: 6, data: { folderId: 990, title: "x.md" } });
      emitEvent({ cmd: "create", type: "folder", id: 991, data: { id: 991, title: "Reports", parentId: 77 } });
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
