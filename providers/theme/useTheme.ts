"use client";

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

