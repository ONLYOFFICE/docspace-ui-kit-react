"use client";

import React, {
  createContext,
  useContext,
  useMemo,
  useRef,
  type MutableRefObject,
  type ReactNode,
} from "react";

/**
 * The room the chat may connect as context: the room the user is standing
 * in, as the host names it. `null` outside a room (or in a room kind that
 * cannot hold a `.ai` folder). The connection itself is made — and checked
 * against the room's `.ai` folder — by `ContextRoomSync` when the chat opens.
 */
export type ContextRoom = {
  id: string;
  name: string;
};

const ContextRoomContext = createContext<ContextRoom | null>(null);

export const useContextRoom = () => useContext(ContextRoomContext);

/**
 * The room id `ContextRoomSync` last connected (or `null` for "no room"),
 * `undefined` before its first run. It lives here, above the chat pane, so
 * a reopen of the chat in the same room can tell itself apart from a move
 * to another room — and leave the user's own choice alone.
 */
export type SyncedContextRoom = MutableRefObject<string | null | undefined>;

const SyncedContextRoomContext = createContext<SyncedContextRoom | null>(null);

export const useSyncedContextRoom = (): SyncedContextRoom => {
  const ref = useContext(SyncedContextRoomContext);
  if (!ref) {
    throw new Error(
      "useSyncedContextRoom must be used within a ContextRoomProvider",
    );
  }
  return ref;
};

type ContextRoomProviderProps = {
  room: ContextRoom | null | undefined;
  children: ReactNode;
};

// The host rebuilds the room object on every render (a MobX inject); memo by
// value so consumers' effects key on the room, not on the render.
export const ContextRoomProvider = ({
  room,
  children,
}: ContextRoomProviderProps) => {
  const id = room?.id;
  const name = room?.name;
  const value = useMemo<ContextRoom | null>(
    () => (id && name !== undefined ? { id, name } : null),
    [id, name],
  );
  const synced = useRef<string | null | undefined>(undefined);

  return (
    <ContextRoomContext.Provider value={value}>
      <SyncedContextRoomContext.Provider value={synced}>
        {children}
      </SyncedContextRoomContext.Provider>
    </ContextRoomContext.Provider>
  );
};
