import type { IconSizeType as IconSize } from "../../utils/common-icons-style";
import type { InputSize } from "../text-input";
export type { IconSize };

export type IconButtonProps = {
  /** Class added to the button element. */
  className?: string;
  /** Colour of the icon: any CSS colour, `"accent"` for the theme accent, or a
   * custom property name starting with `--`. */
  color?: "accent" | (string & {});
  /** Colour of the icon while the pointer is over the button; same forms as
   * `color`. */
  hoverColor?: "accent" | (string & {});
  /** Colour of the icon from the press until the pointer leaves the button;
   * same forms as `color`. */
  clickColor?: "accent" | (string & {});
  /** Width and height of the button. A number is pixels; `extraSmall`,
   * `small`, `medium` and `big` are 8, 12, 16 and 24px, and `scale` fills the
   * container. `base`, `middle` and `large` are 15px; another string is a CSS
   * length. */
  size?: number | IconSize | InputSize;
  /** Colours the icon by filling its shapes; off, the icon keeps the fill it
   * was drawn with. `isStroke` turns it off.
   * @default true */
  isFill?: boolean;
  /** Colours the outlines of the icon's shapes instead of their fill, for an
   * outline icon.
   * @default false */
  isStroke?: boolean;
  /** Stops every handler and the hover and press swaps, and sets
   * `aria-disabled`. The icon keeps its colour; only the cursor changes.
   * @default false */
  isDisabled?: boolean;
  /** Shows the pointer cursor without an `onClick`, for a button whose click is
   * handled by an ancestor.
   * @default false */
  isClickable?: boolean;
  /** The icon as JSX, rendered inline with no network request. Wins over
   * `iconName`. */
  iconNode?: React.ReactNode;
  /** URL of the icon, fetched at runtime and inlined as SVG. It has to resolve
   * from the browser: an imported `?url`, or a path under your public
   * directory. */
  iconName?: string;
  /** URL of the icon shown while the pointer is over the button; ignored on a
   * touch device. */
  iconHoverName?: string;
  /** URL of the icon shown from the press until the pointer leaves the button;
   * ignored on a touch device. */
  iconClickName?: string;
  /** Called when the button is clicked, or activated with Enter or Space,
   * unless it is disabled. */
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  /** Called when the pointer enters the button, unless it is disabled. */
  onMouseEnter?: (e: React.MouseEvent) => void;
  /** Called when a mouse button is pressed on the button, unless it is
   * disabled. */
  onMouseDown?: (e: React.MouseEvent<HTMLDivElement>) => void;
  /** Called when the middle or right mouse button is released, never the left
   * one. Use `onClick` for the left button. */
  onMouseUp?: (e: React.MouseEvent<HTMLDivElement>) => void;
  /** Called when the pointer leaves the button, unless it is disabled. */
  onMouseLeave?: (e: React.MouseEvent) => void;
  /** Id of the button element. */
  id?: string;
  /** Inline style of the button element, applied after the size and colours
   * the component sets. */
  style?: React.CSSProperties;
  /** Value of the legacy `data-tip` attribute. Use `tooltipId` with
   * `tooltipContent`, or `title`.
   * @default "" */
  dataTip?: string;
  /** Text of the shared tooltip shown on hover. It becomes a native `title`
   * attribute only under `NODE_ENV=test`. */
  title?: string;
  /** Value of `data-testid` on the button.
   * @default "icon-button" */
  dataTestId?: string;

  /** Id of a tooltip the button renders itself, below it; needs
   * `tooltipContent`. */
  tooltipId?: string;
  /** Text of that tooltip; does nothing without `tooltipId`. */
  tooltipContent?: string;

  /** Tab order of the button. Passing it switches off the built-in keyboard
   * support that an enabled button with `onClick` gets. */
  tabIndex?: number;
  /** Called on a key press. Passing it replaces the built-in Enter and Space
   * activation, so it has to implement them. */
  onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  /** ARIA role of the element. Unset, it is `"button"` while the built-in
   * keyboard support applies, and none otherwise. */
  role?: React.AriaRole;
  /** Accessible name of the button. Unset, a button with the built-in keyboard
   * support is named by `title`. */
  ariaLabel?: string;
};
