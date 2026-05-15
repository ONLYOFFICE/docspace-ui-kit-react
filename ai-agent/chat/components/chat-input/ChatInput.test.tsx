/*
 * Copyright (C) Ascensio System SIA, 2009-2026
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation, together with the
 * additional terms provided in the LICENSE file.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For
 * details, see the GNU AGPL at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA by email at info@onlyoffice.com
 * or by postal mail at 20A-6 Ernesta Birznieka-Upisha Street, Riga,
 * LV-1050, Latvia, European Union.
 *
 * The interactive user interfaces in modified versions of the Program
 * are required to display Appropriate Legal Notices in accordance with
 * Section 5 of the GNU AGPL version 3.
 *
 * No trademark rights are granted under this License.
 *
 * All non-code elements of the Product, including illustrations,
 * icon sets, and technical writing content, are licensed under the
 * Creative Commons Attribution-ShareAlike 4.0 International License:
 * https://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 * This license applies only to such non-code elements and does not
 * modify or replace the licensing terms applicable to the Program's
 * source code, which remains licensed under the GNU Affero General
 * Public License v3.
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";

import ChatInput from "./index";
import { useMessageStore } from "../../store/messageStore";
import { useChatStore } from "../../store/chatStore";
import type { ChatInputProps } from "../../Chat.types";
import type { TFile } from "../../../../types";

// Mock stores
vi.mock("../../store/messageStore", () => ({ useMessageStore: vi.fn() }));
vi.mock("../../store/chatStore", () => ({ useChatStore: vi.fn() }));

// Mock components
vi.mock("../../../../components/rectangle", () => ({
  RectangleSkeleton: () => <div data-testid="skeleton" />,
}));

vi.mock("../../../../components/textarea", () => ({
  Textarea: ({
    onChange,
    value,
    onKeyDown,
    dataTestId,
    isDisabled,
  }: {
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    value: string;
    onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
    dataTestId: string;
    isDisabled: boolean;
  }) => (
    <textarea
      data-testid={dataTestId}
      value={value}
      disabled={isDisabled}
      onChange={onChange}
      onKeyDown={onKeyDown}
    />
  ),
}));

vi.mock("../../../../components/text", () => ({
  Text: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("./files-list", () => ({
  default: ({ files }: { files: Partial<TFile>[] }) => (
    <div data-testid="files-list" data-file-count={files.length}>
      {files.map((f) => (
        <span key={f.id}>{f.title}</span>
      ))}
    </div>
  ),
}));

vi.mock("./buttons", () => ({
  default: ({ sendMessageAction }: { sendMessageAction: () => void }) => (
    <div data-testid="buttons">
      <button onClick={sendMessageAction} data-testid="send-button">
        send
      </button>
    </div>
  ),
}));

vi.mock("./attachment", () => ({
  default: () => <div data-testid="attachment-selector" />,
}));

// Mock utils
vi.mock("../../../../utils/i18n", () => ({
  useCommonTranslation: () => vi.fn((key) => key),
}));

describe("<ChatInput />", () => {
  const mockStartChat = vi.fn();
  const mockSendMessage = vi.fn();
  const mockFetchChat = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useMessageStore).mockReturnValue({
      startChat: mockStartChat,
      sendMessage: mockSendMessage,
      currentChatId: null,
      isRequestRunning: false,
      agentId: "agent-1",
    } as unknown as ReturnType<typeof useMessageStore>);
    vi.mocked(useChatStore).mockReturnValue({
      fetchChat: mockFetchChat,
      currentChat: null,
    } as unknown as ReturnType<typeof useChatStore>);

    // Clear localStorage
    localStorage.clear();
  });

  const defaultProps: ChatInputProps = {
    getIcon: vi.fn(),
    isLoading: false,
    attachmentFile: null as unknown as ChatInputProps["attachmentFile"],
    clearAttachmentFile: vi.fn(),
    selectedModel: "gpt-4",
    toolsSettings: {} as unknown as ChatInputProps["toolsSettings"],
    isPortalAdmin: false,
    aiReady: true,
    multimodal: {} as unknown as ChatInputProps["multimodal"],
    goToWebSearchSettings: vi.fn(),
    persistDraft: false,
    allowAttachFiles: true,
    allowManageTools: true,
  };

  it("renders textarea and components in normal state", () => {
    render(<ChatInput {...defaultProps} />);
    expect(screen.getByTestId("chat-input-textarea")).toBeInTheDocument();
    expect(screen.getByTestId("files-list")).toBeInTheDocument();
    expect(screen.getByTestId("buttons")).toBeInTheDocument();
  });

  it("renders skeleton when isLoading is true", () => {
    render(<ChatInput {...defaultProps} isLoading={true} />);
    expect(screen.getByTestId("skeleton")).toBeInTheDocument();
  });

  it("updates value on change", () => {
    render(<ChatInput {...defaultProps} />);
    const textarea = screen.getByTestId("chat-input-textarea");
    fireEvent.change(textarea, { target: { value: "Hello" } });
    expect(textarea).toHaveValue("Hello");
  });

  it("calls startChat when send button is clicked and no currentChatId", () => {
    render(<ChatInput {...defaultProps} />);
    const textarea = screen.getByTestId("chat-input-textarea");
    fireEvent.change(textarea, { target: { value: "Hello" } });

    const sendButton = screen.getByTestId("send-button");
    fireEvent.click(sendButton);

    expect(mockStartChat).toHaveBeenCalledWith("Hello", []);
    expect(textarea).toHaveValue("");
  });

  it("calls sendMessage when send button is clicked and currentChatId exists", () => {
    vi.mocked(useMessageStore).mockReturnValue({
      sendMessage: mockSendMessage,
      currentChatId: "chat-1",
      agentId: "agent-1",
    } as unknown as ReturnType<typeof useMessageStore>);
    render(<ChatInput {...defaultProps} />);
    const textarea = screen.getByTestId("chat-input-textarea");
    fireEvent.change(textarea, { target: { value: "Hello" } });

    const sendButton = screen.getByTestId("send-button");
    fireEvent.click(sendButton);

    expect(mockSendMessage).toHaveBeenCalledWith("Hello", []);
  });

  it("sends message on Enter key (without shift)", () => {
    render(<ChatInput {...defaultProps} />);
    const textarea = screen.getByTestId("chat-input-textarea");
    fireEvent.change(textarea, { target: { value: "Hello" } });

    fireEvent.keyDown(textarea, { key: "Enter", shiftKey: false });
    expect(mockStartChat).toHaveBeenCalledWith("Hello", []);
  });

  it("does not send message on Shift+Enter", () => {
    render(<ChatInput {...defaultProps} />);
    const textarea = screen.getByTestId("chat-input-textarea");
    fireEvent.change(textarea, { target: { value: "Hello" } });

    fireEvent.keyDown(textarea, { key: "Enter", shiftKey: true });
    expect(mockStartChat).not.toHaveBeenCalled();
  });

  it("persists draft to localStorage if persistDraft is true", async () => {
    render(<ChatInput {...defaultProps} persistDraft={true} />);
    const textarea = screen.getByTestId("chat-input-textarea");
    fireEvent.change(textarea, { target: { value: "Draft 1" } });

    const saved = JSON.parse(localStorage.getItem("chat-agent-1") || "{}");
    expect(saved["empty"].value).toBe("Draft 1");
  });

  it("loads draft from localStorage on mount", async () => {
    const draftData = {
      "chat-1": { value: "Saved Draft", selectedFiles: [], time: Date.now() },
    };
    localStorage.setItem("chat-agent-1", JSON.stringify(draftData));

    vi.mocked(useMessageStore).mockReturnValue({
      startChat: vi.fn(),
      sendMessage: vi.fn(),
      currentChatId: "chat-1",
      isRequestRunning: false,
      agentId: "agent-1",
    } as unknown as ReturnType<typeof useMessageStore>);

    render(<ChatInput {...defaultProps} persistDraft={true} />);
    const textarea = screen.getByTestId("chat-input-textarea");

    await waitFor(() => {
      expect(textarea).toHaveValue("Saved Draft");
    });
  });

  it("handles attachment file and clears it", async () => {
    const mockClearAttachmentFile = vi.fn();
    const attachmentFile = {
      id: 123,
      title: "test-file.txt",
      fileExst: ".txt",
    };

    render(
      <ChatInput
        {...defaultProps}
        attachmentFile={attachmentFile as Partial<TFile>}
        clearAttachmentFile={mockClearAttachmentFile}
      />,
    );

    await waitFor(() => {
      expect(mockClearAttachmentFile).toHaveBeenCalled();
    });

    const filesList = screen.getByTestId("files-list");
    expect(filesList).toHaveAttribute("data-file-count", "1");
    expect(screen.getByText("test-file.txt")).toBeInTheDocument();
  });
});
