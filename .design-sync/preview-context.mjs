// Design-sync preview context: the data .storybook/preview.tsx feeds its
// decorators, exported so cfg.provider can reach it as window.AppsUiKit.<name>
// via {"$ref": ...}. Bundled into _ds_bundle.js through cfg.extraEntries.
// Imports the built entry, so it shares one module instance with the bundle.
import {
  globalColors,
  parseLocaleConstants,
  setBrandLookup,
} from "../dist/esm/index.js";
import enCommon from "../locales/en/Common.json";
import enPayments from "../locales/en/Payments.json";
import enSettings from "../locales/en/Settings.json";
import brandsData from "../test/fixtures/brands.json";

// Same as .storybook/preview.tsx: without a brand lookup, brand names render
// as their own keys ("ProductName").
setBrandLookup(parseLocaleConstants(brandsData).get);

export const previewTranslations = new Map([
  [
    "en",
    new Map([
      ["Common", enCommon],
      ["Payments", enPayments],
      ["Settings", enSettings],
    ]),
  ],
]);

export const previewTheme = {
  isBase: true,
  interfaceDirection: "ltr",
  fontFamily: "Open Sans, sans-serif, Arial",
};

export const previewColorScheme = {
  id: 1,
  name: "Light",
  main: {
    accent: globalColors.lightBlueMain,
    buttons: globalColors.lightBlueMain,
  },
  text: {
    accent: globalColors.white,
    buttons: globalColors.white,
  },
};

// The bundle's own react-i18next, so a story calling useTranslation() reads
// the same I18nextContext TranslationProvider fills. The story-imports fork
// resolves story-side `react-i18next` imports to this namespace.
export * as __dsReactI18next from "react-i18next";
