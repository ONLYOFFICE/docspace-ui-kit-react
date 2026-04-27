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

// Shared parser for JSON files with locale-suffix overrides.
//
// Format:
//   "ProviderApple": "Apple"        — default for all languages
//   "ProviderApple-si": "..."       — override for Sinhala
//
// Returns a lookup function: (key, locale?) => string

type Entry = { defaultValue: string; overrides: Record<string, string> };

export function parseLocaleConstants(rawData: Record<string, string>) {
  const parsed: Record<string, Entry> = {};

  for (const [rawKey, value] of Object.entries(rawData)) {
    const match = rawKey.match(
      /^(.+?)-((?:[a-z]{2,3})(?:-[A-Z][a-zA-Z]+-[A-Z]{2}|-[A-Z]{2})?)$/,
    );

    if (match) {
      const [, baseKey, locale] = match;
      if (!parsed[baseKey]) {
        parsed[baseKey] = { defaultValue: "", overrides: {} };
      }
      parsed[baseKey].overrides[locale] = value;
    } else {
      if (!parsed[rawKey]) {
        parsed[rawKey] = { defaultValue: value, overrides: {} };
      } else {
        parsed[rawKey].defaultValue = value;
      }
    }
  }

  const keys = new Set(Object.keys(parsed));

  function get(key: string, locale?: string): string {
    const entry = parsed[key];
    if (!entry) return key;
    if (locale && entry.overrides[locale]) return entry.overrides[locale];
    return entry.defaultValue;
  }

  return { get, keys, parsed };
}
