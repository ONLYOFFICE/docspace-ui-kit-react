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

import type { TagType } from "../tag/Tag.types";

import {
  createTag,
  defaultTagMaxWidth,
  fixedTagWidth,
  paddingSize,
  thirdPartyTagWidth,
} from "./Tags.constants";

export const isTagType = (tag: TagType | string): tag is TagType => {
  return typeof tag === "object";
};

export const createMaxWidthTag = (
  tag: TagType | string,
  maxWidth: string,
): TagType => {
  if (isTagType(tag)) {
    return { ...tag, maxWidth };
  }
  return { label: tag, maxWidth };
};

const addTagWithWidth = (
  tag: TagType | string,
  percentWidth: string,
): TagType => {
  const width =
    isTagType(tag) && tag?.isThirdParty ? fixedTagWidth : percentWidth;
  return createMaxWidthTag(tag, width);
};

export const calculateRenderedTags = (
  tags: (TagType | string)[],
  columnCount: number,
  offsetWidth: number = 0,
  canShowCreate: boolean = false,
  withDropDownTags: boolean = false,
) => {
  const newTags: TagType[] = [];

  // Show all tags without collapsing when columnCount is 0
  if (columnCount === -1) {
    if (canShowCreate) {
      newTags.push(createTag);
    }

    tags.forEach((tag) => {
      newTags.push(createMaxWidthTag(tag, defaultTagMaxWidth));
    });

    return newTags;
  }

  const containerWidth = offsetWidth;
  const createTagCount = canShowCreate ? 1 : 0;

  const isSpecialCase =
    columnCount >= tags.length ||
    (tags.length === 2 &&
      isTagType(tags[0]) &&
      tags[0]?.isThirdParty &&
      isTagType(tags[1]) &&
      tags[1]?.isDefault);

  if (isSpecialCase) {
    const thirdPartyTagCount = tags.filter(
      (tag) => isTagType(tag) && tag?.isThirdParty,
    ).length;

    const simpleTagCount = tags.length - thirdPartyTagCount;

    const totalPaddingWidth = (simpleTagCount + createTagCount) * paddingSize;

    const totalWidthOfThirdPartyTags =
      (thirdPartyTagCount + createTagCount) * thirdPartyTagWidth +
      totalPaddingWidth;

    const currentTagMaxWidth =
      (containerWidth - totalWidthOfThirdPartyTags) / simpleTagCount;
    const maxWidthPercent = Math.floor(
      (currentTagMaxWidth / containerWidth) * 100,
    );

    tags.forEach((tag) => {
      newTags.push(addTagWithWidth(tag, `${maxWidthPercent}%`));
    });

    if (canShowCreate) {
      newTags.push(createTag);
    }
  } else {
    // Handle case where we need a dropdown
    const tagWithDropdown = {
      label: withDropDownTags ? "..." : `+${tags.length - columnCount}`,
      key: "selector",
      maxWidth: fixedTagWidth,
      isOptionTag: true,
      advancedOptions: withDropDownTags
        ? tags
            .slice(columnCount, tags.length)
            .map((tag) => (typeof tag === "string" ? tag : tag.label))
        : [],
    };

    const currentTagMaxWidth =
      (containerWidth - columnCount * paddingSize - thirdPartyTagWidth) /
      columnCount;
    const maxWidthPercent = Math.floor(
      (currentTagMaxWidth / containerWidth) * 100,
    );

    for (let i = 0; i < columnCount; i += 1) {
      newTags.push(addTagWithWidth(tags[i], `${maxWidthPercent}%`));
    }

    newTags.push(tagWithDropdown);
  }

  return newTags;
};
