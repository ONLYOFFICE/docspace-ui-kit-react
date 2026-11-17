import { describe, expect, it } from "vitest";

import { imageOverrides } from "./index";

describe("imageOverrides", () => {
  // The chat's file chips draw the file-format images by these names, so an
  // override of one of them puts a DocSpace control glyph on every file of
  // that format (a room grid on each attached text document).
  it("leaves the file-format images to the chat", () => {
    for (const format of [
      "documents",
      "spreadsheets",
      "presentations",
      "pdf",
      "pdf-form",
      "unknown-format",
    ]) {
      expect(imageOverrides).not.toHaveProperty(format);
    }
  });
});
