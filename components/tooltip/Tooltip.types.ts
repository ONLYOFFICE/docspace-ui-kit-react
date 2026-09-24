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

export type TooltipProps = {
  /**
   * Identifier the anchors point at with `data-tooltip-id`. Without it the
   * tooltip has nothing to attach to, unless `anchorSelect` names the anchors
   * instead.
   */
  id?: ITooltip["id"];
  /**
   * Preferred side of the anchor. It is only a preference: the tooltip flips
   * and shifts to stay in the viewport.
   * @default "top"
   */
  place?: ITooltip["place"];
  /** Called after the tooltip has been hidden. */
  afterHide?: ITooltip["afterHide"];
  /** Called after the tooltip has been shown. */
  afterShow?: ITooltip["afterShow"];
  /** Distance between the anchor and the tooltip, in pixels.
   * @default 4 */
  offset?: ITooltip["offset"];
  /**
   * Fixed content, used for every anchor that has no `data-tooltip-content` of
   * its own. `getContent` wins over it.
   */
  children?: ITooltip["children"];
  /**
   * Forces the tooltip open or closed. Passing it makes the tooltip
   * controlled — the hover and click handlers no longer open or close it on
   * their own.
   */
  isOpen?: ITooltip["isOpen"];
  /** Keeps the tooltip open while the pointer is over it, so links inside it can be reached. */
  clickable?: ITooltip["clickable"];
  /**
   * Opens on click instead of on hover, and closes on the next click. It
   * replaces the hover behaviour rather than adding to it.
   */
  openOnClick?: ITooltip["openOnClick"];
  /** Follows the pointer instead of sitting at a fixed side of the anchor. */
  float?: ITooltip["float"];
  /**
   * CSS selector for the anchors, as an alternative to `data-tooltip-id`. It is
   * matched against the whole document, not a subtree.
   */
  anchorSelect?: ITooltip["anchorSelect"];
  /** Whether the arrow pointing at the anchor is hidden.
   * @default true */
  noArrow?: ITooltip["noArrow"];
  /** Opacity of the tooltip. The library's own default is 0.9.
   * @default 1 */
  opacity?: ITooltip["opacity"];
  /**
   * Stops the tooltip reacting to anchors at all, leaving `ref.current.open()`
   * and `close()` as the only way to show it.
   */
  imperativeModeOnly?: ITooltip["imperativeModeOnly"];
  /** Delay before the tooltip appears, in milliseconds. */
  delayShow?: ITooltip["delayShow"];
  /** Sets a callback function that generates the tip content dynamically */
  getContent?: ({
    content,
    activeAnchor,
  }: TGetTooltipContent) => React.ReactNode | string;
  /** Applied to the wrapper around the tooltip, not to the tooltip itself. */
  className?: string;
  /** Applied to that same wrapper. Use `tooltipStyle` for the tooltip. */
  style?: React.CSSProperties;
  /**
   * Background colour, written as `--tooltip-bg-color` on the wrapper by an
   * effect. It is only ever set: clearing the prop leaves the last colour in
   * place.
   */
  color?: string;
  /** Maximum width as a CSS length. The default is 320px.  */
  maxWidth?: string;
  /** Whether to allow fallback to the perpendicular axis of the preferred placement */
  fallbackAxisSideDirection?: TFallbackAxisSideDirection;
  /** Stops the tooltip's text being selected. */
  noUserSelect?: boolean;
  /** Imperative handle with `open()` and `close()`, from react-tooltip. */
  ref?: React.RefObject<TooltipRefProps | null>;
  /** Value of `data-testid` on the wrapper.
   * @default "tooltip" */
  dataTestId?: string;
  /**
   * Stacking order of the wrapper. Setting it also makes the wrapper
   * `position: relative`.
   */
  zIndex?: number;
  /** Applied to the tooltip itself, unlike `style`. */
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
