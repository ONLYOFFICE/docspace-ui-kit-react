import React from "react";
import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

// The store's barrel reaches the chat library's stores, which this
// component does not use.
vi.mock("@onlyoffice/ai-chat", () => ({ useStores: () => ({}) }));

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

const renderActions = (store: AiChatStore) =>
  render(
    <AiChatStoreProvider store={store}>
      <AiChatAgentActions />
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
    renderActions(store);
    expect(screen.queryByTestId("ai-chat-agent-actions")).toBeNull();
  });

  it("renders nothing when the host offers nothing, even where it can save the chat", () => {
    const store = pickedStore();
    store.setOnSavePreset(vi.fn());
    renderActions(store);
    expect(screen.queryByTestId("ai-chat-agent-actions")).toBeNull();
  });

  it("lists the host's actions, the dangerous ones last, and nothing of its own", () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    const store = pickedStore();
    store.setOnSavePreset(vi.fn());
    store.setAgentActions([
      {
        id: "delete",
        label: "Delete agent",
        onClick: onDelete,
        isDanger: true,
      },
      { id: "edit", label: "Edit agent", onClick: onEdit },
      { id: "info", label: "Agent info", onClick: vi.fn() },
    ]);
    renderActions(store);
    openMenu();

    expect(itemIds()).toEqual(["edit", "info", "delete"]);

    fireEvent.click(screen.getByTestId("ai-chat-agent-action-edit"));
    expect(onEdit).toHaveBeenCalledTimes(1);

    openMenu();
    fireEvent.click(screen.getByTestId("ai-chat-agent-action-delete"));
    expect(onDelete).toHaveBeenCalledTimes(1);
  });
});
