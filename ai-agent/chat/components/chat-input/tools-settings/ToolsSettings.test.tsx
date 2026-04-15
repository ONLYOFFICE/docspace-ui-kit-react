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

vi.mock("mobx-react", () => ({
  observer: (component: React.FC) => component,
}));

import ToolsSettings from "./index";
import { useChatStore } from "../../../store/chatStore";
import { useMessageStore } from "../../../store/messageStore";
import { useTheme } from "../../../../../context/ThemeContext";
import { useApi } from "../../../../../providers";
import useToolsSettings from "../../../hooks/useToolsSettings";
import { ServerType } from "../../../../../enums";
import type { TServer, TMCPTool } from "../../../../../types/ai";

// Mock stores and hooks
vi.mock("../../../store/chatStore", () => ({ useChatStore: vi.fn() }));
vi.mock("../../../store/messageStore", () => ({ useMessageStore: vi.fn() }));
vi.mock("../../../../../context/ThemeContext", () => ({ useTheme: vi.fn() }));
vi.mock("../../../../../providers", () => ({ useApi: vi.fn() }));

// Mock components
vi.mock("../../../../../components/context-menu", () => ({
  ContextMenu: React.forwardRef<unknown, { model: Record<string, unknown>[] }>(
    (props, ref) => {
      React.useImperativeHandle(ref, () => ({
        show: vi.fn(),
      }));
      return (
        <div data-testid="context-menu">
          {props.model.map((item) => (
            <div
              key={item.key as string}
              onClick={(e) => {
                e.stopPropagation();
                (item.onClick as () => void)?.();
              }}
              data-testid={`menu-item-${item.key}`}
            >
              {item.label as React.ReactNode}
              {typeof item.getTooltipContent === "function"
                ? (item.getTooltipContent as () => React.ReactNode)()
                : null}
            </div>
          ))}
        </div>
      );
    },
  ),
}));

vi.mock("../../../../../components/icon-button", () => ({
  IconButton: () => <button>icon</button>,
}));

vi.mock("../../../../../components/link", () => ({
  Link: ({
    children,
    onClick,
    dataTestId,
  }: {
    children: React.ReactNode;
    onClick: () => void;
    dataTestId?: string;
  }) => (
    <button onClick={onClick} data-testid={dataTestId}>
      {children}
    </button>
  ),
  LinkType: { action: "action" },
}));

vi.mock("../../../../../components/tooltip", () => ({
  TooltipContainer: (props: Record<string, unknown>) => (
    <div
      onClick={props.onClick as () => void}
      title={props.title as string}
      data-testid={props["data-testid"] as string}
    >
      {props.children as React.ReactNode}
    </div>
  ),
  withTooltip: <T,>(Component: T) => Component,
}));

vi.mock("../../../../../components/text", () => ({
  Text: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("../../../../../components/portal", () => ({
  Portal: ({ element }: { element: React.ReactNode }) => (
    <div data-testid="portal">{element}</div>
  ),
}));

vi.mock("../../../../../components/aside", () => ({
  Aside: ({
    children,
    header,
    onClose,
  }: {
    children: React.ReactNode;
    header: string;
    onClose: () => void;
  }) => (
    <div data-testid="aside">
      <h2>{header}</h2>
      <button onClick={onClose}>close</button>
      {children}
    </div>
  ),
}));

vi.mock("../../../../../components/button", () => ({
  Button: ({ label, onClick }: { label: string; onClick: () => void }) => (
    <button onClick={onClick}>{label}</button>
  ),
  ButtonSize: { small: "small" },
}));

vi.mock("../../../../../components/backdrop", () => ({
  Backdrop: () => <div data-testid="backdrop" />,
}));

vi.mock("../../../../../components", () => ({
  HelpButton: () => <button>help</button>,
}));

// Mock Assets
vi.mock("../../../../../assets/mcp.tool.svg", () => ({
  default: () => <svg />,
}));
vi.mock("../../../../../assets/web.search.svg", () => ({
  default: () => <svg />,
}));
vi.mock("../../../../../assets/manage.connection.react.svg", () => ({
  default: () => <svg />,
}));
vi.mock("../../../../../assets/lightbulb.svg", () => ({
  default: () => <svg />,
}));

// Mock utils
vi.mock("../../../../../utils", () => ({
  isMobile: vi.fn(() => false),
}));

vi.mock("../../../../../utils/i18n", () => ({
  useCommonTranslation: () => vi.fn((key) => key),
}));

vi.mock("../../../../../utils/ai/getServerIcon", () => ({
  getServerIcon: vi.fn(() => <svg />),
}));

describe("<ToolsSettings />", () => {
  const mockSetServers = vi.fn();
  const mockSetMCPTools = vi.fn();
  const mockSetWebSearchEnabled = vi.fn();
  const mockAiApi = {
    updateUserChatSettings: vi.fn(),
    changeMCPToolsForRoom: vi.fn(),
    disconnectServer: vi.fn(),
    connectServer: vi.fn(),
    getMCPToolsForRoom: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useChatStore).mockReturnValue({
      agentId: "123",
    } as unknown as ReturnType<typeof useChatStore>);
    vi.mocked(useMessageStore).mockReturnValue({
      thinkingEnabled: false,
      setThinkingEnabled: vi.fn(),
      setKnowledgeSearchToolName: vi.fn(),
      setWebSearchToolName: vi.fn(),
      setWebCrawlingToolName: vi.fn(),
      setGenerateDocxToolName: vi.fn(),
      setGenerateFormToolName: vi.fn(),
      setGeneratePresentationToolName: vi.fn(),
    } as unknown as ReturnType<typeof useMessageStore>);
    vi.mocked(useTheme).mockReturnValue({
      isBase: true,
    } as unknown as ReturnType<typeof useTheme>);
    vi.mocked(useApi).mockReturnValue({
      aiApi: mockAiApi,
      thirdPartyApi: {
        getThirdPartyCode: vi.fn(),
      },
      baseUrl: "https://test.com",
    } as unknown as ReturnType<typeof useApi>);
  });

  const defaultProps: ReturnType<typeof useToolsSettings> & {
    aiReady: boolean;
    isAdmin: boolean;
    goToWebSearchSettings: () => void;
  } = {
    servers: [
      {
        id: "s1",
        name: "Server 1",
        serverType: ServerType.Portal,
        connected: true,
      },
    ] as unknown as TServer[],
    MCPTools: new Map([
      ["s1", [{ name: "tool1", enabled: true }]],
    ]) as unknown as Map<string, TMCPTool[]>,
    webSearchAvailable: true,
    webSearchEnabled: true,
    isFetched: true,
    knowledgeSearchToolName: "",
    webSearchToolName: "",
    webCrawlingToolName: "",
    generateDocxToolName: "",
    generateFormToolName: "",
    generatePresentationToolName: "",
    thinkingSupported: true,
    thinkingEnabled: false,
    setThinkingEnabled: vi.fn(),
    setServers: mockSetServers,
    setMCPTools: mockSetMCPTools,
    setWebSearchEnabled: mockSetWebSearchEnabled,
    setIsFetched: vi.fn(),
    fetchTools: vi.fn(),
    initTools: vi.fn(),
    aiReady: true,
    isAdmin: false,
    goToWebSearchSettings: vi.fn(),
  };

  it("renders tools button correctly", () => {
    render(<ToolsSettings {...defaultProps} />);
    expect(screen.getByTestId("chat-input-tools-button")).toBeInTheDocument();
    expect(screen.getByText("Tools")).toBeInTheDocument();
  });

  it("opens context menu when tools button is clicked", () => {
    render(<ToolsSettings {...defaultProps} />);
    const button = screen.getByTestId("chat-input-tools-button");
    fireEvent.click(button);
    expect(screen.getByTestId("context-menu")).toBeInTheDocument();
  });

  it("renders web search tooltip and admin link", () => {
    render(<ToolsSettings {...defaultProps} isAdmin={true} />);
    fireEvent.click(screen.getByTestId("chat-input-tools-button"));

    expect(screen.getByText("ConnectWebSearch")).toBeInTheDocument();
    expect(screen.getByTestId("go-to-settings-link")).toBeInTheDocument();

    const settingsLink = screen.getByTestId("go-to-settings-link");
    fireEvent.click(settingsLink);
    expect(defaultProps.goToWebSearchSettings).toHaveBeenCalled();
  });

  it("handles server disconnection in aside", () => {
    const connectedExternal: TServer[] = [
      {
        id: "s2",
        name: "Connected Server",
        serverType: ServerType.GitHub,
        connected: true,
      } as TServer,
    ];
    render(<ToolsSettings {...defaultProps} servers={connectedExternal} />);

    // Open aside
    fireEvent.click(screen.getByTestId("chat-input-tools-button"));
    fireEvent.click(screen.getByTestId("menu-item-manage-connections"));

    const disconnectBtn = screen.getByText("Disconnect");
    fireEvent.click(disconnectBtn);

    expect(mockAiApi.disconnectServer).toHaveBeenCalledWith(123, "s2");
  });

  it("handles aside close button", () => {
    const serversWithExternal: TServer[] = [
      {
        id: "s1",
        name: "External Server",
        serverType: ServerType.GitHub,
        connected: false,
      } as TServer,
    ];
    render(<ToolsSettings {...defaultProps} servers={serversWithExternal} />);

    fireEvent.click(screen.getByTestId("chat-input-tools-button"));
    fireEvent.click(screen.getByTestId("menu-item-manage-connections"));

    const closeBtn = screen.getByText("close");
    fireEvent.click(closeBtn);

    expect(screen.queryByTestId("aside")).not.toBeInTheDocument();
  });

  it("handles thinking toggle", () => {
    const mockSetThinkingEnabled = vi.fn();

    render(
      <ToolsSettings
        {...defaultProps}
        thinkingSupported={true}
        thinkingEnabled={false}
        setThinkingEnabled={mockSetThinkingEnabled}
      />,
    );

    fireEvent.click(screen.getByTestId("chat-input-tools-button"));

    const thinkingItem = screen.getByText("ExtendedThinking");
    fireEvent.click(thinkingItem);

    expect(mockSetThinkingEnabled).toHaveBeenCalledWith(true);
  });

  it("shows disabled thinking when not supported", () => {
    render(<ToolsSettings {...defaultProps} thinkingSupported={false} />);

    fireEvent.mouseEnter(screen.getByTestId("chat-input-tools-button"));

    expect(
      screen.getByText("ExtendedThinkingNotSupported"),
    ).toBeInTheDocument();
  });
});
