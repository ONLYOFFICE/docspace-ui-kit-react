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
import classNames from "classnames";

import WindowsReactSvgUrl from "../../../assets/windows.react.svg";
import MacOSReactSvgUrl from "../../../assets/macOS.react.svg";
import LinuxReactSvgUrl from "../../../assets/linux.react.svg";
import AndroidReactSvgUrl from "../../../assets/android.react.svg";
import IOSReactSvgUrl from "../../../assets/iOS.react.svg";

import { Text } from "../../text";
import { IconButton } from "../../icon-button";
import { useCommonTranslation } from "../../../utils/i18n";

import styles from "../Article.module.scss";
import { ArticleAppsProps } from "../Article.types";

const ArticleApps = React.memo(
  ({
    showText,
    withDevTools,
    withCustomSlot,
    logoText,
    downloaddesktopUrl,
    officeforandroidUrl,
    officeforiosUrl,
  }: ArticleAppsProps) => {
    const t = useCommonTranslation();

    if (!showText) return null;

    return (
      <div
        data-show-text={showText ? "true" : "false"}
        data-with-dev-tools={withDevTools ? "true" : "false"}
        data-with-custom-slot={withCustomSlot ? "true" : "false"}
        className={classNames(styles.apps, {
          [styles.withDevTools]: withDevTools,
        })}
      >
        <Text
          className="download-app-text"
          fontSize="11px"
          noSelect
          lineHeight="12px"
          fontWeight={600}
        >
          {t("DownloadApps")}
        </Text>
        <div className="download-app-list">
          {downloaddesktopUrl ? (
            <IconButton
              className={styles.windowsIcon}
              onClick={() => window.open(downloaddesktopUrl)}
              iconNode={<WindowsReactSvgUrl />}
              size={32}
              isFill
              title={t("MobileWin", {
                organizationName: logoText,
              })}
            />
          ) : null}

          {downloaddesktopUrl ? (
            <IconButton
              className={styles.macOsIcon}
              onClick={() => window.open(downloaddesktopUrl)}
              iconNode={<MacOSReactSvgUrl />}
              size={32}
              isFill
              title={t("MobileMac", {
                organizationName: logoText,
              })}
            />
          ) : null}

          {downloaddesktopUrl ? (
            <IconButton
              className={styles.linuxIcon}
              onClick={() => window.open(downloaddesktopUrl)}
              iconNode={<LinuxReactSvgUrl />}
              size={32}
              isFill
              title={t("MobileLinux", {
                organizationName: logoText,
              })}
            />
          ) : null}

          {officeforandroidUrl ? (
            <IconButton
              className={styles.androidIcon}
              onClick={() => window.open(officeforandroidUrl)}
              iconNode={<AndroidReactSvgUrl />}
              size={32}
              isFill
              title={t("MobileAndroid", {
                organizationName: logoText,
              })}
            />
          ) : null}

          {officeforiosUrl ? (
            <IconButton
              className={styles.iosIcon}
              onClick={() => window.open(officeforiosUrl)}
              iconNode={<IOSReactSvgUrl />}
              size={32}
              isFill
              title={t("MobileIos", {
                organizationName: logoText,
              })}
            />
          ) : null}
        </div>
      </div>
    );
  },
);

ArticleApps.displayName = "ArticleApps";

export default ArticleApps;
