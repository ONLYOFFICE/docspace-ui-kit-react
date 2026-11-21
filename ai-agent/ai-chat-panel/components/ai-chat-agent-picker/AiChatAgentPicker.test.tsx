import React from "react";
import { describe, it, expect, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";

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

  it("ends with Save as new agent for a host that saves the chat, and hands it the setup", () => {
    const onSave = vi.fn();
    const store = new AiChatStore();
    store.setAgentPicker({
      agents: agents(2),
      selectedId: null,
      onSelect: vi.fn(),
    });
    renderPicker(store);
    openMenu();
    expect(screen.queryByTestId("ai-chat-agent-picker-save")).toBeNull();

    act(() => store.setOnSavePreset(onSave));
    fireEvent.click(screen.getByTestId("ai-chat-agent-picker-save"));
    expect(onSave).toHaveBeenCalledWith({
      profileId: "p1",
      profileName: "Claude",
      contextRooms: [],
      knowledgeRooms: [],
    });
    // The menu closes behind the pick.
    expect(
      screen.getByTestId("ai-chat-agent-picker").getAttribute("aria-expanded"),
    ).toBe("false");
  });

  it("is a menu of the default agent and the save alone for a user with no agents", () => {
    const store = new AiChatStore();
    store.setAgentPicker({ agents: [], selectedId: null, onSelect: vi.fn() });
    store.setOnSavePreset(vi.fn());
    renderPicker(store);
    expect(store.hasAgentPicker).toBe(true);
    openMenu();

    expect(screen.getByTestId("ai-chat-agent-picker-default")).toBeTruthy();
    expect(screen.getByTestId("ai-chat-agent-picker-save")).toBeTruthy();
    expect(screen.getByRole("group", { hidden: true }).hidden).toBe(true);
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
    // Its logo comes before the name.
    expect(
      screen
        .getByTestId("ai-chat-agent-picker-logo")
        .querySelector('[data-testid="logo-2"]'),
    ).toBeTruthy();
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

    it("closes on the first Escape after a click, with the focus on the title", () => {
      const { onSelect, trigger } = setup();
      trigger.focus();
      openMenu();
      expect(trigger.getAttribute("aria-expanded")).toBe("true");

      const notPrevented = fireEvent.keyDown(trigger, { key: "Escape" });
      expect(notPrevented).toBe(false);
      expect(onSelect).not.toHaveBeenCalled();
      expect(trigger.getAttribute("aria-expanded")).toBe("false");
      expect(document.activeElement).toBe(trigger);
    });

    it("keeps the Escape that closed it from the page's own listeners", () => {
      const { trigger } = setup();
      openMenu();
      const pageListener = vi.fn();
      document.addEventListener("keydown", pageListener);
      fireEvent.keyDown(document.body, { key: "Escape" });
      document.removeEventListener("keydown", pageListener);

      expect(pageListener).not.toHaveBeenCalled();
      expect(trigger.getAttribute("aria-expanded")).toBe("false");
    });

    it("closes on Tab and lets the focus go on from the title", async () => {
      const { onSelect, trigger } = setup();
      fireEvent.keyDown(trigger, { key: "ArrowDown" });
      await nextFrame();

      // Not prevented: the browser then moves the focus on from the title,
      // where the handler has put it back.
      const notPrevented = fireEvent.keyDown(
        document.activeElement as Element,
        {
          key: "Tab",
        },
      );
      expect(notPrevented).toBe(true);
      expect(onSelect).not.toHaveBeenCalled();
      expect(trigger.getAttribute("aria-expanded")).toBe("false");
      expect(document.activeElement).toBe(trigger);
    });

    it("holds only options and the agents group in the listbox", () => {
      setup();
      openMenu();
      const menu = screen.getByTestId("ai-chat-agent-picker-menu");
      expect(menu.querySelector('[role="separator"]')).toBeNull();
      expect(
        menu.querySelectorAll('[role="group"] [role="option"]'),
      ).toHaveLength(3);
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

  describe("click outside", () => {
    const setup = () => {
      const onSelect = vi.fn();
      const onOutside = vi.fn();
      const store = new AiChatStore();
      store.setAgentPicker({ agents: agents(2), selectedId: null, onSelect });
      render(
        <AiChatStoreProvider store={store}>
          <AiChatAgentPicker title="AI Chat" />
          <button type="button" data-testid="outside" onClick={onOutside} />
        </AiChatStoreProvider>,
      );
      return {
        onOutside,
        trigger: screen.getByTestId("ai-chat-agent-picker"),
        outside: screen.getByTestId("outside"),
      };
    };

    it("closes the menu and still reaches what it was aimed at", () => {
      const { onOutside, trigger, outside } = setup();
      openMenu();
      expect(trigger.getAttribute("aria-expanded")).toBe("true");
      // No backdrop lies over the page to take the click.
      expect(screen.queryByTestId("backdrop")).toBeNull();

      fireEvent.mouseDown(outside);
      expect(trigger.getAttribute("aria-expanded")).toBe("false");
      fireEvent.click(outside);
      expect(onOutside).toHaveBeenCalledTimes(1);
    });

    it("leaves a press on the title to the title, which closes the menu", () => {
      const { trigger } = setup();
      openMenu();
      fireEvent.mouseDown(trigger);
      expect(trigger.getAttribute("aria-expanded")).toBe("true");
      fireEvent.click(trigger);
      expect(trigger.getAttribute("aria-expanded")).toBe("false");
    });

    it("keeps the menu open on a press inside it", () => {
      const { trigger } = setup();
      openMenu();
      fireEvent.mouseDown(screen.getByTestId("ai-chat-agent-picker-agent-1"));
      expect(trigger.getAttribute("aria-expanded")).toBe("true");
    });
  });
});
