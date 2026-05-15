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

import { default as i18ninstance } from "i18next";

/**
 * Gets a cookie value by name
 */
export const getCookie = (name: string): string | undefined => {
  if (typeof document === "undefined") return undefined;

  const matches = document.cookie.match(
    new RegExp(
      `(?:^|; )${name.replace(/([.$?*|{}()[\]\\/+^])/g, "\\$1")}=([^;]*)`,
    ),
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
};

export type WindowI18n = {
  t?: (key: string, options?: Record<string, string | number>) => string;
  loaded?: Record<string, { data: Record<string, string> }>;
  instance?: {
    on: (event: string, callback: (...args: unknown[]) => void) => void;
    off: (event: string, callback: (...args: unknown[]) => void) => void;
    language?: string;
    resolvedLanguage?: string;
  };
};

const getWindowI18n = (): WindowI18n | undefined => {
  if (typeof window === "undefined") return undefined;
  return (window as unknown as { i18n?: WindowI18n }).i18n;
};

const normalizeCommonLanguage = (language?: string): string => {
  return language === "en-US" || language === "en-GB"
    ? "en"
    : (language ?? "en");
};

export const getCurrentCommonLanguage = (): string => {
  const i18n = getWindowI18n();
  const language =
    i18n?.instance?.resolvedLanguage ??
    i18n?.instance?.language ??
    getCookie("asc_language");

  return normalizeCommonLanguage(language);
};

const DEFAULT_NAMESPACES = ["Common"];

/**
 * Gets a translation from window.i18n.
 * Uses i18next t function if available (set by TranslationProvider),
 * otherwise falls back to manual lookup from window.i18n.loaded.
 *
 * @param key - Translation key
 * @param interpolation - Optional interpolation params
 * @param namespaces - Namespaces to search in order (defaults to ["Common"])
 */
export const getCommonTranslation = (
  key: string,
  interpolation?: Record<string, unknown>,
  namespaces: string[] = DEFAULT_NAMESPACES,
): string => {
  if (typeof window === "undefined") return i18ninstance?.t(key);

  const i18n = getWindowI18n();

  if (i18n?.t) {
    const result = i18n.t(
      key,
      interpolation as Record<string, string | number>,
    );
    if (result && result !== key) return result;
  }

  if (i18n?.loaded) {
    const lang = getCurrentCommonLanguage();

    const hasPrefix = key.includes(":");
    const searchNamespaces = hasPrefix ? [key.split(":")[0]] : namespaces;
    const bareKey = hasPrefix ? key.split(":").slice(1).join(":") : key;

    const langsToTry = lang !== "en" ? [lang, "en"] : [lang];

    for (const tryLang of langsToTry) {
      for (const ns of searchNamespaces) {
        const loadedKeys: string[] = Object.getOwnPropertyNames(
          i18n.loaded,
        ).filter((k) => k.indexOf(`${tryLang}/${ns}.json`) > -1);

        if (loadedKeys.length > 0) {
          const i18nKey =
            loadedKeys.length === 1 ? loadedKeys[0] : loadedKeys[1];
          let translation = i18n.loaded[i18nKey]?.data?.[bareKey];

          if (translation) {
            if (interpolation) {
              Object.keys(interpolation).forEach((param) => {
                translation = translation.replace(
                  new RegExp(`{{\\s*${param}\\s*}}`, "g"),
                  String(interpolation[param]),
                );
              });
            }
            return translation;
          }
        }
      }
    }
  }

  console.error(
    `[i18n] Missing translation for key "${key}". Ensure the TranslationProvider is mounted or window.i18n.loaded contains the required namespaces [${namespaces.join(", ")}].`,
  );

  return "";
};

export { useCommonTranslation } from "./useCommonTranslation";

/**
 * Checks if translations are loaded and ready to use
 */
export const getTranslationReady = () => {
  if (typeof window === "undefined") return undefined;

  const i18n = (
    window as unknown as {
      i18n?: {
        loaded: Record<string, { data: Record<string, string> }>;
      };
    }
  ).i18n;

  return i18n?.loaded;
};

