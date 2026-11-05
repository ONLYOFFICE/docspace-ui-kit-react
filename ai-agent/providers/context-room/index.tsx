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
 * A room the chat may connect as context: the room the user is standing
 * in, as the host names it, or one of an AI project's Instructions rooms.
 * The connection itself is made — and checked against the room's skill
 * files — by `ContextRoomSync` when the chat opens.
 */
export type ContextRoom = {
  id: string;
  name: string;
};

const ContextRoomsContext = createContext<ContextRoom[]>([]);

/** The rooms the host offers as context, in the host's order; empty outside a room. */
export const useContextRooms = () => useContext(ContextRoomsContext);

/** The first offered room, for callers that read one room. */
export const useContextRoom = (): ContextRoom | null =>
  useContext(ContextRoomsContext)[0] ?? null;

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
  /** One room, the way a section passes the room the user is in. */
  room?: ContextRoom | null;
  /** Several rooms, the way an AI project passes its Instructions rooms. Wins over `room`. */
  rooms?: ContextRoom[] | null;
  children: ReactNode;
};

const roomsKey = (rooms: ContextRoom[]) =>
  rooms.map((room) => `${room.id}\u0000${room.name}`).join("\u0001");

export const ContextRoomProvider = ({
  room,
  rooms,
  children,
}: ContextRoomProviderProps) => {
  const list = rooms ?? (room ? [room] : []);
  const key = roomsKey(list);
  // Memoised by content: a new array of the same rooms is the same value.
  const listRef = useRef(list);
  listRef.current = list;
  const value = useMemo<ContextRoom[]>(
    () => listRef.current.map(({ id, name }) => ({ id, name })),
    [key],
  );
  const synced = useRef<string | null | undefined>(undefined);

  return (
    <ContextRoomsContext.Provider value={value}>
      <SyncedContextRoomContext.Provider value={synced}>
        {children}
      </SyncedContextRoomContext.Provider>
    </ContextRoomsContext.Provider>
  );
};
