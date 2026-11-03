// The lower resize bound keeps the chat composer usable; the upper one is
// derived per drag from how much width the section can give up before its own
// content (table columns / tiles) stops fitting.
export const CHAT_PANEL_MIN_WIDTH = 360;

type PanelWidthBounds = {
  defaultWidth: number;
  minWidth: number;
  maxWidth?: number;
};

export const createPanelWidthStorage = (
  key: string,
  {
    defaultWidth,
    minWidth,
    maxWidth = Number.POSITIVE_INFINITY,
  }: PanelWidthBounds,
) => {
  const clamp = (value: unknown) => {
    const width = Number(value);

    if (value === null || !Number.isFinite(width)) return defaultWidth;

    return Math.min(Math.max(Math.round(width), minWidth), maxWidth);
  };

  const read = () => {
    try {
      return clamp(window.localStorage.getItem(key));
    } catch {
      return defaultWidth;
    }
  };

  const save = (value: number) => {
    const width = clamp(value);

    try {
      window.localStorage.setItem(key, String(width));
    } catch {
      return width;
    }

    return width;
  };

  return { read, save };
};
