import type { RefObject } from "react";
import type { TagClickEvent, TagProps, TagType } from "../tag/Tag.types";

export type TagsProps = {
  /** Applied to the outermost element. */
  id?: string;
  /** Tags to lay out. A bare string is treated as `{ label }`. */
  tags: Array<TagType | string>;
  /** Applied to the outermost element. */
  className?: string;
  /** How many tags are drawn before the rest collapse into one overflow tag. `-1` draws all of them. */
  columnCount: number;
  /** Applied to the outermost element as inline style. */
  style?: React.CSSProperties;
  /** Called with `{ label, roomType, providerType }` when a tag, or an entry of the overflow drop-down, is clicked or activated with Enter or Space. A tag with its own `TagType.onClick` calls that instead. */
  onSelectTag: (tag: TagClickEvent) => void;
  /** Called when the pointer enters any tag. It is not told which one. */
  onMouseEnter?: VoidFunction;
  /** Called when the pointer leaves any tag. */
  onMouseLeave?: VoidFunction;
  /** Ref to the overflow tag, for a menu of your own anchored to it. When there is no overflow tag it points at the create tag. */
  optionTagRef?: RefObject<HTMLDivElement | null>;
  /** Called when the overflow tag or the create tag is clicked. Passing it replaces the built-in drop-down. */
  onOptionTagClick?: VoidFunction;
  /** Whether a plus tag is drawn for creating a new one. It comes after the overflow tag when the tags overflow. */
  showCreateTag?: boolean;
  /** Passed to the overflow drop-down, where it removes the leading margin of each entry. */
  removeTagIcon?: boolean;
  /** Accessible name of the row, which is a `role="group"`. */
  ariaLabel?: string;
  /** Accessible name and `title` of the plus tag drawn by `showCreateTag`. Defaults to the translated "Add". */
  createTagLabel?: string;
};

/** Props for the dropdown tags component */
export interface DropDownTagsProps extends TagProps {
  /** Determines whether to show a remove icon for the tag */
  removeTagIcon: boolean;
  /** Array of advanced dropdown options */
  advancedOptions: string[];
}
