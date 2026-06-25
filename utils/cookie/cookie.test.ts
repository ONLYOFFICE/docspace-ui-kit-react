/*
 * Copyright (C) Ascensio System SIA, 2009-2026
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation, together with the
 * additional terms provided in the LICENSE file.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For
 * details, see the GNU AGPL at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA by email at info@onlyoffice.com
 * or by postal mail at 20A-6 Ernesta Birznieka-Upisha Street, Riga,
 * LV-1050, Latvia, European Union.
 *
 * The interactive user interfaces in modified versions of the Program
 * are required to display Appropriate Legal Notices in accordance with
 * Section 5 of the GNU AGPL version 3.
 *
 * No trademark rights are granted under this License.
 *
 * All non-code elements of the Product, including illustrations,
 * icon sets, and technical writing content, are licensed under the
 * Creative Commons Attribution-ShareAlike 4.0 International License:
 * https://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 * This license applies only to such non-code elements and does not
 * modify or replace the licensing terms applicable to the Program's
 * source code, which remains licensed under the GNU Affero General
 * Public License v3.
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

vi.mock("../../constants", () => ({
  LANGUAGE: "language",
}));

import { getCookie, setCookie, deleteCookie } from ".";

function resetDomCookies() {
  document.cookie
    .split(";")
    .map((c) => c.trim())
    .filter(Boolean)
    .forEach((c) => {
      const eqPos = c.indexOf("=");
      const name = eqPos > -1 ? c.substring(0, eqPos) : c;
      document.cookie = `${name}=; Max-Age=-1; path=/`;
    });
}

describe("cookie utils", () => {
  const originalWindow = globalThis.window;
  const originalDocument = globalThis.document;

  beforeEach(() => {
    if (typeof document !== "undefined") resetDomCookies();
  });

  afterEach(() => {
    if (globalThis.window !== originalWindow) {
      globalThis.window = originalWindow as Window & typeof globalThis;
    }
    if (globalThis.document !== originalDocument) {
      globalThis.document = originalDocument as Document;
    }
  });

  describe("getCookie", () => {
    it("returns cookie value when present", () => {
      document.cookie = "foo=bar; path=/";
      expect(getCookie("foo")).toBe("bar");
    });

    it("returns decoded cookie value", () => {
      document.cookie = "foo=hello%20world; path=/";
      expect(getCookie("foo")).toBe("hello world");
    });

    it("returns undefined when cookie is missing", () => {
      expect(getCookie("missing")).toBeUndefined();
    });

    it("returns undefined when document is undefined", () => {
      globalThis.document = undefined as unknown as Document;
      expect(getCookie("foo")).toBeUndefined();
    });

    it("returns culture from URL for LANGUAGE on LinkInvite page", () => {
      window.history.replaceState({}, "", "/confirm/LinkInvite?culture=de-DE");

      document.cookie = "language=en-US; path=/";
      expect(getCookie("language")).toBe("de-DE");
    });

    it("falls back to cookie when culture param is missing", () => {
      window.history.replaceState({}, "", "/confirm/LinkInvite");

      document.cookie = "language=en-US; path=/";
      expect(getCookie("language")).toBe("en-US");
    });

    it("falls back to cookie when pathname does not match", () => {
      window.history.replaceState({}, "", "/other?culture=de-DE");

      document.cookie = "language=en-US; path=/";
      expect(getCookie("language")).toBe("en-US");
    });

    it("does not apply URL logic for non-LANGUAGE cookies", () => {
      window.history.replaceState({}, "", "/confirm/LinkInvite?culture=de-DE");

      document.cookie = "foo=bar; path=/";
      expect(getCookie("foo")).toBe("bar");
    });
  });

  describe("setCookie", () => {
    it("sets cookie with default options", () => {
      setCookie("foo", "bar");
      expect(document.cookie).toContain("foo=bar");
    });

    it("converts expires Date to UTC string", () => {
      const date = new Date("2030-01-01T00:00:00.000Z");
      const spy = vi.spyOn(document, "cookie", "set");

      setCookie("exp", "1", { expires: date });

      const value = spy.mock.calls.at(-1)?.[0] ?? "";
      expect(value).toContain(date.toUTCString());

      spy.mockRestore();
    });

    it("adds boolean options without value", () => {
      const spy = vi.spyOn(document, "cookie", "set");

      setCookie("s", "1", { secure: true });

      const value = spy.mock.calls.at(-1)?.[0] ?? "";
      expect(value).toContain("secure");
      expect(value).not.toContain("secure=");

      spy.mockRestore();
    });

    it("adds non-boolean options as key=value", () => {
      const spy = vi.spyOn(document, "cookie", "set");

      setCookie("s", "1", { "max-age": 10, sameSite: "Lax" });

      const value = spy.mock.calls.at(-1)?.[0] ?? "";
      expect(value).toContain("max-age=10");
      expect(value).toContain("sameSite=Lax");

      spy.mockRestore();
    });
  });

  describe("deleteCookie", () => {
    it("sets max-age to -1", () => {
      const spy = vi.spyOn(document, "cookie", "set");

      deleteCookie("foo");

      const value = spy.mock.calls.at(-1)?.[0] ?? "";
      expect(value).toContain("foo=");
      expect(value).toContain("max-age=-1");

      spy.mockRestore();
    });

    it("removes cookie value", () => {
      setCookie("foo", "bar");
      expect(getCookie("foo")).toBe("bar");

      deleteCookie("foo");
      expect(getCookie("foo")).toBeUndefined();
    });
  });
});
