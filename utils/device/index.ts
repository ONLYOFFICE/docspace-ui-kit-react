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

export const INFO_PANEL_WIDTH = 400;
export const MAX_INFINITE_LOADER_SHIFT = 800;

export function checkIsSSR() {
  return typeof window === "undefined";
}

export const size = {
  mobile: 600,
  // table: is between
  desktop: 1024,
};

export const mobile = `(max-width: ${size.mobile}px)`;

export const mobileMore = `(min-width: ${size.mobile}px)`;

export const tablet = `(max-width: ${size.desktop - 0.1}px)`;

export const desktop = `(min-width: ${size.desktop}px)`;

export const transitionalScreenSize = `(max-width: ${
  size.desktop + INFO_PANEL_WIDTH
}px)`;

export const isMobile = (width?: number) => {
  return (
    (width ?? ((typeof window !== "undefined" && window.innerWidth) || 0)) <=
    size.mobile
  );
};

export const isMobileDevice = () => {
  const angleByRadians =
    (Math.PI / 180) *
    (window.screen?.orientation?.angle ?? window.orientation ?? 0);
  const width = Math.abs(
    Math.round(
      Math.sin(angleByRadians) * window.innerHeight +
        Math.cos(angleByRadians) * window.innerWidth,
    ),
  );
  return isMobile(width);
};

export const isTablet = (width?: number) => {
  const checkWidth =
    width || (typeof window !== "undefined" && window.innerWidth) || 0;
  return checkWidth > size.mobile && checkWidth < size.desktop;
};

export const isDesktop = () => {
  if (!checkIsSSR()) {
    return window.innerWidth >= size.desktop;
  }
  return false;
};

export const isTouchDevice = !!(
  typeof window !== "undefined" &&
  typeof navigator !== "undefined" &&
  ("ontouchstart" in window || navigator.maxTouchPoints > 0)
);

/**
 * True for Android Chrome/Firefox/Samsung Internet — browsers where
 * `visualViewport` reliably tracks the virtual keyboard. Edge Android is
 * excluded because its viewport geometry is unstable during keyboard
 * transitions.
 */
export const isReliableAndroidViewport = () => {
  if (checkIsSSR()) return false;
  const ua = navigator.userAgent;
  if (!/Android/i.test(ua)) return false;
  if (/EdgA?\//i.test(ua)) return false;
  return true;
};
