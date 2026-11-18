import { afterEach, describe, expect, it, vi } from "vitest";

import { generatePassword, secureRandomInt } from "./generatePassword";

const SPECIAL = "!@#$%^&*";

const settings = {
  minLength: 12,
  upperCase: true,
  digits: true,
  specSymbols: true,
  digitsRegexStr: "(?=.*\\d)",
  upperCaseRegexStr: "(?=.*[A-Z])",
  specSymbolsRegexStr: "(?=.*[\\x21-\\x2F\\x3A-\\x40\\x5B-\\x60\\x7B-\\x7E])",
};

/** Makes the next draws return the given 32-bit values, then real ones. */
const queueDraws = (...values: number[]) => {
  const real = globalThis.crypto.getRandomValues.bind(globalThis.crypto);
  return vi
    .spyOn(globalThis.crypto, "getRandomValues")
    .mockImplementation(<T extends ArrayBufferView | null>(array: T): T => {
      if (values.length > 0 && array instanceof Uint32Array) {
        array[0] = values.shift() as number;
        return array;
      }
      return real(array as never) as T;
    });
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe("secureRandomInt", () => {
  it("draws from crypto.getRandomValues and never from Math.random", () => {
    const mathRandom = vi.spyOn(Math, "random");
    const draws = vi.spyOn(globalThis.crypto, "getRandomValues");

    for (let i = 0; i < 50; i += 1) {
      const value = secureRandomInt(10);
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(10);
    }

    expect(draws).toHaveBeenCalled();
    expect(mathRandom).not.toHaveBeenCalled();
  });

  it("draws again instead of folding the top of the range onto the low results", () => {
    // 2^32 is not a multiple of 10: the last six values would favour 0..5.
    const draws = queueDraws(0xfffffffa, 0xffffffff, 23);

    expect(secureRandomInt(10)).toBe(3);
    expect(draws).toHaveBeenCalledTimes(3);
  });

  it("keeps a value right under the limit", () => {
    queueDraws(0xfffffff9);
    expect(secureRandomInt(10)).toBe(0xfffffff9 % 10);
  });

  it("refuses a range it cannot draw from", () => {
    expect(() => secureRandomInt(0)).toThrow(RangeError);
    expect(() => secureRandomInt(-1)).toThrow(RangeError);
    expect(() => secureRandomInt(1.5)).toThrow(RangeError);
  });

  it("throws when the platform has no cryptographic generator", () => {
    vi.spyOn(globalThis.crypto, "getRandomValues").mockImplementation(() => {
      throw new Error("no generator");
    });
    const mathRandom = vi.spyOn(Math, "random");

    expect(() => secureRandomInt(10)).toThrow("no generator");
    expect(mathRandom).not.toHaveBeenCalled();
  });
});

describe("generatePassword", () => {
  it("meets every rule of the settings at the minimum length", () => {
    for (let i = 0; i < 200; i += 1) {
      const password = generatePassword(settings, SPECIAL);

      expect(password).toHaveLength(12);
      expect(password).toMatch(/[A-Z]/);
      expect(password).toMatch(/\d/);
      expect(password).toMatch(/[!@#$%^&*]/);
      expect(password).toMatch(/^[a-zA-Z\d!@#$%^&*]+$/);
    }
  });

  it("never uses Math.random", () => {
    const mathRandom = vi.spyOn(Math, "random");

    generatePassword(settings, SPECIAL);

    expect(mathRandom).not.toHaveBeenCalled();
  });

  it("uses only lowercase letters, eight of them, without settings", () => {
    expect(generatePassword(undefined, SPECIAL)).toMatch(/^[a-z]{8}$/);
  });

  it("leaves symbols out when there are none to pick from", () => {
    const password = generatePassword(settings, "");

    expect(password).toHaveLength(12);
    expect(password).toMatch(/^[a-zA-Z\d]+$/);
  });

  it("does not keep the required characters at the front", () => {
    const starts = new Set<string>();
    for (let i = 0; i < 200; i += 1) {
      const first = generatePassword(settings, SPECIAL).charAt(0);
      starts.add(/[A-Z]/.test(first) ? "capital" : "other");
    }

    expect(starts).toEqual(new Set(["capital", "other"]));
  });

  it("draws the free characters from the whole alphabet", () => {
    const seen = new Set<string>();
    for (let i = 0; i < 400; i += 1) {
      for (const char of generatePassword(settings, SPECIAL)) seen.add(char);
    }

    // 26 + 26 + 10 + 8 allowed characters.
    expect(seen.size).toBe(70);
  });

  it("gives a different password each time", () => {
    const passwords = new Set(
      Array.from({ length: 100 }, () => generatePassword(settings, SPECIAL)),
    );

    expect(passwords.size).toBe(100);
  });
});
