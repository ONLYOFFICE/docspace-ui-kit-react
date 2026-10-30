import { describe, expect, it } from "vitest";

import { getShownInfoPanelWidth } from "./Section.utils";

describe("getShownInfoPanelWidth", () => {
  it("takes the info panel's width on a desktop", () => {
    expect(
      getShownInfoPanelWidth({
        isDesktop: true,
        isInfoPanelVisible: true,
        infoPanelWidth: 640,
        isChatPanelVisible: true,
        chatPanelWidth: 500,
      }),
    ).toBe(640);
  });

  it("takes the docked chat's width when the info panel is closed", () => {
    expect(
      getShownInfoPanelWidth({
        isDesktop: true,
        isChatPanelVisible: true,
        chatPanelWidth: 500,
      }),
    ).toBe(500);
  });

  it("falls back to the default width of a panel without a width of its own", () => {
    expect(
      getShownInfoPanelWidth({ isDesktop: true, isInfoPanelVisible: true }),
    ).toBe(400);
    expect(
      getShownInfoPanelWidth({ isDesktop: true, isChatPanelVisible: true }),
    ).toBe(400);
  });

  it("counts below a desktop only the info panel, at its default width", () => {
    expect(
      getShownInfoPanelWidth({
        isDesktop: false,
        isInfoPanelVisible: true,
        infoPanelWidth: 651,
      }),
    ).toBe(400);
    expect(
      getShownInfoPanelWidth({
        isDesktop: false,
        isChatPanelVisible: true,
        chatPanelWidth: 500,
      }),
    ).toBe(0);
  });

  it("is 0 for a fullscreen chat and for no panel at all", () => {
    expect(
      getShownInfoPanelWidth({
        isDesktop: true,
        isChatPanelVisible: true,
        isChatPanelFullscreen: true,
        chatPanelWidth: 500,
      }),
    ).toBe(0);
    expect(
      getShownInfoPanelWidth({ isDesktop: true, infoPanelWidth: 640 }),
    ).toBe(0);
  });
});
