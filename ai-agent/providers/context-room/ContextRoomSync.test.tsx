"use client";

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { act, render } from "@testing-library/react";

import { ContextRoomProvider } from "./index";

const clouds = {
  selectedContextFolder: null as null | {
    cloud: string;
    room: { id: string; name: string };
  },
  selectContextFolder: vi.fn(),
  clearContextFolder: vi.fn(),
  fetchRoomSkills: vi.fn(),
};
const useCloudsStore = { getState: () => clouds };

vi.mock("@onlyoffice/ai-chat", () => ({
  useStores: () => ({ useCloudsStore }),
}));

const hasRoomAiFolder = vi.fn<(roomId: string) => Promise<boolean>>();
const aiApi = { hasRoomAiFolder };

vi.mock("../../../providers/api", () => ({
  useApi: () => ({ aiApi }),
}));

import ContextRoomSync, { CONTEXT_ROOM_CLOUD } from "./ContextRoomSync";

const flush = () => act(async () => {});

const renderSync = (room: { id: string; name: string } | null) =>
  render(
    <ContextRoomProvider room={room}>
      <ContextRoomSync />
    </ContextRoomProvider>,
  );

// The provider outlives the chat pane; the pane (and the sync inside it)
// comes and goes with the chat. `open` is that pane.
const Chat = ({
  room,
  open,
}: {
  room: { id: string; name: string } | null;
  open: boolean;
}) => (
  <ContextRoomProvider room={room}>
    {open ? <ContextRoomSync /> : null}
  </ContextRoomProvider>
);

describe("ContextRoomSync", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    clouds.selectedContextFolder = null;
  });

  it("re-reads the skills when the chat reopens in the room already connected", async () => {
    hasRoomAiFolder.mockResolvedValue(true);
    clouds.selectedContextFolder = {
      cloud: CONTEXT_ROOM_CLOUD,
      room: { id: "12", name: "Sales" },
    };
    renderSync({ id: "12", name: "Sales" });
    await flush();

    expect(clouds.selectContextFolder).toHaveBeenCalledWith(
      CONTEXT_ROOM_CLOUD,
      { id: "12", name: "Sales" },
    );
    expect(clouds.fetchRoomSkills).toHaveBeenCalledTimes(1);
    expect(clouds.clearContextFolder).not.toHaveBeenCalled();
  });

  it("hands the store the new name of the room already connected", async () => {
    hasRoomAiFolder.mockResolvedValue(true);
    clouds.selectedContextFolder = {
      cloud: CONTEXT_ROOM_CLOUD,
      room: { id: "12", name: "Sales" },
    };
    renderSync({ id: "12", name: "Sales EMEA" });
    await flush();

    expect(clouds.selectContextFolder).toHaveBeenCalledWith(
      CONTEXT_ROOM_CLOUD,
      { id: "12", name: "Sales EMEA" },
    );
    expect(clouds.fetchRoomSkills).toHaveBeenCalledTimes(1);
    expect(clouds.clearContextFolder).not.toHaveBeenCalled();
  });

  it("connects the room once its .ai folder is confirmed", async () => {
    hasRoomAiFolder.mockResolvedValue(true);
    renderSync({ id: "12", name: "Sales" });
    await flush();

    expect(hasRoomAiFolder).toHaveBeenCalledWith("12");
    expect(clouds.selectContextFolder).toHaveBeenCalledWith(
      CONTEXT_ROOM_CLOUD,
      { id: "12", name: "Sales" },
    );
    expect(clouds.clearContextFolder).not.toHaveBeenCalled();
  });

  it("drops the connection for a room without a .ai folder", async () => {
    hasRoomAiFolder.mockResolvedValue(false);
    renderSync({ id: "12", name: "Sales" });
    await flush();

    expect(clouds.selectContextFolder).not.toHaveBeenCalled();
    expect(clouds.clearContextFolder).toHaveBeenCalledTimes(1);
  });

  it("treats a failed check as no folder", async () => {
    hasRoomAiFolder.mockRejectedValue(new Error("boom"));
    renderSync({ id: "12", name: "Sales" });
    await flush();

    expect(clouds.selectContextFolder).not.toHaveBeenCalled();
    expect(clouds.clearContextFolder).toHaveBeenCalledTimes(1);
  });

  it("clears without asking when there is no room", async () => {
    renderSync(null);
    await flush();

    expect(hasRoomAiFolder).not.toHaveBeenCalled();
    expect(clouds.clearContextFolder).toHaveBeenCalledTimes(1);
  });

  it("follows the room while the chat stays open", async () => {
    hasRoomAiFolder.mockResolvedValue(true);
    const { rerender } = renderSync({ id: "12", name: "Sales" });
    await flush();

    rerender(
      <ContextRoomProvider room={{ id: "12", name: "Sales" }}>
        <ContextRoomSync />
      </ContextRoomProvider>,
    );
    await flush();
    // Same room, new object: nothing re-runs.
    expect(hasRoomAiFolder).toHaveBeenCalledTimes(1);

    rerender(
      <ContextRoomProvider room={{ id: "13", name: "Legal" }}>
        <ContextRoomSync />
      </ContextRoomProvider>,
    );
    await flush();
    expect(hasRoomAiFolder).toHaveBeenLastCalledWith("13");
    expect(clouds.selectContextFolder).toHaveBeenLastCalledWith(
      CONTEXT_ROOM_CLOUD,
      { id: "13", name: "Legal" },
    );

    rerender(
      <ContextRoomProvider room={null}>
        <ContextRoomSync />
      </ContextRoomProvider>,
    );
    await flush();
    expect(clouds.clearContextFolder).toHaveBeenCalledTimes(1);
  });

  describe("reopening the chat in the same room", () => {
    const sales = { id: "12", name: "Sales" };

    const openConnectAndClose = async () => {
      hasRoomAiFolder.mockResolvedValue(true);
      const view = render(<Chat room={sales} open />);
      await flush();
      expect(clouds.selectContextFolder).toHaveBeenCalledTimes(1);
      view.rerender(<Chat room={sales} open={false} />);
      vi.clearAllMocks();
      return view;
    };

    it("leaves a Disconnect alone", async () => {
      const view = await openConnectAndClose();
      clouds.selectedContextFolder = null; // the user disconnected

      view.rerender(<Chat room={sales} open />);
      await flush();

      expect(hasRoomAiFolder).not.toHaveBeenCalled();
      expect(clouds.selectContextFolder).not.toHaveBeenCalled();
      expect(clouds.clearContextFolder).not.toHaveBeenCalled();
    });

    it("leaves another room picked from the list alone", async () => {
      const view = await openConnectAndClose();
      clouds.selectedContextFolder = {
        cloud: CONTEXT_ROOM_CLOUD,
        room: { id: "77", name: "Legal" },
      };

      view.rerender(<Chat room={sales} open />);
      await flush();

      expect(hasRoomAiFolder).not.toHaveBeenCalled();
      expect(clouds.selectContextFolder).not.toHaveBeenCalled();
      expect(clouds.clearContextFolder).not.toHaveBeenCalled();
      expect(clouds.fetchRoomSkills).not.toHaveBeenCalled();
    });

    it("refreshes the current room when it is still the one connected", async () => {
      const view = await openConnectAndClose();
      clouds.selectedContextFolder = { cloud: CONTEXT_ROOM_CLOUD, room: sales };

      view.rerender(<Chat room={{ id: "12", name: "Sales EMEA" }} open />);
      await flush();

      expect(hasRoomAiFolder).not.toHaveBeenCalled();
      expect(clouds.selectContextFolder).toHaveBeenCalledWith(
        CONTEXT_ROOM_CLOUD,
        { id: "12", name: "Sales EMEA" },
      );
      expect(clouds.fetchRoomSkills).toHaveBeenCalledTimes(1);
    });

    it("a move to another room overrides the pick", async () => {
      const view = await openConnectAndClose();
      clouds.selectedContextFolder = {
        cloud: CONTEXT_ROOM_CLOUD,
        room: { id: "77", name: "Legal" },
      };
      hasRoomAiFolder.mockResolvedValue(true);

      view.rerender(<Chat room={{ id: "13", name: "HR" }} open />);
      await flush();

      expect(hasRoomAiFolder).toHaveBeenCalledWith("13");
      expect(clouds.selectContextFolder).toHaveBeenCalledWith(
        CONTEXT_ROOM_CLOUD,
        { id: "13", name: "HR" },
      );
    });

    it("checks again when the first check never landed", async () => {
      hasRoomAiFolder.mockReturnValueOnce(new Promise<boolean>(() => {}));
      const view = render(<Chat room={sales} open />);
      await flush();
      view.rerender(<Chat room={sales} open={false} />);
      hasRoomAiFolder.mockResolvedValue(true);

      view.rerender(<Chat room={sales} open />);
      await flush();

      expect(hasRoomAiFolder).toHaveBeenCalledTimes(2);
      expect(clouds.selectContextFolder).toHaveBeenCalledWith(
        CONTEXT_ROOM_CLOUD,
        sales,
      );
    });
  });

  it("ignores a late answer for a room that was left", async () => {
    let resolve: (value: boolean) => void = () => {};
    hasRoomAiFolder.mockReturnValueOnce(
      new Promise<boolean>((r) => {
        resolve = r;
      }),
    );
    const { rerender } = renderSync({ id: "12", name: "Sales" });
    await flush();

    rerender(
      <ContextRoomProvider room={null}>
        <ContextRoomSync />
      </ContextRoomProvider>,
    );
    await flush();
    await act(async () => {
      resolve(true);
    });

    expect(clouds.selectContextFolder).not.toHaveBeenCalled();
  });
});
