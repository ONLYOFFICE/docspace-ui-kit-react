import { describe, expect, it } from "vitest";

import { getSidePanelWidth } from "./Section.utils";

describe("getSidePanelWidth", () => {
  it("takes the info panel's width while it is open", () => {
    expect(
      getSidePanelWidth({
        isInfoPanelVisible: true,
        infoPanelWidth: 640,
        isChatPanelVisible: true,
        chatPanelWidth: 500,
      }),
    ).toBe(640);
  });

  it("takes the open chat's width otherwise", () => {
    expect(
      getSidePanelWidth({ isChatPanelVisible: true, chatPanelWidth: 500 }),
    ).toBe(500);
  });

  it("leaves the default to a fullscreen chat, a closed panel and a width the host does not own", () => {
    expect(
      getSidePanelWidth({
        isChatPanelVisible: true,
        isChatPanelFullscreen: true,
        chatPanelWidth: 500,
      }),
    ).toBeUndefined();
    expect(getSidePanelWidth({ infoPanelWidth: 640 })).toBeUndefined();
    expect(getSidePanelWidth({ isInfoPanelVisible: true })).toBeUndefined();
  });
});
