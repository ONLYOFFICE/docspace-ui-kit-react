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
