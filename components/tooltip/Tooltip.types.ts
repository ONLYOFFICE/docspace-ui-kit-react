import type { ITooltip, TooltipRefProps } from "react-tooltip";

export type TTooltipPlace =
  | "top"
  | "top-start"
  | "top-end"
  | "right"
  | "right-start"
  | "right-end"
  | "bottom"
  | "bottom-start"
  | "bottom-end"
  | "left"
  | "left-start"
  | "left-end";

export type TFallbackAxisSideDirection = "none" | "start" | "end";

export type TGetTooltipContent = {
  content: string | null;
  activeAnchor: HTMLElement | null;
};

export type TooltipProps = Pick<
  ITooltip,
  | "id"
  | "place"
  | "afterHide"
  | "afterShow"
  | "offset"
  | "children"
  | "isOpen"
  | "clickable"
  | "openOnClick"
  | "float"
  | "anchorSelect"
  | "noArrow"
  | "opacity"
  | "imperativeModeOnly"
  | "delayShow"
> & {
  /** Sets a callback function that generates the tip content dynamically */
  getContent?: ({
    content,
    activeAnchor,
  }: TGetTooltipContent) => React.ReactNode | string;
  /** Accepts class */
  className?: string;
  /** Accepts css style */
  style?: React.CSSProperties;
  /** Background color of the tooltip  */
  color?: string;
  /** Maximum width of the tooltip */
  maxWidth?: string;
  /** Whether to allow fallback to the perpendicular axis of the preferred placement */
  fallbackAxisSideDirection?: TFallbackAxisSideDirection;
  noUserSelect?: boolean;
  ref?: React.RefObject<TooltipRefProps | null>;
  dataTestId?: string;
  zIndex?: number;
  tooltipStyle?: React.CSSProperties;
};

export type MouseEventHandler = (e: React.MouseEvent<HTMLElement>) => void;

export type TooltipHandlers = {
  anchorId: string;
  handleMouseEnter: MouseEventHandler;
  handleMouseLeave: MouseEventHandler;
  handleClick: MouseEventHandler;
};

export interface WithTooltipProps {
  /** Tooltip text. Consumed by the wrapper, so it never reaches the DOM as a
   * `title` attribute. `tooltipContent` takes precedence over it. */
  title?: string;
  /** Tooltip content, used instead of `title` when both are set. Only a string
   * produces a tooltip: the wrapper needs text for the anchor, so any other
   * node leaves the element with no tooltip at all. */
  tooltipContent?: React.ReactNode;
  /** Ignored. Nothing reads this prop; the tooltip's placement comes from the
   * `Tooltip` the anchor resolves to. */
  tooltipPlace?: TTooltipPlace;
  /** Ignored. Nothing reads this prop. */
  tooltipFitToContent?: boolean;
}

export type OmitTooltipProps<T> = Omit<
  T,
  "title" | "tooltipContent" | "tooltipPlace" | "tooltipFitToContent"
>;

const tooltipPropsToOmit = new Set([
  "title",
  "tooltipContent",
  "tooltipPlace",
  "tooltipFitToContent",
]);

export function omitTooltipProps<T extends Record<string, unknown>>(
  props: T & Partial<WithTooltipProps>,
): OmitTooltipProps<T> {
  return Object.fromEntries(
    Object.entries(props).filter(([key]) => !tooltipPropsToOmit.has(key)),
  ) as OmitTooltipProps<T>;
}

export type ComponentProps = OmitTooltipProps<
  React.HTMLAttributes<HTMLElement> & {
    onClick?: MouseEventHandler;
    onMouseEnter?: MouseEventHandler;
    onMouseLeave?: MouseEventHandler;
  }
>;
