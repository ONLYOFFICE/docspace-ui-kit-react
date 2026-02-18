// (c) Copyright Ascensio System SIA 2009-2026
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

import type { RefObject } from "react";
import type { TagClickEvent, TagProps, TagType } from "../tag/Tag.types";

export type TagsProps = {
  /** Accepts id */
  id?: string;
  /** Accepts the tags */
  tags: Array<TagType | string>;
  /** Accepts class */
  className?: string;
  /** Accepts the tag column count */
  columnCount: number;
  /** Accepts css style */
  style?: React.CSSProperties;
  /** Accepts the function that is called when the tag is selected */
  onSelectTag: (tag: TagClickEvent) => void;
  /** Mouse enter event handler */
  onMouseEnter?: VoidFunction;
  /** Mouse leave event handler */
  onMouseLeave?: VoidFunction;
  /** Reference to the option tag element */
  optionTagRef?: RefObject<HTMLDivElement | null>;
  /** Callback function that is called when the option tag is clicked */
  onOptionTagClick?: VoidFunction;
  /** Controls visibility of the create tag button */
  showCreateTag?: boolean;
  /** Determines whether to show a remove icon for the tag */
  removeTagIcon?: boolean;
};

/** Props for the dropdown tags component */
export interface DropDownTagsProps extends TagProps {
  /** Determines whether to show a remove icon for the tag */
  removeTagIcon: boolean;
  /** Array of advanced dropdown options */
  advancedOptions: string[];
}
