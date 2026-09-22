import React from "react";
import { render } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

import { size } from "../../../utils/device";
import { zendeskAPI } from "../zendesk/Zendesk.utils";
import ArticleLiveChat from "./LiveChat";

vi.mock("../zendesk/Zendesk.utils", () => ({
  zendeskAPI: {
    getChanges: vi.fn(() => []),
    addChanges: vi.fn(),
    clearChanges: vi.fn(),
  },
}));

vi.mock("../zendesk", () => ({
  Zendesk: () => null,
}));

/**
 * The launcher is the one element of the floating corner stack that CSS does
 * not place: it is positioned by the numbers passed here. Nothing else ties it
 * to the create button sitting in that same corner, so these tests are what
 * keeps the two from drifting apart.
 *
 * The expected numbers are offsets, not distances from the viewport edge:
 * Zendesk adds them to the launcher frame's own 20px/10px margin, which the
 * component takes back out.
 */
describe("ArticleLiveChat offsets", () => {
  const baseProps = {
    languageBaseName: "en",
    zendeskEmail: "user@example.com",
    chatDisplayName: "User",
    zendeskKey: "zendesk-key",
    showProgress: false,
    isShowLiveChat: true,
  };

  const setViewportWidth = (width: number) => {
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      writable: true,
      value: width,
    });
  };

  // jsdom ships no matchMedia, and useIsMobile subscribes to one. Its initial
  // value comes from the viewport width above, so the stub only has to answer
  // the query and accept a listener.
  const stubMatchMedia = () => {
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      writable: true,
      value: (query: string) => ({
        media: query,
        matches: window.innerWidth <= size.mobile,
        addEventListener: () => {},
        removeEventListener: () => {},
      }),
    });
  };

  /** The offset of the last updateSettings call that carried one. */
  const lastOffset = () => {
    const offsets = vi
      .mocked(zendeskAPI.addChanges)
      .mock.calls.map((call) => {
        if (call[1] !== "updateSettings" || typeof call[2] !== "object") return;

        return (call[2] as { offset?: Record<string, string> }).offset;
      })
      .filter((offset) => offset !== undefined);

    return offsets.at(-1);
  };

  beforeEach(() => {
    vi.clearAllMocks();
    setViewportWidth(1280);
    stubMatchMedia();
  });

  afterEach(() => {
    setViewportWidth(1024);
  });

  it("sits at the same inset as the create button", () => {
    // 24px of inset, less the 20/10 the launcher frame brings on its own.
    render(<ArticleLiveChat {...baseProps} />);

    expect(lastOffset()).toEqual({ horizontal: "4px", vertical: "14px" });
  });

  it("steps one button aside while the create button is on screen", () => {
    render(<ArticleLiveChat {...baseProps} withFloatingButton />);

    expect(lastOffset()).toEqual({ horizontal: "68px", vertical: "14px" });
  });

  it("steps aside for the upload progress button too", () => {
    render(<ArticleLiveChat {...baseProps} showProgress />);

    expect(lastOffset()).toEqual({ horizontal: "68px", vertical: "14px" });
  });

  it("clears the info panel when it is docked", () => {
    render(<ArticleLiveChat {...baseProps} isInfoPanelVisible />);

    expect(lastOffset()).toEqual({ horizontal: "404px", vertical: "14px" });
  });

  it("follows the create button to its tighter mobile inset", () => {
    setViewportWidth(size.mobile - 100);

    render(<ArticleLiveChat {...baseProps} withFloatingButton />);

    expect(lastOffset()).toEqual({ horizontal: "60px", vertical: "6px" });
  });
});
