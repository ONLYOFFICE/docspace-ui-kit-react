"use client";

import React from "react";
import { match, P } from "ts-pattern";
// Types only, and deliberately so: this file used to import
// `CommonSettingsApiAxiosParamCreator` as a value, which put the whole REST SDK
// -- and `axios`, which it depends on -- into every application that mounted
// ThemeProvider, for a call that never sent a request. A type import is erased
// at build time, so the palette's shape stays described and nothing ships.
import type {
  CustomColorThemesSettingsDto,
  CustomColorThemesSettingsItem,
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
  /** Theme to use; a new value is applied in place, without a remount. Left out, the system's own preference is followed. */
  initialTheme?: ThemeKeys;
  /** Theme to treat as the system's, instead of reading `prefers-color-scheme`. */
  systemTheme?: ThemeKeys;
  /** The portal's accent palette. Outside the portal there is none — leave it out. */
  colorTheme?: CustomColorThemesSettingsDto;
  /** Language tag deciding the writing direction and the font family. */
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

  // `colorTheme` is the only way a palette gets in. What stood here was an
  // `await` on the API SDK's *parameter builder*: it returns `{ url, options }`
  // and sends nothing, the result was read as a response, `.themes` on it was
  // undefined, and the branch ended without so much as a rejection. Keeping it
  // cost every consumer the REST client and axios for a call that could not
  // succeed; a portal that wants its accent applied passes it as a prop, which
  // is what the portal already does.
  React.useEffect(() => {
    setCurrentColorTheme(findColorTheme(colorTheme));
  }, [colorTheme]);

  const getUserTheme = React.useCallback(() => {
    setTheme(
      resolveTheme(initialTheme, systemTheme, effectiveLang, currentColorTheme),
    );

    setCookie(SYSTEM_THEME_KEY, getSystemTheme());
  }, [effectiveLang, initialTheme, systemTheme, currentColorTheme]);

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
