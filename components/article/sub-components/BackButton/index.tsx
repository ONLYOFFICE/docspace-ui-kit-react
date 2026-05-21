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

import ArrowIcon from "../../../../assets/arrow-left.react.svg";
import ArrowTabletIcon from "../../../../assets/arrow-left.long.react.svg";

import { IconButton } from "../../../icon-button";
import { Text } from "../../../text";
import { DeviceType } from "../../../../enums";
import { useCommonTranslation } from "../../../../utils";

import { ArticleHeaderLoader } from "../../skeletons";

import styles from "../../Article.module.scss";

const BackButton = ({
  showText,
  currentDeviceType,
  onLogoClickAction,
  isLoading,
  toggleArticleOpen,
  navigate,
  onBack,
}: {
  showText: boolean;
  currentDeviceType: DeviceType;
  onLogoClickAction?: () => void;
  isLoading?: boolean;
  toggleArticleOpen?: () => void;
  navigate?: (path: string) => void;
  onBack?: () => void;
}) => {
  const t = useCommonTranslation();

  const onClickBack = () => {
    onLogoClickAction?.();

    if (toggleArticleOpen && currentDeviceType === DeviceType.mobile)
      toggleArticleOpen();

    if (onBack) {
      onBack();
    } else if (navigate) {
      navigate("/");
    } else {
      window.location.href = "/";
    }
  };

  const isDesktop = currentDeviceType === DeviceType.desktop;
  const icon = isDesktop ? <ArrowIcon /> : <ArrowTabletIcon />;

  if (isLoading)
    return (
      <ArticleHeaderLoader
        height="18px"
        width="211px"
        showText={showText}
        className={styles.backButton}
      />
    );
  return (
    <div
      className={styles.backButton}
      data-show-article={showText ? "true" : "false"}
      data-arrow-type={isDesktop ? "desktop" : "tablet"}
      onClick={onClickBack}
    >
      <IconButton className={styles.arrowIcon} iconNode={icon} isClickable />
      {showText ? <Text truncate>{t("Back")}</Text> : null}
    </div>
  );
};

export default BackButton;
