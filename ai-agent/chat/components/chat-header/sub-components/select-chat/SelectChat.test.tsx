/*
 * (c) Copyright Ascensio System SIA 2009-2026
 *
 * This program is a free software product.
 * You can redistribute it and/or modify it under the terms
 * of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
 * Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
 * to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
 * any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
 * of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
 * the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
 *
 * The  interactive user interfaces in modified source and object code versions of the Program must
 * display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product logo when
 * distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
 * trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
 * content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
 * International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { ChatList, type ChatListProps } from "../chat-list";

import SelectChat from "./index";
import { useChatStore } from "../../../../store/chatStore";
import { useMessageStore } from "../../../../store/messageStore";
import { useApi } from "../../../../../../providers";
import socket, { SocketEvents } from "../../../../../../utils/socket";
import { toastr } from "../../../../../../components/toast";

import type { TChat, TMessage } from "../../../../../../types/ai";

// Mock stores
vi.mock("../../../../store/chatStore", () => ({
  useChatStore: vi.fn(),
}));

vi.mock("../../../../store/messageStore", () => ({
  useMessageStore: vi.fn(),
}));

vi.mock("../../../../../../providers", () => ({
  useApi: vi.fn(),
}));

// Mock Socket
vi.mock("../../../../../../utils/socket", () => ({
  default: {
    emit: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
  },
  SocketCommands: { Subscribe: "subscribe", Unsubscribe: "unsubscribe" },
  SocketEvents: { ExportChat: "export-chat" },
}));

// Mock components
vi.mock("../chat-list", () => ({
  ChatList: ({ onSelectChat, contextModel }: ChatListProps) => (
    <div data-testid="chat-list">
      <button onClick={() => onSelectChat("chat-1")}>Select Chat</button>
      <div data-testid="context-actions">
        {contextModel.map((item: unknown) => {
          const m = item as {
            key: string;
            onClick: () => void;
            label: string;
            isSeparator?: boolean;
          };
          return (
            !m.isSeparator && (
              <button
                key={m.key}
                onClick={m.onClick}
                data-testid={`action-${m.key}`}
              >
                {m.label}
              </button>
            )
          );
        })}
      </div>
    </div>
  ),
}));

vi.mock("../rename-chat", () => ({
  default: () => <div data-testid="rename-chat" />,
}));

vi.mock("../../../export-selector", () => ({
  default: ({
    onSubmit,
  }: {
    onSubmit: (
      folderId: string,
      title: string,
      isFolder: boolean,
      folderPermissions: unknown[],
      filename: string,
      isExport: boolean,
    ) => void;
  }) => (
    <div data-testid="export-selector">
      <button
        onClick={() =>
          onSubmit("folder-1", "title", false, [], "file.docx", true)
        }
      >
        Submit Export
      </button>
    </div>
  ),
}));

vi.mock("../../../../../../components/drop-down", () => ({
  DropDown: ({
    children,
    open,
  }: {
    children: React.ReactNode;
    open: boolean;
  }) => (open ? <div data-testid="dropdown">{children}</div> : null),
}));

vi.mock("../../../../../../components/rectangle", () => ({
  RectangleSkeleton: () => <div data-testid="skeleton" />,
}));

vi.mock("../../../../../../components/tooltip", () => ({
  TooltipContainer: React.forwardRef<
    HTMLDivElement,
    { children: React.ReactNode; onClick: () => void; className?: string }
  >(({ children, onClick, className }, ref) => (
    <div
      ref={ref}
      onClick={onClick}
      className={className}
      data-testid="selector-icon"
    >
      {children}
    </div>
  )),
  withTooltip:
    <T extends object>(Component: React.ComponentType<T>) =>
    (props: T) => <Component {...props} />,
}));

vi.mock("../../../../../../components/toast", () => ({
  toastr: { success: vi.fn(), error: vi.fn() },
}));

// Mock Assets
vi.mock("../../../../../../assets/select.session.react.svg", () => ({
  default: () => <svg />,
}));
vi.mock("../../../../../../assets/rename.react.svg", () => ({
  default: () => <svg />,
}));
vi.mock("../../../../../../assets/icons/16/catalog.trash.react.svg", () => ({
  default: () => <svg />,
}));
vi.mock("../../../../../../assets/message.save.svg", () => ({
  default: () => <svg />,
}));

// Mock utils
vi.mock("../../../../utils", () => ({
  openFile: vi.fn(),
  getCommonTranslation: vi.fn((key: string) => key),
}));

describe("<SelectChat />", () => {
  const mockFetchChat = vi.fn();
  const mockFetchMessages = vi.fn();
  const mockDeleteChat = vi.fn();
  const mockExportChat = vi.fn();
  const mockStartNewChat = vi.fn();
  const mockUpdateUrlChatId = vi.fn();
  const mockSetCurrentChat = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useChatStore).mockReturnValue({
      chats: [{ id: "chat-1", title: "Chat 1" } as TChat],
      isLoading: false,
      currentChat: { id: "chat-1" } as TChat,
      fetchChat: mockFetchChat,
      deleteChat: mockDeleteChat,
      totalChats: 1,
      fetchNextChats: vi.fn(),
      hasNextChats: false,
      updateUrlChatId: mockUpdateUrlChatId,
      setCurrentChat: mockSetCurrentChat,
    } as unknown as ReturnType<typeof useChatStore>);
    vi.mocked(useMessageStore).mockReturnValue({
      messages: [{ id: 1 } as unknown as TMessage],
      fetchMessages: mockFetchMessages,
      startNewChat: mockStartNewChat,
      isRequestRunning: false,
    } as unknown as ReturnType<typeof useMessageStore>);
    vi.mocked(useApi).mockReturnValue({
      aiApi: { exportChat: mockExportChat },
    } as unknown as ReturnType<typeof useApi>);
  });

  const defaultProps = {
    agentId: "123",
    getIcon: vi.fn(),
    getResultStorageId: () => 1,
    isLoadingProp: false,
  };

  it("renders skeleton when isLoadingProp is true", () => {
    render(<SelectChat {...defaultProps} isLoadingProp={true} />);
    expect(screen.getByTestId("skeleton")).toBeInTheDocument();
  });

  it("blocks click when isRequestRunning is true", () => {
    vi.mocked(useMessageStore).mockReturnValue({
      messages: [{ id: 1 } as unknown as TMessage],
      isRequestRunning: true,
      startNewChat: mockStartNewChat,
    } as unknown as ReturnType<typeof useMessageStore>);
    render(<SelectChat {...defaultProps} />);

    const icon = screen.getByTestId("selector-icon");
    fireEvent.click(icon);

    expect(screen.queryByTestId("dropdown")).not.toBeInTheDocument();
  });

  it("renders null if no chats", () => {
    vi.mocked(useChatStore).mockReturnValue({
      chats: [],
      currentChat: null,
      isLoading: false,
    } as unknown as ReturnType<typeof useChatStore>);
    const { container } = render(<SelectChat {...defaultProps} />);
    expect(container.firstChild).toBeNull();
  });

  it("toggles dropdown visibility", () => {
    render(<SelectChat {...defaultProps} />);
    const icon = screen.getByTestId("selector-icon");

    // Closed by default (in our mock)
    expect(screen.queryByTestId("dropdown")).not.toBeInTheDocument();

    fireEvent.click(icon);
    expect(screen.getByTestId("dropdown")).toBeInTheDocument();
  });

  it("handles chat selection", () => {
    render(<SelectChat {...defaultProps} />);
    fireEvent.click(screen.getByTestId("selector-icon"));

    const selectButton = screen.getByText("Select Chat");
    fireEvent.click(selectButton);

    expect(mockFetchChat).toHaveBeenCalledWith("chat-1");
    expect(mockFetchMessages).toHaveBeenCalledWith("chat-1");
    expect(screen.queryByTestId("dropdown")).not.toBeInTheDocument();
  });

  it("opens rename modal from context menu", () => {
    render(<SelectChat {...defaultProps} />);
    fireEvent.click(screen.getByTestId("selector-icon"));

    const renameButton = screen.getByTestId("action-rename");
    fireEvent.click(renameButton);

    expect(screen.getByTestId("rename-chat")).toBeInTheDocument();
  });

  it("handles export flow", async () => {
    mockExportChat.mockResolvedValue(undefined);
    render(<SelectChat {...defaultProps} />);
    fireEvent.click(screen.getByTestId("selector-icon"));

    const exportButton = screen.getByTestId("action-save_to_file");
    fireEvent.click(exportButton);

    expect(screen.getByTestId("export-selector")).toBeInTheDocument();

    const submitButton = screen.getByText("Submit Export");
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockExportChat).toHaveBeenCalled());
    expect(vi.mocked(socket!.emit)).toHaveBeenCalledWith(
      "subscribe",
      expect.anything(),
    );

    // Wait for socket.on to be called
    await waitFor(() => {
      const calls = vi.mocked(socket!.on).mock.calls;
      const exportCall = calls.find(
        (call) => call[0] === SocketEvents.ExportChat,
      );
      expect(exportCall).toBeDefined();
    });

    const calls = vi.mocked(socket!.on).mock.calls;
    const exportCall = calls.find(
      (call) => call[0] === SocketEvents.ExportChat,
    );
    const socketCallback = exportCall![1] as (data: {
      resultFile: { id: number };
    }) => void;

    socketCallback({ resultFile: { id: 100 } });

    expect(vi.mocked(toastr.success)).toHaveBeenCalled();
  });
});
