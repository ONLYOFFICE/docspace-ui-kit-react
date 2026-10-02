export const setupErrorI18n = () => {
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
