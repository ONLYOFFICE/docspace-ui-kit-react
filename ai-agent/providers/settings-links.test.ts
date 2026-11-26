import { afterEach, describe, expect, it, vi } from "vitest";

import {
  AI_SETTINGS_URL,
  getAiSettingsUrl,
  getSettingsEntryConfig,
} from "./settings-links";

describe("getAiSettingsUrl", () => {
  it("opens the settings root when no tab is asked for", () => {
    expect(getAiSettingsUrl()).toBe(AI_SETTINGS_URL);
  });

  it("maps each of the widget's tabs to a page of the portal settings", () => {
    expect(getAiSettingsUrl("ai-settings")).toBe(
      "/portal-settings/ai-settings/ai-models",
    );
    expect(getAiSettingsUrl("model-assignment")).toBe(
      "/portal-settings/ai-settings/model-assignment",
    );
    expect(getAiSettingsUrl("mcp-servers")).toBe(
      "/portal-settings/ai-settings/mcp-servers",
    );
    expect(getAiSettingsUrl("web-search")).toBe(
      "/portal-settings/ai-settings/web-search",
    );
  });
});

describe("getSettingsEntryConfig", () => {
  const navigate = vi.fn();

  afterEach(() => {
    navigate.mockReset();
    vi.unstubAllGlobals();
  });

  it("hides the rows from a user who may not open the AI settings", () => {
    // No handler either: with one, the library shows the row despite
    // `hideSettingsButton`.
    expect(getSettingsEntryConfig(false)).toEqual({
      hideSettingsButton: true,
    });
  });

  it("opens the portal settings on the tab the row asks for", () => {
    vi.stubGlobal("DocSpace", { navigate });
    const config = getSettingsEntryConfig(true);

    expect(config.hideSettingsButton).toBeUndefined();

    config.onSettingsClick?.("web-search");
    expect(navigate).toHaveBeenLastCalledWith(
      "/portal-settings/ai-settings/web-search",
    );
  });

  it("sends Add model to the models page and selects nothing", () => {
    vi.stubGlobal("DocSpace", { navigate });

    const result = getSettingsEntryConfig(true).onAddModel?.();

    expect(result).toBeUndefined();
    expect(navigate).toHaveBeenLastCalledWith(
      "/portal-settings/ai-settings/ai-models",
    );
  });
});
