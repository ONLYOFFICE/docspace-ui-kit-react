"use client";

// (c) Copyright Ascensio System SIA 2009-2026
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

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
    initialTheme === ThemeKeys.SystemStr ? getSystemTheme() : systemTheme;

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
