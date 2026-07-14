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

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ToolCallConfirmDialog } from "./index";
import { useMessageStore } from "../../../../../../store/messageStore";
import { useApi } from "../../../../../../../../providers";
import type { TToolCallContent } from "../../../../../../../../types/ai";
import { ToolsPermission, ContentType } from "../../../../../../../../enums";

// Mock store and providers
vi.mock("../../../../../../store/messageStore", () => ({
  useMessageStore: vi.fn(),
}));
vi.mock("../../../../../../../../providers", () => ({
  useApi: vi.fn(),
}));

// Mock components
vi.mock("../../../../../../../../components/modal-dialog", () => ({
  ModalDialog: Object.assign(
    ({ children, visible }: { children: React.ReactNode; visible: boolean }) =>
      visible ? <div data-testid="modal-dialog">{children}</div> : null,
    {
      Header: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
      ),
      Body: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
      ),
      Footer: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
      ),
    },
  ),
  ModalDialogType: { modal: "modal" },
}));

vi.mock("../../../../../../../../components/button", () => ({
  Button: ({
    onClick,
    label,
    "data-testid": testId,
  }: {
    onClick: () => void;
    label: string;
    "data-testid"?: string;
  }) => (
    <button onClick={onClick} data-testid={testId}>
      {label}
    </button>
  ),
  ButtonSize: { normal: "normal" },
}));

vi.mock("../../../../../../../../components/checkbox", () => ({
  Checkbox: ({
    isChecked,
    onChange,
    label,
    "data-testid": testId,
  }: {
    isChecked: boolean;
    onChange: (e: { target: { checked: boolean } }) => void;
    label: string;
    "data-testid"?: string;
  }) => (
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

vi.mock("../../../../../../../../components/text", () => ({
  Text: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("../tool-call", () => ({
  ToolCall: () => <div data-testid="tool-call" />,
}));

// Mock utils
vi.mock("../../../../../../../../utils", () => ({
  isMobile: vi.fn(() => false),
}));

vi.mock("../../../../../../../../utils/i18n", () => ({
  useCommonTranslation: () => vi.fn((key) => key),
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
    render(
      <ToolCallConfirmDialog content={mockContent} onClose={mockOnClose} />,
    );
    expect(screen.getByTestId("modal-dialog")).toBeInTheDocument();
  });

  it("calls updateToolsPermission with Allow when allow button is clicked", () => {
    render(
      <ToolCallConfirmDialog content={mockContent} onClose={mockOnClose} />,
    );
    fireEvent.click(screen.getByTestId("allow-button"));
    expect(mockUpdateToolsPermission).toHaveBeenCalledWith(
      "call-1",
      ToolsPermission.Allow,
    );
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("calls updateToolsPermission with AlwaysAllow when checkbox is checked and allow is clicked", () => {
    render(
      <ToolCallConfirmDialog content={mockContent} onClose={mockOnClose} />,
    );
    fireEvent.click(screen.getByTestId("always-allow-checkbox"));
    fireEvent.click(screen.getByTestId("allow-button"));
    expect(mockUpdateToolsPermission).toHaveBeenCalledWith(
      "call-1",
      ToolsPermission.AlwaysAllow,
    );
  });

  it("calls updateToolsPermission with Deny when deny button is clicked", () => {
    render(
      <ToolCallConfirmDialog content={mockContent} onClose={mockOnClose} />,
    );
    fireEvent.click(screen.getByTestId("deny-button"));
    expect(mockUpdateToolsPermission).toHaveBeenCalledWith(
      "call-1",
      ToolsPermission.Deny,
    );
  });

  it("adds/removes call from queue on mount/unmount", () => {
    const { unmount } = render(
      <ToolCallConfirmDialog content={mockContent} onClose={mockOnClose} />,
    );
    expect(mockAddToToolsConfirmQueue).toHaveBeenCalledWith("call-1");
    unmount();
    expect(mockRemoveFromToolsConfirmQueue).toHaveBeenCalledWith("call-1");
  });
});
