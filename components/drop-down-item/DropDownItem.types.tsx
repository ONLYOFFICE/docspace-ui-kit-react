export type DropDownItemProps = {
  // Display and Layout Props
  /** Whether to render the item as a separator line instead of content */
  isSeparator?: boolean;
  /** Whether to render the item as a header with special styling */
  isHeader?: boolean;
  /**
   * Height the enclosing `DropDown` reserves for this item in its virtualised
   * list, in pixels. It does not style the item — the row is 32px tall until
   * you also set `--drop-down-item-height` — and it reaches the DOM as an
   * attribute.
   */
  height?: number;
  /** The same, used instead of `height` on a tablet-width viewport. */
  heightTablet?: number;
  /** Whether to use modern compact styling with minimal padding */
  isModern?: boolean;
  /** Whether text content should be truncated with ellipsis when it overflows */
  textOverflow?: boolean;
  /** Whether to apply additional text truncation styling to the label */
  truncateText?: boolean;

  // Icon Related Props
  /**
   * Icon at the start of the item. A component or element is rendered as given;
   * a string is a URL — a path containing `.svg` or `images/` is fetched and
   * inlined, anything else becomes an `<img>`.
   */
  icon?: string | React.ReactElement | React.ElementType;
  /** Whether the icon should be filled with the current text color. If false, uses original icon colors */
  fillIcon?: boolean;
  /** Whether to hide the icon element even when an icon prop is provided */
  withoutIcon?: boolean;
  /** Whether to show a back arrow icon when item is a header */
  withHeaderArrow?: boolean;
  /** Callback function triggered when the header's back arrow is clicked */
  headerArrowAction?: () => void;

  // Content Props
  /** Primary text content or React node to display in the item */
  label?: string | React.ReactNode;
  /**
   * Content of the item, used **instead of** `label` — it is rendered only when
   * `label` is empty, not alongside it. `additionalElement` is the one that
   * comes after the label.
   */
  children?: React.ReactNode;
  /** Additional element to render at the end of the item, after all other content */
  additionalElement?: React.ReactNode;

  // State and Interaction Props
  /**
   * Stops `onClick` firing and greys the item out. The enclosing `DropDown`
   * also drops disabled items from its list unless `showDisabledItems` is set.
   */
  disabled?: boolean;
  /** Whether the item is in an active/pressed state */
  isActive?: boolean;
  /** Whether the item is currently selected in a menu context */
  isSelected?: boolean;
  /** Whether the item is the current active descendant for keyboard navigation */
  isActiveDescendant?: boolean;
  /** Whether to disable the hover state styling */
  noHover?: boolean;
  /** Whether to disable the active/pressed state styling */
  noActive?: boolean;
  /** Whether this item opens a submenu when clicked */
  isSubMenu?: boolean;
  /** Whether to show a beta badge next to the item */
  isBeta?: boolean;
  /** Whether to show a paid badge next to the item */
  isPaidBadge?: boolean;
  /** Text of the paid badge, used instead of the translated default. */
  badgeLabel?: string;
  /** Whether to show an external link icon at the end of the item */
  withExternalLink?: boolean;
  /** URL to navigate to when the external link icon is clicked */
  externalLinkPath?: string;
  /** Callback triggered when the external link icon is clicked */
  onExternalLinkClick?: () => void;

  // Toggle Props
  /** Whether to show a toggle switch at the end of the item */
  withToggle?: boolean;
  /** Whether the toggle switch is in a checked state */
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
  /** Callback function triggered on mouse down */
  onMouseDown?: (e: React.MouseEvent<HTMLElement>) => void;
  /** Callback function triggered when a selected item is clicked */
  onClickSelectedItem?: () => void;
  /**
   * Called with `false` after every click, disabled ones included, for the
   * enclosing menu to close itself.
   */
  setOpen?: (open: boolean) => void;

  // Styling Props
  /** CSS class name to apply to the root element for custom styling */
  className?: string;
  /** Inline CSS styles to apply to the root element */
  style?: React.CSSProperties;
  /** HTML ID attribute for the root element */
  id?: string;
  /** Position in the tab order. The default of -1 keeps the item off it.
   * @default -1 */
  tabIndex?: number;
  /** Sets minimum width for the root element */
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
  /** Secondary line rendered under the item label and always visible - what
   * choosing this item means. The item grows to fit it. */
  description?: React.ReactNode;

  /** Text of the beta badge, used instead of the host's own constant. */
  betaLabel?: string;
  /** Text of the paid badge, used instead of the translated default. */
  paidLabel?: string;

  /** When true, stops mousedown propagation to prevent click-outside detection from closing dropdown before click fires */
  stopMouseDownPropagation?: boolean;
};
