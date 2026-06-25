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

import CreateChat from "./index";
import { useMessageStore } from "../../../../store/messageStore";
import { useChatStore } from "../../../../store/chatStore";
import type { TMessage } from "../../../../../../types/ai";

// Mock stores
vi.mock("../../../../store/messageStore", () => ({
  useMessageStore: vi.fn(),
}));

vi.mock("../../../../store/chatStore", () => ({
  useChatStore: vi.fn(),
}));

// Mock Skeleton
vi.mock("../../../../../../components/rectangle", () => ({
  RectangleSkeleton: () => <div data-testid="skeleton" />,
}));

// Mock SVG
vi.mock("../../../../../../assets/icons/16/plus.svg", () => ({
  default: () => <svg data-testid="plus-icon" />,
}));

// Mock translations
vi.mock("../../../../../../utils/i18n", () => ({
  useCommonTranslation: () => vi.fn((key) => key),
}));

import { ModalDialogProps } from "../../../../../../components/modal-dialog/ModalDialog.types";

describe("<CreateChat />", () => {
  const mockStartNewChat = vi.fn();
  const mockSetCurrentChat = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useMessageStore).mockReturnValue({
      messages: [{ id: 1 } as unknown as TMessage],
      isRequestRunning: false,
      startNewChat: mockStartNewChat,
    } as unknown as ReturnType<typeof useMessageStore>);
    vi.mocked(useChatStore).mockReturnValue({
      setCurrentChat: mockSetCurrentChat,
    } as unknown as ReturnType<typeof useChatStore>);
  });

  it("renders null if no messages", () => {
    vi.mocked(useMessageStore).mockReturnValue({
      messages: [],
    } as unknown as ReturnType<typeof useMessageStore>);
    const { container } = render(<CreateChat />);
    expect(container.firstChild).toBeNull();
  });

  it("renders skeleton when loading", () => {
    render(<CreateChat isLoadingProp={true} />);
    expect(screen.getByTestId("skeleton")).toBeInTheDocument();
  });

  it("blocks click when isDisabled is true", () => {
    render(<CreateChat isDisabled={true} />);
    const button = screen.getByTestId("create-chat");
    fireEvent.click(button);
    expect(mockStartNewChat).not.toHaveBeenCalled();
    expect(mockSetCurrentChat).not.toHaveBeenCalled();
  });

  it("blocks click when isRequestRunning is true", () => {
    vi.mocked(useMessageStore).mockReturnValue({
      messages: [{ id: 1 } as unknown as TMessage],
      isRequestRunning: true,
      startNewChat: mockStartNewChat,
    } as unknown as ReturnType<typeof useMessageStore>);
    render(<CreateChat />);
    const button = screen.getByTestId("create-chat");
    fireEvent.click(button);
    expect(mockStartNewChat).not.toHaveBeenCalled();
    expect(mockSetCurrentChat).not.toHaveBeenCalled();
  });

  it("starts new chat when clicked in normal state", () => {
    render(<CreateChat />);
    const button = screen.getByTestId("create-chat");
    fireEvent.click(button);
    expect(mockSetCurrentChat).toHaveBeenCalledWith(null);
    expect(mockStartNewChat).toHaveBeenCalled();
  });
});
