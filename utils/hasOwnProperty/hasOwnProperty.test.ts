import { describe, it, expect } from "vitest";
import { hasOwnProperty } from "./index";

describe("hasOwnProperty", () => {
  it("should return true if object has its own property", () => {
    const obj = { a: 1 };
    expect(hasOwnProperty(obj, "a")).toBe(true);
  });

  it("should return false if object does not have its own property", () => {
    const obj = { a: 1 };
    expect(hasOwnProperty(obj, "b")).toBe(false);
  });

  it("should return false if property is in prototype chain but not own property", () => {
    const proto = { a: 1 };
    const obj = Object.create(proto);
    expect(hasOwnProperty(obj, "a")).toBe(false);
  });

  it("should return false for null", () => {
    expect(hasOwnProperty(null, "a")).toBe(false);
  });

  it("should return false for undefined", () => {
    expect(hasOwnProperty(undefined, "a")).toBe(false);
  });

  it("should handle empty objects", () => {
    expect(hasOwnProperty({}, "a")).toBe(false);
  });
});
