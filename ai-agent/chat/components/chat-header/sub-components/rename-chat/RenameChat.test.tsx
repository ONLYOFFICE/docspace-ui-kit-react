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
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";

import RenameChat from "./index";
import { useChatStore } from "../../../../store/chatStore";

// Mock store
vi.mock("../../../../store/chatStore", () => ({
  useChatStore: vi.fn(),
}));

// Mock components
vi.mock("../../../../../../components/modal-dialog", () => ({
  ModalDialog: Object.assign(
    ({
      children,
      visible,
    }: {
      children: React.ReactNode;
      visible: boolean;
      onClose: () => void;
    }) => (visible ? <div data-testid="modal">{children}</div> : null),
    {
      Header: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="modal-header">{children}</div>
      ),
      Body: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="modal-body">{children}</div>
      ),
      Footer: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="modal-footer">{children}</div>
      ),
    },
  ),
  ModalDialogType: { modal: "modal" },
}));

vi.mock("../../../../../../components/text-input", () => ({
  TextInput: ({
    value,
    onChange,
    placeholder,
  }: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
  }) => (
    <input
      data-testid="rename-input"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  ),
  InputSize: { base: "base" },
  InputType: { text: "text" },
}));

vi.mock("../../../../../../components/button", () => ({
  Button: ({
    label,
    onClick,
    isDisabled,
    isLoading,
    testId,
  }: {
    label: string;
    onClick: () => void;
    isDisabled?: boolean;
    isLoading?: boolean;
    testId?: string;
  }) => (
    <button
      data-testid={testId}
      onClick={onClick}
      disabled={isDisabled || isLoading}
    >
      {label}
    </button>
  ),
  ButtonSize: { normal: "normal" },
}));

// Mock translations
vi.mock("../../../../../../utils/i18n", () => ({
  useCommonTranslation: () => vi.fn((key) => key),
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
