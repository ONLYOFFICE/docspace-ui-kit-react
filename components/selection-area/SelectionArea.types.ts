import type { TViewAs } from "../../types";

export type TOnMove = {
  /** Every element the rectangle covers now: the whole set, not a delta. */
  added: Element[];
  /** Every element it does not cover now. */
  removed: Element[];
  /**
   * Set on the one call made when a drag passes 10px, with both lists empty.
   * It is the cue to drop whatever an earlier drag selected.
   */
  clear?: boolean;
};

export type TArrayTypes = {
  /** The group name, matched against the first `_`-separated part of an item's `value` attribute. */
  type: string;
  /** Vertical gap between rows of this group, in pixels. */
  rowGap?: number;
  /** How many tile slots this group leaves empty at the end of its last row. */
  countOfMissingTiles?: number;
  /** How many rows this group occupies. */
  rowCount?: number;
};

export type SelectionAreaProps = {
  /** Class of the element the rectangle stays inside. When nothing carries it, the whole page is used. */
  containerClass: string;
  /** Class every selectable item carries, together with a `value` attribute shaped `group_…_index`. */
  selectableClass: string;
  /**
   * Called once with `clear: true` when a drag passes 10px. Then it is called
   * after each pointer move or scroll, with the full covered and uncovered sets.
   */
  onMove?: ({ added, removed, clear }: TOnMove) => void;
  /**
   * Class of the scrolling element. When it scrolls, the rectangle's starting
   * corner moves with the content. Without a match the page's scroller is used.
   */
  scrollClass: string;
  /** `"tile"` places items on a grid of columns and rows; any other value treats them as one column. */
  viewAs: TViewAs;
  /** Class of the element the items sit in. Its corner, read when a drag starts, is where the first item is taken to be. */
  itemsContainerClass: string;
  /** In tile view, leaves `folderHeaderHeight` out of the grid's top edge. */
  isRooms?: boolean;
  /**
   * Height in pixels of a header above the tiles, added to the grid's top edge
   * unless `isRooms` is set. Without it no tile is ever covered.
   */
  folderHeaderHeight?: number;
  /**
   * One entry per group of items, in display order. Tile view reads each
   * group's row gap, row count and empty slots from it; a missing entry counts as zero.
   */
  arrayTypes?: TArrayTypes[];
  /** In row view, the class of the child inside each item that carries the `value` attribute. */
  itemClass: string;
  /** How many tiles fit in one row in tile view. Without it no tile is ever covered. */
  countTilesInRow?: number;
  /** Height in pixels of one group heading in tile view, counted once for every group above an item's group. */
  defaultHeaderHeight?: number;
  /**
   * Called on every mouse-down anywhere in the document. It fires before the
   * button and the target are checked, so also for presses that start no selection.
   */
  onMouseDown?: (event: MouseEvent) => void;
  /** CSS selector of the region a drag may start in. A mouse-down outside it is ignored. */
  startAreaSelector?: string;
};
