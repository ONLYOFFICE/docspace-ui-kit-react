import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import {
  AiChatStore,
  AiChatStoreProvider,
} from "../../../providers/ai-chat-store";

const { profilesState, cloudsState } = vi.hoisted(() => ({
  profilesState: {
    sessionChatProfile: null as { id: string; name: string } | null,
    chatProfile: { id: "p1", name: "GPT 5.6 Luna" } as {
      id: string;
      name: string;
    } | null,
    defaultProfile: { id: "p0", name: "Claude Sonnet 5" } as {
      id: string;
      name: string;
    } | null,
  },
  cloudsState: {
    selectedContextFolders: [] as {
      cloud: string;
      room: { id: string; name: string };
    }[],
    selectedKnowledgeFolders: [] as {
      cloud: string;
      room: { id: string; name: string };
    }[],
  },
}));

// The models the chat knows, by id: an agent alias carries one of these ids
// under the agent's name.
const MODELS: Record<string, { id: string; name: string }> = {
  p0: { id: "p0", name: "Claude Sonnet 5" },
  p1: { id: "p1", name: "GPT 5.6 Luna" },
  p2: { id: "p2", name: "Claude" },
};

vi.mock("@onlyoffice/ai-chat", () => ({
  useStores: () => ({
    useProfilesStore: Object.assign(
      (selector: (s: typeof profilesState) => unknown) =>
        selector(profilesState),
      {
        getState: () => ({
          getProfileById: (id: string) => MODELS[id] ?? null,
        }),
      },
    ),
    useCloudsStore: (selector: (s: typeof cloudsState) => unknown) =>
      selector(cloudsState),
    selectCurrentChatProfile: (s: typeof profilesState) =>
      s.sessionChatProfile ?? s.chatProfile ?? s.defaultProfile,
  }),
}));

import AiChatPanelSave from "./index";

const renderSave = (store: AiChatStore) =>
  render(
    <AiChatStoreProvider store={store}>
      <AiChatPanelSave />
    </AiChatStoreProvider>,
  );

describe("AiChatPanelSave", () => {
  beforeEach(() => {
    profilesState.sessionChatProfile = null;
    profilesState.chatProfile = { id: "p1", name: "GPT 5.6 Luna" };
    cloudsState.selectedContextFolders = [];
    cloudsState.selectedKnowledgeFolders = [];
  });

  it("renders nothing while the host keeps no presets", () => {
    renderSave(new AiChatStore());
    expect(screen.queryByTestId("ai-chat-panel-save")).toBeNull();
  });

  it("saves the model, not the agent name it is shown under", () => {
    const store = new AiChatStore();
    const onSavePreset = vi.fn();
    store.setOnSavePreset(onSavePreset);
    profilesState.sessionChatProfile = { id: "p2", name: "Contract agent" };
    renderSave(store);
    fireEvent.click(screen.getByTestId("ai-chat-panel-save"));
    expect(onSavePreset).toHaveBeenCalledWith(
      expect.objectContaining({ profileId: "p2", profileName: "Claude" }),
    );
  });

  it("hands the host the model and the connected rooms", () => {
    const store = new AiChatStore();
    const onSavePreset = vi.fn();
    store.setOnSavePreset(onSavePreset);
    profilesState.sessionChatProfile = { id: "p2", name: "Claude" };
    cloudsState.selectedContextFolders = [
      { cloud: "docspace", room: { id: "12", name: "Sales skills" } },
      { cloud: "docspace", room: { id: "13", name: "Legal tone" } },
    ];
    cloudsState.selectedKnowledgeFolders = [
      { cloud: "docspace", room: { id: "77", name: "Legal" } },
    ];
    renderSave(store);
    fireEvent.click(screen.getByTestId("ai-chat-panel-save"));
    expect(onSavePreset).toHaveBeenCalledWith({
      profileId: "p2",
      profileName: "Claude",
      contextRooms: [
        { cloud: "docspace", id: "12", name: "Sales skills" },
        { cloud: "docspace", id: "13", name: "Legal tone" },
      ],
      knowledgeRooms: [{ cloud: "docspace", id: "77", name: "Legal" }],
    });
  });

  it("falls back to the assigned chat model and reports no rooms as empty lists", () => {
    const store = new AiChatStore();
    const onSavePreset = vi.fn();
    store.setOnSavePreset(onSavePreset);
    renderSave(store);
    fireEvent.click(screen.getByTestId("ai-chat-panel-save"));
    expect(onSavePreset).toHaveBeenCalledWith({
      profileId: "p1",
      profileName: "GPT 5.6 Luna",
      contextRooms: [],
      knowledgeRooms: [],
    });
  });

  it("saves the default model when the chat never picked one", () => {
    const store = new AiChatStore();
    const onSavePreset = vi.fn();
    store.setOnSavePreset(onSavePreset);
    profilesState.chatProfile = null;
    renderSave(store);
    fireEvent.click(screen.getByTestId("ai-chat-panel-save"));
    expect(onSavePreset).toHaveBeenCalledWith(
      expect.objectContaining({
        profileId: "p0",
        profileName: "Claude Sonnet 5",
      }),
    );
  });
});
