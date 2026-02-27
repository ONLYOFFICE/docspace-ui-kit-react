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

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";

import RenameChat from "./RenameChat";
import { useChatStore } from "../../../store/chatStore";

// Mock store
vi.mock("../../../store/chatStore", () => ({
  useChatStore: vi.fn(),
}));

// Mock components
vi.mock("../../../../../components/modal-dialog", () => ({
  ModalDialog: Object.assign(
    ({ children, visible }: { children: React.ReactNode; visible: boolean; onClose: () => void }) => 
      visible ? <div data-testid="modal">{children}</div> : null,
    {
      Header: ({ children }: { children: React.ReactNode }) => <div data-testid="modal-header">{children}</div>,
      Body: ({ children }: { children: React.ReactNode }) => <div data-testid="modal-body">{children}</div>,
      Footer: ({ children }: { children: React.ReactNode }) => <div data-testid="modal-footer">{children}</div>,
    }
  ),
  ModalDialogType: { modal: "modal" },
}));

vi.mock("../../../../../components/text-input", () => ({
  TextInput: ({ value, onChange, placeholder }: { value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string }) => (
    <input data-testid="rename-input" value={value} onChange={onChange} placeholder={placeholder} />
  ),
  InputSize: { base: "base" },
  InputType: { text: "text" },
}));

vi.mock("../../../../../components/button", () => ({
  Button: ({ label, onClick, isDisabled, isLoading, testId }: { label: string; onClick: () => void; isDisabled?: boolean; isLoading?: boolean; testId?: string }) => (
    <button data-testid={testId} onClick={onClick} disabled={isDisabled || isLoading}>
      {label}
    </button>
  ),
  ButtonSize: { normal: "normal" },
}));

// Mock translations
vi.mock("../../../../../utils", () => ({
  getCommonTranslation: vi.fn((key) => key),
}));

describe("<RenameChat />", () => {
  const mockRenameChat = vi.fn();
  const mockOnRenameToggle = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useChatStore).mockReturnValue({
      renameChat: mockRenameChat,
    } as unknown as ReturnType<typeof useChatStore>);
  });

  const defaultProps = {
    chatId: "chat-1",
    prevTitle: "Old Name",
    onRenameToggle: mockOnRenameToggle,
  };

  it("disables save button if input is empty or same as old name", () => {
    render(<RenameChat {...defaultProps} />);
    const saveButton = screen.getByTestId("confirm-button");
    const input = screen.getByTestId("rename-input") as HTMLInputElement;

    expect(saveButton).toBeDisabled(); // empty

    fireEvent.change(input, { target: { value: "Old Name" } });
    expect(saveButton).toBeDisabled(); // same as old

    fireEvent.change(input, { target: { value: "New Name" } });
    expect(saveButton).not.toBeDisabled();
  });

  it("calls renameChat and closes on save", async () => {
    mockRenameChat.mockResolvedValue(undefined);
    render(<RenameChat {...defaultProps} />);
    const input = screen.getByTestId("rename-input");
    const saveButton = screen.getByTestId("confirm-button");

    fireEvent.change(input, { target: { value: "New Name" } });
    fireEvent.click(saveButton);

    // Wait for the async renameChat to complete
    await vi.waitFor(() => {
      expect(mockRenameChat).toHaveBeenCalledWith("chat-1", "New Name");
      expect(mockOnRenameToggle).toHaveBeenCalled();
    });
  });

  it("handles Enter and Escape keys", () => {
    render(<RenameChat {...defaultProps} />);
    const input = screen.getByTestId("rename-input");

    // Escape
    fireEvent.keyDown(window, { key: "Escape" });
    expect(mockOnRenameToggle).toHaveBeenCalled();

    // Enter
    fireEvent.change(input, { target: { value: "Newer Name" } });
    fireEvent.keyDown(window, { key: "Enter" });
    expect(mockRenameChat).toHaveBeenCalledWith("chat-1", "Newer Name");
  });
});
