import { memo } from "react";

import { DropDownItem } from "../../drop-down-item";

import type { RowProps } from "../DropDown.types";

const Row = memo(({ data, index, style }: RowProps) => {
  const { children, activedescendant, handleMouseMove } = data;

  const option = Array.isArray(children) ? children[index] : null;

  const optionStyle = option?.props?.style ?? {};

  const newStyle = { ...style, ...optionStyle };

  return (
    <DropDownItem
      {...option?.props}
      style={newStyle}
      onMouseMove={() => {
        handleMouseMove?.(index);
      }}
      isActiveDescendant={activedescendant === index}
    />
  );
});

Row.displayName = "Row";

export { Row };
