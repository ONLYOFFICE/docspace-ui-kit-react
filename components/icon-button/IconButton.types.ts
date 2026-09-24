import type { IconSizeType as IconSize } from "../../utils/common-icons-style";
import type { InputSize } from "../text-input";
export type { IconSize };

export type IconButtonProps = {
  /** Sets component class */
  className?: string;
  /** Any CSS colour, the literal `"accent"` for the theme accent, or the name
   * of a custom property starting with `--`, which is wrapped in `var()`. */
  color?: "accent" | (string & {});
  /** Colour while the pointer is over the button; same forms as `color`. */
  hoverColor?: "accent" | (string & {});
  /** Colour while the button is held down; same forms as `color`. */
  clickColor?: "accent" | (string & {});
  /** Size of the button on both axes. A number is pixels; the `InputSize`
   * members all resolve to 15px; any other string is used as a CSS length.
   * @default 20 */
  size?: number | IconSize | InputSize;
  /** Colours the icon by filling its shapes. Turn it off for an outline icon
   * and use `isStroke` instead.
   * @default true */
  isFill?: boolean;
  /** Colours the icon by stroking its paths, which wins over `isFill`.
   * @default false */
  isStroke?: boolean;
  /** Greys the icon and stops every handler, including the hover and click
   * icon swaps. It sets `aria-disabled`, not the `disabled` property — there is
   * no button element to carry one.
   * @default false */
  isDisabled?: boolean;
  /** Shows the pointer cursor without an `onClick`, for a button whose click is
   * handled by an ancestor.
   * @default false */
  isClickable?: boolean;
  /** The icon as JSX, rendered inline. Preferred over `iconName`: it needs no
   * network request and is typed by your own bundler. */
  iconNode?: React.ReactNode;
  /** **A URL, not an asset name.** It is handed to `react-svg` as `src`, which
   * fetches it at runtime and inlines the response, so it has to resolve from
   * the browser — an imported `?url`, or a path under your public directory.
   * Ignored when `iconNode` is set. */
  iconName?: string;
  /** URL of the icon swapped in while the pointer is over the button, on a
   * device that has a pointer. */
  iconHoverName?: string;
  /** URL of the icon swapped in while the button is held down. */
  iconClickName?: string;
  /** Sets a button callback function triggered when the button is clicked */
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  /** Sets a button callback function triggered when the cursor enters the area */
  onMouseEnter?: (e: React.MouseEvent) => void;
  /** Sets a button callback function triggered when the cursor moves down */
  onMouseDown?: (e: React.MouseEvent<HTMLDivElement>) => void;
  /** Called when a mouse button is released over the icon — but only for the
   * middle and right buttons, which is a defect in the component rather than a
   * design. Use `onClick` for the left button. */
  onMouseUp?: (e: React.MouseEvent<HTMLDivElement>) => void;
  /** Sets a button callback function triggered when the cursor leaves the icon */
  onMouseLeave?: (e: React.MouseEvent) => void;
  /** Sets component id */
  id?: string;
  /** Accepts css style */
  style?: React.CSSProperties;
  /** Value of the legacy `data-tip` attribute, read by an older tooltip
   * implementation. Use `tooltipId` with `tooltipContent`, or `title`.
   * @default "" */
  dataTip?: string;
  /** Tooltip text. Consumed by the tooltip container this component renders,
   * so it never reaches the DOM as a `title` attribute. */
  title?: string;
  /** Value of `data-testid` on the button.
   * @default "icon-button" */
  dataTestId?: string;

  /** Anchor id for a tooltip. Together with `tooltipContent` it makes the
   * component render its own `Tooltip`, placed below the button. */
  tooltipId?: string;
  /** Text of that tooltip. Without `tooltipId` it does nothing. */
  tooltipContent?: string;

  /** Applied to the element, which is a `<div>`: without this the button is
   * not reachable by keyboard at all. */
  tabIndex?: number;
  /** Called on a key press. The element is a `<div>` with no button role, so
   * Enter and Space do nothing unless this handler implements them. */
  onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
};
