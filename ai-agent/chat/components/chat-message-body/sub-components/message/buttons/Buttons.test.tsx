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
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Buttons from "./index";
import copy from "copy-to-clipboard";
import { toastr } from "../../../../../../../components/toast";
import { getCommonTranslation } from "../../../../../../../utils";
import type { TBreadCrumb } from "../../../../../../../components/selector";
import socket, { SocketCommands, SocketEvents, ExportChatEventData } from "../../../../../../../utils/socket";
import type { TGetIcon } from "../../../../../../../types";

// Mocks
vi.mock("copy-to-clipboard");
vi.mock("mobx-react", () => ({
  observer: <T extends React.ComponentType<P>, P extends object>(component: T): T => component,
}));

vi.mock("../../../../../../../components/toast", () => ({
  toastr: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

vi.mock("../../../../../utils", () => ({
  openFile: vi.fn(),
}));

vi.mock("../../../../../../../utils", () => ({
  getCommonTranslation: vi.fn((key: string) => key),
}));

const mockFindPreviousUserMessage = vi.fn();
vi.mock("../../../../../store/messageStore", () => ({
  useMessageStore: () => ({
    agentId: "agent-1",
    findPreviousUserMessage: mockFindPreviousUserMessage,
  }),
}));

vi.mock("../../../../../store/chatStore", () => ({
  useChatStore: () => ({
    currentChat: { id: "chat-1" },
  }),
}));

const mockExportChatMessage = vi.fn().mockResolvedValue({});
vi.mock("../../../../../../../providers/api", () => ({
  useApi: () => ({
    aiApi: {
      exportChatMessage: mockExportChatMessage,
    },
  }),
}));

vi.mock("../../../../../../../utils/socket", () => ({
  default: {
    emit: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
    socketSubscribers: new Set<string>(),
  },
  SocketCommands: { Subscribe: "Subscribe", Unsubscribe: "Unsubscribe" },
  SocketEvents: { ExportChat: "ExportChat" },
}));

interface ExportSelectorProps {
  onSubmit: (
    selectedItemId: string,
    folderTitle: string,
    isPublic: boolean,
    breadCrumbs: TBreadCrumb[],
    fileName: string,
    isChecked: boolean,
  ) => void;
}

vi.mock("../../../../export-selector", () => ({
  default: ({ onSubmit }: ExportSelectorProps) => (
    <div data-testid="export-selector">
      <button onClick={() => onSubmit("selected-id", "folderTitle", false, [], "fileName.docx", false)}>Submit</button>
    </div>
  ),
}));

vi.mock("../../../../../../../assets/icons/16/copy.react.svg", () => ({
  default: () => <svg data-testid="copy-icon" />,
}));

vi.mock("../../../../../../../assets/message.save.svg", () => ({
  default: () => <svg data-testid="save-icon" />,
}));

vi.mock("../../../../../../../utils/i18n/CommonTrans", () => ({
  CommonTrans: ({ i18nKey }: { i18nKey: string }) => <span>{i18nKey}</span>,
}));

describe("<Buttons />", () => {
  const defaultProps = {
    text: "message text",
    chatName: "test chat",
    messageId: 123,
    isLast: true,
    getIcon: vi.fn() as unknown as TGetIcon,
    messageIndex: 0,
    getResultStorageId: () => 1,
    folderFormValidation: /.*/,
    allowExternalNavigation: true,
  };

  const mockedSocket = vi.mocked(socket);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders copy and save buttons", () => {
    render(<Buttons {...defaultProps} />);
    expect(screen.getByTestId("copy-message-button")).toBeInTheDocument();
    expect(screen.getByTestId("save-to-file-button")).toBeInTheDocument();
  });

  it("calls copy action when copy button is clicked", () => {
    render(<Buttons {...defaultProps} />);
    fireEvent.click(screen.getByTestId("copy-message-button"));
    expect(copy).toHaveBeenCalledWith("message text", { format: "text/plain" });
    expect(toastr.success).toHaveBeenCalledWith("MessageCopiedSuccess");
  });

  it("shows export selector when save button is clicked", () => {
    render(<Buttons {...defaultProps} />);
    fireEvent.click(screen.getByTestId("save-to-file-button"));
    expect(screen.getByTestId("export-selector")).toBeInTheDocument();
  });

  it("calls exportChatMessage when export selector is submitted", async () => {
    render(<Buttons {...defaultProps} />);
    fireEvent.click(screen.getByTestId("save-to-file-button"));
    
    const submitBtn = screen.getByText("Submit");
    fireEvent.click(submitBtn);

    expect(mockedSocket?.emit).toHaveBeenCalledWith(SocketCommands.Subscribe, expect.any(Object));
    expect(mockExportChatMessage).toHaveBeenCalledWith(123, "selected-id", "fileName.docx");
  });

  it("handles socket export event", async () => {
    let socketCallback: (data: ExportChatEventData) => void = () => {};
    
    const onMock = mockedSocket?.on as unknown as (event: string, cb: (data: ExportChatEventData) => void) => void;
    
    if (onMock) {
      vi.mocked(onMock).mockImplementation((event: string, callback: (data: ExportChatEventData) => void) => {
        if (event === SocketEvents.ExportChat) {
          socketCallback = callback;
        }
      });
    }

    render(<Buttons {...defaultProps} />);
    fireEvent.click(screen.getByTestId("save-to-file-button"));
    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(mockedSocket?.on).toHaveBeenCalledWith(SocketEvents.ExportChat, expect.any(Function));
    });

    socketCallback({ resultFile: { id: 456 } } as unknown as ExportChatEventData);

    expect(toastr.success).toHaveBeenCalled();
    expect(mockedSocket?.off).toHaveBeenCalledWith(SocketEvents.ExportChat);
    expect(mockedSocket?.emit).toHaveBeenCalledWith(SocketCommands.Unsubscribe, expect.any(Object));
  });

  it("handles socket export error", async () => {
    let socketCallback: (data: ExportChatEventData) => void = () => {};
    
    const onMock = mockedSocket?.on as unknown as (event: string, cb: (data: ExportChatEventData) => void) => void;
    
    if (onMock) {
      vi.mocked(onMock).mockImplementation((event: string, callback: (data: ExportChatEventData) => void) => {
        if (event === SocketEvents.ExportChat) {
          socketCallback = callback;
        }
      });
    }

    render(<Buttons {...defaultProps} />);
    fireEvent.click(screen.getByTestId("save-to-file-button"));
    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(mockedSocket?.on).toHaveBeenCalledWith(SocketEvents.ExportChat, expect.any(Function));
    });

    socketCallback({ resultFile: null, error: "Export failed" } as unknown as ExportChatEventData);

    expect(toastr.error).toHaveBeenCalledWith("Export failed");
  });
});
