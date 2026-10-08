import type { SettingsAdapter } from "@onlyoffice/ai-chat";

const PREFIX = "docspace.ai-agent.";

export const settingsAdapter: SettingsAdapter = {
  get(key: string): string | null {
    return window.localStorage.getItem(`${PREFIX}${key}`);
  },
  set(key: string, value: string): void {
    window.localStorage.setItem(`${PREFIX}${key}`, value);
  },
  remove(key: string): void {
    window.localStorage.removeItem(`${PREFIX}${key}`);
  },
};
