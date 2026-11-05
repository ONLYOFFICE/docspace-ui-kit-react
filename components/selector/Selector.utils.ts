import type { TSelectorItem } from "./Selector.types";

/**
 * Whether the list draws its "create new" row: only beside other rows, as
 * the row alone (or with the new-name field only) renders nothing. Item uses
 * it to draw the row and Body to let the keyboard reach it, so the two agree.
 */
export const isCreateNewItemShown = (items: TSelectorItem[]) =>
  items.length > 2 || (items.length === 2 && !items[1]?.isInputItem);
