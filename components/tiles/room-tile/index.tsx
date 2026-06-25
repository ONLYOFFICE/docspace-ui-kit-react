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

import React, { useCallback, useMemo, useRef, useState } from "react";

import { Tags } from "../../tags";
import classNames from "classnames";
import type { TagClickEvent, TagType } from "../../tag";
import { RoomTileProps, RoomItem } from "./RoomTile.types";
import { BaseTile } from "../base-tile";
import { TileItem } from "../tile-container/TileContainer.types";

import styles from "./RoomTile.module.scss";
import { useCommonTranslation } from "../../../utils";

export const RoomTile = ({
  item,
  checked,
  isActive,
  isEdit,
  children,
  columnCount,
  selectTag,
  selectOption,
  getRoomTypeName,
  thumbnailClick,
  badges,
  onSelect,
  customBottomContent,
  ...rest
}: RoomTileProps) => {
  const t = useCommonTranslation();
  const childrenArray = React.Children.toArray(children);
  const [RoomsTileContent] = childrenArray;

  const checkboxContainerRef = useRef<HTMLDivElement>(null);

  const [isHovered, setIsHovered] = useState(false);

  const hasTags = (item.tags?.length ?? 0) > 0;

  const onHover = useCallback(() => {
    setIsHovered(true);
  }, []);

  const onLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const onRoomClick = useCallback(
    (e: React.MouseEvent) => {
      if (
        !e.target ||
        !(e.target instanceof Element) ||
        (!e.target.closest(".checkbox") &&
          !e.target.closest(".tags") &&
          !e.target.closest(".advanced-tag") &&
          !e.target.closest(".badges") &&
          !e.target.closest("#modal-dialog") &&
          !checkboxContainerRef.current?.contains(e.target as Node) &&
          !e.target.closest(".expandButton") &&
          !e.target.closest(".p-contextmenu"))
      ) {
        thumbnailClick?.(e);
      }
    },
    [thumbnailClick, checkboxContainerRef],
  );

  const tags = useMemo(() => {
    const tempTags: Array<TagType | string> = [];

    if (item.providerType) {
      tempTags.push({
        isThirdParty: true,
        icon: item.thirdPartyIcon,
        label: item.providerKey || item.providerType,
        roomType: Number(item.roomType),
        providerType: Number(item.providerType),
        onClick: () =>
          selectOption({
            option: "typeProvider",
            value: item.providerType as string,
          }),
      });
    }

    if (item.tags && item.tags.length > 0) {
      tempTags.push(...item.tags);
    } else if (item.isAIAgent) {
      tempTags.push({
        isDefault: true,
        label: t("NoTags") ?? "",
      });
    } else {
      tempTags.push({
        isDefault: true,
        label: getRoomTypeName(item.roomType, t),
        roomType: Number(item.roomType),
        onClick: () =>
          selectOption({
            option: "defaultTypeRoom",
            value: item.roomType,
          }),
      });
    }

    return tempTags;
  }, [item, selectOption, getRoomTypeName, t]);

  const topContent = (
    <>
      {RoomsTileContent}
      <div className="tile-badges">{badges}</div>
    </>
  );

  const handleTagSelect = useCallback(
    (tag: TagClickEvent) => {
      if (item.isAIAgent && !hasTags) return;

      if ("label" in tag && "roomType" in tag) {
        selectTag(tag);
      }
    },
    [item.isAIAgent, hasTags, selectTag],
  );

  const bottomContent = customBottomContent ? (
    customBottomContent(isHovered, tags)
  ) : (
    <Tags
      columnCount={columnCount}
      onSelectTag={handleTagSelect}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      tags={tags}
      className="room-tags"
    />
  );

  const handleSelect = useCallback(
    (isChecked: boolean, tileItem: TileItem) => {
      onSelect?.(isChecked, tileItem as RoomItem);
    },
    [onSelect],
  );

  const onSelectTileItem = onSelect ? handleSelect : undefined;

  const roomTileClassName = useMemo(
    () =>
      classNames(styles.roomTile, {
        [styles.checked]: checked,
        [styles.isActive]: isActive,
        [styles.isEdit]: isEdit,
      }),
    [checked, isActive, isEdit],
  );

  return (
    <BaseTile
      {...rest}
      checked={checked}
      isActive={isActive}
      isEdit={isEdit}
      item={item}
      onSelect={onSelectTileItem}
      onHover={onHover}
      onLeave={onLeave}
      topContent={topContent}
      bottomContent={bottomContent}
      className={roomTileClassName}
      checkboxContainerRef={checkboxContainerRef}
      onRoomClick={onRoomClick}
    />
  );
};
