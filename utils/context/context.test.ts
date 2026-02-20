import { describe, it, expect } from "vitest";
import { Context, Provider, Consumer } from ".";

describe("context", () => {
  it("exports Context, Provider, and Consumer", () => {
    expect(Context).toBeDefined();
    expect(Provider).toBeDefined();
    expect(Consumer).toBeDefined();
  });

  it("Context has correct default value", () => {
    const defaultValue = (
      Context as unknown as {
        _currentValue: { sectionWidth?: number; sectionHeight?: number };
      }
    )._currentValue;
    expect(defaultValue).toEqual({});
  });

  it("Provider is the Context.Provider", () => {
    expect(Provider).toBe(Context.Provider);
  });

  it("Consumer is the Context.Consumer", () => {
    expect(Consumer).toBe(Context.Consumer);
  });
});
