import { DEMO_FOLDERS } from "./demo-matter-contents";
import { DEMO_PEOPLE, DEMO_ROOMS } from "./demo-matters";
import type { RoomLike } from "./matter";
import type { FolderContents } from "./matterRoom";
import type { Persona } from "./persona";
import type { SeedClient } from "./seed";

/**
 * The portal there is when there is no portal: the demo rooms and folders in
 * one place, kept for the life of the page, so what one screen writes the
 * next screen reads. A matter opened in the cabinet appears in the list; a
 * file dropped on a request is there when the lawyer looks.
 *
 * It answers the same questions the portal does -- which rooms this person
 * sees, what a folder holds -- and takes the same writes, through the same
 * `SeedClient` words the seeder speaks to a real one. Screens subscribe with
 * `useSyncExternalStore`; every write replaces the snapshot, so they re-render.
 */
type Snapshot = {
  rooms: RoomLike[];
  /** Rooms the demo client is a member of. */
  clientRoomIds: number[];
  folders: Record<number, FolderContents>;
};

const fresh = (): Snapshot => ({
  rooms: DEMO_ROOMS.lawyer.map((room) => ({ ...room })),
  clientRoomIds: DEMO_ROOMS.client.flatMap((room) =>
    room.id === undefined ? [] : [room.id],
  ),
  folders: structuredClone(DEMO_FOLDERS),
});

let snapshot = fresh();
let nextId = 900_000;
const listeners = new Set<() => void>();

const emit = () => {
  snapshot = { ...snapshot };
  for (const listener of listeners) listener();
};

const now = () => new Date().toISOString();

const contentsOf = (id: number) =>
  (snapshot.folders[id] ??= { folders: [], files: [] });

/** The folder entry for `id` in whichever listing holds it, room or folder. */
const entryOf = (id: number) => {
  for (const listing of Object.values(snapshot.folders)) {
    const entry = listing.folders.find((folder) => folder.id === id);
    if (entry) return entry;
  }
  return snapshot.rooms.find((room) => room.id === id);
};

export const demoPortal = {
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  get: () => snapshot,

  /** The portal's answer to "which rooms may this person see". */
  roomsFor: (persona: Persona, from: Snapshot = snapshot) =>
    persona === "client"
      ? from.rooms.filter(
          (room) =>
            room.id !== undefined && from.clientRoomIds.includes(room.id),
        )
      : from.rooms,

  listFolder: (id: number): FolderContents =>
    snapshot.folders[id] ?? { folders: [], files: [] },

  createRoom: (title: string, color: string) => {
    const id = nextId++;
    snapshot.rooms.unshift({
      id,
      title,
      tags: [],
      createdBy: { displayName: DEMO_PEOPLE.lawyer },
      filesCount: 0,
      foldersCount: 0,
      updated: now(),
      logo: { original: "", large: "", medium: "", small: "", color },
    });
    snapshot.folders[id] = { folders: [], files: [] };
    emit();
    return id;
  },

  tagRoom: (id: number, tags: string[]) => {
    const room = snapshot.rooms.find((candidate) => candidate.id === id);
    if (!room) return;
    room.tags = [...new Set([...(room.tags ?? []), ...tags])];
    room.updated = now();
    emit();
  },

  createFolder: (parentId: number, title: string) => {
    const id = nextId++;
    const stamp = now();
    contentsOf(parentId).folders.push({
      id,
      title,
      filesCount: 0,
      foldersCount: 0,
      created: stamp,
      updated: stamp,
    });
    snapshot.folders[id] = { folders: [], files: [] };
    const parent = entryOf(parentId);
    if (parent) {
      parent.foldersCount = (parent.foldersCount ?? 0) + 1;
      parent.updated = stamp;
    }
    emit();
    return id;
  },

  /** A file lands in a folder, and the folder's listing entry counts it. */
  addFile: (
    folderId: number,
    file: { title: string; bytes: number; by: string },
  ) => {
    const stamp = now();
    contentsOf(folderId).files.push({
      id: nextId++,
      title: file.title,
      fileExst: file.title.slice(file.title.lastIndexOf(".")),
      pureContentLength: file.bytes,
      createdBy: { displayName: file.by },
      created: stamp,
      updated: stamp,
      webUrl: "",
    });
    const entry = entryOf(folderId);
    if (entry) {
      entry.filesCount = (entry.filesCount ?? 0) + 1;
      entry.updated = stamp;
    }
    emit();
  },

  /** The demo client becomes a member of the room. */
  share: (roomId: number) => {
    if (!snapshot.clientRoomIds.includes(roomId)) {
      snapshot.clientRoomIds.push(roomId);
    }
    emit();
  },

  /** Back to the shipped demo; for tests. */
  reset: () => {
    snapshot = fresh();
    nextId = 900_000;
    emit();
  },
};

/** The seeder's words, answered by the demo portal. */
export const demoSeedClient = (): SeedClient => ({
  rooms: async () =>
    snapshot.rooms.flatMap((room) =>
      room.id === undefined
        ? []
        : [{ id: room.id, title: room.title ?? "", tags: room.tags ?? [] }],
    ),
  listFolder: async (folderId) => demoPortal.listFolder(folderId),
  createRoom: async (title, color) => demoPortal.createRoom(title, color),
  tagRoom: async (id, tags) => demoPortal.tagRoom(id, tags),
  createFolder: async (parentId, title) =>
    demoPortal.createFolder(parentId, title),
  createDocument: async (folderId, title) =>
    demoPortal.addFile(folderId, {
      title,
      bytes: 12_000,
      by: DEMO_PEOPLE.lawyer,
    }),
  uploadFile: async (folderId, title, bytes) =>
    demoPortal.addFile(folderId, {
      title,
      bytes: bytes.length,
      by: DEMO_PEOPLE.lawyer,
    }),
  invite: async (roomId) => demoPortal.share(roomId),
});
