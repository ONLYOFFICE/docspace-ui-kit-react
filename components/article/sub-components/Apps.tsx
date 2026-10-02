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
