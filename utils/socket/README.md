# socket

`SocketHelper` — a singleton managing the portal's WebSocket connection ([socket.io-client](https://socket.io/docs/v4/client-api/)), with typed events and commands.

## What It Does

`SocketHelper.getInstance()` returns the singleton (also exported as the module's default export, already instantiated). It:

- `connect(url, publicRoomKey?)` — establishes the WebSocket connection; queues `emit`/`on` calls made before the socket is ready and flushes them once connected
- `emit(command, data, room?)` — sends a typed command (`SocketCommands`), scoped to a room or global
- `on(event, callback)` — registers a listener for a typed event (`SocketEvents`)
- exposes `isEnabled`, `isReady`, and `socketSubscribers` getters

`SocketEvents` and `SocketCommands` enumerate every event/command the portal socket protocol supports (file/room/folder changes, chat, backup, wallet balance, plugin state, and more), each with a typed payload via `TEmitEventsDataMap` / `TListenEventCallbackMap`.

## Import

```ts
import SocketHelper, { SocketEvents, SocketCommands } from "../../utils/socket";
```

## Usage

```ts
SocketHelper?.connect("wss://example.com", publicRoomKey);

SocketHelper?.on(SocketEvents.CreateFile, (file) => {
  console.log("file created", file);
});

SocketHelper?.emit(SocketCommands.Subscribe, { roomParts: "files", ids: [roomId] });
```

## Key Files

| File | Description |
|------|-------------|
| `index.ts` | `SocketHelper` class, `SocketEvents`/`SocketCommands` enums, and all associated types |
| `socket.test.ts` | Unit tests (Vitest) |
