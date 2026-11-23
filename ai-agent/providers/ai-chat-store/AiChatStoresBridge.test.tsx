import React from "react";
import { act, render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { clouds, profiles, threads, router } = vi.hoisted(() => ({
  clouds: {
    selectContextFolder: vi.fn(),
    selectContextFolders: vi.fn(),
    clearContextFolder: vi.fn(),
    selectKnowledgeFolder: vi.fn(),
    selectKnowledgeFolders: vi.fn(),
    clearKnowledgeFolder: vi.fn(),
    clearFolderContext: vi.fn(),
    selectFolderContext: vi.fn(),
  },
  profiles: {
    profiles: [] as { id: string; name: string }[],
    initialized: false,
    profilesLoaded: false,
    init: vi.fn(),
    ensureProfiles: vi.fn(),
    getProfileById: vi.fn(),
    setSessionChatProfile: vi.fn(),
  },
  threads: { onSwitchToNewThread: vi.fn(), setDraft: vi.fn() },
  router: {
    currentPage: "chat" as "chat" | "history" | "initial-setup",
    goToChat: vi.fn(),
  },
}));

// A zustand hook as the bridge uses it: a selector call and `getState`.
const fakeStore = <T extends object>(state: T) =>
  Object.assign((selector: (s: T) => unknown) => selector(state), {
    getState: () => state,
  });

vi.mock("@onlyoffice/ai-chat", () => ({
  useStores: () => ({
    useRouter: fakeStore(router),
    useProfilesStore: fakeStore(profiles),
    useCloudsStore: fakeStore(clouds),
    useThreadsStore: fakeStore(threads),
    useAttachmentsStore: fakeStore({}),
  }),
}));

vi.mock("../files/use-analyze-lock", () => ({ useAnalyzeLock: () => false }));
vi.mock("../files/form-attachments", () => ({
  dropAnalyzeAttachment: vi.fn(),
}));

import AiChatStore from "./AiChatStore";
import { AiChatStoreProvider } from "./AiChatStoreProvider";
import AiChatStoresBridge from "./AiChatStoresBridge";

const renderBridge = (store: AiChatStore) =>
  render(
    <AiChatStoreProvider store={store}>
      <AiChatStoresBridge />
    </AiChatStoreProvider>,
  );

const PRESET = {
  profileId: "p1",
  profileName: "Claude",
  contextRooms: [],
  knowledgeRooms: [],
};

describe("AiChatStoresBridge", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    router.currentPage = "chat";
    profiles.initialized = false;
    profiles.profilesLoaded = false;
    profiles.getProfileById.mockImplementation((id: string) =>
      profiles.initialized ? { id, name: "Claude" } : null,
    );
    profiles.init.mockImplementation(async () => {
      profiles.initialized = true;
    });
  });

  it("waits for the models to load before picking the project's one", async () => {
    const store = new AiChatStore();
    renderBridge(store);
    await act(async () => {
      store.openPreset(PRESET);
    });
    expect(profiles.init).toHaveBeenCalledTimes(1);
    expect(profiles.setSessionChatProfile).toHaveBeenCalledTimes(1);
    expect(profiles.setSessionChatProfile).toHaveBeenCalledWith({
      id: "p1",
      name: "Claude",
    });
    expect(store.pendingPreset).toBeNull();
  });

  it("reads the whole list for a model outside the assigned ones", async () => {
    // init reads the assigned profiles only; the project's model is another.
    profiles.initialized = true;
    profiles.getProfileById.mockImplementation((id: string) =>
      profiles.profilesLoaded ? { id, name: "Other" } : null,
    );
    profiles.ensureProfiles.mockImplementation(async () => {
      profiles.profilesLoaded = true;
    });
    const store = new AiChatStore();
    renderBridge(store);
    await act(async () => {
      store.openPreset(PRESET);
    });
    expect(profiles.ensureProfiles).toHaveBeenCalledTimes(1);
    expect(profiles.setSessionChatProfile).toHaveBeenCalledTimes(1);
    expect(profiles.setSessionChatProfile).toHaveBeenCalledWith({
      id: "p1",
      name: "Other",
    });
  });

  it("keeps a newer project's model when an older lookup resolves late", async () => {
    // Project A's model needs the whole list; project B's is assigned.
    profiles.initialized = true;
    profiles.getProfileById.mockImplementation((id: string) =>
      id === "p2" || profiles.profilesLoaded ? { id, name: id } : null,
    );
    let finishLoad = () => {};
    profiles.ensureProfiles.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          finishLoad = () => {
            profiles.profilesLoaded = true;
            resolve();
          };
        }),
    );
    const store = new AiChatStore();
    renderBridge(store);
    act(() => {
      store.openPreset(PRESET);
    });
    act(() => {
      store.openPreset({ ...PRESET, profileId: "p2" });
    });
    await act(async () => {
      finishLoad();
    });
    expect(profiles.setSessionChatProfile).toHaveBeenCalledTimes(1);
    expect(profiles.setSessionChatProfile).toHaveBeenCalledWith({
      id: "p2",
      name: "p2",
    });
  });

  it("picks the model at once when the models are loaded", () => {
    profiles.initialized = true;
    const store = new AiChatStore();
    renderBridge(store);
    act(() => {
      store.openPreset(PRESET);
    });
    expect(profiles.init).not.toHaveBeenCalled();
    expect(profiles.setSessionChatProfile).toHaveBeenCalledWith({
      id: "p1",
      name: "Claude",
    });
  });

  it("connects a preset's rooms as whole lists", async () => {
    const store = new AiChatStore();
    profiles.initialized = true;
    renderBridge(store);
    await act(async () => {
      store.openPreset({
        ...PRESET,
        contextRooms: [
          { cloud: "docspace", id: "1", name: "Brand" },
          { cloud: "docspace", id: "2", name: "Legal" },
        ],
        knowledgeRooms: [{ cloud: "docspace", id: "9", name: "Docs" }],
      });
    });
    expect(clouds.selectContextFolders).toHaveBeenCalledWith("docspace", [
      { id: "1", name: "Brand" },
      { id: "2", name: "Legal" },
    ]);
    expect(clouds.selectKnowledgeFolders).toHaveBeenCalledWith("docspace", [
      { id: "9", name: "Docs" },
    ]);
    expect(clouds.clearContextFolder).not.toHaveBeenCalled();
    expect(clouds.clearKnowledgeFolder).not.toHaveBeenCalled();
  });

  it("opens a fresh chat with the folder the preset remembers, else without one", async () => {
    const store = new AiChatStore();
    profiles.initialized = true;
    renderBridge(store);
    await act(async () => {
      store.openPreset({
        ...PRESET,
        folderContext: {
          cloud: "docspace",
          id: "77",
          name: "Reports",
          path: "My documents / Reports",
          kind: "room",
        },
      });
    });
    expect(clouds.selectFolderContext).toHaveBeenCalledWith("docspace", {
      id: "77",
      name: "Reports",
      path: "My documents / Reports",
      kind: "room",
    });
    expect(clouds.clearFolderContext).not.toHaveBeenCalled();

    await act(async () => {
      store.openPreset(PRESET);
    });
    expect(clouds.clearFolderContext).toHaveBeenCalledTimes(1);

    // Applied in place, the chat keeps the folder the user connected.
    await act(async () => {
      store.applyPreset({ ...PRESET, folderContext: null });
    });
    expect(clouds.clearFolderContext).toHaveBeenCalledTimes(1);
    expect(clouds.selectFolderContext).toHaveBeenCalledTimes(1);
  });

  it("clears the rooms of an empty preset and adds a mixed-cloud list one by one", async () => {
    const store = new AiChatStore();
    profiles.initialized = true;
    renderBridge(store);
    await act(async () => {
      store.openPreset(PRESET);
    });
    expect(clouds.clearContextFolder).toHaveBeenCalledTimes(1);
    expect(clouds.clearKnowledgeFolder).toHaveBeenCalledTimes(1);
    expect(clouds.selectContextFolders).not.toHaveBeenCalled();

    await act(async () => {
      store.openPreset({
        ...PRESET,
        contextRooms: [
          { cloud: "a", id: "1", name: "One" },
          { cloud: "b", id: "2", name: "Two" },
        ],
      });
    });
    expect(clouds.clearContextFolder).toHaveBeenCalledTimes(2);
    expect(clouds.selectContextFolder).toHaveBeenCalledWith("a", {
      id: "1",
      name: "One",
    });
    expect(clouds.selectContextFolder).toHaveBeenCalledWith("b", {
      id: "2",
      name: "Two",
    });
    expect(clouds.selectContextFolders).not.toHaveBeenCalled();
  });

  it("leaves the history when the panel closes, so it does not open by itself elsewhere", () => {
    const store = new AiChatStore();
    renderBridge(store);
    act(() => {
      store.open();
    });
    router.currentPage = "history";
    act(() => {
      store.close();
    });
    expect(router.goToChat).toHaveBeenCalledTimes(1);
  });

  it("keeps the setup page when the panel closes", () => {
    const store = new AiChatStore();
    renderBridge(store);
    act(() => {
      store.open();
    });
    router.currentPage = "initial-setup";
    act(() => {
      store.toggle();
    });
    expect(router.goToChat).not.toHaveBeenCalled();
  });

  it("puts a fresh preset's draft into the new conversation, after the switch, once", () => {
    profiles.initialized = true;
    const store = new AiChatStore();
    renderBridge(store);
    act(() => {
      store.openPreset({ ...PRESET, draft: "/document-summary " });
    });
    expect(threads.setDraft).toHaveBeenCalledTimes(1);
    expect(threads.setDraft).toHaveBeenCalledWith("/document-summary ");
    expect(
      threads.onSwitchToNewThread.mock.invocationCallOrder[0],
    ).toBeLessThan(threads.setDraft.mock.invocationCallOrder[0]);
    // The preset is consumed: nothing applies the draft a second time.
    expect(store.pendingPreset).toBeNull();
  });

  it("replaces the open chat's draft with an applied preset's one", () => {
    profiles.initialized = true;
    const store = new AiChatStore();
    renderBridge(store);
    act(() => {
      store.applyPreset({ ...PRESET, draft: "/translate " });
    });
    expect(threads.onSwitchToNewThread).not.toHaveBeenCalled();
    expect(threads.setDraft).toHaveBeenCalledWith("/translate ");
  });

  it("leaves the draft alone for a preset without one", () => {
    profiles.initialized = true;
    const store = new AiChatStore();
    renderBridge(store);
    act(() => {
      store.openPreset(PRESET);
    });
    act(() => {
      store.applyPreset(PRESET);
    });
    expect(threads.setDraft).not.toHaveBeenCalled();
  });

  it("opens a fresh preset on the conversation, an applied one on the page it is on", () => {
    profiles.initialized = true;
    const store = new AiChatStore();
    renderBridge(store);
    router.currentPage = "history";
    act(() => {
      store.applyPreset(PRESET);
    });
    expect(router.goToChat).not.toHaveBeenCalled();
    act(() => {
      store.openPreset(PRESET);
    });
    expect(router.goToChat).toHaveBeenCalledTimes(1);
  });
});
