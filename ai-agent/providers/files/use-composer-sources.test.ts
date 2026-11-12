import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";

// `ContextRoomSync` (the cloud id) reaches the chat library, whose styles
// jsdom cannot load; the hook under test needs nothing from it.
vi.mock("@onlyoffice/ai-chat", () => ({
  useStores: () => ({}),
  FOLDER_CONTEXTS_LIMIT: 20,
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
  selectedFolderContexts: Connected;
  deselectFolderContext: (cloud: string, id: string) => void;
};
const deselectFolderContext = vi.fn();
const onAddContextFolder = vi.fn();
const useCloudsStore = ((selector: (s: typeof state) => unknown) =>
  selector(state)) as unknown as Parameters<
  typeof useComposerSourceLists
>[0]["useCloudsStore"];

const onPickContextRooms = vi.fn();
const onPickKnowledgeRooms = vi.fn();
const onOpenContextRoom = vi.fn();

let sourcesManager: { onManage: (() => void) | null } | null = null;
const lists = (knowledgePickerHidden = false) =>
  renderHook(() =>
    useComposerSourceLists({
      useCloudsStore,
      onPickContextRooms,
      onPickKnowledgeRooms,
      onOpenContextRoom,
      onAddContextFolder,
      knowledgePickerHidden,
      sourcesManager,
    }),
  ).result.current;

describe("useComposerSourceLists", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sourcesManager = null;
    state = {
      selectedContextFolders: [],
      selectedKnowledgeFolders: [],
      clearKnowledgeFolder,
      selectedFolderContexts: [],
      deselectFolderContext,
    };
  });

  it("offers only Manage sources while no room is connected", () => {
    const { composerSkills, composerKnowledge } = lists();
    expect(composerSkills.map((row) => row.text)).toEqual(["Manage sources"]);
    expect(composerKnowledge?.map((row) => row.text)).toEqual([
      "Manage sources",
    ]);

    composerSkills[0].onClick?.();
    expect(onPickContextRooms).toHaveBeenCalledTimes(1);
    composerKnowledge?.[0].onClick?.();
    expect(onPickKnowledgeRooms).toHaveBeenCalledTimes(1);
  });

  it("lists the connected rooms of the portal, ticked, above Manage sources", () => {
    const legal = { id: "12", name: "Legal" };
    state.selectedContextFolders = [
      { cloud: CONTEXT_ROOM_CLOUD, room: legal },
      { cloud: "elsewhere", room: { id: "3", name: "Foreign" } },
    ];
    const { composerSkills } = lists();
    expect(
      composerSkills.map((row) => (row.isSeparator ? "|" : row.text)),
    ).toEqual(["Legal", "|", "Manage sources"]);
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

  it("offers Disconnect instead of Manage sources while knowledge search is off", () => {
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
    // Skill sets keep their Manage sources.
    expect(composerSkills.at(-1)?.text).toBe("Manage sources");
  });

  describe("Data sources", () => {
    const folder = (id: number) => ({
      cloud: CONTEXT_ROOM_CLOUD,
      room: { id: String(id), name: `Folder ${id}` },
    });

    it("offers only Manage sources while no folder is connected", () => {
      const { composerDataSources } = lists();
      expect(composerDataSources.map((row) => row.text)).toEqual([
        "Manage sources",
      ]);
      composerDataSources[0].onClick?.();
      expect(onAddContextFolder).toHaveBeenCalledTimes(1);
    });

    it("lists every connected folder, each with its way out one level down", () => {
      state.selectedFolderContexts = [folder(1), folder(2)];
      const { composerDataSources } = lists();
      expect(
        composerDataSources.map((row) => (row.isSeparator ? "|" : row.text)),
      ).toEqual(["Folder 1", "Folder 2", "|", "Manage sources"]);
      expect(composerDataSources[1].checked).toBe(true);
      expect(composerDataSources[1].items?.map((row) => row.text)).toEqual([
        "Disconnect",
      ]);
      composerDataSources[1].items?.[0].onClick?.();
      expect(deselectFolderContext).toHaveBeenCalledWith(
        CONTEXT_ROOM_CLOUD,
        "2",
      );
    });

    it("stops offering Manage sources at the limit", () => {
      state.selectedFolderContexts = Array.from({ length: 20 }, (_, i) =>
        folder(i + 1),
      );
      const { composerDataSources } = lists();
      expect(composerDataSources).toHaveLength(20);
      expect(
        composerDataSources.some((row) => row.text === "Manage sources"),
      ).toBe(false);
    });
  });

  describe("inside an AI project", () => {
    const room = {
      cloud: CONTEXT_ROOM_CLOUD,
      room: { id: "12", name: "Legal" },
    };

    it("opens the project's settings from Manage sources, not the room selector", () => {
      const onManage = vi.fn();
      sourcesManager = { onManage };
      state.selectedContextFolders = [room];
      state.selectedKnowledgeFolders = [room];
      const { composerSkills, composerKnowledge } = lists();
      composerSkills.at(-1)?.onClick?.();
      composerKnowledge.at(-1)?.onClick?.();
      expect(onManage).toHaveBeenCalledTimes(2);
      expect(onPickContextRooms).not.toHaveBeenCalled();
      expect(onPickKnowledgeRooms).not.toHaveBeenCalled();
    });

    it("only lists the rooms for a member who cannot change the project", () => {
      sourcesManager = { onManage: null };
      state.selectedContextFolders = [room];
      const { composerSkills, composerKnowledge } = lists();
      expect(composerSkills.map((row) => row.text)).toEqual(["Legal"]);
      expect(composerKnowledge).toEqual([]);
    });
  });
});
