export type DropDownItemProps = {
  // Display and Layout Props
  /** Renders a divider line in place of the label and children. */
  isSeparator?: boolean;
  /** Renders the row as a menu title: taller, with a line under it and no
   * hover or pressed look. */
  isHeader?: boolean;
  /**
   * Height the enclosing `DropDown` reserves for this item in its virtualised
   * list, in pixels. It does not resize the row, and it reaches the DOM as an
   * attribute.
   */
  height?: number;
  /** The same, used instead of `height` on a tablet-width viewport. Unlike `height`, it stays off the DOM. */
  heightTablet?: number;
  /** Narrows the row's side padding to 8px. */
  isModern?: boolean;
  /** Makes the row a block instead of a flex row, so its own ellipsis applies
   * to a long label. */
  textOverflow?: boolean;
  /** Cuts a long label off with an ellipsis, keeping the rest of the row in
   * place. */
  truncateText?: boolean;

  // Icon Related Props
  /**
   * Icon at the start of the item: a component, an element or a URL. A same-origin `.svg`
   * or an SVG data URL is inlined; any other URL becomes an `<img>`.
   */
  icon?: string | React.ReactElement | React.ElementType;
  /** Paints an inlined SVG icon in the item's icon colour. Off, it keeps its
   * own colours. */
  fillIcon?: boolean;
  /** Hides the icon even when `icon` is set. */
  withoutIcon?: boolean;
  /** Puts a back arrow before a header's title. It does nothing without
   * `isHeader`. */
  withHeaderArrow?: boolean;
  /** Called by a click on the header's back arrow, before the row's own
   * click handling. */
  headerArrowAction?: () => void;

  // Content Props
  /** Text of the row. A string also becomes the row's hover tooltip. */
  label?: string | React.ReactNode;
  /**
   * Content of the item, used **instead of** `label` — it is rendered only when
   * `label` is empty, not alongside it. `additionalElement` is the one that
   * comes after the label.
   */
  children?: React.ReactNode;
  /** Node at the end of the row, after the badges and the external link. */
  additionalElement?: React.ReactNode;

  // State and Interaction Props
  /**
   * Stops `onClick` firing and greys the item out. The enclosing `DropDown`
   * also drops disabled items from its list unless `showDisabledItems` is set.
   */
  disabled?: boolean;
  /** Paints the selected background. On a submenu row it also turns the
   * arrow down. */
  isActive?: boolean;
  /** Sets `aria-selected` and sends clicks to `onClickSelectedItem`. It
   * paints the background only on a disabled item. */
  isSelected?: boolean;
  /** Highlights the row the arrow keys reached, with a ring and the hover
   * background. */
  isActiveDescendant?: boolean;
  /** Turns off the background on hover. */
  noHover?: boolean;
  /** Turns off the background while the row is pressed. */
  noActive?: boolean;
  /** Draws a trailing arrow for a row that leads to a submenu. It opens
   * nothing by itself. */
  isSubMenu?: boolean;
  /** Shows a purple beta badge after the label. */
  isBeta?: boolean;
  /** Shows a paid-plan badge after the label. */
  isPaidBadge?: boolean;
  /** Text of the paid badge. It wins over `paidLabel` and the translated
   * default. */
  badgeLabel?: string;
  /** Shows an external-link icon at the end of the row. It needs
   * `externalLinkPath` as well. */
  withExternalLink?: boolean;
  /** Address of the external-link icon. It becomes the icon's `href` only
   * together with `onExternalLinkClick`. */
  externalLinkPath?: string;
  /** Called on a plain click of the external-link icon, in place of following
   * the `href`. A middle or modified click is left to the browser. */
  onExternalLinkClick?: () => void;
  /** Accessible name of the external link icon. Defaults to the translated "Open" followed by `label`. */
  externalLinkLabel?: string;

  // Toggle Props
  /** Shows a switch at the end of the row; its change calls `onClick`. */
  withToggle?: boolean;
  /** Turns that switch on. It needs `withToggle`. */
  checked?: boolean;

  // Event Handlers
  /**
   * Called on a click on the item, and on a change of the toggle when
   * `withToggle` is set — hence the event union. It is not called while the
   * item is disabled.
   */
  onClick?: (
    e: React.MouseEvent<HTMLElement> | React.ChangeEvent<HTMLInputElement>,
  ) => void;
  /** Called on a mouse press on the row, before the click. */
  onMouseDown?: (e: React.MouseEvent<HTMLElement>) => void;
  /** Called on every click of an item marked `isSelected`, a disabled one
   * included. */
  onClickSelectedItem?: () => void;
  /**
   * Called with `false` after a click, a disabled item's included, for the
   * enclosing menu to close itself. A disabled item with `tooltip` on a touch
   * device skips it.
   */
  setOpen?: (open: boolean) => void;

  // Styling Props
  /** Extra class name for the row. */
  className?: string;
  /** Inline styles for the row. */
  style?: React.CSSProperties;
  /** HTML id of the row. */
  id?: string;
  /**
   * ARIA role of the item, matching the menu's: `option` in a listbox,
   * `menuitem` in a menu. A separator is always `separator`, and
   * `aria-selected` is only set on an `option`.
   * @default "option"
   */
  role?: "option" | "menuitem";
  /** Position in the tab order. The default of -1 keeps the item off it.
   * @default -1 */
  tabIndex?: number;
  /** Minimum width of the row, as a CSS length. */
  minWidth?: string;

  /** Value of `data-testid` on the item.
   * @default "drop-down-item" */
  testId?: string;

  /**
   * Hint shown when the item is disabled, on a touch device only. It needs
   * `RootTooltip` mounted, and it does nothing on an enabled item or with a
   * pointer.
   */
  tooltip?: string;
  /** Second line under the label, always visible: what choosing the item
   * means. It shows only with a `label`, and the row grows to fit it. */
  description?: React.ReactNode;

  /** Text of the beta badge, used instead of the host's own constant. */
  betaLabel?: string;
  /** Text of the paid badge, used instead of the translated default.
   * `badgeLabel` wins over it. */
  paidLabel?: string;

  /** Keeps a mouse press on the row from reaching the page, so a click-outside
   * handler does not close the menu before the click lands. */
  stopMouseDownPropagation?: boolean;
};
