import React from "react";
import { act, render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { clouds, profiles, threads } = vi.hoisted(() => ({
  clouds: {
    selectContextFolder: vi.fn(),
    clearContextFolder: vi.fn(),
    selectKnowledgeFolder: vi.fn(),
    clearKnowledgeFolder: vi.fn(),
    clearFolderContext: vi.fn(),
  },
  profiles: {
    profiles: [] as { id: string; name: string }[],
    initialized: false,
    init: vi.fn(),
    getProfileById: vi.fn(),
    setSessionChatProfile: vi.fn(),
  },
  threads: { onSwitchToNewThread: vi.fn() },
}));

// A zustand hook as the bridge uses it: a selector call and `getState`.
const fakeStore = <T extends object>(state: T) =>
  Object.assign((selector: (s: T) => unknown) => selector(state), {
    getState: () => state,
  });

vi.mock("@onlyoffice/ai-chat", () => ({
  useStores: () => ({
    useRouter: fakeStore({ currentPage: "chat" }),
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
  contextRoom: null,
  knowledgeRoom: null,
};

describe("AiChatStoresBridge", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    profiles.initialized = false;
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

  it("drops the context folder when the host switches the slot off", () => {
    const store = new AiChatStore();
    store.setFolderContextPickerEnabled(true);
    renderBridge(store);
    expect(clouds.clearFolderContext).not.toHaveBeenCalled();
    act(() => {
      store.setFolderContextPickerEnabled(false);
    });
    expect(clouds.clearFolderContext).toHaveBeenCalledTimes(1);
  });
});
