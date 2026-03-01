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
    setIsAIAgentChatDelete: vi.fn(),
    setDeleteDialogVisible: vi.fn(),
    folderFormValidation: /dummy/,
    allowSelectChat: true,
  };

  it("renders SelectChat only when allowSelectChat is true", () => {
    const { rerender } = render(<ChatHeader {...defaultProps} />);
    expect(screen.getByTestId("mock-select-chat")).toBeInTheDocument();

    rerender(<ChatHeader {...defaultProps} allowSelectChat={false} />);
    expect(screen.queryByTestId("mock-select-chat")).not.toBeInTheDocument();
  });

  it("passes aiReady correctly to CreateChat", () => {
    const { rerender } = render(<ChatHeader {...defaultProps} aiReady={true} />);
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
