"use client";

import React from "react";
import type { i18n as i18nType } from "i18next";

import type {
  EmployeeFullDto,
  SettingsDto,
} from "@onlyoffice/docspace-api-sdk";

import { getI18NInstance, type TTranslations } from "./i18n";

export type UseI18NProps = {
  settings?: SettingsDto;
  user?: EmployeeFullDto;
  locale?: string;
  translations?: TTranslations;
};

const useI18N = ({ settings, user, locale, translations }: UseI18NProps) => {
  const lng = locale || user?.cultureName || settings?.culture || "en";
  const portalLng = settings?.culture || "en";

  const [i18n, setI18N] = React.useState<i18nType | null>(() =>
    translations ? getI18NInstance(lng ?? portalLng, translations) : null,
  );

  React.useEffect(() => {
    if (!settings?.timezone) return;
    window.timezone = settings.timezone;
  }, [settings?.timezone]);

  // Re-run only when language or translations identity changes — same
  // identity means resources have already been registered above (the
  // useState initializer ran getI18NInstance for us) and re-invoking the
  // setup is what was racing with react-i18next's languageChanged event,
  // letting `t()` snap back to raw keys on background re-renders.
  React.useEffect(() => {
    if (!translations) return;
    const instance = getI18NInstance(lng ?? portalLng, translations);
    if (instance) setI18N(instance);
  }, [lng, portalLng, translations]);

  return { i18n };
};

export default useI18N;
