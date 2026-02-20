import { describe, it, expect } from "vitest";
import { isNextImage } from ".";

describe("isNextImage", () => {
  it("returns true for object with src property", () => {
    expect(isNextImage({ src: "/image.png", width: 100, height: 100 })).toBe(
      true,
    );
  });

  it("returns true for object with only src", () => {
    expect(isNextImage({ src: "" })).toBe(true);
  });

  it("returns false for plain string", () => {
    expect(isNextImage("/image.png")).toBe(false);
  });

  it("returns false for null", () => {
    expect(isNextImage(null)).toBe(false);
  });

  it("returns false for undefined", () => {
    expect(isNextImage(undefined)).toBe(false);
  });

  it("returns false for number", () => {
    expect(isNextImage(42)).toBe(false);
  });

  it("returns false for object without src", () => {
    expect(isNextImage({ width: 100, height: 100 })).toBe(false);
  });

  it("returns false for empty object", () => {
    expect(isNextImage({})).toBe(false);
  });

  it("returns false for array", () => {
    expect(isNextImage([{ src: "test" }])).toBe(false);
  });
});
