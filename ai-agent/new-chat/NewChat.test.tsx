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
