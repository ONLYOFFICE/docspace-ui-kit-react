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
