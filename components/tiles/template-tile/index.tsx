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
import { Text } from "../../text";
import { Link } from "../../link";
import { TemplateTileProps, TemplateItem } from "./TemplateTile.types";
import { TileItem } from "../tile-container/TileContainer.types";
import { BaseTile } from "../base-tile";
import styles from "./TemplateTile.module.scss";
import { useCommonTranslation } from "../../../utils/i18n";

const isTemplateItem = (item: TileItem): item is TemplateItem => {
  return "title" in item && typeof item.title === "string";
};

export const TemplateTile = ({
  item,
  children,
  showStorageInfo,
  openUser,
  badges,
  SpaceQuotaComponent,
  onSelect,
  ...rest
}: TemplateTileProps) => {
  const t = useCommonTranslation();
  const childrenArray = React.Children.toArray(children);
  const [TileContent] = childrenArray;

  const handleSelect = onSelect
    ? (checked: boolean, baseItem: TileItem) => {
        if (isTemplateItem(baseItem)) {
          onSelect(checked, baseItem);
        }
      }
    : undefined;

  const topContent = (
    <>
      {TileContent}
      {badges}
    </>
  );

  const bottomContent = (
    <div className={styles.wrapper}>
      <div className={styles.field}>
        <Text truncate fontSize="13px" fontWeight={400} className={styles.text}>
          {t("Owner")}
        </Text>
        {showStorageInfo ? (
          <Text
            truncate
            fontSize="13px"
            fontWeight={400}
            className={styles.text}
          >
            {t("Storage")}
          </Text>
        ) : null}
      </div>
      <div className={styles.field}>
        {item.createdBy ? (
          <div>
            <Link
              isHovered
              truncate
              fontSize="13px"
              fontWeight={600}
              className={styles.text}
              onClick={openUser}
            >
              {item.createdBy.displayName}
            </Link>
          </div>
        ) : null}
        {showStorageInfo && SpaceQuotaComponent ? (
          <SpaceQuotaComponent
            className={styles.spaceQuota}
            item={item}
            type="room"
            isReadOnly={!item?.security?.EditRoom}
          />
        ) : null}
      </div>
    </div>
  );

  return (
    <BaseTile
      {...rest}
      item={item}
      onSelect={handleSelect}
      topContent={topContent}
      bottomContent={bottomContent}
      className={styles.templateTile}
    />
  );
};
