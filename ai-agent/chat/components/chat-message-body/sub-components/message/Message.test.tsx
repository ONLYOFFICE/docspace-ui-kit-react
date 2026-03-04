import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Message from "./index";
import { ContentType, RoleType } from "../../../../../../enums";
import type { TMessage, TContent } from "../../../../../../types/ai";
import copy from "copy-to-clipboard";

// Mocks
vi.mock("mobx-react", () => ({
  observer: <T extends React.ComponentType<P>, P extends object>(component: T): T => component,
}));

vi.mock("copy-to-clipboard", () => ({
  default: vi.fn(),
}));

vi.mock("../../../../../../providers", () => ({
  useApi: () => ({ baseUrl: "mock-url" }),
}));

vi.mock("../../../../store/chatStore", () => ({
  useChatStore: () => ({
    currentChat: { id: "chat-1", createdBy: { avatarOriginal: "url" }, title: "Chat Title" },
  }),
}));

vi.mock("../../../../store/messageStore", () => ({
  useMessageStore: () => ({
    generateDocxToolName: "generate-docx",
    generateFormToolName: "generate-form",
    generatePresentationToolName: "generate-presentation",
  }),
}));

vi.mock("./Markdown", () => ({
  default: ({ chatMessage }: { chatMessage: string }) => <div data-testid="markdown">{chatMessage}</div>,
}));

vi.mock("./ToolCallMessage", () => ({
  default: ({ content }: { content: { name: string } }) => <div data-testid="tool-call">{content.name}</div>,
}));

vi.mock("./Error", () => ({
  default: ({ content }: { content: { text: string } }) => <div data-testid="error-comp">{content.text}</div>,
}));

vi.mock("./Files", () => ({
  default: ({ files }: { files: Array<{ id: number; title: string }> }) => (
    <div data-testid="files-comp">
      {files.map((f) => <span key={f.id}>{f.title}</span>)}
    </div>
  ),
}));

vi.mock("./Images", () => ({
  default: ({ images }: { images: Array<{ id: number }> }) => (
    <div data-testid="images-comp">
      {images.map((i) => <span key={i.id}>{i.id}</span>)}
    </div>
  ),
}));

vi.mock("./Buttons", () => ({
  default: ({ text }: { text: string }) => <div data-testid="buttons-comp">{text}</div>,
}));

vi.mock("../../../../../../components/avatar", () => ({
  Avatar: () => <div data-testid="avatar" />,
  AvatarRole: { user: "user" },
  AvatarSize: { min: "min" },
}));

vi.mock("../../../../../../components/text", () => ({
  Text: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}));

vi.mock("../../../../../../utils", () => ({
  getCommonTranslation: (key: string) => key,
}));

vi.mock("linkify-react", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe("Message component", () => {
  const getIcon = vi.fn();
  const getResultStorageId = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders user message with text, images and files", () => {
    const userMessage: TMessage = {
      role: RoleType.UserMessage,
      createdOn: "2024-01-01",
      contents: [
        { type: ContentType.Text, text: "User ping" },
        { type: ContentType.Images, id: 1, url: "img-url", fileType: 1 },
        { type: ContentType.Files, id: 2, title: "file.txt", extension: ".txt" },
      ],
    };

    render(
      <Message
        message={userMessage}
        idx={0}
        userAvatar="avatar-url"
        isLast={true}
        getIcon={getIcon}
        getResultStorageId={getResultStorageId}
      />
    );

    expect(screen.getByTestId("user-message")).toBeInTheDocument();
    expect(screen.getByText("User ping")).toBeInTheDocument();
    expect(screen.getByTestId("images-comp")).toBeInTheDocument();
    expect(screen.getByTestId("files-comp")).toBeInTheDocument();
  });

  it("calls copy on user message copy button click", () => {
    const userMessage: TMessage = {
        role: RoleType.UserMessage,
        createdOn: "2024-01-01",
        contents: [
          { type: ContentType.Text, text: "hello" },
        ],
      };
  
      render(
        <Message
          message={userMessage}
          idx={0}
          userAvatar="avatar-url"
          isLast={true}
          getIcon={getIcon}
          getResultStorageId={getResultStorageId}
        />
      );

      fireEvent.click(screen.getByTitle("CopyMessage"));
      expect(copy).toHaveBeenCalledWith("hello");
  });

  it("renders error message", () => {
    const errorMessage: TMessage = {
      role: RoleType.Error,
      createdOn: "2024-01-01",
      contents: [{ type: ContentType.Text, text: "Crit error" }],
    };

    render(
      <Message
        message={errorMessage}
        idx={0}
        userAvatar="avatar-url"
        isLast={true}
        getIcon={getIcon}
        getResultStorageId={getResultStorageId}
      />
    );

    expect(screen.getByTestId("error-message")).toBeInTheDocument();
    expect(screen.getByTestId("error-comp")).toBeInTheDocument();
  });

  it("renders AI message with Markdown and Buttons", () => {
    const aiMessage: TMessage = {
      role: RoleType.AssistantMessage,
      id: 123,
      createdOn: "2024-01-01",
      contents: [{ type: ContentType.Text, text: "AI response" }],
    };

    render(
      <Message
        message={aiMessage}
        idx={1}
        userAvatar="avatar-url"
        isLast={true}
        getIcon={getIcon}
        getResultStorageId={getResultStorageId}
      />
    );

    expect(screen.getByTestId("ai-message")).toBeInTheDocument();
    expect(screen.getByTestId("markdown")).toHaveTextContent("AI response");
    expect(screen.getByTestId("buttons-comp")).toBeInTheDocument();
  });

  it("extracts files from tool calls for AI message", () => {
    const aiMessage: TMessage = {
        role: RoleType.AssistantMessage,
        id: 123,
        createdOn: "2024-01-01",
        contents: [
            {
                type: ContentType.Tool,
                name: "generate-docx",
                arguments: {},
                result: { data: { id: 1, title: "output.docx", extension: ".docx" } }
            } as TContent
        ],
      };
  
      render(
        <Message
          message={aiMessage}
          idx={1}
          userAvatar="avatar-url"
          isLast={true}
          getIcon={getIcon}
          getResultStorageId={getResultStorageId}
        />
      );

      expect(screen.getByTestId("tool-call")).toBeInTheDocument();
      expect(screen.getByTestId("files-comp")).toHaveTextContent("output.docx");
  });
});
