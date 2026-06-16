import { describe, it, expect, afterEach } from "vitest";

import { getCommonTranslation } from "./i18n-utils";

type MutableWindow = typeof window & { i18n?: unknown };

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
