import React from "react";
import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const { store, chat, toastError } = vi.hoisted(() => ({
  store: {
    isVisible: true,
    effectiveFullscreen: false,
    panelWidth: 400,
    setPanelWidth: vi.fn(),
    setFullscreen: vi.fn(),
    toggleFullscreen: vi.fn(),
    close: vi.fn(),
    isOnSettingsPage: false,
    hasProfiles: true,
    isAnalyzeMode: false,
    projectTitle: "Panel header",
  },
  chat: { fails: false },
  toastError: vi.fn(),
}));

vi.mock("../../providers/ai-chat-store", () => ({
  useAiChatStoreOptional: () => store,
  useAiChatStore: () => store,
}));
vi.mock("../../providers", () => ({
  useStores: () => ({ useRouter: () => vi.fn() }),
}));
vi.mock("../../../components/toast", () => ({
  toastr: { error: toastError },
}));
vi.mock("../../../hooks/use-is-desktop", () => ({ useIsDesktop: () => true }));
vi.mock("../components/ai-chat-trigger", () => ({ default: () => null }));
vi.mock("../components/ai-chat-panel-save", () => ({ default: () => null }));
vi.mock("../components/ai-chat-panel-header", () => ({
  default: ({ title }: { title: string }) => <div>{title}</div>,
}));

const renderPanel = async () => {
  vi.resetModules();
  vi.doMock("../../new-chat", async () => {
    if (chat.fails)
      throw new Error("Failed to fetch dynamically imported module");
    return { default: () => <div>Panel body</div> };
  });
  const { useAiChatPanel } = await import("./useAiChatPanel");
  const Panel = () => <>{useAiChatPanel().chatPanelContent}</>;
  await act(async () => {
    render(<Panel />);
  });
};

describe("useAiChatPanel", () => {
  afterEach(() => {
    chat.fails = false;
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it("draws the panel once its chunks arrive", async () => {
    await renderPanel();

    expect(await screen.findByText("Panel body")).toBeInTheDocument();
    expect(screen.getByText("Panel header")).toBeInTheDocument();
    expect(store.close).not.toHaveBeenCalled();
  });

  it("closes the panel with an error instead of throwing when a chunk fails to load", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    chat.fails = true;

    await renderPanel();

    await vi.waitFor(() => expect(store.close).toHaveBeenCalledOnce());
    expect(toastError).toHaveBeenCalledOnce();
    expect(screen.queryByText("Panel body")).not.toBeInTheDocument();
  });

  it("takes fresh lazy chunks for the next open after a failure", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const lazy = vi.spyOn(React, "lazy");
    chat.fails = true;

    await renderPanel();

    await vi.waitFor(() => expect(store.close).toHaveBeenCalledOnce());
    expect(lazy).toHaveBeenCalledTimes(4);
  });
});
