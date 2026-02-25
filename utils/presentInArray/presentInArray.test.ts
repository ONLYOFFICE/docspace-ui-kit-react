import { describe, it, expect } from "vitest";
import { presentInArray } from ".";

describe("presentInArray", () => {
  it("returns true when string is found in array", () => {
    expect(presentInArray([".docx", ".pdf", ".xlsx"], ".pdf")).toBe(true);
  });

  it("returns false when string is not found", () => {
    expect(presentInArray([".docx", ".pdf"], ".txt")).toBe(false);
  });

  it("returns false for empty array", () => {
    expect(presentInArray([], ".pdf")).toBe(false);
  });

  it("is case-sensitive by default", () => {
    expect(presentInArray([".PDF", ".DOCX"], ".pdf")).toBe(false);
  });

  it("supports case-insensitive search", () => {
    expect(presentInArray([".pdf", ".docx"], ".PDF", true)).toBe(true);
  });

  it("handles exact match only", () => {
    expect(presentInArray([".docx", ".doc"], ".do")).toBe(false);
  });

  it("finds first element", () => {
    expect(presentInArray(["a", "b", "c"], "a")).toBe(true);
  });

  it("finds last element", () => {
    expect(presentInArray(["a", "b", "c"], "c")).toBe(true);
  });
});
