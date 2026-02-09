import "@testing-library/jest-dom/vitest";

import enCommon from "../locales/en/Common.json";
import type { TTranslations } from "../providers/translation/i18n";
import { getI18NInstance } from "../providers/translation/i18n";

const translations: TTranslations = new Map([
  ["en", new Map([["Common", enCommon]])],
]);

getI18NInstance("en", translations);
