import { describe, expect, it } from "vitest";

import { isHeic } from "./MediaViewer.utils";

describe("isHeic", () => {
  it("treats both HEIC and HEIF as HEIF-container images", () => {
    expect(isHeic(".heic")).toBe(true);
    expect(isHeic(".heif")).toBe(true);
  });

  it("rejects other image extensions", () => {
    expect(isHeic(".jpg")).toBe(false);
    expect(isHeic(".tiff")).toBe(false);
  });
});
