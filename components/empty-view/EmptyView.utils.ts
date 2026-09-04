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

export const isEmptyActionOption = (
  option: EmptyViewOptionsType[number],
): option is EmptyViewActionType => {
  return (
    typeof option === "object" && "type" in option && option.type === "action"
  );
};
