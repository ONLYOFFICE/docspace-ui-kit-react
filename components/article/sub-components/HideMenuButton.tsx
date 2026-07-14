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

import ArticleHideMenuReactSvg from "../../../assets/article-hide-menu.react.svg";
import ArticleShowMenuReactSvg from "../../../assets/article-show-menu.react.svg";

import { Text } from "../../text";
import { useCommonTranslation } from "../../../utils/i18n";

import styles from "../Article.module.scss";
import { ArticleHideMenuButtonProps } from "../Article.types";

const HideArticleMenuButton = ({
  showText,
  hideProfileBlock,
  toggleShowText,
  withCustomSlot,
}: ArticleHideMenuButtonProps) => {
  const t = useCommonTranslation();

  return (
    <div
      className={styles.hideArticleMenuButton}
      onClick={toggleShowText}
      data-show-text={showText ? "true" : "false"}
      data-with-custom-slot={withCustomSlot ? "true" : "false"}
      data-hide-profile-block={hideProfileBlock ? "true" : "false"}
    >
      {showText ? (
        <div className="article-hide-menu-container">
          <ArticleHideMenuReactSvg className="article-hide-menu-icon_svg" />
          <Text
            className="article-hide-menu-text"
            fontWeight={600}
            fontSize="15px"
            lineHeight="16px"
            noSelect
            truncate
          >
            {t("HideArticleMenu")}
          </Text>
        </div>
      ) : (
        <div
          className="article-show-menu-container"
          id="document_catalog-show-menu"
        >
          <ArticleShowMenuReactSvg className="article-show-menu-icon_svg" />
        </div>
      )}
    </div>
  );
};

export default HideArticleMenuButton;
