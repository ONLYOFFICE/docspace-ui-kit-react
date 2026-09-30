// (c) Copyright Ascensio System SIA 2009-2026
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

"use client";

import { useEffect, useRef } from "react";

import { useStores } from "@onlyoffice/ai-chat";

import { useApi } from "../../../providers/api";
import socket, {
  SocketCommands,
  SocketEvents,
  type TOptSocket,
} from "../../../utils/socket";
import { FolderType } from "../../../enums";
import { CONTEXT_ROOM_CLOUD } from "./ContextRoomSync";
import { useContextRoom } from "./index";

/** The folder title the server types as the room's skills folder. */
export const AI_FOLDER_TITLE = ".ai";

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

const isAiFolder = (data: EntryEventData | undefined, roomId: string) =>
  !!data &&
  sameId(data.parentId, roomId) &&
  (data.title === AI_FOLDER_TITLE || data.type === FolderType.Ai);

/**
 * Follows the connected context room on the socket, and the room the user
 * is in while it is not connected. Lives above the chat pane, so the
 * connection stays true to the portal even while the chat is closed.
 *
 * For the connected room it listens in three places, because the portal
 * announces a change to the folder that holds the entry: the `.ai` folder
 * (files added, changed, removed -> the skills are read again, and a room
 * left without one is disconnected), the room (the `.ai` folder renamed
 * away or removed -> disconnected) and the rooms root (the room renamed ->
 * the button takes the new name; the room removed, or the user's access to
 * it -> disconnected).
 *
 * For the current room that is not connected it listens to the room and,
 * when it has one, to its `.ai` folder: the first skill file appearing there
 * connects the room, as opening the chat would have. An empty `.ai` folder
 * connects nothing.
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

  const connectedRoomId =
    selected?.cloud === CONTEXT_ROOM_CLOUD ? selected.room.id : undefined;
  const connectedRoomName =
    selected?.cloud === CONTEXT_ROOM_CLOUD ? selected.room.name : undefined;
  const currentRoomId = current?.id;
  const currentRoomName = current?.name;

  const refreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!connectedRoomId && !currentRoomId) return undefined;

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

    // The connected room's `.ai` folder, once known.
    let connectedAiFolderId: string | undefined;
    // The current, not connected room's `.ai` folder, once known: the first
    // skill file landing there connects the room.
    let currentAiFolderId: string | undefined;
    const watchCurrent =
      !!currentRoomId && currentRoomId !== connectedRoomId;

    const scheduleSkillsRefresh = () => {
      if (refreshTimer.current) clearTimeout(refreshTimer.current);
      refreshTimer.current = setTimeout(() => {
        refreshTimer.current = null;
        const clouds = useCloudsStore.getState();
        // The picker offers only rooms with a skill file, so a change to
        // the skills may move this room in or out of it.
        void clouds.fetchContextFolders();
        void Promise.resolve(clouds.fetchRoomSkills()).then(() => {
          if (cancelled) return;
          // The last skill went: nothing is left to connect for.
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
      // The room has its first skill now, so the picker gains it too.
      void clouds.fetchContextFolders();
    };

    const handle = (opt?: TOptSocket) => {
      if (cancelled || !opt) return;
      const data = parseData(opt);
      const clouds = useCloudsStore.getState();

      if (opt.type === "file") {
        // A skill file of the connected room came, changed or went.
        if (connectedAiFolderId && sameId(data?.folderId, connectedAiFolderId)) {
          scheduleSkillsRefresh();
          return;
        }
        // The first skill file of the current room's empty `.ai` folder.
        if (
          watchCurrent &&
          currentAiFolderId &&
          opt.cmd !== "delete" &&
          sameId(data?.folderId, currentAiFolderId) &&
          isMarkdown(data)
        ) {
          connectCurrent();
        }
        return;
      }

      if (opt.type !== "folder") return;

      // The `.ai` folder of the connected room.
      if (connectedAiFolderId && sameId(opt.id, connectedAiFolderId)) {
        if (opt.cmd === "delete") {
          clouds.clearContextFolder();
          return;
        }
        if (opt.cmd === "update" && data) {
          const stillAiFolder =
            (data.title === undefined || data.title === AI_FOLDER_TITLE) &&
            (data.type === undefined || data.type === FolderType.Ai) &&
            (data.parentId === undefined ||
              sameId(data.parentId, connectedRoomId));
          if (!stillAiFolder) clouds.clearContextFolder();
        }
        return;
      }

      // The connected room itself.
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
          // The pick for the room already connected keeps the skills and
          // only takes over the name.
          clouds.selectContextFolder(CONTEXT_ROOM_CLOUD, {
            id: connectedRoomId,
            name: data.title,
          });
        }
        return;
      }

      if (!watchCurrent || !currentRoomId) return;

      // A `.ai` folder appearing in the current room: empty at birth, so
      // nothing connects yet — its first skill file will.
      if (opt.cmd === "create" && isAiFolder(data, currentRoomId)) {
        if (data?.id !== undefined && data.id !== null) {
          currentAiFolderId = String(data.id);
          subscribe([currentAiFolderId]);
        }
        return;
      }

      // The current room's `.ai` folder going away: forget it.
      if (currentAiFolderId && sameId(opt.id, currentAiFolderId)) {
        if (
          opt.cmd === "delete" ||
          (opt.cmd === "update" && data && !isAiFolder(data, currentRoomId))
        ) {
          currentAiFolderId = undefined;
        }
      }
    };

    socket?.on(SocketEvents.ModifyFolder, handle);

    if (watchCurrent && currentRoomId) {
      subscribe([currentRoomId]);
      aiApi
        .getRoomAiFolder(currentRoomId)
        .catch(() => null)
        .then((folder) => {
          if (cancelled || !folder) return;
          currentAiFolderId = folder.id;
          subscribe([folder.id]);
        });
    }

    if (connectedRoomId) {
      aiApi
        .getRoomAiFolder(connectedRoomId)
        .catch(() => null)
        .then((folder) => {
          if (cancelled) return;
          if (!folder || !folder.hasSkills) {
            // The folder (or its last skill, or the room) is gone already:
            // the socket would not tell us any more, so let go now.
            useCloudsStore.getState().clearContextFolder();
            return;
          }
          connectedAiFolderId = folder.id;
          subscribe([folder.roomsRootId, folder.roomId, folder.id]);
        });
    }

    return () => {
      cancelled = true;
      socket?.off(SocketEvents.ModifyFolder, handle);
      if (refreshTimer.current) {
        clearTimeout(refreshTimer.current);
        refreshTimer.current = null;
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
    useCloudsStore,
  ]);

  return null;
};

export default ContextRoomWatcher;
