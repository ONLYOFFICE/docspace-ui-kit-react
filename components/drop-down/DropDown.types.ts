import type { JSX } from "react";
import type { TDirectionX, TDirectionY } from "../../types";

export interface DropDownProps {
  /**
   * Items of the menu, normally `DropDownItem`s. With `maxHeight` set they are
   * virtualised, so each child's height is read from its `height` prop rather
   * than measured.
   */
  children?: React.ReactNode;
  /** Applied to the dropdown element. */
  className?: string;
  /**
   * Called when a click lands outside the dropdown, and by the backdrop.
   * The second argument is the state being asked for — the negation of `open`,
   * not the current value.
   */
  clickOutsideAction?: (e: Event, open: boolean) => void;
  /** Ignored. Nothing reads this prop. */
  disableOnClickOutside?: boolean;
  /** Called once each time the dropdown opens. */
  enableOnClickOutside?: () => void;
  /** Sets the opening direction relative to the parent */
  directionX?: TDirectionX;
  /** Sets the opening direction relative to the parent */
  directionY?: TDirectionY;
  /** Ignored. Nothing reads this prop and no `id` reaches the DOM. */
  id?: string;
  /** Required for specifying the exact width of the component; for example; 100% */
  manualWidth?: string;
  /** (Non portal only) Required for specifying the exact distance from the parent component */
  manualX?: string;
  /** (Non portal only) Required for specifying the exact distance from the parent component */
  manualY?: string;
  /**
   * Height of the list in pixels. It is also the switch that turns on
   * virtualisation, the scrollbar and the arrow keys: without it every child is
   * rendered as given and none of the three happens.
   */
  maxHeight?: number;
  /**
   * Whether the menu is shown. The element stays in the DOM either way — it is
   * `display: none` until this is true.
   */
  open?: boolean;
  /** Merged into the dropdown element's inline style. */
  style?: React.CSSProperties;
  /**
   * Whether a `Backdrop` is rendered behind the menu to catch the next click.
   * @default true
   */
  withBackdrop?: boolean;
  /** Ignored. Nothing reads this prop. */
  columnCount?: number;
  /**
   * Keeps children whose `disabled` prop is true in the list. They are dropped
   * by default, together with a separator that ends up first or last.
   * @default false
   */
  showDisabledItems?: boolean;
  /**
   * Ref of the element the menu belongs to. In the default portal mode it is
   * what the menu is measured and positioned against; without it the menu falls
   * back to the corner of the viewport.
   */
  forwardedRef?: React.RefObject<HTMLElement | null>;
  /**
   * Whether the menu is rendered in a portal on `document.body`, positioned by
   * measuring `forwardedRef`. Turn it off to render it in place, absolutely
   * positioned inside the nearest positioned ancestor.
   * @default true
   */
  isDefaultMode?: boolean;
  /**
   * Keeps `directionX` and `directionY` exactly as given instead of flipping
   * them to fit the viewport.
   * @default false
   */
  fixedDirection?: boolean;
  /** Ignored. Nothing reads this prop. */
  withBlur?: boolean;
  /** (Portal only) Specifies the horizontal offset */
  offsetX?: number;
  /** Value of `data-testid` on the dropdown.
   * @default "dropdown" */
  dataTestId?: string;

  /** Pins the menu to the bottom edge of the screen, full width, in portrait. */
  isMobileView?: boolean;
  /**
   * Renders the children in a plain scrollbar instead of the virtualised list,
   * for items whose height is not the 32px the list assumes.
   */
  isNoFixedHeightOptions?: boolean;
  /** Disables scrollbar inline padding to allow hover styles to extend to edge */
  disableScrollbarPadding?: boolean;
  /** Use flexible maxHeight instead of fixed height for scrollbar (allows shrinking when fewer items) */
  useFlexibleHeight?: boolean;
  /**
   * Whether the arrow keys move through the items and Enter clicks one. It is
   * read only when `maxHeight` is set, and while it is on every key press in
   * the document has its default action prevented.
   * @default true
   */
  enableKeyboardEvents?: boolean;
  /** Element the portal renders into, instead of `document.body`. */
  appendTo?: HTMLElement;
  /** Passed to the backdrop, which then keeps an aside panel above itself. */
  isAside?: boolean;
  /** Passed to the backdrop: gives it the dimming background. */
  withBackground?: boolean;
  /**
   * DOM event names listened for on `window` to detect a click outside. Nothing
   * is listened for when it is absent; the backdrop is the usual mechanism.
   */
  eventTypes?: string[] | string;
  /** Stops the outside-click listeners being registered at all. */
  forceCloseClickOutside?: boolean;
  /** Passed to the backdrop: makes it transparent. */
  withoutBackground?: boolean;
  /** Stacking order of the menu, written as `--z-index`. The default is 400. */
  zIndex?: number;
  /** (`withDynamicScrollbar` only) Space to leave above the menu, in pixels. */
  topSpace?: number;
  /** (`withDynamicScrollbar` only) Space to leave below the menu, in pixels. */
  bottomSpace?: number;
  /**
   * Measures the room around the anchor on every open and caps the menu at what
   * is left, scrolling the rest. It replaces the virtualised list with a plain
   * scrollbar.
   */
  withDynamicScrollbar?: boolean;
  /**
   * Moves the backdrop inside the portal, above the page at z-index 400 rather
   * than below the menu at 199.
   * @default false
   */
  usePortalBackdrop?: boolean;
  /** The backdrop element itself. It is built from `withBackdrop`; passing your own replaces it. */
  backDrop?: JSX.Element | null;
  /** Passed to the backdrop: makes it render even when it would stay invisible. */
  shouldShowBackdrop?: boolean;
}

export interface VirtualListProps {
  /** Width of the list */
  width: number;
  /** Whether the dropdown is open */
  isOpen: boolean;
  /** Number of items in the list */
  itemCount: number;
  /** Maximum height of the list */
  maxHeight?: number;
  /** Calculated height based on items and maxHeight */
  calculatedHeight: number;
  /** Whether to use fixed height options */
  isNoFixedHeightOptions: boolean;
  /** Disables scrollbar inline padding to allow hover styles to extend to edge */
  disableScrollbarPadding?: boolean;
  /** Use flexible maxHeight instead of fixed height for scrollbar */
  useFlexibleHeight?: boolean;
  /** Clean children elements */
  cleanChildren?: React.ReactNode;
  /** Children elements */
  children: React.ReactElement | React.ReactNode;
  /** Row component */
  Row: React.MemoExoticComponent<
    ({ data, index, style }: RowProps) => JSX.Element
  >;
  /** Whether to enable keyboard events */
  enableKeyboardEvents: boolean;
  /** Function to get item size */
  getItemSize: (index: number) => number;
}

export interface RowProps {
  /** Row data */
  data: {
    /** Children elements */
    children?: React.ReactNode;
    /** Currently active index */
    activeIndex?: number;
    /** Currently selected index */
    activedescendant?: number;
    /** Mouse move handler */
    handleMouseMove?: (index: number) => void;
  };
  /** Row index */
  index: number;
  /** Row style */
  style: React.CSSProperties;
}
