import { describe, expect, it, vi } from "vitest";
import type { GeneratedImage } from "@onlyoffice/ai-chat";

import { saveToRoomImageAction } from "./save-to-room";

const image = (path?: string): GeneratedImage => ({
  name: "Chart.png",
  src: "data:image/png;base64,AAAA",
  path,
  toolName: "generate_image",
});

describe("saveToRoomImageAction", () => {
  it("copies the portal file the picture was saved as", () => {
    const onSaveToRoom = vi.fn();
    const action = saveToRoomImageAction("Save to room...", onSaveToRoom);
    expect(action.label).toBe("Save to room...");
    expect(action.isVisible?.(image("42/Chart.png"))).toBe(true);
    action.onClick(image("42/Chart.png"));
    expect(onSaveToRoom).toHaveBeenCalledWith({ id: 42, title: "Chart.png" });
  });

  it("is left out for a picture that is not a portal file", () => {
    const onSaveToRoom = vi.fn();
    const action = saveToRoomImageAction("Save to room...", onSaveToRoom);
    expect(action.isVisible?.(image())).toBe(false);
    expect(action.isVisible?.(image("/Chart.png"))).toBe(false);
    action.onClick(image());
    expect(onSaveToRoom).not.toHaveBeenCalled();
  });
});
