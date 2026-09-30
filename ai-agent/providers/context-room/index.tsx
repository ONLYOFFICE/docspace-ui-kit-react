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

const SyncedContextRoomContext = createContext<SyncedContextRoom | null>(
  null,
);

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
