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

import Buttons from "./index";
import { useMessageStore } from "../../../store/messageStore";
import useToolsSettings from "../../../hooks/useToolsSettings";
import type { ButtonsProps } from "../../../Chat.types";

// Mock store
vi.mock("../../../store/messageStore", () => ({
  useMessageStore: vi.fn(),
}));

// Mock components
vi.mock("../../../../../components/icon-button", () => ({
  IconButton: (props: Record<string, unknown>) => (
    <button
      onClick={props.onClick as () => void}
      disabled={props.isDisabled as boolean}
      data-testid={props["data-testid"] as string}
    >
      icon
    </button>
  ),
}));

vi.mock("../../../../../components/tooltip", () => ({
  TooltipContainer: ({
    children,
    onClick,
    title,
  }: {
    children: React.ReactNode;
    onClick: () => void;
    title: string;
  }) => (
    <div onClick={onClick} title={title} data-testid="tooltip">
      {children}
    </div>
  ),
}));

vi.mock("../tools-settings", () => ({
  default: () => <div data-testid="tools-settings" />,
}));

// Mock Assets
vi.mock("../../../../../assets/icons/12/arrow.up.react.svg", () => ({
  default: () => <svg />,
}));
vi.mock("../../../../../assets/attachment.react.svg", () => ({
  default: () => <svg />,
}));

// Mock utils
vi.mock("../../../../../utils/i18n", () => ({
  useCommonTranslation: () => vi.fn((key) => key),
}));

describe("<Buttons />", () => {
  const mockSendMessageAction = vi.fn();
  const mockStopMessage = vi.fn();
  const mockToggleFilesSelector = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useMessageStore).mockReturnValue({
      isRequestRunning: false,
      stopMessage: mockStopMessage,
    } as unknown as ReturnType<typeof useMessageStore>);
  });

  const defaultProps: ButtonsProps = {
    isFilesSelectorVisible: false,
    toggleFilesSelector: mockToggleFilesSelector,
    sendMessageAction: mockSendMessageAction,
    value: "test",
    selectedModel: "gpt-4",
    toolsSettings: {} as unknown as ReturnType<typeof useToolsSettings>,
    isAdmin: false,
    aiReady: true,
    goToWebSearchSettings: vi.fn(),
    allowAttachFiles: true,
    allowManageTools: true,
  };

  it("calls sendMessageAction when send button is clicked and request is not running", () => {
    render(<Buttons {...defaultProps} />);
    const sendButton = screen.getByTestId("chat-input-send-button");
    fireEvent.click(sendButton);
    expect(mockSendMessageAction).toHaveBeenCalled();
  });

  it("calls stopMessage when send button is clicked and request is running", () => {
    vi.mocked(useMessageStore).mockReturnValue({
      isRequestRunning: true,
      stopMessage: mockStopMessage,
    } as unknown as ReturnType<typeof useMessageStore>);
    render(<Buttons {...defaultProps} />);
    const sendButton = screen.getByTestId("chat-input-send-button");
    fireEvent.click(sendButton);
    expect(mockStopMessage).toHaveBeenCalled();
  });

  it("disables send button if value is empty and request is not running", () => {
    render(<Buttons {...defaultProps} value="" />);
    const sendButton = screen.getByTestId("chat-input-send-button");
    expect(sendButton).toBeDisabled();
  });

  it("disables send button if no selected model", () => {
    render(
      <Buttons {...defaultProps} selectedModel={null as unknown as string} />,
    );
    const sendButton = screen.getByTestId("chat-input-send-button");
    expect(sendButton).toBeDisabled();
  });

  it("calls toggleFilesSelector when attachment button is clicked", () => {
    render(<Buttons {...defaultProps} />);
    const attachmentButton = screen.getByTestId("chat-input-attachment-button");
    fireEvent.click(attachmentButton);
    expect(mockToggleFilesSelector).toHaveBeenCalled();
  });

  it("does not call toggleFilesSelector if not aiReady", () => {
    render(<Buttons {...defaultProps} aiReady={false} />);
    const attachmentButton = screen.getByTestId("chat-input-attachment-button");
    fireEvent.click(attachmentButton);
    expect(mockToggleFilesSelector).not.toHaveBeenCalled();
  });

  it("renders ToolsSettings if allowManageTools is true", () => {
    render(<Buttons {...defaultProps} allowManageTools={true} />);
    expect(screen.getByTestId("tools-settings")).toBeInTheDocument();
  });

  it("does not render ToolsSettings if allowManageTools is false", () => {
    render(<Buttons {...defaultProps} allowManageTools={false} />);
    expect(screen.queryByTestId("tools-settings")).not.toBeInTheDocument();
  });

  it("hides attachment button if allowAttachFiles is false", () => {
    render(<Buttons {...defaultProps} allowAttachFiles={false} />);
    expect(
      screen.queryByTestId("chat-input-attachment-button"),
    ).not.toBeInTheDocument();
  });
});
