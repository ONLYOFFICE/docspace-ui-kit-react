import React from "react";
import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

// The chat library's stores, read for what "Save as new agent" hands over.
vi.mock("@onlyoffice/ai-chat", () => {
  const profile = { id: "p1", name: "Claude" };
  return {
    useStores: () => ({
      useProfilesStore: Object.assign(
        (selector: (s: unknown) => unknown) => selector({}),
        { getState: () => ({ getProfileById: () => profile }) },
      ),
      useCloudsStore: (selector: (s: unknown) => unknown) =>
        selector({ selectedContextFolders: [], selectedKnowledgeFolders: [] }),
      selectCurrentChatProfile: () => profile,
    }),
  };
});

import {
  AiChatStore,
  AiChatStoreProvider,
} from "../../../providers/ai-chat-store";

import AiChatAgentActions from "./index";

const pickedStore = (selectedId: string | null = "1") => {
  const store = new AiChatStore();
  store.setAgentPicker({
    agents: [{ id: "1", name: "Legal Reviewer" }],
    selectedId,
    onSelect: vi.fn(),
  });
  return store;
};

const renderActions = (store: AiChatStore, onExpand?: () => void) =>
  render(
    <AiChatStoreProvider store={store}>
      <AiChatAgentActions onExpand={onExpand} />
    </AiChatStoreProvider>,
  );

const openMenu = () =>
  fireEvent.click(
    screen.getByTestId("ai-chat-agent-actions").querySelector("svg")!
      .parentElement!,
  );

const itemIds = () =>
  Array.from(
    document.querySelectorAll('[data-testid^="ai-chat-agent-action-"]'),
  ).map((node) =>
    node.getAttribute("data-testid")!.replace("ai-chat-agent-action-", ""),
  );

describe("AiChatAgentActions", () => {
  it("renders nothing on the default agent", () => {
    const store = pickedStore(null);
    store.setAgentActions([{ id: "edit", label: "Edit", onClick: vi.fn() }]);
    renderActions(store, vi.fn());
    expect(screen.queryByTestId("ai-chat-agent-actions")).toBeNull();
  });

  it("renders nothing with nothing to offer", () => {
    renderActions(pickedStore());
    expect(screen.queryByTestId("ai-chat-agent-actions")).toBeNull();
  });

  it("lists the host's actions, then Expand and the save, then the dangerous ones", () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    const onExpand = vi.fn();
    const onSave = vi.fn();
    const store = pickedStore();
    store.setOnSavePreset(onSave);
    store.setAgentActions([
      {
        id: "delete",
        label: "Delete agent",
        onClick: onDelete,
        isDanger: true,
      },
      { id: "edit", label: "Edit agent", onClick: onEdit },
    ]);
    renderActions(store, onExpand);
    openMenu();

    expect(itemIds()).toEqual(["edit", "expand", "save", "delete"]);

    fireEvent.click(screen.getByTestId("ai-chat-agent-action-edit"));
    expect(onEdit).toHaveBeenCalledTimes(1);

    openMenu();
    fireEvent.click(screen.getByTestId("ai-chat-agent-action-expand"));
    expect(onExpand).toHaveBeenCalledTimes(1);

    openMenu();
    fireEvent.click(screen.getByTestId("ai-chat-agent-action-save"));
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ profileId: "p1" }),
    );

    openMenu();
    fireEvent.click(screen.getByTestId("ai-chat-agent-action-delete"));
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it("leaves Expand out where the panel cannot expand, and the save out without the host's hook", () => {
    const store = pickedStore();
    store.setAgentActions([
      { id: "info", label: "Agent info", onClick: vi.fn() },
    ]);
    renderActions(store);
    openMenu();
    expect(itemIds()).toEqual(["info"]);
  });
});
