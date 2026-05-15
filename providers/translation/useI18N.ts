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

  const isInit = React.useRef(false);

  React.useEffect(() => {
    if (!settings?.timezone) return;
    window.timezone = settings.timezone;
  }, [settings?.timezone]);

  React.useEffect(() => {
    if (!translations) return;
    isInit.current = true;

    const instance = getI18NInstance(lng ?? portalLng, translations);

    if (instance) {
      setI18N(instance);
    }
  }, [lng, portalLng, translations]);

  return { i18n };
};

export default useI18N;
