import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import type { ComposerMenuItem } from "@onlyoffice/ai-chat";

// `ContextRoomSync` (the cloud id) reaches the chat library, whose styles
// jsdom cannot load; the hook under test needs nothing from it.
vi.mock("@onlyoffice/ai-chat", () => ({
  useStores: () => ({}),
  FOLDER_CONTEXTS_LIMIT: 20,
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (
      key: string,
      options?: { defaultValue?: string; name?: string },
    ): string =>
      (options?.defaultValue ?? key).replace("{{name}}", options?.name ?? ""),
    i18n: { language: "en" },
  }),
}));

import { CONTEXT_ROOM_CLOUD } from "../context-room/ContextRoomSync";
import { useComposerSourceLists } from "./use-composer-sources";

type Connected = {
  cloud: string;
  room: { id: string; name: string; kind?: "room" | "folder" };
}[];

let state: {
  selectedKnowledgeFolders: Connected;
  deselectKnowledgeFolder: (cloud: string, id: string) => void;
  selectedFolderContexts: Connected;
  deselectFolderContext: (cloud: string, id: string) => void;
};
const deselectKnowledgeFolder = vi.fn();
const deselectFolderContext = vi.fn();
const onAddContextFolder = vi.fn();
const useCloudsStore = ((selector: (s: typeof state) => unknown) =>
  selector(state)) as unknown as Parameters<
  typeof useComposerSourceLists
>[0]["useCloudsStore"];

const onPickKnowledgeRooms = vi.fn();
const onOpenContextRoom = vi.fn();

let sourcesManager: {
  onManage: ((kind: "skills" | "knowledge") => void) | null;
} | null = null;
const lists = (knowledgePickerHidden = false) =>
  renderHook(() =>
    useComposerSourceLists({
      useCloudsStore,
      onPickKnowledgeRooms,
      onOpenContextRoom,
      onAddContextFolder,
      knowledgePickerHidden,
      sourcesManager,
    }),
  ).result.current;

const texts = (rows: ComposerMenuItem[]) =>
  rows.map((row) => (row.isSeparator ? "|" : row.text));

const MANAGE_ROW = { icon: "btn-gear", tone: "link" };

describe("useComposerSourceLists", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sourcesManager = null;
    state = {
      selectedKnowledgeFolders: [],
      deselectKnowledgeFolder,
      selectedFolderContexts: [],
      deselectFolderContext,
    };
  });

  describe("Knowledge bases", () => {
    const wiki = { id: "7", name: "Wiki" };

    it("offers only Manage knowledge bases while no base is connected", () => {
      const { composerKnowledge } = lists();
      expect(texts(composerKnowledge)).toEqual(["Manage knowledge bases..."]);
      expect(composerKnowledge[0]).toMatchObject(MANAGE_ROW);
      composerKnowledge[0].onClick?.();
      expect(onPickKnowledgeRooms).toHaveBeenCalledTimes(1);
    });

    it("lists the connected bases of the portal as flat rows, Manage right under them", () => {
      state.selectedKnowledgeFolders = [
        { cloud: CONTEXT_ROOM_CLOUD, room: wiki },
        { cloud: "elsewhere", room: { id: "3", name: "Foreign" } },
      ];
      const { composerKnowledge } = lists();
      // No separator before the Manage row.
      expect(texts(composerKnowledge)).toEqual([
        "Wiki",
        "Manage knowledge bases...",
      ]);
      const [row] = composerKnowledge;
      expect(row.items).toBeUndefined();
      // Only connected bases are listed, so a tick would say nothing.
      expect(row.checked).toBeUndefined();
      row.onClick?.();
      expect(onOpenContextRoom).toHaveBeenCalledWith(CONTEXT_ROOM_CLOUD, wiki);
    });

    it("removes a base from its row, without running the row", () => {
      state.selectedKnowledgeFolders = [
        { cloud: CONTEXT_ROOM_CLOUD, room: wiki },
      ];
      const [row] = lists().composerKnowledge;
      expect(row.trailingAction).toMatchObject({
        icon: "btn-remove",
        label: "Remove Wiki",
      });
      row.trailingAction?.onClick();
      expect(deselectKnowledgeFolder).toHaveBeenCalledWith(
        CONTEXT_ROOM_CLOUD,
        "7",
      );
      expect(onOpenContextRoom).not.toHaveBeenCalled();
    });

    it("has no Knowledge bases entry while knowledge search is off and none is connected", () => {
      expect(lists(true).composerKnowledge).toEqual([]);
    });

    it("keeps the bases connected earlier, removable, and nothing to add one while knowledge search is off", () => {
      state.selectedKnowledgeFolders = [
        { cloud: CONTEXT_ROOM_CLOUD, room: wiki },
      ];
      const { composerKnowledge } = lists(true);
      expect(texts(composerKnowledge)).toEqual(["Wiki"]);
      expect(composerKnowledge[0].trailingAction?.label).toBe("Remove Wiki");
      expect(onPickKnowledgeRooms).not.toHaveBeenCalled();
    });
  });

  describe("Data sources", () => {
    const folder = (id: number, kind?: "room" | "folder") => ({
      cloud: CONTEXT_ROOM_CLOUD,
      room: { id: String(id), name: `Folder ${id}`, kind },
    });

    it("offers only Manage sources while no folder is connected", () => {
      const { composerDataSources } = lists();
      expect(texts(composerDataSources)).toEqual(["Manage sources..."]);
      expect(composerDataSources[0]).toMatchObject(MANAGE_ROW);
      composerDataSources[0].onClick?.();
      expect(onAddContextFolder).toHaveBeenCalledTimes(1);
    });

    it("lists every connected source as one flat row, Manage right under them", () => {
      state.selectedFolderContexts = [folder(1), folder(2)];
      const { composerDataSources } = lists();
      expect(texts(composerDataSources)).toEqual([
        "Folder 1",
        "Folder 2",
        "Manage sources...",
      ]);
      expect(composerDataSources[1].items).toBeUndefined();
      expect(composerDataSources[1].checked).toBeUndefined();
    });

    it("draws a room with the room icon and a folder with the folder icon", () => {
      state.selectedFolderContexts = [
        folder(1, "room"),
        folder(2, "folder"),
        // Picked before the kind was recorded: a folder.
        folder(3),
      ];
      const [room, plain, older] = lists().composerDataSources;
      expect(room.icon).toBe("btn-room");
      expect(plain.icon).toBe("source-context");
      expect(older.icon).toBe("source-context");
    });

    it("removes a source from its row", () => {
      state.selectedFolderContexts = [folder(1), folder(2)];
      const row = lists().composerDataSources[1];
      expect(row.trailingAction).toMatchObject({
        icon: "btn-remove",
        label: "Remove Folder 2",
      });
      row.trailingAction?.onClick();
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
        composerDataSources.some((row) => row.id === "data-source-manage"),
      ).toBe(false);
    });

    it("stays the user's own inside an agent", () => {
      sourcesManager = { onManage: null };
      state.selectedFolderContexts = [folder(1)];
      const { composerDataSources } = lists();
      expect(texts(composerDataSources)).toEqual([
        "Folder 1",
        "Manage sources...",
      ]);
      expect(composerDataSources[0].trailingAction).toBeDefined();
    });
  });

  describe("inside an agent", () => {
    const room = {
      cloud: CONTEXT_ROOM_CLOUD,
      room: { id: "12", name: "Legal" },
    };

    it("opens the agent's knowledge base selector from Manage knowledge bases, not the chat's own", () => {
      const onManage = vi.fn();
      sourcesManager = { onManage };
      state.selectedKnowledgeFolders = [room];
      const { composerKnowledge } = lists();
      composerKnowledge.at(-1)?.onClick?.();
      expect(onManage).toHaveBeenCalledTimes(1);
      expect(onManage).toHaveBeenCalledWith("knowledge");
      expect(onPickKnowledgeRooms).not.toHaveBeenCalled();
    });

    it("gives no one a remove control on a knowledge base", () => {
      sourcesManager = { onManage: vi.fn() };
      state.selectedKnowledgeFolders = [room];
      expect(lists().composerKnowledge[0].trailingAction).toBeUndefined();
    });

    it("only lists the bases for a member who cannot change the agent", () => {
      sourcesManager = { onManage: null };
      state.selectedKnowledgeFolders = [room];
      expect(texts(lists().composerKnowledge)).toEqual(["Legal"]);
      state.selectedKnowledgeFolders = [];
      expect(lists().composerKnowledge).toEqual([]);
    });

    it("offers no Manage knowledge bases while knowledge search is off", () => {
      sourcesManager = { onManage: vi.fn() };
      state.selectedKnowledgeFolders = [room];
      expect(texts(lists(true).composerKnowledge)).toEqual(["Legal"]);
    });
  });
});
