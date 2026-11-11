import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";

// `ContextRoomSync` (the cloud id) reaches the chat library, whose styles
// jsdom cannot load; the hook under test needs nothing from it.
vi.mock("@onlyoffice/ai-chat", () => ({
  useStores: () => ({}),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, options?: { defaultValue?: string }) =>
      options?.defaultValue ?? key,
    i18n: { language: "en" },
  }),
}));

import { CONTEXT_ROOM_CLOUD } from "../context-room/ContextRoomSync";
import { useComposerSourceLists } from "./use-composer-sources";

type Connected = { cloud: string; room: { id: string; name: string } }[];

const clearKnowledgeFolder = vi.fn();
let state: {
  selectedContextFolders: Connected;
  selectedKnowledgeFolders: Connected;
  clearKnowledgeFolder: () => void;
};
const useCloudsStore = ((selector: (s: typeof state) => unknown) =>
  selector(state)) as unknown as Parameters<
  typeof useComposerSourceLists
>[0]["useCloudsStore"];

const onPickContextRooms = vi.fn();
const onPickKnowledgeRooms = vi.fn();
const onOpenContextRoom = vi.fn();

const lists = (knowledgePickerHidden = false) =>
  renderHook(() =>
    useComposerSourceLists({
      useCloudsStore,
      onPickContextRooms,
      onPickKnowledgeRooms,
      onOpenContextRoom,
      knowledgePickerHidden,
    }),
  ).result.current;

describe("useComposerSourceLists", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    state = {
      selectedContextFolders: [],
      selectedKnowledgeFolders: [],
      clearKnowledgeFolder,
    };
  });

  it("offers only Manage while no room is connected", () => {
    const { composerSkills, composerKnowledge } = lists();
    expect(composerSkills.map((row) => row.text)).toEqual(["Manage"]);
    expect(composerKnowledge?.map((row) => row.text)).toEqual(["Manage"]);

    composerSkills[0].onClick?.();
    expect(onPickContextRooms).toHaveBeenCalledTimes(1);
    composerKnowledge?.[0].onClick?.();
    expect(onPickKnowledgeRooms).toHaveBeenCalledTimes(1);
  });

  it("lists the connected rooms of the portal, ticked, above Manage", () => {
    const legal = { id: "12", name: "Legal" };
    state.selectedContextFolders = [
      { cloud: CONTEXT_ROOM_CLOUD, room: legal },
      { cloud: "elsewhere", room: { id: "3", name: "Foreign" } },
    ];
    const { composerSkills } = lists();
    expect(
      composerSkills.map((row) => (row.isSeparator ? "|" : row.text)),
    ).toEqual(["Legal", "|", "Manage"]);
    expect(composerSkills[0]).toMatchObject({
      checked: true,
      icon: "btn-room",
    });

    composerSkills[0].onClick?.();
    expect(onOpenContextRoom).toHaveBeenCalledWith(CONTEXT_ROOM_CLOUD, legal);
  });

  it("has no Knowledge bases row while knowledge search is off and none is connected", () => {
    expect(lists(true).composerKnowledge).toEqual([]);
  });

  it("offers Disconnect instead of Manage while knowledge search is off", () => {
    state.selectedKnowledgeFolders = [
      { cloud: CONTEXT_ROOM_CLOUD, room: { id: "7", name: "Wiki" } },
    ];
    const { composerKnowledge, composerSkills } = lists(true);
    expect(
      composerKnowledge.map((row) => (row.isSeparator ? "|" : row.text)),
    ).toEqual(["Wiki", "|", "Disconnect"]);
    composerKnowledge[2].onClick?.();
    expect(clearKnowledgeFolder).toHaveBeenCalledTimes(1);
    expect(onPickKnowledgeRooms).not.toHaveBeenCalled();
    // Skill sets keep their Manage.
    expect(composerSkills.at(-1)?.text).toBe("Manage");
  });
});
