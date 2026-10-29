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

  it("drops a trailing empty entry", () => {
    expect(normalizeAccept(".pdf,")).toBe(".pdf");
  });

  it("drops a blank entry in the middle", () => {
    expect(normalizeAccept(".pdf, ,.docx")).toBe(".pdf,.docx");
  });

  it("trims the whitespace around entries", () => {
    expect(normalizeAccept(" .pdf , .docx ")).toBe(".pdf,.docx");
  });
});
