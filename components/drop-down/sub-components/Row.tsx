import { memo } from "react";

import { DropDownItem } from "../../drop-down-item";

import type { RowProps } from "../DropDown.types";

const Row = memo(({ data, index, style }: RowProps) => {
  const { children, activedescendant, handleMouseMove } = data;

  const option = Array.isArray(children) ? children[index] : null;

  const optionStyle = option?.props?.style ?? {};

  const newStyle = { ...style, ...optionStyle };

  const onMouseMove = () => {
    handleMouseMove?.(index);
  };

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
      // An owner that tracks the highlight itself, such as ComboBox, sets the
      // flag on its options; the list's own index serves everyone else.
      isActiveDescendant={
        option?.props?.isActiveDescendant ?? activedescendant === index
      }
    />
  );
});

Row.displayName = "Row";

export { Row };
