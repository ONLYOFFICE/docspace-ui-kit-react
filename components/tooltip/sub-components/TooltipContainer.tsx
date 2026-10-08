import React, { forwardRef } from "react";
import { createTooltipWrapper } from "./createTooltipWrapper";

type TooltipContainerBaseProps = {
  as?: React.ElementType;
  children?: React.ReactNode;
  type?: string;
} & React.HTMLAttributes<HTMLElement>;

const TooltipContainerBase = forwardRef<HTMLElement, TooltipContainerBaseProps>(
  (props, ref) => {
    const { as: Element = "div", children, ...restProps } = props;
    return React.createElement(Element, { ...restProps, ref }, children);
  },
);

TooltipContainerBase.displayName = "TooltipContainerBase";

export const TooltipContainer = createTooltipWrapper(TooltipContainerBase);

TooltipContainer.displayName = "TooltipContainer";
