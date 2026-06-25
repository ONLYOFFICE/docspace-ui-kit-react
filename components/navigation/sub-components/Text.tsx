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
import { Badge } from "../../badge";

import styles from "../Navigation.module.scss";
import { TTextProps } from "../Navigation.types";

import ArrowIcon from "./ArrowIcon";
import Heading from "./Heading";
import ExpanderIcon from "./ExpanderIcon";

const Text = ({
  title,
  isOpen,
  isRootFolder,
  isRootFolderTitle,
  onClick,
  badgeLabel,
  className,
  titleTooltip,
  ...rest
}: TTextProps) => {
  return (
    <div
      className={`${className} ${styles.textContainer}`}
      onClick={onClick}
      data-root-folder={isRootFolder}
      data-root-folder-title={isRootFolderTitle}
      {...rest}
    >
      <Heading
        title={titleTooltip ?? title}
        truncate
        isRootFolderTitle={isRootFolderTitle}
      >
        {title}
      </Heading>
      {badgeLabel ? (
        <Badge
          className={`${styles.titleBlockBadge} ${isRootFolderTitle ? styles.rootFolderTitle : ""}`}
          label={badgeLabel}
          fontSize="9px"
          padding="2px 5px"
          fontWeight={700}
          borderRadius="50px"
          noHover
          isHovered={false}
        />
      ) : null}
      {isRootFolderTitle ? <ArrowIcon /> : null}
      {!isRootFolderTitle && !isRootFolder ? (
        <ExpanderIcon isRotated={isOpen} />
      ) : null}
    </div>
  );
};

export default React.memo(Text);
