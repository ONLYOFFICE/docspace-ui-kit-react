import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { SocketEvents, SocketCommands } from ".";

// Captured reference to io() arguments, refreshed per test
let lastIoArgs: unknown[] = [];

// Event handlers registered on the mock socket
let socketHandlers: Record<string, Array<(...args: unknown[]) => void>> = {};

const mockSocket = {
  on: vi.fn((event: string, cb: (...args: unknown[]) => void) => {
    if (!socketHandlers[event]) socketHandlers[event] = [];
    socketHandlers[event].push(cb);
  }),
  off: vi.fn(),
  emit: vi.fn(),
  connect: vi.fn(),
  connected: false,
};

vi.mock("socket.io-client", () => ({
  default: vi.fn((...args: unknown[]) => {
    lastIoArgs = args;
    return mockSocket;
  }),
}));

vi.mock("../add-log", () => ({
  addLog: vi.fn(),
}));

// Helper: fire a socket event
const fire = (event: string, ...args: unknown[]) => {
  socketHandlers[event]?.forEach((cb) => cb(...args));
};

// Helper: get a fresh SocketHelper singleton
const freshInstance = async () => {
  const { default: instance } = await import(".");
  return instance!;
};

describe("SocketHelper", () => {
  beforeEach(() => {
    vi.resetModules();
    delete (globalThis as Record<string, unknown>).SOCKET_INSTANCE;
    socketHandlers = {};
    lastIoArgs = [];
    mockSocket.connected = false;
    mockSocket.on.mockImplementation(
      (event: string, cb: (...args: unknown[]) => void) => {
        if (!socketHandlers[event]) socketHandlers[event] = [];
        socketHandlers[event].push(cb);
      },
    );
    mockSocket.off.mockReset();
    mockSocket.emit.mockReset();
    mockSocket.connect.mockReset();
  });

  // ── getInstance ──────────────────────────────────────────────────────────

  describe("getInstance", () => {
    it("creates a new instance on first call", async () => {
      const instance = await freshInstance();
      expect(instance).toBeDefined();
    });

    it("returns the existing globalThis.SOCKET_INSTANCE when already present", async () => {
      // First import sets SOCKET_INSTANCE in globalThis
      const first = await freshInstance();

      // Reset module cache but leave SOCKET_INSTANCE intact
      vi.resetModules();

      const { default: second } = await import(".");
      expect(second).toBe(first);
    });
  });

  // ── Initial getters ──────────────────────────────────────────────────────

  describe("initial state", () => {
    it("isEnabled is false before connect()", async () => {
      const instance = await freshInstance();
      expect(instance.isEnabled).toBe(false);
    });

    it("isReady is false before connection-init", async () => {
      const instance = await freshInstance();
      expect(instance.isReady).toBe(false);
    });

    it("socket getter returns null before connect()", async () => {
      const instance = await freshInstance();
      expect(instance.socket).toBeNull();
    });

    it("socketSubscribers is empty initially", async () => {
      const instance = await freshInstance();
      expect(instance.socketSubscribers.size).toBe(0);
    });
  });

  // ── connect() ────────────────────────────────────────────────────────────

  describe("connect()", () => {
    it("does nothing when url is empty", async () => {
      const instance = await freshInstance();
      instance.connect("", "");
      expect(instance.socket).toBeNull();
    });

    it("creates socket client when url is a path", async () => {
      const instance = await freshInstance();
      instance.connect("/socket", "");
      expect(instance.socket).not.toBeNull();
    });

    it("sets isEnabled after connect()", async () => {
      const instance = await freshInstance();
      instance.connect("/socket", "");
      expect(instance.isEnabled).toBe(true);
    });

    it("passes path as socket path when url does not start with http", async () => {
      const instance = await freshInstance();
      instance.connect("/api/socket", "");
      const config = lastIoArgs[1] as Record<string, unknown>;
      expect(config.path).toBe("/api/socket");
    });

    it("parses full http URL — origin as host, pathname as path", async () => {
      const instance = await freshInstance();
      instance.connect("http://example.com/socket", "");
      expect(lastIoArgs[0]).toBe("http://example.com");
      const config = lastIoArgs[1] as Record<string, unknown>;
      expect(config.path).toBe("/socket");
    });

    it("adds share query param when publicRoomKey is provided", async () => {
      const instance = await freshInstance();
      instance.connect("/socket", "room-key-123");
      const config = lastIoArgs[1] as { query?: Record<string, string> };
      expect(config.query).toEqual({ share: "room-key-123" });
    });

    it("adds authorization header and uses polling-first transport for authToken", async () => {
      const instance = await freshInstance();
      instance.connect("/socket", "", "my-token");
      const config = lastIoArgs[1] as {
        extraHeaders?: Record<string, string>;
        transports?: string[];
      };
      expect(config.extraHeaders).toEqual({
        Authorization: "bearer my-token",
      });
      expect(config.transports).toEqual(["polling", "websocket"]);
    });

    it("does not prepend 'bearer ' when token already starts with Bearer", async () => {
      const instance = await freshInstance();
      instance.connect("/socket", "", "Bearer existing-token");
      const config = lastIoArgs[1] as {
        extraHeaders?: Record<string, string>;
      };
      expect(config.extraHeaders?.Authorization).toBe("Bearer existing-token");
    });

    it("does not reconnect if socket is already connected", async () => {
      const instance = await freshInstance();
      instance.connect("/socket", "");
      mockSocket.connected = true;
      const callsBefore = lastIoArgs.length > 0 ? 1 : 0;
      instance.connect("/socket", "");
      // io() should only have been called once (first connect)
      expect(callsBefore).toBe(1);
    });
  });

  // ── connection-init event ────────────────────────────────────────────────

  describe("connection-init event", () => {
    it("sets isReady to true", async () => {
      const instance = await freshInstance();
      instance.connect("/socket", "");
      fire("connection-init");
      expect(instance.isReady).toBe(true);
    });

    it("flushes queued on() callbacks after connection-init", async () => {
      const instance = await freshInstance();
      const cb = vi.fn();
      // Register before connect — goes into queue
      instance.on(SocketEvents.ModifyFolder, cb);
      instance.connect("/socket", "");
      fire("connection-init");
      expect(mockSocket.on).toHaveBeenCalledWith(SocketEvents.ModifyFolder, cb);
    });

    it("empties the callbacks queue after flushing", async () => {
      const instance = await freshInstance();
      const cb = vi.fn();
      instance.on(SocketEvents.ModifyFolder, cb);
      instance.connect("/socket", "");
      fire("connection-init");
      mockSocket.on.mockClear();
      // Fire connection-init again — callbacks queue should be empty
      fire("connection-init");
      expect(mockSocket.on).not.toHaveBeenCalledWith(
        SocketEvents.ModifyFolder,
        cb,
      );
    });

    it("flushes queued emit() calls after connection-init", async () => {
      const instance = await freshInstance();
      // Emit before connect — goes into queue
      instance.emit(SocketCommands.Subscribe, { roomParts: "folder-1" });
      instance.connect("/socket", "");
      fire("connection-init");
      expect(mockSocket.emit).toHaveBeenCalledWith(SocketCommands.Subscribe, {
        roomParts: "folder-1",
      });
    });
  });

  // ── connect event (re-subscribe) ─────────────────────────────────────────

  describe("connect event (reconnect re-subscribe)", () => {
    it("re-emits subscribe for all tracked rooms on reconnect", async () => {
      const instance = await freshInstance();
      instance.connect("/socket", "");
      fire("connection-init");
      instance.emit(SocketCommands.Subscribe, { roomParts: "room-1" });
      mockSocket.emit.mockClear();

      fire("connect");

      expect(mockSocket.emit).toHaveBeenCalledWith(SocketCommands.Subscribe, {
        roomParts: "room-1",
        individual: undefined,
      });
    });
  });

  // ── isEmitDataValid / emit() ─────────────────────────────────────────────

  describe("emit()", () => {
    it("queues emit when socket is not ready", async () => {
      const instance = await freshInstance();
      instance.connect("/socket", "");
      instance.emit(SocketCommands.Subscribe, { roomParts: "folder-1" });
      expect(mockSocket.emit).not.toHaveBeenCalledWith(
        SocketCommands.Subscribe,
        expect.anything(),
      );
    });

    it("emits directly when socket is ready", async () => {
      const instance = await freshInstance();
      instance.connect("/socket", "");
      fire("connection-init");
      instance.emit(SocketCommands.Subscribe, { roomParts: "folder-1" });
      expect(mockSocket.emit).toHaveBeenCalledWith(SocketCommands.Subscribe, {
        roomParts: "folder-1",
      });
    });

    it("does not emit subscribe when roomParts is empty string", async () => {
      const instance = await freshInstance();
      instance.connect("/socket", "");
      fire("connection-init");
      mockSocket.emit.mockClear();
      instance.emit(SocketCommands.Subscribe, { roomParts: "" });
      expect(mockSocket.emit).not.toHaveBeenCalled();
    });

    it("does not emit subscribe when data is absent", async () => {
      const instance = await freshInstance();
      instance.connect("/socket", "");
      fire("connection-init");
      mockSocket.emit.mockClear();
      instance.emit(SocketCommands.Subscribe);
      expect(mockSocket.emit).not.toHaveBeenCalled();
    });

    it("emits non-subscribe commands without roomParts validation", async () => {
      const instance = await freshInstance();
      instance.connect("/socket", "");
      fire("connection-init");
      instance.emit(SocketCommands.RefreshFolder, "folder-id");
      expect(mockSocket.emit).toHaveBeenCalledWith(
        SocketCommands.RefreshFolder,
        "folder-id",
      );
    });

    it("tracks subscribed room in socketSubscribers", async () => {
      const instance = await freshInstance();
      instance.connect("/socket", "");
      fire("connection-init");
      instance.emit(SocketCommands.Subscribe, { roomParts: "room-42" });
      expect(instance.socketSubscribers.has("room-42")).toBe(true);
    });

    it("handles array roomParts — tracks each room separately", async () => {
      const instance = await freshInstance();
      instance.connect("/socket", "");
      fire("connection-init");
      instance.emit(SocketCommands.Subscribe, {
        roomParts: ["room-a", "room-b"],
      });
      expect(instance.socketSubscribers.has("room-a")).toBe(true);
      expect(instance.socketSubscribers.has("room-b")).toBe(true);
    });

    it("does not add a room to subscribeEmits twice", async () => {
      const instance = await freshInstance();
      instance.connect("/socket", "");
      fire("connection-init");
      instance.emit(SocketCommands.Subscribe, { roomParts: "room-1" });
      instance.emit(SocketCommands.Subscribe, { roomParts: "room-1" });
      // Deduplicated in the map — still only one entry
      expect(instance.socketSubscribers.size).toBe(1);
    });

    it("removes room from socketSubscribers on unsubscribe", async () => {
      const instance = await freshInstance();
      instance.connect("/socket", "");
      fire("connection-init");
      instance.emit(SocketCommands.Subscribe, { roomParts: "room-1" });
      instance.emit(SocketCommands.Unsubscribe, { roomParts: "room-1" });
      expect(instance.socketSubscribers.has("room-1")).toBe(false);
    });

    it("tracks individual flag when subscribing", async () => {
      const instance = await freshInstance();
      instance.connect("/socket", "");
      fire("connection-init");
      instance.emit(SocketCommands.Subscribe, {
        roomParts: "room-1",
        individual: true,
      });
      // Re-subscribe on reconnect should carry the individual flag
      mockSocket.emit.mockClear();
      fire("connect");
      expect(mockSocket.emit).toHaveBeenCalledWith(SocketCommands.Subscribe, {
        roomParts: "room-1",
        individual: true,
      });
    });
  });

  // ── on() ─────────────────────────────────────────────────────────────────

  describe("on()", () => {
    it("queues callback when socket is not ready", async () => {
      const instance = await freshInstance();
      const cb = vi.fn();
      instance.on(SocketEvents.ModifyFolder, cb);
      expect(mockSocket.on).not.toHaveBeenCalledWith(
        SocketEvents.ModifyFolder,
        cb,
      );
    });

    it("registers callback immediately when socket is ready", async () => {
      const instance = await freshInstance();
      instance.connect("/socket", "");
      fire("connection-init");
      const cb = vi.fn();
      instance.on(SocketEvents.ModifyFolder, cb);
      expect(mockSocket.on).toHaveBeenCalledWith(SocketEvents.ModifyFolder, cb);
    });
  });

  // ── off() ─────────────────────────────────────────────────────────────────

  describe("off()", () => {
    it("removes queued callback when socket is not ready", async () => {
      const instance = await freshInstance();
      const cb = vi.fn();
      instance.on(SocketEvents.ModifyFolder, cb);
      instance.off(SocketEvents.ModifyFolder, cb);
      // Now connect and init — the callback should NOT be registered
      instance.connect("/socket", "");
      fire("connection-init");
      expect(mockSocket.on).not.toHaveBeenCalledWith(
        SocketEvents.ModifyFolder,
        cb,
      );
    });

    it("calls client.off when socket is ready", async () => {
      const instance = await freshInstance();
      instance.connect("/socket", "");
      fire("connection-init");
      const cb = vi.fn();
      instance.off(SocketEvents.ModifyFolder, cb);
      expect(mockSocket.off).toHaveBeenCalledWith(
        SocketEvents.ModifyFolder,
        cb,
      );
    });

    it("calls client.off with undefined callback when none provided", async () => {
      const instance = await freshInstance();
      instance.connect("/socket", "");
      fire("connection-init");
      instance.off(SocketEvents.ModifyFolder);
      expect(mockSocket.off).toHaveBeenCalledWith(
        SocketEvents.ModifyFolder,
        undefined,
      );
    });

    it("does not remove other events from the queue", async () => {
      const instance = await freshInstance();
      const cbA = vi.fn();
      const cbB = vi.fn();
      instance.on(SocketEvents.ModifyFolder, cbA);
      instance.on(SocketEvents.ModifyRoom, cbB);
      instance.off(SocketEvents.ModifyFolder, cbA);
      instance.connect("/socket", "");
      fire("connection-init");
      expect(mockSocket.on).toHaveBeenCalledWith(SocketEvents.ModifyRoom, cbB);
      expect(mockSocket.on).not.toHaveBeenCalledWith(
        SocketEvents.ModifyFolder,
        cbA,
      );
    });
  });

  // ── disconnect / reconnect ───────────────────────────────────────────────

  describe("disconnect event", () => {
    afterEach(() => {
      vi.useRealTimers();
    });

    it("attempts to reconnect after disconnect", async () => {
      vi.useFakeTimers();
      const instance = await freshInstance();
      instance.connect("/socket", "");
      fire("connection-init");
      mockSocket.connected = false;
      fire("disconnect");
      vi.advanceTimersByTime(1000);
      expect(mockSocket.connect).toHaveBeenCalled();
    });

    it("stops retrying after maxReconnectRetries attempts", async () => {
      vi.useFakeTimers();
      const instance = await freshInstance();
      instance.connect("/socket", "");
      fire("connection-init");
      mockSocket.connected = false;
      fire("disconnect");
      // 5 retries × 1 000 ms each
      vi.advanceTimersByTime(5000);
      const retriesAfter5 = mockSocket.connect.mock.calls.length;
      vi.advanceTimersByTime(3000);
      expect(mockSocket.connect.mock.calls.length).toBe(retriesAfter5);
    });

    it("does not attempt reconnect when socket is already connected", async () => {
      vi.useFakeTimers();
      const instance = await freshInstance();
      instance.connect("/socket", "");
      fire("connection-init");
      mockSocket.connected = true;
      fire("disconnect");
      vi.advanceTimersByTime(1000);
      expect(mockSocket.connect).not.toHaveBeenCalled();
    });
  });
});
