import type { TDirectionX, TDirectionY } from "../../types";
import type { ContextMenuModel } from "../context-menu";
import type { ContextMenuButtonDisplayType } from "./ContextMenuButton.enums";

export interface ContextMenuButtonProps {
  /** Opens the menu from outside. Changing it opens or closes the menu. */
  opened?: boolean;
  /** Items of the menu, used when there is no `getData`. */
  data?: ContextMenuModel[];
  /**
   * Builds the items each time the menu opens. When it is set, `data` is not
   * used.
   */
  getData?: () => ContextMenuModel[];
  /**
   * Accessible name of the button, and its hover tooltip, which needs
   * `RootTooltip` mounted.
   */
  title?: string;
  /** URL of the icon, fetched at runtime. Without it the kit's vertical dots are drawn. */
  iconName?: string;
  /** Size of the icon in pixels.
   * @default 16 */
  size?: number;
  /** Any CSS colour for the icon, or the literal `"accent"`. */
  color?: string;
  /** Greys the icon out and stops the menu opening. */
  isDisabled?: boolean;
  /** Colour of the icon while the pointer is over it. */
  hoverColor?: string;
  /** Colour of the icon while it is held down. */
  clickColor?: string;
  /** URL of the icon shown while the pointer is over the button. */
  iconHoverName?: string;
  /** URL of the icon shown while the button is held down. */
  iconClickName?: string;
  /** URL of the icon shown while the menu is open. */
  iconOpenName?: string;
  /** Called when the pointer enters the icon. */
  onMouseEnter?: (e: React.MouseEvent) => void;
  /** Called when the pointer leaves the icon. */
  onMouseLeave?: (e: React.MouseEvent) => void;
  /** Called when the pointer moves onto the icon or one of its children. */
  onMouseOver?: (e: React.MouseEvent) => void;
  /** Called when the pointer moves off the icon or one of its children. */
  onMouseOut?: (e: React.MouseEvent) => void;
  /**
   * Called when the button opens the menu in `dropdown` mode (not when it
   * closes it), and instead of opening anything in `toggle` mode, where it is
   * how you render a menu of your own. Opened with Enter or Space, it receives
   * the keyboard event.
   */
  onClick?: (e: React.MouseEvent) => void;
  /** Preferred horizontal side of the menu.
   * @default "left" */
  directionX?: TDirectionX;
  /** Preferred vertical side of the menu. */
  directionY?: TDirectionY;
  /** Keeps those directions as given instead of flipping them to fit. */
  fixedDirection?: boolean;
  /** Applied to the wrapper around the icon and the menu. */
  className?: string;
  /** Applied to that wrapper. */
  id?: string;
  /** Applied to that wrapper. */
  style?: React.CSSProperties;
  /**
   * Ignored. It reaches the menu, which does not read it either.
   * @deprecated Has no effect.
   */
  columnCount?: number;
  /**
   * `toggle` renders no menu of its own and leaves `onClick` to open one;
   * `auto` behaves exactly like `dropdown`.
   * @default ContextMenuButtonDisplayType.dropdown
   */
  displayType?: ContextMenuButtonDisplayType;
  /** Called when the menu closes by itself: a click outside, Escape or Tab. */
  onClose?: () => void;
  /** Whether the menu is rendered in a portal on `document.body`.
   * @default true */
  usePortal?: boolean;
  /** Applied to the menu element. */
  dropDownClassName?: string;
  /** Applied to the icon. */
  iconClassName?: string;
  /**
   * Puts the icon in a 32px square box with rounded corners. The box draws no
   * line unless `--cmb-border` supplies a width and style, such as `1px solid`.
   */
  displayIconBorder?: boolean;
  /** Colours the icon by filling its shapes rather than stroking them.
   * @default true */
  isFill?: boolean;
  /** Stacking order of the menu. */
  zIndex?: number;
  /**
   * Ignored. Nothing reads this prop.
   * @deprecated Has no effect.
   */
  asideHeader?: React.ReactNode;
  /** Value of `data-testid` on the wrapper.
   * @default "context-menu-button" */
  testId?: string;
}
