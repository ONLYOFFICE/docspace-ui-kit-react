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

import { getLogoUrl } from "../../../utils/getLogoUrl";
import { DeviceType, WhiteLabelLogoType } from "../../../enums";
import { ArticleHeaderLoader } from "../skeletons";
import { useTheme } from "../../../context/ThemeContext";

import { AsideHeader } from "../../aside";
import BackButton from "./BackButton";

import styles from "../Article.module.scss";

import { ArticleHeaderProps } from "../Article.types";

const ArticleHeader = ({
  showText,
  children,
  onLogoClickAction,
  isBurgerLoading,

  withCustomArticleHeader,
  currentDeviceType,
  onIconClick,
  showBackButton,
  navigate,
  onBack,
  ...rest
}: ArticleHeaderProps) => {
  const { isBase } = useTheme();

  const onLogoClick = () => {
    onLogoClickAction?.();
    if (navigate) navigate("/");
    else window.location.href = "/";
  };

  const onLogoAuxClick = (e: React.MouseEvent) => {
    const isMouseWheelClick = e.button === 1;

    if (!isMouseWheelClick) return;

    e.preventDefault();
    window.open("/", "_blank");
  };

  const burgerLogo = getLogoUrl(
    WhiteLabelLogoType.LeftMenu,
    !isBase,
    false,
    "",
    true,
  );
  const logo = getLogoUrl(
    WhiteLabelLogoType.LightSmall,
    !isBase,
    false,
    "",
    true,
  );

  if (currentDeviceType === DeviceType.mobile)
    return (
      <AsideHeader
        headerHeight={showBackButton ? "76px" : "49px"}
        isCloseable
        withoutBorder
        onCloseClick={onIconClick}
        headerComponent={
          showBackButton ? (
            <BackButton
              showText={showText}
              currentDeviceType={currentDeviceType}
              toggleArticleOpen={onIconClick}
              navigate={navigate}
              onBack={onBack}
            />
          ) : null
        }
      />
    );

  const isLoadingComponent =
    currentDeviceType === DeviceType.tablet ? (
      <ArticleHeaderLoader
        height="28px"
        width={showText ? "100%" : "28px"}
        showText={showText}
      />
    ) : (
      <ArticleHeaderLoader height="28px" width="211px" showText={showText} />
    );

  const mainComponent = (
    <>
      {currentDeviceType === DeviceType.tablet ? (
        <div
          className={styles.iconBox}
          data-show-text={showText ? "true" : "false"}
        >
          <img
            src={burgerLogo}
            className="burger-logo"
            alt="burger-logo"
            onClick={onLogoClick}
            onAuxClick={onLogoAuxClick}
          />
        </div>
      ) : null}
      <div
        className={styles.heading}
        data-show-text={showText ? "true" : "false"}
      >
        {currentDeviceType === DeviceType.tablet ? (
          <img
            className="logo-icon_svg"
            alt="burger-logo"
            src={logo}
            onClick={onLogoClick}
            onAuxClick={onLogoAuxClick}
          />
        ) : (
          <div onClick={onLogoClick} onAuxClick={onLogoAuxClick}>
            <img className="logo-icon_svg" alt="burger-logo" src={logo} />
          </div>
        )}
      </div>
    </>
  );

  return (
    <div
      className={styles.articleHeader}
      data-show-text={showText ? "true" : "false"}
      {...rest}
    >
      {withCustomArticleHeader && children
        ? children
        : isBurgerLoading
          ? isLoadingComponent
          : mainComponent}
    </div>
  );
};

ArticleHeader.displayName = "Header";

export default ArticleHeader;
