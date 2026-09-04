import type { ComponentType } from "react";
import { createTooltipWrapper } from "./createTooltipWrapper";

export function withTooltip<T extends object>(
  WrappedComponent: ComponentType<T>,
) {
  return createTooltipWrapper(WrappedComponent);
}
