"use client";

import i18next, { type i18n } from "i18next";
import { initReactI18next } from "react-i18next";

import { registerCommonI18nInstance } from "../../utils/i18n/i18n-utils";

// Own instance, not the i18next singleton: @onlyoffice/ai-chat also calls
// `init()` on the singleton, which would reset `ns`/`defaultNS`/`language`
// out from under host translations. Keeping a dedicated instance isolates
// host resources from any other library that touches the global.
export type TTranslations = Map<string, Map<string, Record<string, string>>>;

// Build a private i18next instance instead of mutating the default singleton —
// keeps DocSpace resources isolated from any third-party packages that also
// `init` i18next.
let instance: ReturnType<typeof i18next.createInstance> | null = null;
let isInitialized = false;

function loadResources(translations: TTranslations) {
  if (!instance) return;
  translations.forEach((nsList, lang) => {
    nsList.forEach((resources, ns) => {
      instance?.addResourceBundle(lang, ns, resources, true, true);
    });
  });
}

export const getI18NInstance = (
  lng: string,
  translations: TTranslations,
): i18n => {
  if (!instance) {
    instance = i18next.createInstance();
  }
  if (!isInitialized) {
    instance.use(initReactI18next).init({
      lng,
      fallbackLng: "en",
      load: "currentOnly",
      debug: false,
      interpolation: {
        escapeValue: false,
        format(value, format) {
          if (format === "lowercase") return value.toLowerCase();
          return value;
        },
      },
      ns: ["Common"],
      defaultNS: "Common",
      react: {
        useSuspense: false,
      },
      initImmediate: false,
    });
    isInitialized = true;
  } else if (instance.language !== lng) {
    instance.changeLanguage(lng);
  }

  loadResources(translations);
  const i18n = instance;

  // Expose the private instance for SSR lookups in getCommonTranslation,
  // where window.i18n is not available.
  registerCommonI18nInstance(i18n);

  if (typeof window !== "undefined") {
    const win = window as unknown as {
      i18n?: {
        t?: typeof i18n.t;
        loaded?: Record<string, { data: Record<string, string> }>;
        instance?: typeof i18n;
      };
    };
    if (!win.i18n) win.i18n = {};
    win.i18n.t = i18n.t.bind(i18n);
    win.i18n.instance = i18n;

    const loaded: Record<string, { data: Record<string, string> }> = {};
    translations.forEach((nsList, lang) => {
      nsList.forEach((resources, ns) => {
        loaded[`${lang}/${ns}.json`] = { data: resources };
      });
    });
    win.i18n.loaded = loaded;
  }

  return i18n;
};
