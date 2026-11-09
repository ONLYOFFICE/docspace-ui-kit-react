import React from "react";
import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const { store, chat, toastError } = vi.hoisted(() => {
  const store = {
    isVisible: true,
    effectiveFullscreen: false,
    panelWidth: 400,
    setPanelWidth: vi.fn(),
    setFullscreen: vi.fn(),
    toggleFullscreen: vi.fn(),
    close: vi.fn(() => {
      store.isVisible = false;
    }),
    isOnSettingsPage: false,
    hasProfiles: true,
    isAnalyzeMode: false,
    projectTitle: "Panel header",
  };
  return { store, chat: { renderFails: false }, toastError: vi.fn() };
});

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
vi.mock("../../new-chat", () => ({
  default: () => {
    if (chat.renderFails) throw new Error("The chat failed to render");
    return <div>Panel body</div>;
  },
}));

const SLOW = { timeout: 10_000 };

const renderPanel = async ({ freshModules = false } = {}) => {
  if (freshModules) vi.resetModules();
  const { useAiChatPanel } = await import("./useAiChatPanel");
  const Panel = () => <>{useAiChatPanel().chatPanelContent}</>;
  let view: ReturnType<typeof render> | undefined;
  await act(async () => {
    view = render(<Panel />);
  });
  const reopen = async () => {
    store.isVisible = true;
    await act(async () => {
      view?.rerender(<Panel />);
    });
  };
  return { reopen };
};

describe("useAiChatPanel", { timeout: 30_000 }, () => {
  afterEach(() => {
    store.isVisible = true;
    chat.renderFails = false;
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it("draws the panel once its chunks arrive", async () => {
    await renderPanel();

    expect(await screen.findByText("Panel body", {}, SLOW)).toBeInTheDocument();
    expect(screen.getByText("Panel header")).toBeInTheDocument();
    expect(store.close).not.toHaveBeenCalled();
  });

  it("brings the panel back on the next open after it failed, even while its host keeps it mounted", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    chat.renderFails = true;
    const { reopen } = await renderPanel();

    await vi.waitFor(() => expect(store.close).toHaveBeenCalledOnce(), SLOW);
    expect(toastError).toHaveBeenCalledOnce();
    expect(screen.queryByText("Panel body")).not.toBeInTheDocument();

    chat.renderFails = false;
    await reopen();

    expect(await screen.findByText("Panel body", {}, SLOW)).toBeInTheDocument();
    expect(store.close).toHaveBeenCalledOnce();
  });

  it("closes the panel with an error instead of throwing when a chunk fails to load", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.doMock("../../new-chat", async () => {
      throw new Error("Failed to fetch dynamically imported module");
    });

    await renderPanel({ freshModules: true });

    await vi.waitFor(() => expect(store.close).toHaveBeenCalledOnce(), SLOW);
    expect(toastError).toHaveBeenCalledOnce();
    expect(screen.queryByText("Panel body")).not.toBeInTheDocument();
  });
});
