import type { TDirectionX, TDirectionY } from "../../types";
import type { ContextMenuModel } from "../context-menu";
import type { ContextMenuButtonDisplayType } from "./ContextMenuButton.enums";

export interface ContextMenuButtonProps {
  /** Opens the menu from outside. Changing it opens or closes the menu. */
  opened?: boolean;
  /**
   * Items of the menu, read **once** to seed the internal state. Every later
   * change is ignored — `getData` is what the open menu is built from.
   */
  data?: ContextMenuModel[];
  /**
   * Builds the items when the button is clicked. It is not optional in
   * practice: the click handler calls it without checking, so a button without
   * it throws on the first click.
   */
  getData?: () => ContextMenuModel[];
  /** Hover tooltip of the icon. It needs `RootTooltip` mounted. */
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
  /** Called on **mouse down** on the icon, despite the name. */
  onMouseOver?: (e: React.MouseEvent) => void;
  /** Called on **mouse up** on the icon, despite the name, and only for the middle and right buttons. */
  onMouseOut?: (e: React.MouseEvent) => void;
  /**
   * Called on a click — after the menu has opened in `dropdown` mode, and
   * instead of opening anything in `toggle` mode, where it is how you render a
   * menu of your own.
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
  /** Ignored. It reaches the menu, which does not read it either. */
  columnCount?: number;
  /**
   * `toggle` renders no menu of its own and leaves `onClick` to open one;
   * `auto` behaves exactly like `dropdown`.
   * @default ContextMenuButtonDisplayType.dropdown
   */
  displayType?: ContextMenuButtonDisplayType;
  /** Called when the menu closes by itself, after a click outside. */
  onClose?: () => void;
  /** Whether the menu is rendered in a portal on `document.body`.
   * @default true */
  usePortal?: boolean;
  /** Applied to the menu element. */
  dropDownClassName?: string;
  /** Applied to the icon. */
  iconClassName?: string;
  /** Draws a rounded border around the icon, 32px square. */
  displayIconBorder?: boolean;
  /** Colours the icon by filling its shapes rather than stroking them.
   * @default true */
  isFill?: boolean;
  /** Stacking order of the menu. */
  zIndex?: number;
  /** Ignored. Nothing reads this prop. */
  asideHeader?: React.ReactNode;
  /** Value of `data-testid` on the wrapper.
   * @default "context-menu-button" */
  testId?: string;
}
