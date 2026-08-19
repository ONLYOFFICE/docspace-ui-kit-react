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

const AI_CHAT_LOCALES = new Set([
  "ar-SA",
  "be",
  "bg",
  "ca",
  "cs-CZ",
  "da",
  "de",
  "el",
  "en",
  "es",
  "fi",
  "fr",
  "gl",
  "he",
  "hr",
  "hu",
  "hy",
  "id",
  "it",
  "ja-JP",
  "ko",
  "lv",
  "nl",
  "no",
  "pl",
  "pt-BR",
  "pt-PT",
  "ro",
  "ru",
  "sk-SK",
  "sl",
  "sq-AL",
  "sr-Cyrl-RS",
  "sr-Latn-RS",
  "sv",
  "tr",
  "uk",
  "ur",
  "vi",
  "zh-CN",
  "zh-TW",
]);

// DocSpace culture → @onlyoffice/ai-chat locale.
// Covers cases where codes diverge: DocSpace drops the region for some
// cultures that ai-chat keeps (cs-CZ, sk-SK, pt-PT), and keeps the region
// for some that ai-chat drops (uk, ko, el, hy).
const DOCSPACE_TO_AI_CHAT: Record<string, string> = {
  cs: "cs-CZ",
  "el-GR": "el",
  "hy-AM": "hy",
  "ko-KR": "ko",
  pt: "pt-PT",
  sk: "sk-SK",
  "uk-UA": "uk",
};

// Canonicalize to BCP 47: lowercase language, uppercase region, title-case
// script (so inputs like "RU", "pt-br", "sr-cyrl-rs" all match the maps).
const toBcp47 = (input: string): string => {
  const parts = input.split("-");
  return parts
    .map((part, i) => {
      if (i === 0) return part.toLowerCase();
      if (part.length === 4) {
        return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
      }
      return part.toUpperCase();
    })
    .join("-");
};

export const normalizeAiChatLocale = (input: string | undefined): string => {
  if (!input) return "en";
  const canonical = toBcp47(input);
  if (DOCSPACE_TO_AI_CHAT[canonical]) return DOCSPACE_TO_AI_CHAT[canonical];
  if (AI_CHAT_LOCALES.has(canonical)) return canonical;
  const short = canonical.split("-")[0];
  if (AI_CHAT_LOCALES.has(short)) return short;
  return "en";
};
