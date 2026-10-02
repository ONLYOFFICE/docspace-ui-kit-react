"use client";

import { useEffect } from "react";

import { useStores } from "@onlyoffice/ai-chat";

import { useApi } from "../../../providers/api";
import { useContextRoom, useSyncedContextRoom } from "./index";

// DocSpace is a single cloud to the chat library. The AI service lists the
// rooms with a `.ai` folder under the same label (`CONTEXT_CLOUD` in
// ASC.AI.Chat), so the room connected here and a room picked from the
// list compare equal; the label itself is never shown, the menu skips the
// cloud level.
export const CONTEXT_ROOM_CLOUD = "docspace";

/**
 * Connects the room the user is in as the chat's context, by default.
 * Mounted inside the chat pane, so it runs when the chat opens and whenever
 * the room changes while it stays open — not on every navigation with the
 * chat closed.
 *
 * Coming to a room (or opening the chat there for the first time) connects
 * it if it holds a `.ai` folder: one `GET /files/rooms/{id}/ai` decides. The
 * skills themselves are then read by the library's clouds store through the
 * AI service. Coming to a place without such a room drops any connection.
 *
 * What the user does after that stands until the room changes: a Disconnect
 * in the room button, or another room picked from the composer's list, is
 * not undone by a reopen of the chat in the same room. A reopen only
 * refreshes the current room when it is still the one connected — its
 * skills are read again and a new name is taken over.
 */
const ContextRoomSync = () => {
  const room = useContextRoom();
  const synced = useSyncedContextRoom();
  const { aiApi } = useApi();
  const { useCloudsStore } = useStores();

  const roomId = room?.id;
  const roomName = room?.name;

  useEffect(() => {
    const clouds = useCloudsStore.getState();
    const here = roomId ?? null;
    const isCurrentRoom = (
      selected: typeof clouds.selectedContextFolder,
    ): boolean =>
      !!roomId &&
      selected?.cloud === CONTEXT_ROOM_CLOUD &&
      selected.room.id === roomId;

    if (synced.current === here) {
      // The chat reopened where it was: the user's choice since stands.
      if (
        roomId &&
        roomName !== undefined &&
        isCurrentRoom(clouds.selectedContextFolder)
      ) {
        // The pick is skipped for the room already connected, except that
        // a changed name is taken over; the skills are read here — a file
        // added to the folder since should show up now.
        clouds.selectContextFolder(CONTEXT_ROOM_CLOUD, {
          id: roomId,
          name: roomName,
        });
        void clouds.fetchRoomSkills();
      }
      return undefined;
    }

    synced.current = here;
    if (!roomId || roomName === undefined) {
      clouds.clearContextFolder();
      return undefined;
    }

    let cancelled = false;
    let settled = false;
    aiApi
      .hasRoomAiFolder(roomId)
      .catch(() => false)
      .then((hasAiFolder) => {
        settled = true;
        if (cancelled) return;
        const current = useCloudsStore.getState();
        if (!hasAiFolder) {
          current.clearContextFolder();
          return;
        }
        const sameRoom = isCurrentRoom(current.selectedContextFolder);
        current.selectContextFolder(CONTEXT_ROOM_CLOUD, {
          id: roomId,
          name: roomName,
        });
        if (sameRoom) {
          // Picked from the list before coming here: the store keeps the
          // skills and switches, so read the skills again for the visit.
          void current.fetchRoomSkills();
        }
      });

    return () => {
      cancelled = true;
      // The check did not land (the chat closed, the room changed): let the
      // next run in this room start over instead of trusting a state that
      // was never applied.
      if (!settled && synced.current === here) {
        synced.current = undefined;
      }
    };
  }, [aiApi, roomId, roomName, synced, useCloudsStore]);

  return null;
};

export default ContextRoomSync;
