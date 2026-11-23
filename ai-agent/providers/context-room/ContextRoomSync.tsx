"use client";

import { useEffect, useRef } from "react";

import { useStores } from "@onlyoffice/ai-chat";

import { useApi } from "../../../providers/api";
import {
  useContextRooms,
  useSyncedContextRoom,
  type SyncedContextRoom,
} from "./index";

// DocSpace is a single cloud to the chat library. The AI service lists the
// Instructions rooms under the same label (`CONTEXT_CLOUD` in ASC.AI.Chat),
// so the room connected here and a room picked from the list compare
// equal; the label itself is never shown, the menu skips the cloud level.
export const CONTEXT_ROOM_CLOUD = "docspace";

// The rooms a sync connected, by the provider's sync key holder: they
// outlive the chat pane as the key does. A sync whose rooms held no skills
// connected none.
const connectedBySync = new WeakMap<SyncedContextRoom, string[]>();

/**
 * Connects the rooms the host offers (the room the user is in, or an AI
 * project's Instructions rooms) as the chat's context, by default.
 * Mounted inside the chat pane, so it runs when the chat opens and whenever
 * the room changes while it stays open — not on every navigation with the
 * chat closed.
 *
 * Coming to a room (or opening the chat there for the first time) connects
 * it if it holds a `.ai` folder: one `GET /files/rooms/{id}/ai` decides. The
 * skills themselves are then read by the library's clouds store through the
 * AI service. Leaving the rooms it connected for a place without such a
 * room disconnects those rooms, and those alone: a skill set the user
 * picked beside them stays, and so does every skill set when the sync had
 * connected none. Nothing else is taken away: on its first sync,
 * or coming from a place with no such room, the skill sets the chat has
 * (the ones it brought back for the open conversation, or the user's own
 * picks) stay as they are.
 *
 * What the user does after that stands until the room changes: a Disconnect
 * in the room button, or another room picked from the composer's list, is
 * not undone by a reopen of the chat in the same room. A reopen only
 * refreshes the current room when it is still the one connected — its
 * skills are read again and a new name is taken over.
 */
const ContextRoomSync = () => {
  const rooms = useContextRooms();
  const synced = useSyncedContextRoom();
  const { aiApi } = useApi();
  const { useCloudsStore } = useStores();

  // The set of rooms is the sync key; a rename alone hands the store the
  // new name without another skills check.
  const idsKey = rooms.map((room) => room.id).join("\u0000");
  const namesKey = rooms.map((room) => room.name).join("\u0000");
  const roomsRef = useRef(rooms);
  roomsRef.current = rooms;

  useEffect(() => {
    const rooms = roomsRef.current;
    const clouds = useCloudsStore.getState();
    const here = idsKey || null;
    const connectedIds = (
      selected: typeof clouds.selectedContextFolders,
    ): string[] =>
      selected
        .filter((item) => item.cloud === CONTEXT_ROOM_CLOUD)
        .map((item) => item.room.id);

    if (synced.current === here) {
      // Same rooms as last time: the ones still connected take over their
      // names and are read again; a Disconnect, or another room picked
      // from the list, stands.
      const stillConnected = rooms.filter((room) =>
        connectedIds(clouds.selectedContextFolders).includes(room.id),
      );
      if (stillConnected.length > 0) {
        for (const room of stillConnected) {
          clouds.selectContextFolder(CONTEXT_ROOM_CLOUD, {
            id: room.id,
            name: room.name,
          });
        }
        void clouds.fetchRoomSkills();
      }
      return undefined;
    }

    // Only rooms this sync connected are its to take away. A first sync,
    // one whose check never landed, a place with no such room and rooms
    // that held no skills all left nothing of its own connected.
    const previous = synced.current;
    const dropOwnRooms = (store: typeof clouds) => {
      for (const id of connectedBySync.get(synced) ?? []) {
        store.deselectContextFolder(CONTEXT_ROOM_CLOUD, id);
      }
      connectedBySync.delete(synced);
    };
    synced.current = here;
    if (rooms.length === 0) {
      dropOwnRooms(clouds);
      return undefined;
    }

    let cancelled = false;
    let settled = false;
    Promise.all(
      rooms.map((room) => aiApi.hasRoomSkills(room.id).catch(() => false)),
    ).then((flags) => {
      settled = true;
      if (cancelled) return;
      const current = useCloudsStore.getState();
      const withSkills = rooms.filter((_, index) => flags[index]);
      if (withSkills.length === 0) {
        dropOwnRooms(current);
        return;
      }
      // The store reads the skills of a changed list itself (it compares
      // cloud, id and name in order); an unchanged list is read again here,
      // as a reopen of the chat wants.
      const before = current.selectedContextFolders;
      const unchanged =
        before.length === withSkills.length &&
        before.every(
          (item, index) =>
            item.cloud === CONTEXT_ROOM_CLOUD &&
            item.room.id === withSkills[index].id &&
            item.room.name === withSkills[index].name,
        );
      current.selectContextFolders(CONTEXT_ROOM_CLOUD, withSkills);
      connectedBySync.set(
        synced,
        withSkills.map((room) => room.id),
      );
      if (unchanged) {
        void current.fetchRoomSkills();
      }
    });

    return () => {
      cancelled = true;
      // A check that never landed is made again next time, from where the
      // sync stood before it.
      if (!settled && synced.current === here) {
        synced.current = previous;
      }
    };
  }, [aiApi, idsKey, namesKey, synced, useCloudsStore]);

  return null;
};

export default ContextRoomSync;
