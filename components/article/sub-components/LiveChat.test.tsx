import React from "react";
import { render } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";

import { zendeskAPI } from "../zendesk/Zendesk.utils";
import ArticleLiveChat from "./LiveChat";

vi.mock("../zendesk/Zendesk.utils", () => ({
  zendeskAPI: {
    getChanges: vi.fn(() => []),
    addChanges: vi.fn(),
    clearChanges: vi.fn(),
  },
}));

// The real component injects the vendor snippet; the stub only reports that it
// loaded, which is when the settings below are sent.
vi.mock("../zendesk", () => ({
  Zendesk: ({ onLoaded }: { onLoaded?: () => void }) => {
    onLoaded?.();
    return null;
  },
}));

/**
 * The app draws its own Support button, so the widget's launcher must never
 * appear - not when the widget loads, and not after the chat is closed.
 */
describe("ArticleLiveChat", () => {
  const props = {
    languageBaseName: "en",
    zendeskEmail: "user@example.com",
    chatDisplayName: "User",
    zendeskKey: "zendesk-key",
    isShowLiveChat: true,
  };

  const commands = () =>
    vi
      .mocked(zendeskAPI.addChanges)
      .mock.calls.filter((call) => typeof call[1] === "string")
      .map((call) => `${call[0]} ${call[1]}`);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("hides the vendor launcher as soon as the widget loads", () => {
    render(<ArticleLiveChat {...props} />);

    expect(commands()).toContain("webWidget hide");
  });

  it("hides it again when the chat is closed", () => {
    render(<ArticleLiveChat {...props} />);

    const subscription = vi
      .mocked(zendeskAPI.addChanges)
      .mock.calls.find(
        (call) => call[0] === "webWidget:on" && call[1] === "close",
      );

    expect(subscription).toBeDefined();

    vi.clearAllMocks();
    (subscription?.[2] as () => void)();

    expect(commands()).toEqual(["webWidget hide"]);
  });

  it("renders nothing without a Zendesk key", () => {
    const { container } = render(<ArticleLiveChat {...props} zendeskKey="" />);

    expect(container).toBeEmptyDOMElement();
    expect(zendeskAPI.addChanges).not.toHaveBeenCalledWith("webWidget", "hide");
  });
});
