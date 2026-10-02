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
