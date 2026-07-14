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
      toolCallingSupported: true,
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
