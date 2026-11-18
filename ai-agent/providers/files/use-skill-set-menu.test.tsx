import { describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";

// `ContextRoomSync` (the cloud id) reaches the chat library, whose styles
// jsdom cannot load; the hook under test needs nothing from it.
vi.mock("@onlyoffice/ai-chat", () => ({
  useStores: () => ({}),
}));

import type { AiChatSourcesManager } from "../ai-chat-store";
import { CONTEXT_ROOM_CLOUD } from "../context-room/ContextRoomSync";
import { useSkillSetMenu } from "./use-skill-set-menu";

const menuFor = (sourcesManager: AiChatSourcesManager | null) => {
  const onPickContextRooms = vi.fn();
  const { result } = renderHook(() =>
    useSkillSetMenu({ sourcesManager, onPickContextRooms }),
  );
  return { menu: result.current, onPickContextRooms };
};

describe("useSkillSetMenu: the Skill sets of the agent's slash menu", () => {
  it("gives a plain chat the room picker and the disconnect callback", () => {
    const { menu, onPickContextRooms } = menuFor(null);

    expect(menu.onPickContextRooms).toBe(onPickContextRooms);
    expect(menu.onDisconnectContextRoom).toBeTypeOf("function");
    expect(menu.hideContextRoomDisconnect).toBe(false);
    // The "+" menu's row opens the slash menu's own picker there.
    expect(menu.onManageSkillSets).toBeUndefined();

    // Nothing to save: the chat keeps its sets itself.
    expect(() =>
      menu.onDisconnectContextRoom?.(CONTEXT_ROOM_CLOUD, "7"),
    ).not.toThrow();
  });

  it("gives an Agent manager the picker and a disconnect saved to the agent", () => {
    const onManage = vi.fn();
    const onSkillRoomsChange = vi.fn();
    const { menu, onPickContextRooms } = menuFor({
      onManage,
      onSkillRoomsChange,
    });

    expect(menu.onPickContextRooms).toBe(onPickContextRooms);
    expect(menu.hideContextRoomDisconnect).toBe(false);
    expect(menu.onManageSkillSets).toBe(onManage);

    menu.onDisconnectContextRoom?.(CONTEXT_ROOM_CLOUD, "7");
    expect(onSkillRoomsChange).toHaveBeenCalledTimes(1);
    expect(onSkillRoomsChange).toHaveBeenCalledWith({
      added: [],
      removed: ["7"],
    });
  });

  it("hands the agent no room of another cloud", () => {
    const onSkillRoomsChange = vi.fn();
    const { menu } = menuFor({ onManage: vi.fn(), onSkillRoomsChange });

    menu.onDisconnectContextRoom?.("google", "abc");
    expect(onSkillRoomsChange).not.toHaveBeenCalled();
  });

  it("gives a Member neither the picker nor the disconnect callback", () => {
    const { menu } = menuFor({ onManage: null });

    expect(menu.onPickContextRooms).toBeUndefined();
    expect(menu.onDisconnectContextRoom).toBeUndefined();
    expect(menu.hideContextRoomDisconnect).toBe(true);
    expect(menu.onManageSkillSets).toBeUndefined();
  });
});
