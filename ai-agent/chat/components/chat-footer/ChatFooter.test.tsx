// (c) Copyright Ascensio System SIA 2009-2026
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

import ChatFooter from "./index";
import ChatInput from "../chat-input";
import { ChatFooterProps } from "../../Chat.types";

// Mock child components to isolate ChatFooter
vi.mock("../chat-input", () => ({
  default: vi.fn(() => <div data-testid="mock-chat-input" />),
}));

vi.mock("../chat-info-block", () => ({
  ChatInfoBlock: vi.fn(() => <div data-testid="mock-chat-info-block" />),
}));

describe("<ChatFooter />", () => {
  const defaultProps: ChatFooterProps = {
    isLoading: false,
    aiReady: true,
    isPortalAdmin: false,
    standalone: false,
    attachmentFile: null,
    clearAttachmentFile: vi.fn(),
    getIcon: vi.fn(),
    selectedModel: "gpt-4",
    toolsSettings: {
      servers: [],
      MCPTools: new Map(),
      toolCallingSupported: true,
      webSearchAvailable: false,
      webSearchEnabled: false,
      isFetched: true,
      knowledgeSearchToolName: "",
      webSearchToolName: "",
      webCrawlingToolName: "",
      generateDocxToolName: "",
      generatePresentationToolName: "",
      generateFormToolName: "",
      setServers: vi.fn(),
      setMCPTools: vi.fn(),
      setWebSearchEnabled: vi.fn(),
      setIsFetched: vi.fn(),
      fetchTools: vi.fn(),
      initTools: vi.fn(),
      thinkingSupported: false,
      thinkingEnabled: false,
      setThinkingEnabled: vi.fn(),
    },
    multimodal: { image: { formats: [] } },
    goToWebSearchSettings: vi.fn(),
    persistDraft: false,
    allowAttachFiles: true,
    allowManageTools: true,
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders ChatInput always", () => {
    render(<ChatFooter {...defaultProps} />);
    expect(screen.getByTestId("mock-chat-input")).toBeInTheDocument();
  });

  it("renders ChatInfoBlock only when not loading and AI is not ready", () => {
    const { rerender } = render(
      <ChatFooter {...defaultProps} aiReady={false} isLoading={false} />,
    );
    expect(screen.getByTestId("mock-chat-info-block")).toBeInTheDocument();

    rerender(<ChatFooter {...defaultProps} aiReady={true} isLoading={false} />);
    expect(
      screen.queryByTestId("mock-chat-info-block"),
    ).not.toBeInTheDocument();

    rerender(<ChatFooter {...defaultProps} aiReady={false} isLoading={true} />);
    expect(
      screen.queryByTestId("mock-chat-info-block"),
    ).not.toBeInTheDocument();
  });
});
