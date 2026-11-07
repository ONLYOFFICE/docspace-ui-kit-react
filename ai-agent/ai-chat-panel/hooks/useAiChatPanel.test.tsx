import React from "react";
import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const store = vi.hoisted(() => ({
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
}));

vi.mock("../../providers/ai-chat-store", () => ({
  useAiChatStoreOptional: () => store,
  useAiChatStore: () => store,
}));
vi.mock("../../providers", () => ({
  useStores: () => ({ useRouter: () => vi.fn() }),
}));
vi.mock("../../../hooks/use-is-desktop", () => ({ useIsDesktop: () => true }));
vi.mock("../components/ai-chat-trigger", () => ({ default: () => null }));
vi.mock("../components/ai-chat-panel-save", () => ({ default: () => null }));
vi.mock("../components/ai-chat-panel-header", () => ({
  default: ({ title }: { title: string }) => <div>{title}</div>,
}));

const renderPanel = async (loadChat: () => Promise<unknown>) => {
  vi.resetModules();
  vi.doMock("../../new-chat", loadChat);
  const { useAiChatPanel } = await import("./useAiChatPanel");
  const Panel = () => <>{useAiChatPanel().chatPanelContent}</>;
  await act(async () => {
    render(<Panel />);
  });
};

describe("useAiChatPanel", () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it("draws the panel once its chunks arrive", async () => {
    await renderPanel(async () => ({
      default: () => <div>Panel body</div>,
    }));

    expect(await screen.findByText("Panel body")).toBeInTheDocument();
    expect(screen.getByText("Panel header")).toBeInTheDocument();
    expect(store.close).not.toHaveBeenCalled();
  });

  it("closes the panel instead of throwing when a chunk fails to load", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    await renderPanel(async () => {
      throw new Error("Failed to fetch dynamically imported module");
    });

    await vi.waitFor(() => expect(store.close).toHaveBeenCalledOnce());
    expect(screen.queryByText("Panel body")).not.toBeInTheDocument();
  });
});
