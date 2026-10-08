import type React from "react";

import type { To } from "../../types";
import type {
  EmptyViewActionType,
  EmptyViewButtonType,
  EmptyViewLinkType,
  EmptyViewOptionsType,
  EmptyViewSeparatorType,
} from "./EmptyView.types";

export const isEmptyLinkOptions = (
  options: EmptyViewOptionsType[number],
): options is EmptyViewLinkType => {
  return typeof options === "object" && "to" in options;
};

export const isEmptyButtonOption = (
  option: EmptyViewOptionsType[number],
): option is EmptyViewButtonType => {
  return (
    typeof option === "object" && "type" in option && option.type === "button"
  );
};

export const isEmptySeparatorOption = (
  option: EmptyViewOptionsType[number],
): option is EmptyViewSeparatorType => {
  return (
    typeof option === "object" &&
    "type" in option &&
    option.type === "separator"
  );
};

/** Turns a route target into the `href` of a plain anchor. */
export const toHref = (to: To): string => {
  if (typeof to === "string") return to;
  const { pathname = "", search = "", hash = "" } = to;
  return `${pathname}${search}${hash}`;
};

/** A plain primary-button click, which a handler may take over. A modified or
 * middle click is left to the browser, so "open in a new tab" keeps working. */
export const isPlainClick = (event: React.MouseEvent): boolean =>
  event.button === 0 &&
  !event.metaKey &&
  !event.ctrlKey &&
  !event.shiftKey &&
  !event.altKey;

/** Enter or Space, the keys that activate a native button. */
export const isActivationKey = (event: React.KeyboardEvent): boolean =>
  event.key === "Enter" || event.key === " " || event.key === "Spacebar";

export const isEmptyActionOption = (
  option: EmptyViewOptionsType[number],
): option is EmptyViewActionType => {
  return (
    typeof option === "object" && "type" in option && option.type === "action"
  );
};
