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

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ToolCallConfirmDialog } from "./ToolCallConfirmDialog";
import { useMessageStore } from "../../../../../store/messageStore";
import { useApi } from "../../../../../../../providers";
import type { TToolCallContent } from "../../../../../../../types/ai";
import { ToolsPermission, ContentType } from "../../../../../../../enums";

// Mock store and providers
vi.mock("../../../../../store/messageStore", () => ({
  useMessageStore: vi.fn(),
}));
vi.mock("../../../../../../../providers", () => ({
  useApi: vi.fn(),
}));

// Mock components
vi.mock("../../../../../../../components/modal-dialog", () => ({
  ModalDialog: Object.assign(({ children, visible }: { children: React.ReactNode, visible: boolean }) => (
    visible ? <div data-testid="modal-dialog">{children}</div> : null
  ), {
    Header: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Body: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Footer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  }),
  ModalDialogType: { modal: "modal" },
}));

vi.mock("../../../../../../../components/button", () => ({
  Button: ({ onClick, label, "data-testid": testId }: { onClick: () => void, label: string, "data-testid"?: string }) => (
    <button onClick={onClick} data-testid={testId}>{label}</button>
  ),
  ButtonSize: { normal: "normal" },
}));

vi.mock("../../../../../../../components/checkbox", () => ({
  Checkbox: ({ isChecked, onChange, label, "data-testid": testId }: { isChecked: boolean, onChange: (e: { target: { checked: boolean } }) => void, label: string, "data-testid"?: string }) => (
    <label>
      <input
        type="checkbox"
        checked={isChecked}
        onChange={(e) => onChange({ target: { checked: e.target.checked } })}
        data-testid={testId}
      />
      {label}
    </label>
  ),
}));

vi.mock("../../../../../../../components/text", () => ({
  Text: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("./ToolCall", () => ({
  ToolCall: () => <div data-testid="tool-call" />,
}));

// Mock utils
vi.mock("../../../../../../../utils", () => ({
  getCommonTranslation: vi.fn((key) => key),
  isMobile: vi.fn(() => false),
}));

describe("<ToolCallConfirmDialog />", () => {
  const mockContent: TToolCallContent = {
    type: ContentType.Tool,
    callId: "call-1",
    name: "test-tool",
    arguments: {},
  };

  const mockOnClose = vi.fn();
  const mockUpdateToolsPermission = vi.fn();
  const mockAddToToolsConfirmQueue = vi.fn();
  const mockRemoveFromToolsConfirmQueue = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useMessageStore).mockReturnValue({
      toolsConfirmQueue: ["call-1"],
      addToToolsConfirmQueue: mockAddToToolsConfirmQueue,
      removeFromToolsConfirmQueue: mockRemoveFromToolsConfirmQueue,
    } as unknown as ReturnType<typeof useMessageStore>);

    vi.mocked(useApi).mockReturnValue({
      aiApi: { updateToolsPermission: mockUpdateToolsPermission },
    } as unknown as ReturnType<typeof useApi>);
  });

  it("renders when current call is first in queue", () => {
    render(<ToolCallConfirmDialog content={mockContent} onClose={mockOnClose} />);
    expect(screen.getByTestId("modal-dialog")).toBeInTheDocument();
  });

  it("calls updateToolsPermission with Allow when allow button is clicked", () => {
    render(<ToolCallConfirmDialog content={mockContent} onClose={mockOnClose} />);
    fireEvent.click(screen.getByTestId("allow-button"));
    expect(mockUpdateToolsPermission).toHaveBeenCalledWith("call-1", ToolsPermission.Allow);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("calls updateToolsPermission with AlwaysAllow when checkbox is checked and allow is clicked", () => {
    render(<ToolCallConfirmDialog content={mockContent} onClose={mockOnClose} />);
    fireEvent.click(screen.getByTestId("always-allow-checkbox"));
    fireEvent.click(screen.getByTestId("allow-button"));
    expect(mockUpdateToolsPermission).toHaveBeenCalledWith("call-1", ToolsPermission.AlwaysAllow);
  });

  it("calls updateToolsPermission with Deny when deny button is clicked", () => {
    render(<ToolCallConfirmDialog content={mockContent} onClose={mockOnClose} />);
    fireEvent.click(screen.getByTestId("deny-button"));
    expect(mockUpdateToolsPermission).toHaveBeenCalledWith("call-1", ToolsPermission.Deny);
  });

  it("adds/removes call from queue on mount/unmount", () => {
    const { unmount } = render(<ToolCallConfirmDialog content={mockContent} onClose={mockOnClose} />);
    expect(mockAddToToolsConfirmQueue).toHaveBeenCalledWith("call-1");
    unmount();
    expect(mockRemoveFromToolsConfirmQueue).toHaveBeenCalledWith("call-1");
  });
});
