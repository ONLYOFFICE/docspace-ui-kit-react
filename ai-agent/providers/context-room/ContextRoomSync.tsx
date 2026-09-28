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

import { useEffect } from "react";

import { useStores } from "@onlyoffice/ai-chat";

import { useApi } from "../../../providers/api";
import { useContextRoom } from "./index";

// DocSpace is a single cloud to the chat library; the label is never shown
// because the host offers no room picker (no `getContextFolders`).
export const CONTEXT_ROOM_CLOUD = "docspace";

/**
 * Connects the room the user is in as the chat's context while the chat is
 * open. Mounted inside the chat pane, so it runs when the chat opens and
 * whenever the room changes while it stays open — not on every navigation
 * with the chat closed.
 *
 * A room is connected only when it holds a `.ai` folder: one
 * `GET /files/rooms/{id}/ai` decides. The skills themselves are then read by
 * the library's clouds store through the AI service. Outside a room, or in a
 * room without the folder, any earlier connection is dropped; the library's
 * own "Disconnect room" entry is hidden by the host, so this is the one way
 * a connection ends.
 */
const ContextRoomSync = () => {
  const room = useContextRoom();
  const { aiApi } = useApi();
  const { useCloudsStore } = useStores();

  const roomId = room?.id;
  const roomName = room?.name;

  useEffect(() => {
    const clouds = useCloudsStore.getState();
    if (!roomId || roomName === undefined) {
      clouds.clearContextFolder();
      return undefined;
    }

    let cancelled = false;
    aiApi
      .hasRoomAiFolder(roomId)
      .catch(() => false)
      .then((hasAiFolder) => {
        if (cancelled) return;
        const current = useCloudsStore.getState();
        if (hasAiFolder) {
          current.selectContextFolder(CONTEXT_ROOM_CLOUD, {
            id: roomId,
            name: roomName,
          });
        } else {
          current.clearContextFolder();
        }
      });

    return () => {
      cancelled = true;
    };
  }, [aiApi, roomId, roomName, useCloudsStore]);

  return null;
};

export default ContextRoomSync;
