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
import { useContextRoom } from "./index";

/** Skill re-reads are coalesced over this window: an upload lands as several events. */
const SKILLS_REFRESH_DELAY_MS = 300;

const roomPart = (id: string) => `DIR-${id}`;

const sameId = (a: unknown, b: unknown): boolean =>
  a !== undefined && a !== null && String(a) === String(b);

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
 * Follows the connected context room on the socket, and the room the user
 * is in while it is not connected. Lives above the chat pane, so the
 * connection stays true to the portal even while the chat is closed.
 *
 * The skills of a room are the Markdown files in the root of an
 * Instructions room, so the room itself is the skills folder. For the
 * connected room it listens in two places, because the portal announces a
 * change to the folder that holds the entry: the room (files added,
 * changed, removed -> the skills are read again, and a room left without
 * one is disconnected) and the rooms root (the room renamed -> the button
 * takes the new name; the room removed, or the user's access to it ->
 * disconnected).
 *
 * For the current room that is not connected it listens to the room: the
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
  const current = useContextRoom();
  const { aiApi } = useApi();
  const { useCloudsStore } = useStores();
  const selected = useCloudsStore((s) => s.selectedContextFolder);
  const contextFolders = useCloudsStore((s) => s.contextFolders);
  const listedRoomsKey = contextFolders
    .filter((folder) => folder.cloud === CONTEXT_ROOM_CLOUD)
    .flatMap((folder) => folder.rooms.map((room) => room.id))
    .sort()
    .join("\u0000");

  const connectedRoomId =
    selected?.cloud === CONTEXT_ROOM_CLOUD ? selected.room.id : undefined;
  const connectedRoomName =
    selected?.cloud === CONTEXT_ROOM_CLOUD ? selected.room.name : undefined;
  const currentRoomId = current?.id;
  const currentRoomName = current?.name;

  const refreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const listedRoomIds = new Set(
      listedRoomsKey ? listedRoomsKey.split("\u0000") : [],
    );
    if (!connectedRoomId && !currentRoomId && listedRoomIds.size === 0) {
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

    // Whether the connected room was confirmed as a skills room: file events
    // in it are acted on only after that, a lookup that failed leaves the
    // connection as it is.
    let connectedConfirmed = false;
    // Whether the current, not connected room is a skills room without a
    // skill file yet: the first Markdown file landing there connects it.
    let currentAwaitsSkill = false;
    const watchCurrent = !!currentRoomId && !connectedRoomId;

    const scheduleSkillsRefresh = () => {
      scheduleListRefresh();
      if (refreshTimer.current) clearTimeout(refreshTimer.current);
      refreshTimer.current = setTimeout(() => {
        refreshTimer.current = null;
        const clouds = useCloudsStore.getState();
        void Promise.resolve(clouds.fetchRoomSkills()).then(() => {
          if (cancelled) return;
          const state = useCloudsStore.getState();
          if (
            state.selectedContextFolder?.cloud === CONTEXT_ROOM_CLOUD &&
            state.selectedContextFolder.room.id === connectedRoomId &&
            state.roomSkills.length === 0
          ) {
            state.clearContextFolder();
          }
        });
      }, SKILLS_REFRESH_DELAY_MS);
    };

    const connectCurrent = () => {
      if (!currentRoomId || currentRoomName === undefined) return;
      const clouds = useCloudsStore.getState();
      clouds.selectContextFolder(CONTEXT_ROOM_CLOUD, {
        id: currentRoomId,
        name: currentRoomName,
      });
      scheduleListRefresh();
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
        if (connectedConfirmed && sameId(data?.folderId, connectedRoomId)) {
          scheduleSkillsRefresh();
          return;
        }
        if (
          watchCurrent &&
          currentAwaitsSkill &&
          opt.cmd !== "delete" &&
          sameId(data?.folderId, currentRoomId) &&
          isMarkdown(data)
        ) {
          currentAwaitsSkill = false;
          connectCurrent();
        }
        return;
      }

      if (opt.type !== "folder") return;

      if (connectedRoomId && sameId(opt.id, connectedRoomId)) {
        if (opt.cmd === "delete") {
          clouds.clearContextFolder();
          return;
        }
        if (
          opt.cmd === "update" &&
          data?.title &&
          data.title !== connectedRoomName
        ) {
          clouds.selectContextFolder(CONTEXT_ROOM_CLOUD, {
            id: connectedRoomId,
            name: data.title,
          });
        }
      }
    };

    socket?.on(SocketEvents.ModifyFolder, handle);

    if (watchCurrent && currentRoomId) {
      subscribe([currentRoomId]);
      aiApi
        .getRoomSkillsFolder(currentRoomId)
        .catch(() => null)
        .then((folder) => {
          if (cancelled || !folder || folder.hasSkills) return;
          currentAwaitsSkill = true;
        });
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

    if (connectedRoomId) {
      let failed = false;
      aiApi
        .getRoomSkillsFolder(connectedRoomId)
        .catch((error: unknown) => {
          const status = (error as { status?: number }).status;
          if (status === 401 || status === 403) return null;
          failed = true;
          return null;
        })
        .then((folder) => {
          if (cancelled || failed) return;
          if (!folder || !folder.hasSkills) {
            useCloudsStore.getState().clearContextFolder();
            return;
          }
          connectedConfirmed = true;
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
  }, [
    aiApi,
    connectedRoomId,
    connectedRoomName,
    currentRoomId,
    currentRoomName,
    listedRoomsKey,
    useCloudsStore,
  ]);

  return null;
};

export default ContextRoomWatcher;
