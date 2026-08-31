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
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";

import NewChat from "./index";
import type { ChatNoAccessScreenProps } from "./components/chat-no-access-screen";

type Page = "chat" | "settings" | "initial-setup" | "history";

const routerState: { currentPage: Page } = { currentPage: "chat" };
const widgetState = { threadId: "", profiles: [] as unknown[] };
const setCurrentPage = vi.fn((page: Page) => {
  routerState.currentPage = page;
});
const navigate = vi.fn();

vi.mock("@onlyoffice/ai-chat", () => ({
  // Stands in for the widget's own page router: with no profiles the real
  // ChatPage renders the initial-setup screen itself.
  ChatPage: () => <div data-testid="chat-page" />,
  ChatList: () => <div data-testid="chat-list" />,
  useStores: () => ({
    useRouter: <T,>(selector: (s: unknown) => T) =>
      selector({ currentPage: routerState.currentPage, setCurrentPage }),
    useProfilesStore: <T,>(selector: (s: unknown) => T) =>
      selector({ profiles: widgetState.profiles }),
    useThreadsStore: <T,>(selector: (s: unknown) => T) =>
      selector({ threadId: widgetState.threadId }),
  }),
}));

vi.mock("../../hooks/use-is-desktop", () => ({
  useIsDesktop: () => true,
}));

vi.mock("../chat-toolbar", () => ({
  ChatToolbar: () => <div data-testid="chat-toolbar" />,
}));

vi.mock("./components/chat-no-access-screen", () => ({
  ChatNoAccessScreen: () => <div data-testid="no-access-screen" />,
}));

vi.mock("../providers/ai-chat-store/AiChatStoreProvider", () => ({
  useAiChatStore: () => ({ effectiveFullscreen: false }),
}));

// The in-chat form notice reads the attachments store and the host wiring;
// both are exercised by their own tests.
vi.mock("./components/form-model-notice", () => ({
  FormModelNotice: () => null,
}));

const noAccessProps: ChatNoAccessScreenProps = {
  standalone: false,
  isPortalAdmin: true,
};

describe("<NewChat />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    routerState.currentPage = "chat";
    widgetState.threadId = "";
    widgetState.profiles = [];
    vi.stubGlobal("DocSpace", { navigate });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('currentPage === "initial-setup"', () => {
    beforeEach(() => {
      routerState.currentPage = "initial-setup";
    });

    // The regression this guards against: short-cutting the page left hosts
    // without `noAccessProps` (both sdk layouts) with an empty panel and no
    // way to reach the setup screen that creates the first AI profile.
    it("renders the widget setup screen when the host has no noAccessProps", () => {
      render(<NewChat />);

      expect(screen.getByTestId("chat-page")).toBeInTheDocument();
      expect(screen.queryByTestId("no-access-screen")).not.toBeInTheDocument();
    });

    it("renders the no-access screen when AI is not ready", () => {
      render(<NewChat aiReady={false} noAccessProps={noAccessProps} />);

      expect(screen.getByTestId("no-access-screen")).toBeInTheDocument();
      expect(screen.queryByTestId("chat-page")).not.toBeInTheDocument();
    });

    // AI is available portal-wide but this user has no profile yet: the setup
    // screen, not the no-access empty view, is what unblocks them.
    it("renders the widget setup screen when AI is ready", () => {
      render(<NewChat aiReady noAccessProps={noAccessProps} />);

      expect(screen.getByTestId("chat-page")).toBeInTheDocument();
      expect(screen.queryByTestId("no-access-screen")).not.toBeInTheDocument();
    });
  });

  it("keeps the running chat when a thread is open and AI is not ready", () => {
    widgetState.threadId = "thread-1";

    render(<NewChat aiReady={false} noAccessProps={noAccessProps} />);

    expect(screen.getByTestId("chat-page")).toBeInTheDocument();
    expect(screen.queryByTestId("no-access-screen")).not.toBeInTheDocument();
  });

  it('redirects to the portal AI settings and renders nothing on "settings"', () => {
    routerState.currentPage = "settings";

    const { container } = render(<NewChat />);

    expect(container).toBeEmptyDOMElement();
    expect(setCurrentPage).toHaveBeenCalledWith("chat");
    expect(navigate).toHaveBeenCalledWith("/portal-settings/ai-settings");
  });

  it('renders the chat list on "history" outside the split view', () => {
    routerState.currentPage = "history";

    render(<NewChat />);

    expect(screen.getByTestId("chat-list")).toBeInTheDocument();
  });
});
