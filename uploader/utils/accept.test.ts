import { describe, it, expect } from "vitest";

import { normalizeAccept } from "./accept";

describe("normalizeAccept", () => {
  it.each([
    [undefined, ""],
    ["", ""],
    ["*", ""],
    ["*/*", ""],
    [".pdf,*", ""],
    [".pdf,.docx", ".pdf,.docx"],
    ["image/*", "image/*"],
  ])("turns %j into %j", (accept, expected) => {
    expect(normalizeAccept(accept)).toBe(expected);
  });

  // Known defect (review of spike/vitest-addon): normalizeAccept returns the raw accept, not the cleaned entries. Flip to it() once fixed.
  it.fails("drops a trailing empty entry", () => {
    expect(normalizeAccept(".pdf,")).toBe(".pdf");
  });

  // Known defect (review of spike/vitest-addon): normalizeAccept returns the raw accept, not the cleaned entries. Flip to it() once fixed.
  it.fails("drops a blank entry in the middle", () => {
    expect(normalizeAccept(".pdf, ,.docx")).toBe(".pdf,.docx");
  });

  // Known defect (review of spike/vitest-addon): normalizeAccept returns the raw accept, not the cleaned entries. Flip to it() once fixed.
  it.fails("trims the whitespace around entries", () => {
    expect(normalizeAccept(" .pdf , .docx ")).toBe(".pdf,.docx");
  });
});
