import "@testing-library/jest-dom/vitest";
import { Settings } from "luxon";

import enCommon from "../locales/en/Common.json";
import type { TTranslations } from "../providers/translation/i18n";
import { getI18NInstance } from "../providers/translation/i18n";

// Set default locale for luxon to en-US for consistent test results
Settings.defaultLocale = "en-US";

const translations: TTranslations = new Map([
  ["en", new Map([["Common", enCommon]])],
]);

getI18NInstance("en", translations);
