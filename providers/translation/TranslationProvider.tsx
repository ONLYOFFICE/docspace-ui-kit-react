"use client";

import type React from "react";
import { I18nextProvider } from "react-i18next";

import useI18N, { type UseI18NProps } from "./useI18N";

export type TTranslationProvider = {
  children: React.ReactNode;
} & UseI18NProps;

const TranslationProvider = ({
  children,
  settings,
  user,
  locale,
  translations,
}: TTranslationProvider) => {
  const { i18n } = useI18N({ settings, user, locale, translations });

  if (!i18n) return <>{children}</>;

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};

export default TranslationProvider;
