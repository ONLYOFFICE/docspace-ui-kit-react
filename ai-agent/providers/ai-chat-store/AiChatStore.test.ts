import { describe, it, expect, beforeEach } from "vitest";

import AiChatStore from "./AiChatStore";

describe("AiChatStore fullscreen", () => {
  let store: AiChatStore;

  beforeEach(() => {
    store = new AiChatStore();
  });

  it("mirrors the user toggle and nothing else", () => {
    expect(store.effectiveFullscreen).toBe(false);

    store.toggleFullscreen();
    expect(store.effectiveFullscreen).toBe(true);

    store.setFullscreen(false);
    expect(store.effectiveFullscreen).toBe(false);
  });

  // Both settings-like flows used to force the panel open; they no longer do,
  // so the user's preference has to survive a trip through them.
  it.each(["settings", "initial-setup"] as const)(
    "does not force fullscreen on the %s page",
    (page) => {
      store.setCurrentPage(page);

      expect(store.isOnSettingsPage).toBe(true);
      expect(store.effectiveFullscreen).toBe(false);

      store.setFullscreen(true);
      expect(store.effectiveFullscreen).toBe(true);
    },
  );

  it("does not force fullscreen while AI is unconfigured", () => {
    expect(store.hasProfiles).toBe(false);
    expect(store.effectiveFullscreen).toBe(false);

    store.setHasProfiles(true);
    expect(store.effectiveFullscreen).toBe(false);
  });

  it("drops the fullscreen preference when the panel closes", () => {
    store.openNewChat();
    store.setFullscreen(true);

    store.close();
    expect(store.effectiveFullscreen).toBe(false);
    expect(store.isVisible).toBe(false);
  });
});
