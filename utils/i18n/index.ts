// (c) Copyright Ascensio System SIA 2009-2026
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

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
  };
};

const getWindowI18n = (): WindowI18n | undefined => {
  if (typeof window === "undefined") return undefined;
  return (window as unknown as { i18n?: WindowI18n }).i18n;
};

/**
 * Gets a translation from window.i18n.
 * Uses i18next t function if available (set by TranslationProvider),
 * otherwise falls back to manual lookup from window.i18n.loaded.
 * Logs a console error and returns an empty string if the key is not found.
 */
export const getCommonTranslation = (
  key: string,
  interpolation?: Record<string, string | number>,
): string => {
  if (typeof window === "undefined") return i18ninstance?.t(key);

  const i18n = getWindowI18n();

  if (i18n?.t) {
    const result = i18n.t(key, interpolation);
    if (result && result !== key) return result;
  }

  if (i18n?.loaded) {
    const cookieLang = getCookie("asc_language");
    const lang =
      cookieLang === "en-US" || cookieLang === "en-GB"
        ? "en"
        : (cookieLang ?? "en");

    const commonKeys = Object.getOwnPropertyNames(i18n.loaded).filter(
      (k) => k.indexOf(`${lang}/Common.json`) > -1,
    );

    if (commonKeys.length > 0) {
      const i18nKey = commonKeys.length === 1 ? commonKeys[0] : commonKeys[1];

      let translation = i18n.loaded[i18nKey]?.data?.[key];

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

  console.error(
    `[i18n] Missing translation for key "${key}". Ensure the TranslationProvider is mounted or window.i18n.loaded contains the required Common namespace.`,
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


