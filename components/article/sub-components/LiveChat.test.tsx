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
// loaded, which is when the load-time settings are sent.
vi.mock("../zendesk", () => ({
  Zendesk: ({ onLoaded }: { onLoaded?: () => void }) => {
    onLoaded?.();
    return null;
  },
}));

const isMobile = vi.fn(() => false);
vi.mock("../../../hooks/use-is-mobile", () => ({
  useIsMobile: () => isMobile(),
}));

const isRTL = vi.fn(() => false);
vi.mock("../../../context/InterfaceDirectionContext", () => ({
  useInterfaceDirection: () => ({ isRTL: isRTL() }),
}));

const theme = vi.fn<
  () => {
    isBase: boolean;
    currentColorScheme?: {
      main: { accent: string };
      text: { accent: string };
    };
  }
>(() => ({ isBase: true }));
vi.mock("../../../context/ThemeContext", () => ({
  useTheme: () => theme(),
}));

type Offset = { horizontal: number; vertical: number };
type Customization = {
  position: { side: "left" | "right"; offset: { web: Offset; mobile: Offset } };
  theme: Record<string, string>;
};

/**
 * The launcher is the vendor's; the app's part is where it stands. These pin
 * the offsets to the corner the create button is laid out from, since nothing
 * else ties the two together. And the account serves the messaging widget,
 * which throws on every Web Widget (Classic) command, so nothing here may
 * speak `webWidget`.
 */
describe("ArticleLiveChat", () => {
  const props = {
    languageBaseName: "en",
    zendeskKey: "zendesk-key",
    isShowLiveChat: true,
  };

  const commands = () =>
    vi
      .mocked(zendeskAPI.addChanges)
      .mock.calls.filter((call) => typeof call[1] === "string")
      .map((call) => `${call[0]} ${call[1]}`);

  /** The last customization the widget was handed. */
  const customization = () => {
    const call = vi
      .mocked(zendeskAPI.addChanges)
      .mock.calls.filter(
        (c) => c[0] === "messenger:set" && c[1] === "customization",
      )
      .at(-1);

    return call?.[2] as Customization | undefined;
  };

  /** The last placement the widget was handed. */
  const position = () => customization()?.position;

  beforeEach(() => {
    vi.clearAllMocks();
    isMobile.mockReturnValue(false);
    isRTL.mockReturnValue(false);
    theme.mockReturnValue({ isBase: true });
  });

  it("paints the widget in the portal's accent on the light theme", () => {
    theme.mockReturnValue({
      isBase: true,
      currentColorScheme: {
        main: { accent: "#AA0000" },
        text: { accent: "#000001" },
      },
    });
    render(<ArticleLiveChat {...props} />);

    expect(customization()?.theme).toMatchObject({
      primary: "#AA0000",
      onPrimary: "#000001",
      action: "#AA0000",
      onAction: "#000001",
      onSecondaryAction: "#AA0000",
      message: "#AA0000",
      onMessage: "#000001",
      background: "#ffffff",
      onBackground: "#333333",
    });
  });

  it("follows the dark theme and a later accent change", () => {
    theme.mockReturnValue({ isBase: false });
    const { rerender } = render(<ArticleLiveChat {...props} />);

    // No colour scheme yet: the default accent, white on it.
    expect(customization()?.theme).toMatchObject({
      primary: "#4781D1",
      onPrimary: "#ffffff",
      background: "#333333",
      onBackground: "#ffffff",
      onBusinessMessage: "#ffffff",
    });

    theme.mockReturnValue({
      isBase: false,
      currentColorScheme: {
        main: { accent: "#00AA00" },
        text: { accent: "#ffffff" },
      },
    });
    rerender(<ArticleLiveChat {...props} />);

    expect(customization()?.theme.primary).toBe("#00AA00");
    // The placement rides along, so the theme cannot reset it.
    expect(position()?.side).toBe("right");
  });

  it("hands the app's locale to the widget and follows a change", () => {
    const { rerender } = render(<ArticleLiveChat {...props} />);

    expect(zendeskAPI.addChanges).toHaveBeenCalledWith(
      "messenger:set",
      "locale",
      "en",
    );

    rerender(<ArticleLiveChat {...props} languageBaseName="de" />);

    expect(zendeskAPI.addChanges).toHaveBeenCalledWith(
      "messenger:set",
      "locale",
      "de",
    );
  });

  it("puts the widget's iframes at the app's z-index once it loads", () => {
    // 999999 by default, which is on top of every dialog and panel.
    render(<ArticleLiveChat {...props} />);

    expect(zendeskAPI.addChanges).toHaveBeenCalledWith(
      "messenger:set",
      "zIndex",
      201,
    );
  });

  it("stands the launcher at the corner inset", () => {
    render(<ArticleLiveChat {...props} />);

    expect(position()).toEqual({
      side: "right",
      offset: {
        web: { horizontal: 24, vertical: 24 },
        mobile: { horizontal: 24, vertical: 24 },
      },
    });
  });

  it("steps one button and a gap aside from a floating button", () => {
    render(<ArticleLiveChat {...props} withFloatingButton />);

    expect(position()?.offset.web).toEqual({ horizontal: 88, vertical: 24 });
  });

  it("uses the tighter mobile inset on a phone", () => {
    isMobile.mockReturnValue(true);

    const { rerender } = render(<ArticleLiveChat {...props} />);
    expect(position()?.offset.web).toEqual({ horizontal: 16, vertical: 16 });

    rerender(<ArticleLiveChat {...props} withFloatingButton />);
    expect(position()?.offset.web).toEqual({ horizontal: 80, vertical: 16 });
  });

  it("hands the phone offset the same numbers, so the breakpoint stays the app's", () => {
    render(<ArticleLiveChat {...props} withFloatingButton />);

    const { offset } = position() ?? {};
    expect(offset?.mobile).toEqual(offset?.web);
  });

  it("moves clear of the docked info panel", () => {
    render(<ArticleLiveChat {...props} isInfoPanelVisible />);

    expect(position()?.offset.web).toEqual({ horizontal: 424, vertical: 24 });
  });

  it("moves clear of the side panel's actual width, whichever panel it is", () => {
    render(
      <ArticleLiveChat {...props} isInfoPanelVisible sidePanelWidth={640} />,
    );
    expect(position()?.offset.web).toEqual({ horizontal: 664, vertical: 24 });

    render(<ArticleLiveChat {...props} sidePanelWidth={520} />);
    expect(position()?.offset.web).toEqual({ horizontal: 544, vertical: 24 });

    render(
      <ArticleLiveChat {...props} isInfoPanelVisible sidePanelWidth={0} />,
    );
    expect(position()?.offset.web).toEqual({ horizontal: 24, vertical: 24 });
  });

  it("ignores the info panel on a phone, where it covers the screen", () => {
    isMobile.mockReturnValue(true);

    render(
      <ArticleLiveChat {...props} isInfoPanelVisible sidePanelWidth={640} />,
    );

    expect(position()?.offset.web).toEqual({ horizontal: 16, vertical: 16 });
  });

  it("opens on the left in a right-to-left interface", () => {
    isRTL.mockReturnValue(true);

    render(<ArticleLiveChat {...props} />);

    expect(position()?.side).toBe("left");
  });

  it("leaves the vendor launcher on screen", () => {
    // It is the only way into the chat; the switch is what hides the widget.
    render(<ArticleLiveChat {...props} />);

    expect(commands()).not.toContain("messenger hide");
  });

  it("speaks the messaging API only", () => {
    render(
      <ArticleLiveChat {...props} withFloatingButton isInfoPanelVisible />,
    );

    const namespaces = vi
      .mocked(zendeskAPI.addChanges)
      .mock.calls.map((call) => String(call[0]).split(":")[0]);

    expect(new Set(namespaces)).toEqual(new Set(["messenger"]));
  });

  it("renders nothing without a Zendesk key", () => {
    const { container } = render(<ArticleLiveChat {...props} zendeskKey="" />);

    expect(container).toBeEmptyDOMElement();
    expect(zendeskAPI.addChanges).not.toHaveBeenCalledWith(
      "messenger:set",
      "zIndex",
      201,
    );
  });
});
