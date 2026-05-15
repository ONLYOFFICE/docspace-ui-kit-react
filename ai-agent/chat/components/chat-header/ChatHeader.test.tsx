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

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

import ChatHeader from "./index";
import { ChatHeaderProps } from "../../Chat.types";

// Mock sub-components
vi.mock("./sub-components/select-chat", () => ({
  default: vi.fn(() => <div data-testid="mock-select-chat" />),
}));

vi.mock("./sub-components/create-chat", () => ({
  default: vi.fn(({ isDisabled }) => (
    <div data-testid="mock-create-chat" data-disabled={isDisabled} />
  )),
}));

vi.mock("./sub-components/select-model", () => ({
  default: vi.fn(() => <div data-testid="mock-select-model" />),
}));

describe("<ChatHeader />", () => {
  const defaultProps: ChatHeaderProps = {
    selectedModel: "gpt-4",
    isLoading: false,
    getIcon: vi.fn(),
    agentId: "123",
    aiReady: true,
    getResultStorageId: vi.fn(),
    allowSelectChat: true,
  };

  it("renders SelectChat only when allowSelectChat is true", () => {
    const { rerender } = render(<ChatHeader {...defaultProps} />);
    expect(screen.getByTestId("mock-select-chat")).toBeInTheDocument();

    rerender(<ChatHeader {...defaultProps} allowSelectChat={false} />);
    expect(screen.queryByTestId("mock-select-chat")).not.toBeInTheDocument();
  });

  it("passes aiReady correctly to CreateChat", () => {
    const { rerender } = render(
      <ChatHeader {...defaultProps} aiReady={true} />,
    );
    let createChat = screen.getByTestId("mock-create-chat");
    expect(createChat.getAttribute("data-disabled")).toBe("false");

    rerender(<ChatHeader {...defaultProps} aiReady={false} />);
    createChat = screen.getByTestId("mock-create-chat");
    expect(createChat.getAttribute("data-disabled")).toBe("true");
  });

  it("renders basic building blocks", () => {
    render(<ChatHeader {...defaultProps} />);
    expect(screen.getByTestId("mock-create-chat")).toBeInTheDocument();
    expect(screen.getByTestId("mock-select-model")).toBeInTheDocument();
  });
});
