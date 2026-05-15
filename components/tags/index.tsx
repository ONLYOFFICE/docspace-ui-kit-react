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

import isNil from "lodash/isNil";
import classNames from "classnames";
import React, { FC, useCallback } from "react";

import { useUnmount } from "../../hooks/useUnmount";
import { Tag, type TagType } from "../tag";

import styles from "./Tags.module.scss";
import { TagsDropdown } from "./Tags.dropdown";
import { calculateRenderedTags } from "./Tags.utils";
import type { TagsProps } from "./Tags.types";

const Tags: FC<TagsProps> = ({
  id,
  tags,
  style,
  className,
  columnCount,
  removeTagIcon = false,
  onSelectTag,
  onMouseEnter,
  onMouseLeave,
  showCreateTag,
  onOptionTagClick,
  optionTagRef,
}) => {
  const [renderedTags, setRenderedTags] = React.useState<TagType[]>([]);
  const callBackRef = React.useRef<VoidFunction | undefined | null>(null);

  const tagsRef = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    if (isNil(columnCount) || !tags || !tagsRef.current) return;

    const withDropDownTags = !onOptionTagClick;

    const newTags = calculateRenderedTags(
      tags,
      columnCount,
      tagsRef.current.offsetWidth,
      showCreateTag,
      withDropDownTags,
    );

    setRenderedTags(newTags);
  }, [tags, columnCount, showCreateTag]);

  useUnmount(() => callBackRef.current?.());

  const handleOptionTagClick = useCallback(() => {
    onOptionTagClick?.();
  }, [onOptionTagClick]);

  return (
    <div
      id={id}
      style={style}
      ref={tagsRef}
      data-testid="tags"
      aria-label="Tags container"
      className={classNames(styles.tags, className)}
    >
      {renderedTags.map((tag, idx) => {
        if (tag.isOptionTag && tag.advancedOptions?.length) {
          return (
            <TagsDropdown
              key={tag.key}
              tag={tag.label}
              icon={tag.icon}
              tagMaxWidth={tag.maxWidth}
              providerType={tag.providerType}
              isLast={idx === renderedTags.length - 1}
              label={tag.label}
              roomType={tag.roomType}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
              advancedOptions={tag.advancedOptions}
              onClick={onSelectTag}
              removeTagIcon={removeTagIcon}
              withLabel={!tag.isThirdParty}
            />
          );
        }

        const props = tag.isOptionTag
          ? {
              ref: optionTagRef,
              onClick: handleOptionTagClick,
            }
          : {
              onClick: onSelectTag,
            };

        return (
          <Tag
            key={tag.label}
            tag={tag.label}
            icon={tag.icon}
            withLabel={!tag.isThirdParty}
            tagMaxWidth={tag.maxWidth}
            providerType={tag.providerType}
            isLast={idx === renderedTags.length - 1}
            label={tag.label}
            roomType={tag.roomType}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            dataTestId={`tag_item_${tag.label}`}
            {...props}
          />
        );
      })}
    </div>
  );
};

export { Tags };
