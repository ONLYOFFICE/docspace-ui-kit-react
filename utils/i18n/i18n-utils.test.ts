import { describe, it, expect, afterEach } from "vitest";

import { getCommonTranslation } from "./i18n-utils";

// Override the global `window.i18n` type so tests can assign simplified mock
// shapes (a minimal `instance` and loosely-typed `loaded` entries) instead of
// the full i18next instance the production type requires.
type MutableWindow = Omit<typeof window, "i18n"> & { i18n?: unknown };

// `i18n.t` returns the key verbatim so resolution always falls through to the
// `window.i18n.loaded` scan — this mirrors "identity-value" keys (Paid, Open,
// Done, …) whose English value equals the key, which is exactly the case that
// regressed when locales were bundled into one `_combined.json` per language.
const identityT = (key: string) => key;

describe("getCommonTranslation", () => {
  afterEach(() => {
    delete (window as MutableWindow).i18n;
  });

  it("resolves a Common key from the combined _combined.json bundle", () => {
    (window as MutableWindow).i18n = {
      t: identityT,
      instance: { language: "en" },
      loaded: {
        "/locales/en/_combined.json": {
          data: {
            Common: { Paid: "Paid", Done: "Done" },
            Files: { Rooms: "Rooms" },
          },
        },
      },
    };

    expect(getCommonTranslation("Paid")).toBe("Paid");
    expect(getCommonTranslation("Common:Paid")).toBe("Paid");
  });

  it("still resolves from a per-namespace bundle", () => {
    (window as MutableWindow).i18n = {
      t: identityT,
      instance: { language: "en" },
      loaded: {
        "/locales/en/Common.json": { data: { Paid: "Paid" } },
      },
    };

    expect(getCommonTranslation("Paid")).toBe("Paid");
  });

  it("interpolates variables when resolving from the combined bundle", () => {
    (window as MutableWindow).i18n = {
      t: identityT,
      instance: { language: "en" },
      loaded: {
        "/locales/en/_combined.json": {
          data: { Common: { Greeting: "Hi {{name}}" } },
        },
      },
    };

    expect(getCommonTranslation("Greeting", { name: "Bob" })).toBe("Hi Bob");
  });

  it("returns an identity translation from t() when loaded has no entry", () => {
    // Real i18next honors defaultValue, so a result equal to the key is a
    // valid identity translation ("Search" -> "Search"), not a missing key.
    (window as MutableWindow).i18n = {
      t: (key: string, options?: { defaultValue?: string }) =>
        key === "Search" ? "Search" : (options?.defaultValue ?? key),
      instance: { language: "en-GB" },
      loaded: {},
    };

    expect(getCommonTranslation("Search")).toBe("Search");
  });

  it("resolves from the raw-language bundle before normalization", () => {
    // en-GB is normalized to "en" for lookups, but loaded URLs keep the raw
    // language segment.
    (window as MutableWindow).i18n = {
      t: identityT,
      instance: { language: "en-GB" },
      loaded: {
        "/locales/en-GB/Common.json": { data: { Paid: "Paid (GB)" } },
      },
    };

    expect(getCommonTranslation("Paid")).toBe("Paid (GB)");
  });

  it("falls back to the en combined bundle for a non-en language", () => {
    (window as MutableWindow).i18n = {
      t: identityT,
      instance: { language: "fr" },
      loaded: {
        // fr bundle lacks the key; en bundle is the fallback
        "/locales/fr/_combined.json": { data: { Common: {} } },
        "/locales/en/_combined.json": { data: { Common: { Paid: "Paid" } } },
      },
    };

    expect(getCommonTranslation("Paid")).toBe("Paid");
  });
});

