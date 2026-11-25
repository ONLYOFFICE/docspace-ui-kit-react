"use client";

import React from "react";

import type { AiChatSourcesManager } from "../ai-chat-store";
import { CONTEXT_ROOM_CLOUD } from "../context-room/ContextRoomSync";

/** The widget options behind the Skill sets of the composer's slash menu. */
export type SkillSetMenuOptions = {
  /** The slash menu's "Manage skill sets...": the room picker, or the owner's. */
  onPickContextRooms: (() => void) | undefined;
  /** Hears a set disconnected from its row. */
  onDisconnectContextRoom:
    ((cloud: string, roomId: string) => void) | undefined;
  /** Hides the bin of every set. */
  hideContextRoomDisconnect: boolean;
  /** The "+" menu's "Manage skill sets...": the owner's room picker. */
  onManageSkillSets: (() => void) | undefined;
};

/**
 * The slash menu's Skill sets, as the chat's owner allows them.
 *
 * - An ordinary chat (no `sourcesManager`) picks its own sets: the widget
 *   gets the Instructions room picker and the disconnect callback, which has
 *   nothing to save.
 * - Inside an agent the sets are its settings. One who may change them (an
 *   Agent manager, `onManage` set) gets the disconnect callback, which
 *   hands the removed set to the agent (`onSkillRoomsChange`), and both
 *   "Manage skill sets..." (the slash menu's and the "+" menu's) open the
 *   host's selector of the agent's skill sets (`onManage("skills")`).
 * - A Member (`onManage` null) gets neither: no "Manage skill sets...", no
 *   bin and no callback.
 */
export const useSkillSetMenu = ({
  sourcesManager,
  onPickContextRooms,
}: {
  sourcesManager: AiChatSourcesManager | null | undefined;
  onPickContextRooms: () => void;
}): SkillSetMenuOptions => {
  const manage = sourcesManager?.onManage ?? null;
  const locked = !!sourcesManager && !manage;
  const onManageSkillSets = React.useMemo(
    () => (manage ? () => manage("skills") : undefined),
    [manage],
  );
  const onSkillRoomsChange = sourcesManager?.onSkillRoomsChange;

  const onDisconnectContextRoom = React.useCallback(
    (cloud: string, roomId: string) => {
      if (cloud !== CONTEXT_ROOM_CLOUD) return;
      onSkillRoomsChange?.({ added: [], removed: [roomId] });
    },
    [onSkillRoomsChange],
  );

  return {
    onPickContextRooms: locked
      ? undefined
      : (onManageSkillSets ?? onPickContextRooms),
    onDisconnectContextRoom: locked ? undefined : onDisconnectContextRoom,
    hideContextRoomDisconnect: locked,
    onManageSkillSets,
  };
};
