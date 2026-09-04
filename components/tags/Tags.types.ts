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
