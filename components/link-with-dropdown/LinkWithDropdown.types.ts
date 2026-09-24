import { ContextMenuModel } from "../context-menu";
import { type TDirectionX, TDirectionY } from "../../types";

export type TDropdownType = "alwaysDashed" | "appearDashedAfterHover";

export type SimpleLinkWithDropdownProps = {
  /** Whether the text is bold. */
  isBold?: boolean;
  /** Font size of the text, as a CSS length. */
  fontSize?: string;
  /** Font weight of the text. */
  fontWeight?: number;
  /** Whether the text is truncated with an ellipsis at 200px instead of wrapping. */
  isTextOverflow?: boolean;
  /** Ignored. Nothing reads this prop; the hover state comes from CSS. */
  isHovered?: boolean;
  /** Whether the link is drawn at half opacity, the portal's "pending" look. */
  isSemitransparent?: boolean;
  /** CSS colour of the text. */
  color?: string;
  /** `title` attribute of the text — the browser's own tooltip for a truncated label. */
  title?: string;
  /** Whether the link is inert: it greys out and clicking no longer opens the menu. */
  isDisabled?: boolean;
  /** Whether the dashed underline is always drawn or appears on hover. */
  dropdownType?: TDropdownType;
  /** Entries of the menu. Each is a `DropDownItem`'s props; `key` is required, and `onClick` is called with the event. */
  data?: ContextMenuModel[];
  /** Text of the link. */
  children?: React.ReactNode;
};

export type LinkWithDropDownProps = SimpleLinkWithDropdownProps & {
  /** Whether a chevron is drawn after the text, which turns over while the menu is open. */
  withExpander?: boolean;
  /** Whether the menu starts open. The component then keeps that state itself; changing this prop re-syncs it. */
  isOpen?: boolean;
  /** Applied to the outermost element, and to the link inside it. */
  className?: string;
  /** Applied to the menu. */
  dropDownClassName?: string;
  /** Applied to the outermost element. */
  id?: string;
  /** Applied to the outermost element as inline style. */
  style?: React.CSSProperties;
  /** Which side of the link the menu is aligned to. Passed straight to `DropDown`, which defaults to `"right"`. */
  directionX?: TDirectionX;
  /** Whether the menu opens above or below the link. Passed straight to `DropDown`, which defaults to `"bottom"`. */
  directionY?: TDirectionY;
  /** Whether the menu is wrapped in a scrollbar of its own. It only takes effect on a phone. */
  hasScroll?: boolean;
  /** Exact width of the menu, as a CSS length. Without it the menu is as wide as its widest entry. */
  manualWidth?: string;
  /** Passed to the menu's backdrop, which then keeps an aside panel above itself. */
  isAside?: boolean;
  /** Passed to the menu's backdrop: makes it transparent. */
  withoutBackground?: boolean;
  /** Whether the menu keeps `directionX` and `directionY` even when it does not fit there. */
  fixedDirection?: boolean;
  /** Whether the menu is rendered in a portal on `document.body`. Turn it off to render it in place. */
  isDefaultMode?: boolean;
  /** (`withDynamicScrollbar` only) Space to leave above the menu, in pixels. */
  topSpace?: number;
  /** (`withDynamicScrollbar` only) Space to leave below the menu, in pixels. */
  bottomSpace?: number;
  /** Whether the menu measures the room around the link on every open and scrolls inside what is left. */
  withDynamicScrollbar?: boolean;
};
