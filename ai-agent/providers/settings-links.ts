import type { SettingsTab, WidgetConfig } from "@onlyoffice/ai-chat";

// The chat's settings live in the portal settings, not in the widget.
export const AI_SETTINGS_URL = "/portal-settings/ai-settings";

// The widget names its own settings tabs; the portal's AI settings have a
// page for each of them.
const TAB_PATHS: Record<SettingsTab, string> = {
  "ai-settings": "ai-models",
  "model-assignment": "model-assignment",
  "mcp-servers": "mcp-servers",
  "web-search": "web-search",
};

export const getAiSettingsUrl = (tab?: SettingsTab): string => {
  const path = tab ? TAB_PATHS[tab] : undefined;
  return path ? `${AI_SETTINGS_URL}/${path}` : AI_SETTINGS_URL;
};

export const openAiSettings = (tab?: SettingsTab): void => {
  window.DocSpace?.navigate(getAiSettingsUrl(tab));
};

type SettingsEntryConfig = Pick<
  WidgetConfig,
  "hideSettingsButton" | "onSettingsClick" | "onAddModel"
>;

/**
 * The rows of the chat that lead to the AI settings: "Set up Web search..."
 * of the "+" menu and "Add model..." of the model picker. Only a user who may
 * open the portal's AI settings gets them, and both open those settings on
 * the page of the row, not the widget's own settings page or dialog.
 */
export const getSettingsEntryConfig = (
  canManageAiSettings: boolean,
): SettingsEntryConfig => {
  if (!canManageAiSettings) return { hideSettingsButton: true };

  return {
    onSettingsClick: openAiSettings,
    // Nothing is resolved: the model is added on the settings page, so the
    // picker has no new profile to select.
    onAddModel: () => openAiSettings("ai-settings"),
  };
};
