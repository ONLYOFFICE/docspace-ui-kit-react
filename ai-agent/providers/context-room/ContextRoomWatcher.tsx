"use client";

import { useEffect, useRef } from "react";

import { useStores } from "@onlyoffice/ai-chat";

import { useApi } from "../../../providers/api";
import socket, {
  SocketCommands,
  SocketEvents,
  type TOptSocket,
} from "../../../utils/socket";
import { CONTEXT_ROOM_CLOUD } from "./ContextRoomSync";
import { useContextRooms } from "./index";

/** Skill re-reads are coalesced over this window: an upload lands as several events. */
const SKILLS_REFRESH_DELAY_MS = 300;

const roomPart = (id: string) => `DIR-${id}`;

type EntryEventData = {
  id?: number | string;
  title?: string;
  fileExst?: string;
  parentId?: number | string;
  folderId?: number | string;
  type?: number;
};

const parseData = (opt: TOptSocket): EntryEventData | undefined => {
  if (!opt.data) return undefined;
  try {
    const parsed: unknown = JSON.parse(opt.data);
    return parsed && typeof parsed === "object"
      ? (parsed as EntryEventData)
      : undefined;
  } catch {
    return undefined;
  }
};

const isMarkdown = (data: EntryEventData | undefined): boolean =>
  (
    data?.fileExst ??
    data?.title?.slice(data.title.lastIndexOf(".")) ??
    ""
  ).toLowerCase() === ".md";

/**
 * Follows the connected context rooms on the socket, and the rooms the host
 * offers while they are not connected. Lives above the chat pane, so the
 * connection stays true to the portal even while the chat is closed.
 *
 * The skills of a room are the Markdown files in the root of an
 * Instructions room, so the room itself is the skills folder. For the
 * connected room it listens in two places, because the portal announces a
 * change to the folder that holds the entry: the room (files added,
 * changed, removed -> the skills are read again, and a room left without
 * one is disconnected) and the rooms root (the room renamed -> the pill
 * takes the new name; the room removed, or the user's access to it ->
 * disconnected). Each connected room is followed on its own: one of them
 * losing its skills disconnects that room alone.
 *
 * For an offered room that is not connected it listens to the room: the
 * first skill file appearing there connects the room, as opening the chat
 * would have. An Instructions room without a skill file connects nothing.
 *
 * For the rooms the composer's picker offers it listens to each room and
 * the rooms root as well: a room renamed or removed, a skill file coming
 * or going — any of these re-reads the list, which the AI service builds
 * from the rooms' content. A room gaining its first skills elsewhere is not
 * seen; the list catches up when the picker mounts again.
 *
 * Only parts nobody else holds are subscribed here and released here; the
 * file list subscribes to the folder it shows through the same socket, and
 * taking its subscription away would silence it.
 */
const ContextRoomWatcher = () => {
  const offered = useContextRooms();
  const { aiApi } = useApi();
  const { useCloudsStore } = useStores();
  const selected = useCloudsStore((s) => s.selectedContextFolders);
  const contextFolders = useCloudsStore((s) => s.contextFolders);
  const listedRoomsKey = contextFolders
    .filter((folder) => folder.cloud === CONTEXT_ROOM_CLOUD)
    .flatMap((folder) => folder.rooms.map((room) => room.id))
    .sort()
    .join("\u0000");

  // The rooms of this portal that are connected, and the offered ones that
  // are not, as keys: the effect reruns on a change of either set or name.
  const connected = selected
    .filter((item) => item.cloud === CONTEXT_ROOM_CLOUD)
    .map((item) => item.room);
  const connectedKey = connected
    .map((room) => `${room.id}\u0000${room.name}`)
    .join("\u0001");
  const offeredKey = offered
    .map((room) => `${room.id}\u0000${room.name}`)
    .join("\u0001");
  const connectedRef = useRef(connected);
  connectedRef.current = connected;
  const offeredRef = useRef(offered);
  offeredRef.current = offered;

  const refreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const connectedRooms = connectedRef.current;
    const offeredRooms = offeredRef.current;
    const connectedIds = new Set(connectedRooms.map((room) => room.id));
    const nameOf = new Map(connectedRooms.map((room) => [room.id, room.name]));
    // Offered rooms not yet connected are watched for their first skill
    // file — unless the user picked a room of their own from the list: that
    // choice stands, as it does for a reopen of the chat.
    const offeredIds = new Set(offeredRooms.map((room) => room.id));
    const userPicked = connectedRooms.some((room) => !offeredIds.has(room.id));
    const watched = userPicked
      ? []
      : offeredRooms.filter((room) => !connectedIds.has(room.id));
    const listedRoomIds = new Set(
      listedRoomsKey ? listedRoomsKey.split("\u0000") : [],
    );
    if (
      connectedIds.size === 0 &&
      watched.length === 0 &&
      listedRoomIds.size === 0
    ) {
      return undefined;
    }

    let cancelled = false;
    const mine = new Set<string>();

    const subscribe = (ids: (string | undefined)[]) => {
      const parts = ids
        .filter((id): id is string => !!id)
        .map(roomPart)
        .filter(
          (part) => !mine.has(part) && !socket?.socketSubscribers.has(part),
        );
      if (parts.length === 0) return;
      for (const part of parts) mine.add(part);
      socket?.emit(SocketCommands.Subscribe, {
        roomParts: parts,
        individual: true,
      });
    };

    let listRefreshTimer: ReturnType<typeof setTimeout> | null = null;
    const scheduleListRefresh = () => {
      if (listRefreshTimer) clearTimeout(listRefreshTimer);
      listRefreshTimer = setTimeout(() => {
        listRefreshTimer = null;
        if (cancelled) return;
        void useCloudsStore.getState().fetchContextFolders();
      }, SKILLS_REFRESH_DELAY_MS);
    };

    // Connected rooms whose skills folder the lookup confirmed.
    const confirmed = new Set<string>();
    // Watched rooms that hold no skill yet.
    const awaitingSkill = new Set<string>();

    // Re-read the skills of every connected room; a room left without one
    // is disconnected on its own.
    const scheduleSkillsRefresh = () => {
      scheduleListRefresh();
      if (refreshTimer.current) clearTimeout(refreshTimer.current);
      refreshTimer.current = setTimeout(() => {
        refreshTimer.current = null;
        const clouds = useCloudsStore.getState();
        void Promise.resolve(clouds.fetchRoomSkills()).then(() => {
          if (cancelled) return;
          const state = useCloudsStore.getState();
          for (const item of state.selectedContextFolders) {
            if (item.cloud !== CONTEXT_ROOM_CLOUD) continue;
            if (!connectedIds.has(item.room.id)) continue;
            const hasSkill = state.roomSkills.some(
              (skill) =>
                skill.cloud === CONTEXT_ROOM_CLOUD &&
                skill.roomId === item.room.id,
            );
            if (!hasSkill) {
              state.deselectContextFolder(CONTEXT_ROOM_CLOUD, item.room.id);
            }
          }
        });
      }, SKILLS_REFRESH_DELAY_MS);
    };

    const connectWatched = (roomId: string) => {
      const room = watched.find((item) => item.id === roomId);
      if (!room) return;
      const clouds = useCloudsStore.getState();
      clouds.selectContextFolder(CONTEXT_ROOM_CLOUD, {
        id: room.id,
        name: room.name,
      });
      // Connecting reruns this effect, whose cleanup would cancel a
      // scheduled refresh: the list is read right away instead.
      void clouds.fetchContextFolders();
    };

    const handle = (opt?: TOptSocket) => {
      if (cancelled || !opt) return;
      const data = parseData(opt);
      const clouds = useCloudsStore.getState();

      const touchesListed =
        (opt.type === "folder" && listedRoomIds.has(String(opt.id))) ||
        (opt.type === "file" &&
          data?.folderId !== undefined &&
          listedRoomIds.has(String(data.folderId)));
      if (touchesListed) scheduleListRefresh();

      if (opt.type === "file") {
        const folderId =
          data?.folderId === undefined ? undefined : String(data.folderId);
        if (folderId !== undefined && confirmed.has(folderId)) {
          scheduleSkillsRefresh();
          return;
        }
        if (
          folderId !== undefined &&
          awaitingSkill.has(folderId) &&
          opt.cmd !== "delete" &&
          isMarkdown(data)
        ) {
          awaitingSkill.delete(folderId);
          connectWatched(folderId);
        }
        return;
      }

      if (opt.type !== "folder") return;

      const id = String(opt.id);
      if (!connectedIds.has(id)) return;
      if (opt.cmd === "delete") {
        clouds.deselectContextFolder(CONTEXT_ROOM_CLOUD, id);
        return;
      }
      if (
        opt.cmd === "update" &&
        data?.title &&
        data.title !== nameOf.get(id)
      ) {
        clouds.selectContextFolder(CONTEXT_ROOM_CLOUD, {
          id,
          name: data.title,
        });
      }
    };

    socket?.on(SocketEvents.ModifyFolder, handle);

    if (watched.length > 0) {
      subscribe(watched.map((room) => room.id));
      for (const room of watched) {
        aiApi
          .getRoomSkillsFolder(room.id)
          .catch(() => null)
          .then((folder) => {
            if (cancelled || !folder || folder.hasSkills) return;
            awaitingSkill.add(room.id);
          });
      }
    }

    if (listedRoomIds.size > 0) {
      subscribe(Array.from(listedRoomIds));
      for (const roomId of listedRoomIds) {
        aiApi
          .getRoomSkillsFolder(roomId)
          .catch(() => null)
          .then((folder) => {
            if (cancelled || !folder) return;
            subscribe([folder.roomsRootId]);
          });
      }
    }

    for (const roomId of connectedIds) {
      let failed = false;
      aiApi
        .getRoomSkillsFolder(roomId)
        .catch((error: unknown) => {
          const status = (error as { status?: number }).status;
          if (status === 401 || status === 403) return null;
          failed = true;
          return null;
        })
        .then((folder) => {
          if (cancelled || failed) return;
          if (!folder || !folder.hasSkills) {
            useCloudsStore
              .getState()
              .deselectContextFolder(CONTEXT_ROOM_CLOUD, roomId);
            return;
          }
          confirmed.add(roomId);
          subscribe([folder.roomsRootId, folder.roomId]);
        });
    }

    return () => {
      cancelled = true;
      socket?.off(SocketEvents.ModifyFolder, handle);
      if (refreshTimer.current) {
        clearTimeout(refreshTimer.current);
        refreshTimer.current = null;
      }
      if (listRefreshTimer) {
        clearTimeout(listRefreshTimer);
        listRefreshTimer = null;
      }
      if (mine.size > 0) {
        socket?.emit(SocketCommands.Unsubscribe, {
          roomParts: Array.from(mine),
          individual: true,
        });
      }
    };
  }, [aiApi, connectedKey, offeredKey, listedRoomsKey, useCloudsStore]);

  return null;
};

export default ContextRoomWatcher;
