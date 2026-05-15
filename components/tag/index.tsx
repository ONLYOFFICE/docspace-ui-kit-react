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

import React, { FC } from "react";
import { ReactSVG } from "react-svg";
import { match, P } from "ts-pattern";
import classNames from "classnames";

import CrossIconReactSvgUrl from "../../assets/icons/12/cross.react.svg";

import { Text } from "../text";
import { IconButton } from "../icon-button";
import { TooltipContainer } from "../tooltip";

import type { TagProps, TagType, TagClickEvent } from "./Tag.types";
import styles from "./Tag.module.scss";

const TagPure: FC<TagProps> = ({
  ref,
  tag,
  label,
  isNewTag = false,
  isDisabled,
  isDeleted,
  isLast,
  onDelete,
  onClick,
  tagMaxWidth,
  id,
  className,
  style,
  icon,
  roomType,
  providerType,
  dataTestId,
  onMouseEnter,
  onMouseLeave,
  iconClassName,
  withLabel = true,
}) => {
  const onClickAction = React.useCallback(() => {
    if (onClick && !isDisabled && !isDeleted) {
      onClick({ roomType, label: label ?? tag, providerType });
    }
  }, [onClick, isDisabled, isDeleted, roomType, providerType, label, tag]);

  const onDeleteAction = React.useCallback(() => {
    onDelete?.(tag);
  }, [onDelete, tag]);

  return (
    <TooltipContainer
      as="div"
      id={id}
      ref={ref}
      title={label}
      onClick={onClickAction}
      className={classNames(styles.tag, "tag", className, {
        [styles.isNewTag]: isNewTag,
        [styles.isDisabled]: isDisabled,
        [styles.isDeleted]: isDeleted,
        [styles.isClickable]: !!onClick,
        [styles.isLast]: isLast,
        [styles.thirdPartyTag]: icon,
      })}
      style={{ ...style, maxWidth: tagMaxWidth }}
      aria-label={label}
      aria-disabled={isDisabled}
      data-testid={dataTestId ?? "tag_item"}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {match(icon)
        .with(P.string, (icon) => (
          <ReactSVG
            className={classNames(styles.thirdPartyTag, iconClassName)}
            src={icon}
          />
        ))
        .with(P.nonNullable, (Icon) => (
          <IconButton
            className={classNames(
              styles.thirdPartyTag,
              styles.icon,
              iconClassName,
            )}
            iconNode={<Icon />}
            size={12}
          />
        ))
        .otherwise(() => null)}
      {withLabel ? (
        <Text title={label} fontSize="13px" noSelect truncate>
          {label}
        </Text>
      ) : null}
      {isNewTag && !!onDelete ? (
        <IconButton
          className={styles.tagIcon}
          iconNode={<CrossIconReactSvgUrl />}
          size={12}
          onClick={onDeleteAction}
        />
      ) : null}
    </TooltipContainer>
  );
};

TagPure.displayName = "TagPure";

const Tag = React.memo(TagPure);

export { Tag, TagProps, TagType, type TagClickEvent };
