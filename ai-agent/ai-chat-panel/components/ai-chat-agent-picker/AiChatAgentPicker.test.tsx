import React from "react";
import { describe, it, expect, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";

// The store's barrel reaches the chat library's stores, which this
// component does not use.
vi.mock("@onlyoffice/ai-chat", () => ({ useStores: () => ({}) }));

import {
  AiChatStore,
  AiChatStoreProvider,
} from "../../../providers/ai-chat-store";

import AiChatAgentPicker, { VISIBLE_AGENTS_COUNT } from "./index";

const agents = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    id: String(i + 1),
    name: `Agent ${i + 1}`,
    icon: <span data-testid={`logo-${i + 1}`} />,
  }));

const renderPicker = (store: AiChatStore) =>
  render(
    <AiChatStoreProvider store={store}>
      <AiChatAgentPicker title="AI Chat" />
    </AiChatStoreProvider>,
  );

const openMenu = () =>
  fireEvent.click(screen.getByTestId("ai-chat-agent-picker"));

describe("AiChatAgentPicker", () => {
  it("renders nothing without agents", () => {
    const store = new AiChatStore();
    renderPicker(store);
    expect(screen.queryByTestId("ai-chat-agent-picker")).toBeNull();

    act(() =>
      store.setAgentPicker({ agents: [], selectedId: null, onSelect: vi.fn() }),
    );
    expect(store.hasAgentPicker).toBe(false);
    expect(screen.queryByTestId("ai-chat-agent-picker")).toBeNull();
  });

  it("shows the chat title while the default agent is picked", () => {
    const store = new AiChatStore();
    store.setAgentPicker({
      agents: agents(2),
      selectedId: null,
      onSelect: vi.fn(),
    });
    renderPicker(store);

    expect(screen.getByTestId("ai-chat-agent-picker").textContent).toContain(
      "AI Chat",
    );
  });

  it("names the picked agent in the title", () => {
    const store = new AiChatStore();
    store.setAgentPicker({
      agents: agents(2),
      selectedId: "2",
      onSelect: vi.fn(),
    });
    renderPicker(store);

    expect(screen.getByTestId("ai-chat-agent-picker").textContent).toContain(
      "Agent 2",
    );
  });

  it("lists the default agent and every agent, and hands a pick to the host", () => {
    const onSelect = vi.fn();
    const store = new AiChatStore();
    store.setAgentPicker({ agents: agents(7), selectedId: null, onSelect });
    renderPicker(store);
    openMenu();

    expect(screen.getByTestId("ai-chat-agent-picker-default")).toBeTruthy();
    for (let i = 1; i <= 7; i += 1) {
      expect(
        screen.getByTestId(`ai-chat-agent-picker-agent-${i}`),
      ).toBeTruthy();
    }

    fireEvent.click(screen.getByTestId("ai-chat-agent-picker-agent-3"));
    expect(onSelect).toHaveBeenCalledWith("3");
  });

  it("asks the host to read its agents again each time the menu opens", () => {
    const onOpen = vi.fn();
    const store = new AiChatStore();
    store.setAgentPicker({
      agents: agents(2),
      selectedId: null,
      onSelect: vi.fn(),
      onOpen,
    });
    renderPicker(store);

    openMenu();
    expect(onOpen).toHaveBeenCalledTimes(1);
    // Closing it by the title again reads nothing.
    openMenu();
    expect(onOpen).toHaveBeenCalledTimes(1);
    openMenu();
    expect(onOpen).toHaveBeenCalledTimes(2);
  });

  it("hands every pick to the host, the current agent's included", () => {
    const onSelect = vi.fn();
    const store = new AiChatStore();
    store.setAgentPicker({ agents: agents(2), selectedId: "1", onSelect });
    renderPicker(store);

    // The host calls off a slower pick still on its way with it.
    openMenu();
    fireEvent.click(screen.getByTestId("ai-chat-agent-picker-agent-1"));
    expect(onSelect).toHaveBeenLastCalledWith("1");

    openMenu();
    fireEvent.click(screen.getByTestId("ai-chat-agent-picker-default"));
    expect(onSelect).toHaveBeenLastCalledWith(null);
  });

  it("caps the agents list at five rows, so the rest scroll", () => {
    const store = new AiChatStore();
    store.setAgentPicker({
      agents: agents(7),
      selectedId: null,
      onSelect: vi.fn(),
    });
    renderPicker(store);
    openMenu();

    const list = screen
      .getByTestId("ai-chat-agent-picker-agent-1")
      .closest<HTMLElement>('[style*="max-height"]');
    expect(VISIBLE_AGENTS_COUNT).toBe(5);
    expect(list?.style.maxHeight).toBe("160px");
    // Rows as wide as the default agent's: no gutter for the track.
    expect(list?.style.getPropertyValue("--scrollbar-padding-inline-end")).toBe(
      "0",
    );
    // The default agent stays above the scrolling list.
    expect(
      list?.contains(screen.getByTestId("ai-chat-agent-picker-default")),
    ).toBe(false);
  });

  describe("keyboard", () => {
    // The focus moves into the menu on the next frame.
    const nextFrame = () =>
      act(() => new Promise((resolve) => requestAnimationFrame(resolve)));

    const setup = (selectedId: string | null = null) => {
      const onSelect = vi.fn();
      const store = new AiChatStore();
      store.setAgentPicker({ agents: agents(3), selectedId, onSelect });
      renderPicker(store);
      return { onSelect, trigger: screen.getByTestId("ai-chat-agent-picker") };
    };

    it("opens on the picked agent and walks the options with the arrows", async () => {
      const { trigger } = setup("2");
      trigger.focus();
      fireEvent.keyDown(trigger, { key: "ArrowDown" });
      await nextFrame();

      expect(trigger.getAttribute("aria-expanded")).toBe("true");
      const agent2 = screen.getByTestId("ai-chat-agent-picker-agent-2");
      expect(document.activeElement).toBe(agent2);

      fireEvent.keyDown(agent2, { key: "ArrowDown" });
      expect(document.activeElement).toBe(
        screen.getByTestId("ai-chat-agent-picker-agent-3"),
      );
      // Past the last option the focus wraps to the default agent.
      fireEvent.keyDown(document.activeElement as Element, {
        key: "ArrowDown",
      });
      expect(document.activeElement).toBe(
        screen.getByTestId("ai-chat-agent-picker-default"),
      );
      fireEvent.keyDown(document.activeElement as Element, { key: "End" });
      expect(document.activeElement).toBe(
        screen.getByTestId("ai-chat-agent-picker-agent-3"),
      );
      fireEvent.keyDown(document.activeElement as Element, { key: "Home" });
      expect(document.activeElement).toBe(
        screen.getByTestId("ai-chat-agent-picker-default"),
      );
    });

    it("picks the focused option with Enter and gives the focus back", async () => {
      const { onSelect, trigger } = setup();
      fireEvent.keyDown(trigger, { key: "ArrowDown" });
      await nextFrame();

      fireEvent.keyDown(document.activeElement as Element, {
        key: "ArrowDown",
      });
      fireEvent.keyDown(document.activeElement as Element, { key: "Enter" });

      expect(onSelect).toHaveBeenCalledWith("1");
      expect(trigger.getAttribute("aria-expanded")).toBe("false");
      expect(document.activeElement).toBe(trigger);
    });

    it("closes on Escape without a pick", async () => {
      const { onSelect, trigger } = setup();
      fireEvent.keyDown(trigger, { key: "ArrowUp" });
      await nextFrame();
      // ArrowUp opens on the last option.
      expect(document.activeElement).toBe(
        screen.getByTestId("ai-chat-agent-picker-agent-3"),
      );

      fireEvent.keyDown(document.activeElement as Element, { key: "Escape" });
      expect(onSelect).not.toHaveBeenCalled();
      expect(trigger.getAttribute("aria-expanded")).toBe("false");
      expect(document.activeElement).toBe(trigger);
    });

    it("names the menu and the agents group", () => {
      setup();
      openMenu();
      expect(
        screen
          .getByTestId("ai-chat-agent-picker-menu")
          .getAttribute("aria-label"),
      ).toBe("AI agents");
      const group = screen.getByRole("group", { hidden: true });
      const label = document.getElementById(
        group.getAttribute("aria-labelledby") ?? "",
      );
      expect(label?.textContent).toBe("Agents");
    });
  });
});
