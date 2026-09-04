"use client";

import React from "react";
import { match, P } from "ts-pattern";
import {
  type CustomColorThemesSettingsDto,
  type CustomColorThemesSettingsItem,
  CommonSettingsApiAxiosParamCreator,
} from "@onlyoffice/docspace-api-sdk";

import { getSystemTheme } from "../../utils/get-system-theme";
import { setCookie } from "../../utils/cookie";
import { ThemeKeys } from "../../enums";

import { SYSTEM_THEME_KEY } from "./themes/constants";
import {
  getFontFamilyDependingOnLanguage,
  getDirectionByLanguage,
} from "./rtl-utils";

// import { getAppearanceTheme } from "@docspace/shared/api/settings";

import { Base, Dark, type TTheme } from "./themes";

type MatchType = [ThemeKeys | undefined, ThemeKeys | undefined];

function findColorTheme(
  colorTheme?: CustomColorThemesSettingsDto,
): CustomColorThemesSettingsItem | undefined {
  if (!colorTheme) return undefined;
  return colorTheme.themes?.find((theme) => theme.id === colorTheme.selected);
}

function resolveTheme(
  initialTheme: ThemeKeys | undefined,
  systemTheme: ThemeKeys | undefined,
  lang: string,
  colorScheme: CustomColorThemesSettingsItem | undefined,
): TTheme {
  const interfaceDirection = getDirectionByLanguage(lang);
  const fontFamily = getFontFamilyDependingOnLanguage(lang);

  const resolvedSystemTheme =
    initialTheme === ThemeKeys.SystemStr || systemTheme === undefined
      ? getSystemTheme()
      : systemTheme;

  const baseTheme = match<MatchType>([initialTheme, resolvedSystemTheme])
    .returnType<TTheme>()
    .with([ThemeKeys.DarkStr, P._], () => Dark)
    .with([ThemeKeys.BaseStr, P._], () => Base)
    .with([ThemeKeys.SystemStr, ThemeKeys.BaseStr], () => Base)
    .with([ThemeKeys.SystemStr, ThemeKeys.DarkStr], () => Dark)
    .with([undefined, ThemeKeys.DarkStr], () => Dark)
    .with([undefined, ThemeKeys.BaseStr], () => Base)
    .otherwise(() => Base);

  return {
    ...baseTheme,
    currentColorScheme: colorScheme,
    interfaceDirection,
    fontFamily,
  };
}

export type UseThemeProps = {
  initialTheme?: ThemeKeys;
  systemTheme?: ThemeKeys;
  colorTheme?: CustomColorThemesSettingsDto;
  lang?: string;
};

const useTheme = ({
  initialTheme,
  systemTheme,
  colorTheme,
  lang,
}: UseThemeProps) => {
  const effectiveLang = lang || "en";

  const [currentColorTheme, setCurrentColorTheme] = React.useState<
    CustomColorThemesSettingsItem | undefined
  >(() => findColorTheme(colorTheme));

  const [theme, setTheme] = React.useState<TTheme>(() =>
    resolveTheme(initialTheme, systemTheme, effectiveLang, currentColorTheme),
  );

  const isRequestRunning = React.useRef(false);

  const getCurrentColorTheme = React.useCallback(async () => {
    if (isRequestRunning.current || colorTheme) return;
    isRequestRunning.current = true;

    const colorThemes =
      (await CommonSettingsApiAxiosParamCreator().getPortalColorTheme()) as CustomColorThemesSettingsDto;
    // const colorThemes = await getAppearanceTheme();

    const curColorTheme = colorThemes.themes?.find(
      (t) => t.id === colorThemes.selected,
    );

    isRequestRunning.current = false;
    if (curColorTheme) setCurrentColorTheme(curColorTheme);
  }, [colorTheme]);

  const getUserTheme = React.useCallback(() => {
    setTheme(
      resolveTheme(initialTheme, systemTheme, effectiveLang, currentColorTheme),
    );

    setCookie(SYSTEM_THEME_KEY, getSystemTheme());
  }, [effectiveLang, initialTheme, systemTheme, currentColorTheme]);

  React.useEffect(() => {
    getCurrentColorTheme();
  }, [getCurrentColorTheme]);

  React.useEffect(() => {
    getUserTheme();
  }, [getUserTheme]);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    mediaQuery.addEventListener("change", getUserTheme);

    return () => {
      mediaQuery.removeEventListener("change", getUserTheme);
    };
  }, [getUserTheme]);

  return { theme, currentColorTheme };
};

export default useTheme;

