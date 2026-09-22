import type { TViewAs } from "../../types";

export type TOnMove = {
  /** Every element the rectangle currently covers — the whole set, recomputed each frame, not a delta. */
  added: Element[];
  /** Every element it currently does not cover. */
  removed: Element[];
  /** Never set. The one call that would pass it is behind a condition that is always false. */
  clear?: boolean;
};

export type TArrayTypes = {
  /** The group name, matched against the first `_`-separated part of an item's `value` attribute. */
  type: string;
  /** Vertical gap between rows of this group, in pixels. */
  rowGap?: number;
  /** Height of one item of this group, in pixels. */
  itemHeight: number;
  /** How many tile slots this group leaves empty at the end of its last row. */
  countOfMissingTiles?: number;
  /** How many rows this group occupies. */
  rowCount?: number;
};

export type SelectionAreaProps = {
  /** Class of the element the rectangle is clamped to. When nothing matches it, the `<html>` element is used. Required. */
  containerClass: string;
  /** Class every selectable element carries. Each one must also have a `value` attribute shaped `type_…_index`, which is how the component works out where it sits. Required. */
  selectableClass: string;
  /** Called on every animation frame of a drag with the full covered and uncovered sets. */
  onMove?: ({ added, removed, clear }: TOnMove) => void;
  /** Class of the scrolling element. The component listens to its `scroll` and shifts the rectangle to match; without a match it falls back to the document. Required. */
  scrollClass: string;
  /** `"tile"` switches to the grid arithmetic — columns, row gaps and missing tiles; anything else is treated as a single column. Required. */
  viewAs: TViewAs;
  /** Class of the element the items sit in. It is measured once, at the start of each drag, to place the grid's origin. Required. */
  itemsContainerClass: string;
  /** In tile view, skips adding `folderHeaderHeight` to the grid's origin. */
  isRooms?: boolean;
  /** Height in pixels of the header above the tiles, added to the grid's origin unless `isRooms` is set. It is asserted to exist in tile view. */
  folderHeaderHeight?: number;
  /** One entry per group of items, in the order they appear. Tile arithmetic needs it; without it every gap and row count is taken as zero. */
  arrayTypes?: TArrayTypes[];
  /** In row view, the class of the descendant that carries the `value` attribute. Required. */
  itemClass: string;
  /** How many tiles fit in a row. It is asserted to exist in tile view, where a missing value makes every position `NaN`. */
  countTilesInRow?: number;
  /** Height in pixels of one group heading, multiplied by the number of headings above a group. */
  defaultHeaderHeight?: number;
  /** Called on every mouse-down on the document, before the button and the target are checked — so it fires for the right button and for clicks that start no selection. */
  onMouseDown?: (event: MouseEvent) => void;
};
