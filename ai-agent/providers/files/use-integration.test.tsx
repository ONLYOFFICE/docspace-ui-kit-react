import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";

// `ContextRoomSync` (the cloud id) reaches the chat library, whose styles
// jsdom cannot load; the hook under test needs nothing from it.
vi.mock("@onlyoffice/ai-chat", () => ({
  useStores: () => ({}),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, options?: { defaultValue?: string }) =>
      options?.defaultValue ?? key,
    i18n: { language: "en" },
  }),
}));

vi.mock("./attach-dialog", () => ({
  default: () => <div data-testid="attach-dialog" />,
}));
vi.mock("./save-dialog", () => ({
  default: () => <div data-testid="save-dialog" />,
}));
vi.mock("./device-uploader", () => ({
  default: React.forwardRef(() => <div data-testid="device-uploader" />),
}));
vi.mock("./context-folder-dialog", () => ({
  default: ({ onClose }: { onClose: () => void }) => (
    <button type="button" data-testid="folder-dialog" onClick={onClose} />
  ),
}));
vi.mock("./context-rooms-dialog", () => ({
  default: ({ kind, onClose }: { kind: string; onClose: () => void }) => (
    <button
      type="button"
      data-testid="rooms-dialog"
      data-kind={kind}
      onClick={onClose}
    />
  ),
}));

import AiChatStore from "../ai-chat-store/AiChatStore";
import { CONTEXT_ROOM_CLOUD } from "../context-room/ContextRoomSync";
import { useFilesIntegration, type FilesIntegration } from "./use-integration";

let latest: FilesIntegration | null = null;

const Host = ({ aiChatStore }: { aiChatStore?: AiChatStore }) => {
  const integration = useFilesIntegration({
    aiChatStore,
    onFilesAttached: vi.fn(),
  });
  latest = integration;
  return <>{integration.overlay}</>;
};

const integration = () => {
  if (!latest) throw new Error("hook not rendered");
  return latest;
};

describe("useFilesIntegration: the composer's source pickers", () => {
  const navigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    latest = null;
    (window as unknown as { DocSpace?: unknown }).DocSpace = { navigate };
  });

  it("opens the Instructions and the Knowledge room pickers, one at a time", () => {
    render(<Host />);
    expect(screen.queryByTestId("rooms-dialog")).toBeNull();

    act(() => integration().onPickContextRooms());
    expect(screen.getByTestId("rooms-dialog")).toHaveAttribute(
      "data-kind",
      "skills",
    );

    act(() => integration().onPickKnowledgeRooms());
    expect(screen.getAllByTestId("rooms-dialog")).toHaveLength(1);
    expect(screen.getByTestId("rooms-dialog")).toHaveAttribute(
      "data-kind",
      "knowledge",
    );

    act(() => screen.getByTestId("rooms-dialog").click());
    expect(screen.queryByTestId("rooms-dialog")).toBeNull();
  });

  it("opens a room of this portal in Files, by the address Files expects", () => {
    render(<Host />);
    integration().onOpenContextRoom(CONTEXT_ROOM_CLOUD, {
      id: "12",
      name: "Skills",
    });
    expect(navigate).toHaveBeenCalledWith("/rooms/shared/12/filter?folder=12");
  });

  it("leaves a room of another cloud alone", () => {
    render(<Host />);
    integration().onOpenContextRoom("google", { id: "abc", name: "Drive" });
    expect(navigate).not.toHaveBeenCalled();
  });

  it("offers the folder picker only where the host turns the Context slot on", () => {
    const store = new AiChatStore();
    render(<Host aiChatStore={store} />);
    expect(integration().onPickFolderContext).toBeUndefined();

    act(() => store.setFolderContextPickerEnabled(true));
    expect(integration().onPickFolderContext).toBeDefined();

    act(() => integration().onPickFolderContext?.());
    expect(screen.getByTestId("folder-dialog")).toBeInTheDocument();
    act(() => screen.getByTestId("folder-dialog").click());
    expect(screen.queryByTestId("folder-dialog")).toBeNull();

    act(() => store.setFolderContextPickerEnabled(false));
    expect(integration().onPickFolderContext).toBeUndefined();
  });

  it("has no folder picker without a panel store", () => {
    render(<Host />);
    expect(integration().onPickFolderContext).toBeUndefined();
  });
});
