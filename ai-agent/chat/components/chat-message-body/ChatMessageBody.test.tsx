import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ChatMessageBody from "./index";
import { useMessageStore } from "../../store/messageStore";
import { useChatStore } from "../../store/chatStore";
import socket, { SocketCommands, SocketEvents } from "../../../../utils/socket";
import type { TMessage } from "../../../../types/ai";

import { RoleType } from "../../../../enums";

// Mocks
vi.mock("mobx-react", () => ({
  observer: <T extends React.ComponentType<P>, P extends object>(
    component: T,
  ): T => component,
}));

vi.mock("../../store/messageStore", () => ({
  useMessageStore: vi.fn(),
}));

vi.mock("../../store/chatStore", () => ({
  useChatStore: vi.fn(),
}));

vi.mock("../../../../utils/socket", () => ({
  default: {
    emit: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
  },
  SocketCommands: { Subscribe: "Subscribe", Unsubscribe: "Unsubscribe" },
  SocketEvents: { ChatMessageId: "ChatMessageId" },
}));

vi.mock("./sub-components/empty-screen", () => ({
  default: ({ isLoading }: { isLoading?: boolean }) => (
    <div data-testid="empty-screen">{isLoading ? "loading" : "empty"}</div>
  ),
}));

vi.mock("./sub-components/message", () => ({
  default: ({ message }: { message: TMessage }) => (
    <div data-testid="message-item">{message.id}</div>
  ),
}));

vi.mock("./hooks/useChatScroll", () => ({
  useChatScroll: vi.fn(),
}));

vi.mock("../../../../components/loader", () => ({
  Loader: () => <div data-testid="loader" />,
  LoaderTypes: { track: "track" },
}));

vi.mock("../../../../utils", () => ({
  getCommonTranslation: (key: string) => key,
}));

describe("ChatMessageBody component", () => {
  const defaultProps = {
    userAvatar: "user-avatar-url",
    getIcon: vi.fn(),
    isLoading: false,
    getResultStorageId: vi.fn(),
    setAiPlaylistImages: vi.fn(),
    setMediaViewerVisible: vi.fn(),
    allowExternalNavigation: true,
  };

  const mockMessages: TMessage[] = [
    {
      id: 1,
      contents: [],
      createdOn: "2024-01-01",
      role: RoleType.AssistantMessage,
    },
    {
      id: 2,
      contents: [],
      createdOn: "2024-01-02",
      role: RoleType.UserMessage,
    },
  ];

  const mockedUseMessageStore = vi.mocked(useMessageStore);
  const mockedUseChatStore = vi.mocked(useChatStore);
  const mockedSocket = vi.mocked(socket);

  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseMessageStore.mockReturnValue({
      messages: [],
      isStreamRunning: false,
      isRequestRunning: false,
      fetchNextMessages: vi.fn(),
      addMessageId: vi.fn(),
    } as unknown as ReturnType<typeof useMessageStore>);
    mockedUseChatStore.mockReturnValue({
      currentChat: {
        id: "chat-1",
        title: "Test Chat",
        createdOn: "",
        modifiedOn: "now",
        createdBy: {
          avatarOriginal: "user-avatar-url",
          id: "user-1",
          userName: "User",
          displayName: "User Name",
          avatar: "url",
          avatarSmall: "url-sm",
        },
      },
    } as unknown as ReturnType<typeof useChatStore>);
  });

  it("renders EmptyScreen when no messages", () => {
    render(<ChatMessageBody {...defaultProps} />);
    expect(screen.getByTestId("empty-screen")).toBeInTheDocument();
  });

  it("renders EmptyScreen when isLoading is true", () => {
    render(<ChatMessageBody {...defaultProps} isLoading={true} />);
    expect(screen.getByTestId("empty-screen")).toBeInTheDocument();
    expect(screen.getByText("loading")).toBeInTheDocument();
  });

  it("renders messages list when messages are present", () => {
    mockedUseMessageStore.mockReturnValue({
      messages: mockMessages,
      isStreamRunning: false,
      isRequestRunning: false,
      fetchNextMessages: vi.fn(),
      addMessageId: vi.fn(),
    } as unknown as ReturnType<typeof useMessageStore>);

    render(<ChatMessageBody {...defaultProps} />);

    expect(screen.queryByTestId("empty-screen")).not.toBeInTheDocument();
    const messages = screen.getAllByTestId("message-item");
    expect(messages).toHaveLength(2);
    expect(messages[0]).toHaveTextContent("1");
    expect(messages[1]).toHaveTextContent("2");
  });

  it("subscribes to socket on mount and unsubscribes on unmount", () => {
    const { unmount } = render(<ChatMessageBody {...defaultProps} />);

    expect(mockedSocket!.emit).toHaveBeenCalledWith(SocketCommands.Subscribe, {
      roomParts: "CHAT-chat-1",
    });

    unmount();

    expect(mockedSocket!.emit).toHaveBeenCalledWith(
      SocketCommands.Unsubscribe,
      {
        roomParts: "CHAT-chat-1",
      },
    );
  });

  it("sets up socket listener for ChatMessageId", () => {
    const addMessageId = vi.fn();
    mockedUseMessageStore.mockReturnValue({
      messages: [],
      isStreamRunning: false,
      isRequestRunning: false,
      fetchNextMessages: vi.fn(),
      addMessageId,
    } as unknown as ReturnType<typeof useMessageStore>);

    render(<ChatMessageBody {...defaultProps} />);

    expect(mockedSocket!.on).toHaveBeenCalledWith(
      SocketEvents.ChatMessageId,
      expect.any(Function),
    );

    // Simulate event
    const callback = mockedSocket!.on.mock.calls.find(
      (call) => call[0] === SocketEvents.ChatMessageId,
    )?.[1];
    if (callback) {
      (callback as (data: { messageId: number }) => void)({ messageId: 456 });
      expect(addMessageId).toHaveBeenCalledWith(456);
    }
  });

  it("shows loader when request is running but not streaming", () => {
    mockedUseMessageStore.mockReturnValue({
      messages: mockMessages,
      isStreamRunning: false,
      isRequestRunning: true,
      fetchNextMessages: vi.fn(),
      addMessageId: vi.fn(),
    } as unknown as ReturnType<typeof useMessageStore>);

    render(<ChatMessageBody {...defaultProps} />);

    expect(screen.getByTestId("chat-loader-container")).toBeInTheDocument();
    expect(screen.getByText("Analyzing")).toBeInTheDocument();
  });

  it("does not show loader when streaming", () => {
    mockedUseMessageStore.mockReturnValue({
      messages: mockMessages,
      isStreamRunning: true,
      isRequestRunning: true,
      fetchNextMessages: vi.fn(),
      addMessageId: vi.fn(),
    } as unknown as ReturnType<typeof useMessageStore>);

    render(<ChatMessageBody {...defaultProps} />);

    expect(
      screen.queryByTestId("chat-loader-container"),
    ).not.toBeInTheDocument();
  });
});
