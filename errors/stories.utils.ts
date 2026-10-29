// A fallback for a page rendered without TranslationProvider. Storybook's
// preview mounts one, which fills window.i18n with the real English strings;
// replacing it would show these stand-ins instead and leave every story
// opened afterwards without its translations.
export const setupErrorI18n = () => {
  const win = window as unknown as Record<string, { loaded?: unknown }>;
  if (win.i18n?.loaded) return;

  (window as unknown as Record<string, unknown>).i18n = {
    loaded: {
      "en/Common.json": {
        data: {
          Error401Text: "You are not authorized (401)",
          Error403Text: "Access forbidden (403)",
          Error404Text: "Page not found (404)",
          ErrorOfflineText: "You are offline",
          InvalidLink: "Invalid link",
          LinkDoesNotExist: "This link does not exist or has expired",
          ErrorDeactivatedText:
            "This ONLYOFFICE workspace has been deactivated",
          ProductName: "ONLYOFFICE",
          AccessDenied: "Access denied",
          PortalRestriction:
            "Access to ONLYOFFICE workspace is restricted for your account",
        },
      },
    },
  };
};
