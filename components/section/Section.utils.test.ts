import { describe, expect, it } from "vitest";

import { getInfoPanelWidth } from "./Section.utils";

describe("getInfoPanelWidth", () => {
  it("takes the info panel's width while it is open", () => {
    expect(
      getInfoPanelWidth({
        isInfoPanelVisible: true,
        infoPanelWidth: 640,
        isChatPanelVisible: true,
        chatPanelWidth: 500,
      }),
    ).toBe(640);
  });

  it("takes the open chat's width otherwise", () => {
    expect(
      getInfoPanelWidth({ isChatPanelVisible: true, chatPanelWidth: 500 }),
    ).toBe(500);
  });

  it("leaves the default to a fullscreen chat, a closed panel and a width the host does not own", () => {
    expect(
      getInfoPanelWidth({
        isChatPanelVisible: true,
        isChatPanelFullscreen: true,
        chatPanelWidth: 500,
      }),
    ).toBeUndefined();
    expect(getInfoPanelWidth({ infoPanelWidth: 640 })).toBeUndefined();
    expect(getInfoPanelWidth({ isInfoPanelVisible: true })).toBeUndefined();
  });
});
