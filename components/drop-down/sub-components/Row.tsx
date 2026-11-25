import { cloneElement, memo } from "react";

import { DropDownItem } from "../../drop-down-item";
import { hasDropDownItemMark } from "../../../utils/drop-down-item-mark";

import type { RowProps } from "../DropDown.types";

const Row = memo(({ data, index, style }: RowProps) => {
  const { children, activedescendant, handleMouseMove } = data;

  const option = Array.isArray(children) ? children[index] : null;

  const optionStyle = option?.props?.style ?? {};

  const newStyle = { ...style, ...optionStyle };

  const onMouseMove = () => {
    handleMouseMove?.(index);
  };

  // An owner that tracks the highlight itself, such as ComboBox, sets the
  // flag on its options; the list's own index serves everyone else.
  const isActiveDescendant =
    option?.props?.isActiveDescendant ?? activedescendant === index;

  // A wrapper marked with markAsDropDownItem renders a DropDownItem from its
  // props, so it is a row of the list: it gets the highlight the keyboard
  // moves, and keeps what it adds, such as its labels.
  if (option && hasDropDownItemMark(option.type)) {
    return cloneElement(option, {
      style: newStyle,
      onMouseMove,
      isActiveDescendant,
    });
  }

  // A child of another kind keeps its own markup; the list only positions it.
  if (option && option.type !== DropDownItem) {
    return (
      <div style={newStyle} onMouseMove={onMouseMove}>
        {option}
      </div>
    );
  }

  return (
    <DropDownItem
      {...option?.props}
      style={newStyle}
      onMouseMove={onMouseMove}
      isActiveDescendant={isActiveDescendant}
    />
  );
});

Row.displayName = "Row";

export { Row };
