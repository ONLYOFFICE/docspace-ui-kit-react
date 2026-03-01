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
vi.mock("../../../../../../assets/icons/16/plus.react.svg", () => ({
  default: () => <svg data-testid="plus-icon" />,
}));

// Mock translations
vi.mock("../../../../../../utils", () => ({
  getCommonTranslation: vi.fn((key) => key),
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
