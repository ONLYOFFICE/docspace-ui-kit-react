import type { TDirectionX, TDirectionY } from "../../types";
import type { ContextMenuModel } from "../context-menu";
import type { ContextMenuButtonDisplayType } from "./ContextMenuButton.enums";

export interface ContextMenuButtonProps extends React.AriaAttributes {
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
   * `RootTooltip` mounted. Without it the button is named by the translated
   * `Common:MoreOptions` and shows no tooltip.
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
   * Called when the button opens its menu, not when it closes it. In `toggle`
   * mode it replaces the menu, so you can open your own. A key press arrives as
   * a click at the button's lower start corner.
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
   * `toggle` renders no menu of its own and leaves `onClick` to open one;
   * `auto` behaves exactly like `dropdown`.
   * @default ContextMenuButtonDisplayType.dropdown
   */
  displayType?: ContextMenuButtonDisplayType;
  /** Called whenever the open menu closes: a click outside, Escape, Tab, a second click on the button or a chosen item. Pairs with `onClick`, which reports the opening. */
  onClose?: () => void;
  /** Renders the menu on `document.body`, where no ancestor clips it; `false`
   * renders it beside the button.
   * @default true */
  usePortal?: boolean;
  /** Class added to the menu's element, for styling the open menu. */
  dropDownClassName?: string;
  /** Class added to the icon button inside the wrapper. */
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
  /** Value of `data-testid` on the wrapper.
   * @default "context-menu-button" */
  testId?: string;
}
