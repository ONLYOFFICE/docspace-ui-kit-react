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

import DeveloperReactSvg from "../../../assets/icons/16/catalog.developer.react.svg";
import ArrowReactSvg from "../../../assets/arrow.right.react.svg";

import { DeviceType } from "../../../enums";
import { openingNewTab } from "../../../utils/openingNewTab";
import { Text } from "../../text";
import { useCommonTranslation } from "../../../utils/i18n";

import styles from "../Article.module.scss";
import { ArticleDevToolsBarProps } from "../Article.types";

const ArticleDevToolsBar = ({
  withCustomSlot,
  showText,
  articleOpen,
  currentDeviceType,
  toggleArticleOpen,
  path,
  navigate,
}: ArticleDevToolsBarProps) => {
  const onClick = (e: React.MouseEvent) => {
    const pathDevTools = path ?? "/developer-tools";

    if (openingNewTab(pathDevTools, e)) return;

    if (navigate) navigate(pathDevTools);
    else window.location.href = pathDevTools;

    if (articleOpen && currentDeviceType === DeviceType.mobile)
      toggleArticleOpen();
  };

  const onMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 1) return;

    onClick(e);
  };

  const t = useCommonTranslation();

  return (
    <div
      className={classNames(styles.wrapper)}
      onClick={onClick}
      onMouseDown={onMouseDown}
      data-testid="dev-tools-bar"
      data-show-text={showText ? "true" : "false"}
      data-icon-only={showText ? "false" : "true"}
      data-with-custom-slot={withCustomSlot ? "true" : "false"}
      data-hide-profile-block={articleOpen ? "true" : "false"}
      title={showText ? undefined : t("DeveloperTools")}
    >
      <DeveloperReactSvg className="icon" />
      {showText ? (
        <>
          <Text fontWeight={600} fontSize="12px" className="label">
            {t("DeveloperTools")}
          </Text>
          <ArrowReactSvg className="arrow" />
        </>
      ) : null}
    </div>
  );
};

export default ArticleDevToolsBar;
