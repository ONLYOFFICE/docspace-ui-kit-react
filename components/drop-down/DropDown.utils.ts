import React from "react";

import { isTablet } from "../../utils";

const getItemHeight = (item: React.ReactElement) => {
  const isTabletDevice = isTablet();

  const height = (item?.props as { height?: number }).height ?? 32;
  const heightTablet =
    (item?.props as { heightTablet?: number }).heightTablet ?? 36;

  if (item && (item.props as { isSeparator: boolean }).isSeparator) {
    return isTabletDevice ? 16 : 12;
  }

  return isTabletDevice ? heightTablet : height;
};

const hideDisabledItems = (children: React.ReactNode) => {
  if (React.Children.count(children) > 0) {
    const enabledChildren = React.Children.map(children, (child) => {
      const props =
        child &&
        React.isValidElement(child) &&
        (child.props as { disabled?: boolean });
      if (props && !props?.disabled) return child;
    });

    const sizeEnabledChildren = enabledChildren?.length;

    const cleanChildren = React.Children.map(
      enabledChildren,
      (child, index) => {
        const props =
          child &&
          React.isValidElement(child) &&
          (child.props as { isSeparator?: boolean });
        if (props && !props?.isSeparator) return child;
        if (
          index !== 0 &&
          sizeEnabledChildren &&
          index !== sizeEnabledChildren - 1
        )
          return child;
      },
    );

    return cleanChildren;
  }
};

export { getItemHeight, hideDisabledItems };
