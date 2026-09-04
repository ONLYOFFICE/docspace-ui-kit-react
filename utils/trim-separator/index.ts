import type { ContextMenuModel } from "../../components/context-menu";

const DESTRUCTIVE_ACTIONS = [
  "delete",
  "remove-from-recent",
  "remove-shared-folder-or-file",
  "remove-shared-room",
  "unsubscribe",
];

export function trimSeparator(array: ContextMenuModel[]) {
  if (!array || !Array.isArray(array) || array.length === 0) return array;

  const { length } = array;
  const result: ContextMenuModel[] = [];

  for (let index = 0; index < length; index += 1) {
    const el = array[index];

    if (el?.isSeparator && result.length > 0) {
      if (!result[result.length - 1]?.isSeparator) result.push(el);
    } else if (!el?.isSeparator && !el?.disabled) {
      result.push(el);
    }
  }

  // If there are few elements, remove all separators and leave only between the destructive group

  const nonSeparatorItems = result.filter((item) => !item?.isSeparator);

  if (nonSeparatorItems.length < 6) {
    const filteredResult: ContextMenuModel[] = [];

    for (let i = 0; i < result.length; i++) {
      const item = result[i];

      if (item?.isSeparator) {
        const nextItem = result[i + 1];
        if (
          nextItem &&
          DESTRUCTIVE_ACTIONS.includes(nextItem.key?.toString() || "")
        ) {
          filteredResult.push(item);
        }
      } else {
        filteredResult.push(item);
      }
    }

    if (filteredResult[filteredResult.length - 1]?.isSeparator) {
      filteredResult.pop();
    }

    return filteredResult;
  }

  if (result[result.length - 1]?.isSeparator) result.pop();

  return result;
}
