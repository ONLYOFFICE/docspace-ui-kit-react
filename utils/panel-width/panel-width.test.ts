import { afterEach, describe, expect, it, vi } from "vitest";

import { createPanelWidthStorage } from ".";

const KEY = "testPanelWidth";

const storage = () =>
  createPanelWidthStorage(KEY, {
    defaultWidth: 400,
    minWidth: 360,
    maxWidth: 800,
  });

describe("createPanelWidthStorage", () => {
  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("starts from the default width while nothing is saved", () => {
    expect(storage().read()).toBe(400);
  });

  it("remembers the width it saves", () => {
    expect(storage().save(640)).toBe(640);

    expect(localStorage.getItem(KEY)).toBe("640");
    expect(storage().read()).toBe(640);
  });

  it("keeps a width between its bounds, in whole pixels", () => {
    expect(storage().save(612.6)).toBe(613);
    expect(storage().save(120)).toBe(360);
    expect(storage().save(5000)).toBe(800);
  });

  it("brings a saved width back into range and drops anything else", () => {
    localStorage.setItem(KEY, "1500");
    expect(storage().read()).toBe(800);

    localStorage.setItem(KEY, "wide");
    expect(storage().read()).toBe(400);
  });

  it("has no upper bound unless it is given one", () => {
    const unbounded = createPanelWidthStorage(KEY, {
      defaultWidth: 400,
      minWidth: 360,
    });

    expect(unbounded.save(1500)).toBe(1500);
  });

  it("still answers when storage is unavailable", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("denied");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("denied");
    });

    expect(storage().read()).toBe(400);
    expect(storage().save(640)).toBe(640);
  });
});
