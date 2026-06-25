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

import { LANGUAGE } from "../../constants";

export function getCookie(name: string) {
  if (typeof window !== "undefined" && name === LANGUAGE) {
    const url = new URL(window.location.href);
    const culture = url.searchParams.get("culture");

    if (url.pathname === "/confirm/LinkInvite" && culture) {
      return culture;
    }
  }

  if (typeof document === "undefined") return undefined;

  const matches = document.cookie.match(
    new RegExp(
      "(?:^|; )" +
        name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") +
        "=([^;]*)",
    ),
  );

  return matches ? decodeURIComponent(matches[1]) : undefined;
}

export function setCookie(
  name: string,
  value: string,
  optionsParam: { [key: string]: unknown } = {},
  disableEncoding = false,
) {
  let options: { [key: string]: unknown } = {
    path: "/",
    ...optionsParam,
  };

  if (options.expires instanceof Date) {
    options = {
      ...options,
      expires: options.expires.toUTCString(),
    };
  }

  let updatedCookie = `${encodeURIComponent(name)}=${disableEncoding ? value : encodeURIComponent(value)}`;

  Object.keys(options).forEach((optionKey) => {
    updatedCookie += "; " + optionKey;
    const optionValue = options[optionKey];
    if (optionValue !== true) {
      updatedCookie += "=" + optionValue;
    }
  });

  document.cookie = updatedCookie;
}

export function deleteCookie(name: string) {
  setCookie(name, "", {
    "max-age": -1,
  });
}
