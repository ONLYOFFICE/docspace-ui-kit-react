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

type FolderEventData = {
  id?: number | string;
  title?: string;
  parentId?: number | string;
  folderId?: number | string;
  type?: number;
};

const parseData = (opt: TOptSocket): FolderEventData | undefined => {
  if (!opt.data) return undefined;
  try {
    const parsed: unknown = JSON.parse(opt.data);
    return parsed && typeof parsed === "object"
      ? (parsed as FolderEventData)
      : undefined;
  } catch {
    return undefined;
  }
};

/**
 * Follows the connected context room on the socket, and the room the user
 * is in while it is not connected. Lives above the chat pane, so the
 * connection stays true to the portal even while the chat is closed.
 *
 * For the connected room it listens in three places, because the portal
 * announces a change to the folder that holds the entry: the `.ai` folder
 * (files added, changed, removed -> the skills are read again), the room
 * (the `.ai` folder renamed away or removed -> disconnected) and the rooms
 * root (the room renamed -> the button takes the new name; the room removed,
 * or the user's access to it -> disconnected).
 *
 * For the current room that is not connected it listens to the room alone:
 * a `.ai` folder appearing there connects the room, as opening the chat
 * would have.
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
        .filter((part) => !mine.has(part) && !socket?.socketSubscribers.has(part));
      if (parts.length === 0) return;
      for (const part of parts) mine.add(part);
      socket?.emit(SocketCommands.Subscribe, { roomParts: parts, individual: true });
    };

    const scheduleSkillsRefresh = () => {
      if (refreshTimer.current) clearTimeout(refreshTimer.current);
      refreshTimer.current = setTimeout(() => {
        refreshTimer.current = null;
        void useCloudsStore.getState().fetchRoomSkills();
      }, SKILLS_REFRESH_DELAY_MS);
    };

    let aiFolderId: string | undefined;

    const handle = (opt?: TOptSocket) => {
      if (cancelled || !opt) return;
      const data = parseData(opt);
      const clouds = useCloudsStore.getState();

      if (opt.type === "file") {
        // A skill file of the connected room came, changed or went.
        if (aiFolderId && data && sameId(data.folderId, aiFolderId)) {
          scheduleSkillsRefresh();
        }
        return;
      }

      if (opt.type !== "folder") return;

      // The `.ai` folder of the connected room.
      if (aiFolderId && sameId(opt.id, aiFolderId)) {
        if (opt.cmd === "delete") {
          clouds.clearContextFolder();
          return;
        }
        if (opt.cmd === "update" && data) {
          const stillAiFolder =
            (data.title === undefined || data.title === AI_FOLDER_TITLE) &&
            (data.type === undefined || data.type === FolderType.Ai) &&
            (data.parentId === undefined || sameId(data.parentId, connectedRoomId));
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
        if (opt.cmd === "update" && data?.title && data.title !== connectedRoomName) {
          // The pick for the room already connected keeps the skills and
          // only takes over the name.
          clouds.selectContextFolder(CONTEXT_ROOM_CLOUD, {
            id: connectedRoomId,
            name: data.title,
          });
        }
        return;
      }

      // A `.ai` folder appearing in the current room while it is not
      // connected: connect it, as opening the chat there would have.
      if (
        opt.cmd === "create" &&
        currentRoomId &&
        currentRoomName !== undefined &&
        currentRoomId !== connectedRoomId &&
        data &&
        sameId(data.parentId, currentRoomId) &&
        (data.title === AI_FOLDER_TITLE || data.type === FolderType.Ai)
      ) {
        clouds.selectContextFolder(CONTEXT_ROOM_CLOUD, {
          id: currentRoomId,
          name: currentRoomName,
        });
      }
    };

    socket?.on(SocketEvents.ModifyFolder, handle);

    if (currentRoomId && currentRoomId !== connectedRoomId) {
      subscribe([currentRoomId]);
    }

    if (connectedRoomId) {
      aiApi
        .getRoomAiFolder(connectedRoomId)
        .catch(() => null)
        .then((folder) => {
          if (cancelled) return;
          if (!folder) {
            // The folder is gone already (or the room is): the socket would
            // not tell us any more, so let go now.
            useCloudsStore.getState().clearContextFolder();
            return;
          }
          aiFolderId = folder.id;
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
