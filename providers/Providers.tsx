/*
 * Copyright (C) Ascensio System SIA, 2009-2026
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation, together with the
 * additional terms provided in the LICENSE file.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For
 * details, see the GNU AGPL at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA by email at info@onlyoffice.com
 * or by postal mail at 20A-6 Ernesta Birznieka-Upisha Street, Riga,
 * LV-1050, Latvia, European Union.
 *
 * The interactive user interfaces in modified versions of the Program
 * are required to display Appropriate Legal Notices in accordance with
 * Section 5 of the GNU AGPL version 3.
 *
 * No trademark rights are granted under this License.
 *
 * All non-code elements of the Product, including illustrations,
 * icon sets, and technical writing content, are licensed under the
 * Creative Commons Attribution-ShareAlike 4.0 International License:
 * https://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 * This license applies only to such non-code elements and does not
 * modify or replace the licensing terms applicable to the Program's
 * source code, which remains licensed under the GNU Affero General
 * Public License v3.
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import React from "react";

import type {
  SettingsDto,
  EmployeeFullDto,
} from "@onlyoffice/docspace-api-sdk";

import type { ErrorInfo, ReactNode } from "react";

import type { TTranslationProvider } from "./translation";
import type { TThemeProvider } from "./theme";
import type { TApiProvider } from "./api";

import ErrorBoundary from "./error-boundary/ErrorBoundary";
import TranslationProvider from "./translation/TranslationProvider";
import ThemeProvider from "./theme/ThemeProvider";
import ApiProvider from "./api/ApiProvider";
import { useApi } from "./api";

export type TProvidersProps = {
  children: React.ReactNode;
  locale?: string;
  errorFallback?: ReactNode | ((error: Error) => ReactNode);
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
} & TTranslationProvider &
  TThemeProvider &
  Pick<TApiProvider, "url" | "apiKey">;

const InnerProviders = ({
  children,

  settings: settingsProp,
  user: userProp,
  locale,

  initialTheme,
  systemTheme,
  colorTheme,

  translations,
}: Omit<TProvidersProps, "url" | "apiKey">) => {
  const { profilesApi, commonSettingsApi } = useApi();

  const [fetchedSettings, setFetchedSettings] = React.useState<
    SettingsDto | undefined
  >(undefined);
  const [fetchedUser, setFetchedUser] = React.useState<
    EmployeeFullDto | undefined
  >(undefined);

  React.useEffect(() => {
    const fetchProvidersData = async () => {
      const [settingsResponse, userResponse] = await Promise.all([
        settingsProp ? undefined : commonSettingsApi.getPortalSettings(),
        userProp ? undefined : profilesApi.getSelfProfile(),
      ]);

      if (settingsResponse) {
        setFetchedSettings(settingsResponse.data.response);
      }

      if (userResponse) {
        setFetchedUser(userResponse.data.response);
      }
    };

    fetchProvidersData();
  }, [profilesApi, commonSettingsApi, settingsProp, userProp]);

  const settings = settingsProp ?? fetchedSettings;
  const user = userProp ?? fetchedUser;

  return (
    <TranslationProvider
      settings={settings}
      user={user}
      locale={locale}
      translations={translations}
    >
      <ThemeProvider
        initialTheme={initialTheme}
        systemTheme={systemTheme}
        colorTheme={colorTheme}
        locale={locale}
      >
        {children}
      </ThemeProvider>
    </TranslationProvider>
  );
};

const Providers = ({
  children,
  url,
  apiKey,
  errorFallback,
  onError,
  ...rest
}: TProvidersProps) => {
  return (
    <ErrorBoundary fallback={errorFallback} onError={onError}>
      <ApiProvider url={url} apiKey={apiKey}>
        <InnerProviders {...rest}>{children}</InnerProviders>
      </ApiProvider>
    </ErrorBoundary>
  );
};

export default Providers;
