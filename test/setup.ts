import "@testing-library/jest-dom/vitest";

// @tanem/svg-injector uses SVGSVGElement which jsdom doesn't provide
if (typeof SVGSVGElement === "undefined") {
  (globalThis as Record<string, unknown>).SVGSVGElement =
    class SVGSVGElement {} as unknown as typeof globalThis.SVGSVGElement;
}

import enCommon from "../locales/en/Common.json";
import type { TTranslations } from "../providers/translation/i18n";
import { getI18NInstance } from "../providers/translation/i18n";
import { setBrandLookup } from "../constants/brands";
import { parseLocaleConstants } from "@docspace/shared/constants/parse-locale-constants";
import brandsData from "../../../public/locales/.constants/brands.json";

const { get: getBrand } = parseLocaleConstants(
  brandsData as Record<string, string>,
);
setBrandLookup(getBrand);

// Node.js 22+ exposes a built-in `localStorage` that lacks standard Web Storage
// methods (clear, setItem, etc.), which shadows the jsdom implementation.
// Provide a spec-compliant in-memory Storage mock so that tests calling
// `vi.spyOn(Storage.prototype, ...)` work correctly.
class MockStorage implements Storage {
  private store: Record<string, string> = {};

  getItem(key: string): string | null {
    return key in this.store ? this.store[key] : null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = String(value);
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  clear(): void {
    this.store = {};
  }

  key(index: number): string | null {
    return Object.keys(this.store)[index] ?? null;
  }

  get length(): number {
    return Object.keys(this.store).length;
  }
}

// Replace the global Storage constructor so spyOn(Storage.prototype, ...) works
Object.defineProperty(globalThis, "Storage", {
  value: MockStorage,
  writable: true,
});
Object.defineProperty(globalThis, "localStorage", {
  value: new MockStorage(),
  writable: true,
});
Object.defineProperty(globalThis, "sessionStorage", {
  value: new MockStorage(),
  writable: true,
});

const translations: TTranslations = new Map([
  ["en", new Map([["Common", enCommon]])],
]);

getI18NInstance("en", translations);
